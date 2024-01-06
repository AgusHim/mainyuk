import { Metadata } from "next";
import LiveEventPage from "@/components/Page/LiveEventPage";

export const metadata: Metadata = {
  title: "Live Event",
  description: "Live event MainYuk regional Solo",
};

export default function LiveEvent({ params }: { params: { slug: string } }) {
  return <LiveEventPage params={params} />;
}
