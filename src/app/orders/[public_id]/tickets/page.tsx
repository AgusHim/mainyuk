import OrderTicketsPage from "@/components/Pages/OrderTicketsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi - YukNgaji Solo",
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
