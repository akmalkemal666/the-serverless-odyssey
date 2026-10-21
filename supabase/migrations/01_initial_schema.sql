-- =============================================================================
-- The Serverless Odyssey — Initial Schema Migration
-- Versi   : 01
-- Tabel   : profiles, projects, tasks
-- Catatan : profiles berdiri sendiri dengan UUID mandiri (gen_random_uuid()).
--           Integrasi ke auth.users akan dilakukan pada Minggu 5.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- menyediakan gen_random_uuid()

-- ---------------------------------------------------------------------------
-- 1. Enum Types
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'planning',
    'active',
    'completed',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM (
    'todo',
    'in_progress',
    'done'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Helper Function: otomatis perbarui kolom updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. Tabel: profiles
--    UUID mandiri — tidak bergantung auth.users (integrasi Minggu 5)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT          NOT NULL UNIQUE,
  full_name   TEXT          NOT NULL,
  avatar_url  TEXT,
  bio         TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT profiles_username_length CHECK (char_length(username) BETWEEN 3 AND 50),
  CONSTRAINT profiles_website_format  CHECK (website IS NULL OR website ~* '^https?://')
);

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Tabel: projects  (FK → profiles)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID            NOT NULL
                    REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT            NOT NULL,
  description     TEXT,
  status          project_status  NOT NULL DEFAULT 'planning',
  budget          NUMERIC(15, 2),
  tech_stack      TEXT[]          NOT NULL DEFAULT '{}',
  repository_url  TEXT,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT projects_name_length     CHECK (char_length(name) BETWEEN 2 AND 120),
  CONSTRAINT projects_budget_positive CHECK (budget IS NULL OR budget >= 0),
  CONSTRAINT projects_repo_format     CHECK (
    repository_url IS NULL OR repository_url ~* '^https?://'
  )
);

-- B-Tree Index pada foreign key
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON public.projects (profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_status      ON public.projects (status);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Tabel: tasks  (FK → projects)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID         NOT NULL
                 REFERENCES public.projects(id) ON DELETE CASCADE,
  title        TEXT         NOT NULL,
  description  TEXT,
  status       task_status  NOT NULL DEFAULT 'todo',
  priority     SMALLINT     NOT NULL DEFAULT 2,
  due_date     DATE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT tasks_title_length     CHECK (char_length(title) BETWEEN 2 AND 200),
  CONSTRAINT tasks_priority_range   CHECK (priority BETWEEN 1 AND 3)
    -- 1 = rendah, 2 = sedang, 3 = tinggi
);

-- B-Tree Index pada foreign key dan kolom yang sering di-query
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON public.tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority    ON public.tasks (priority DESC);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 6. SEED DATA — data contoh realistis untuk verifikasi cepat tanpa login
--    Menggunakan UUID tetap (hardcoded) agar ON CONFLICT DO NOTHING berfungsi.
-- =============================================================================

-- 6a. 1 Profil Pengembang
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, website)
VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'devakmal',
  'Akmal Haidar Azzam',
  'https://avatars.githubusercontent.com/u/devakmal',
  'Full-stack developer. Building The Serverless Odyssey — Next.js 16 + Supabase.',
  'https://github.com/devakmal'
)
ON CONFLICT (id) DO NOTHING;

-- 6b. 3 Proyek Serverless
INSERT INTO public.projects
  (id, profile_id, name, description, status, budget, tech_stack, repository_url)
VALUES
  (
    'b1b2c3d4-0000-4000-8000-000000000001',
    'a1b2c3d4-0000-4000-8000-000000000001',
    'CloudTask Pro',
    'Platform manajemen tugas serverless berbasis Next.js 16 App Router, Supabase PostgreSQL, dan Vercel Edge. Mendukung Server Actions, Zod validation, dan dark mode adaptif.',
    'active',
    5000000.00,
    ARRAY['Next.js 16', 'React 19', 'Supabase', 'Tailwind CSS v4', 'Vercel', 'Zod'],
    'https://github.com/devakmal/cloudtask-pro'
  ),
  (
    'b1b2c3d4-0000-4000-8000-000000000002',
    'a1b2c3d4-0000-4000-8000-000000000001',
    'MediaVault CDN',
    'Layanan manajemen aset digital bertenaga Cloudinary API. Mendukung upload gambar, transformasi otomatis, dan pengiriman via CDN global untuk performa optimal.',
    'planning',
    3500000.00,
    ARRAY['Next.js 16', 'Cloudinary', 'TypeScript', 'Supabase Storage'],
    'https://github.com/devakmal/mediavault-cdn'
  ),
  (
    'b1b2c3d4-0000-4000-8000-000000000003',
    'a1b2c3d4-0000-4000-8000-000000000001',
    'EdgeAuth Gateway',
    'Sistem autentikasi edge-first menggunakan Supabase Auth dengan JWT rotation, middleware proteksi rute, dan session management berbasis cookie yang aman.',
    'planning',
    2000000.00,
    ARRAY['Next.js 16', 'Supabase Auth', 'Jose JWT', 'Edge Runtime'],
    'https://github.com/devakmal/edgeauth-gateway'
  )
ON CONFLICT (id) DO NOTHING;

-- 6c. 6 Tasks berelasi (2 per proyek)
INSERT INTO public.tasks
  (id, project_id, title, description, status, priority, due_date)
VALUES
  -- Tasks untuk CloudTask Pro
  (
    'c1b2c3d4-0000-4000-8000-000000000001',
    'b1b2c3d4-0000-4000-8000-000000000001',
    'Setup Supabase Schema & Seed Data',
    'Merancang skema relasional 3 tabel (profiles, projects, tasks) dengan UUID v4, FK ON DELETE CASCADE, CHECK constraints, indexes, dan trigger updated_at.',
    'done',
    3,
    '2026-10-15'
  ),
  (
    'c1b2c3d4-0000-4000-8000-000000000002',
    'b1b2c3d4-0000-4000-8000-000000000001',
    'Implementasi Server Actions dengan Zod',
    'Membuat Server Actions untuk CRUD tugas menggunakan Zod schema validation, revalidatePath, dan feedback error inline tanpa API Routes.',
    'in_progress',
    3,
    '2026-10-22'
  ),
  -- Tasks untuk MediaVault CDN
  (
    'c1b2c3d4-0000-4000-8000-000000000003',
    'b1b2c3d4-0000-4000-8000-000000000002',
    'Integrasi Cloudinary Upload Widget',
    'Mengintegrasikan Cloudinary Upload Widget ke Next.js dengan server-side signature generation dan transformasi otomatis (resize, format WebP, lazy loading).',
    'todo',
    2,
    '2026-10-29'
  ),
  (
    'c1b2c3d4-0000-4000-8000-000000000004',
    'b1b2c3d4-0000-4000-8000-000000000002',
    'Desain Galeri Grid Responsif',
    'Membangun komponen galeri grid dengan infinite scroll, lightbox preview, dan optimasi Next.js Image untuk berbagai ukuran layar.',
    'todo',
    2,
    '2026-11-05'
  ),
  -- Tasks untuk EdgeAuth Gateway
  (
    'c1b2c3d4-0000-4000-8000-000000000005',
    'b1b2c3d4-0000-4000-8000-000000000003',
    'Konfigurasi Supabase Auth + Middleware',
    'Menyiapkan Supabase Auth dengan email/password, Google OAuth, dan Next.js middleware untuk proteksi rute /dashboard dan /tasks secara otomatis.',
    'todo',
    3,
    '2026-11-12'
  ),
  (
    'c1b2c3d4-0000-4000-8000-000000000006',
    'b1b2c3d4-0000-4000-8000-000000000003',
    'Implementasi JWT Session Refresh',
    'Mengatur siklus refresh JWT menggunakan updateSession di middleware dan createServerClient di Server Components untuk session yang selalu valid.',
    'todo',
    2,
    '2026-11-19'
  )
ON CONFLICT (id) DO NOTHING;
