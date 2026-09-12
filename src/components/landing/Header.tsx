"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#temanbahagia", label: "Tentang" },
  { href: "#aktivitas", label: "Aktivitas" },
  { href: "#event", label: "Events" },
  { href: "#momen", label: "Momen" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-[var(--yn-border)] bg-[var(--yn-background)]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="yn-container flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="YukNgaji Solo">
          <img
            src="/images/logo/yn_logo.png"
            alt="Logo YukNgaji Solo"
            className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
          />
          <span className="text-base font-semibold tracking-tight md:text-lg">
            YukNgaji Solo
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--yn-muted)] transition-colors hover:text-[var(--yn-foreground)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/events"
            className="rounded-full bg-[var(--yn-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[var(--yn-accent-dark)]"
          >
            Lihat Event
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Buka menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] md:hidden"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2L16 16M16 2L2 16" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M1 1H17M1 7H17M1 13H17" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--yn-border)] bg-[var(--yn-background)] md:hidden">
          <nav className="yn-container flex flex-col gap-1 py-4" aria-label="Navigasi mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-[var(--yn-foreground)] transition-colors hover:bg-[var(--yn-surface-muted)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/events"
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-[var(--yn-accent)] px-5 py-3 text-base font-semibold text-white"
            >
              Lihat Event
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
