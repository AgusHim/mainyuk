"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { getRangerDetail } from "@/redux/slices/rangerSlice";
import QRCode from "qrcode.react";
import Image from "next/image";

export default function DashboardRangerCardPage() {
  const dispatch = useAppDispatch();
  const ranger = useAppSelector((state) => state.ranger.ranger);
  const isLoading = useAppSelector((state) => state.ranger.loading);
  const error = useAppSelector((state) => state.ranger.error);

  useEffect(() => {
    if (ranger == null && !isLoading) {
      dispatch(getRangerDetail(null));
    }
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  return (
    <>
      <Breadcrumb pageName="Kartu Ranger" />
      <div className="ranger-card relative   w-full sm:w-100 h-full flex items-center content-center p-5 bg-meta-7 rounded-xl">
        {ranger == null ? (
          <div className="w-full h-45 flex items-center content-center justify-center text-black text-lg">
            Belum terdaftar ranger
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center">
            <QRCode
              value={ranger?.id ?? ""}
              className="w-30 h-30 p-2 bg-white rounded-xl my-4 mr-4 border-6 border-black"
            />
            <div className="flex flex-col">
              <div className="flex flex-row">
                <h1 className="min-w-[70px] text-black font-extrabold">Nama</h1>
                <h1 className="text-black font-extrabold">
                  : {ranger?.user?.name}
                </h1>
              </div>
              <div className="flex flex-row">
                <h1 className="min-w-[70px] text-black font-extrabold">
                  Divisi
                </h1>
                <h1 className="text-black font-extrabold">
                  : {ranger?.divisi?.name}
                </h1>
              </div>
              <div className="flex flex-row">
                <h1 className="min-w-[70px] text-black font-extrabold">
                  Regional
                </h1>
                <h1 className="text-black font-extrabold">
                  : {ranger?.divisi?.regional}
                </h1>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="w-12 h-12 sm:w-15 sm:h-15 mr-3 text-white flex items-center justify-center">
            <Image
              className="ml-4"
              width={100}
              height={100}
              src={"/images/logo/yn_logo.png"}
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}
