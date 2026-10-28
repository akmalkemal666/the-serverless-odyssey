import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * proxy — Konvensi file resmi Next.js 16 (pengganti middleware.ts yang deprecated).
 *
 * Mendelegasikan seluruh logika session refresh & route protection ke
 * updateSession() dari src/utils/supabase/middleware.ts agar tetap
 * mengikuti prinsip Single Responsibility.
 *
 * Dokumentasi resmi: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

/**
 * Matcher dengan negative lookahead regex untuk mengecualikan:
 *  - _next/static  : aset statis (JS, CSS, font, dll.)
 *  - _next/image   : endpoint optimasi gambar
 *  - favicon.ico   : ikon browser
 *  - sitemap.xml   : peta situs SEO
 *  - robots.txt    : file robot crawler
 *  - Ekstensi file statis populer (png, jpg, jpeg, gif, webp, svg, ico, woff2)
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2)$).*)",
  ],
};
