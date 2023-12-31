"use client";
//import { Metadata } from "next";
import QRCode from "qrcode.react";
import LiveQna from "@/components/LiveQna";
import DropdownFilter from "@/components/LiveQna/DropdownFilter";

// export const metadata: Metadata = {
//   title: "Live Event",
//   description: "Live event MainYuk regional Solo",
//   // other metadata
// };

export default function Event() {
  return (
    <>
      <div className="min-h-screen max-h-screen flex bg-black">
        <div className="w-1/4 flex flex-col items-center justify-center">
          <QRCode
            value="http://localhost:3000/events/slug"
            size={250}
            className="p-5 bg-white rounded-xl mb-10"
          />
          <h1 className="text-4xl text-white mx-5 text-center">
            Gabung ke <span className="font-extrabold">{`mainyuk.com`}</span>
          </h1>
          <p className="text-4xl text-white mx-5 text-center font-bold">
            #1587 183
          </p>
        </div>
        <div className="w-3/4 flex flex-col items-center justify-center ">
          <div className="ml-auto mr-5 mb-5">
          <DropdownFilter></DropdownFilter>
          </div>
          <div className="w-full mr-10 max-h-150 h-auto overflow-auto">
            <LiveQna />
          </div>
        </div>
      </div>
    </> 
  );
}
