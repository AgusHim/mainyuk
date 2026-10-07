"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getMissions, getMyClaims } from "@/redux/slices/missionSlice";
import { claimStatusLabel, missionTypeLabel } from "@/types/mission";
import { formatStrToDateTime } from "@/utils/convert";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function MissionsPage() {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((state) => state.mission.missions);
  const myClaims = useAppSelector((state) => state.mission.myClaims);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  useEffect(() => {
    if (missions == null) {
      dispatch(getMissions());
    }
    if (myClaims.length === 0) {
      dispatch(getMyClaims(1));
    }
  }, [dispatch, missions, myClaims.length]);

  // Klaim terbaru per misi, supaya kartu misi dapat menampilkan status terakhir
  // anggota pada periode yang sedang berjalan.
  const latestClaimByMission = new Map<string, (typeof myClaims)[number]>();
  myClaims.forEach((claim) => {
    if (!latestClaimByMission.has(claim.mission_id)) {
      latestClaimByMission.set(claim.mission_id, claim);
    }
  });

  return (
    <RequiredAuthLayout redirectTo={"/missions"}>
      <MainLayout>
        <CommonHeader
          title="Misi"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          {error != null ? (
            <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
              {error}
            </div>
          ) : null}

          {missions == null && isLoading ? (
            <p className="text-black">Memuat misi…</p>
          ) : missions != null && missions.length === 0 ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">
                Belum ada misi yang dibuka. Cek lagi nanti.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {missions?.map((mission) => {
                const claim = latestClaimByMission.get(mission.id);
                return (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="block rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
                          {missionTypeLabel(mission.type)}
                        </span>
                        <h2 className="mt-2 text-lg font-semibold text-black">
                          {mission.title}
                        </h2>
                        {mission.description ? (
                          <p className="text-sm text-black">
                            {mission.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="whitespace-nowrap rounded-full border-2 border-black bg-primary px-3 py-1 text-sm font-bold text-white">
                        +{mission.reward_xp} XP
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-black">
                      Berakhir{" "}
                      {formatStrToDateTime(mission.ends_at, "dd MMM yyyy HH:mm")}
                    </p>

                    {claim ? (
                      <p className="mt-1 text-xs font-bold text-black">
                        Status klaim terakhir: {claimStatusLabel(claim.status)}
                      </p>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
