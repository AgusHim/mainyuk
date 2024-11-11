import dynamic from "next/dynamic";
const SignInPage = dynamic(() => import("@/components/Pages/SignInPage"), {
  loading: () => <p>Loading...</p>,
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - YukNgaji Solo",
  description: "Halaman signin YukNgaji Solo",
  // other metadata
};

const SignIn: React.FC = () => {
  return (
    <>
      <SignInPage />
    </>
  );
};

export default SignIn;
