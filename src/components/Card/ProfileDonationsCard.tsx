"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getMyDonations } from "@/redux/slices/fundraisingSlice";
import { DonationStatus, donationStatusLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import { ArrowRight, HeartHandshake, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const statusClass: Record<DonationStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-[var(--yn-surface-muted)] text-[var(--yn-muted)]",
  refunded: "bg-blue-50 text-blue-700",
};

const ProfileDonationsCard = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector((state) => state.fundraising.myDonations);
  const loading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);

  useEffect(() => {
    if (donations.length === 0) dispatch(getMyDonations(1));
  }, [dispatch, donations.length]);

  const latest = donations.slice(0, 4);

  return (
    <section className="rounded-[1.75rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--yn-accent-dark)]">
            Kontribusimu
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
            Donasi saya
          </h2>
        </div>
        <Link
          href="/donations"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--yn-border)] px-4 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]"
        >
          <HeartHandshake aria-hidden="true" className="size-4" />
          Donasi lagi
        </Link>
      </div>

      {loading && latest.length === 0 ? (
        <div className="mt-6 space-y-3" aria-label="Memuat riwayat donasi">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-[var(--yn-surface-muted)]"
            />
          ))}
        </div>
      ) : error && latest.length === 0 ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>Riwayat donasi belum dapat dimuat.</p>
          <button
            type="button"
            onClick={() => dispatch(getMyDonations(1))}
            className="mt-2 inline-flex items-center gap-1.5 font-semibold underline"
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            Coba lagi
          </button>
        </div>
      ) : latest.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-5">
          <p className="text-sm font-semibold text-[var(--yn-foreground)]">
            Belum ada donasi tercatat
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--yn-muted)]">
            Temukan program yang ingin kamu dukung dan mulai langkah baikmu.
          </p>
          <Link
            href="/donations"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--yn-accent-dark)] hover:underline"
          >
            Lihat program donasi
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[var(--yn-border)]">
          {latest.map((donation) => (
            <Link
              key={donation.id}
              href={`/donations/status/${donation.public_id}`}
              className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[var(--yn-foreground)] transition group-hover:text-[var(--yn-accent-dark)]">
                    {donation.campaign_title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass[donation.status]}`}
                  >
                    {donationStatusLabel(donation.status)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--yn-muted)]">
                  {formatStrToDateTime(donation.created_at, "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-right">
                <span className="text-sm font-semibold text-[var(--yn-foreground)]">
                  {formatRupiah(donation.amount)}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-[var(--yn-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--yn-accent-dark)]"
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {latest.length > 0 ? (
        <Link
          href="/orders?tab=donations"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--yn-accent-dark)] hover:underline"
        >
          Lihat semua riwayat donasi
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </section>
  );
};

export default ProfileDonationsCard;
