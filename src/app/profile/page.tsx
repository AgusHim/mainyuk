import ProfilePage from "@/components/Pages/ProfilePage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
  description: "Profile akun YukNgaji Solo",
  // other metadata
};

export default async function Profile() {
  return <ProfilePage />;
}
