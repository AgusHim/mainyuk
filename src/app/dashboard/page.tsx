import Admin from "@/components/Dashboard/Admin";
import DashboardPage from "@/components/Pages/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YukNgaji | Solo",
  description: "Dashboard admin YukNgaji regional Solo",
  // other metadata
};

export default function Home() {
    return (
      <>
        <DashboardPage />
      </>
    );
}
