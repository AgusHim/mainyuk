"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  claimMission,
  getMissionDetail,
  getMyClaims,
} from "@/redux/slices/missionSlice";
import {
  claimStatusLabel,
  missionTypeLabel,
  verificationModeLabel,
} from "@/types/mission";
import { formatStrToDateTime } from "@/utils/convert";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function MissionDetailPage() {
  const params = useParams<{ id: string }>();
  const missionId = params?.id ?? "";

  const dispatch = useAppDispatch();
  const mission = useAppSelector((state) => state.mission.mission);
  const myClaims = useAppSelector((state) => state.mission.myClaims);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  const [proofUrl, setProofUrl] = useState("");
  const [proofNote, setProofNote] = useState("");

  useEffect(() => {
    if (missionId) {
      dispatch(getMissionDetail(missionId));
    }
    if (myClaims.length === 0) {
      dispatch(getMyClaims(1));
    }
  }, [dispatch, missionId, myClaims.length]);

  const claimsForMission = myClaims.filter(
    (claim) => claim.mission_id === missionId
  );

  const handleClaim = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(
      claimMission({
        id: missionId,
        data: {
          proof_url: proofUrl === "" ? null : proofUrl,
          proof_note: proofNote === "" ? null : proofNote,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Klaim terkirim");
        setProofUrl("");
        setProofNote("");
        dispatch(getMyClaims(1));
        dispatch(getMissionDetail(missionId));
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  return (
    <RequiredAuthLayout redirectTo={`/missions/${missionId}`}>
      <MainLayout>
        <CommonHeader
          title="Detail Misi"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          {error != null && mission == null ? (
            <div
              role="alert"
              className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
            >
              <span>{error}</span>
            </div>
          ) : mission == null ? (
            <p className="text-black">
              {isLoading ? "Memuat misi…" : "Misi tidak ditemukan."}
            </p>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
                      {missionTypeLabel(mission.type)}
                    </span>
                    <h1 className="mt-2 text-xl font-bold text-black">
                      {mission.title}
                    </h1>
                  </div>
                  <span className="whitespace-nowrap rounded-full border-2 border-black bg-primary px-3 py-1 text-sm font-bold text-white">
                    +{mission.reward_xp} XP
                  </span>
                </div>

                {mission.description ? (
                  <p className="mt-3 text-sm text-black">
                    {mission.description}
                  </p>
                ) : null}

                <dl className="mt-3 grid gap-1 text-sm text-black">
                  <div className="flex justify-between gap-3">
                    <dt>Verifikasi</dt>
                    <dd className="font-medium">
                      {verificationModeLabel(mission.verification_mode)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Periode</dt>
                    <dd className="font-medium">{mission.current_period_key}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Batas klaim</dt>
                    <dd className="font-medium">{mission.claim_limit}× per periode</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Berakhir</dt>
                    <dd className="font-medium">
                      {formatStrToDateTime(mission.ends_at, "dd MMM yyyy HH:mm")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="font-semibold text-black">Klaim misi</h2>
                {!mission.can_claim_now ? (
                  <p className="mt-2 text-sm text-black">
                    Jendela klaim misi ini sedang tertutup.
                  </p>
                ) : (
                  <form onSubmit={handleClaim} className="mt-3 grid gap-3">
                    {mission.required_proof ? (
                      <p className="text-xs text-black">
                        Misi ini mewajibkan bukti berupa tautan atau catatan.
                      </p>
                    ) : null}
                    <div className="space-y-1.5">
                      <Label htmlFor="proof_url" className="font-bold text-black">
                        Tautan bukti
                      </Label>
                      <Input
                        id="proof_url"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        placeholder="https://…"
                        className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="proof_note" className="font-bold text-black">
                        Catatan bukti
                      </Label>
                      <Input
                        id="proof_note"
                        value={proofNote}
                        onChange={(e) => setProofNote(e.target.value)}
                        placeholder="Keterangan singkat"
                        className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium"
                      />
                    </div>
                    <div>
                      {isLoading ? (
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                      ) : (
                        <Button
                          type="submit"
                          className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
                          style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                        >
                          Kirim Klaim
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="font-semibold text-black">Riwayat klaim</h2>
                {claimsForMission.length === 0 ? (
                  <p className="mt-2 text-sm text-black">
                    Belum ada klaim untuk misi ini.
                  </p>
                ) : (
                  <ul className="mt-2 grid gap-2">
                    {claimsForMission.map((claim) => (
                      <li
                        key={claim.id}
                        className="flex items-center justify-between gap-3 text-sm text-black"
                      >
                        <div>
                          <p className="font-medium">
                            {claimStatusLabel(claim.status)}
                          </p>
                          <p className="text-xs">{claim.period_key}</p>
                          {claim.decision_reason ? (
                            <p className="text-xs italic">
                              {claim.decision_reason}
                            </p>
                          ) : null}
                        </div>
                        <span className="font-bold">
                          {claim.reward_xp != null ? `+${claim.reward_xp} XP` : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
