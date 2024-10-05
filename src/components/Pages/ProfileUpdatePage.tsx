"use client";
import FormProfileUpdate from "@/components/Form/FormProfileUpdate";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";

export default function UpdateProfilePage({
  params,
}: {
  params: {
    isFromGoogle: string;
    redirectTo: string;
  };
}) {
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
