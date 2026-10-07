import LeaderboardPage from "@/components/Pages/LeaderboardPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Peringkat keaktifan anggota YukNgaji Solo",
};

export default function Leaderboard() {
  return <LeaderboardPage />;
}
