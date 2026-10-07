import DashboardMissionsPage from "@/components/Pages/DashboardMissionsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misi - YukNgaji Solo",
  description: "Halaman pengelolaan misi YukNgaji Solo",
  // other metadata
};

const MissionsPage = () => {
  return (
    <>
      <DashboardMissionsPage />
    </>
  );
};

export default MissionsPage;
