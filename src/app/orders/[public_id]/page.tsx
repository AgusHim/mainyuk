import OrderPage from "@/components/Pages/OrderPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi - YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function Order({
  params,
}: {
  params: { public_id: string };
}) {
  return <OrderPage params={params}/>
}
