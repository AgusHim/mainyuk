"use client"
import dynamic from "next/dynamic";
const UpdateProfilePage = dynamic(() => import("@/components/Pages/ProfileUpdatePage"), {
  ssr:false,
});

// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Update Profile",
//   description: "Update profile akun YukNgaji Solo",
//   // other metadata
// };

export default function UpdateProfile() {
  return (
    <>
      <UpdateProfilePage />
    </>
  );
}
