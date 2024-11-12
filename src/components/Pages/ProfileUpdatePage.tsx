"use client";
import FormProfileUpdate from "@/components/Form/FormProfileUpdate";
import { CommonHeader } from "@/components/Header/CommonHeader";
const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});
import { MainLayout } from "@/layout/MainLayout";
import dynamic from "next/dynamic";

export default function UpdateProfilePage() {
  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader
            title="Update Profile"
            isShowBack={true}
            isShowTrailing={false}
          />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            <FormProfileUpdate />
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
