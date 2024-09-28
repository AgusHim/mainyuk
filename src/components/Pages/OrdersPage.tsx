import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";

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
