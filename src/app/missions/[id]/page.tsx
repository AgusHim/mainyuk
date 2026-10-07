import MissionDetailPage from "@/components/Pages/MissionDetailPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Misi",
  description: "Detail dan klaim misi anggota YukNgaji Solo",
};

export default function MissionDetail() {
  return <MissionDetailPage />;
}
