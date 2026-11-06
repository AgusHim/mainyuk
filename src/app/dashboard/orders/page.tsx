import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOrders from "@/components/Tables/TableOrders";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Orders - YukNgaji Solo",
  description: "Halaman daftar orders tiket event YukNgaji Solo",
  // other metadata
};

const OrdersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Orders" />
      <div className="flex flex-col gap-10">
        <TableOrders />
      </div>
    </>
  );
};

export default OrdersPage;
