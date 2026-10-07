"use client";
import Loader from "@/components/common/Loader/Loader";
import { FormEventDetailTickets } from "@/components/Form/FormEventDetailTickets";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";

export const EventLayout: React.FC<{ slug: string }> = ({ slug }) => {
  const dispatch = useAppDispatch();
  const eventData = useAppSelector((state) => state.event.event);
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
      <CommonHeader title={eventData?.title ?? ""} isShowBack />
      <section className="yn-container pb-24 pt-8 md:pb-32">
        {error ? (
          <div
            role="alert"
            className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
          >
            <span>{error}</span>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-3xl border border-[var(--yn-border)]">
            <img
              className="lazy max-w-full w-full entered loaded h-auto object-cover"
              src={eventData?.image_url ?? ""}
              alt={eventData?.title ?? "Poster event"}
            />
          </div>

          <div id="summary" className="flex flex-col">
            <div className="mb-4">
              <AllowedGender event={eventData} />
            </div>
            <h1 className="mb-4 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)] md:text-3xl">
              {eventData?.title ?? ""}
            </h1>
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[var(--yn-muted)]"
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.98438 9H9V14.0156H3.98438V9ZM15.9844 18V7.03125H2.01562V18H15.9844ZM15.9844 2.01562C16.5156 2.01562 16.9844 2.21875 17.3906 2.625C17.7969 3.03125 18 3.5 18 4.03125V18C18 18.5312 17.7969 19 17.3906 19.4062C16.9844 19.8125 16.5156 20.0156 15.9844 20.0156H2.01562C1.45312 20.0156 0.96875 19.8125 0.5625 19.4062C0.1875 19 0 18.5312 0 18V4.03125C0 3.5 0.1875 3.03125 0.5625 2.625C0.96875 2.21875 1.45312 2.01562 2.01562 2.01562H3V0H5.01562V2.01562H12.9844V0H15V2.01562H15.9844Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="text-sm text-[var(--yn-muted)]">
                  {formatStrToDateTime(
                    eventData!.start_at!,
                    "EEEE, dd MMMM yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[var(--yn-muted)]"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10.5156 5V10.25L15.0156 12.9219L14.2656 14.1875L9.01562 11V5H10.5156ZM4.32812 15.6875C5.92188 17.25 7.8125 18.0312 10 18.0312C12.1875 18.0312 14.0625 17.25 15.625 15.6875C17.2188 14.0938 18.0156 12.2031 18.0156 10.0156C18.0156 7.82812 17.2188 5.95312 15.625 4.39062C14.0625 2.79688 12.1875 2 10 2C7.8125 2 5.92188 2.79688 4.32812 4.39062C2.76562 5.95312 1.98438 7.82812 1.98438 10.0156C1.98438 12.2031 2.76562 14.0938 4.32812 15.6875ZM2.92188 2.98438C4.89062 1.01562 7.25 0.03125 10 0.03125C12.75 0.03125 15.0938 1.01562 17.0312 2.98438C19 4.92188 19.9844 7.26562 19.9844 10.0156C19.9844 12.7656 19 15.125 17.0312 17.0938C15.0938 19.0312 12.75 20 10 20C7.25 20 4.89062 19.0312 2.92188 17.0938C0.984375 15.125 0.015625 12.7656 0.015625 10.0156C0.015625 7.26562 0.984375 4.92188 2.92188 2.98438Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="text-sm text-[var(--yn-muted)]">
                  {formatStrToDateTime(eventData!.start_at!, "HH:mm")}
                  &nbsp;-&nbsp;
                  {formatStrToDateTime(eventData!.end_at!, "HH:mm")}
                  &nbsp;WIB
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--yn-border)]" />

            <div className="mb-6 mt-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--yn-foreground)]">
                Deskripsi
              </h3>
              <div className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--yn-muted)]">
                {eventData.desc}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--yn-foreground)]">
                Pengisi
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface-muted)] px-3 py-1 text-sm font-medium text-[var(--yn-foreground)]">
                  {eventData.speaker}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--yn-border)]" />

            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--yn-foreground)]">
                Tempat
              </h3>
              <div className="mb-2 flex flex-wrap gap-2">
                {eventData.location_types?.map((e, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[var(--yn-border)] bg-[var(--yn-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--yn-accent-dark)]"
                  >
                    {e}
                  </span>
                ))}
              </div>
              {eventData.location_desc?.map((e, index) => (
                <div
                  key={index}
                  className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[var(--yn-muted)]"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <FormEventDetailTickets slug={slug} />
        </div>
      </section>
    </>
  );
};

const AllowedGender: React.FC<{ event: Event }> = ({ event }) => {
  if (event.allowed_gender == "FEMALE") {
    return (
      <span className="rounded-full bg-[var(--yn-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--yn-accent-dark)]">
        Female Only
      </span>
    );
  }
  if (event.allowed_gender == "MALE") {
    return (
      <span className="rounded-full bg-[var(--yn-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--yn-accent-dark)]">
        Male Only
      </span>
    );
  }
  return <></>;
};
