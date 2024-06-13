import AgendaDetailPage from "@/components/Pages/AgendaDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Agenda",
  description: "Halaman detail agenda",
  // other metadata
};

export default function Page({ params }: { params: { id: string } }) {
  return <AgendaDetailPage params={params} />;
}
