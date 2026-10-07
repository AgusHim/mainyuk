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
  actionReport,
  dismissReport,
  getModerationReports,
  removeReportFromQueue,
  restrictAccount,
} from "@/redux/slices/moderationSlice";
import {
  ModerationReport,
  ReportStatus,
  reportReasonLabel,
  reportStatusLabel,
  threadStatusLabel,
} from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

type Pending = {
  report: ModerationReport;
  mode: "action" | "dismiss" | "restrict";
};

/**
 * Antrean laporan moderator.
 *
 * Setiap keputusan wajib beralasan: alasan disimpan di baris laporan sekaligus
 * di jejak audit, sehingga keputusan bisa ditelusuri dari dua arah. Identitas
 * pelapor tidak pernah ditampilkan di sini — hanya penulis kontennya, dan itu
 * pun lewat bentuk publik yang sudah dianonimkan server.
 */
const TableModerationReports = () => {
  const dispatch = useAppDispatch();
  const reports = useAppSelector((state) => state.moderation.reports);
  const hasMore = useAppSelector((state) => state.moderation.reportsHasMore);
  const isLoading = useAppSelector((state) => state.moderation.loading);
  const error = useAppSelector((state) => state.moderation.error);

  const [status, setStatus] = useState<ReportStatus | "">("open");
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState("");
  const [hideTarget, setHideTarget] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (
    report: ModerationReport,
    mode: "action" | "dismiss" | "restrict"
  ) => {
    setPending({ report, mode });
    setReason("");
    setHideTarget(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setPending(null);
    setReason("");
    dialogRef.current?.close();
  };

  const submit = () => {
    if (!pending) {
      return;
    }
    const id = pending.report.report.id;

    // Membatasi akun memakai public_id profil penulis, bukan id akun — id akun
    // memang tidak pernah sampai ke klien.
    if (pending.mode === "restrict") {
      const publicId = pending.report.author?.public_id;
      if (!publicId) {
        toast.error("Identitas publik penulis tidak tersedia");
        return;
      }
      dispatch(
        restrictAccount({
          publicId,
          data: { blocked: true, reason },
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Akun dibatasi");
          dispatch(removeReportFromQueue(id));
          closeDialog();
        })
        .catch(() => {
          // Pesan kesalahan sudah ditampilkan interceptor API.
        });
      return;
    }

    const thunk =
      pending.mode === "action"
        ? dispatch(actionReport({ id, data: { reason, hide_target: hideTarget } }))
        : dispatch(dismissReport({ id, data: { reason } }));

    thunk
      .unwrap()
      .then(() => {
        toast.success(
          pending.mode === "action" ? "Laporan ditindak" : "Laporan diabaikan"
        );
        dispatch(removeReportFromQueue(id));
        closeDialog();
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
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Antrean laporan
      </h2>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-60">
          <Select
            value={status === "" ? "all" : status}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as ReportStatus);
              setStatus(next);
              dispatch(getModerationReports({ status: next, page: 1 }));
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Menunggu</SelectItem>
              <SelectItem value="actioned">Ditindak</SelectItem>
              <SelectItem value="dismissed">Diabaikan</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={() => dispatch(getModerationReports({ status, page: 1 }))}
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Muat ulang
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Konten
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Penulis
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Alasan
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Waktu
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading
                    ? "Memuat…"
                    : "Tidak ada laporan pada filter ini."}
                </td>
              </tr>
            ) : (
              reports.map((row) => (
                <tr key={row.report.id}>
                  <td className="border-b border-black py-4 px-4 xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {row.target?.title ?? "Konten tidak ditemukan"}
                    </p>
                    {row.target?.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-black dark:text-white">
                        {row.target.excerpt}
                      </p>
                    ) : null}
                    {row.target ? (
                      <p className="mt-1 text-xs text-black dark:text-white">
                        {row.target.type === "thread" ? "Thread" : "Komentar"} ·{" "}
                        {threadStatusLabel(row.target.status)}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {row.author?.alias ?? "Anonim"}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    <p>{reportReasonLabel(row.report.reason)}</p>
                    {row.report.note ? (
                      <p className="mt-1 text-xs text-black dark:text-white">
                        {row.report.note}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {reportStatusLabel(row.report.status)}
                    {row.report.decision_reason ? (
                      <p className="mt-1 text-xs text-black dark:text-white">
                        {row.report.decision_reason}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {formatStrToDateTime(
                      row.report.created_at,
                      "dd MMM yyyy HH:mm"
                    )}
                  </td>
                  <td className="border-b border-black py-4 px-4">
                    {row.report.status === "open" ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => openDialog(row, "action")}
                          className="h-9 border-2 border-black bg-primary text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Tindak
                        </Button>
                        <Button
                          type="button"
                          onClick={() => openDialog(row, "dismiss")}
                          className="h-9 border-2 border-black bg-meta-1 text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Abaikan
                        </Button>
                        <Button
                          type="button"
                          onClick={() => openDialog(row, "restrict")}
                          className="h-9 border-2 border-black bg-danger text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Batasi akun
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-black dark:text-white">
                        Sudah diputuskan
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {hasMore ? (
          <p className="pb-4 text-center text-sm text-black dark:text-white">
            Masih ada laporan lain. Persempit filter untuk melihatnya.
          </p>
        ) : null}

        <Dialog
          toggleDialog={closeDialog}
          ref={dialogRef}
          title="Keputusan moderator"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            {pending?.mode === "action"
              ? "Tindak laporan"
              : pending?.mode === "restrict"
              ? "Batasi akun penulis"
              : "Abaikan laporan"}
          </h3>
          <p className="py-2 text-sm text-black dark:text-white">
            {pending?.mode === "restrict"
              ? "Akun yang dibatasi tidak bisa menulis thread, komentar, reaksi, atau menyukai konten. Kiriman lamanya ikut hilang dari feed sampai pembatasannya dicabut."
              : "Alasan wajib diisi. Alasan ini tersimpan di laporan sekaligus di jejak audit."}
          </p>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan keputusan"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />

          {pending?.mode === "action" ? (
            <label className="mt-3 flex items-center gap-3 text-sm text-black dark:text-white">
              <input
                type="checkbox"
                checked={hideTarget}
                onChange={(e) => setHideTarget(e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              Sembunyikan konten yang dilaporkan sekaligus
            </label>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={reason.trim() === ""}
              onClick={submit}
              className="h-10 border-2 border-black bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Simpan keputusan
            </Button>
            <Button
              type="button"
              onClick={closeDialog}
              className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Batal
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TableModerationReports;
