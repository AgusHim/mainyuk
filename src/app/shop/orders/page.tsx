import { Metadata } from "next";
import ShopOrdersPage from "@/components/Pages/ShopOrdersPage";

export const metadata: Metadata = {
  title: "Pesanan Merchandise",
  description: "Riwayat pesanan merchandise YukNgaji Solo",
  // other metadata
};

export default function ShopOrders() {
  return <ShopOrdersPage />;
}
