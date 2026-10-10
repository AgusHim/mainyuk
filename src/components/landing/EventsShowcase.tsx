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
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-[7px] sm:px-4 sm:pt-2.5">
      <span className="text-[8px] font-semibold tracking-tight text-[#111] sm:text-[10px]">
        9:41
      </span>
      <span className="flex items-center gap-1 text-[#111]">
        <svg
          viewBox="0 0 18 12"
          fill="currentColor"
          aria-hidden="true"
          className="h-[7px] w-auto sm:h-[9px]"
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
          className="h-[7px] w-auto sm:h-[9px]"
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
        <span className="relative inline-block h-[7px] w-[14px] rounded-[2px] border border-[#111]/50 sm:h-[9px] sm:w-[18px]">
          <span className="absolute inset-[1px] right-[5px] rounded-[1px] bg-[#111] sm:right-[7px]" />
        </span>
      </span>
    </div>
  );
}

function PhoneFrame({ event }: { event?: Event }) {
  return (
    <div className="relative aspect-[3/5] w-full rounded-[1.9rem] border-[3px] border-[#161616] bg-white p-[4px] shadow-[0_40px_80px_-42px_rgba(23,23,23,0.6)] sm:rounded-[2.4rem] sm:border-4 sm:p-[5px] lg:rounded-[2.9rem] lg:p-[6px]">
      {/* White screen: the poster sits inside it whole (never cropped), the way the mockup shows it. */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] bg-white sm:rounded-[1.9rem] lg:rounded-[2.3rem]">
        <div className="h-[10%] shrink-0" />
        <div className="relative mx-[4%] mb-[4%] flex-1 overflow-hidden">
          {event?.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title ?? "Event YukNgaji Solo"}
              fill
              sizes="(min-width: 1024px) 284px, (min-width: 640px) 204px, 160px"
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 animate-pulse rounded-[8px] bg-[var(--yn-surface-muted)]" />
          )}
        </div>
        <StatusBar />
        <div className="absolute left-1/2 top-[6px] z-20 h-[13px] w-[52px] -translate-x-1/2 rounded-full bg-black sm:top-2 sm:h-[18px] sm:w-[70px]" />
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
    "group relative block w-[160px] shrink-0 snap-center overflow-hidden rounded-[18px] bg-[var(--yn-surface-muted)] shadow-[0_26px_54px_-32px_rgba(23,23,23,0.55)] sm:w-[204px] sm:rounded-[22px] lg:w-[284px] lg:rounded-[26px]";

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
      className="yn-section overflow-hidden border-t border-[var(--yn-border)]"
    >
      <div className="yn-container">
        <Reveal>
          <h2
            className="mx-auto text-center font-semibold"
            style={{
              fontSize: "clamp(2rem, 7vw, 5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block text-[var(--yn-foreground)]">Gabung Event</span>
            <span className="block text-[#a3a3a3]">Terdekat YN Solo</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <div className="relative mt-10 md:mt-14">
          {/* Phone defines the row height and stays centred; posters scroll behind it. */}
          <div className="pointer-events-none relative z-20 mx-auto w-[170px] sm:w-[216px] lg:w-[304px]">
            <PhoneFrame event={activeEvent} />
          </div>

          <div
            ref={scrollRef}
            onScroll={recompute}
            className="absolute inset-0 flex items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max snap-x snap-mandatory gap-7 px-[calc(50%_-_80px)] sm:gap-9 sm:px-[calc(50%_-_102px)] lg:gap-12 lg:px-[calc(50%_-_142px)]">
              {rendered.map((event, index) => (
                <PosterCard
                  key={`${index}-${event.slug ?? event.id ?? index}`}
                  event={event}
                  placeholder={loading}
                />
              ))}
            </div>
          </div>
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
