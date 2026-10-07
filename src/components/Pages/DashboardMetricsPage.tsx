"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getMetrics } from "@/redux/slices/metricsSlice";
import {
  MetricsWindow,
  fulfillmentStatusLabel,
  paymentStatusLabel,
  reportStatusLabel,
} from "@/types/metrics";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DashboardLoader from "../common/Loader/DashboardLoader";

// Menampilkan rentang satu jendela sebagai keterangan kecil di bawah angkanya.
// Jendela bulan kalender berakhir di awal bulan berikutnya — boleh di masa
// depan — jadi keterangannya ditulis sebagai rentang, bukan "sejak".
const windowCaption = (w: MetricsWindow): string =>
  `${formatStrToDateTime(w.from, "dd MMM")} – ${formatStrToDateTime(
    w.to,
    "dd MMM"
  )}`;

const StatCard = ({
  title,
  value,
  caption,
}: {
  title: string;
  value: number;
  caption?: string;
}) => (
  <div className="rounded-md border-2 border-black bg-white py-6 px-7.5 shadow-bottom dark:bg-boxdark">
    <h4 className="text-title-md font-bold text-black dark:text-white">
      {value.toLocaleString("id-ID")}
    </h4>
    <span className="text-sm font-medium text-black dark:text-white">
      {title}
    </span>
    {caption ? (
      <p className="mt-1 text-xs text-body dark:text-bodydark">{caption}</p>
    ) : null}
  </div>
);

// Daftar berpasangan label–angka. Urutannya tetap seperti yang dikirim server
// supaya angka yang sama tidak berpindah tempat antar pemuatan.
const CountList = ({
  title,
  counts,
  label,
}: {
  title: string;
  counts: Record<string, number>;
  label: (status: string) => string;
}) => {
  const entries = Object.entries(counts);

  return (
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
        {title}
      </h2>
      {entries.length === 0 ? (
        <p className="pb-4 text-sm text-black dark:text-white">
          Belum ada data.
        </p>
      ) : (
        <ul className="grid gap-2 pb-4">
          {entries.map(([status, count]) => (
            <li
              key={status}
              className="flex items-center justify-between gap-3 rounded-lg border-2 border-black bg-gray-2 p-3 dark:bg-meta-4"
            >
              <span className="text-black dark:text-white">
                {label(status)}
              </span>
              <span className="font-semibold text-black dark:text-white">
                {count.toLocaleString("id-ID")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * Halaman metrik.
 *
 * Seluruh angka berasal dari `GET /admin_api/metrics`; tidak ada satu pun yang
 * ditulis tetap di sini. Server adalah penentu akhir izinnya — endpoint itu
 * memeriksa `metrics:view` — sedangkan pemeriksaan peran di sisi klien hanya
 * untuk kenyamanan.
 *
 * Satu hal yang perlu dibaca sebelum menafsirkan angkanya: "akun aktif" berarti
 * pernah melakukan aksi bermakna, bukan membuka aplikasi. Skema tidak menyimpan
 * jejak sesi, jadi akun yang hanya membaca tidak terhitung. Keterangan itu
 * diulang di halaman ini supaya angka MAU tidak dibaca lebih luas dari yang
 * sebenarnya.
 */
export default function DashboardMetricsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const metrics = useAppSelector((state) => state.metrics.metrics);
  const isLoading = useAppSelector((state) => state.metrics.loading);
  const error = useAppSelector((state) => state.metrics.error);

  const allowed = user?.role == "admin" || user?.role == "pj";

  useEffect(() => {
    if (!allowed) {
      return;
    }
    dispatch(getMetrics());
  }, [dispatch, allowed]);

  if (!allowed) {
    return (
      <>
        <Breadcrumb pageName="Metrik" />
        <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Tidak berizin
          </h1>
          <p className="mt-1 text-sm text-black dark:text-white">
            Halaman ini hanya untuk pengurus.
          </p>
        </div>
      </>
    );
  }

  if (metrics == null && isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <Breadcrumb pageName="Metrik" />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : null}

      {metrics == null ? (
        <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
          <p className="text-sm text-black dark:text-white">
            Laporan belum tersedia.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <StatCard
              title="Akun aktif bulan ini (MAU)"
              value={metrics.active_users.calendar_month.value}
              caption={windowCaption(metrics.active_users.calendar_month)}
            />
            <StatCard
              title="Akun aktif 30 hari terakhir"
              value={metrics.active_users.last_30_days.value}
              caption={windowCaption(metrics.active_users.last_30_days)}
            />
            <StatCard
              title="Donasi terkonfirmasi bulan ini"
              value={metrics.donations.paid_in_month.value}
              caption={`Total ${metrics.donations.paid_total.toLocaleString(
                "id-ID"
              )}`}
            />
            <StatCard
              title="Pesanan toko bulan ini"
              value={metrics.orders.created_in_month.value}
              caption={`Total XP misi disetujui ${metrics.missions.approved_total.toLocaleString(
                "id-ID"
              )}`}
            />
          </div>

          <div className="rounded-sm border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Cara membaca angka keaktifan
            </h2>
            <p className="mt-2 text-sm text-black dark:text-white">
              &ldquo;Aktif&rdquo; berarti akun pernah melakukan aksi bermakna —
              mendaftar event, berdonasi, mengklaim misi, berbelanja, menulis,
              atau menerima XP. Aplikasi ini tidak menyimpan jejak sesi, jadi
              akun yang hanya membaca tidak ikut terhitung. Angkanya karena itu
              lebih rendah dari jumlah pengunjung sebenarnya, dan itu memang
              disengaja.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Misi disetujui
              </h2>
              <p className="text-sm text-black dark:text-white">
                Total sepanjang waktu:{" "}
                <span className="font-semibold">
                  {metrics.missions.approved_total.toLocaleString("id-ID")}
                </span>
              </p>
              <p className="mt-1 pb-4 text-sm text-black dark:text-white">
                Bulan ini:{" "}
                <span className="font-semibold">
                  {metrics.missions.approved_in_month.value.toLocaleString(
                    "id-ID"
                  )}
                </span>{" "}
                <span className="text-xs text-body dark:text-bodydark">
                  ({windowCaption(metrics.missions.approved_in_month)})
                </span>
              </p>
            </div>

            <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Donasi terkonfirmasi
              </h2>
              <p className="text-sm text-black dark:text-white">
                Total sepanjang waktu:{" "}
                <span className="font-semibold">
                  {metrics.donations.paid_total.toLocaleString("id-ID")}
                </span>
              </p>
              <p className="mt-1 pb-4 text-sm text-black dark:text-white">
                Bulan ini:{" "}
                <span className="font-semibold">
                  {metrics.donations.paid_in_month.value.toLocaleString("id-ID")}
                </span>{" "}
                <span className="text-xs text-body dark:text-bodydark">
                  ({windowCaption(metrics.donations.paid_in_month)})
                </span>
              </p>
            </div>

            <CountList
              title="Pesanan toko menurut pembayaran"
              counts={metrics.orders.by_payment_status}
              label={paymentStatusLabel}
            />
            <CountList
              title="Pesanan toko menurut pemenuhan"
              counts={metrics.orders.by_fulfillment_status}
              label={fulfillmentStatusLabel}
            />

            <CountList
              title="Laporan komunitas menurut status"
              counts={metrics.community.reports_by_status}
              label={reportStatusLabel}
            />

            <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Aktivitas komunitas bulan ini
              </h2>
              <ul className="grid gap-2 pb-4">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-black dark:text-white">Thread</span>
                  <span className="font-semibold text-black dark:text-white">
                    {metrics.community.threads_in_month.value.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-black dark:text-white">Komentar</span>
                  <span className="font-semibold text-black dark:text-white">
                    {metrics.community.comments_in_month.value.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-black dark:text-white">Reaksi</span>
                  <span className="font-semibold text-black dark:text-white">
                    {metrics.community.reactions_in_month.value.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-black dark:text-white">Laporan</span>
                  <span className="font-semibold text-black dark:text-white">
                    {metrics.community.reports_in_month.value.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-body dark:text-bodydark">
            Angka diambil{" "}
            {formatStrToDateTime(metrics.generated_at, "dd MMM yyyy HH:mm")}.
            Rentang bulan mengikuti zona waktu Asia/Jakarta.
          </p>
        </div>
      )}
    </>
  );
}
