"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEvents } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Loader from "../common/Loader/Loader";
import {
  CalendarDays,
  Sparkles,
  History,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function safeFormatDate(value?: string | null, formatPattern: string = "EEEE, dd MMMM yyyy") {
  if (!value) return "Waktu akan diumumkan";
  try {
    const cleanStr = value.replace("Z", "");
    return formatStrToDateTime(cleanStr, formatPattern, false);
  } catch {
    return value;
  }
}

const AllowedGender: React.FC<{ event: Event }> = ({ event }) => {
  if (event.allowed_gender === "FEMALE") {
    return (
      <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm backdrop-blur-md border border-pink-500/20">
        Female Only
      </span>
    );
  }
  if (event.allowed_gender === "MALE") {
    return (
      <span className="rounded-full bg-[var(--yn-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--yn-accent-dark)]">
        Male Only
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-md border border-black/5">
      Umum
    </span>
  );
};

/* Kartu Event */
function EventItemCard({ event, isPast }: { event: Event; isPast: boolean }) {
  const formattedDate = safeFormatDate(event.start_at);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(23,23,23,0.14)]"
    >
      {/* Gambar Poster */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <img
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${isPast ? "grayscale-[0.15] group-hover:grayscale-0" : ""
            }`}
          src={event.image_url || "/images/landing/kegiatan/contoh-1.jpg"}
          alt={event.title || "Event YukNgaji Solo"}
          loading="lazy"
        />

        {/* Badge Gender di Kiri Atas */}
        <div className="absolute left-3.5 top-3.5">
          <AllowedGender event={event} />
        </div>

        {/* Badge Status di Kanan Atas */}
        <div className="absolute right-3.5 top-3.5">
          {isPast ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Selesai
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Akan Datang
            </span>
          )}
        </div>
      </div>

      {/* Informasi Event */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-2.5">
          {/* Tanggal Pelaksanaan */}
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--yn-muted)]">
            <Clock size={14} className="shrink-0 text-[var(--yn-accent)]" />
            <span className="truncate">{formattedDate}</span>
          </div>

          {/* Judul Event */}
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-[var(--yn-foreground)] transition-colors group-hover:text-[var(--yn-accent)]">
            {event.title}
          </h3>

          {/* Lokasi Event jika ada */}
          {event.location_desc?.[0] && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--yn-muted)]">
              <MapPin size={13} className="shrink-0 text-neutral-400" />
              <span className="truncate">{event.location_desc[0]}</span>
            </div>
          )}
        </div>

        {/* Footer Kartu */}
        <div className="mt-5 border-t border-[var(--yn-border)] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                className="h-8 w-auto"
                src="/images/logo/yn_logo.png"
                alt="YukNgaji Solo"
                width={24}
                height={24}
              />
              <span className="text-xs font-semibold text-[var(--yn-muted)]">
                YN Solo
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1 ${isPast
                ? "text-neutral-500 group-hover:text-black"
                : "text-[var(--yn-accent)]"
                }`}
            >
              {isPast ? "Dokumentasi" : "Lihat Detail"}
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GridEvents() {
  const dispatch = useAppDispatch();
  const eventsData = useAppSelector((state) => state.event.data);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const allEvents = useMemo(() => {
    return (eventsData ?? []).filter((event) => event.isPublished);
  }, [eventsData]);

  // Pisahkan event ke dalam grup "Event Terbaru/Mendatang" dan "Event Yang Sudah Berjalan"
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = Date.now();

    const getTimestamp = (e: Event) => {
      const timeStr = e.start_at || e.end_at;
      if (!timeStr) return 0;
      const t = new Date(timeStr.replace("Z", "")).getTime();
      return isNaN(t) ? 0 : t;
    };

    const isEventPast = (e: Event) => {
      const endStr = e.end_at || e.start_at;
      if (!endStr) return false;
      const t = new Date(endStr.replace("Z", "")).getTime();
      return !isNaN(t) && t < now;
    };

    const upcoming = allEvents
      .filter((e) => !isEventPast(e))
      .sort((a, b) => getTimestamp(a) - getTimestamp(b)); // Terdekat terlebih dahulu

    const past = allEvents
      .filter((e) => isEventPast(e))
      .sort((a, b) => getTimestamp(b) - getTimestamp(a)); // Baru saja selesai terlebih dahulu

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
    };
  }, [allEvents]);

  if (isLoading && eventsData == null) {
    return <Loader />;
  }

  const showUpcoming = activeTab === "all" || activeTab === "upcoming";
  const showPast = activeTab === "all" || activeTab === "past";

  return (
    <section className="yn-container pb-28 pt-6 md:pb-36">
      {/* Pesan Error Banner jika ada */}
      {error && (
        <div
          role="alert"
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Gagal memuat event: {error}</span>
        </div>
      )}

      {/* Filter Tab Kategori */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--yn-border)] pb-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${activeTab === "all"
              ? "bg-[#061120] text-white shadow-sm"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-black"
              }`}
          >
            Semua ({allEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${activeTab === "upcoming"
              ? "bg-[#061120] text-white shadow-sm"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-black"
              }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            Terbaru ({upcomingEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${activeTab === "past"
              ? "bg-[#061120] text-white shadow-sm"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-black"
              }`}
          >
            <History size={14} className="text-neutral-400" />
            Sudah Berjalan ({pastEvents.length})
          </button>
        </div>

        <p className="hidden text-xs text-[var(--yn-muted)] sm:block">
          Temukan ruang belajar dan bertumbuh bersama #TemanBahagia
        </p>
      </div>

      <div className="space-y-16 md:space-y-20">
        {/* GRUP 1 (ATAS): Event Terbaru & Mendatang */}
        {showUpcoming && (
          <div id="event-terbaru" className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Sparkles size={16} />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-[var(--yn-foreground)] sm:text-2xl md:text-3xl">
                  Event Terbaru & Mendatang
                </h2>
                <span className="ml-2 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                  {upcomingEvents.length} Event
                </span>
              </div>
              <p className="text-sm text-[var(--yn-muted)]">
                Daftarkan dirimu dan hadiri kegiatan terdekat bersama teman-teman komunitas.
              </p>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventItemCard key={event.id || event.slug} event={event} isPast={false} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 text-center sm:p-12">
                <CalendarDays size={36} className="mx-auto text-neutral-300" />
                <h4 className="mt-3 text-base font-semibold text-neutral-800">
                  Belum ada event mendatang saat ini
                </h4>
                <p className="mt-1 text-sm text-[var(--yn-muted)]">
                  Pantau terus jadwal kajian dan agenda seru kami berikutnya!
                </p>
              </div>
            )}
          </div>
        )}

        {/* GRUP 2 (BAWAH): Semua Event Yang Sudah Berjalan */}
        {showPast && (
          <div id="event-sudah-berjalan" className="space-y-6 pt-4 border-t border-[var(--yn-border)]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-200/60 text-neutral-700">
                  <History size={16} />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-[var(--yn-foreground)] sm:text-2xl md:text-3xl">
                  Event Yang Sudah Berjalan
                </h2>
                <span className="ml-2 rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-semibold text-neutral-600 border border-neutral-200">
                  {pastEvents.length} Selesai
                </span>
              </div>
              <p className="text-sm text-[var(--yn-muted)]">
                Arsip dan rekaman jejak kebersamaan kegiatan yang telah sukses terselenggara.
              </p>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventItemCard key={event.id || event.slug} event={event} isPast={true} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 text-center sm:p-12">
                <p className="text-sm text-[var(--yn-muted)]">
                  Belum ada riwayat kegiatan terdahulu.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
