"use client";

import { useAppSelector } from "@/hooks/hooks";
import { ArrowUpRight, MapPin, Pencil, Settings2 } from "lucide-react";
import Link from "next/link";

const getInitials = (name?: string) =>
  (name ?? "YukNgaji")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const ProfileUserCard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const location = [user?.district?.name, user?.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[var(--yn-border)] bg-[var(--yn-surface)]">
      <div className="bg-[var(--yn-accent-soft)] px-5 py-4 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent-dark)]">
          Profil anggota
        </p>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent)] text-lg font-semibold text-white sm:size-20 sm:text-xl">
              {getInitials(user?.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
                {user?.name || "Anggota YukNgaji Solo"}
              </h2>
              <p className="mt-1 truncate text-sm text-[var(--yn-muted)]">
                {user?.email || "Email belum tersedia"}
              </p>
              {location ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--yn-muted)]">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  {location}
                </p>
              ) : null}
            </div>
          </div>

          <Link
            href="/profile/update"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--yn-border)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--yn-surface-muted)]"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit profil
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--yn-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--yn-muted)]">
            Perbarui data diri agar pengalaman event dan komunitasmu lebih
            sesuai.
          </p>
          <Link
            href="/profile/privacy"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--yn-accent-dark)] hover:underline"
          >
            <Settings2 aria-hidden="true" className="size-4" />
            Pengaturan privasi
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfileUserCard;
