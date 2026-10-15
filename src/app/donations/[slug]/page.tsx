import CampaignDetailPage from "@/components/Pages/CampaignDetailPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Program Donasi | YukNgaji Solo",
  description:
    "Lihat tujuan, perkembangan, laporan dana, dan dukung program donasi YukNgaji Solo.",
};

export default function CampaignDetail() {
  return <CampaignDetailPage />;
}
