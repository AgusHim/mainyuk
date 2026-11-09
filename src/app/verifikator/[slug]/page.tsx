import EventVerifierPage from "@/components/Pages/EventVerifierPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikator Event | YukNgaji Solo",
  description: "Halaman registrasi dan verifikasi tiket event.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventVerifierPage slug={slug} />;
}
