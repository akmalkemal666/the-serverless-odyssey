import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Gateway",
  description:
    "Gerbang autentikasi The Serverless Odyssey — fondasi keamanan Network Boundary aktif.",
};

/**
 * LoginPage — Server Component
 *
 * Tahap 1: Halaman status fondasi autentikasi.
 * - Jika user sudah login → redirect ke /dashboard
 * - Jika belum login → tampilkan kartu status proxy aktif
 *
 * Halaman ini akan diganti dengan form login penuh di Tahap 2.
 */
export default async function LoginPage() {
  const supabase = await createClient();

  // ⚠️  getUser() — bukan getSession() — untuk validasi JWT ke server Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect ke dashboard jika sudah terotentikasi
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg space-y-6">
        {/* ── Header ── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Authentication Gateway
          </h1>
          <p className="text-muted-foreground">
            The Serverless Odyssey — Fondasi Keamanan
          </p>
        </div>

        {/* ── Status Card ── */}
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  Network Boundary Proxy
                </CardTitle>
                <CardDescription>
                  Lapisan keamanan sisi server berhasil diinisialisasi
                </CardDescription>
              </div>
              <Badge
                variant="default"
                className="shrink-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              >
                <Zap className="w-3 h-3 mr-1" />
                Aktif
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status items */}
            <div className="space-y-3">
              <StatusItem
                icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                label="src/proxy.ts"
                description="Konvensi file Next.js 16 — menggantikan middleware.ts"
                status="Siap"
              />
              <StatusItem
                icon={<Lock className="w-4 h-4 text-emerald-500" />}
                label="Session Refresher"
                description="getUser() via @supabase/ssr dengan Dual-Cookie Sync"
                status="Siap"
              />
              <StatusItem
                icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                label="Route Protection"
                description="/dashboard → redirect /login?next=<path>"
                status="Aktif"
              />
              <StatusItem
                icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                label="PostgreSQL Trigger"
                description="handle_new_user() SECURITY DEFINER — profiles sync"
                status="Terapkan"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <Badge
                variant="outline"
                className="w-full justify-center py-2 text-sm font-medium gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Tahap 1: Proxy Refresher Siap
              </Badge>
            </div>

            {/* Next step hint */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                Langkah Berikutnya — Tahap 2:
              </p>
              <ul className="space-y-1">
                {[
                  "Implementasi Server Action login & register",
                  "Form autentikasi dengan validasi Zod",
                  "OAuth provider (Google, GitHub)",
                  "Protected API routes dengan RLS check",
                ].map((step) => (
                  <li
                    key={step}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-muted-foreground">
          Halaman ini adalah placeholder Tahap 1.{" "}
          <span className="font-medium text-foreground">
            Implementasikan form login di Tahap 2.
          </span>
        </p>
      </div>
    </main>
  );
}

/* ── Sub-component: StatusItem ── */
interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  status: string;
}

function StatusItem({ icon, label, description, status }: StatusItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium font-mono text-foreground leading-none">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge
        variant="secondary"
        className="shrink-0 text-xs"
      >
        {status}
      </Badge>
    </div>
  );
}
