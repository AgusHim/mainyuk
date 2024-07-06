"use client";
import QRCode from "qrcode.react";
import LiveQna from "@/components/LiveQna";
import DropdownFilter from "@/components/LiveQna/DropdownFilter";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import EventWebsocket from "../Websocket/EventWebsocket";
import { getSessionUser } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";

export default function LiveEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.event.loading) || useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.event.error);

  const router = useRouter();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!isLoading) {
      dispatch(getSessionUser())
      .unwrap()
      .then((value) => {
        if(value == null || value.role != 'admin'){
          router.replace(`/signin?redirectTo=${pathname}`);
        }
        dispatch(getEventDetail(params.slug));
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  const hostUrl = process.env.BASE_URL;
  const qrValue = `https://${hostUrl}/events/${params.slug}`;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  if(event == null){
    return <div></div>
  }

  return (
    <>
    <EventWebsocket></EventWebsocket>
      <div className="min-h-screen max-h-screen flex flex-col md:flex-row bg-boxdark">
        <div className="w-full md:w-2/4 flex flex-col items-center justify-center p-5">
          <QRCode
            value={qrValue}
            size={300}
            className="p-5 bg-white rounded-xl mb-10 shadow-bottom border-6 border-black"
          />
          <h1 className="text-2xl md:text-4xl text-white mx-5 text-center">
            Gabung ke <span className="font-extrabold">{hostUrl}</span>
          </h1>
          <p className="text-2xl md:text-4xl text-white mx-5 text-center font-bold">
            {`Kode: ${event?.code}`}
          </p>
        </div>
        <div className="w-full md:w-3/4 flex flex-col items-center justify-center p-5 bg-boxdark">
          <div className="ml-auto mr-5 mb-5">
            <DropdownFilter isLivePage={true} />
          </div>
          <div className="w-full min-h-150 max-h-150 h-auto overflow-auto">
            <LiveQna />
          </div>
        </div>
      </div>
    </>
  );
}
