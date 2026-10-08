import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ─── Types ───────────────────────────────────────────────── */

type TaskStatus = "running" | "completed" | "pending";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  tags: string[];
}

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

/* ─── Static Data Store ──────────────────────────────────── */

const TASKS: Record<string, Task> = {
  "task-001": {
    id: "task-001",
    title: "Setup Supabase Auth dengan Google OAuth",
    description:
      "Konfigurasi autentikasi SSO menggunakan provider Google melalui Supabase Auth. Meliputi setup OAuth credentials di Google Cloud Console, konfigurasi redirect URL, dan implementasi callback handler di Next.js App Router.",
    status: "completed",
    createdAt: "2026-09-20",
    updatedAt: "2026-09-22",
    assignee: "Akmal",
    priority: "high",
    tags: ["auth", "supabase", "google"],
  },
  "task-002": {
    id: "task-002",
    title: "Integrasi Cloudinary Upload API",
    description:
      "Implementasi endpoint upload gambar dengan transformasi otomatis WebP/AVIF. Mencakup signed upload preset, validasi ukuran dan tipe file di server, serta optimasi delivery melalui Cloudinary CDN.",
    status: "running",
    createdAt: "2026-09-22",
    updatedAt: "2026-09-24",
    assignee: "Akmal",
    priority: "high",
    tags: ["cloudinary", "media", "api"],
  },
  "task-003": {
    id: "task-003",
    title: "Desain Skema Database PostgreSQL",
    description:
      "Definisikan tabel tasks, users, dan tags beserta relasi dan RLS policy. Termasuk pembuatan migrasi Supabase, indeks performa, dan seed data untuk pengembangan lokal.",
    status: "running",
    createdAt: "2026-09-23",
    updatedAt: "2026-09-24",
    assignee: "Akmal",
    priority: "medium",
    tags: ["database", "postgresql", "supabase"],
  },
  "task-004": {
    id: "task-004",
    title: "Deploy ke Vercel Edge Network",
    description:
      "Konfigurasi pipeline CI/CD dan variabel lingkungan production di Vercel. Meliputi setup custom domain, environment variables per stage, dan monitoring dengan Vercel Analytics.",
    status: "pending",
    createdAt: "2026-09-24",
    updatedAt: "2026-09-24",
    assignee: "Akmal",
    priority: "medium",
    tags: ["vercel", "deployment", "cicd"],
  },
  "task-005": {
    id: "task-005",
    title: "Implementasi Realtime Subscriptions",
    description:
      "Gunakan Supabase Realtime untuk memperbarui status tugas secara live menggunakan WebSocket. Implementasi debounce dan reconnection logic untuk koneksi yang andal.",
    status: "pending",
    createdAt: "2026-09-24",
    updatedAt: "2026-09-24",
    assignee: "Akmal",
    priority: "low",
    tags: ["realtime", "supabase", "websocket"],
  },
  "task-006": {
    id: "task-006",
    title: "Optimasi SEO dengan Next.js Metadata API",
    description:
      "Tambahkan Open Graph, Twitter Card, dan JSON-LD structured data menggunakan Next.js 16 Metadata API. Termasuk sitemap.xml dan robots.txt generation otomatis.",
    status: "completed",
    createdAt: "2026-09-21",
    updatedAt: "2026-09-22",
    assignee: "Akmal",
    priority: "medium",
    tags: ["seo", "nextjs", "metadata"],
  },
};

/* ─── Status / Priority maps ─────────────────────────────── */

const STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline"
> = {
  running: "default",
  completed: "secondary",
  pending: "outline",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  running: "🔄 Berjalan",
  completed: "✅ Selesai",
  pending: "⏳ Tertunda",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  high: "🔴 Tinggi",
  medium: "🟡 Sedang",
  low: "🟢 Rendah",
};

/* ─── Dynamic Metadata ───────────────────────────────────── */

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = TASKS[id];

  if (!task) {
    return { title: "Tugas Tidak Ditemukan" };
  }

  return {
    title: task.title,
    description: task.description,
  };
}

/* ─── Page ───────────────────────────────────────────────── */

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Next.js 16: params adalah Promise — wajib di-await
  const { id } = await params;

  const task = TASKS[id];

  if (!task) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring -ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Tugas
        </Link>
      </div>

      {/* Task Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {task.id}
            </span>
            <Badge variant={STATUS_VARIANT[task.status]}>
              {STATUS_LABEL[task.status]}
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {task.title}
          </h1>
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description Card */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Deskripsi Tugas</CardTitle>
            <CardDescription>
              Detail lengkap dan konteks pengerjaan tugas ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">
              {task.description}
            </p>
          </CardContent>
        </Card>

        {/* Metadata Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Informasi Tugas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Assignee</span>
                <span className="font-medium text-foreground">
                  {task.assignee}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Prioritas</span>
                <span className="font-medium text-foreground">
                  {PRIORITY_LABEL[task.priority]}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Dibuat</span>
                <span className="font-medium text-foreground">
                  {task.createdAt}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Diperbarui</span>
                <span className="font-medium text-foreground">
                  {task.updatedAt}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
