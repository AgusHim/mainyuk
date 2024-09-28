import { Metadata } from "next";
import QRScanner from "@/components/QRScanner/QRScanner";

export const metadata: Metadata = {
  title: "Agenda - YukNgaji Solo",
  description: "Halaman daftar agenda YukNgaji Solo",
  // other metadata
};

export default function AgendaScanPage ({ params }: { params: { id: string } }) {
  return (
    <>
      <QRScanner params={params}/>
    </>
  );
};
