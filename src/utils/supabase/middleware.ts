import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

/**
 * PRIVATE ROUTES — akses tanpa login → redirect ke /login?next=<path>
 */
const PRIVATE_ROUTE_PREFIXES = ["/dashboard", "/projects", "/tasks", "/settings"];

/**
 * PUBLIC-ONLY ROUTES — sudah login → redirect ke /dashboard
 */
const PUBLIC_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

function isPrivateRoute(pathname: string): boolean {
  return PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicOnlyRoute(pathname: string): boolean {
  return PUBLIC_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * updateSession — inti dari session refresh proxy.
 *
 * Dual-Cookie Synchronization:
 *  1. Baca cookies dari `request` (browser → server)
 *  2. Tulis cookies baru ke `request` (agar RSC / Server Components baca token terbaru)
 *  3. Tulis cookies baru ke `response` (agar browser menyimpan token baru via Set-Cookie)
 *
 * SECURITY: Hanya pakai `getUser()` — DILARANG `getSession()` karena tidak
 * memvalidasi JWT ke server Supabase dan rentan terhadap manipulasi cookie lokal.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // Mulai dengan response yang memforward request apa adanya
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[Proxy] NEXT_PUBLIC_SUPABASE_URL atau SUPABASE KEY tidak terdefinisi."
    );
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        // Baca semua cookies dari request yang masuk
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Langkah 1: Tulis ke request.cookies agar Server Components
        //            (yang di-render setelah proxy) menerima token terbaru
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        // Langkah 2: Rebuild response supaya mewarisi headers request terbaru
        supabaseResponse = NextResponse.next({ request });

        // Langkah 3: Tulis ke response.cookies agar browser menyimpan token baru
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // ⚠️  JANGAN panggil getSession() di sini — getUser() mevalidasi JWT ke server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect cerdas: rute privat tanpa autentikasi → login dengan ?next= param
  if (!user && isPrivateRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect cerdas: sudah login tapi mengakses halaman publik-saja → dashboard
  if (user && isPublicOnlyRoute(pathname)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
