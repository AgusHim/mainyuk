import DashboardInstagramPage from "@/components/Pages/DashboardInstagramPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram - YukNgaji Solo",
  description: "Halaman pengelolaan dinding komunitas Instagram YukNgaji Solo",
  // other metadata
};

const InstagramPage = () => {
  return (
    <>
      <DashboardInstagramPage />
    </>
  );
};

export default InstagramPage;
