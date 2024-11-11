import { Metadata } from "next";
import QRScanner from "@/components/QRScanner/QRScanner";

export const metadata: Metadata = {
  title: "Agenda - YukNgaji Solo",
  description: "Halaman daftar agenda YukNgaji Solo",
  // other metadata
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgendaScanPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <>
      <QRScanner params={resolvedParams}/>
    </>
  );
};
