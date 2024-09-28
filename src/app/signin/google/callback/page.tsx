import { OAuthGoogleCallback } from "@/components/Callback/OAuthGoogleCallback";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - YukNgaji Solo",
  description: "Masuk YukNgaji Solo",
  // other metadata
};

const SignIn: React.FC = () => {
  return (
    <>
      <MainLayout>
        <OAuthGoogleCallback></OAuthGoogleCallback>
      </MainLayout>
    </>
  );
};

export default SignIn;
