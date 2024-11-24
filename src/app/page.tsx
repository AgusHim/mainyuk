import IndexPage from "@/components/Pages/IndexPage";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YukNgaji Solo - Komunitas Pemuda Hijrah",
  description: "YukNgaji Solo merupakan komunitas dakwah untuk pemuda di kota Surakarta / Solo dan sekitarnya.",
  // other metadata
};

export default function Index() {
  return (
      <IndexPage />
  );
}
