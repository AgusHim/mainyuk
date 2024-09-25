"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logOutUser } from "@/redux/slices/authSlice";
import {
  faQrcode,
  faReceipt,
  faTicket,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { useRouter } from "next/navigation";
import React from "react";

const ProfileMenuCard = () => {
 const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const menu = [
    {
      name: "Riwayat Transaksi",
      icon: (
        <FontAwesomeIcon
          icon={faReceipt}
          width={25}
          style={{ fontSize: "20px", color: "black" }}
        />
      ),
      href: "/orders/status/paid",
      role: "all",
    },
    {
      name: "Daftar Event",
      icon: (
        <FontAwesomeIcon
          icon={faTicket}
          width={25}
          style={{ fontSize: "20px", color: "black" }}
        />
      ),
      href: "/events/history",
      role: "all",
    },
    {
      name: "Kartu Ranger",
      icon: (
        <FontAwesomeIcon
          icon={faUserAstronaut}
          width={25}
          style={{ fontSize: "20px", color: "black" }}
        />
      ),
      href: "/dashboard/rangers/card",
      role: "ranger,admin,pj",
    },
    {
      name: "Scan Ticket",
      icon: (
        <FontAwesomeIcon
          icon={faQrcode}
          width={25}
          style={{ fontSize: "20px", color: "black" }}
        />
      ),
      href: "/events/history",
      role: "ranger,admin,pj",
    }
  ];

  const filtermenu =() =>{
    return menu.filter(m => m.role == "all" || m.role.includes(user?.role??'user'));
  }

  const handleLogout = () => {
    router.replace("/signin");
    dispatch(logOutUser(null));
  };

  return (
    <div>
      <div className="mt-2 mb-2">
        <h1 className="font-semibold text-xl text-black">Kontribusi Saya</h1>
      </div>
      <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
        {filtermenu().map((e, index) => (
          <>
            <Link href={e.href}>
              <button className="flex w-full justify-between gap-4 px-2 py-4">
                <div className="flex items-center gap-2">
                  {e.icon}
                  <p className="text-lg text-black">{e.name}</p>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-5 fill-black"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </button>
            </Link>
            {index + 1 != filtermenu().length ? (
              <div className="border-b border-b-black"></div>
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
      <button
        type="button"
        className="mt-10 bg-danger border-2 focus:outline-none transition ease-in-out duration-300 rounded-lg px-8 py-3 w-full hover:opacity-80 active:opacity-70 border-black text-white font-bold shadow-custom"
        onClick={handleLogout}
      >
        <div className="flex items-center justify-center gap-x-2 hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1">
          <span>Sign out</span>
        </div>
      </button>
    </div>
  );
};

export default ProfileMenuCard;
