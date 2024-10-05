"use client"
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderTicketsLayout from "@/layout/OrderTicketsLayout";

export default function OrderTicketsPage({
  params,
}: {
  params: { public_id: string };
}) {
  return (
    <RequiredAuthLayout redirectTo={`/orders/${params.public_id}`}>
      <OrderTicketsLayout params={params} />
    </RequiredAuthLayout>
  );
}
