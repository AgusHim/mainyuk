"use client";
import React from "react";
import ProfileDonationsCard from "@/components/Card/ProfileDonationsCard";
import ProfileMenuCard from "@/components/Card/ProfileMenuCard";
import ProfileUserCard from "@/components/Card/ProfileUserCard";
import ProfileXPCard from "@/components/Card/ProfileXPCard";
import { CommonHeader } from "@/components/Header/CommonHeader";
const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});
import { MainLayout } from "@/layout/MainLayout";
import dynamic from "next/dynamic";

export default function ProfilePage() {
  return (
    <>
      <RequiredAuthLayout redirectTo={"/profile"}>
        <MainLayout>
          <CommonHeader
            title="Profile Akun"
            isShowBack={true}
            isShowTrailing={false}
          />
          <div className="yn-container bg-yellow-400 p-4">
            <div className="grid gap-4">
              <ProfileUserCard />
              <ProfileXPCard />
              <ProfileDonationsCard />
              <ProfileMenuCard />
            </div>
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
