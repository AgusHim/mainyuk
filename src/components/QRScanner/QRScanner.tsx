"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postRangerPresence } from "@/redux/slices/rangerPresenceSlice";
import { getAgendaDetail } from "@/redux/slices/agendaSlice";
import { getRangerDetail, resetRanger } from "@/redux/slices/rangerSlice";
import { RangerPresence } from "@/types/rengerPresence";
import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { formatStrToDateTime } from "@/utils/convert";

const QRScanner = ({ params }: { params: { id: string } }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const dispatch = useAppDispatch();
  const ranger = useAppSelector((state) => state.ranger.ranger);
  const agenda = useAppSelector((state) => state.agenda.agenda);
  const isLoadingAgenda = useAppSelector((state) => state.agenda.loading);
  const isLoadingRanger = useAppSelector((state) => state.ranger.loading);

  const handleResultScan = (result: string) => {
    if (ranger == null && !isLoadingRanger) {
      dispatch(getRangerDetail(result)).then((value) => {
        if (value != null) {
          openModal();
        }
      });
    }
  };

  useEffect(() => {
    if (agenda == null && !isLoadingAgenda) {
      dispatch(getAgendaDetail(params.id));
    }
  }, []);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      dispatch(resetRanger(null));
    }
  };

  const handleSubmit = (event: any) => {
    closeModal();

    if (agenda == null) {
      toast.error("Agenda tidak ditemukan", {
        className: "toast bottom-center",
      });
      return;
    }
    if (ranger == null) {
      toast.error("Renger tidak ditemukan", {
        className: "toast bottom-center",
      });
      return;
    }
    if (ranger != null && agenda != null) {
      const presence = {
        ranger_id: ranger.id!,
        agenda_id: agenda?.id!,
        divisi_id: agenda?.divisi?.id!,
      };
      event.preventDefault();
      dispatch(postRangerPresence(presence as RangerPresence)).then((value) => {
        if (value != null) {
          toast.success(`Berhasil absen ${ranger?.user?.name}`, {
            className: "toast",
          });
        }
      });
    }
  };

  if (agenda == null) {
    return <div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white">
        Absensi Rangers
      </h1>
      <div className="flex flex-col items-start justify-start my-5">
        <h1 className="truncate line-clamp-2 text-center text-xl font-light text-black dark:text-white">
          {agenda?.name}
        </h1>
        <h1 className="truncate line-clamp-2 text-center text-xl font-extrabold text-meta-7">
          {agenda?.type.toLocaleUpperCase()}
        </h1>
        <h1 className="truncate line-clamp-2 text-center text-xl font-light text-black dark:text-white">
          {agenda?.location}
        </h1>
        <h1 className="text-center text-xl font-light text-black dark:text-white">
          {formatStrToDateTime(agenda!.start_at!, "dd MMM yyyy HH:mm")}
        </h1>
      </div>

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
        ref={modalRef}
        id="confirm"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-[#F3F3F3] dark:bg-boxdark shadow-bottom-right border-2 border-black">
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Nama
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ranger?.user?.name}
            </p>
          </div>
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Divisi
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ranger?.divisi?.name}
            </p>
          </div>
          <div className="flex flex-row py-2">
            <p className="min-w-[80px] text-lg text-black dark:text-white">
              Regional
            </p>
            <p className="font-bold text-lg text-black dark:text-white">
              {ranger?.divisi?.regional}
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

export default QRScanner;
