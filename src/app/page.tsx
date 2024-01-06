import IndexPage from "@/components/Pages/IndexPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
  description: "Event YukNgaji regional Solo",
  // other metadata
};

export default function Index() {
  return <IndexPage/>
}
