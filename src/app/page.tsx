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
  Database,
  Server,
  Code2,
  Wifi,
  WifiOff,
  FolderOpen,
  CircleDot,
  CheckCheck,
  Clock,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import type { Tables, TaskStatus } from "@/types/database.types";

/* ─── SEO Metadata ────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "The Serverless Odyssey — CloudTask Pro",
  description:
    "Platform manajemen tugas serverless bertenaga Next.js 16, React 19, Supabase PostgreSQL, dan Vercel Edge. Kelola proyek cloud Anda dengan efisiensi tinggi.",
  openGraph: {
    title: "The Serverless Odyssey — CloudTask Pro",
    description:
      "Platform manajemen tugas serverless modern dengan validasi server-side, Server Actions, dan antarmuka premium.",
    type: "website",
  },
};

/* ─── Architecture Schema Data ────────────────────────────────── */

const SCHEMA_TABLES = [
  {
    name: "profiles",
    icon: Server,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    fields: ["id (UUID PK)", "username", "full_name", "avatar_url", "bio"],
    description: "Standalone — integrasi auth.users pada Minggu 5",
  },
  {
    name: "projects",
    icon: FolderOpen,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    fields: ["id (UUID PK)", "profile_id (FK)", "name", "status", "budget"],
    description: "FK profiles ON DELETE CASCADE",
  },
  {
    name: "tasks",
    icon: ClipboardList,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    fields: ["id (UUID PK)", "project_id (FK)", "title", "status", "priority"],
    description: "FK projects ON DELETE CASCADE",
  },
];

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

/* ─── Relational Query Shape ──────────────────────────────────── */

/**
 * Tipe eksplisit untuk hasil query relasional projects + tasks.
 * Diperlukan karena Supabase TypeScript SDK tidak bisa meng-infer
 * nested relation tanpa definisi relasi di Database type.
 */
type TaskPreview = Pick<Tables<"tasks">, "id" | "title" | "status">;

type ProjectWithTasks = Pick<
  Tables<"projects">,
  "id" | "title" | "description" | "budget"
> & {
  tasks: TaskPreview[];
};

/* ─── Helpers ─────────────────────────────────────────────────── */

const TASK_STATUS_ICON: Record<TaskStatus, typeof CircleDot> = {
  todo: Clock,
  in_progress: CircleDot,
  done: CheckCheck,
};

const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "text-zinc-400",
  in_progress: "text-amber-500",
  done: "text-emerald-500",
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "Berjalan",
  done: "Selesai",
};

function formatBudget(budget: number | null): string {
  if (budget === null) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(budget);
}

/* ─── Page (async RSC — data langsung dari Supabase) ─────────── */

export default async function HomePage() {
  const supabase = await createClient();

  // Ambil proyek beserta tasks-nya secara relasional.
  // Supabase SDK tidak bisa meng-infer tipe nested relation secara otomatis,
  // sehingga kita cast ke ProjectWithTasks[] untuk type-safety penuh.
  const { data: rawProjects, error: projectsError } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      description,
      budget,
      tasks (
        id,
        title,
        status
      )
    `
    )
    .order("created_at", { ascending: true });

  // Type assertion aman karena kolom yang di-select 100% cocok dengan ProjectWithTasks.
  const projects = (rawProjects ?? []) as unknown as ProjectWithTasks[];

  // Hitung metrik agregat
  const totalProjects = projects.length;
  const totalTasks = projects.reduce(
    (acc, p) => acc + (p.tasks?.length ?? 0),
    0
  );
  const doneTasks = projects.reduce(
    (acc, p) =>
      acc + (p.tasks?.filter((t: TaskPreview) => t.status === "done").length ?? 0),
    0
  );
  const inProgressTasks = projects.reduce(
    (acc, p) =>
      acc + (p.tasks?.filter((t: TaskPreview) => t.status === "in_progress").length ?? 0),
    0
  );

  const isConnected = !projectsError;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Section ── */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
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
              {/* Tech stack badge */}
              <Badge
                variant="outline"
                className="gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
              >
                <Rocket className="h-3 w-3" aria-hidden="true" />
                Next.js 16 · React 19 · Supabase · Zod
              </Badge>

              <h1
                id="hero-heading"
                className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
              >
                Kelola Proyek{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Serverless
                </span>{" "}
                dengan Presisi
              </h1>

              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                CloudTask Pro adalah platform manajemen proyek cloud-native
                bertenaga Server Actions, Zod validation, dan antarmuka premium
                yang adaptif terhadap Dark Mode — didukung Supabase PostgreSQL
                secara real-time.
              </p>

              {/* Supabase Connection Status Badge */}
              <div
                id="supabase-connection-status"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  isConnected
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
                role="status"
                aria-live="polite"
              >
                {isConnected ? (
                  <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {isConnected
                  ? "Supabase PostgreSQL — Terkoneksi"
                  : `Supabase — Tidak Terkoneksi: ${projectsError?.message ?? "Error tidak diketahui"}`}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  id="hero-cta-primary"
                  href="/tasks"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 font-semibold shadow-md"
                  )}
                >
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  Buka Dashboard Tugas
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  id="hero-cta-secondary"
                  href="/tasks"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 font-medium"
                  )}
                >
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  Lihat Semua Tugas
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-emerald-500"
                    aria-hidden="true"
                  />
                  Server-side validation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-emerald-500"
                    aria-hidden="true"
                  />
                  Zero API routes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-emerald-500"
                    aria-hidden="true"
                  />
                  Dark Mode ready
                </span>
              </div>
            </div>

            {/* Right: Metric Cards */}
            <div aria-label="Metrik proyek dari database" className="space-y-4">
              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      label: "Total Proyek",
                      value: totalProjects,
                      icon: FolderOpen,
                      color: "text-sky-500",
                      bg: "bg-sky-500/10",
                    },
                    {
                      label: "Total Tugas",
                      value: totalTasks,
                      icon: ClipboardList,
                      color: "text-violet-500",
                      bg: "bg-violet-500/10",
                    },
                    {
                      label: "Tugas Berjalan",
                      value: inProgressTasks,
                      icon: Zap,
                      color: "text-amber-500",
                      bg: "bg-amber-500/10",
                    },
                    {
                      label: "Tugas Selesai",
                      value: doneTasks,
                      icon: CheckCheck,
                      color: "text-emerald-500",
                      bg: "bg-emerald-500/10",
                    },
                  ] as const
                ).map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card
                      key={metric.label}
                      className="border-border/60 bg-card/80 backdrop-blur-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {metric.label}
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              {metric.value}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              metric.bg
                            )}
                          >
                            <Icon
                              className={cn("h-5 w-5", metric.color)}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Database source tag */}
              <p className="text-center text-[11px] text-muted-foreground/60">
                <Database className="mr-1 inline h-3 w-3" aria-hidden="true" />
                Data langsung dari Supabase PostgreSQL
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Schema Architecture Section ── */}
      <section
        aria-labelledby="schema-heading"
        className="border-t border-border bg-muted/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              id="schema-heading"
              className="text-2xl font-bold tracking-tight text-foreground"
            >
              Arsitektur Skema Database
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              3 tabel relasional dengan UUID v4, FK ON DELETE CASCADE, CHECK
              constraints, B-Tree indexes, dan trigger
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs font-mono">
                updated_at
              </code>
              otomatis.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SCHEMA_TABLES.map((table, index) => {
              const Icon = table.icon;
              return (
                <Card
                  key={table.name}
                  className={cn(
                    "group border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
                    table.border
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          table.bg
                        )}
                      >
                        <Icon
                          className={cn("h-5 w-5", table.color)}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <CardTitle className="font-mono text-sm font-bold text-foreground">
                          {table.name}
                        </CardTitle>
                        {index > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            Tabel {index + 1}/3
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1">
                      {table.fields.map((field) => (
                        <li
                          key={field}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <Code2
                            className="h-3 w-3 shrink-0 text-primary/50"
                            aria-hidden="true"
                          />
                          <code className="font-mono">{field}</code>
                        </li>
                      ))}
                    </ul>
                    <CardDescription className="text-[11px] leading-relaxed border-t border-border pt-2">
                      {table.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Live Projects Section ── */}
      <section
        aria-labelledby="projects-heading"
        className="border-t border-border"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="projects-heading"
                className="text-2xl font-bold tracking-tight text-foreground"
              >
                Proyek dari Database
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Data seed real — langsung dari Supabase PostgreSQL tanpa login.
              </p>
            </div>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              {totalProjects} Proyek
            </Badge>
          </div>

          {projects && projects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const tasks = project.tasks ?? [];
                const doneCount = tasks.filter((t) => t.status === "done").length;

                return (
                  <Card
                    key={project.id}
                    className="group flex flex-col border-border/60 bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold leading-snug text-foreground">
                        {project.title}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="mt-1 text-xs leading-relaxed line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                      {/* Tasks preview */}
                      {tasks.length > 0 ? (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                            Tasks ({doneCount}/{tasks.length} selesai)
                          </p>
                          {tasks.slice(0, 3).map((task) => {
                            const StatusIcon = TASK_STATUS_ICON[task.status];
                            return (
                              <div
                                key={task.id}
                                className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-1.5"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <StatusIcon
                                    className={cn(
                                      "h-3 w-3 shrink-0",
                                      TASK_STATUS_COLOR[task.status]
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate text-xs text-foreground/80">
                                    {task.title}
                                  </span>
                                </div>
                                <span
                                  className={cn(
                                    "shrink-0 text-[9px] font-semibold",
                                    TASK_STATUS_COLOR[task.status]
                                  )}
                                >
                                  {TASK_STATUS_LABEL[task.status]}
                                </span>
                              </div>
                            );
                          })}
                          {tasks.length > 3 && (
                            <p className="pl-1 text-[10px] text-muted-foreground/60">
                              +{tasks.length - 3} task lainnya…
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 italic">Belum ada task.</p>
                      )}

                      {/* Budget */}
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-[11px] text-muted-foreground">
                          Budget
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {formatBudget(project.budget)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
              <Database
                className="h-10 w-10 text-muted-foreground/40"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Belum ada data proyek.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Jalankan migration SQL di Supabase, lalu seed data akan muncul di sini.
              </p>
            </div>
          )}

          {/* CTA Row */}
          <div className="mt-10 flex justify-center">
            <Link
              id="projects-cta"
              href="/tasks"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 font-semibold shadow-md"
              )}
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Buka Dashboard Tugas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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
                      className={cn(
                        "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl",
                        feature.bg
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", feature.accent)}
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
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 font-semibold shadow-md"
              )}
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Buka Dashboard Tugas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
