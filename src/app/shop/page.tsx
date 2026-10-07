import { Metadata } from "next";
import ShopPage from "@/components/Pages/ShopPage";

export const metadata: Metadata = {
  title: "Toko",
  description: "Merchandise resmi YukNgaji Solo",
  // other metadata
};

export default function Shop() {
  return <ShopPage />;
}
