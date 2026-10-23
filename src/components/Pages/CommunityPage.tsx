"use client";

import ThreadCard from "@/components/Card/ThreadCard";
import FormThread from "@/components/Form/FormThread";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getLeaderboard } from "@/redux/slices/gamificationSlice";
import { getSessionUser } from "@/redux/slices/authSlice";
import { getMissions } from "@/redux/slices/missionSlice";
import { getThreads } from "@/redux/slices/threadSlice";
import { LeaderboardPeriod } from "@/types/gamification";
import { ThreadSort } from "@/types/thread";
import { Heart, Home, MessageCircle, PenLine, Search, ShoppingBag, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const periods: { value: LeaderboardPeriod; label: string }[] = [
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "all_time", label: "Semua waktu" },
];

const CommunityPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const threads = useAppSelector((state) => state.thread.threads);
  const hasMore = useAppSelector((state) => state.thread.threadsHasMore);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const error = useAppSelector((state) => state.thread.error);
  const leaderboard = useAppSelector((state) => state.gamification.leaderboard);
  const missions = useAppSelector((state) => state.mission.missions);
  const [sort, setSort] = useState<ThreadSort>("terbaru");
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [page, setPage] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (user) {
      setIsCheckingSession(false);
      return;
    }
    void dispatch(getSessionUser()).finally(() => setIsCheckingSession(false));
  }, [dispatch, user]);

  useEffect(() => {
    setPage(1);
    dispatch(getThreads({ sort, page: 1 }));
  }, [dispatch, sort]);
  useEffect(() => {
    dispatch(getLeaderboard({ period, page: 1 }));
  }, [dispatch, period]);
  useEffect(() => {
    if (missions === null) dispatch(getMissions());
  }, [dispatch, missions]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getThreads({ sort, page: next }));
  };

  return (
    <MainLayout>
      <main className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-[220px_minmax(0,640px)_300px] lg:justify-center lg:gap-10 lg:px-8">
        <aside className="border-b border-[var(--yn-border)] px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:px-0 lg:py-8" aria-label="Menu komunitas">
          <Link className="mb-5 inline-block" href="/">
            <Image
              className="hidden dark:block"
              src={"/images/logo/yn_logo.png"}
              alt="Logo"
              width={50}
              height={28}
            />
            <Image
              className="dark:hidden"
              src={"/images/logo/yn_logo.png"}
              alt="Logo"
              width={50}
              height={28}
            />
          </Link>
          <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col" aria-label="Navigasi komunitas">
            <Link href="/community" className="flex shrink-0 items-center gap-3 bg-[var(--yn-foreground)] px-4 py-3 text-sm font-semibold text-white"><Home className="size-4" /> Untukmu</Link>
            {isCheckingSession ? <span className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm text-[var(--yn-muted)]"><PenLine className="size-4" /> Memeriksa sesi…</span> : user ? <button type="button" onClick={() => setIsComposing(true)} className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><PenLine className="size-4" /> Tulis kiriman</button> : <Link href="/signin?redirectTo=/community" className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><PenLine className="size-4" /> Tulis kiriman</Link>}
            <Link href="/donations" className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><Heart className="size-4" /> Campaign donasi</Link>
            <Link href="/shop" className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><ShoppingBag className="size-4" /> Shop</Link>
            <Link href="/community#threads" className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><Search className="size-4" /> Cari percakapan</Link>
          </nav>
          {!user && !isCheckingSession ? <Link href="/signin?redirectTo=/community" className="mt-6 hidden bg-[var(--yn-accent)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--yn-accent-dark)] lg:block">Masuk untuk berinteraksi</Link> : null}
        </aside>

        <section id="threads" className="border-x-0 border-[var(--yn-border)] lg:border-x" aria-labelledby="community-title">
          <header className="sticky top-0 z-10 flex items-center justify-between bg-[var(--yn-background)]/95 px-5 py-5 backdrop-blur-sm">
            <h1 id="community-title" className="text-xl font-semibold tracking-[-0.03em] text-[var(--yn-foreground)]">Don't Hurt Anyone</h1>
            <div className="flex gap-2" aria-label="Urutkan feed">
              {(["terbaru", "populer"] as ThreadSort[]).map((option) => <button key={option} type="button" onClick={() => setSort(option)} className={`px-3 py-1.5 text-sm ${sort === option ? "font-semibold text-[var(--yn-foreground)] underline underline-offset-4" : "text-[var(--yn-muted)]"}`}>{option === "terbaru" ? "Terbaru" : "Populer"}</button>)}
            </div>
          </header>

          <div className="px-5 pb-8">
            {isCheckingSession ? <div className="bg-[var(--yn-surface-muted)] px-4 py-4 text-sm text-[var(--yn-muted)]">Memeriksa sesi…</div> : user ? (
              isComposing ? <FormThread onCancel={() => setIsComposing(false)} /> : <button type="button" onClick={() => setIsComposing(true)} className="flex w-full items-center gap-3 bg-[var(--yn-surface-muted)] px-4 py-4 text-left text-sm text-[var(--yn-muted)] hover:bg-[var(--yn-accent-soft)]"><MessageCircle className="size-5 text-[var(--yn-accent)]" /> Apa kabar hari ini?</button>
            ) : <Link href="/signin?redirectTo=/community" className="block bg-[var(--yn-surface-muted)] px-4 py-4 text-sm text-[var(--yn-muted)] hover:bg-[var(--yn-accent-soft)]">Masuk untuk berbagi cerita dengan komunitas.</Link>}
          </div>

          {error ? <p role="alert" className="mx-5 mb-4 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
          {threads === null && isLoading ? <p className="px-5 py-8 text-sm text-[var(--yn-muted)]">Memuat percakapan…</p> : null}
          {threads !== null && threads.length === 0 ? <p className="px-5 py-8 text-sm text-[var(--yn-muted)]">Belum ada kiriman. Jadilah yang pertama berbagi.</p> : null}
          <div className="divide-y divide-[var(--yn-border)]">{threads?.map((thread) => <ThreadCard key={thread.public_id} thread={thread} />)}</div>
          {hasMore ? <button type="button" onClick={loadMore} disabled={isLoading} className="m-5 block bg-[var(--yn-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--yn-foreground)] disabled:opacity-60">{isLoading ? "Memuat…" : "Muat kiriman lainnya"}</button> : null}
        </section>

        <aside className="space-y-8 px-5 py-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:px-0" aria-label="Ringkasan komunitas">
          <section aria-labelledby="leaderboard-title">
            <div className="flex items-center justify-between"><h2 id="leaderboard-title" className="text-lg font-semibold tracking-[-0.025em]">Leaderboard</h2><Trophy className="size-5 text-[var(--yn-accent)]" /></div>
            <div className="mt-3 flex gap-4">{periods.map((item) => <button key={item.value} type="button" onClick={() => setPeriod(item.value)} className={`text-xs ${period === item.value ? "font-semibold text-[var(--yn-foreground)] underline underline-offset-4" : "text-[var(--yn-muted)]"}`}>{item.label}</button>)}</div>
            <ol className="mt-4 divide-y divide-[var(--yn-border)]">{leaderboard?.entries.slice(0, 5).map((entry) => <li key={entry.public_id} className="flex items-center gap-3 py-3"><span className="w-5 text-sm tabular-nums text-[var(--yn-muted)]">{entry.rank}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{entry.alias}</span><span className="text-sm tabular-nums text-[var(--yn-accent-dark)]">{entry.xp} XP</span></li>)}</ol>
            <Link href="/leaderboard" className="mt-4 inline-block text-sm font-semibold text-[var(--yn-accent-dark)] underline underline-offset-4">Lihat semua</Link>
          </section>

          <section aria-labelledby="mission-title" className="bg-[var(--yn-surface-muted)] p-5">
            <div className="flex items-center justify-between"><h2 id="mission-title" className="text-lg font-semibold tracking-[-0.025em]">Misi untukmu</h2><Sparkles className="size-5 text-[var(--yn-accent)]" /></div>
            <div className="mt-4 space-y-3">{missions?.slice(0, 3).map((mission) => <Link key={mission.id} href={`/missions/${mission.id}`} className="block text-sm hover:text-[var(--yn-accent-dark)]"><span className="block font-semibold">{mission.title}</span><span className="mt-1 block text-[var(--yn-muted)]">+{mission.reward_xp} XP</span></Link>)}</div>
            <Link href="/missions" className="mt-5 inline-block text-sm font-semibold text-[var(--yn-accent-dark)] underline underline-offset-4">Lihat semua misi</Link>
          </section>
        </aside>
      </main>
    </MainLayout>
  );
};

export default CommunityPage;
