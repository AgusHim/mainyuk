"use client"
import { RequiredAuthLayout } from "@/components/layout/AuthLayout";
import OrderTicketsLayout from "@/components/layout/OrderTicketsLayout";

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
