import DonationsPage from "@/components/Pages/DonationsPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi",
  description: "Campaign penggalangan dana YukNgaji Solo",
};

export default function Donations() {
  return <DonationsPage />;
}
