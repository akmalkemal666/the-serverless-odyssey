import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | CloudTask Pro",
    default: "CloudTask Pro — The Serverless Odyssey",
  },
  description:
    "Dashboard manajemen tugas full-stack serverless. Dibangun dengan Next.js 16, Supabase, Cloudinary, dan Vercel Edge.",
  keywords: ["nextjs", "supabase", "cloudinary", "vercel", "serverless"],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
