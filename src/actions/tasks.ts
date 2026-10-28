"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { taskSchema, type ActionState, type TaskInput } from "@/lib/schemas";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/* ─── Helper: resolveTargetProjectId ─────────────────────────── */

/**
 * Menentukan project_id yang akan digunakan untuk task baru.
 *
 * Logika:
 * 1. Jika customProjectId disediakan → validasi kepemilikan → kembalikan.
 * 2. Cari proyek pertama milik user.
 * 3. Jika tidak ada → buat "Proyek Utama (General)" secara otomatis.
 *
 * Memastikan tasks.project_id TIDAK PERNAH NULL (constraint NOT NULL 3-tier).
 */
async function resolveTargetProjectId(
  supabase: SupabaseClient<Database>,
  userId: string,
  customProjectId?: string
): Promise<string> {
  // Kasus 1: Project ID eksplisit diberikan
  if (customProjectId) {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("id", customProjectId)
      .eq("user_id", userId)
      .single();

    if (data?.id) return data.id;
    // Jika tidak ditemukan/bukan milik user, lanjut ke auto-resolve
  }

  // Kasus 2: Cari proyek pertama milik user
  const { data: existingProject } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (existingProject?.id) return existingProject.id;

  // Kasus 3: Auto-create "Proyek Utama (General)"
  const { data: newProject, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: "Proyek Utama (General)",
      description: "Proyek default yang dibuat otomatis untuk menampung tugas Anda.",
    })
    .select("id")
    .single();

  if (error || !newProject?.id) {
    throw new Error(`Gagal membuat proyek default: ${error?.message ?? "unknown error"}`);
  }

  return newProject.id;
}

/* ─── Action: createTaskAction ────────────────────────────────── */

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // Verifikasi sesi via getUser() (aman, validasi JWT ke server)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      status: "error",
      message: "Sesi tidak valid. Silakan login ulang.",
    };
  }

  // Validasi input dengan Zod
  const raw = {
    title: formData.get("title"),
    priority: formData.get("priority") ?? "medium",
    status: formData.get("status") ?? "todo",
    project_id: formData.get("project_id") || undefined,
  };

  const parsed = taskSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Partial<
      Record<keyof TaskInput, string[]>
    >;
    return {
      status: "error",
      message: "Validasi gagal. Periksa kembali isian Anda.",
      fieldErrors,
    };
  }

  // Resolve project_id (auto-create jika belum ada)
  let projectId: string;
  try {
    projectId = await resolveTargetProjectId(supabase, user.id, parsed.data.project_id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menentukan proyek.";
    return { status: "error", message };
  }

  // Insert task ke database
  const { error: insertError } = await supabase.from("tasks").insert({
    title: parsed.data.title,
    priority: parsed.data.priority,
    status: parsed.data.status,
    project_id: projectId,
    user_id: user.id,
  });

  if (insertError) {
    return {
      status: "error",
      message: `Gagal menyimpan tugas: ${insertError.message}`,
    };
  }

  revalidatePath("/tasks");

  return {
    status: "success",
    message: `Tugas "${parsed.data.title}" berhasil dibuat dengan prioritas ${parsed.data.priority}.`,
    data: parsed.data,
  };
}

/* ─── Action: deleteTaskAction ────────────────────────────────── */

export async function deleteTaskAction(id: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { status: "error", message: "Tidak terautentikasi." };
  }

  // Ambil profil untuk mengecek role (RBAC)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "member";

  let deleteQuery = supabase.from("tasks").delete().eq("id", id);

  // Admin: hapus task siapapun | Member: hanya miliknya sendiri
  if (role !== "admin") {
    deleteQuery = deleteQuery.eq("user_id", user.id);
  }

  const { error } = await deleteQuery;

  if (error) {
    return { status: "error", message: `Gagal menghapus tugas: ${error.message}` };
  }

  revalidatePath("/tasks");
  return { status: "success", message: "Tugas berhasil dihapus." };
}

/* ─── Action: toggleTaskStatusAction ─────────────────────────── */

export async function toggleTaskStatusAction(
  id: string,
  currentStatus: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { status: "error", message: "Tidak terautentikasi." };
  }

  const newStatus = currentStatus === "done" ? "todo" : "done";

  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: `Gagal mengupdate status: ${error.message}` };
  }

  revalidatePath("/tasks");
  return { status: "success", message: `Status tugas diubah ke "${newStatus}".` };
}
