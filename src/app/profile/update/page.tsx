import FormProfileUpdate from "@/components/Form/FormProfileUpdate";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Update profile akun YukNgaji Solo",
  // other metadata
};

export default function UpdateProfilePage() {
  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader title="Update Profile" isShowBack={true} isShowTrailing={false} />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            <FormProfileUpdate/>
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
