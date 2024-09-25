import ProfileMenuCard from "@/components/Card/ProfileMenuCard";
import ProfileUserCard from "@/components/Card/ProfileUserCard";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile akun YukNgaji Solo",
  // other metadata
};

export default function ProfilePage() {
  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader title="Profile Akun" isShowBack={true} isShowTrailing={false} />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            <div className="grid gap-4">
              <ProfileUserCard />
              <ProfileMenuCard />
            </div>
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
