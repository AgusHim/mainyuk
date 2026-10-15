import { Metadata } from "next";
import ProductDetailPage from "@/components/Pages/ProductDetailPage";

export const metadata: Metadata = {
  title: "Detail Produk | YukNgaji Solo",
  description:
    "Lihat detail, pilihan varian, harga, dan ketersediaan merchandise resmi YukNgaji Solo.",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailPage slug={resolvedParams.slug} />;
}
