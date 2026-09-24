<div align="center">

# 🚀 The Serverless Odyssey

### Full-Stack Serverless · Proyek Perkuliahan Semester 5

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

---

*Sebuah perjalanan membangun aplikasi web modern berbasis serverless architecture dengan empat pilar teknologi cloud.*

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Arsitektur 4 Pilar](#️-arsitektur-4-pilar)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Panduan Setup Lokal](#-panduan-setup-lokal)
- [Struktur Direktori](#-struktur-direktori)
- [Variabel Lingkungan](#-variabel-lingkungan)
- [Aturan Git Branch](#-aturan-git-branch)
- [Scripts NPM](#-scripts-npm)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🌟 Tentang Proyek

**The Serverless Odyssey** adalah proyek perkuliahan berbasis *Full-Stack Serverless Architecture* yang dirancang untuk mengeksplorasi dan mengimplementasikan paradigma pengembangan modern tanpa manajemen server tradisional. Proyek ini mengintegrasikan empat pilar teknologi cloud kelas enterprise untuk membangun aplikasi web yang skalabel, aman, dan berperforma tinggi.

### ✨ Highlights
- ⚡ **Zero Cold-Start** — Vercel Edge Runtime untuk respons <100ms secara global
- 🔒 **DevSecOps-First** — Manajemen kredensial dan secrets sesuai standar industri
- 🌍 **Global CDN** — Media dioptimalkan secara otomatis via Cloudinary CDN
- 🗄️ **Realtime Database** — PostgreSQL terkelola penuh dengan Supabase Row-Level Security

---

## 🏛️ Arsitektur 4 Pilar

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE SERVERLESS ODYSSEY                      │
│                   Full-Stack Serverless Architecture             │
└─────────────────────────────────────────────────────────────────┘
         │                │                │                │
         ▼                ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   PILAR 1    │  │   PILAR 2    │  │   PILAR 3    │  │   PILAR 4    │
│  Next.js 16  │  │  Supabase    │  │  Cloudinary  │  │   Vercel     │
│  App Router  │  │  PostgreSQL  │  │  Media CDN   │  │ Edge Runtime │
├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ • App Router │  │ • PostgreSQL │  │ • Auto-resize│  │ • Edge Func  │
│ • TypeScript │  │ • Auth built-│  │ • WebP/AVIF  │  │ • ISR/SSG    │
│ • Turbopack  │  │   in         │  │   delivery   │  │ • Analytics  │
│ • Tailwind   │  │ • Realtime   │  │ • Lazy load  │  │ • CI/CD Auto │
│ • Server     │  │ • RLS Policy │  │ • Smart crop │  │ • Preview    │
│   Actions    │  │ • Edge Func  │  │ • AI bg-     │  │   Deploys    │
│              │  │              │  │   remove     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
       │                 │                 │                 │
       └─────────────────┴─────────────────┴─────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     USER BROWSER / CLIENT    │
                    │  Progressive Web App (PWA)   │
                    └──────────────────────────────┘
```

### Pilar 1 — Next.js 16 (App Router)
Framework React dengan paradigma **React Server Components (RSC)**. Menggunakan App Router untuk routing berbasis filesystem, Server Actions untuk mutasi data, dan Turbopack sebagai bundler generasi berikutnya.

### Pilar 2 — Supabase Cloud PostgreSQL
Backend-as-a-Service berbasis PostgreSQL open-source. Menyediakan **database terkelola**, autentikasi multi-provider, **Row-Level Security (RLS)**, realtime subscriptions, dan Edge Functions tanpa mengelola infrastruktur server.

### Pilar 3 — Cloudinary CDN
Platform manajemen media cloud dengan kemampuan **transformasi gambar/video on-the-fly**, optimasi format otomatis (WebP/AVIF), AI-powered smart cropping, dan pengiriman via CDN global dengan latensi rendah.

### Pilar 4 — Vercel Edge Runtime
Platform deployment Next.js native dengan **Edge Network global (30+ region)**, Incremental Static Regeneration (ISR), preview deployments otomatis per branch, dan pipeline CI/CD terintegrasi dengan GitHub.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Framework** | Next.js | 16.x (App Router) |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Media CDN** | Cloudinary | Latest |
| **Deployment** | Vercel Edge | Latest |
| **Linting** | ESLint + eslint-config-next | Latest |
| **Bundler** | Turbopack (dev) | Built-in |

---

## ✅ Prasyarat

Pastikan sistem Anda telah terinstall:

| Tools | Versi Minimum | Panduan Install |
|-------|---------------|-----------------|
| **Node.js** | `>= 20.x LTS` | [nodejs.org](https://nodejs.org/) |
| **npm** | `>= 10.x` | Bundled dengan Node.js |
| **Git** | `>= 2.40` | [git-scm.com](https://git-scm.com/) |

Akun layanan yang diperlukan:
- 🗄️ **Supabase** — [app.supabase.com](https://app.supabase.com) (Gratis tier tersedia)
- ☁️ **Cloudinary** — [cloudinary.com](https://cloudinary.com) (Gratis tier 25GB)
- 🚀 **Vercel** — [vercel.com](https://vercel.com) (Gratis tier tersedia)

---

## 🚀 Panduan Setup Lokal

### Langkah 1 — Clone Repositori

```bash
git clone https://github.com/YOUR_USERNAME/the-serverless-odyssey.git
cd the-serverless-odyssey
```

### Langkah 2 — Install Dependencies

```bash
npm install
```

### Langkah 3 — Setup Variabel Lingkungan

> ⚠️ **PENTING**: Jangan pernah commit file `.env.local` ke Git!

Salin template `.env.example` ke `.env.local`:

```bash
# Linux/macOS
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

Kemudian edit `.env.local` dan isi dengan nilai asli dari:
- **Supabase**: Dashboard → Project Settings → API
- **Cloudinary**: Console → Settings → API Keys
- **NextAuth Secret**: Jalankan `openssl rand -base64 32`

```env
# .env.local (JANGAN COMMIT!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
NEXTAUTH_SECRET=your-generated-32-char-secret
NEXTAUTH_URL=http://localhost:3000
```

### Langkah 4 — Verifikasi Proteksi Gitignore (DevSecOps Check)

```bash
# PowerShell (Windows)
echo ".env.local" | git check-ignore --stdin && Write-Host "✅ AMAN" || Write-Host "⛔ BAHAYA"

# Bash (Linux/macOS/Git Bash)
echo ".env.local" | git check-ignore --stdin && echo "✅ AMAN: .env.local terlindungi" || echo "⛔ BAHAYA: .env.local tidak diabaikan!"
```

### Langkah 5 — Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses **[http://localhost:3000](http://localhost:3000)** ✅

---

## 📁 Struktur Direktori

```
the-serverless-odyssey/
├── src/
│   ├── app/                    # Next.js App Router (pages & layouts)
│   │   ├── (auth)/             # Route group: autentikasi
│   │   ├── (dashboard)/        # Route group: halaman utama
│   │   ├── api/                # API Route Handlers (Server-side)
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # UI primitives (Button, Card, Input)
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utility libraries & configurations
│   │   ├── supabase/           # Supabase client (server & browser)
│   │   ├── cloudinary/         # Cloudinary configuration
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
├── supabase/                   # Supabase migrations & config
│   ├── migrations/             # SQL migration files
│   └── config.toml             # Supabase local config
├── .env.example                # ✅ Template aman (di-commit)
├── .env.local                  # ⛔ Kredensial asli (di-gitignore)
├── .gitignore                  # Git ignore rules
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## 🔐 Variabel Lingkungan

Referensi lengkap semua variabel lingkungan. Lihat [`.env.example`](./.env.example) untuk template.

| Variabel | Akses | Wajib | Deskripsi |
|----------|-------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | ✅ | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | ✅ | Kunci publik Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only** | ✅ | Kunci admin Supabase ⛔ |
| `SUPABASE_JWT_SECRET` | **Server Only** | ⚪ | JWT secret Supabase |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client + Server | ✅ | Nama cloud Cloudinary |
| `CLOUDINARY_API_KEY` | **Server Only** | ✅ | API Key Cloudinary |
| `CLOUDINARY_API_SECRET` | **Server Only** | ✅ | API Secret Cloudinary ⛔ |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Client + Server | ⚪ | Upload preset name |
| `NEXTAUTH_SECRET` | **Server Only** | ✅ | Session encryption key ⛔ |
| `NEXTAUTH_URL` | **Server Only** | ✅ | Canonical URL aplikasi |
| `NEXT_PUBLIC_APP_URL` | Client + Server | ✅ | Base URL publik |

> ⛔ = **SANGAT RAHASIA** — Jangan pernah ekspos ke client-side atau commit ke Git!
> ⚪ = Opsional

---

## 🌿 Aturan Git Branch

Proyek ini mengikuti **Git Flow** yang disederhanakan dengan 4 langkah workflow:

```
main ──────────────────────────────────────────── [PRODUCTION]
  │
  └── develop ────────────────────────────────── [STAGING/INTEGRATION]
         │
         ├── feature/nama-fitur ──────────────── [DEVELOPMENT]
         │      └── feat: deskripsi singkat
         │
         └── hotfix/nama-perbaikan ───────────── [EMERGENCY FIX]
                └── fix: deskripsi singkat
```

### Langkah 1 — Buat Branch Baru dari `develop`

```bash
# Untuk fitur baru
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur-anda

# Untuk hotfix darurat dari production
git checkout main
git checkout -b hotfix/nama-perbaikan
```

### Langkah 2 — Commit dengan Conventional Commits

Format: `<type>(<scope>): <deskripsi singkat>`

```bash
git commit -m "feat(auth): tambahkan login dengan Google OAuth"
git commit -m "fix(upload): perbaiki validasi ukuran file Cloudinary"
git commit -m "docs(readme): perbarui panduan setup lokal"
git commit -m "refactor(db): optimasi query Supabase untuk halaman beranda"
git commit -m "chore(deps): update Next.js ke versi 16.1.0"
```

| Type | Kegunaan |
|------|----------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Perubahan dokumentasi |
| `style` | Format kode (tidak mengubah logika) |
| `refactor` | Refactoring kode |
| `test` | Penambahan/perubahan test |
| `chore` | Update dependensi, konfigurasi |
| `perf` | Optimasi performa |

### Langkah 3 — Push & Buat Pull Request

```bash
git push origin feature/nama-fitur-anda
```

Buat **Pull Request** di GitHub:
- `feature/*` → merge ke `develop`
- `develop` → merge ke `main` (setelah review & testing)
- `hotfix/*` → merge ke `main` DAN `develop`

### Langkah 4 — Code Review & Merge

- Minimal **1 reviewer** sebelum merge ke `develop`
- Minimal **2 reviewer** sebelum merge ke `main`
- **Squash and Merge** untuk `feature/*`
- **Merge Commit** untuk `develop → main` (untuk traceability)
- Hapus branch setelah merge berhasil

---

## 📜 Scripts NPM

```bash
npm run dev          # Jalankan dev server dengan Turbopack (localhost:3000)
npm run build        # Build production bundle
npm run start        # Jalankan production server lokal
npm run lint         # Jalankan ESLint
```

---

## 🚀 Deployment

Proyek ini dikonfigurasi untuk **one-click deployment** ke Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/the-serverless-odyssey)

### Langkah Deployment Manual:
1. Push code ke branch `main`
2. Hubungkan repo GitHub ke Vercel Dashboard
3. Tambahkan semua variabel lingkungan dari `.env.example` di Vercel → Settings → Environment Variables
4. Deploy otomatis berjalan setiap push ke `main`

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Ikuti langkah berikut:

1. Fork repositori ini
2. Buat branch fitur (`git checkout -b feature/FiturMenarik`)
3. Commit perubahan Anda (`git commit -m 'feat: tambahkan FiturMenarik'`)
4. Push ke branch (`git push origin feature/FiturMenarik`)
5. Buka Pull Request ke branch `develop`

Pastikan code Anda:
- ✅ Lolos `npm run lint`
- ✅ Tidak membocorkan credentials atau secrets

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat [`LICENSE`](./LICENSE) untuk informasi lebih lanjut.

---

<div align="center">

Dibuat dengan ❤️ untuk keperluan perkuliahan · Semester 5

[![Next.js](https://img.shields.io/badge/Powered_by-Next.js_16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel_Edge-000000?style=flat-square&logo=vercel)](https://vercel.com/)

</div>
