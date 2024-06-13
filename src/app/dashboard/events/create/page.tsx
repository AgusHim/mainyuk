import BreadcrumbEvent from "@/components/Breadcrumbs/BreadcrumbEvent";
import FormEvent from "@/components/Form/FormEvent";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Event",
  description: "Halaman buat event YukNgaji Solo",
  // other metadata
};

const CreateEventPage = () => {
  return (
    <>
      <BreadcrumbEvent pageName="Buat Event" />
      <FormEvent></FormEvent>
    </>
  );
};

export default CreateEventPage;
