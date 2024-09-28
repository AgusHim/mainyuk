import IndexPage from "@/components/Pages/IndexPage";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YukNgaji Solo",
  description: "YukNgaji regional Solo",
  // other metadata
};

export default function Index() {
  return (
    <MainLayout>
      <IndexPage />
    </MainLayout>
  );
}
