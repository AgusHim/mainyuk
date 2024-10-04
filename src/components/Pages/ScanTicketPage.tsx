"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";
import { getUserTicket, postVerifyUserTicket } from "@/redux/slices/ticketSlice";
import { UserTicket } from "@/types/user_ticket";
import { useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";

export default function ScanTicketPage() {
  const dispatch = useAppDispatch();
  const [user_ticket ,setUserTicket]= useState<UserTicket | null>(null);
  const isLoading = useAppSelector((state) => state.ticket.loading);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setUserTicket(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  const handleResultScan = (result: string) => {
    if (user_ticket == null && !isLoading) {
      dispatch(getUserTicket(result)).then((value) => {
        if (value != null) {
          toggleDialog();
        }
      });
    }
  };

  const handleSubmit = (e:any) => {
      e.preventDefault();
      dispatch(postVerifyUserTicket(user_ticket?.public_id??'')).then((value) => {
        if (value != null) {
          toggleDialog();
        }
      });
  };

  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader
            title="Scan QR-Code"
            isShowBack={true}
            isShowTrailing={false}
          />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  handleResultScan(result.getText());
                }
                if (!!error) {
                  toast.error(error.message, {
                    className: "toast",
                  });
                }
              }}
              containerStyle={{ width: "100%", height: "500px" }}
              videoStyle={{ width: "100%", height: "100%" }}
              constraints={{ facingMode: "environment" }}
            />
            <dialog
              ref={dialogRef}
              id="confirm"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box bg-[#F3F3F3] dark:bg-boxdark shadow-bottom-right border-2 border-black">
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Nama 
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.user?.name}
                  </p>
                </div>
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Event
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.event?.title}
                  </p>
                </div>
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Jenis Tiket
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.ticket?.name}
                  </p>
                </div>
                <div className="modal-action">
                  <form
                    method="dialog"
                    onSubmit={handleSubmit}
                    onReset={toggleDialog}
                  >
                    {/* if there is a button in form, it will close the modal */}
                    <button
                      type="submit"
                      className="btn mr-4 bg-success hover:bg-success hover:bg-opacity-80 shadow-bottom-right text-white"
                    >
                      Verifikasi
                    </button>
                    <button
                      type="reset"
                      className="btn bg-danger hover:bg-opacity-80 hover:bg-danger shadow-bottom-right text-white"
                    >
                      Tutup
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
