"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getCampaigns } from "@/redux/slices/fundraisingSlice";
import { fundTypeLabel } from "@/types/fundraising";
import { formatRupiah, formatRupiahShort } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function DonationsPage() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((state) => state.fundraising.campaigns);
  const isLoading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);

  useEffect(() => {
    if (campaigns == null) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

  return (
    <MainLayout>
      <CommonHeader title="Donasi" isShowBack={true} isShowTrailing={false} />
      <div className="yn-container bg-yellow-400 p-4">
        <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
          <h1 className="text-lg font-semibold text-black">
            Galang dana bersama YukNgaji Solo
          </h1>
          <p className="mt-1 text-sm text-black">
            Setiap donasi tercatat, terverifikasi pengurus, dan laporannya
            terbuka.
          </p>
        </div>

        {error != null ? (
          <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
            {error}
          </div>
        ) : null}

        {campaigns == null && isLoading ? (
          <p className="text-black">Memuat campaign…</p>
        ) : campaigns != null && campaigns.length === 0 ? (
          <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-black">
              Belum ada campaign yang dibuka. Cek lagi nanti.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {campaigns?.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/donations/${campaign.slug}`}
                className="block overflow-hidden rounded-xl border-2 border-black bg-yellow-300 shadow-custom"
              >
                {campaign.cover_image_url ? (
                  <div className="relative h-40 w-full border-b-2 border-black bg-yellow-200">
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
                  <h2 className="mt-2 text-lg font-semibold text-black">
                    {campaign.title}
                  </h2>
                  {campaign.summary ? (
                    <p className="mt-1 line-clamp-2 text-sm text-black">
                      {campaign.summary}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <div className="h-3 w-full overflow-hidden rounded-full border-2 border-black bg-yellow-200">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${campaign.progress_percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-black">
                      <span className="font-semibold">
                        {formatRupiahShort(campaign.raised_amount)}
                      </span>
                      <span>
                        {campaign.target_amount > 0
                          ? `dari ${formatRupiah(campaign.target_amount)}`
                          : "tanpa target"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-black">
                      {campaign.donor_count} donatur
                      {!campaign.is_open ? " · sudah ditutup" : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
