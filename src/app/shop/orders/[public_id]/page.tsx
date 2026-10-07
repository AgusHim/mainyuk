import { Metadata } from "next";
import ShopOrderDetailPage from "@/components/Pages/ShopOrderDetailPage";

export const metadata: Metadata = {
  title: "Detail Pesanan Merchandise",
  description: "Detail pesanan merchandise YukNgaji Solo",
  // other metadata
};

interface PageProps {
  params: Promise<{ public_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ShopOrderDetailPage publicId={resolvedParams.public_id} />;
}
