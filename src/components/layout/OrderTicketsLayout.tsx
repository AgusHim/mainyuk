"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/components/layout/MainLayout";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/Common/Loader";
import { getOrderByPublicID } from "@/redux/slices/orderSlice";
import { UserTicket } from "@/types/user_ticket";
import { Order } from "@/types/order";
import QRCode from "qrcode.react";
import DialogTicketQR from "@/components/Common/Dialog/DialogTicketQR";

export default function OrderTicketsLayout({
  params,
}: {
  params: { public_id: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.order);
  const isLoading = useAppSelector((state) => state.order.loading);
  const error = useAppSelector((state) => state.order.error);

  useEffect(() => {
    if (order == null) {
      dispatch(getOrderByPublicID(params.public_id))
        .unwrap()
        .then((res) => {
          const order = res as Order;
          if (order.status != "paid") {
            router.replace(`/orders/${order.public_id}`);
          }
        });
    }
  }, []);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setDialogContent(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  if (order == null || isLoading) {
    return (
      <MainLayout>
        <CommonHeader
          title="Daftar Tiket Event"
          isShowBack={true}
          isShowTrailing={false}
        />
        <Loader></Loader>
      </MainLayout>
    );
  }
  return (
    <>
      <MainLayout>
        <CommonHeader
          title="Daftar Tiket Event"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
          {order.status != "paid" ? (
            <div className="p-10 px-5 text-black font-bold text-lg">
              Selesaikan Transaksi
            </div>
          ) : (
            <div className="grid gap-4">
              {order?.user_tickets?.map((e) => (
                <Ticket
                  ticket={e}
                  toggleDialog={toggleDialog}
                  setDialogContent={setDialogContent}
                />
              ))}
            </div>
          )}

          <DialogTicketQR toggleDialog={toggleDialog} ref={dialogRef}>
            {dialogContent}
          </DialogTicketQR>
        </div>
      </MainLayout>
    </>
  );
}

interface TicketProps {
  ticket: UserTicket;
  toggleDialog: () => void;
  setDialogContent: (node: React.ReactNode) => void;
}

const Ticket: React.FC<TicketProps> = ({
  ticket,
  toggleDialog,
  setDialogContent,
}) => {
  return (
    <div
      onClick={() => {
        setDialogContent(
          <div className="flex flex-col items-center">
            <QRCode
              value={ticket?.public_id ?? ""}
              size={300}
              bgColor="#FACA15"
              className="p-4 border-2 border-black"
            />
            <div className="flex w-full justify-between py-5 px-6">
              <p className="text-black font-bold text-lg">Kode Tiket</p>
              <p className="text-black text-lg">{ticket?.public_id}</p>
            </div>
            <div className="px-6 w-full">
              <div className="flex px-4 py-2 bg-pink-500 text-black text-lg w-full rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="ml-2">Tunjukan saat registrasi</span>
              </div>
            </div>
          </div>
        );
        toggleDialog();
      }}
      className="relative bg-yellow-300 rounded-lg shadow-custom p-6 w-full mx-auto border-2 border-black"
    >
      {/* Notch */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black w-12 h-4 rounded-b-lg border border-black z-10"></div>
      <div className="bg-primary text-white rounded-lg -m-6 mb-4 p-4">
        <div className="flex items-center gap-2">
          <div>
            <FontAwesomeIcon
              icon={faUserAstronaut}
              fill="black"
              width={40}
              height={40}
              style={{ fontSize: "40px", color: "white" }}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="font-sans font-semibold text-sm text-white">
              {ticket.user_name}
            </h1>
            <p className="truncate break-words font-sans text-sm text-white">
              {ticket.user_email}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <p className="font-sans text-sm text-black">Nama Event</p>
          <h1 className="font-sans font-semibold text-sm text-black">
            (MALANG) Bagaimana Anak-Anak Gaza Tumbuh Menjadi Pejuang
          </h1>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="font-sans text-sm text-black">Nama Tiket</p>
            <h1 className="font-sans font-semibold text-sm text-black">
              Infaq Terbaik
            </h1>
          </div>
          <QRCode
            value={ticket?.public_id ?? ""}
            size={70}
            bgColor="#FACA15"
            className=""
          />
        </div>
      </div>
    </div>
  );
};
