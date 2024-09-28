"use client"
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import OrderLayout from "@/layout/OrderLayout";

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
