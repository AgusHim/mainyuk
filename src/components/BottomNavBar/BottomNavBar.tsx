"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../navItems";

export function BottomNavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const linkStyle = (path: string) =>
    isActive(path)
      ? "text-[var(--yn-foreground)]"
      : "text-[var(--yn-muted)]";

  return (
    <div className="yn-container sticky bottom-0 z-20 mx-auto w-full md:hidden">
      <div className="flex justify-around border-t border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 py-2">
        {NAV_ITEMS.map((menu) => (
          <Link
            key={menu.path}
            href={menu.path}
            className={`flex cursor-pointer flex-col items-center justify-center ${linkStyle(
              menu.path
            )}`}
          >
            <div className="mb-2">
              <div className="flex h-5 w-6 justify-center">{menu.icon}</div>
            </div>
            <div className="text-xs font-normal">{menu.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
