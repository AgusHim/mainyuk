import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Transaksi",
  description:
    "Daftar transaksi tiket event YukNgaji Solo yang pernah kamu beli",
  // other metadata
};

export default function Orders() {
  return (
    <>
      <MainLayout>
        <CommonHeader title="Transaksi" />
        <GridOrders />
        <BottomNavBar />
      </MainLayout>
    </>
  );
}
