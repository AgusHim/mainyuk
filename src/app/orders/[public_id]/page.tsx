import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderLayout from "@/layout/OrderLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi- YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function OrderPage({
  params,
}: {
  params: { public_id: string };
}) {
  return (
    <RequiredAuthLayout>
      <OrderLayout params={params} />
    </RequiredAuthLayout>
  );
}
