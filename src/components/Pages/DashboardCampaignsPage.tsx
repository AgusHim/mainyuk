"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getAdminCampaigns,
  setAdminCampaign,
} from "@/redux/slices/campaignAdminSlice";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import FormCampaign from "../Form/FormCampaign";
import TableCampaigns from "../Tables/TableCampaigns";
import Dialog from "../common/Dialog/Dialog";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardCampaignsPage() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((state) => state.campaignAdmin.campaigns);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);
  const error = useAppSelector((state) => state.campaignAdmin.error);

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
    if (campaigns == null && !isLoading) {
      dispatch(getAdminCampaigns());
    }
  }, []);

  if (campaigns == null && isLoading) {
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
      <Breadcrumb pageName="Campaign" />

      <div className="mb-3 flex w-full flex-col justify-end gap-3 sm:flex-row">
        <Link
          href="/dashboard/donations"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-1 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Antrean Donasi
        </Link>
        <button
          onClick={() => {
            dispatch(setAdminCampaign(null));
            setDialogContent(<FormCampaign toggleDialog={toggleOnDialog} />);
            toggleOnDialog();
          }}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Tambah Campaign
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {campaigns && campaigns.length === 0 ? (
          <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
            <p className="text-sm text-black dark:text-white">Belum ada campaign.</p>
          </div>
        ) : (
          <TableCampaigns
            toggleDialog={toggleOnDialog}
            setDialogContent={() => {
              setDialogContent(<FormCampaign toggleDialog={toggleOnDialog} />);
            }}
          />
        )}
      </div>
      <Dialog toggleDialog={toggleOnDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </>
  );
}
