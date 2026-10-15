"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logOutUser } from "@/redux/slices/authSlice";
import {
  ChevronRight,
  LogOut,
  Medal,
  ReceiptText,
  Ticket,
  Trophy,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MenuItem = {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  roles: string[] | "all";
};

const menu: MenuItem[] = [
  {
    name: "Misi",
    description: "Lanjutkan target dan kontribusimu.",
    icon: <Medal aria-hidden="true" className="size-4" />,
    href: "/missions",
    roles: "all",
  },
  {
    name: "Leaderboard",
    description: "Lihat perjalanan anggota lain.",
    icon: <Trophy aria-hidden="true" className="size-4" />,
    href: "/leaderboard",
    roles: "all",
  },
  {
    name: "Riwayat transaksi",
    description: "Tiket, donasi, dan pesanan shop.",
    icon: <ReceiptText aria-hidden="true" className="size-4" />,
    href: "/orders",
    roles: "all",
  },
  {
    name: "Jelajahi event",
    description: "Temukan kegiatan YukNgaji Solo.",
    icon: <Ticket aria-hidden="true" className="size-4" />,
    href: "/events",
    roles: "all",
  },
  {
    name: "Kartu Ranger",
    description: "Akses kartu identitas Ranger.",
    icon: <UserRoundCheck aria-hidden="true" className="size-4" />,
    href: "/dashboard/rangers/card",
    roles: ["ranger", "admin", "pj"],
  },
];

const ProfileMenuCard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const items = menu.filter(
    (item) => item.roles === "all" || item.roles.includes(user?.role ?? "user")
  );

  const handleLogout = () => {
    dispatch(logOutUser(null));
    router.replace("/signin");
  };

  return (
    <section className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--yn-muted)]">
        Jelajahi
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--yn-foreground)]">
        Kontribusi dan aktivitas
      </h2>

      <nav className="mt-4 divide-y divide-[var(--yn-border)]" aria-label="Menu akun">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--yn-surface-muted)] text-[var(--yn-muted)] transition group-hover:bg-[var(--yn-accent-soft)] group-hover:text-[var(--yn-accent-dark)]">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--yn-foreground)]">
                {item.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-[var(--yn-muted)]">
                {item.description}
              </span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="size-4 shrink-0 text-[var(--yn-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--yn-accent-dark)]"
            />
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Keluar dari akun
      </button>
    </section>
  );
};

export default ProfileMenuCard;
