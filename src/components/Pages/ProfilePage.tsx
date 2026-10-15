"use client";

import ProfileDonationsCard from "@/components/Card/ProfileDonationsCard";
import ProfileMenuCard from "@/components/Card/ProfileMenuCard";
import ProfileUserCard from "@/components/Card/ProfileUserCard";
import ProfileXPCard from "@/components/Card/ProfileXPCard";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function ProfilePage() {
  return (
    <RequiredAuthLayout redirectTo="/profile">
      <MainLayout>
        <CommonHeader title="Akun" isShowBack isShowTrailing={false} />
        <main className="yn-container pb-12 pt-8 md:pb-20 md:pt-14">
          <section className="border-b border-[var(--yn-border)] pb-9 md:pb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent-dark)]">
              Ruang pribadimu
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--yn-foreground)] sm:text-5xl">
              Akun dan perjalananmu
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--yn-muted)]">
              Kelola profil, lihat perkembangan kontribusi, dan lanjutkan
              langkah baikmu bersama YukNgaji Solo.
            </p>
          </section>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <ProfileUserCard />
              <ProfileDonationsCard />
            </div>
            <div className="space-y-5 lg:sticky lg:top-28">
              <ProfileXPCard />
              <ProfileMenuCard />
            </div>
          </div>

          <section className="mt-8 grid gap-3 border-t border-[var(--yn-border)] pt-8 sm:grid-cols-3">
            <p className="flex items-start gap-2 text-xs leading-5 text-[var(--yn-muted)]">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--yn-accent-dark)]" />
              Pengaturan privasi dan data akun ada dalam kendalimu.
            </p>
            <p className="flex items-start gap-2 text-xs leading-5 text-[var(--yn-muted)]">
              <HeartHandshake aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--yn-accent-dark)]" />
              Donasi dan kontribusi dapat dipantau dalam satu tempat.
            </p>
            <p className="flex items-start gap-2 text-xs leading-5 text-[var(--yn-muted)]">
              <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--yn-accent-dark)]" />
              XP bertambah dari aktivitas yang telah terverifikasi.
            </p>
          </section>
        </main>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
