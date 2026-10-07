"use client";
import { Button } from "@/components/ui/button";
import FormDonation from "@/components/Form/FormDonation";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  getCampaignDetail,
  getCampaignDonors,
  getCampaignMessages,
  getCampaignUpdates,
} from "@/redux/slices/fundraisingSlice";
import { fundTypeLabel, updateKindLabel } from "@/types/fundraising";
import { formatRupiah, formatRupiahShort } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const router = useRouter();

  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.fundraising.campaign);
  const donors = useAppSelector((state) => state.fundraising.donors);
  const messages = useAppSelector((state) => state.fundraising.messages);
  const updates = useAppSelector((state) => state.fundraising.updates);
  const isLoading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);
  const user = useAppSelector((state) => state.auth.user);

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(getCampaignDetail(slug));
      dispatch(getCampaignDonors({ slug, page: 1 }));
      dispatch(getCampaignMessages({ slug, page: 1 }));
      dispatch(getCampaignUpdates(slug));
    }
  }, [dispatch, slug]);

  const handleDonateClick = () => {
    // Donasi wajib akun: identitas donatur diambil server dari sesi, jadi
    // tamu diarahkan masuk lebih dulu dan dikembalikan ke halaman ini.
    if (!user) {
      router.push(`/signin?redirectTo=/donations/${slug}`);
      return;
    }
    setIsFormOpen(true);
  };

  if (campaign == null && isLoading) {
    return (
      <MainLayout>
        <CommonHeader title="Donasi" isShowBack={true} isShowTrailing={false} />
        <div className="p-4">
          <p className="text-black">Memuat campaign…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CommonHeader title="Donasi" isShowBack={true} isShowTrailing={false} />
      <div className="yn-container bg-yellow-400 p-4">
        {error ? (
          <div
            role="alert"
            className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
          >
            <span>{error}</span>
          </div>
        ) : null}
        {campaign == null ? (
          <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-black">Campaign tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-xl border-2 border-black bg-yellow-300 shadow-custom">
              {campaign.cover_image_url ? (
                <div className="relative h-48 w-full border-b-2 border-black bg-yellow-200">
                  <Image
                    src={campaign.cover_image_url}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                </div>
              ) : null}
              <div className="p-4">
                <span className="inline-block rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
                  {fundTypeLabel(campaign.fund_type)}
                </span>
                <h1 className="mt-2 text-xl font-bold text-black">
                  {campaign.title}
                </h1>
                <p className="mt-1 text-sm text-black">
                  Penerima: {campaign.recipient}
                </p>
                {campaign.summary ? (
                  <p className="mt-2 text-sm text-black">{campaign.summary}</p>
                ) : null}

                <div className="mt-4">
                  <div className="h-3 w-full overflow-hidden rounded-full border-2 border-black bg-yellow-200">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${campaign.progress_percent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-black">
                    <span className="font-semibold">
                      {formatRupiah(campaign.raised_amount)}
                    </span>
                    <span>
                      {campaign.target_amount > 0
                        ? `${campaign.progress_percent}% dari ${formatRupiahShort(
                            campaign.target_amount
                          )}`
                        : "tanpa target"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-black">
                    {campaign.donor_count} donatur
                  </p>
                </div>

                {campaign.ends_at ? (
                  <p className="mt-2 text-xs text-black">
                    Berakhir: {formatStrToDateTime(campaign.ends_at, "dd MMM yyyy HH:mm")}
                  </p>
                ) : null}

                {campaign.is_open ? (
                  <Button
                    onClick={handleDonateClick}
                    className="mt-4 w-full border-2 border-black bg-primary text-black"
                    style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                  >
                    Donasi sekarang
                  </Button>
                ) : (
                  <p className="mt-4 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
                    Campaign ini sedang tidak menerima donasi.
                  </p>
                )}
              </div>
            </div>

            {isFormOpen ? (
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="mb-3 text-lg font-semibold text-black">
                  Buat donasi
                </h2>
                <FormDonation
                  campaignSlug={campaign.slug}
                  onCancel={() => setIsFormOpen(false)}
                />
              </div>
            ) : null}

            {campaign.story ? (
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-lg font-semibold text-black">Cerita</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-black">
                  {campaign.story}
                </p>
              </div>
            ) : null}

            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h2 className="text-lg font-semibold text-black">
                Laporan penggunaan dana
              </h2>
              {updates.length === 0 ? (
                <p className="mt-2 text-sm text-black">
                  Belum ada laporan yang diterbitkan.
                </p>
              ) : (
                <div className="mt-3 grid gap-3">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="rounded-lg border-2 border-black bg-yellow-200 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
                          {updateKindLabel(update.kind)}
                        </span>
                        {update.amount != null ? (
                          <span className="text-sm font-semibold text-black">
                            {formatRupiah(update.amount)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 font-semibold text-black">
                        {update.title}
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm text-black">
                        {update.body}
                      </p>
                      {update.proof_url ? (
                        <a
                          href={update.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-sm font-semibold text-primary underline"
                        >
                          Lihat bukti
                        </a>
                      ) : null}
                      <p className="mt-1 text-xs text-black">
                        {formatStrToDateTime(update.created_at, "dd MMM yyyy HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {messages.length > 0 ? (
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-lg font-semibold text-black">
                  Doa & dukungan
                </h2>
                <div className="mt-3 grid gap-3">
                  {messages.map((item) => (
                    <div
                      key={item.public_id}
                      className="rounded-lg border-2 border-black bg-yellow-200 p-3"
                    >
                      <p className="text-sm text-black">{item.message}</p>
                      <p className="mt-1 text-xs text-black">
                        — {item.donor_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h2 className="text-lg font-semibold text-black">Donatur</h2>
              {donors.length === 0 ? (
                <p className="mt-2 text-sm text-black">
                  Jadilah donatur pertama.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {donors.map((donation) => (
                    <div
                      key={donation.public_id}
                      className="flex items-center justify-between rounded-lg border-2 border-black bg-yellow-200 px-3 py-2"
                    >
                      <span className="text-sm text-black">
                        {donation.donor_name}
                      </span>
                      <span className="text-sm font-semibold text-black">
                        {donation.amount != null
                          ? formatRupiah(donation.amount)
                          : "Disembunyikan"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-black">
                Ingin melihat donasi Anda?{" "}
                <Link href="/profile" className="font-semibold underline">
                  Buka profil
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
