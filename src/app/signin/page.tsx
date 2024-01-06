
import SignInPage from "@/components/Pages/SignInPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Dashboard",
  description: "Halaman signin dashboard",
  // other metadata
};

const SignIn: React.FC = () => {
  return <SignInPage/>;
};

export default SignIn;
