"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/tasks";
import type { ActionState } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ClipboardList,
  Flame,
  Layers,
  Feather,
} from "lucide-react";

/* ─── Priority Option Config ──────────────────────────────────── */

const PRIORITY_OPTIONS = [
  {
    value: "low" as const,
    label: "Rendah",
    icon: Feather,
    colorClass:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-500/20 data-[selected=true]:ring-2 data-[selected=true]:ring-emerald-500/30",
    description: "Tidak mendesak",
  },
  {
    value: "medium" as const,
    label: "Sedang",
    icon: Layers,
    colorClass:
      "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 data-[selected=true]:border-amber-500 data-[selected=true]:bg-amber-500/20 data-[selected=true]:ring-2 data-[selected=true]:ring-amber-500/30",
    description: "Prioritas standar",
  },
  {
    value: "high" as const,
    label: "Tinggi",
    icon: Flame,
    colorClass:
      "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 data-[selected=true]:border-rose-500 data-[selected=true]:bg-rose-500/20 data-[selected=true]:ring-2 data-[selected=true]:ring-rose-500/30",
    description: "Segera ditangani",
  },
];

/* ─── Field Error Helper ──────────────────────────────────────── */

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3 shrink-0" />
      <span>{messages[0]}</span>
    </p>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

const initialState: ActionState | null = null;

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(
    createTaskAction,
    initialState
  );

  const fieldErrors =
    state?.status === "error" ? state.fieldErrors : undefined;

  return (
    <Card className="relative overflow-hidden border-border bg-card shadow-sm">
      {/* Decorative gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Buat Tugas Baru
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Isi detail tugas dan tetapkan prioritasnya.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Success Alert ── */}
        {state?.status === "success" && (
          <Alert
            variant="default"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4 !text-emerald-600 dark:!text-emerald-400" />
            <AlertTitle className="font-semibold">Berhasil Disimpan!</AlertTitle>
            <AlertDescription className="text-xs">
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        {/* ── Error Banner ── */}
        {state?.status === "error" && !state.fieldErrors && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="text-xs">
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        <form id="create-task-form" action={formAction} className="space-y-5" noValidate>
          {/* ── Title Field ── */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-title"
              className="text-sm font-medium text-foreground"
            >
              Judul Tugas{" "}
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="task-title"
              name="title"
              type="text"
              placeholder="cth. Setup Supabase Auth dengan Google OAuth"
              autoComplete="off"
              aria-required="true"
              aria-describedby={fieldErrors?.title ? "task-title-error" : undefined}
              className={cn(
                "transition-shadow focus-visible:ring-primary",
                fieldErrors?.title && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <div id="task-title-error">
              <FieldError messages={fieldErrors?.title} />
            </div>
          </div>

          {/* ── Description Field ── */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-description"
              className="text-sm font-medium text-foreground"
            >
              Deskripsi{" "}
              <span className="text-xs text-muted-foreground">(opsional)</span>
            </Label>
            <Textarea
              id="task-description"
              name="description"
              placeholder="Tambahkan konteks atau langkah-langkah yang relevan…"
              rows={3}
              aria-describedby={
                fieldErrors?.description ? "task-description-error" : undefined
              }
              className={cn(
                "resize-none transition-shadow focus-visible:ring-primary",
                fieldErrors?.description &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <div id="task-description-error">
              <FieldError messages={fieldErrors?.description} />
            </div>
          </div>

          {/* ── Priority Field ── */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Prioritas{" "}
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </Label>
            <div
              role="group"
              aria-label="Pilih prioritas tugas"
              aria-describedby={
                fieldErrors?.priority ? "task-priority-error" : undefined
              }
              className="grid grid-cols-3 gap-2"
            >
              {PRIORITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <label
                    key={opt.value}
                    htmlFor={`priority-${opt.value}`}
                    className={cn(
                      "group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-150",
                      "hover:scale-[1.02]",
                      opt.colorClass
                    )}
                  >
                    <input
                      type="radio"
                      id={`priority-${opt.value}`}
                      name="priority"
                      value={opt.value}
                      className="sr-only"
                      defaultChecked={opt.value === "medium"}
                      // Use JS to toggle data-selected on the label for styling
                      onChange={(e) => {
                        const labels = document.querySelectorAll<HTMLLabelElement>(
                          '[data-priority-label]'
                        );
                        labels.forEach((l) =>
                          l.setAttribute('data-selected', 'false')
                        );
                        if (e.currentTarget.checked) {
                          e.currentTarget.closest('label')?.setAttribute(
                            'data-selected',
                            'true'
                          );
                        }
                      }}
                      ref={(el) => {
                        if (el && el.checked) {
                          el.closest('label')?.setAttribute('data-selected', 'true');
                        }
                      }}
                    />
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-xs font-semibold leading-none">
                      {opt.label}
                    </span>
                    <span className="hidden text-[10px] opacity-70 sm:block">
                      {opt.description}
                    </span>
                  </label>
                );
              })}
            </div>
            <div id="task-priority-error">
              <FieldError messages={fieldErrors?.priority} />
            </div>
          </div>

          {/* ── Submit Button ── */}
          <Button
            id="create-task-submit"
            type="submit"
            disabled={isPending}
            className="w-full gap-2 font-semibold"
            size="default"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Menyimpan…</span>
              </>
            ) : (
              <>
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                <span>Buat Tugas</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
