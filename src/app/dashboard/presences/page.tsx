import DashboardPresencesPage from "@/components/Pages/DashboardPresencesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Kehadiran - YukNgaji Solo",
  description: "Halaman riwayat kehadiran event di YukNgaji Solo",
  // other metadata
};

const PresencesPage = () => {
  return (
    <>
      <DashboardPresencesPage />
    </>
  );
};

export default PresencesPage;
