import DashboardShopPage from "@/components/Pages/DashboardShopPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toko - YukNgaji Solo",
  description: "Pengelolaan katalog, stok, dan pesanan merchandise",
  // other metadata
};

const ShopAdminPage = () => {
  return (
    <>
      <DashboardShopPage />
    </>
  );
};

export default ShopAdminPage;
