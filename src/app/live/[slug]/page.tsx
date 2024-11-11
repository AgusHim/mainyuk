import { Metadata } from "next";
import LiveEventPage from "@/components/Pages/LiveEventPage";

export const metadata: Metadata = {
  title: "Live Event",
  description: "Live event YukNgaji regional Solo",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <LiveEventPage params={resolvedParams} />;
}
