"use client"
import dynamic from "next/dynamic";
const SignInPage = dynamic(() => import("@/components/Pages/SignInPage"), {
  ssr: false,
});
// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Masuk - YukNgaji Solo",
//   description: "Halaman signin YukNgaji Solo",
//   // other metadata
// };

const SignIn: React.FC = () => {
  return (
    <>
      <SignInPage />
    </>
  );
};

export default SignIn;
