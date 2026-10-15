"use client";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderLayout from "@/layout/OrderLayout";

export default function OrderPage({
  params,
}: {
  params: { public_id: string };
}) {
  return (
    <RequiredAuthLayout redirectTo={`/orders/${params.public_id}`}>
      <OrderLayout params={params} />
    </RequiredAuthLayout>
  );
}
