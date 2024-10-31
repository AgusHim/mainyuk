import AgendaDetailPage from "@/components/Pages/AgendaDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Agenda",
  description: "Halaman detail agenda",
  // other metadata
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <AgendaDetailPage params={params} />;
}
