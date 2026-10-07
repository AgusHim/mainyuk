"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAdminMissions, setAdminMission } from "@/redux/slices/missionSlice";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import FormMission from "../Form/FormMission";
import TableMissions from "../Tables/TableMissions";
import Dialog from "../common/Dialog/Dialog";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardMissionsPage() {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((state) => state.mission.adminMissions);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleOnDialog() {
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

  useEffect(() => {
    if (missions == null && !isLoading) {
      dispatch(getAdminMissions());
    }
  }, []);

  if (missions == null && isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      {error != null ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : (
        <div></div>
      )}
      <Breadcrumb pageName="Misi" />

      <div className="mb-3 flex w-full flex-col justify-end gap-3 sm:flex-row">
        <Link
          href="/dashboard/missions/claims"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-1 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Antrean Klaim
        </Link>
        <button
          onClick={() => {
            dispatch(setAdminMission(null));
            setDialogContent(<FormMission toggleDialog={toggleOnDialog} />);
            toggleOnDialog();
          }}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Tambah Misi
        </button>
      </div>

      <div className="flex flex-col gap-10">
        <TableMissions
          toggleDialog={toggleOnDialog}
          setDialogContent={() => {
            setDialogContent(<FormMission toggleDialog={toggleOnDialog} />);
          }}
        />
      </div>
      <Dialog toggleDialog={toggleOnDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </>
  );
}
