import dynamic from 'next/dynamic'
const ScanTicketPage = dynamic(
  () => import("@/components/Pages/ScanTicketPage"),
  { ssr: false }
)
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Tiket",
  description: "Scan tiket event YukNgaji Solo",
  // other metadata
}; 

export default function ScanTicket({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <ScanTicketPage params={params}/>
    </>
  );
}
