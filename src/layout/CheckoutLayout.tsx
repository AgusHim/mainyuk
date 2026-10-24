"use client";

import { FormCheckoutTickets } from "@/components/Form/FormCheckoutTickets";
import Loader from "@/components/common/Loader/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { setCheckout } from "@/redux/slices/orderSlice";
import { UserTicket } from "@/types/user_ticket";
import { CalendarDays, CircleAlert, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CheckoutLayout: React.FC<{ slug: string }> = ({ slug }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const event = useAppSelector((state) => state.event.event);
  const checkout = useAppSelector((state) => state.order.checkout);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);
  const [checkoutRestored, setCheckoutRestored] = useState(false);
  const isCurrentEvent = event?.slug === slug;

  useEffect(() => {
    if (!isCurrentEvent) dispatch(getEventDetail(slug));
  }, [dispatch, isCurrentEvent, slug]);

  useEffect(() => {
    if (checkout.length === 0) {
      try {
        const saved = sessionStorage.getItem(`event-checkout:${slug}`);
        if (saved) {
          const tickets = JSON.parse(saved) as UserTicket[];
          if (Array.isArray(tickets) && tickets.length > 0) dispatch(setCheckout(tickets));
        }
      } catch {
        sessionStorage.removeItem(`event-checkout:${slug}`);
      }
    }
    setCheckoutRestored(true);
  }, [dispatch, slug]);

  useEffect(() => {
    if (checkoutRestored && checkout.length === 0) router.replace(`/events/${slug}#tickets`);
  }, [checkoutRestored, checkout.length, router, slug]);

  if (error && !isCurrentEvent) {
    return (
      <main className="yn-container py-12">
        <div role="alert" className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-7 text-red-800">
          <CircleAlert aria-hidden="true" className="h-6 w-6" />
          <h1 className="mt-4 text-xl font-semibold">Checkout belum bisa dimuat</h1>
          <p className="mt-2 text-sm">Data event gagal dimuat. Silakan coba kembali dari halaman event.</p>
          <Link href={`/events/${slug}`} className="mt-5 inline-flex rounded-full bg-red-800 px-5 py-2.5 text-sm font-semibold text-white">Kembali ke event</Link>
        </div>
      </main>
    );
  }

  if (!isCurrentEvent || isLoading || !checkoutRestored || checkout.length === 0) return <Loader />;

  // Waktu event dari dashboard disimpan sebagai waktu lokal WIB, tetapi API
  // lama dapat mengirim suffix `Z`. Jangan biarkan browser menganggapnya UTC
  // lalu menambahkan tujuh jam lagi ketika dirender di Asia/Jakarta.
  const eventStartValue = event.start_at?.replace(/(?:Z|[+-]\d{2}:\d{2})$/, "");
  const eventStart = eventStartValue ? new Date(`${eventStartValue}Z`) : null;
  const eventDate = eventStart && !Number.isNaN(eventStart.getTime())
    ? new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(eventStart)
    : "Jadwal akan diumumkan";

  return (
    <main className="yn-container pb-28 pt-10 md:pb-36 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">Checkout tiket</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--yn-foreground)] sm:text-5xl">Lengkapi pesananmu.</h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--yn-muted)]">Periksa event dan isi data setiap peserta sebelum membuat pesanan.</p>
        </header>

        <section className="mt-10 overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)]">
          <div className="grid sm:grid-cols-[150px_1fr_auto] sm:items-center">
            <div className="aspect-[16/8] overflow-hidden bg-[var(--yn-surface-muted)] sm:aspect-square sm:h-full">
              {event.image_url && <img src={event.image_url} alt={`Poster ${event.title ?? "event"}`} className="h-full w-full object-cover" />}
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--yn-accent)]">Event pilihanmu</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--yn-foreground)]">{event.title}</h2>
              <p className="mt-3 flex items-start gap-2 text-sm text-[var(--yn-muted)]"><CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />{event.title?.includes("Speaking") ?"Ahad 1, 8, 15 dan 22 November 2026 Jam 09:00 WIB - Selesai":`${eventDate} WIB`}</p>
            </div>
            <div className="border-t border-[var(--yn-border)] p-5 sm:border-l sm:border-t-0 sm:p-6">
              <p className="flex items-center gap-2 text-xs text-[var(--yn-muted)]"><UserRound aria-hidden="true" className="h-4 w-4" />Pemesan</p>
              <p className="mt-2 max-w-48 truncate text-sm font-semibold text-[var(--yn-foreground)]">{user?.name ?? "Pengguna"}</p>
              <p className="mt-1 max-w-48 truncate text-xs text-[var(--yn-muted)]">{user?.email}</p>
            </div>
          </div>
        </section>

        <FormCheckoutTickets />
      </div>
    </main>
  );
};
