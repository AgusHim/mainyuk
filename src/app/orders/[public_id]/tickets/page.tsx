import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderTicketsLayout from "@/layout/OrderTicketsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi- YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function OrderTicketsPage({
  params,
}: {
  params: { public_id: string };
}) {
  return (
    <RequiredAuthLayout>
      <OrderTicketsLayout params={params} />
    </RequiredAuthLayout>
  );
}
