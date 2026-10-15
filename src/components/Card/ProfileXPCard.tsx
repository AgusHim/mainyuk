"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getXPHistory, getXPSummary } from "@/redux/slices/gamificationSlice";
import { xpSourceLabel } from "@/types/gamification";
import { formatStrToDateTime } from "@/utils/convert";
import { Award, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const ProfileXPCard = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector((state) => state.gamification.summary);
  const history = useAppSelector((state) => state.gamification.history);
  const loading = useAppSelector((state) => state.gamification.loading);
  const error = useAppSelector((state) => state.gamification.error);

  useEffect(() => {
    if (summary == null) dispatch(getXPSummary());
    if (history.length === 0) dispatch(getXPHistory(1));
  }, [dispatch, summary, history.length]);

  if (summary == null) {
    return (
      <section className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-6">
        <div className="h-4 w-20 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
        <div className="mt-4 h-10 w-28 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
        <div className="mt-6 h-2.5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      </section>
    );
  }

  const progress = Math.min(Math.max(summary.progress_percent, 0), 100);

  return (
    <section className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--yn-muted)]">
            Perjalananmu
          </p>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--yn-foreground)]">
              {summary.total_xp.toLocaleString("id-ID")}
            </p>
            <span className="mb-1 text-sm text-[var(--yn-muted)]">XP</span>
          </div>
        </div>
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
          <Award aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-[var(--yn-surface-muted)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--yn-muted)]">Level {summary.level}</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--yn-foreground)]">
              {summary.level_name}
            </p>
          </div>
          {summary.badge ? (
            <span className="rounded-full bg-[var(--yn-surface)] px-3 py-1 text-xs font-semibold text-[var(--yn-accent-dark)]">
              {summary.badge}
            </span>
          ) : null}
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--yn-surface)]">
          <div
            className="h-full rounded-full bg-[var(--yn-accent)] transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--yn-muted)]">
          {summary.next_level
            ? `${progress}% menuju ${summary.next_level.name} · ${summary.remaining_xp.toLocaleString("id-ID")} XP lagi`
            : "Kamu sudah mencapai level tertinggi."}
        </p>
      </div>

      <div className="mt-6 border-t border-[var(--yn-border)] pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--yn-foreground)]">
            Aktivitas terbaru
          </h3>
          <Sparkles aria-hidden="true" className="size-4 text-[var(--yn-accent-dark)]" />
        </div>

        {history.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-[var(--yn-muted)]">
            {loading
              ? "Memuat aktivitas…"
              : error
              ? "Aktivitas XP belum dapat dimuat."
              : "Lengkapi profil atau ikuti kegiatan untuk mulai mengumpulkan XP."}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--yn-border)]">
            {history.slice(0, 3).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--yn-foreground)]">
                    {xpSourceLabel(entry.source_type)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--yn-muted)]">
                    {formatStrToDateTime(entry.created_at, "dd MMM yyyy")}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    entry.delta > 0
                      ? "text-[var(--yn-accent-dark)]"
                      : "text-red-600"
                  }`}
                >
                  {entry.delta > 0 ? `+${entry.delta}` : entry.delta} XP
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/leaderboard"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--yn-accent-dark)] hover:underline"
      >
        Lihat leaderboard
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
};

export default ProfileXPCard;
