import { Metadata } from "next";
import ShopPage from "@/components/Pages/ShopPage";

export const metadata: Metadata = {
  title: "Shop | YukNgaji Solo",
  description:
    "Temukan dan beli merchandise resmi YukNgaji Solo untuk menemani keseharianmu.",
};

export default function Shop() {
  return <ShopPage />;
}
