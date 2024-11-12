import dynamic from "next/dynamic";
const SignOTPPage = dynamic(() => import("@/components/Pages/SignOTPPage"),{
  loading: () =>null,
});

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Masuk - YukNgaji Solo",
  description: "Halaman signin YukNgaji Solo",
  // other metadata
};

export default async function Page() {
  return<SignOTPPage />;
};
