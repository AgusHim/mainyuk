import OrdersPage from "@/components/Pages/OrdersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Transaksi",
  description: "Riwayat tiket event, donasi, dan pesanan shop YukNgaji Solo",
};

export default function Orders() {
  return <OrdersPage/>;
}
