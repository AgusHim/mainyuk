import DashboardModerationPage from "@/components/Pages/DashboardModerationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderasi - YukNgaji Solo",
  description: "Antrean laporan dan tindakan moderasi komunitas",
  // other metadata
};

const ModerationPage = () => {
  return (
    <>
      <DashboardModerationPage />
    </>
  );
};

export default ModerationPage;
