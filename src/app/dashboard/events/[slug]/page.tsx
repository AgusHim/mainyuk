import DashboardEventDetailPage from "@/components/Pages/DashboardEventDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Event",
  description: "Halaman detail event",
  // other metadata
};
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <DashboardEventDetailPage params={resolvedParams} />;
}
