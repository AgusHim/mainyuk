import ScanTicketPage from "@/components/Pages/ScanTicketPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Tiket",
  description: "Scan tiket event YukNgaji Solo",
  // other metadata
}; 

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <>
      <ScanTicketPage params={resolvedParams}/>
    </>
  );
}
