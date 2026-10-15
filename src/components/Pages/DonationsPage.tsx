"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getCampaigns } from "@/redux/slices/fundraisingSlice";
import { fundTypeLabel } from "@/types/fundraising";
import { formatRupiah, formatRupiahShort } from "@/utils/currency";
import {
  ArrowRight,
  HeartHandshake,
  History,
  ImageOff,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const CampaignSkeleton = () => (
  <div className="overflow-hidden rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)]">
    <div className="aspect-[16/10] animate-pulse bg-[var(--yn-surface-muted)]" />
    <div className="space-y-3 p-5">
      <div className="h-5 w-24 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-6 w-4/5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-3 w-full animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
    </div>
  </div>
);

export default function DonationsPage() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((state) => state.fundraising.campaigns);
  const isLoading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);

  useEffect(() => {
    if (campaigns == null) dispatch(getCampaigns());
  }, [dispatch, campaigns]);

  return (
    <MainLayout>
      <CommonHeader title="Donasi" isShowBack isShowTrailing={false} />

      <main className="yn-container pb-12 pt-8 md:pb-20 md:pt-14">
        <section className="grid items-end gap-8 border-b border-[var(--yn-border)] pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:pb-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent-dark)]">
              Bergerak bersama
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--yn-foreground)] sm:text-5xl md:text-6xl">
              Kebaikan kecil, dampak yang berarti.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--yn-muted)] md:text-lg">
              Dukung program sosial, pendidikan, dan dakwah bersama YukNgaji
              Solo. Setiap dukungan dicatat dan dilaporkan secara terbuka.
            </p>
          </div>

          <Link
            href="/orders?tab=donations"
            className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-start rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--yn-surface-muted)] md:justify-self-end"
          >
            <History aria-hidden="true" className="size-4" />
            Riwayat donasi
          </Link>
        </section>

        <section className="pt-8 md:pt-10" aria-labelledby="campaign-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-muted)]">
                Program aktif
              </p>
              <h2
                id="campaign-heading"
                className="mt-1 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]"
              >
                Pilih langkah kebaikanmu
              </h2>
            </div>
            {campaigns && campaigns.length > 0 ? (
              <span className="hidden text-sm text-[var(--yn-muted)] sm:block">
                {campaigns.length} program
              </span>
            ) : null}
          </div>

          {error ? (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>Program donasi belum berhasil dimuat.</p>
              <button
                type="button"
                onClick={() => dispatch(getCampaigns())}
                disabled={isLoading}
                className="inline-flex items-center gap-2 self-start font-semibold disabled:opacity-50 sm:self-auto"
              >
                <RefreshCw
                  aria-hidden="true"
                  className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Coba lagi
              </button>
            </div>
          ) : null}

          {campaigns == null && isLoading ? (
            <div className="grid gap-4 md:grid-cols-2" aria-label="Memuat program donasi">
              {Array.from({ length: 4 }).map((_, index) => (
                <CampaignSkeleton key={index} />
              ))}
            </div>
          ) : campaigns != null && campaigns.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
                <HeartHandshake aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--yn-foreground)]">
                Program sedang disiapkan
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--yn-muted)]">
                Belum ada program donasi yang dibuka. Silakan kembali lagi
                nanti.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns?.map((campaign) => {
                const progress = Math.min(
                  Math.max(campaign.progress_percent, 0),
                  100
                );

                return (
                  <Link
                    key={campaign.id}
                    href={`/donations/${campaign.slug}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--yn-accent)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--yn-surface-muted)]">
                      {campaign.cover_image_url ? (
                        <Image
                          src={campaign.cover_image_url}
                          alt={campaign.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--yn-muted)]">
                          <ImageOff aria-hidden="true" className="size-7" />
                          <span className="sr-only">Foto program belum tersedia</span>
                        </div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-[var(--yn-surface)]/90 px-3 py-1.5 text-xs font-semibold text-[var(--yn-foreground)] backdrop-blur">
                        {fundTypeLabel(campaign.fund_type)}
                      </span>
                      {!campaign.is_open ? (
                        <span className="absolute right-4 top-4 rounded-full bg-[var(--yn-foreground)]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          Ditutup
                        </span>
                      ) : null}
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold leading-snug tracking-tight text-[var(--yn-foreground)]">
                            {campaign.title}
                          </h3>
                          {campaign.summary ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--yn-muted)]">
                              {campaign.summary}
                            </p>
                          ) : null}
                        </div>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--yn-border)] text-[var(--yn-muted)] transition group-hover:border-[var(--yn-accent)] group-hover:bg-[var(--yn-accent-soft)] group-hover:text-[var(--yn-accent-dark)]">
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </span>
                      </div>

                      <div className="mt-6">
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--yn-surface-muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--yn-accent)] transition-[width]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-xs text-[var(--yn-muted)]">Terkumpul</p>
                            <p className="mt-0.5 font-semibold text-[var(--yn-foreground)]">
                              {formatRupiahShort(campaign.raised_amount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[var(--yn-muted)]">Target</p>
                            <p className="mt-0.5 text-sm font-medium text-[var(--yn-foreground)]">
                              {campaign.target_amount > 0
                                ? formatRupiah(campaign.target_amount)
                                : "Terbuka"}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--yn-muted)]">
                          <Users aria-hidden="true" className="size-3.5" />
                          {campaign.donor_count} donatur telah bergabung
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[var(--yn-accent-soft)] px-5 py-4 text-sm leading-6 text-[var(--yn-accent-dark)]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p>
              Donasi diverifikasi oleh pengurus. Perkembangan dan penggunaan
              dana ditampilkan pada setiap halaman program.
            </p>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
