"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  approveClaim,
  getClaimsForReview,
  rejectClaim,
  removeClaimFromQueue,
} from "@/redux/slices/missionSlice";
import { claimStatusLabel, ClaimStatus } from "@/types/mission";
import { formatStrToDateTime } from "@/utils/convert";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

const TableMissionClaims = () => {
  const dispatch = useAppDispatch();
  const claims = useAppSelector((state) => state.mission.claimsForReview);
  const hasMore = useAppSelector((state) => state.mission.claimsHasMore);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  const [status, setStatus] = useState<ClaimStatus | "">("pending");
  const [reason, setReason] = useState("");

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleApprove = (id: string) => {
    dispatch(approveClaim({ id }))
      .unwrap()
      .then(() => {
        toast.success("Klaim disetujui dan XP diberikan");
        dispatch(removeClaimFromQueue(id));
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  const handleReject = (id: string, alasan: string) => {
    dispatch(rejectClaim({ id, reason: alasan }))
      .unwrap()
      .then(() => {
        toast.success("Klaim ditolak");
        dispatch(removeClaimFromQueue(id));
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  if (error != null) {
    return (
      <div
        role="alert"
        className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-60">
          <Select
            value={status === "" ? "all" : status}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as ClaimStatus);
              setStatus(next);
              dispatch(getClaimsForReview({ status: next, page: 1 }));
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={() => dispatch(getClaimsForReview({ status, page: 1 }))}
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Muat ulang
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Pengklaim
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Misi
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Periode
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Bukti
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading ? "Memuat…" : "Tidak ada klaim pada filter ini."}
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {claim.claimant?.alias ?? "Anggota"}
                    </h5>
                    <p className="text-xs text-bodydark">
                      {formatStrToDateTime(claim.created_at, "dd MMM yyyy HH:mm")}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p className="text-black dark:text-white">
                      {claim.mission_title}
                    </p>
                    <p className="text-xs text-bodydark">
                      {claim.reward_xp != null ? `${claim.reward_xp} XP` : "—"}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p className="text-black dark:text-white">
                      {claim.period_key}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    {claim.proof_url ? (
                      <a
                        href={claim.proof_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary underline"
                      >
                        Tautan bukti
                      </a>
                    ) : null}
                    {claim.proof_note ? (
                      <p className="text-xs text-black dark:text-white">
                        {claim.proof_note}
                      </p>
                    ) : null}
                    {!claim.proof_url && !claim.proof_note ? (
                      <p className="text-xs text-bodydark">Tanpa bukti</p>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p
                      className={`font-bold ${
                        claim.status === "approved"
                          ? "text-meta-3"
                          : claim.status === "rejected"
                          ? "text-danger"
                          : "text-meta-1"
                      }`}
                    >
                      {claimStatusLabel(claim.status)}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    {claim.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => handleApprove(claim.id)}
                          className="h-9 border-2 border-black bg-success text-white hover:bg-success/80"
                        >
                          Setujui
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setReason("");
                            setDialogContent(
                              <RejectDialog
                                onConfirm={(alasan) => {
                                  toggleDialog();
                                  handleReject(claim.id, alasan);
                                }}
                                onCancel={toggleDialog}
                                reason={reason}
                                setReason={setReason}
                              />
                            );
                            toggleDialog();
                          }}
                          className="h-9 border-2 border-black bg-danger text-white hover:bg-danger/80"
                        >
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-bodydark">
                        {claim.decision_reason ?? "—"}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {hasMore ? (
          <p className="pb-4 text-center text-sm text-black dark:text-white">
            Masih ada klaim lain. Persempit filter untuk melihatnya.
          </p>
        ) : null}

        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

interface RejectDialogProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  reason: string;
  setReason: (value: string) => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  onConfirm,
  onCancel,
  reason,
  setReason,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Tolak klaim misi
      </h3>
      <p className="py-2 text-sm text-black dark:text-white">
        Alasan wajib diisi supaya anggota tahu mengapa klaimnya ditolak.
      </p>
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Alasan penolakan"
        className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
      />
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          disabled={reason.trim() === ""}
          onClick={() => onConfirm(reason)}
          className="h-10 border-2 border-black bg-danger text-white hover:bg-danger/80 disabled:opacity-50"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Tolak Klaim
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

export default TableMissionClaims;
