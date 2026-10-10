"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../navItems";

export function FloatingNavBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="yn-hero-nav">
      {NAV_ITEMS.map((item) => {
        const active =
          item.path === "/"
            ? pathname === "/"
            : item.path.startsWith("/#")
              ? false
              : pathname === item.path || pathname.startsWith(`${item.path}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            aria-current={active ? "page" : undefined}
            className={`yn-hero-nav-link${active ? " is-active" : ""}`}
          >
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
