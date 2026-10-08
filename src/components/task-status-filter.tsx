"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ─── Types ───────────────────────────────────────────────── */

type TaskStatus = "running" | "completed" | "pending";
type FilterValue = "all" | TaskStatus;

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  assignee: string;
}

interface TaskStatusFilterProps {
  tasks: Task[];
}

/* ─── Badge & label maps ─────────────────────────────────── */

const STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline"
> = {
  running: "default",
  completed: "secondary",
  pending: "outline",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  running: "Berjalan",
  completed: "Selesai",
  pending: "Tertunda",
};

/* ─── Filter Tab Config ──────────────────────────────────── */

interface FilterTab {
  value: FilterValue;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { value: "all", label: "Semua" },
  { value: "running", label: "Berjalan" },
  { value: "completed", label: "Selesai" },
  { value: "pending", label: "Tertunda" },
];

/* ─── Task Card (Client-side renderable) ─────────────────── */

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`} className="group block">
      <Card className="h-full bg-card border-border transition-all duration-200 hover:border-primary/50 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            <Badge
              variant={STATUS_VARIANT[task.status]}
              className="shrink-0 text-xs"
            >
              {STATUS_LABEL[task.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>👤 {task.assignee}</span>
            <span>🗓 {task.createdAt}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

export function TaskStatusFilter({ tasks }: TaskStatusFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  const getCount = (value: FilterValue): number =>
    value === "all"
      ? tasks.length
      : tasks.filter((t) => t.status === value).length;

  return (
    <div className="space-y-6">
      {/* Filter Tab Bar */}
      <div
        role="tablist"
        aria-label="Filter status tugas"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          const count = getCount(tab.value);

          return (
            <Button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(tab.value)}
              className="gap-2 transition-all duration-150"
              id={`filter-tab-${tab.value}`}
            >
              {tab.label}
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Tidak ada tugas dengan status ini.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Pilih filter lain atau tambahkan tugas baru.
          </p>
        </div>
      ) : (
        <div
          role="tabpanel"
          aria-labelledby={`filter-tab-${activeFilter}`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {filteredTasks.length}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-foreground">{tasks.length}</span>{" "}
        tugas
      </p>
    </div>
  );
}
