"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../navItems";

// Pill navigasi mengambang untuk halaman home (landing).
//
// Halaman landing tidak memakai BottomNavBar, sehingga modul baru (Komunitas,
// Toko, Transaksi) tidak punya pintu masuk dari home. Navbar ini menutup celah
// itu di semua ukuran layar — fixed di tengah bawah, jadi tetap terlihat saat
// pengunjung menggulir landing.
export function FloatingNavBar() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:bottom-6">
      <nav
        aria-label="Navigasi utama"
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)]/80 p-1.5 shadow-[0_10px_30px_-8px_rgba(23,23,23,0.25)] backdrop-blur-xl"
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[52px] flex-col items-center justify-center gap-1 rounded-full px-2.5 py-2 text-[10px] font-medium transition-colors md:min-w-[60px] md:text-[11px] ${
                active
                  ? "bg-[var(--yn-accent)] text-white"
                  : "text-[var(--yn-muted)] hover:bg-[var(--yn-surface-muted)] hover:text-[var(--yn-foreground)]"
              }`}
            >
              <span className="flex h-5 items-center justify-center [&_svg]:size-5">
                {item.icon}
              </span>
              <span className="whitespace-nowrap leading-none">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
