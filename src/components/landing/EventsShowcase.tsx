"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventsHome } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import Reveal from "./Reveal";

/* Placeholder cards shown while the events request is in flight. */
const PLACEHOLDER: Event[] = Array.from({ length: 5 }).map((_, index) => ({
  id: `placeholder-${index}`,
}));

/* Status bar drawn over the phone screen (mirrors the mockup's 9:41 chrome). */
function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[10%] pt-[9px] sm:pt-[11px]">
      <span className="text-[9px] font-semibold tracking-tight text-[#07111f] sm:text-[12px]">
        9:41
      </span>
      <span className="flex items-center gap-1 text-[#07111f]">
        <svg
          viewBox="0 0 18 12"
          fill="currentColor"
          aria-hidden="true"
          className="h-[8px] w-auto sm:h-[10px]"
        >
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="9" y="3" width="3" height="9" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg
          viewBox="0 0 16 12"
          fill="currentColor"
          aria-hidden="true"
          className="h-[8px] w-auto sm:h-[10px]"
        >
          <path d="M8 11.4 5.4 8.6a3.6 3.6 0 0 1 5.2 0L8 11.4Z" />
          <path
            d="M3 6a7.2 7.2 0 0 1 10 0l-1.4 1.5a5.2 5.2 0 0 0-7.2 0L3 6Z"
            opacity=".9"
          />
          <path
            d="M.4 3.2a10.8 10.8 0 0 1 15.2 0l-1.4 1.5a8.8 8.8 0 0 0-12.4 0L.4 3.2Z"
            opacity=".8"
          />
        </svg>
        <span className="relative inline-block h-[8px] w-[15px] rounded-[2px] border border-[#07111f]/60 sm:h-[10px] sm:w-[19px]">
          <span className="absolute inset-[1px] right-[5px] rounded-[1px] bg-[#07111f] sm:right-[7px]" />
        </span>
      </span>
    </div>
  );
}

function PhoneFrame({ event }: { event?: Event }) {
  return (
    <div className="relative aspect-[1/2] w-full rounded-[30px] border-[4px] border-[#07111f] bg-white p-[2px] shadow-[20px_38px_64px_-32px_rgba(7,17,31,0.45)] sm:rounded-[38px] sm:border-[5px] sm:p-[3px] lg:rounded-[44px] lg:border-[6px] lg:p-[4px]">
      <span aria-hidden="true" className="absolute -left-[6px] top-[14%] h-[5%] w-[5px] rounded-l bg-[#07111f] sm:-left-[7px] sm:w-[6px]" />
      <span aria-hidden="true" className="absolute -left-[6px] top-[23%] h-[9%] w-[5px] rounded-l bg-[#07111f] sm:-left-[7px] sm:w-[6px]" />
      <span aria-hidden="true" className="absolute -right-[6px] top-[24%] h-[10%] w-[5px] rounded-r bg-[#07111f] sm:-right-[7px] sm:w-[6px]" />
      <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white sm:rounded-[30px] lg:rounded-[34px]">
        {/* The screen poster has the same top edge and ratio as the side posters. */}
        <div className="absolute left-[2%] right-[2%] top-[16%] aspect-[3/4] overflow-hidden rounded-[12px]">
          {event?.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title ?? "Event YukNgaji Solo"}
              fill
              sizes="(min-width: 1024px) 284px, (min-width: 640px) 204px, 160px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 animate-pulse rounded-[8px] bg-[var(--yn-surface-muted)]" />
          )}
        </div>
        <StatusBar />
        <div aria-hidden="true" className="absolute left-1/2 top-[4px] z-20 h-[16px] w-[54px] -translate-x-1/2 rounded-full bg-[#07111f] sm:top-[5px] sm:h-[22px] sm:w-[72px] lg:h-[28px] lg:w-[94px]" />
      </div>
    </div>
  );
}

function PosterCard({
  event,
  placeholder = false,
}: {
  event: Event;
  placeholder?: boolean;
}) {
  const className =
    "group relative block w-[160px] shrink-0 snap-center overflow-hidden rounded-[12px] bg-[var(--yn-surface-muted)] shadow-[0_24px_54px_-32px_rgba(23,23,23,0.48)] sm:w-[204px] lg:w-[284px]";

  const content = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title ?? "Event YukNgaji Solo"}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 284px, (min-width: 640px) 204px, 160px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-[var(--yn-surface-muted)]" />
        )}
      </div>
      {!placeholder && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold text-[var(--yn-foreground)] opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
          View Detail
        </span>
      )}
    </>
  );

  if (placeholder) {
    return (
      <div data-poster className={className} aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/events/${event.slug ?? ""}`} data-poster className={className}>
      {content}
    </Link>
  );
}

export default function EventsShowcase() {
  const dispatch = useAppDispatch();
  const eventData = useAppSelector((state) => state.event.data);
  const error = useAppSelector((state) => state.event.error);
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loading = eventData == null && !error;

  useEffect(() => {
    if (eventData == null && !error) {
      dispatch(getEventsHome());
    }
  }, [dispatch, eventData, error]);

  // Published events, nearest upcoming first (mockup heading: "Terdekat").
  const events = useMemo(() => {
    const now = Date.now();
    const startTime = (event: Event) => {
      const value = event.start_at ? new Date(event.start_at.replace("Z", "")).getTime() : NaN;
      return isNaN(value) ? Infinity : value;
    };
    return (eventData ?? [])
      .filter((event) => event.isPublished)
      .sort((a, b) => {
        const ta = startTime(a);
        const tb = startTime(b);
        const aPast = ta < now;
        const bPast = tb < now;
        if (aPast !== bPast) return aPast ? 1 : -1;
        return ta - tb;
      });
  }, [eventData]);

  const count = events.length;

  // Render the list three times so posters sit on both sides of the fixed phone.
  // The carousel opens on the middle copy, so the nearest event is centred first.
  // While loading, the same layout is filled with placeholder cards.
  const source = loading ? PLACEHOLDER : events;
  const repeat = source.length > 1 ? 3 : 1;
  const rendered = useMemo(() => {
    const out: Event[] = [];
    for (let copy = 0; copy < repeat; copy += 1) out.push(...source);
    return out;
  }, [source, repeat]);

  // Highlight whichever poster sits closest to the viewport centre.
  const recompute = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const posters = Array.from(el.querySelectorAll<HTMLElement>("[data-poster]"));
    if (!posters.length) return;
    const box = el.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    let best = 0;
    let bestDistance = Infinity;
    posters.forEach((poster, index) => {
      const rect = poster.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centre);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }, []);

  // Park the strip on the middle copy and keep the highlight in sync.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const posters = el.querySelectorAll<HTMLElement>("[data-poster]");
      const copyLength = posters.length / repeat;
      if (repeat > 1 && posters.length >= 2 * copyLength) {
        const first = posters[0].getBoundingClientRect().left;
        const middle = posters[copyLength].getBoundingClientRect().left;
        el.scrollLeft = middle - first;
      }
    }
    recompute();
  }, [repeat, rendered.length, recompute]);

  useEffect(() => {
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  const activeEvent = count > 0 ? events[active % count] : undefined;

  return (
    <section
      id="gabung-event"
      className="relative overflow-hidden bg-[#f1f1f1] pt-20 sm:pt-24"
    >
      <div className="yn-container">
        <Reveal>
          <h2
            className="mx-auto text-center font-semibold"
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3.125rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block text-[var(--yn-foreground)]">Gabung Event</span>
            <span className="block text-[#a3a3a3]">Terdekat YN Solo</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <div className="relative mt-16 sm:mt-20">
          {/* The centre lane masks the moving poster underneath the phone. */}
          <div
            ref={scrollRef}
            onScroll={recompute}
            aria-label="Geser untuk melihat event lainnya"
            className="absolute inset-x-0 bottom-0 top-[17%] z-0 flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max gap-7 px-[calc(50%_-_80px)] sm:gap-9 sm:px-[calc(50%_-_102px)] lg:gap-[52px] lg:px-[calc(50%_-_142px)]">
              {rendered.map((event, index) => (
                <PosterCard
                  key={`${index}-${event.slug ?? event.id ?? index}`}
                  event={event}
                  placeholder={loading}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[196px] -translate-x-1/2 bg-[#f1f1f1] sm:w-[244px] lg:w-[332px]" aria-hidden="true" />
          {activeEvent?.slug ? (
            <Link
              href={`/events/${activeEvent.slug}`}
              aria-label={`Lihat detail ${activeEvent.title ?? "event YukNgaji Solo"}`}
              className="relative z-20 mx-auto block w-[180px] rounded-[2.9rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--yn-accent)] sm:w-[228px] lg:w-[316px]"
            >
              <PhoneFrame event={activeEvent} />
            </Link>
          ) : (
            <div className="pointer-events-none relative z-20 mx-auto w-[180px] sm:w-[228px] lg:w-[316px]">
              <PhoneFrame event={activeEvent} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-b from-transparent to-white sm:h-28 lg:h-36" aria-hidden="true" />
        </div>
      </Reveal>

      {!loading && count === 0 && (
        <div className="yn-container">
          <p className="mx-auto mt-4 max-w-[520px] text-center text-base leading-[1.65] text-[var(--yn-muted)]">
            Belum ada event yang dipublikasikan. Pantau terus, atau{" "}
            <a
              href="https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, min"
              className="font-medium text-[var(--yn-accent)] underline underline-offset-4"
            >
              kepoin admin
            </a>{" "}
            untuk info kegiatan berikutnya.
          </p>
        </div>
      )}
    </section>
  );
}
