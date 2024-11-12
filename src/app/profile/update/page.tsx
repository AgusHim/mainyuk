import UpdateProfilePage from "@/components/Pages/ProfileUpdatePage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Update Profile",
  description: "Update profile akun YukNgaji Solo",
  // other metadata
};

export default function UpdateProfile() {
  return <UpdateProfilePage />;
}
