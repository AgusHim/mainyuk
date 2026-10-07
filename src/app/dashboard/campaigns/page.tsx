import DashboardCampaignsPage from "@/components/Pages/DashboardCampaignsPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign",
  description: "Kelola campaign penggalangan dana",
};

export default function DashboardCampaigns() {
  return <DashboardCampaignsPage />;
}
