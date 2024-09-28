import dynamic from 'next/dynamic'
const OrderPage = dynamic(
  () => import("@/components/Pages/OrderPage"),
  { ssr: false }
)
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi- YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function Order({
  params,
}: {
  params: { public_id: string };
}) {
  return <OrderPage params={params}/>
}
