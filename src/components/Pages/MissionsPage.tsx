"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { claimMission, getMissions, getMyClaims } from "@/redux/slices/missionSlice";
import { ClaimView, MissionView } from "@/types/mission";
import { Check, ChevronLeft, ChevronRight, MoonStar, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), { ssr: false });
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const dailyCodes = new Set(["daily_subuh_jamaah", "daily_sedekah_subuh"]);
const dateKey = (date: Date) => `daily:${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function Calendar({ month, claims }: { month: Date; claims: ClaimView[] }) {
  const completed = new Map<string, number>();
  claims.filter((claim) => claim.status === "approved" && claim.period_key.startsWith("daily:")).forEach((claim) => completed.set(claim.period_key, (completed.get(claim.period_key) ?? 0) + 1));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const blankDays = (first.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = dateKey(new Date());
  return <div className="grid grid-cols-7 border-l border-t border-[var(--yn-border)]">{weekdays.map((day) => <div key={day} className="border-b border-r border-[var(--yn-border)] py-2 text-center text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--yn-muted)]">{day}</div>)}{Array.from({ length: blankDays + days }, (_, index) => {
    if (index < blankDays) return <div key={`blank-${index}`} className="min-h-15 border-b border-r border-[var(--yn-border)] bg-[var(--yn-surface-muted)]/40" />;
    const date = new Date(month.getFullYear(), month.getMonth(), index - blankDays + 1); const key = dateKey(date); const count = completed.get(key) ?? 0;
    return <div key={key} className={`relative min-h-15 border-b border-r border-[var(--yn-border)] p-2 ${key === today ? "bg-[var(--yn-accent-soft)]" : "bg-[var(--yn-surface)]"}`}><span className="text-xs font-semibold">{date.getDate()}</span>{count ? <span title={`${count} misi selesai`} className="absolute bottom-2 right-2 flex size-5 items-center justify-center rounded-full bg-[var(--yn-accent)] text-white"><Check className="size-3" /></span> : null}</div>;
  })}</div>;
}

export default function MissionsPage() {
  const dispatch = useAppDispatch(); const missions = useAppSelector((state) => state.mission.missions); const claims = useAppSelector((state) => state.mission.myClaims); const error = useAppSelector((state) => state.mission.error);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1)); const [claiming, setClaiming] = useState<string | null>(null); const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => { if (missions === null) dispatch(getMissions()); dispatch(getMyClaims({ page: 1, perPage: 100 })); }, [dispatch, missions]);
  const daily = useMemo(() => (missions ?? []).filter((mission) => mission.type === "daily" || dailyCodes.has(mission.code)), [missions]);
  const claim = async (mission: MissionView) => { setClaiming(mission.id); setNotice(null); try { await dispatch(claimMission({ id: mission.id, data: {} })).unwrap(); setNotice(`Alhamdulillah, +${mission.reward_xp} XP sudah masuk.`); dispatch(getMyClaims({ page: 1, perPage: 100 })); dispatch(getMissions()); } catch (e: any) { setNotice(e?.message || "Misi belum dapat diklaim."); } finally { setClaiming(null); } };
  return <RequiredAuthLayout redirectTo="/missions"><MainLayout><CommonHeader title="Misi" isShowBack isShowTrailing={false} /><main className="yn-container max-w-5xl pb-24 pt-8 sm:pt-12"><header className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--yn-accent)]">Amalan harian</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[var(--yn-foreground)] sm:text-5xl">Rawat kebiasaan kecil, setiap hari.</h1><p className="mt-4 text-sm leading-6 text-[var(--yn-muted)]">Tandai perjalananmu lewat check-in. Misi Subuh dapat diklaim pukul 04.00–06.00 WIB.</p></header>{error ? <p role="alert" className="mt-7 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}{notice ? <p className="mt-7 border border-[var(--yn-accent)] bg-[var(--yn-accent-soft)] px-4 py-3 text-sm font-medium text-[var(--yn-accent-dark)]">{notice}</p> : null}<div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]"><section className="border border-[var(--yn-border)] bg-[var(--yn-surface)] p-4 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[var(--yn-muted)]">Kalender check-in</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{months[month.getMonth()]} {month.getFullYear()}</h2></div><div className="flex gap-1"><button aria-label="Bulan sebelumnya" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 hover:bg-[var(--yn-surface-muted)]"><ChevronLeft className="size-5" /></button><button aria-label="Bulan berikutnya" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 hover:bg-[var(--yn-surface-muted)]"><ChevronRight className="size-5" /></button></div></div><Calendar month={month} claims={claims} /><p className="mt-4 text-xs text-[var(--yn-muted)]"><span className="mr-1 inline-flex size-4 align-middle rounded-full bg-[var(--yn-accent)]" /> Check-in harian berhasil</p></section><aside className="space-y-3"><div className="flex items-center gap-2"><MoonStar className="size-5 text-[var(--yn-accent)]" /><h2 className="text-lg font-semibold">Misi harian</h2></div>{daily.map((mission) => <article key={mission.id} className={`border p-5 ${mission.can_claim_now ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]" : "border-[var(--yn-border)] bg-[var(--yn-surface)]"}`}><div className="flex gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--yn-accent)]" /><div><h3 className="font-semibold">{mission.title}</h3><p className="mt-1 text-sm leading-5 text-[var(--yn-muted)]">{mission.description}</p></div></div><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[var(--yn-accent-dark)]">+{mission.reward_xp} XP</span><button onClick={() => void claim(mission)} disabled={!mission.can_claim_now || claiming === mission.id} className="border border-[var(--yn-foreground)] px-3 py-2 text-xs font-semibold hover:bg-[var(--yn-foreground)] hover:text-white disabled:cursor-not-allowed disabled:border-[var(--yn-border)] disabled:text-[var(--yn-muted)]">{claiming === mission.id ? "Mengklaim…" : mission.can_claim_now ? "Klaim" : "Tersedia saat Subuh"}</button></div></article>)}</aside></div></main></MainLayout></RequiredAuthLayout>;
}
