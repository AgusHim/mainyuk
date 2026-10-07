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
  getModerationThreads,
  moderateThread,
} from "@/redux/slices/moderationSlice";
import { Thread, ThreadStatus, threadStatusLabel } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

type Pending = {
  thread: Thread;
  action: "hide" | "restore" | "delete";
};

const actionLabel = (action: Pending["action"]): string => {
  switch (action) {
    case "hide":
      return "Sembunyikan thread";
    case "restore":
      return "Tampilkan lagi thread";
    default:
      return "Hapus thread";
  }
};

/**
 * Pemeriksaan konten tanpa menunggu laporan.
 *
 * Transisi status divalidasi server lewat tabel transisinya sendiri, jadi
 * tombol yang tidak sah (mis. menampilkan lagi thread yang sudah dihapus) akan
 * ditolak dengan pesan yang jelas — klien tidak perlu meniru tabel itu.
 */
const TableModerationThreads = () => {
  const dispatch = useAppDispatch();
  const threads = useAppSelector((state) => state.moderation.reviewThreads);
  const hasMore = useAppSelector((state) => state.moderation.reviewThreadsHasMore);
  const isLoading = useAppSelector((state) => state.moderation.loading);
  const error = useAppSelector((state) => state.moderation.error);

  const [status, setStatus] = useState<ThreadStatus | "">("published");
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (thread: Thread, action: Pending["action"]) => {
    setPending({ thread, action });
    setReason("");
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
    dispatch(
      moderateThread({
        id: pending.thread.public_id,
        action: pending.action,
        data: { reason },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Tindakan tersimpan");
        closeDialog();
        dispatch(getModerationThreads({ status, page: 1 }));
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
        Pemeriksaan konten
      </h2>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-60">
          <Select
            value={status === "" ? "all" : status}
            onValueChange={(value) => {
              const next = value === "all" ? "" : (value as ThreadStatus);
              setStatus(next);
              dispatch(getModerationThreads({ status: next, page: 1 }));
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Tayang</SelectItem>
              <SelectItem value="hidden">Disembunyikan</SelectItem>
              <SelectItem value="deleted">Dihapus</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={() => dispatch(getModerationThreads({ status, page: 1 }))}
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
              <th className="min-w-[240px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Thread
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Penulis
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
            {threads.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading ? "Memuat…" : "Tidak ada thread pada filter ini."}
                </td>
              </tr>
            ) : (
              threads.map((thread) => (
                <tr key={thread.public_id}>
                  <td className="border-b border-black py-4 px-4 xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {thread.title}
                    </p>
                    {thread.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-black dark:text-white">
                        {thread.excerpt}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {thread.author?.alias ?? "Anonim"}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {threadStatusLabel(thread.status)}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {formatStrToDateTime(thread.created_at, "dd MMM yyyy HH:mm")}
                  </td>
                  <td className="border-b border-black py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      {thread.status === "published" ? (
                        <Button
                          type="button"
                          onClick={() => openDialog(thread, "hide")}
                          className="h-9 border-2 border-black bg-meta-1 text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Sembunyikan
                        </Button>
                      ) : null}
                      {thread.status === "hidden" ? (
                        <Button
                          type="button"
                          onClick={() => openDialog(thread, "restore")}
                          className="h-9 border-2 border-black bg-success text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Tampilkan lagi
                        </Button>
                      ) : null}
                      {thread.status !== "deleted" ? (
                        <Button
                          type="button"
                          onClick={() => openDialog(thread, "delete")}
                          className="h-9 border-2 border-black bg-danger text-white hover:bg-opacity-90"
                          style={{ boxShadow: "5px 5px 0px #000000" }}
                        >
                          Hapus
                        </Button>
                      ) : (
                        <span className="text-xs text-black dark:text-white">
                          Sudah dihapus
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {hasMore ? (
          <p className="pb-4 text-center text-sm text-black dark:text-white">
            Masih ada thread lain. Persempit filter untuk melihatnya.
          </p>
        ) : null}

        <Dialog
          toggleDialog={closeDialog}
          ref={dialogRef}
          title="Tindakan moderator"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            {pending ? actionLabel(pending.action) : ""}
          </h3>
          <p className="py-2 text-sm text-black dark:text-white">
            Alasan wajib diisi. Alasan ini tersimpan di thread sekaligus di
            jejak audit.
          </p>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan tindakan"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={reason.trim() === ""}
              onClick={submit}
              className="h-10 border-2 border-black bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Simpan tindakan
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

export default TableModerationThreads;
