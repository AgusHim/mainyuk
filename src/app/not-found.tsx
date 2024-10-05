import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";

export default function Custom404() {
  return (
    <MainLayout>
      <CommonHeader title="Halaman Tidak Ditemukan" />
      <div className="flex items-center justify-center">
        <h1 className="text-3xl text-black">Halaman tidak ditemukan 😭</h1>
      </div>
      <BottomNavBar />
    </MainLayout>
  );
}
