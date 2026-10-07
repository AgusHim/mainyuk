"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getXPHistory, getXPSummary } from "@/redux/slices/gamificationSlice";
import { xpSourceLabel } from "@/types/gamification";
import { formatStrToDateTime } from "@/utils/convert";
import Link from "next/link";
import { useEffect } from "react";

const ProfileXPCard = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector((state) => state.gamification.summary);
  const history = useAppSelector((state) => state.gamification.history);
  const loading = useAppSelector((state) => state.gamification.loading);

  useEffect(() => {
    if (summary == null) {
      dispatch(getXPSummary());
    }
    if (history.length === 0) {
      dispatch(getXPHistory(1));
    }
  }, [dispatch, summary, history.length]);

  if (summary == null) {
    return (
      <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
        <p className="text-black">Memuat XP…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-black">Total XP</p>
          <h1 className="text-3xl font-bold text-black">{summary.total_xp}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-black">Level {summary.level}</p>
          <h2 className="text-lg font-semibold text-black">
            {summary.level_name}
          </h2>
          {summary.badge ? (
            <span className="mt-1 inline-block rounded-full border-2 border-black bg-white px-3 py-0.5 text-xs font-bold text-black">
              {summary.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <div className="h-4 w-full overflow-hidden rounded-full border-2 border-black bg-white">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${summary.progress_percent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-black">
          {summary.next_level
            ? `${summary.progress_percent}% menuju ${summary.next_level.name} — kurang ${summary.remaining_xp} XP`
            : "Sudah di level tertinggi"}
        </p>
      </div>

      <div className="mt-4 border-t-2 border-black pt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black">Riwayat XP</h3>
          <Link href="/profile/privacy" className="text-sm underline text-black">
            Pengaturan
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-black">
            {loading ? "Memuat…" : "Belum ada XP. Lengkapi profilmu untuk mulai."}
          </p>
        ) : (
          <ul className="mt-2 grid gap-2">
            {history.slice(0, 5).map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 text-sm text-black"
              >
                <div>
                  <p className="font-medium">{xpSourceLabel(entry.source_type)}</p>
                  <p className="text-xs">
                    {formatStrToDateTime(entry.created_at, "dd MMM yyyy HH:mm")}
                  </p>
                  {entry.note ? (
                    <p className="text-xs italic">{entry.note}</p>
                  ) : null}
                </div>
                <span
                  className={`font-bold ${
                    entry.delta > 0 ? "text-meta-3" : "text-danger"
                  }`}
                >
                  {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileXPCard;
