import DashboardXPSettingsPage from "@/components/Pages/DashboardXPSettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan XP | Dashboard YukNgaji Solo",
  description: "Atur reward XP untuk aktivitas anggota YukNgaji Solo.",
};

export default function DashboardXPPage() {
  return <DashboardXPSettingsPage />;
}
