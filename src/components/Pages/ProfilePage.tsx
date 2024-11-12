"use client";
import React from "react";
import ProfileMenuCard from "@/components/Card/ProfileMenuCard";
import ProfileUserCard from "@/components/Card/ProfileUserCard";
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
