import { z } from "zod";

/* ─── Task Priority & Status ──────────────────────────────────── */

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusEnum = (typeof TASK_STATUSES)[number];

/* ─── Task Schema (Single Source of Truth) ────────────────────── */

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul harus memiliki minimal 3 karakter." })
    .max(100, { message: "Judul tidak boleh melebihi 100 karakter." }),
  priority: z
    .enum(TASK_PRIORITIES, {
      message: "Prioritas harus berupa low, medium, atau high.",
    })
    .default("medium"),
  status: z
    .enum(TASK_STATUSES, {
      message: "Status harus berupa todo, in_progress, atau done.",
    })
    .default("todo"),
  project_id: z.string().uuid({ message: "project_id harus UUID valid." }).optional(),
});

/** Schema untuk update — semua field opsional */
export const taskUpdateSchema = taskSchema.partial();

/* ─── Inferred Types ──────────────────────────────────────────── */

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

/* ─── Legacy alias agar tidak merusak komponen lama ──────────── */
/** @deprecated Gunakan taskSchema */
export const TaskSchema = taskSchema;

/* ─── Generic Action State Contract ──────────────────────────── */

export type ActionState<T = TaskInput> =
  | {
      status: "idle";
    }
  | {
      status: "success";
      message: string;
      data?: T;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof T, string[]>>;
    };
