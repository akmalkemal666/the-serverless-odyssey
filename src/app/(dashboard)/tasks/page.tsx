import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskSearchInput } from "@/components/tasks/task-search-input";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/tasks/task-form";
import { deleteTaskAction, toggleTaskStatusAction } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Crown,
  User,
  Trash2,
  ToggleLeft,
} from "lucide-react";

/* ─── Page Metadata ───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Daftar Tugas",
  description: "Kelola dan buat tugas serverless baru di CloudTask Pro dengan RBAC.",
};

/* ─── Constants ───────────────────────────────────────────────── */

const PAGE_SIZE = 10;

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

/* ─── Pagination Component ────────────────────────────────────── */

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  search: string;
}

function Pagination({ currentPage, hasNextPage, search }: PaginationProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/tasks?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground">
        Halaman <span className="font-medium text-foreground">{currentPage}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
        >
          <Link
            href={buildHref(currentPage - 1)}
            aria-label="Halaman sebelumnya"
            aria-current={currentPage <= 1 ? undefined : "page"}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Sebelumnya</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          aria-disabled={!hasNextPage}
          tabIndex={!hasNextPage ? -1 : undefined}
        >
          <Link
            href={buildHref(currentPage + 1)}
            aria-label="Halaman berikutnya"
          >
            <span>Berikutnya</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ─── Delete Button (Server Action inline) ────────────────────── */

function DeleteButton({ taskId, isAdmin, isOwner }: {
  taskId: string;
  isAdmin: boolean;
  isOwner: boolean;
}) {
  const canDelete = isAdmin || isOwner;
  if (!canDelete) return null;

  const deleteWithId = deleteTaskAction.bind(null, taskId);

  return (
    <form action={deleteWithId}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        aria-label="Hapus tugas"
        title={isAdmin ? "Hapus (Admin)" : "Hapus tugas Anda"}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}

/* ─── Toggle Status Button ────────────────────────────────────── */

function ToggleStatusButton({ taskId, currentStatus, isOwner }: {
  taskId: string;
  currentStatus: string;
  isOwner: boolean;
}) {
  if (!isOwner) return null;

  const toggleWithArgs = toggleTaskStatusAction.bind(null, taskId, currentStatus);

  return (
    <form action={toggleWithArgs}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label={currentStatus === "done" ? "Tandai belum selesai" : "Tandai selesai"}
        title={currentStatus === "done" ? "Kembalikan ke todo" : "Tandai sebagai done"}
      >
        <ToggleLeft className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

interface SearchParamsType {
  search?: string;
  page?: string;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  // Next.js 16: searchParams adalah Promise — wajib await
  const { search = "", page = "1" } = await searchParams;

  const supabase = await createClient();

  // Autentikasi wajib (proxy sudah redirect jika belum login, tapi double-check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/tasks");

  // Ambil profil user untuk RBAC & badge peran
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role ?? "member";
  const isAdmin = userRole === "admin";

  // Pagination
  const currentPage = Math.max(1, parseInt(page, 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Query tugas dengan pencarian & pagination
  let query = supabase
    .from("tasks")
    .select("id, title, status, priority, user_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  // Admin melihat semua tugas; Member hanya miliknya
  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: tasks, count } = await query;

  const totalCount = count ?? 0;
  const taskList = tasks ?? [];
  const hasNextPage = to < totalCount - 1;

  // Hitung metrics
  const doneCount = taskList.filter((t) => t.status === "done").length;
  const inProgressCount = taskList.filter((t) => t.status === "in_progress").length;

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manajemen Tugas
            </h1>
            {/* Badge Peran */}
            <Badge
              variant="outline"
              className={
                isAdmin
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400"
              }
            >
              {isAdmin ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Member
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Mode Admin — Anda dapat melihat dan menghapus semua tugas."
              : `Selamat datang, ${profile?.full_name ?? user.email}. Kelola tugas Anda.`}
          </p>
        </div>

        {/* CTA: API Tester */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-9">
            <Link href="/tasks/api-tester">
              <Rocket className="h-3.5 w-3.5" />
              <span className="text-xs">API Tester</span>
            </Link>
          </Button>
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
            <Rocket className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">
              The Serverless Odyssey
            </span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* ── Left Column: TaskForm ── */}
        <aside aria-label="Formulir pembuatan tugas">
          <TaskForm />
        </aside>

        {/* ── Right Column: Metrics + Search + Table ── */}
        <section aria-label="Ringkasan dan daftar tugas" className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Total"
              value={totalCount}
              description={search ? "Hasil pencarian" : "Semua tugas"}
              icon={ListTodo}
              colorClass="bg-primary/10 text-primary"
            />
            <MetricCard
              title="Berjalan"
              value={inProgressCount}
              description="Aktif dikerjakan"
              icon={Clock}
              colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              title="Selesai"
              value={doneCount}
              description="Halaman ini"
              icon={CheckCircle2}
              colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Task Table Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Tugas Terkini
                  {totalCount > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({totalCount} total)
                    </span>
                  )}
                </CardTitle>
                {/* Search input */}
                <TaskSearchInput defaultValue={search} />
              </div>
            </CardHeader>

            <Separator className="mb-0" />

            <CardContent className="pt-0 pb-4 px-0">
              {taskList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ListTodo className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {search ? `Tidak ada tugas untuk "${search}"` : "Belum ada tugas"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {search ? "Coba kata kunci lain" : "Buat tugas pertama Anda di formulir sebelah kiri."}
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-4 w-[40%]">Judul</TableHead>
                        <TableHead>Prioritas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-4">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskList.map((task) => {
                        const isOwner = task.user_id === user.id;
                        return (
                          <TableRow
                            key={task.id}
                            className="group"
                          >
                            <TableCell className="pl-4 font-medium text-sm">
                              <span
                                className={
                                  task.status === "done"
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }
                              >
                                {task.title}
                              </span>
                              {!isOwner && isAdmin && (
                                <span className="ml-2 text-[10px] text-muted-foreground">
                                  (bukan milik Anda)
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <PriorityBadge priority={task.priority} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={task.status} />
                            </TableCell>
                            <TableCell className="pr-4">
                              <div className="flex items-center justify-end gap-1">
                                <ToggleStatusButton
                                  taskId={task.id}
                                  currentStatus={task.status}
                                  isOwner={isOwner}
                                />
                                <DeleteButton
                                  taskId={task.id}
                                  isAdmin={isAdmin}
                                  isOwner={isOwner}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="px-4">
                    <Pagination
                      currentPage={currentPage}
                      hasNextPage={hasNextPage}
                      search={search}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
