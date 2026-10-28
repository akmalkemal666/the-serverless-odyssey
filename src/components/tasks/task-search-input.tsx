"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskSearchInputProps {
  defaultValue?: string;
}

/**
 * TaskSearchInput — Komponen client untuk pencarian tugas real-time.
 *
 * - Sinkronisasi dua arah dengan URL search params (?search=...)
 * - Debounce 300ms untuk menghindari terlalu banyak navigasi
 * - Reset ke page=1 saat query berubah
 * - Tombol clear (×) muncul saat ada nilai
 */
export function TaskSearchInput({ defaultValue = "" }: TaskSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sinkronisasi nilai input dengan URL saat pertama render
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (inputRef.current && inputRef.current.value !== urlSearch) {
      inputRef.current.value = urlSearch;
    }
  }, [searchParams]);

  /** Bangun URL baru dengan search param yang diperbarui */
  const buildUrl = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      // Reset selalu ke halaman pertama saat filter berubah
      params.set("page", "1");
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  /** Navigasi dengan debounce 300ms */
  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(buildUrl(value));
  }, 300);

  /** Clear: kosongkan input dan hapus search param dari URL */
  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const hasValue = Boolean(defaultValue);

  return (
    <div className="relative flex-1 max-w-sm">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        id="task-search-input"
        type="search"
        placeholder="Cari tugas…"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9 h-9 text-sm"
        aria-label="Cari tugas berdasarkan judul"
        autoComplete="off"
      />
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
