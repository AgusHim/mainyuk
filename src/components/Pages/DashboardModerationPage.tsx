"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getModerationAuditLogs,
  getModerationReports,
  getModerationThreads,
  getRestrictedAccounts,
} from "@/redux/slices/moderationSlice";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableModerationReports from "../Tables/TableModerationReports";
import TableModerationThreads from "../Tables/TableModerationThreads";
import TableRestrictedAccounts from "../Tables/TableRestrictedAccounts";
import DashboardLoader from "../common/Loader/DashboardLoader";

// Pemetaan aksi audit ke kalimat yang bisa dibaca moderator. Aksi yang tidak
// dikenal ditampilkan apa adanya, supaya penambahan aksi baru di server tidak
// membuat barisnya hilang dari riwayat.
const actionLabel = (action: string): string => {
  switch (action) {
    case "thread.hide":
      return "Menyembunyikan thread";
    case "thread.restore":
      return "Menampilkan lagi thread";
    case "thread.delete":
      return "Menghapus thread";
    case "thread_comment.hide":
      return "Menyembunyikan komentar";
    case "thread_comment.restore":
      return "Menampilkan lagi komentar";
    case "thread_comment.delete":
      return "Menghapus komentar";
    case "report.action":
      return "Menindak laporan";
    case "report.dismiss":
      return "Mengabaikan laporan";
    case "account.restrict":
      return "Membatasi akun";
    case "account.unrestrict":
      return "Mencabut pembatasan akun";
    case "share.revoke":
      return "Mencabut postingan berbagi";
    default:
      return action;
  }
};

/**
 * Halaman moderasi.
 *
 * Peran diperiksa di sisi klien hanya untuk kenyamanan; server tetap penentu
 * akhir — setiap endpoint moderasi memeriksa izin `moderation:moderate`.
 */
export default function DashboardModerationPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const reports = useAppSelector((state) => state.moderation.reports);
  const restricted = useAppSelector(
    (state) => state.moderation.restrictedAccounts
  );
  const auditLogs = useAppSelector((state) => state.moderation.auditLogs);
  const isLoading = useAppSelector((state) => state.moderation.loading);
  const error = useAppSelector((state) => state.moderation.error);

  const allowed =
    user?.role == "admin" || user?.role == "pj" || user?.role == "ranger";

  useEffect(() => {
    if (!allowed) {
      return;
    }
    dispatch(getModerationReports({ status: "open", page: 1 }));
    dispatch(getModerationThreads({ status: "published", page: 1 }));
    dispatch(getRestrictedAccounts(1));
    dispatch(getModerationAuditLogs(1));
  }, [dispatch, allowed]);

  if (!allowed) {
    return (
      <>
        <Breadcrumb pageName="Moderasi" />
        <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Tidak berizin
          </h1>
          <p className="mt-1 text-sm text-black dark:text-white">
            Halaman ini hanya untuk pengurus dengan izin moderasi.
          </p>
        </div>
      </>
    );
  }

  if (reports.length === 0 && restricted.length === 0 && isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <Breadcrumb pageName="Moderasi" />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-10">
        <TableModerationReports />
        <TableModerationThreads />
        <TableRestrictedAccounts />

        <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Riwayat keputusan
          </h2>
          {auditLogs.length === 0 ? (
            <p className="pb-4 text-sm text-black dark:text-white">
              {isLoading ? "Memuat…" : "Belum ada keputusan moderasi."}
            </p>
          ) : (
            <ul className="grid gap-2 pb-4">
              {auditLogs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg border-2 border-black bg-gray-2 p-3 dark:bg-meta-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-black dark:text-white">
                      {actionLabel(log.action)}
                    </p>
                    <p className="text-xs text-black dark:text-white">
                      {formatStrToDateTime(log.created_at, "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                  {log.reason ? (
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Alasan: {log.reason}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
