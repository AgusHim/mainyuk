"use client"
import React from "react";
import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";

export default function OrdersPage() {
  return (
    <>
    <RequiredAuthLayout>
      <MainLayout>
        <CommonHeader title="Transaksi" />
        <GridOrders />
        <BottomNavBar />
      </MainLayout>
    </RequiredAuthLayout>
    </>
  );
}
