import DashboardCampaignReportPage from "@/components/Pages/DashboardCampaignReportPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Campaign",
  description: "Rekonsiliasi dana dan laporan penggunaan campaign",
};

export default function DashboardCampaignReport() {
  return <DashboardCampaignReportPage />;
}
