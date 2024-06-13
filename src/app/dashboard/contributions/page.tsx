import DashboardContributionsPage from "@/components/Pages/DashboardContributionsPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Riwayat Kontribusi | YukNgaji Solo",
  description: "Halaman riwayat kontribusi di YukNgaji Solo",
  // other metadata
};

const RangersPage = () => {
  return (
    <>
      <DashboardContributionsPage/>
    </>
  );
};

export default RangersPage;
