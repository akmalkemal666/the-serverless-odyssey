-- ============================================================
-- Migration: 03_tasks_rbac.sql
-- Tujuan   : Tambahkan kolom user_id, priority (TEXT), description
--            ke tabel public.tasks; tambah kolom role ke public.profiles
--            untuk mendukung RBAC (Admin vs Member).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tambah kolom 'role' ke public.profiles (RBAC)
--    DEFAULT 'member' → semua user yang sudah ada aman.
-- ------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member'
  CHECK (role IN ('admin', 'member'));

COMMENT ON COLUMN public.profiles.role IS
  'Peran pengguna untuk RBAC: admin dapat menghapus semua tugas, member hanya miliknya.';

-- ------------------------------------------------------------
-- 2. Tambah kolom 'user_id' ke public.tasks
--    FK → auth.users (SET NULL saat user dihapus agar data tugas tidak hilang)
-- ------------------------------------------------------------
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index untuk query per user
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks (user_id);

COMMENT ON COLUMN public.tasks.user_id IS
  'UUID pemilik tugas — FK ke auth.users. NULL untuk tugas lama sebelum migrasi ini.';

-- ------------------------------------------------------------
-- 3. Tambah/ubah kolom 'priority' menjadi TEXT di public.tasks
--    Schema lama: priority SMALLINT (1=rendah, 2=sedang, 3=tinggi)
--    Schema baru: priority TEXT ('low' | 'medium' | 'high')
--    Strategi: Tambah kolom baru priority_text, lalu rename.
-- ------------------------------------------------------------

-- 3a. Tambah kolom priority TEXT jika belum ada
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS priority_text TEXT
  CHECK (priority_text IN ('low', 'medium', 'high'));

-- 3b. Backfill: Konversi nilai SMALLINT lama ke TEXT baru
UPDATE public.tasks
SET priority_text = CASE
  WHEN priority = 1 THEN 'low'
  WHEN priority = 2 THEN 'medium'
  WHEN priority = 3 THEN 'high'
  ELSE 'medium'
END
WHERE priority_text IS NULL;

-- 3c. Set NOT NULL + DEFAULT setelah backfill
ALTER TABLE public.tasks
  ALTER COLUMN priority_text SET NOT NULL,
  ALTER COLUMN priority_text SET DEFAULT 'medium';

-- 3d. Drop kolom lama priority SMALLINT
--     Hati-hati: hanya jalankan jika yakin tidak ada foreign key lain
ALTER TABLE public.tasks
  DROP COLUMN IF EXISTS priority;

-- 3e. Rename kolom baru menjadi 'priority'
ALTER TABLE public.tasks
  RENAME COLUMN priority_text TO priority;

COMMENT ON COLUMN public.tasks.priority IS
  'Prioritas tugas: low, medium, atau high.';

-- ------------------------------------------------------------
-- 4. Tambah kolom 'description' jika belum ada
-- ------------------------------------------------------------
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS description TEXT;

-- ------------------------------------------------------------
-- 5. Update RLS Policies untuk tasks
--    Admin baca semua; Member hanya miliknya.
-- ------------------------------------------------------------
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada, ganti dengan yang baru
DROP POLICY IF EXISTS "tasks_select_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_delete_policy" ON public.tasks;

-- SELECT: user melihat tugas miliknya + admin melihat semua
CREATE POLICY "tasks_select_policy"
  ON public.tasks FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT: hanya user terautentikasi, user_id harus cocok
CREATE POLICY "tasks_insert_policy"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: hanya pemilik tugas
CREATE POLICY "tasks_update_policy"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: pemilik ATAU admin
CREATE POLICY "tasks_delete_policy"
  ON public.tasks FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ------------------------------------------------------------
-- 6. Tambah FK dari projects ke auth.users (jika belum ada)
--    Schema lama: projects.profile_id → profiles.id
--    Schema baru: projects.user_id → auth.users.id
-- ------------------------------------------------------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill user_id dari profile_id (jika profiles.id = auth.users.id setelah Modul 5)
-- CATATAN: Jalankan ini SETELAH memastikan profiles.id = auth.users.id di lingkungan Anda
-- UPDATE public.projects SET user_id = profile_id WHERE user_id IS NULL;

COMMENT ON COLUMN public.projects.user_id IS
  'UUID pemilik proyek — FK ke auth.users (ditambahkan di Modul 6).';

-- Index
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
