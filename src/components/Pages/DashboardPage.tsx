"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import DashboardLoader from "../common/Loader/DashboardLoader";
import Admin from "../Dashboard/Admin";
import Image from "next/image";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  if (user == null) {
    return <DashboardLoader></DashboardLoader>;
  }

  if (user.role == "admin") {
    return <Admin></Admin>;
  } else {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Image
          className="mb-2"
          src={"/images/logo/yn_logo.png"}
          alt="Logo"
          width={150}
          height={32}
        />
        <p className="text-lg text-black dark:text-white font-bold">
          Banyak kebaikan akan hadir
        </p>
      </div>
    );
  }
}
