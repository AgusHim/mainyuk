import { Metadata } from "next";
import { EventLayout } from "@/components/layout/EventLayout";
import { MainLayout } from "@/components/layout/MainLayout";

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
