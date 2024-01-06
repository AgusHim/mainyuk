import Admin from "@/components/Dashboard/Admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Event",
  description: "Live event YukNgaji regional Solo",
  // other metadata
};

export default function Event() {
  return (
    <>
      <h1 className="min-h-150 flex items-center justify-center text-3xl text-black dark:text-white font-bold">Event tidak di temukan</h1>     
    </>
  );
}
