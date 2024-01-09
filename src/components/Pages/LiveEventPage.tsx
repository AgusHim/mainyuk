"use client";
import QRCode from "qrcode.react";
import LiveQna from "@/components/LiveQna";
import DropdownFilter from "@/components/LiveQna/DropdownFilter";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";

export default function LiveEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (!isLoading) {
      dispatch(getEventDetail(params.slug));
    }
  }, []);

  const hostUrl = window.location.origin;
  const qrValue = `${hostUrl}/events/${params.slug}`;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <div className="min-h-screen max-h-screen flex flex-col md:flex-row bg-black">
        <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-5">
          <QRCode
            value={qrValue}
            size={250}
            className="p-5 bg-white rounded-xl mb-10"
          />
          <h1 className="text-4xl text-white mx-5 text-center">
            Gabung ke{" "}
            <span className="font-extrabold">{window.location.hostname}</span>
          </h1>
          <p className="text-4xl text-white mx-5 text-center font-bold">
            {`#${event?.code}`}
          </p>
        </div>
        <div className="w-full md:w-3/4 flex flex-col items-center justify-center p-5 bg-black">
          <div className="ml-auto mr-5 mb-5">
            <DropdownFilter></DropdownFilter>
          </div>
          <div className="w-full min-h-150 max-h-150 h-auto overflow-auto">
            <LiveQna />
          </div>
        </div>
      </div>
    </>
  );
}
