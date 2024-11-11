"use client"
import dynamic from "next/dynamic";
const OrdersPage = dynamic(() => import("@/components/Pages/OrdersPage"), {
  ssr: false,
});
//import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Daftar Transaksi",
//   description:
//     "Daftar transaksi tiket event YukNgaji Solo yang pernah kamu beli",
//   // other metadata
// };

export default function Orders() {
  return (
    <div>
      <OrdersPage />
    </div>
  );
}
