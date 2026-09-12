"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventsHome } from "@/redux/slices/eventSlice";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect } from "react";
import { Event } from "@/types/event";
import Reveal from "./Reveal";

const MONTHS_ID = [
  "JAN", "FEB", "MAR", "APR", "MEI", "JUN",
  "JUL", "AGU", "SEP", "OKT", "NOV", "DES",
];

function formatEventDate(value?: string) {
  if (!value) return null;
  try {
    const date = new Date(value.replace("Z", ""));
    return {
      day: format(date, "dd", { locale: id }),
      month: MONTHS_ID[date.getMonth()],
      year: format(date, "yyyy", { locale: id }),
    };
  } catch {
    return null;
  }
}

function EventCard({ event }: { event: Event }) {
  const date = formatEventDate(event.start_at);
  return (
    <Link
      href={`/events/${event.slug ?? ""}`}
      className="group block overflow-hidden rounded-[24px] border border-[var(--yn-border)] bg-[var(--yn-surface)] transition-all duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[24px]">
        <Image
          src={event.image_url ?? ""}
          alt={event.title ?? "Event YukNgaji Solo"}
          fill
          sizes="(min-width: 1024px) 380px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--yn-accent)] md:text-sm">
          {date ? `${date.day} ${date.month} ${date.year}` : "Segera"}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--yn-foreground)] md:text-2xl">
          {event.title}
        </h3>
        {event.location_desc?.[0] && (
          <p className="mt-2 text-sm text-[var(--yn-muted)]">{event.location_desc[0]}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--yn-foreground)]">
          Lihat Detail <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--yn-border)] bg-[var(--yn-surface)]">
      <div className="aspect-[16/10] animate-pulse bg-[var(--yn-surface-muted)]" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      </div>
    </div>
  );
}

export default function EventsSection() {
  const dispatch = useAppDispatch();
  const eventData = useAppSelector((state) => state.event.data);

  useEffect(() => {
    if (eventData == null) {
      dispatch(getEventsHome());
    }
  }, [dispatch, eventData]);

  const events = (eventData ?? [])
    .filter((event) => event.isPublished)
    .slice(0, 6);

  return (
    <section id="event" className="yn-section border-t border-[var(--yn-border)]">
      <div className="yn-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent)] md:text-sm">
                Event Terbaru
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-6 max-w-[16ch] font-semibold text-[var(--yn-foreground)]"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                }}
              >
                Temukan kegiatan berikutnya.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <a
              href="/events"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--yn-border)] px-6 py-3 text-sm font-semibold text-[var(--yn-foreground)] transition-all duration-200 hover:-translate-y-px hover:bg-[var(--yn-surface)]"
            >
              Lihat Semua Event &rarr;
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventData == null || events.length === 0
            ? Array.from({ length: 3 }).map((_, index) => <EventSkeleton key={index} />)
            : events.map((event, index) => (
                <Reveal key={event.slug ?? index} delay={index * 100}>
                  <EventCard event={event} />
                </Reveal>
              ))}
        </div>

        {eventData != null && events.length === 0 && (
          <p className="yn-text-content mt-8 text-base text-[var(--yn-muted)]">
            Belum ada event yang dipublikasikan. Pantau terus halaman ini, atau
            <a
              href="https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, min"
              className="font-medium text-[var(--yn-accent)] underline underline-offset-4"
            >
              kepoin admin
            </a>{" "}
            untuk info kegiatan berikutnya.
          </p>
        )}
      </div>
    </section>
  );
}
