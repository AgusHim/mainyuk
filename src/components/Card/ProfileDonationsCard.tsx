"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getMyDonations } from "@/redux/slices/fundraisingSlice";
import { donationStatusLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import Link from "next/link";
import { useEffect } from "react";

const ProfileDonationsCard = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector((state) => state.fundraising.myDonations);

  useEffect(() => {
    if (donations.length === 0) {
      dispatch(getMyDonations(1));
    }
  }, [dispatch, donations.length]);

  // Riwayat di profil selalu lengkap: pemilik donasi berhak melihat donasinya
  // apa adanya, termasuk yang anonim.
  const latest = donations.slice(0, 5);

  return (
    <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black">Donasi saya</h2>
        <Link href="/donations" className="text-sm font-semibold text-primary underline">
          Donasi lagi
        </Link>
      </div>

      {latest.length === 0 ? (
        <p className="mt-2 text-sm text-black">
          Belum ada donasi.{" "}
          <Link href="/donations" className="font-semibold underline">
            Lihat campaign
          </Link>
        </p>
      ) : (
        <div className="mt-3 grid gap-2">
          {latest.map((donation) => (
            <Link
              key={donation.id}
              href={`/donations/status/${donation.public_id}`}
              className="flex items-center justify-between rounded-lg border-2 border-black bg-yellow-200 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-black">
                  {donation.campaign_title}
                </p>
                <p className="text-xs text-black">
                  {formatStrToDateTime(donation.created_at, "dd MMM yyyy")} ·{" "}
                  {donationStatusLabel(donation.status)}
                </p>
              </div>
              <span className="text-sm font-semibold text-black">
                {formatRupiah(donation.amount)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDonationsCard;
