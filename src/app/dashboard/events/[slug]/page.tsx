import DashboardEventDetailPage from "@/components/Page/DashboardEventDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Event",
  description: "Halaman detail event",
  // other metadata
};

export default function Page({ params }: { params: { slug: string } }) {
  return <DashboardEventDetailPage params={params} />;
}
