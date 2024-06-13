import BreadcrumbAgenda from "@/components/Breadcrumbs/BreadcrumbAgenda";
import FormAgenda from "@/components/Form/FormAgenda";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Agenda",
  description: "Halaman buat agenda YukNgaji Solo",
  // other metadata
};

const CreateAgendaPage = () => {
  return (
    <>
      <BreadcrumbAgenda pageName="Buat Agenda" />
      <FormAgenda></FormAgenda>
    </>
  );
};

export default CreateAgendaPage;
