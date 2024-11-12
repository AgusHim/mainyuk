import dynamic from "next/dynamic";
const SignOTPPage = dynamic(() => import("@/components/Pages/SignOTPPage"));
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - YukNgaji Solo",
  description: "Halaman signin YukNgaji Solo",
  // other metadata
};

const SignIn: React.FC = () => {
  return (
    <>
      <SignOTPPage />
    </>
  );
};

export default SignIn;
