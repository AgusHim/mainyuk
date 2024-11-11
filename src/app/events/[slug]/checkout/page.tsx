import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { CheckoutLayout } from "@/layout/CheckoutLayout";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembelian Tiket - YukNgaji Solo",
  description: "Pembelian tiket event YukNgaji Solo",
  // other metadata
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <>
      <RequiredAuthLayout redirectTo={`/events/${resolvedParams.slug}`}>
        <MainLayout>
          <CommonHeader title="Pembelian Tiket" isShowBack={true} />
          <CheckoutLayout slug={resolvedParams.slug} />
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
