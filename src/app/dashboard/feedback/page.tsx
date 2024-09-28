import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableFeedback from "@/components/Tables/TableFeedback";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Feedback - YukNgaji Solo",
  description: "Halaman feedback YukNgaji Solo",
  // other metadata
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Feedback" />
      <div className="flex flex-col gap-10">
        <TableFeedback />
      </div>
    </>
  );
};

export default TablesPage;
