import { Metadata } from "next";
import ProductDetailPage from "@/components/Pages/ProductDetailPage";

export const metadata: Metadata = {
  title: "Detail Produk",
  description: "Detail merchandise resmi YukNgaji Solo",
  // other metadata
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailPage slug={resolvedParams.slug} />;
}
