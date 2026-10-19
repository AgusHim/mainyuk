import { Metadata } from "next";
import EventDetailPage from "@/components/Pages/EventDetail";

export const metadata: Metadata = {
  title: "Tanya Jawab Event - YukNgaji Solo",
  description: "Ruang tanya jawab dan diskusi lanjutan event YukNgaji Solo.",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <EventDetailPage params={resolvedParams}/>;
}
