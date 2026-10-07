import DashboardMetricsPage from "@/components/Pages/DashboardMetricsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metrik - YukNgaji Solo",
  description: "Ringkasan aktivitas akun, misi, donasi, toko, dan komunitas",
};

const MetricsPage = () => {
  return (
    <>
      <DashboardMetricsPage />
    </>
  );
};

export default MetricsPage;
