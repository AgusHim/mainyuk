import { Metadata } from "next";
import { EventLayout } from "@/layout/EventLayout";
import { MainLayout } from "@/layout/MainLayout";

export const metadata: Metadata = {
  title: "Detail Event",
  description: "Detail event YukNgaji Solo",
  // other metadata
};
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <MainLayout>
      <EventLayout slug={resolvedParams.slug} />
    </MainLayout>
  );
}
