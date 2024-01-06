import { Metadata } from "next";
import EventDetailPage from "@/components/Page/EventDetail";

export const metadata: Metadata = {
  title: "Event - MainYuk Solo",
  description: "Detail event MainYuk Solo",
  // other metadata
};

export default function Page({ params }: { params: { slug: string } }) {
  return <EventDetailPage params={params}/>;
}
