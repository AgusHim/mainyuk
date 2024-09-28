import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridEvents from "@/components/Grid/GridEvents";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/components/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Daftar events seru yang dibuat YukNgaji Solo",
  // other metadata
};

export default function Event() {
  return (
    <>
      <MainLayout>
        <CommonHeader title="Events" />
        <GridEvents />
        <BottomNavBar />
      </MainLayout>
    </>
  );
}
