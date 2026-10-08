"use server";

import { revalidatePath } from "next/cache";
import { TaskSchema, type ActionState } from "@/lib/schemas";

/* ─── createTaskAction ────────────────────────────────────────── */

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority"),
  };

  const parsed = TaskSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Partial<
      Record<"title" | "description" | "priority", string[]>
    >;

    return {
      status: "error",
      message: "Validasi gagal. Periksa kembali isian Anda.",
      fieldErrors,
    };
  }

  // In a production app, persist to DB here (e.g. via Supabase or Prisma).
  // For this module we simulate a short async operation.
  await new Promise<void>((resolve) => setTimeout(resolve, 600));

  revalidatePath("/tasks");

  return {
    status: "success",
    message: `Tugas "${parsed.data.title}" berhasil dibuat dengan prioritas ${parsed.data.priority}.`,
    data: parsed.data,
  };
}
