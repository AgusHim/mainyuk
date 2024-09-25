"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserTicket } from "@/redux/slices/ticketSlice";
import { UserTicket } from "@/types/user_ticket";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";

const CheckoutPaymentMethodCard = () => {
  const dispatch = useAppDispatch();
  const [ticket, setTicket] = useState<UserTicket | null>(null);

  const handleResultScan = (result: string) => {
    if (ticket == null) {
      dispatch(getUserTicket(result)).then((value) => {
        if (value != null) {
          openModal();
        }
      });
    }
  };

  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      setTicket(null);
    }
  };

  const handleSubmit = (event: any) => {
    closeModal();
    event.preventDefault();
    if (ticket != null) {
      // const presence = {
      //   ranger_id: ranger.id!,
      // };
      // dispatch(postRangerPresence(presence as RangerPresence)).then((value) => {
      //   if (value != null) {
      //     toast.success(`Berhasil absen ${ranger?.user?.name}`, {
      //       className: "toast",
      //     });
      //   }
      // });
    }
  };

  return (
    <div className="">
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            handleResultScan(result.getText());
          }
          if (!!error) {
            toast.error(error.message);
          }
        }}
        containerStyle={{ width: "100%", height: "500px" }}
        videoStyle={{ width: "100%", height: "100%" }}
        constraints={{ facingMode: "environment" }}
      />
      <dialog
        ref={modalRef}
        id="confirm"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-[#F3F3F3] dark:bg-boxdark shadow-bottom-right border-2 border-black">
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Event
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ticket?.event?.title ?? ""}
            </p>
          </div>
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Nama Tiket
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ticket?.ticket?.name ?? ""}
            </p>
          </div>
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Nama
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ticket?.user_name}
            </p>
          </div>
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Email
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ticket?.user_email}
            </p>
          </div>
          <div className="modal-action">
            <form method="dialog" onSubmit={handleSubmit} onReset={closeModal}>
              {/* if there is a button in form, it will close the modal */}
              <button
                type="submit"
                className="btn mr-4 bg-success hover:bg-success hover:bg-opacity-80 shadow-bottom-right text-white"
              >
                Absensi
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
  );
};

export default CheckoutPaymentMethodCard;
