"use client";
import DonationPaymentCard from "@/components/Card/DonationPaymentCard";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getMyDonation } from "@/redux/slices/fundraisingSlice";
import { donationStatusLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function DonationStatusPage() {
  const params = useParams<{ public_id: string }>();
  const publicId = params?.public_id ?? "";

  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.fundraising.donationResult);
  const isLoading = useAppSelector((state) => state.fundraising.loading);
  const error = useAppSelector((state) => state.fundraising.error);

  useEffect(() => {
    if (publicId) {
      dispatch(getMyDonation(publicId));
    }
  }, [dispatch, publicId]);

  const donation = result?.donation;

  return (
    <RequiredAuthLayout redirectTo={`/donations/status/${publicId}`}>
      <MainLayout>
        <CommonHeader
          title="Status Donasi"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
        {error ? (
          <div
            role="alert"
            className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
          >
            <span>{error}</span>
          </div>
        ) : null}
          {donation == null && isLoading ? (
            <p className="text-black">Memuat donasi…</p>
          ) : donation == null ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">Donasi tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <p className="text-sm text-black">Donasi untuk</p>
                <Link
                  href={`/donations/${donation.campaign_slug}`}
                  className="text-lg font-semibold text-black underline"
                >
                  {donation.campaign_title}
                </Link>

                <dl className="mt-3 grid gap-2 text-sm text-black">
                  <div className="flex justify-between">
                    <dt>Nominal</dt>
                    <dd className="font-semibold">
                      {formatRupiah(donation.amount)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Status</dt>
                    <dd className="font-semibold">
                      {donationStatusLabel(donation.status)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Dibuat</dt>
                    <dd>{formatStrToDateTime(donation.created_at, "dd MMM yyyy HH:mm")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tampil sebagai</dt>
                    <dd>
                      {donation.is_anonymous ? "Hamba Allah (anonim)" : "Nama akun"}
                    </dd>
                  </div>
                </dl>

                {donation.status === "rejected" &&
                donation.decision_reason ? (
                  <p className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
                    Alasan: {donation.decision_reason}
                  </p>
                ) : null}
                {donation.status === "refunded" ? (
                  <p className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
                    Dana donasi ini sudah dikembalikan.
                    {donation.decision_reason
                      ? ` Alasan: ${donation.decision_reason}`
                      : ""}
                  </p>
                ) : null}
              </div>

              {donation.status === "pending" ? (
                <DonationPaymentCard
                  donation={donation}
                  charge={result?.charge}
                />
              ) : null}

              {donation.status === "confirmed" ? (
                <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <p className="text-black">
                    Donasi ini sudah terverifikasi. Terima kasih!
                    {donation.rewarded_xp > 0
                      ? ` Anda mendapat ${donation.rewarded_xp} XP.`
                      : ""}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
