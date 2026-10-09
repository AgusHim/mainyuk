"use client";
import { ReactNode } from "react";
import { FloatingNavBar } from "@/components/FloatingNavBar/FloatingNavBar";

interface LayoutProps {
  children: ReactNode;
  // nav=false untuk alur terfokus yang tidak memakai navigasi utama
  // (masuk, checkout, pindai tiket, panggilan suara).
  nav?: boolean;
}

// Shell bersama semua halaman aplikasi. FloatingNavBar dipasang di sini, jadi
// setiap halaman yang memakai MainLayout otomatis dapat navigasi yang sama —
// tidak perlu lagi memasangnya per halaman. pb-24/md:pb-28 memberi ruang agar
// konten terakhir tidak tertutup pill yang posisinya fixed.
export const MainLayout: React.FC<LayoutProps> = ({ children, nav = true }) => {
  return (
    <div
      className={`min-h-screen w-full bg-[var(--yn-background)] text-[var(--yn-foreground)] ${
        nav ? "pb-24 md:pb-28" : ""
      }`}
    >
      {children}
      {nav && <FloatingNavBar />}
    </div>
  );
};
