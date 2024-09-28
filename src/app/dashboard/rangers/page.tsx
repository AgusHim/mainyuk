import DashboardRangersPage from "@/components/Pages/DashboardRangersPage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rangers - YukNgaji Solo",
  description: "Halaman daftar tim rangers YukNgaji Solo",
  // other metadata
};

const RangersPage = () => {
  return (
    <>
      <DashboardRangersPage />
    </>
  );
};

export default RangersPage;
