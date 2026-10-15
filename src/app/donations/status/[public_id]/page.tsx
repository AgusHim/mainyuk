import DonationStatusPage from "@/components/Pages/DonationStatusPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Donasi | YukNgaji Solo",
  description:
    "Lihat status verifikasi dan instruksi pembayaran donasi YukNgaji Solo.",
};

export default function DonationStatus() {
  return <DonationStatusPage />;
}
