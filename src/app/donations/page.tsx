import DonationsPage from "@/components/Pages/DonationsPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi | YukNgaji Solo",
  description:
    "Dukung program sosial, pendidikan, dan dakwah YukNgaji Solo serta pantau perkembangan penggunaan dananya.",
};

export default function Donations() {
  return <DonationsPage />;
}
