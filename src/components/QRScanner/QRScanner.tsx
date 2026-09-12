"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postRangerPresence } from "@/redux/slices/rangerPresenceSlice";
import { getAgendaDetail } from "@/redux/slices/agendaSlice";
import { getRangerDetail, resetRanger } from "@/redux/slices/rangerSlice";
import { RangerPresence } from "@/types/rengerPresence";
import React, { useEffect, useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { formatStrToDateTime } from "@/utils/convert";
import Dialog from "../common/Dialog/Dialog";
import { Button } from "@/components/ui/button";

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

  const handleSubmit = () => {
    closeModal();

    if (agenda == null) {
      toast.error("Agenda tidak ditemukan");
      return;
    }
    if (ranger == null) {
      toast.error("Renger tidak ditemukan");
      return;
    }
    if (ranger != null && agenda != null) {
      const presence = {
        ranger_id: ranger.id!,
        agenda_id: agenda?.id!,
        divisi_id: agenda?.divisi?.id!,
      };
      dispatch(postRangerPresence(presence as RangerPresence)).then((value) => {
        if (value != null) {
          toast.success(`Berhasil absen ${ranger?.user?.name}`);
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
      <Scanner
        scanDelay={1500}
        allowMultiple={true}
        onScan={(result) => {
          if (result.length > 0) {
            handleResultScan(result[0].rawValue);
          }
        }}
        onError={(error) => {
          console.log(error);
        }}
        constraints={{ facingMode: "environment" }}
      />
      <Dialog
        ref={modalRef}
        toggleDialog={closeModal}
        title="Konfirmasi Absensi"
      >
        <div className="flex flex-row py-2">
          <p className="min-w-[80px] text-lg text-black dark:text-white">
            Nama
          </p>
          <p className="text-lg font-bold text-black dark:text-white">
            {ranger?.user?.name}
          </p>
        </div>
        <div className="flex flex-row py-2">
          <p className="min-w-[80px] text-lg text-black dark:text-white">
            Divisi
          </p>
          <p className="text-lg font-bold text-black dark:text-white">
            {ranger?.divisi?.name}
          </p>
        </div>
        <div className="flex flex-row py-2">
          <p className="min-w-[80px] text-lg text-black dark:text-white">
            Regional
          </p>
          <p className="text-lg font-bold text-black dark:text-white">
            {ranger?.divisi?.regional}
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleSubmit}
            className="h-10 border-2 border-black bg-success text-white shadow-bottom-right hover:bg-success/80"
          >
            Absensi
          </Button>
          <Button
            type="button"
            onClick={closeModal}
            className="h-10 border-2 border-black bg-danger text-white shadow-bottom-right hover:bg-danger/80"
          >
            Tutup
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default QRScanner;
