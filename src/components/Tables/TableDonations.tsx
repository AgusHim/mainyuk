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
  confirmDonation,
  getAdminDonations,
  moderateDonationMessage,
  refundDonation,
  rejectDonation,
  removeDonationFromQueue,
} from "@/redux/slices/campaignAdminSlice";
import {
  AdminDonationView,
  DonationStatus,
  donationStatusLabel,
  messageStatusLabel,
} from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

const TableDonations = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector((state) => state.campaignAdmin.donations);
  const hasMore = useAppSelector((state) => state.campaignAdmin.donationsHasMore);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);
  const error = useAppSelector((state) => state.campaignAdmin.error);

  const [status, setStatus] = useState<DonationStatus | "">("pending");
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);

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

  const reload = (nextStatus: DonationStatus | "", nextPage = 1) => {
    setPage(nextPage);
    dispatch(
      getAdminDonations({ status: nextStatus, page: nextPage })
    ).catch(() => {
      // Pesan kesalahan sudah ditampilkan interceptor API.
    });
  };

  const handleConfirm = (
    id: string,
    data: { paid_amount: number; payment_reference: string; proof_url: string; reason: string }
  ) => {
    dispatch(
      confirmDonation({
        id,
        data: {
          paid_amount: data.paid_amount,
          payment_reference: data.payment_reference,
          proof_url: data.proof_url === "" ? null : data.proof_url,
          reason: data.reason === "" ? null : data.reason,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Donasi dikonfirmasi");
        dispatch(removeDonationFromQueue(id));
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal mengonfirmasi donasi");
      });
  };

  const handleReject = (id: string, alasan: string) => {
    dispatch(rejectDonation({ id, reason: alasan }))
      .unwrap()
      .then(() => {
        toast.success("Donasi ditolak");
        dispatch(removeDonationFromQueue(id));
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menolak donasi");
      });
  };

  const handleRefund = (id: string, alasan: string) => {
    dispatch(refundDonation({ id, reason: alasan }))
      .unwrap()
      .then(() => {
        toast.success("Dana dikembalikan dan XP dibalik");
        dispatch(removeDonationFromQueue(id));
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal me-refund donasi");
      });
  };

  const handleModerate = (id: string, decision: "approve" | "hide") => {
    dispatch(moderateDonationMessage({ id, decision }))
      .unwrap()
      .then(() => toast.success("Pesan diperbarui"))
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal memoderasi pesan");
      });
  };

  const renderRow = (donation: AdminDonationView) => (
    <tr key={donation.id}>
      <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
        <h5 className="font-medium text-black dark:text-white">
          {donation.donor?.alias ?? "—"}
        </h5>
        <p className="text-xs text-bodydark">
          {donation.campaign_title || donation.campaign_slug || "—"}
        </p>
      </td>
      <td className="border-b border-black py-3 px-2">
        <p className="font-semibold text-black dark:text-white">
          {formatRupiah(donation.amount)}
        </p>
        <p className="text-xs text-bodydark">
          {donation.paid_amount != null
            ? `diterima ${formatRupiah(donation.paid_amount)}`
            : "belum diverifikasi"}
        </p>
        {donation.payment_reference ? (
          <p className="text-xs text-bodydark">Ref: {donation.payment_reference}</p>
        ) : null}
      </td>
      <td className="border-b border-black py-3 px-2">
        <p className="text-black dark:text-white">
          {formatStrToDateTime(donation.created_at, "dd MMM yyyy HH:mm")}
        </p>
        <p className="text-xs text-bodydark">
          {donation.is_anonymous ? "Anonim" : "Nama tampil"}
          {donation.show_amount ? "" : " · nominal disembunyikan"}
        </p>
      </td>
      <td className="border-b border-black py-3 px-2">
        <p className="font-bold text-black dark:text-white">
          {donationStatusLabel(donation.status)}
        </p>
        <p className="text-xs text-bodydark">
          {messageStatusLabel(donation.message_status)}
        </p>
      </td>
      <td className="border-b border-black py-3 px-2">
        {donation.message ? (
          <p className="max-w-[240px] text-sm text-black dark:text-white">
            {donation.message}
          </p>
        ) : (
          <p className="text-xs text-bodydark">—</p>
        )}
      </td>
      <td className="border-b border-black py-3 px-2">
        <div className="flex flex-wrap items-center gap-2">
          {donation.status === "pending" ? (
            <>
              <Button
                onClick={() => {
                  setDialogContent(
                    <ConfirmDonationDialog
                      donation={donation}
                      onConfirm={(data) => {
                        toggleDialog();
                        handleConfirm(donation.id, data);
                      }}
                      onCancel={toggleDialog}
                    />
                  );
                  toggleDialog();
                }}
                className="h-9 border-2 border-black bg-meta-3 text-white hover:bg-meta-3/80"
              >
                Konfirmasi
              </Button>
              <Button
                onClick={() => {
                  setReason("");
                  setDialogContent(
                    <ReasonDialog
                      title="Tolak donasi"
                      description="Alasan wajib diisi supaya donatur tahu mengapa donasinya ditolak."
                      confirmLabel="Tolak"
                      danger
                      reason={reason}
                      setReason={setReason}
                      onConfirm={(alasan) => {
                        toggleDialog();
                        handleReject(donation.id, alasan);
                      }}
                      onCancel={toggleDialog}
                    />
                  );
                  toggleDialog();
                }}
                className="h-9 border-2 border-black bg-danger text-white hover:bg-danger/80"
              >
                Tolak
              </Button>
            </>
          ) : null}

          {donation.status === "confirmed" ? (
            <Button
              onClick={() => {
                setReason("");
                setDialogContent(
                  <ReasonDialog
                    title="Kembalikan dana donasi"
                    description="XP yang pernah diberikan akan dibalik. Alasan wajib diisi."
                    confirmLabel="Refund"
                    danger
                    reason={reason}
                    setReason={setReason}
                    onConfirm={(alasan) => {
                      toggleDialog();
                      handleRefund(donation.id, alasan);
                    }}
                    onCancel={toggleDialog}
                  />
                );
                toggleDialog();
              }}
              className="h-9 border-2 border-black bg-danger text-white hover:bg-danger/80"
            >
              Refund
            </Button>
          ) : null}

          {donation.message && donation.message_status === "pending" ? (
            <Button
              onClick={() => handleModerate(donation.id, "approve")}
              className="h-9 border-2 border-black bg-success text-white hover:bg-success/80"
            >
              Tampilkan pesan
            </Button>
          ) : null}
          {donation.message &&
          (donation.message_status === "approved" ||
            donation.message_status === "pending") ? (
            <Button
              onClick={() => handleModerate(donation.id, "hide")}
              className="h-9 border-2 border-black bg-white text-black hover:bg-gray-100"
            >
              Sembunyikan
            </Button>
          ) : null}
          {donation.message && donation.message_status === "hidden" ? (
            <Button
              onClick={() => handleModerate(donation.id, "approve")}
              className="h-9 border-2 border-black bg-success text-white hover:bg-success/80"
            >
              Tampilkan lagi
            </Button>
          ) : null}

          {donation.decision_reason ? (
            <p className="w-full text-xs text-bodydark">
              {donation.decision_reason}
            </p>
          ) : null}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-60">
          <Select
            value={status === "" ? "all" : status}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as DonationStatus);
              setStatus(next);
              reload(next, 1);
            }}
          >
            <SelectTrigger className="border-2 border-black">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="pending">Menunggu verifikasi</SelectItem>
              <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="refunded">Dana dikembalikan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => reload(status, 1)}
          className="border-2 border-black bg-white text-black"
        >
          Muat ulang
        </Button>
      </div>

      {error != null ? (
        <p className="mb-3 text-danger">{error}</p>
      ) : null}

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Donatur
              </th>
              <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                Nominal
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Waktu
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Pesan
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-black dark:text-white">
                  {isLoading ? "Memuat…" : "Tidak ada donasi pada filter ini."}
                </td>
              </tr>
            ) : (
              donations.map(renderRow)
            )}
          </tbody>
        </table>

        {hasMore ? (
          <p className="pb-4 text-center text-sm text-black dark:text-white">
            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                dispatch(getAdminDonations({ status, page: next }));
              }}
              className="font-semibold underline"
            >
              Muat lebih banyak
            </button>
          </p>
        ) : null}

        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

interface ConfirmDonationDialogProps {
  donation: AdminDonationView;
  onConfirm: (data: {
    paid_amount: number;
    payment_reference: string;
    proof_url: string;
    reason: string;
  }) => void;
  onCancel: () => void;
}

const ConfirmDonationDialog: React.FC<ConfirmDonationDialogProps> = ({
  donation,
  onConfirm,
  onCancel,
}) => {
  const [paidAmount, setPaidAmount] = useState(donation.amount);
  const [reference, setReference] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [reason, setReason] = useState("");

  const mismatch = paidAmount !== donation.amount;

  return (
    <>
      <h3 className="text-lg font-bold text-black dark:text-white">
        Konfirmasi donasi
      </h3>
      <p className="py-2 text-sm text-black dark:text-white">
        Nominal yang diterima harus sama persis dengan nominal donasi (
        {formatRupiah(donation.amount)}). Referensi transfer wajib diisi.
      </p>

      <div className="grid gap-3">
        <div>
          <label className="text-sm font-medium text-black dark:text-white">
            Nominal diterima
          </label>
          <Input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
          {mismatch ? (
            <p className="mt-1 text-xs font-semibold text-danger">
              Nominal tidak sama dengan donasi; server akan menolaknya.
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium text-black dark:text-white">
            Referensi transfer
          </label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="mis. TRF-2026-0001"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black dark:text-white">
            URL bukti (opsional)
          </label>
          <Input
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://…"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black dark:text-white">
            Catatan (opsional)
          </label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() =>
            onConfirm({
              paid_amount: paidAmount,
              payment_reference: reference,
              proof_url: proofUrl,
              reason,
            })
          }
          className="h-10 border-2 border-black bg-meta-3 text-white hover:bg-meta-3/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Konfirmasi
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-white text-black"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

interface ReasonDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  reason: string;
  setReason: (value: string) => void;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const ReasonDialog: React.FC<ReasonDialogProps> = ({
  title,
  description,
  confirmLabel,
  danger,
  reason,
  setReason,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="text-lg font-bold text-black dark:text-white">{title}</h3>
      <p className="py-2 text-sm text-black dark:text-white">{description}</p>
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Alasan"
        className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
      />
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          disabled={reason.trim() === ""}
          onClick={() => onConfirm(reason.trim())}
          className={`h-10 border-2 border-black text-white ${
            danger ? "bg-danger hover:bg-danger/80" : "bg-meta-3 hover:bg-meta-3/80"
          }`}
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          {confirmLabel}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-white text-black"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

export default TableDonations;
