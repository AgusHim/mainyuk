import Admin from "@/components/Dashboard/Admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YukNgaji | Solo",
  description: "Dashboard admin YukNgaji regional Solo",
  // other metadata
};

export default function Home() {
    return (
      <>
        <Admin />
      </>
    );
}
