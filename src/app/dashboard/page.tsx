import Admin from "@/components/Dashboard/Admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MainYuk | Solo",
  description: "Dashboard admin MainYuk regional Solo",
  // other metadata
};

export default function Home() {
  return (
    <>
      <Admin />
    </>
  );
}
