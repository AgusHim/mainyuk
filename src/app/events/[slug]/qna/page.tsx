import { Metadata } from "next";
import EventDetailPage from "@/components/Pages/EventDetail";

export const metadata: Metadata = {
  title: "Event - YukNgaji Solo",
  description: "Detail event YukNgaji Solo",
  // other metadata
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <EventDetailPage params={resolvedParams}/>;
}
