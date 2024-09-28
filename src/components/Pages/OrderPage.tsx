"use client"
import { RequiredAuthLayout } from "@/components/layout/AuthLayout";
import OrderLayout from "@/components/layout/OrderLayout";

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
