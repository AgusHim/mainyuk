import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableEvent from "@/components/Tables/TableEvent";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Daftar Event",
  description: "Halaman daftar event YukNgaji Solo",
  // other metadata
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Events" />
      <div className="flex flex-col gap-10">
        <TableEvent />
      </div>
    </>
  );
};

export default TablesPage;
