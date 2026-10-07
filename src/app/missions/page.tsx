import MissionsPage from "@/components/Pages/MissionsPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misi",
  description: "Daftar misi anggota YukNgaji Solo",
};

export default function Missions() {
  return <MissionsPage />;
}
