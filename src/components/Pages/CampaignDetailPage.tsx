"use client";

import FormDonation from "@/components/Form/FormDonation";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getSessionUser } from "@/redux/slices/authSlice";
import {
  getCampaignDetail,
  getCampaignDonors,
  getCampaignMessages,
  getCampaignUpdates,
} from "@/redux/slices/fundraisingSlice";
import { fundTypeLabel, updateKindLabel } from "@/types/fundraising";
import { formatRupiah, formatRupiahShort } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  HeartHandshake,
  ImageOff,
  LoaderCircle,
  Quote,
  RefreshCw,
  ShieldCheck,
  Target,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DetailSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-12">
    <div className="aspect-[4/3] animate-pulse rounded-[1.75rem] bg-[var(--yn-surface-muted)]" />
    <div className="space-y-5 py-2">
      <div className="h-5 w-28 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-12 w-4/5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--yn-surface-muted)]" />
      <div className="h-12 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
    </div>
  </div>
);

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storedCampaign = useAppSelector((state) => state.fundraising.campaign);
  const donors = useAppSelector((state) => state.fundraising.donors);
  const messages = useAppSelector((state) => state.fundraising.messages);
  const updates = useAppSelector((state) => state.fundraising.updates);
  const error = useAppSelector((state) => state.fundraising.error);
  const user = useAppSelector((state) => state.auth.user);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [relatedReady, setRelatedReady] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  const campaign = storedCampaign?.slug === slug ? storedCampaign : null;

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setIsPageLoading(true);
    setRelatedReady(false);
    setIsFormOpen(false);

    void dispatch(getCampaignDetail(slug))
      .unwrap()
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsPageLoading(false);
      });

    void Promise.allSettled([
      dispatch(getCampaignDonors({ slug, page: 1 })).unwrap(),
      dispatch(getCampaignMessages({ slug, page: 1 })).unwrap(),
      dispatch(getCampaignUpdates(slug)).unwrap(),
    ]).then(() => {
      if (active) setRelatedReady(true);
    });

    return () => {
      active = false;
    };
  }, [dispatch, slug]);

  useEffect(() => {
    // Halaman campaign dapat dibuka tanpa auth guard. Pulihkan sesi ketika
    // tersedia agar state Redux tidak kosong setelah refresh atau navigasi.
    if (user == null) void dispatch(getSessionUser());
  }, [dispatch, user]);

  const openDonationForm = () => {
    setIsFormOpen(true);
    window.requestAnimationFrame(() => {
      document
        .getElementById("donation-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleDonateClick = async () => {
    if (user) {
      openDonationForm();
      return;
    }

    setIsCheckingSession(true);
    try {
      const sessionUser = await dispatch(getSessionUser()).unwrap();
      if (sessionUser) {
        openDonationForm();
        return;
      }
    } finally {
      setIsCheckingSession(false);
    }

    router.push(`/signin?redirectTo=/donations/${slug}`);
  };

  const retry = () => {
    setIsPageLoading(true);
    dispatch(getCampaignDetail(slug))
      .unwrap()
      .catch(() => undefined)
      .finally(() => setIsPageLoading(false));
  };

  const progress = Math.min(
    Math.max(campaign?.progress_percent ?? 0, 0),
    100
  );

  return (
    <MainLayout>
      <CommonHeader title="Detail Donasi" isShowBack isShowTrailing={false} />

      <main className="yn-container pb-12 pt-6 md:pb-20 md:pt-9">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-1.5 text-sm text-[var(--yn-muted)]"
        >
          <Link
            href="/donations"
            className="transition hover:text-[var(--yn-foreground)]"
          >
            Donasi
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span className="truncate text-[var(--yn-foreground)]">
            {campaign?.title ?? "Detail program"}
          </span>
        </nav>

        {!campaign && isPageLoading ? (
          <DetailSkeleton />
        ) : !campaign ? (
          <section className="flex min-h-[28rem] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
              <HeartHandshake aria-hidden="true" className="size-6" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
              Program belum dapat ditampilkan
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--yn-muted)]">
              Program mungkin sudah tidak tersedia atau terjadi kendala saat
              mengambil datanya.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                disabled={isPageLoading}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--yn-accent-dark)] disabled:opacity-60"
              >
                <RefreshCw
                  aria-hidden="true"
                  className={`size-4 ${isPageLoading ? "animate-spin" : ""}`}
                />
                Coba lagi
              </button>
              <Link
                href="/donations"
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--yn-border)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]"
              >
                Lihat program lain
              </Link>
            </div>
          </section>
        ) : (
          <>
            {error ? (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900"
              >
                Sebagian informasi pendukung belum berhasil dimuat. Detail
                utama program tetap dapat dilihat.
              </div>
            ) : null}

            <section className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-12 xl:gap-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[var(--yn-border)] bg-[var(--yn-surface-muted)]">
                {campaign.cover_image_url ? (
                  <Image
                    src={campaign.cover_image_url}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-[var(--yn-muted)]">
                    <ImageOff aria-hidden="true" className="size-8" />
                    <span className="text-sm">Foto program belum tersedia</span>
                  </div>
                )}
                <span className="absolute left-5 top-5 rounded-full bg-[var(--yn-surface)]/90 px-3 py-1.5 text-xs font-semibold text-[var(--yn-foreground)] backdrop-blur">
                  {fundTypeLabel(campaign.fund_type)}
                </span>
              </div>

              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent-dark)]">
                  Untuk {campaign.recipient}
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[var(--yn-foreground)] md:text-4xl">
                  {campaign.title}
                </h1>
                {campaign.summary ? (
                  <p className="mt-4 text-sm leading-7 text-[var(--yn-muted)] md:text-base">
                    {campaign.summary}
                  </p>
                ) : null}

                <div className="mt-7 rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 md:p-6">
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--yn-surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--yn-accent)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-[var(--yn-muted)]">Terkumpul</p>
                      <p className="mt-1 text-xl font-semibold text-[var(--yn-foreground)]">
                        {formatRupiah(campaign.raised_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--yn-muted)]">
                        {campaign.target_amount > 0
                          ? `${campaign.progress_percent}% dari target`
                          : "Program tanpa target"}
                      </p>
                      {campaign.target_amount > 0 ? (
                        <p className="mt-1 text-sm font-semibold text-[var(--yn-foreground)]">
                          {formatRupiahShort(campaign.target_amount)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-[var(--yn-border)] pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
                        <Users aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--yn-foreground)]">
                          {campaign.donor_count} donatur
                        </p>
                        <p className="text-xs text-[var(--yn-muted)]">
                          Telah berpartisipasi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-[var(--yn-surface-muted)] text-[var(--yn-muted)]">
                        {campaign.ends_at ? (
                          <CalendarDays aria-hidden="true" className="size-4" />
                        ) : (
                          <Target aria-hidden="true" className="size-4" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--yn-foreground)]">
                          {campaign.ends_at
                            ? formatStrToDateTime(
                                campaign.ends_at,
                                "dd MMM yyyy"
                              )
                            : "Terbuka"}
                        </p>
                        <p className="text-xs text-[var(--yn-muted)]">
                          {campaign.ends_at ? "Batas program" : "Tanpa batas waktu"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {campaign.is_open ? (
                    <button
                      type="button"
                      onClick={handleDonateClick}
                      disabled={isCheckingSession}
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--yn-accent-dark)] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {isCheckingSession ? (
                        <>
                          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                          Memeriksa sesi…
                        </>
                      ) : (
                        <>
                          {user ? "Donasi sekarang" : "Mulai donasi"}
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] px-4 py-3 text-center text-sm text-[var(--yn-muted)]">
                      Program ini sudah tidak menerima donasi.
                    </p>
                  )}

                  <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-[var(--yn-muted)]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--yn-accent-dark)]"
                    />
                    Donasi diverifikasi pengurus sebelum masuk ke total program.
                  </p>
                </div>
              </div>
            </section>

            {isFormOpen ? (
              <section
                id="donation-form"
                className="scroll-mt-24 mt-10 rounded-[1.75rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7 md:mt-14 md:p-9"
                aria-labelledby="donation-form-title"
              >
                <div className="mb-7 flex items-start justify-between gap-4 border-b border-[var(--yn-border)] pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent-dark)]">
                      Langkah donasi
                    </p>
                    <h2
                      id="donation-form-title"
                      className="mt-2 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]"
                    >
                      Dukung {campaign.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--yn-muted)]">
                      Pilih nominal dan pengaturan privasi yang kamu inginkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    aria-label="Tutup formulir donasi"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--yn-border)] text-[var(--yn-muted)] transition hover:bg-[var(--yn-surface-muted)] hover:text-[var(--yn-foreground)]"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <FormDonation
                  campaignSlug={campaign.slug}
                  onCancel={() => setIsFormOpen(false)}
                />
              </section>
            ) : null}

            <section className="mt-10 grid items-start gap-8 border-t border-[var(--yn-border)] pt-10 md:mt-14 md:pt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-12">
              <div className="space-y-10">
                {campaign.story ? (
                  <article>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-muted)]">
                      Tentang program
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
                      Cerita di balik gerakan ini
                    </h2>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--yn-muted)] md:text-base">
                      {campaign.story}
                    </p>
                  </article>
                ) : null}

                <article>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
                      <WalletCards aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--yn-foreground)]">
                        Laporan dana
                      </h2>
                      <p className="text-sm text-[var(--yn-muted)]">
                        Perkembangan dan penggunaan dana program.
                      </p>
                    </div>
                  </div>

                  {!relatedReady ? (
                    <div className="mt-5 h-32 animate-pulse rounded-2xl bg-[var(--yn-surface-muted)]" />
                  ) : updates.length === 0 ? (
                    <p className="mt-5 rounded-2xl border border-dashed border-[var(--yn-border)] p-5 text-sm text-[var(--yn-muted)]">
                      Belum ada laporan yang diterbitkan.
                    </p>
                  ) : (
                    <div className="mt-6 space-y-6 border-l border-[var(--yn-border)] pl-5">
                      {updates.map((update) => (
                        <div key={update.id} className="relative">
                          <span className="absolute -left-[1.55rem] top-1.5 size-2 rounded-full bg-[var(--yn-accent)] ring-4 ring-[var(--yn-background)]" />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="rounded-full bg-[var(--yn-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--yn-muted)]">
                              {updateKindLabel(update.kind)}
                            </span>
                            <span className="text-xs text-[var(--yn-muted)]">
                              {formatStrToDateTime(
                                update.created_at,
                                "dd MMM yyyy"
                              )}
                            </span>
                          </div>
                          <h3 className="mt-3 font-semibold text-[var(--yn-foreground)]">
                            {update.title}
                          </h3>
                          {update.amount != null ? (
                            <p className="mt-1 text-sm font-semibold text-[var(--yn-accent-dark)]">
                              {formatRupiah(update.amount)}
                            </p>
                          ) : null}
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--yn-muted)]">
                            {update.body}
                          </p>
                          {update.proof_url ? (
                            <a
                              href={update.proof_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--yn-accent-dark)] hover:underline"
                            >
                              Lihat bukti
                              <ExternalLink aria-hidden="true" className="size-3.5" />
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                {relatedReady && messages.length > 0 ? (
                  <article>
                    <h2 className="text-xl font-semibold text-[var(--yn-foreground)]">
                      Doa dan dukungan
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {messages.map((item) => (
                        <blockquote
                          key={item.public_id}
                          className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5"
                        >
                          <Quote
                            aria-hidden="true"
                            className="size-5 text-[var(--yn-accent)]"
                          />
                          <p className="mt-3 text-sm leading-6 text-[var(--yn-foreground)]">
                            {item.message}
                          </p>
                          <footer className="mt-3 text-xs text-[var(--yn-muted)]">
                            {item.donor_name}
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>

              <aside className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">
                    Donatur terbaru
                  </h2>
                  <Users aria-hidden="true" className="size-4 text-[var(--yn-muted)]" />
                </div>

                {!relatedReady ? (
                  <div className="mt-5 space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-12 animate-pulse rounded-xl bg-[var(--yn-surface-muted)]" />
                    ))}
                  </div>
                ) : donors.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-[var(--yn-surface-muted)] p-5 text-center">
                    <p className="text-sm font-semibold text-[var(--yn-foreground)]">
                      Jadilah donatur pertama
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--yn-muted)]">
                      Dukungan pertamamu dapat membuka langkah kebaikan lainnya.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 divide-y divide-[var(--yn-border)]">
                    {donors.map((donation) => (
                      <div
                        key={donation.public_id}
                        className="flex items-center justify-between gap-3 py-3.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-xs font-semibold uppercase text-[var(--yn-accent-dark)]">
                            {donation.donor_name.slice(0, 1)}
                          </span>
                          <span className="truncate text-sm text-[var(--yn-foreground)]">
                            {donation.donor_name}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-[var(--yn-muted)]">
                          {donation.amount != null
                            ? formatRupiah(donation.amount)
                            : "Dirahasiakan"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-4 border-t border-[var(--yn-border)] pt-4 text-xs leading-5 text-[var(--yn-muted)]">
                  Donasimu dapat dilihat kembali di halaman{" "}
                  <Link
                    href="/orders?tab=donations"
                    className="font-semibold text-[var(--yn-accent-dark)] hover:underline"
                  >
                    riwayat transaksi
                  </Link>
                  .
                </p>
              </aside>
            </section>
          </>
        )}
      </main>
    </MainLayout>
  );
}
