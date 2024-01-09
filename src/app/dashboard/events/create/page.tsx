import BreadcrumbEvent from "@/components/Breadcrumbs/BreadcrumbEvent";
import FormEvent from "@/components/Form/FormEvent";

import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Daftar Event",
  description: "Halaman daftar event YukNgaji Solo",
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
