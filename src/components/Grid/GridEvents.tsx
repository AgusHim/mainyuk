"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventsHome } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";
import Link from "next/link";
import { useEffect } from "react";
import Loader from "../common/Loader/Loader";

export default function GridEvents() {
  const dispatch = useAppDispatch();
  const eventsData = useAppSelector((state) => state.event.data);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (eventsData == null) {
      dispatch(getEventsHome());
    }
  }, []);

  // Gagal memuat: jelaskan sebabnya. Tanpa ini pemuat berputar selamanya.
  if (error != null && eventsData == null) {
    return (
      <section className="yn-container pb-24 pt-8 md:pb-32">
        <div
          role="alert"
          className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
        >
          <span>{error}</span>
        </div>
      </section>
    );
  }

  if (eventsData == null || isLoading) {
    return <Loader></Loader>;
  }
  const events = eventsData?.filter((event) => event.isPublished);
  return (
    <section className="yn-container pb-24 pt-8 md:pb-32">
      {error ? (
        <div
          role="alert"
          className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
        >
          <span>{error}</span>
        </div>
      ) : null}
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group block overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] transition-all duration-200 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  src={event.image_url}
                  alt={event.title}
                  loading="lazy"
                />
                <div className="absolute left-4 top-4">
                  <AllowedGender event={event} />
                </div>
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--yn-muted)]">
                  <span>
                    {formatStrToDateTime(
                      event.start_at!.replace("Z", ""),
                      "EEEE, dd MMMM yyyy"
                    )}
                  </span>
                </div>
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-[var(--yn-foreground)] line-clamp-2">
                  {event.title}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <img
                    className="h-6 w-6 rounded-full object-cover"
                    src="/images/logo/yn_logo.png"
                    alt="YukNgaji Solo"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm font-medium text-[var(--yn-muted)]">
                    YukNgaji Solo
                  </span>
                </div>
                <span className="mt-2 text-sm font-semibold text-[var(--yn-accent)]">
                  Lihat Detail →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-10 text-center">
          <p className="text-[var(--yn-muted)]">
            Belum ada event yang dipublikasikan.
          </p>
        </div>
      )}
    </section>
  );
}

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
