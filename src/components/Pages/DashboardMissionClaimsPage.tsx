"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getClaimsForReview } from "@/redux/slices/missionSlice";
import Link from "next/link";
import { useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableMissionClaims from "../Tables/TableMissionClaims";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardMissionClaimsPage() {
  const dispatch = useAppDispatch();
  const claims = useAppSelector((state) => state.mission.claimsForReview);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  useEffect(() => {
    if (claims.length === 0 && !isLoading) {
      dispatch(getClaimsForReview({ status: "pending", page: 1 }));
    }
  }, []);

  if (claims.length === 0 && isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <Breadcrumb pageName="Antrean Klaim Misi" />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mb-3 flex w-full flex-col justify-end gap-3 sm:flex-row">
        <Link
          href="/dashboard/missions"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-1 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Kelola Misi
        </Link>
      </div>

      <div className="flex flex-col gap-10">
        <TableMissionClaims />
      </div>
    </>
  );
}
