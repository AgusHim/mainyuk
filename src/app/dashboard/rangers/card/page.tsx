import DashboardRangerCardPage from "@/components/Pages/DashboardRangerCardPage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Kartu Ranger | YukNgaji Solo",
  description: "Halaman kartu anggota tim rangers YukNgaji Solo",
  // other metadata
};

const RangerCardPage = () => {
  return (
    <>
      <DashboardRangerCardPage />
    </>
  );
};

export default RangerCardPage;
