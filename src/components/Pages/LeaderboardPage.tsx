"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getLeaderboard } from "@/redux/slices/gamificationSlice";
import { LeaderboardPeriod } from "@/types/gamification";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

const periods: { value: LeaderboardPeriod; label: string }[] = [
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "all_time", label: "Sepanjang waktu" },
];

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const leaderboard = useAppSelector((state) => state.gamification.leaderboard);
  const isLoading = useAppSelector((state) => state.gamification.loading);
  const error = useAppSelector((state) => state.gamification.error);

  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");

  useEffect(() => {
    dispatch(getLeaderboard({ period, page: 1 }));
  }, [dispatch, period]);

  const loadMore = () => {
    if (leaderboard?.has_more) {
      dispatch(getLeaderboard({ period, page: leaderboard.page + 1 }));
    }
  };

  return (
    <RequiredAuthLayout redirectTo={"/leaderboard"}>
      <MainLayout>
        <CommonHeader
          title="Leaderboard"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          <div className="mb-4 flex gap-2">
            {periods.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                className={`rounded-lg border-2 border-black px-4 py-2 text-sm font-bold text-black ${
                  period === item.value ? "bg-primary text-white" : "bg-yellow-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error != null ? (
            <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
              {error}
            </div>
          ) : null}

          {leaderboard == null && isLoading ? (
            <p className="text-black">Memuat leaderboard…</p>
          ) : leaderboard != null && leaderboard.entries.length === 0 ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">
                Belum ada aktivitas pada periode ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {leaderboard?.entries.map((entry) => (
                <div
                  key={entry.public_id}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-yellow-300 p-3 shadow-custom"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-sm font-bold ${
                        entry.rank <= 3 ? "bg-primary text-white" : "bg-white text-black"
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-black">{entry.alias}</p>
                      <p className="text-xs text-black">
                        Level {entry.level} · {entry.level_name}
                        {entry.badge ? ` · ${entry.badge}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-black">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          )}

          {leaderboard?.has_more ? (
            <div className="mt-4">
              <Button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
                style={{ boxShadow: "0px 5px 0px 0px #000000" }}
              >
                {isLoading ? "Memuat…" : "Muat lebih banyak"}
              </Button>
            </div>
          ) : null}
        </div>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
