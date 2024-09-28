import dynamic from 'next/dynamic'
const OrderTicketsPage = dynamic(
  () => import("@/components/Pages/OrderTicketsPage"),
  { ssr: false }
)
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi- YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function OrderTickets({
  params,
}: {
  params: { public_id: string };
}) {
  return (
    <OrderTicketsPage params={params} />
  );
}
