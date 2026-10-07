import { Metadata } from "next";
import ShopCartPage from "@/components/Pages/ShopCartPage";

export const metadata: Metadata = {
  title: "Keranjang",
  description: "Keranjang merchandise YukNgaji Solo",
  // other metadata
};

export default function Cart() {
  return <ShopCartPage />;
}
