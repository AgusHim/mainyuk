import { Metadata } from "next";
import EventDetailPage from "@/components/Pages/EventDetail";

export const metadata: Metadata = {
  title: "Event - YukNgaji Solo",
  description: "Detail event YukNgaji Solo",
  // other metadata
};

export default function Page({ params }: { params: { slug: string } }) {
  return <EventDetailPage params={params}/>;
}
