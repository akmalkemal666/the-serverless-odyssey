-- ============================================================
-- Migration: 02_auth_profiles_trigger.sql
-- Tujuan   : Sinkronisasi otomatis profil user dari auth.users
--            ke public.profiles setiap kali user baru mendaftar.
-- Penulis  : The Serverless Odyssey — Tahap 1: Fondasi Autentikasi
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABEL: public.profiles
--    Menyimpan data profil publik yang aman untuk dibaca client.
--    Terhubung ke auth.users via FK dengan CASCADE DELETE.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.profiles IS
  'Profil publik pengguna — disinkronisasi otomatis dari auth.users melalui trigger.';
COMMENT ON COLUMN public.profiles.id IS
  'UUID yang sama dengan auth.users.id (FK dengan CASCADE DELETE).';
COMMENT ON COLUMN public.profiles.full_name IS
  'Nama lengkap pengguna, diekstrak dari raw_user_meta_data saat registrasi.';
COMMENT ON COLUMN public.profiles.avatar_url IS
  'URL foto profil, diekstrak dari raw_user_meta_data saat registrasi.';
COMMENT ON COLUMN public.profiles.updated_at IS
  'Timestamp terakhir profil diperbarui (auto-set oleh DEFAULT now()).';

-- ------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
--    Aktifkan RLS agar setiap baris terlindungi secara default.
-- ------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan SELECT: Semua user terotentikasi maupun anonim dapat membaca profil.
-- Ini memungkinkan menampilkan nama/avatar di konten publik tanpa login.
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Kebijakan UPDATE: Hanya pemilik profil (auth.uid() = id) yang bisa memperbarui.
-- Mencegah user A mengubah profil user B.
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kebijakan INSERT: Hanya service_role / trigger SECURITY DEFINER yang bisa INSERT.
-- User biasa tidak dapat menyisipkan baris profil secara langsung.
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- 3. FUNGSI TRIGGER: handle_new_user()
--    SECURITY DEFINER → berjalan dengan hak akses pemilik fungsi
--    (postgres/service_role), bukan hak akses pemanggil.
--    Ini diperlukan karena trigger dieksekusi dalam konteks INSERT
--    pada auth.users yang tidak dapat diakses langsung oleh user biasa.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
-- Batasi search_path agar menghindari privilege escalation via schema injection
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    -- Ekstrak full_name dari metadata yang dikirim saat sign-up
    -- (bisa NULL jika user tidak mengisi, tidak menyebabkan error)
    NEW.raw_user_meta_data ->> 'full_name',
    -- Ekstrak avatar_url — biasanya diisi oleh provider OAuth (Google, GitHub, dsb.)
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Trigger function: menyalin data profil dari auth.users.raw_user_meta_data ke public.profiles setiap user baru dibuat. SECURITY DEFINER diperlukan agar trigger dapat menulis ke public.profiles meskipun RLS aktif.';

-- ------------------------------------------------------------
-- 4. TRIGGER: on_auth_user_created
--    Dipasang pada auth.users — eksekusi AFTER INSERT FOR EACH ROW.
--    Menjamin setiap user baru langsung memiliki baris di public.profiles.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
  'Trigger yang memanggil handle_new_user() setelah setiap INSERT baru di auth.users, memastikan profil publik tersedia secara instan.';

-- ------------------------------------------------------------
-- 5. BACKFILL (Opsional, aman untuk dijalankan berulang kali)
--    Sync profil untuk user yang mungkin sudah ada sebelum trigger ini dibuat.
-- ------------------------------------------------------------
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'avatar_url'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
