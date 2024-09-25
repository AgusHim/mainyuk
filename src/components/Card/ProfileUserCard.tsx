"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Link from "next/link";

const ProfileUserCard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
      <Link
        href="/profile/update"
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center text-center justify-center w-12 h-12 md:h-14 md:w-14 rounded-full ${
              user?.gender == "male" ? "bg-primary" : "bg-meta-7"
            }`}
            style={{ boxShadow: "0px 5px 0px 0px #000000" }}
          >
            <h1 className="text-white text-lg md:text-xl">
              {user?.name?.substring(0, 2)}
            </h1>
          </div>
          <div className="grid">
            <h1 className="font-semibold text-lg text-black">
              {user?.name ?? ""}
            </h1>
            <p className="text-sm text-black">{user?.email ?? ""}</p>
          </div>
        </div>
        <div className="text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="w-8 fill-black"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default ProfileUserCard;
