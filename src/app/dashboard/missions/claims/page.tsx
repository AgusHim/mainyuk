import DashboardMissionClaimsPage from "@/components/Pages/DashboardMissionClaimsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antrean Klaim Misi - YukNgaji Solo",
  description: "Halaman pemeriksaan klaim misi YukNgaji Solo",
  // other metadata
};

const MissionClaimsPage = () => {
  return (
    <>
      <DashboardMissionClaimsPage />
    </>
  );
};

export default MissionClaimsPage;
