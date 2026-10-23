"use client";

import ThreadCard from "@/components/Card/ThreadCard";
import FormThread from "@/components/Form/FormThread";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getLeaderboard } from "@/redux/slices/gamificationSlice";
import { getThreads } from "@/redux/slices/threadSlice";
import { LeaderboardPeriod } from "@/types/gamification";
import { ThreadSort } from "@/types/thread";
import { PenLine, Trophy } from "lucide-react";
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
  const isLeaderboardLoading = useAppSelector((state) => state.gamification.loading);
  const [sort, setSort] = useState<ThreadSort>("terbaru");
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [page, setPage] = useState(1);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setPage(1);
    dispatch(getThreads({ sort, page: 1 }));
  }, [dispatch, sort]);

  useEffect(() => {
    dispatch(getLeaderboard({ period, page: 1 }));
  }, [dispatch, period]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getThreads({ sort, page: next }));
  };

  return (
    <MainLayout>
      <CommonHeader title="Komunitas" isShowBack isShowTrailing={false} />
      <main className="yn-container py-7 sm:py-10">
        <section className="grid gap-6 bg-[var(--yn-surface-muted)] px-5 py-7 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--yn-foreground)] sm:text-5xl">
              Ruang untuk saling menguatkan.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--yn-foreground)] sm:text-lg">
              Bagikan cerita, pertanyaan, dan kabar baik bersama #TemanBahagia. Setiap kiriman tampil memakai alias komunitas agar percakapan tetap aman dan setara.
            </p>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="text-sm leading-6 text-[var(--yn-muted)]">
              Jaga adab, hindari serangan pribadi dan hoaks. Konten berisiko seperti judi, pinjaman ilegal, pornografi, atau penipuan akan ditindak.
            </p>
            <Link href="/profile/privacy" className="mt-4 w-fit text-sm font-semibold text-[var(--yn-accent-dark)] underline underline-offset-4 transition-colors hover:text-[var(--yn-foreground)]">
              Baca pengaturan privasi
            </Link>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8" aria-labelledby="thread-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="thread-title" className="text-2xl font-semibold tracking-[-0.03em] text-[var(--yn-foreground)]">Percakapan terbaru</h2>
                <p className="mt-1 text-sm text-[var(--yn-muted)]">Pilih percakapan yang ingin kamu ikuti.</p>
              </div>
              <div className="flex rounded-full bg-[var(--yn-surface-muted)] p-1" aria-label="Urutkan thread">
                {(["terbaru", "populer"] as ThreadSort[]).map((option) => (
                  <button key={option} type="button" onClick={() => setSort(option)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${sort === option ? "bg-[var(--yn-foreground)] text-white" : "text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]"}`}>
                    {option === "terbaru" ? "Terbaru" : "Populer"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {user ? isComposing ? <FormThread onCancel={() => setIsComposing(false)} /> : (
                <button type="button" onClick={() => setIsComposing(true)} className="flex w-full items-center justify-center gap-2 bg-[var(--yn-accent)] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--yn-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)]">
                  <PenLine className="size-4" aria-hidden="true" /> Tulis thread
                </button>
              ) : (
                <Link href="/signin?redirectTo=/community" className="block bg-[var(--yn-accent)] px-5 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--yn-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)]">
                  Masuk untuk ikut berbagi
                </Link>
              )}
            </div>

            {error ? <p role="alert" className="mt-5 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
            <div className="mt-6 space-y-3">
              {threads === null && isLoading ? <p className="py-8 text-sm text-[var(--yn-muted)]">Memuat percakapan…</p> : null}
              {threads !== null && threads.length === 0 ? <div className="bg-[var(--yn-surface-muted)] px-5 py-8 text-sm leading-6 text-[var(--yn-muted)]">Belum ada thread. Jadilah yang pertama membuka percakapan.</div> : null}
              {threads?.map((thread) => <ThreadCard key={thread.public_id} thread={thread} />)}
            </div>
            {hasMore ? <button type="button" onClick={loadMore} disabled={isLoading} className="mt-5 w-full bg-[var(--yn-surface-muted)] px-5 py-3 text-sm font-semibold text-[var(--yn-foreground)] transition-colors hover:bg-[var(--yn-border)] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Memuat…" : "Muat percakapan lainnya"}</button> : null}
          </section>

          <aside className="lg:col-span-4 lg:sticky lg:top-24" aria-labelledby="leaderboard-title">
            <section className="bg-[var(--yn-foreground)] p-5 text-white sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="leaderboard-title" className="text-2xl font-semibold tracking-[-0.03em]">Papan apresiasi</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">Apresiasi untuk teman yang aktif bertumbuh.</p>
                </div>
                <Trophy className="mt-1 size-5 shrink-0 text-[var(--yn-accent-soft)]" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Periode leaderboard">
                {periods.map((item) => <button key={item.value} type="button" onClick={() => setPeriod(item.value)} className={`text-sm transition-colors ${period === item.value ? "font-semibold text-white underline underline-offset-4" : "text-white/60 hover:text-white"}`}>{item.label}</button>)}
              </div>
              <ol className="mt-6 space-y-1">
                {isLeaderboardLoading && leaderboard === null ? <li className="py-3 text-sm text-white/70">Memuat leaderboard…</li> : null}
                {leaderboard?.entries.slice(0, 5).map((entry) => <li key={entry.public_id} className="flex items-center gap-3 py-3"><span className="w-5 text-sm tabular-nums text-white/60">{entry.rank}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{entry.alias}</span><span className="text-sm tabular-nums text-[var(--yn-accent-soft)]">{entry.xp} XP</span></li>)}
                {leaderboard && leaderboard.entries.length === 0 ? <li className="py-3 text-sm text-white/70">Belum ada aktivitas pada periode ini.</li> : null}
              </ol>
              <Link href="/leaderboard" className="mt-5 inline-block text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-[var(--yn-accent-soft)]">Lihat leaderboard lengkap</Link>
            </section>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
};

export default CommunityPage;
