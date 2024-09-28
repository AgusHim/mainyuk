import dynamic from 'next/dynamic'
const ProfilePage = dynamic(
  () => import("@/components/Pages/ProfilePage"),
  { ssr: false }
)
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile akun YukNgaji Solo",
  // other metadata
};

export default function Profile() {
  return (
    <>
      <ProfilePage/>
    </>
  );
}
