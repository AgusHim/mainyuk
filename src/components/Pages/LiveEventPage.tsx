"use client";
import QRCode from "qrcode.react";
import LiveQna from "@/components/LiveQna";
import DropdownFilter from "@/components/LiveQna/DropdownFilter";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { getEventDetail } from "@/redux/slices/eventSlice";
import EventWebsocket from "../Websocket/EventWebsocket";
import DashboardLoader from "../common/Loader/DashboardLoader";
import dynamic from "next/dynamic";

// Masuk dan kelengkapan profil ditangani RequiredAuthLayout, sama seperti
// halaman anggota lain. Pemeriksaan peran tetap di sini karena layout itu tidak
// mengurus peran.
const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function LiveEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.event.loading) || useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    dispatch(getEventDetail(params.slug));
  }, []);

  const hostUrl = process.env.BASE_URL;
  const qrValue = `https://${hostUrl}/events/${params.slug}/qna`;

  // Peran bukan admin: tampilkan penjelasan, bukan lempar ke halaman masuk.
  // Pengguna ini sudah masuk — mengirimnya ke /signin hanya membingungkan.
  if (user != null && user.role !== "admin") {
    return (
      <RequiredAuthLayout redirectTo={`/live/${params.slug}`}>
        <div className="flex min-h-screen items-center justify-center p-5">
          <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
            <h1 className="text-lg font-semibold text-black dark:text-white">
              Tidak berizin
            </h1>
            <p className="mt-1 text-sm text-black dark:text-white">
              Layar live event hanya dapat dibuka oleh admin.
            </p>
          </div>
        </div>
      </RequiredAuthLayout>
    );
  }

  if (event == null && error == null) {
    return (
      <RequiredAuthLayout redirectTo={`/live/${params.slug}`}>
        <DashboardLoader />
      </RequiredAuthLayout>
    );
  }

  if (event == null) {
    return (
      <RequiredAuthLayout redirectTo={`/live/${params.slug}`}>
        <div className="flex min-h-150 items-center justify-center p-6">
          <div
            role="alert"
            className="flex h-auto w-full max-w-md items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
          >
            <span>{error}</span>
          </div>
        </div>
      </RequiredAuthLayout>
    );
  }

  return (
    <RequiredAuthLayout redirectTo={`/live/${params.slug}`}>
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
    </RequiredAuthLayout>
  );
}
