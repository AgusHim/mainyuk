"use client";
import Loader from "@/components/common/Loader/Loader";
import { FormEventDetailTickets } from "@/components/Form/FormEventDetailTickets";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useEffect, useState } from "react";

export const EventLayout: React.FC<{ slug: string }> = ({ slug }) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const eventData = useAppSelector((state) => state.event.event);
  const order = useAppSelector((state) => state.order);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (eventData == null || eventData.slug != slug) {
      dispatch(getEventDetail(slug));
    }
  }, [eventData, slug, dispatch]);

  if (eventData == null || isLoading) {
    return <Loader></Loader>;
  }
  return (
    <>
      <div className="max-w-layout relative overflow-hidden">
        <div className="relative h-auto w-full">
          <div className="fixed top-0 z-10 border-b border-black bg-yellow-300 transition-all duration-300  max-w-layout w-full p-4">
            <div className="max-w-layout flex w-full items-center justify-between">
              <button
                className="font-bold"
                aria-hidden="true"
                onClick={() => {
                  route.back();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="text-neutral-900 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
              </button>
              <div className="absolute left-14">
                <div className="text-base font-bold text-neutral-800">
                  <p className="w-1/2 min-w-[200px] truncate">
                    {eventData?.title ?? ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 mx-10 h-auto border-2 border-black shadow-custom">
        <img
          className="lazy max-w-full w-full entered loaded h-auto"
          src={eventData?.image_url ?? ""}
        />
      </div>
      <section id="summary">
        <div className="m-10">
          <div className="mb-1">
            <AllowedGender event={eventData} />
          </div>
          <div className="py-4 text-xl font-semibold text-neutral-900">
            {eventData?.title ?? ""}
          </div>
          <div className="mb-2">
            <div>
              <div className="mb-2 flex items-center">
                <svg
                  className="mr-2 h-6 w-6 text-black"
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.98438 9H9V14.0156H3.98438V9ZM15.9844 18V7.03125H2.01562V18H15.9844ZM15.9844 2.01562C16.5156 2.01562 16.9844 2.21875 17.3906 2.625C17.7969 3.03125 18 3.5 18 4.03125V18C18 18.5312 17.7969 19 17.3906 19.4062C16.9844 19.8125 16.5156 20.0156 15.9844 20.0156H2.01562C1.45312 20.0156 0.96875 19.8125 0.5625 19.4062C0.1875 19 0 18.5312 0 18V4.03125C0 3.5 0.1875 3.03125 0.5625 2.625C0.96875 2.21875 1.45312 2.01562 2.01562 2.01562H3V0H5.01562V2.01562H12.9844V0H15V2.01562H15.9844Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="text-sm font-normal text-black">
                  {formatStrToDateTime(
                    eventData!.start_at!.replace("Z", ""),
                    "EEEE, dd MMMM yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-2 h-6 w-6 text-black"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5156 5V10.25L15.0156 12.9219L14.2656 14.1875L9.01562 11V5H10.5156ZM4.32812 15.6875C5.92188 17.25 7.8125 18.0312 10 18.0312C12.1875 18.0312 14.0625 17.25 15.625 15.6875C17.2188 14.0938 18.0156 12.2031 18.0156 10.0156C18.0156 7.82812 17.2188 5.95312 15.625 4.39062C14.0625 2.79688 12.1875 2 10 2C7.8125 2 5.92188 2.79688 4.32812 4.39062C2.76562 5.95312 1.98438 7.82812 1.98438 10.0156C1.98438 12.2031 2.76562 14.0938 4.32812 15.6875ZM2.92188 2.98438C4.89062 1.01562 7.25 0.03125 10 0.03125C12.75 0.03125 15.0938 1.01562 17.0312 2.98438C19 4.92188 19.9844 7.26562 19.9844 10.0156C19.9844 12.7656 19 15.125 17.0312 17.0938C15.0938 19.0312 12.75 20 10 20C7.25 20 4.89062 19.0312 2.92188 17.0938C0.984375 15.125 0.015625 12.7656 0.015625 10.0156C0.015625 7.26562 0.984375 4.92188 2.92188 2.98438Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="text-sm font-normal text-black">
                  {formatStrToDateTime(
                    eventData!.start_at!.replace("Z", ""),
                    "HH:mm"
                  )}
                </span>
                &nbsp;-&nbsp;
                <span className="text-sm font-normal text-black">
                  {formatStrToDateTime(
                    eventData!.end_at!.replace("Z", ""),
                    "HH:mm"
                  )}
                </span>
                &nbsp;{" "}
                <span className="text-sm font-normal text-black">WIB</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-4 border-b-[0.5px] border-black"></div>
          </div>
          <div className="mb-6 mt-4">
            <div className="mb-2 text-xl font-bold text-black">Deskripsi</div>
            <div className="whitespace-pre-line text-md font-normal text-black">
              {eventData.desc}
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-2 text-xl font-bold text-black">Pengisi</div>
            <div className="flex flex-wrap gap-2">
              <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-1 text-sm tag-primary border-black text-black border">
                {eventData.speaker}
              </button>
            </div>
          </div>
          <div>
            <div className="border-b-[0.5px] border-black"></div>
          </div>
          <div>
            <div className="mt-4 font-neutral-900 mb-2 text-xl text-black font-bold">
              Tempat
            </div>
            <div className="flex flex-row">
              {eventData.location_types!.map((e, index) => (
                <button
                  key={index}
                  className="mr-2 h-full whitespace-nowrap rounded-full font-medium px-2 py-1 text-sm tag-secondary bg-success text-black border border-black"
                >
                  {e}
                </button>
              ))}
            </div>
            {eventData.location_desc!.map((e, index) => (
              <div
                key={index}
                className="mt-2 whitespace-pre-line text-md text-black"
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>
      <FormEventDetailTickets slug={slug} />
    </>
  );
};

const AllowedGender: React.FC<{ event: Event }> = ({ event }) => {
  if (event.allowed_gender == "FEMALE") {
    return (
      <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-1 text-sm tag-secondary border-black text-black border bg-meta-7">
        Akhwat Only
      </button>
    );
  }
  if (event.allowed_gender == "MALE") {
    return (
      <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-1 text-sm tag-secondary border-black text-black border bg-primary">
        Akhwat Only
      </button>
    );
  }
  return <></>;
};
