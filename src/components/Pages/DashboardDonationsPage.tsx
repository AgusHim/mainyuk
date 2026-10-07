"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAdminDonations } from "@/redux/slices/campaignAdminSlice";
import Link from "next/link";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableDonations from "../Tables/TableDonations";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardDonationsPage() {
  const dispatch = useAppDispatch();
  const donations = useAppSelector((state) => state.campaignAdmin.donations);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);
  const error = useAppSelector((state) => state.campaignAdmin.error);

  useEffect(() => {
    if (donations.length === 0 && !isLoading) {
      dispatch(getAdminDonations({ status: "pending", page: 1 }));
    }
  }, []);

  if (donations.length === 0 && isLoading) {
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
      <Breadcrumb pageName="Donasi" />

      <div className="mb-3 flex w-full flex-col justify-end gap-3 sm:flex-row">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-1 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Kelola Campaign
        </Link>
      </div>

      <div className="flex flex-col gap-10">
        <TableDonations />
      </div>
    </>
  );
}
