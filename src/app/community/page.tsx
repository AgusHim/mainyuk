import CommunityPage from "@/components/Pages/CommunityPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komunitas",
  description: "Feed komunitas anonim YukNgaji Solo",
};

export default function Community() {
  return <CommunityPage />;
}
