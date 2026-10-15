"use client";

import DonationPaymentCard from "@/components/Card/DonationPaymentCard";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  clearDonationResult,
  getMyDonation,
} from "@/redux/slices/fundraisingSlice";
import { DonationStatus, donationStatusLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import {
  ArrowRight,
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

const statusStyle: Record<
  DonationStatus,
  { icon: React.ReactNode; className: string }
> = {
  pending: {
    icon: <Clock3 aria-hidden="true" className="size-3.5" />,
    className: "bg-amber-50 text-amber-800",
  },
  confirmed: {
    icon: <CheckCircle2 aria-hidden="true" className="size-3.5" />,
    className: "bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]",
  },
  rejected: {
    icon: <XCircle aria-hidden="true" className="size-3.5" />,
    className: "bg-red-50 text-red-700",
  },
  cancelled: {
    icon: <Ban aria-hidden="true" className="size-3.5" />,
    className: "bg-[var(--yn-surface-muted)] text-[var(--yn-muted)]",
  },
  refunded: {
    icon: <RotateCcw aria-hidden="true" className="size-3.5" />,
    className: "bg-blue-50 text-blue-700",
  },
};

const StatusSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-4">
    <div className="h-64 animate-pulse rounded-[1.5rem] bg-[var(--yn-surface-muted)]" />
    <div className="h-80 animate-pulse rounded-[1.5rem] bg-[var(--yn-surface-muted)]" />
  </div>
);

export default function DonationStatusPage() {
  const params = useParams<{ public_id: string }>();
  const publicId = params?.public_id ?? "";
  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.fundraising.donationResult);
  const isLoading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);
  const donation =
    result?.donation.public_id === publicId ? result.donation : null;

  useEffect(() => {
    if (publicId) dispatch(getMyDonation(publicId));
    return () => {
      dispatch(clearDonationResult());
    };
  }, [dispatch, publicId]);

  return (
    <RequiredAuthLayout redirectTo={`/donations/status/${publicId}`}>
      <MainLayout>
        <CommonHeader
          title="Status Donasi"
          isShowBack
          isShowTrailing={false}
        />

        <main className="yn-container pb-12 pt-8 md:pb-20 md:pt-12">
          <div className="mx-auto mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent-dark)]">
              Detail transaksi
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--yn-foreground)] md:text-4xl">
              Status donasimu
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--yn-muted)] md:text-base">
              Pantau instruksi pembayaran dan proses verifikasi donasi di sini.
            </p>
          </div>

          {!donation && isLoading ? (
            <StatusSkeleton />
          ) : !donation ? (
            <section className="mx-auto flex min-h-80 max-w-3xl flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
                <HeartHandshake aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-[var(--yn-foreground)]">
                Donasi belum dapat ditampilkan
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--yn-muted)]">
                {error
                  ? "Terjadi kendala saat mengambil detail donasi. Silakan coba lagi."
                  : "Donasi tidak ditemukan atau kamu tidak memiliki akses ke transaksi ini."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(getMyDonation(publicId))}
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--yn-accent-dark)] disabled:opacity-60"
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Coba lagi
                </button>
                <Link
                  href="/orders?tab=donations"
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--yn-border)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]"
                >
                  Riwayat transaksi
                </Link>
              </div>
            </section>
          ) : (
            <div className="mx-auto grid max-w-3xl gap-4">
              <section className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--yn-muted)]">
                      Donasi untuk
                    </p>
                    <Link
                      href={`/donations/${donation.campaign_slug}`}
                      className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-[var(--yn-foreground)] transition hover:text-[var(--yn-accent-dark)]"
                    >
                      {donation.campaign_title}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[donation.status].className}`}
                  >
                    {statusStyle[donation.status].icon}
                    {donationStatusLabel(donation.status)}
                  </span>
                </div>

                <div className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-5">
                  <p className="text-xs text-[var(--yn-muted)]">Nominal donasi</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--yn-foreground)]">
                    {formatRupiah(donation.amount)}
                  </p>
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--yn-muted)]"
                    />
                    <div>
                      <dt className="text-xs text-[var(--yn-muted)]">Dibuat</dt>
                      <dd className="mt-1 font-medium text-[var(--yn-foreground)]">
                        {formatStrToDateTime(
                          donation.created_at,
                          "dd MMM yyyy HH:mm"
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserRound
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--yn-muted)]"
                    />
                    <div>
                      <dt className="text-xs text-[var(--yn-muted)]">
                        Tampil sebagai
                      </dt>
                      <dd className="mt-1 font-medium text-[var(--yn-foreground)]">
                        {donation.is_anonymous ? "Hamba Allah" : "Nama akun"}
                      </dd>
                    </div>
                  </div>
                </dl>

                {donation.status === "rejected" &&
                donation.decision_reason ? (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                    <span className="font-semibold">Alasan penolakan:</span>{" "}
                    {donation.decision_reason}
                  </div>
                ) : null}
                {donation.status === "refunded" ? (
                  <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                    Dana donasi telah dikembalikan.
                    {donation.decision_reason
                      ? ` ${donation.decision_reason}`
                      : ""}
                  </div>
                ) : null}
              </section>

              {donation.status === "pending" ? (
                <DonationPaymentCard
                  donation={donation}
                  charge={result?.charge}
                />
              ) : null}

              {donation.status === "confirmed" ? (
                <section className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-accent-soft)] p-6 text-center sm:p-8">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--yn-accent)] text-white">
                    <Sparkles aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-[var(--yn-accent-dark)]">
                    Terima kasih sudah ikut bergerak
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--yn-accent-dark)]/80">
                    Donasimu sudah terverifikasi dan tercatat dalam total program.
                    {donation.rewarded_xp > 0
                      ? ` Kamu juga mendapatkan ${donation.rewarded_xp} XP.`
                      : ""}
                  </p>
                </section>
              ) : null}

              <p className="flex items-start justify-center gap-2 px-4 pt-2 text-center text-xs leading-5 text-[var(--yn-muted)]">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                Simpan ID donasi untuk memudahkan pengecekan bersama pengurus.
              </p>
            </div>
          )}
        </main>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
