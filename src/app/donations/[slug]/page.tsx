import CampaignDetailPage from "@/components/Pages/CampaignDetailPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Campaign",
  description: "Detail campaign penggalangan dana YukNgaji Solo",
};

export default function CampaignDetail() {
  return <CampaignDetailPage />;
}
