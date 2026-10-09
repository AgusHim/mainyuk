"use client"
import React from "react";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"),{
  ssr: false,
});
import { MainLayout } from "@/layout/MainLayout";
import dynamic from "next/dynamic";

export default function OrdersPage() {
  return (
    <>
    <RequiredAuthLayout redirectTo={`/orders`}>
      <MainLayout>
        <CommonHeader title="Transaksi" />
        <GridOrders />
      </MainLayout>
    </RequiredAuthLayout>
    </>
  );
}
