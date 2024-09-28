import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/components/layout/AuthLayout";
import { CheckoutLayout } from "@/components/layout/CheckoutLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembelian Tiket - YukNgaji Solo",
  description: "Pembelian tiket event YukNgaji Solo",
  // other metadata
};

export default function OrderDetail({ params }: { params: { slug: string } }) {
  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader title="Pembelian Tiket" isShowBack={true} />
          <CheckoutLayout slug={params.slug} />
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
