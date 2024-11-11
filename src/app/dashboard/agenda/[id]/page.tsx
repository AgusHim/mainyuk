import AgendaDetailPage from "@/components/Pages/AgendaDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Agenda",
  description: "Halaman detail agenda",
  // other metadata
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <AgendaDetailPage params={resolvedParams} />;
}
