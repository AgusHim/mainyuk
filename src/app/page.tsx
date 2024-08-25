import IndexPage from "@/components/Pages/IndexPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YN Solo",
  description: "YukNgaji regional solo",
  // other metadata
};

export default function Index() {
  return <IndexPage/>
}
