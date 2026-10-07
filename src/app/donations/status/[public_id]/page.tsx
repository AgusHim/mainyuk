import DonationStatusPage from "@/components/Pages/DonationStatusPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Donasi",
  description: "Status dan instruksi pembayaran donasi",
};

export default function DonationStatus() {
  return <DonationStatusPage />;
}
