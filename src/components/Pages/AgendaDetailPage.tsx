"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import CardDataStats from "../CardDataStats";
import { getAgendaDetail } from "@/redux/slices/agendaSlice";
import { getRangerPresence, getRangerPresenceByAgendaID } from "@/redux/slices/rangerPresenceSlice";
import TableRangerPresence from "../Tables/TableRangerPresence";
import { formatStrToDateTime } from "@/utils/convert";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

export default function AgendaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useAppDispatch();
  const agenda = useAppSelector((state) => state.agenda.agenda);
  const presence = useAppSelector((state) => state.rangerPresence.data);
  const isLoading = useAppSelector((state) => state.agenda.loading);
  const error = useAppSelector((state) => state.agenda.error);
  const isLoadingPresence = useAppSelector(
    (state) => state.rangerPresence.loading
  );

  useEffect(() => {
    if (!isLoading) {
      dispatch(getAgendaDetail(params.id));
    }
    if (!isLoadingPresence) {
      dispatch(getRangerPresenceByAgendaID(params.id));
    }
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  if (agenda == null) {
    return <div></div>;
  }
  return (
    <>
      <Breadcrumb pageName={agenda?.name} />
      <div className="flex flex-col sm:flex-row justify-between mb-5">
      <div className="flex flex-col items-start justify-start mb-5 sm:mb-0">
        <h1 className="truncate line-clamp-2 text-center text-xl font-extrabold text-meta-7">
          {agenda.type.toLocaleUpperCase()}
        </h1> 
        <h1 className="truncate line-clamp-2 text-center text-xl font-light text-black dark:text-white">
          {agenda.location}
        </h1>
        <h1 className="text-center text-xl font-light text-black dark:text-white">
          {formatStrToDateTime(agenda!.start_at!,"dd MMM yyyy HH:mm")}
        </h1>
      </div>
      <a
              className="w-full max-h-15 sm:w-60 inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border-2 border-black"
              style={{boxShadow: '5px 5px 0px 0px #000000'}}
              href={`/dashboard/agenda/${agenda!.id}/scan`}
            >
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.1"
                    d="M15 6C15 5.06812 15 4.60218 15.1522 4.23463C15.3552 3.74458 15.7446 3.35523 16.2346 3.15224C16.6022 3 17.0681 3 18 3C18.9319 3 19.3978 3 19.7654 3.15224C20.2554 3.35523 20.6448 3.74458 20.8478 4.23463C21 4.60218 21 5.06812 21 6C21 6.93188 21 7.39782 20.8478 7.76537C20.6448 8.25542 20.2554 8.64477 19.7654 8.84776C19.3978 9 18.9319 9 18 9C17.0681 9 16.6022 9 16.2346 8.84776C15.7446 8.64477 15.3552 8.25542 15.1522 7.76537C15 7.39782 15 6.93188 15 6Z"
                    fill="#ffffff"
                  />
                  <path
                    opacity="0.1"
                    d="M3 6C3 5.06812 3 4.60218 3.15224 4.23463C3.35523 3.74458 3.74458 3.35523 4.23463 3.15224C4.60218 3 5.06812 3 6 3C6.93188 3 7.39782 3 7.76537 3.15224C8.25542 3.35523 8.64477 3.74458 8.84776 4.23463C9 4.60218 9 5.06812 9 6C9 6.93188 9 7.39782 8.84776 7.76537C8.64477 8.25542 8.25542 8.64477 7.76537 8.84776C7.39782 9 6.93188 9 6 9C5.06812 9 4.60218 9 4.23463 8.84776C3.74458 8.64477 3.35523 8.25542 3.15224 7.76537C3 7.39782 3 6.93188 3 6Z"
                    fill="#ffffff"
                  />
                  <path
                    opacity="0.1"
                    d="M3 18C3 17.0681 3 16.6022 3.15224 16.2346C3.35523 15.7446 3.74458 15.3552 4.23463 15.1522C4.60218 15 5.06812 15 6 15C6.93188 15 7.39782 15 7.76537 15.1522C8.25542 15.3552 8.64477 15.7446 8.84776 16.2346C9 16.6022 9 17.0681 9 18C9 18.9319 9 19.3978 8.84776 19.7654C8.64477 20.2554 8.25542 20.6448 7.76537 20.8478C7.39782 21 6.93188 21 6 21C5.06812 21 4.60218 21 4.23463 20.8478C3.74458 20.6448 3.35523 20.2554 3.15224 19.7654C3 19.3978 3 18.9319 3 18Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M15 6C15 5.06812 15 4.60218 15.1522 4.23463C15.3552 3.74458 15.7446 3.35523 16.2346 3.15224C16.6022 3 17.0681 3 18 3C18.9319 3 19.3978 3 19.7654 3.15224C20.2554 3.35523 20.6448 3.74458 20.8478 4.23463C21 4.60218 21 5.06812 21 6C21 6.93188 21 7.39782 20.8478 7.76537C20.6448 8.25542 20.2554 8.64477 19.7654 8.84776C19.3978 9 18.9319 9 18 9C17.0681 9 16.6022 9 16.2346 8.84776C15.7446 8.64477 15.3552 8.25542 15.1522 7.76537C15 7.39782 15 6.93188 15 6Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6C3 5.06812 3 4.60218 3.15224 4.23463C3.35523 3.74458 3.74458 3.35523 4.23463 3.15224C4.60218 3 5.06812 3 6 3C6.93188 3 7.39782 3 7.76537 3.15224C8.25542 3.35523 8.64477 3.74458 8.84776 4.23463C9 4.60218 9 5.06812 9 6C9 6.93188 9 7.39782 8.84776 7.76537C8.64477 8.25542 8.25542 8.64477 7.76537 8.84776C7.39782 9 6.93188 9 6 9C5.06812 9 4.60218 9 4.23463 8.84776C3.74458 8.64477 3.35523 8.25542 3.15224 7.76537C3 7.39782 3 6.93188 3 6Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 18C3 17.0681 3 16.6022 3.15224 16.2346C3.35523 15.7446 3.74458 15.3552 4.23463 15.1522C4.60218 15 5.06812 15 6 15C6.93188 15 7.39782 15 7.76537 15.1522C8.25542 15.3552 8.64477 15.7446 8.84776 16.2346C9 16.6022 9 17.0681 9 18C9 18.9319 9 19.3978 8.84776 19.7654C8.64477 20.2554 8.25542 20.6448 7.76537 20.8478C7.39782 21 6.93188 21 6 21C5.06812 21 4.60218 21 4.23463 20.8478C3.74458 20.6448 3.35523 20.2554 3.15224 19.7654C3 19.3978 3 18.9319 3 18Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3V6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 18H15"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 15H18"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L3 12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12L13 12V12C12.4477 12 12 11.5523 12 11V11L12 9"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 21L20 21V21C20.5523 21 21 20.5523 21 20V20L21 18"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 21L12 16.2L12 16C12 15.4477 12.4477 15 13 15V15L15 15"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Scan Rangers
            </a>
      </div>
     
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats title="Total Hadir" total={`${presence?.length}`} rate="">
          <svg
            className="fill-black dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>
      <div className="flex flex-col gap-10">
        <TableRangerPresence />
      </div>
    </>
  );
}
