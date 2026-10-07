import DashboardDonationsPage from "@/components/Pages/DashboardDonationsPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi",
  description: "Antrean verifikasi donasi",
};

export default function DashboardDonations() {
  return <DashboardDonationsPage />;
}
