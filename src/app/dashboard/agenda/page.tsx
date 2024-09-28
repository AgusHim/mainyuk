import DashboardAgendaPage from "@/components/Pages/DashboardAgendaPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda - YukNgaji Solo",
  description: "Halaman daftar agenda YukNgaji Solo",
  // other metadata
};

const AgendaPage = () => {
  return (
    <>
      <DashboardAgendaPage/>
    </>
  );
};

export default AgendaPage;
