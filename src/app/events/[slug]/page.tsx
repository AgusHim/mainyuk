import { Metadata } from "next";
import { EventLayout } from "@/layout/EventLayout";
import { MainLayout } from "@/layout/MainLayout";

export const metadata: Metadata = {
  title: "Detail Event",
  description: "Detail event YukNgaji Solo",
  // other metadata
};

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <MainLayout>
      <EventLayout slug={params.slug} />
    </MainLayout>
  );
}
