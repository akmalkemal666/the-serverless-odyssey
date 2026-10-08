import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: {
    template: "%s | CloudTask Pro",
    default: "CloudTask Pro",
  },
  description:
    "Dashboard manajemen tugas serverless — The Serverless Odyssey",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header / Navigation Shell ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          {/* Logotype */}
          <Link
            href="/tasks"
            className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              CT
            </span>
            <span className="hidden sm:inline-block text-base font-bold tracking-tight">
              CloudTask Pro
            </span>
          </Link>

          {/* Nav Links */}
          <nav
            aria-label="Navigasi utama"
            className="flex flex-1 items-center gap-1"
          >
            <Link
              href="/tasks"
              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Tugas
            </Link>
          </nav>

          {/* Right-side actions */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <Separator />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
