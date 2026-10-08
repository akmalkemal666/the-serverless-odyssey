import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  ArrowUpRight,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Tugas",
  description: "Lihat, kelola, dan buat tugas serverless baru di CloudTask Pro.",
};

/* ─── Types ───────────────────────────────────────────────────── */

type TaskStatus = "running" | "completed" | "pending";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  assignee: string;
  priority: "low" | "medium" | "high";
}

/* ─── Static Data ─────────────────────────────────────────────── */

const TASKS: Task[] = [
  {
    id: "task-001",
    title: "Setup Supabase Auth dengan Google OAuth",
    description:
      "Konfigurasi autentikasi SSO menggunakan provider Google melalui Supabase Auth.",
    status: "completed",
    createdAt: "2026-09-20",
    assignee: "Akmal",
    priority: "high",
  },
  {
    id: "task-002",
    title: "Integrasi Cloudinary Upload API",
    description:
      "Implementasi endpoint upload gambar dengan transformasi otomatis WebP/AVIF.",
    status: "running",
    createdAt: "2026-09-22",
    assignee: "Akmal",
    priority: "medium",
  },
  {
    id: "task-003",
    title: "Desain Skema Database PostgreSQL",
    description:
      "Definisikan tabel tasks, users, dan tags beserta relasi dan RLS policy.",
    status: "running",
    createdAt: "2026-09-23",
    assignee: "Akmal",
    priority: "high",
  },
  {
    id: "task-004",
    title: "Deploy ke Vercel Edge Network",
    description:
      "Konfigurasi pipeline CI/CD dan variabel lingkungan production di Vercel.",
    status: "pending",
    createdAt: "2026-09-24",
    assignee: "Akmal",
    priority: "medium",
  },
  {
    id: "task-005",
    title: "Implementasi Realtime Subscriptions",
    description:
      "Gunakan Supabase Realtime untuk memperbarui status tugas secara live.",
    status: "pending",
    createdAt: "2026-09-24",
    assignee: "Akmal",
    priority: "low",
  },
];

/* ─── Constant Maps ───────────────────────────────────────────── */

const STATUS_BADGE: Record<TaskStatus, "default" | "secondary" | "outline"> = {
  running: "default",
  completed: "secondary",
  pending: "outline",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  running: "Berjalan",
  completed: "Selesai",
  pending: "Tertunda",
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-rose-600 dark:text-rose-400",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

/* ─── Metric Card Component ─────────────────────────────────────── */

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  colorClass: string;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass,
}: MetricCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className={`rounded-md p-1.5 ${colorClass}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ─── Task Row Component ─────────────────────────────────────────── */

function TaskRow({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="group flex items-start justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          <span aria-hidden="true">·</span>
          <span>🗓 {task.createdAt}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={STATUS_BADGE[task.status]} className="text-xs">
          {STATUS_LABEL[task.status]}
        </Badge>
        <ArrowUpRight
          className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function TasksPage() {
  const totalTasks = TASKS.length;
  const runningTasks = TASKS.filter((t) => t.status === "running").length;
  const completedTasks = TASKS.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Tugas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau progres, dan buat tugas baru untuk proyek serverless Anda.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
          <Rocket className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground">
            The Serverless Odyssey
          </span>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* ── Left Column: Create Task Form ── */}
        <aside aria-label="Formulir pembuatan tugas">
          <CreateTaskForm />
        </aside>

        {/* ── Right Column: Metrics + Task List ── */}
        <section aria-label="Ringkasan dan daftar tugas" className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Total"
              value={totalTasks}
              description="Semua tugas"
              icon={ListTodo}
              colorClass="bg-primary/10 text-primary"
            />
            <MetricCard
              title="Berjalan"
              value={runningTasks}
              description="Aktif dikerjakan"
              icon={Clock}
              colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              title="Selesai"
              value={completedTasks}
              description="Telah tuntas"
              icon={CheckCircle2}
              colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Task List Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Tugas Terkini
              </CardTitle>
            </CardHeader>
            <Separator className="mb-1" />
            <CardContent className="pt-1 pb-2">
              <ul
                role="list"
                aria-label="Daftar tugas terkini"
                className="divide-y divide-border"
              >
                {TASKS.map((task) => (
                  <li key={task.id}>
                    <TaskRow task={task} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
