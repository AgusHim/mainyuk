import ProfilePage from "@/components/Pages/ProfilePage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Akun | YukNgaji Solo",
  description:
    "Kelola profil, kontribusi, riwayat transaksi, dan perjalanan XP YukNgaji Solo.",
};

export default function Profile() {
  return <ProfilePage />;
}
