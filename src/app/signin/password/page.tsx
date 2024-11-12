import dynamic from "next/dynamic";
const SignInPage = dynamic(() => import("@/components/Pages/SignInPage"), {
  loading: () =>null,
});
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Masuk - YukNgaji Solo",
  description: "Halaman signin YukNgaji Solo",
  // other metadata
};

export default function Page() {
  return <SignInPage />;
};