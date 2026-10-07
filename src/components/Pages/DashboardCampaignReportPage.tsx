"use client";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteCampaignUpdate,
  getAuditLogs,
  getCampaignReport,
} from "@/redux/slices/campaignAdminSlice";
import { updateKindLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import FormCampaignUpdate from "../Form/FormCampaignUpdate";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardCampaignReportPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params?.id ?? "";

  const dispatch = useAppDispatch();
  const report = useAppSelector((state) => state.campaignAdmin.report);
  const auditLogs = useAppSelector((state) => state.campaignAdmin.auditLogs);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);
  const error = useAppSelector((state) => state.campaignAdmin.error);

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (campaignId) {
      dispatch(getCampaignReport(campaignId));
      dispatch(getAuditLogs({ entity_type: "campaign", entity_id: campaignId }));
    }
  }, [dispatch, campaignId]);

  if (report == null && isLoading) {
    return <DashboardLoader />;
  }

  const totals = report?.totals;

  return (
    <>
      {error != null ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : (
        <div></div>
      )}
      <Breadcrumb pageName="Laporan Campaign" />

      {report == null ? (
        <p className="text-black dark:text-white">Campaign tidak ditemukan.</p>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-sm border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark">
            <h2 className="text-lg font-bold text-black dark:text-white">
              {report.campaign.title}
            </h2>
            <p className="text-sm text-bodydark">{report.campaign.slug}</p>

            {totals ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat
                  label="Dana terkumpul (bruto)"
                  value={formatRupiah(totals.confirmed_amount)}
                  note={`${totals.confirmed_count} donasi terkonfirmasi`}
                />
                <Stat
                  label="Menunggu verifikasi"
                  value={formatRupiah(totals.pending_amount)}
                  note={`${totals.pending_count} donasi`}
                />
                <Stat
                  label="Ditolak"
                  value={formatRupiah(totals.rejected_amount)}
                  note={`${totals.rejected_count} donasi`}
                />
                <Stat
                  label="Dana dikembalikan"
                  value={formatRupiah(totals.refunded_amount)}
                  note={`${totals.refunded_count} donasi`}
                />
                <Stat
                  label="Penggunaan dana"
                  value={formatRupiah(totals.usage_amount)}
                  note="baris terpisah, tidak mengurangi progres"
                />
                <Stat
                  label="Biaya"
                  value={formatRupiah(totals.fee_amount)}
                  note="baris terpisah, tidak mengurangi progres"
                />
              </div>
            ) : null}

            {totals ? (
              <div className="mt-4 rounded-lg border-2 border-black bg-gray-2 p-4 dark:bg-meta-4">
                <p className="text-sm text-black dark:text-white">
                  Dana terkumpul dikurangi refund, biaya, dan penggunaan dana
                </p>
                <p className="text-xl font-bold text-black dark:text-white">
                  {formatRupiah(totals.net_amount)}
                </p>
                <p className="mt-1 text-xs text-bodydark">
                  Angka negatif berarti dana terpakai melebihi yang terkumpul —
                  itu sinyal nyata, bukan kesalahan tampilan.
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-sm border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black dark:text-white">
                Update & penggunaan dana
              </h2>
              <Button
                onClick={() => setIsFormOpen((open) => !open)}
                className="border-2 border-black bg-meta-3 text-white"
                style={{ boxShadow: "5px 5px 0px 0px #000000" }}
              >
                {isFormOpen ? "Tutup form" : "Tambah update"}
              </Button>
            </div>

            {isFormOpen ? (
              <div className="mb-4 rounded-lg border-2 border-black bg-gray-2 p-4 dark:bg-meta-4">
                <FormCampaignUpdate
                  campaignId={campaignId}
                  onDone={() => setIsFormOpen(false)}
                />
              </div>
            ) : null}

            {report.updates == null || report.updates.length === 0 ? (
              <p className="text-sm text-black dark:text-white">
                Belum ada update.
              </p>
            ) : (
              <div className="grid gap-3">
                {report.updates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-lg border-2 border-black p-3 dark:border-strokedark"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="badge badge-outline badge-primary font-bold">
                        {updateKindLabel(update.kind).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-3">
                        {update.amount != null ? (
                          <span className="font-semibold text-black dark:text-white">
                            {formatRupiah(update.amount)}
                          </span>
                        ) : null}
                        <span className="text-xs text-bodydark">
                          {update.is_published ? "Terbit" : "Draf"}
                        </span>
                        <button
                          onClick={() => {
                            dispatch(deleteCampaignUpdate(update.id))
                              .unwrap()
                              .then(() => {
                                toast.success("Update dihapus");
                                dispatch(getCampaignReport(campaignId));
                              })
                              .catch((err) => {
                                toast.error(
                                  typeof err === "string"
                                    ? err
                                    : "Gagal menghapus update"
                                );
                              });
                          }}
                          className="text-sm font-semibold text-danger"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 font-semibold text-black dark:text-white">
                      {update.title}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-black dark:text-white">
                      {update.body}
                    </p>
                    {update.proof_url ? (
                      <a
                        href={update.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-sm font-semibold text-primary underline"
                      >
                        Lihat bukti
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-sm border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark">
            <h2 className="text-lg font-bold text-black dark:text-white">
              Jejak audit
            </h2>
            {auditLogs.length === 0 ? (
              <p className="mt-2 text-sm text-black dark:text-white">
                Belum ada catatan audit untuk campaign ini.
              </p>
            ) : (
              <div className="mt-3 grid gap-2">
                {auditLogs.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border-2 border-black px-3 py-2 dark:border-strokedark"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-black dark:text-white">
                        {entry.action}
                      </span>
                      <span className="text-xs text-bodydark">
                        {formatStrToDateTime(entry.created_at, "dd MMM yyyy HH:mm")}
                      </span>
                    </div>
                    {entry.reason ? (
                      <p className="mt-1 text-sm text-black dark:text-white">
                        {entry.reason}
                      </p>
                    ) : null}
                    {entry.detail ? (
                      <p className="mt-1 break-all text-xs text-bodydark">
                        {entry.detail}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface StatProps {
  label: string;
  value: string;
  note?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, note }) => (
  <div className="rounded-lg border-2 border-black p-3 dark:border-strokedark">
    <p className="text-xs text-bodydark">{label}</p>
    <p className="text-lg font-bold text-black dark:text-white">{value}</p>
    {note ? <p className="text-xs text-bodydark">{note}</p> : null}
  </div>
);
