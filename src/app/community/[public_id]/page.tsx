import ThreadDetailPage from "@/components/Pages/ThreadDetailPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thread",
  description: "Detail thread komunitas YukNgaji Solo",
};

export default async function ThreadDetail({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;
  return <ThreadDetailPage publicId={public_id} />;
}
