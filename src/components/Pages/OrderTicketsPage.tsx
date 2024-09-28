"use client"
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderTicketsLayout from "@/layout/OrderTicketsLayout";

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
