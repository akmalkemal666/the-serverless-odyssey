import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Rocket,
  ClipboardList,
  CheckCircle2,
  Layers,
} from "lucide-react";

/* ─── SEO Metadata ────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "The Serverless Odyssey — CloudTask Pro",
  description:
    "Platform manajemen tugas serverless bertenaga Next.js 16, React 19, dan Supabase. Kelola proyek cloud Anda dengan efisiensi tinggi.",
  openGraph: {
    title: "The Serverless Odyssey — CloudTask Pro",
    description:
      "Platform manajemen tugas serverless modern dengan validasi server-side, Server Actions, dan antarmuka premium.",
    type: "website",
  },
};

/* ─── Feature Cards Data ──────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Server Actions",
    description:
      "Mutasi data langsung dari form dengan React 19 Server Actions — tanpa API Route, tanpa boilerplate.",
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Validasi Zod",
    description:
      "Setiap input divalidasi secara defensif di server menggunakan Zod schema dengan feedback error inline.",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    title: "Edge-Ready",
    description:
      "Dibangun di atas Next.js 16 App Router dengan RSC streaming, cache invalidation otomatis, dan dark mode.",
    accent: "text-sky-500",
    bg: "bg-sky-500/10",
  },
];

/* ─── Preview Task Items (static demo) ───────────────────────── */

const PREVIEW_TASKS = [
  { title: "Setup Supabase Auth", priority: "high", status: "Selesai", done: true },
  { title: "Integrasi Cloudinary API", priority: "medium", status: "Berjalan", done: false },
  { title: "Deploy ke Vercel Edge", priority: "low", status: "Tertunda", done: false },
];

const PRIORITY_PILL: Record<string, string> = {
  high: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

/* ─── Page ────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Section ── */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden"
      >
        {/* Gradient backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
              >
                <Rocket className="h-3 w-3" aria-hidden="true" />
                Next.js 16 · React 19 · Zod
              </Badge>

              <h1
                id="hero-heading"
                className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
              >
                Kelola Tugas{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Serverless
                </span>{" "}
                dengan Presisi
              </h1>

              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                CloudTask Pro adalah platform manajemen tugas cloud-native
                bertenaga Server Actions, Zod validation, dan antarmuka premium
                yang adaptif terhadap Dark Mode.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                id="hero-cta-primary"
                href="/tasks"
                className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold shadow-md")}
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Buka Form Pembuatan Tugas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
                <Link
                id="hero-cta-secondary"
                href="/tasks"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2 font-medium")}
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                Lihat Semua Tugas
              </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  Server-side validation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  Zero API routes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  Dark Mode ready
                </span>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="relative" aria-hidden="true">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 blur-xl" />

              <Card className="relative border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-foreground">
                        Buat Tugas Baru
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Preview modul mutasi data
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Fake form fields */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Judul Tugas</p>
                    <div className="h-9 w-full rounded-md border border-border bg-background/50 px-3 flex items-center">
                      <span className="text-xs text-muted-foreground/50">
                        cth. Deploy ke Vercel Edge…
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Prioritas</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Rendah", "Sedang", "Tinggi"].map((p, i) => (
                        <div
                          key={p}
                          className={`rounded-md border px-2 py-1.5 text-center text-xs font-medium ${
                            i === 1
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border pt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Tugas Aktif
                    </p>
                    {PREVIEW_TASKS.map((task) => (
                      <div
                        key={task.title}
                        className="flex items-center justify-between gap-2 rounded-md bg-accent/40 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              task.done ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="truncate text-xs text-foreground">
                            {task.title}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_PILL[task.priority]}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fake submit button */}
                  <div className="h-9 w-full rounded-md bg-primary/80 flex items-center justify-center gap-2">
                    <ClipboardList className="h-3.5 w-3.5 text-primary-foreground" />
                    <span className="text-xs font-semibold text-primary-foreground">
                      Buat Tugas
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section
        aria-labelledby="features-heading"
        className="border-t border-border bg-card/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              id="features-heading"
              className="text-2xl font-bold tracking-tight text-foreground"
            >
              Dibangun dengan Teknologi Terkini
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Arsitektur modular 5 berkas yang saling terintegrasi.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group border-border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <CardHeader className="pb-3">
                    <div
                      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${feature.accent}`}
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA row */}
          <div className="mt-12 flex justify-center">
          <Link
              id="features-cta"
              href="/tasks"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold shadow-md")}
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Buka Form Pembuatan Tugas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
