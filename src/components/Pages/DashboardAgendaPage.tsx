"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useRef, useState } from "react";
import CardDataStats from "../CardDataStats";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableAgenda from "../Tables/TableAgenda";
import FormAgenda from "../Form/FormAgenda";
import { getAgenda, setAgenda } from "@/redux/slices/agendaSlice";
import Dialog from "../common/Dialog/Dialog";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardAgendaPage() {
  const dispatch = useAppDispatch();
  const agenda = useAppSelector((state) => state.agenda.data);
  const isLoading = useAppSelector((state) => state.agenda.loading);
  const error = useAppSelector((state) => state.agenda.error);

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleOnDialog() {
    if (!dialogRef.current) {
      return;
    }
    if(dialogRef.current.hasAttribute("open")){
      dialogRef.current.close();
      setDialogContent(null);
    }else{
      dialogRef.current.showModal();
    }
  }

  useEffect(() => {
    if (agenda == null && !isLoading) {
      dispatch(getAgenda());
    }
  }, []);
  
  if (agenda == null && isLoading) {
    return <DashboardLoader/>;
  }
  return (
    <>
      {error != null ? (
        <div
          role="alert"
          className="alert alert-error border-2 border-black shadow-bottom mb-5 h-10 flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        <div></div>
      )}
      <Breadcrumb pageName="Agenda" />
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total Agenda"
          total={agenda == null ? "0" : agenda!.length.toString()}
          rate=""
        >
          {iconAgenda("fill-success")}
        </CardDataStats>
      </div>
      <div className="mb-3 w-full flex justify-end">
        <button
          onClick={() => {
            dispatch(setAgenda(null));
            setDialogContent(<FormAgenda toggleDialog={toggleOnDialog} />);
            toggleOnDialog();
          }}
          className="w-full sm:w-50 inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 border-2 border-black"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          <span>{iconAgenda("fill-white")}</span>
          Tambah Agenda
        </button>
      </div>
      <div className="flex flex-col gap-10">
        <TableAgenda
          toggleDialog={toggleOnDialog}
          setDialogContent={() => {
            setDialogContent(<FormAgenda toggleDialog={toggleOnDialog} />);
          }}
        />
      </div>
      <Dialog toggleDialog={toggleOnDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </>
  );
}

function iconAgenda(className: string) {
  return (
    <>
      <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="chapter-add">
          <g>
            <path d="M5,24H3v-3H0v-2h3v-3h2v3h3v2H5V24z M19,21h-9v-2h7V6H5v8H3V4h4V0h16v17h-4V21z M19,15h2V2H9v2h10V15z" />
          </g>
        </g>
      </svg>
    </>
  );
}
