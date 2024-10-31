import OrdersPage from "@/components/Pages/OrdersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Transaksi",
  description:
    "Daftar transaksi tiket event YukNgaji Solo yang pernah kamu beli",
  // other metadata
};

export default function Orders() {
  return <OrdersPage/>;
}
