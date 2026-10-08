import { z } from "zod";

/* ─── Task Schema ─────────────────────────────────────────────── */

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul harus memiliki minimal 3 karakter." })
    .max(100, { message: "Judul tidak boleh melebihi 100 karakter." }),
  description: z
    .string()
    .max(500, { message: "Deskripsi tidak boleh melebihi 500 karakter." })
    .optional(),
  priority: z.enum(["low", "medium", "high"] as const, {
    message: "Prioritas harus berupa low, medium, atau high.",
  }),
});

/* ─── Inferred Types ──────────────────────────────────────────── */

export type TaskInput = z.infer<typeof TaskSchema>;

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
      fieldErrors?: Partial<Record<keyof TaskInput, string[]>>;
    };
