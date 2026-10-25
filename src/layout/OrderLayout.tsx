"use client";

import OrderPaymentMethodCard from "@/components/Card/OrderPaymentMethodCard";
import Loader from "@/components/common/Loader/Loader";
import { CommonHeader } from "@/components/Header/CommonHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getOrderByPublicID } from "@/redux/slices/orderSlice";
import { user_api } from "@/redux/api";
import { Order } from "@/types/order";
import { formatRupiah } from "@/utils/currency";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CircleAlert,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  ReceiptText,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderLayoutProps = {
  params: { public_id: string };
};

const sectionClass =
  "rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7";

function formatDate(value?: string, includeTime = true) {
  if (!value) return "Belum tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Belum tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Jakarta",
  }).format(date);
}

// Dashboard menyimpan jadwal event sebagai waktu lokal WIB. Beberapa respons
// API lama masih menambahkan `Z`, yang bila diparse langsung akan dianggap UTC
// dan tampil tujuh jam lebih lambat/cepat di browser.
function formatEventDate(value?: string) {
  if (!value) return "Belum tersedia";
  const wibWallTime = value.replace(/(?:Z|[+-]\d{2}:\d{2})$/, "");
  const date = new Date(`${wibWallTime}Z`);
  if (Number.isNaN(date.getTime())) return "Belum tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date) + " WIB";
}

function amountLabel(value: number) {
  if (value === 0) return "Gratis";
  if (value === 1) return "Bayar seikhlasnya";
  return formatRupiah(value);
}

function statusCopy(status?: string) {
  switch (status) {
    case "paid":
      return { label: "Pembayaran diterima", note: "Tiketmu sudah siap digunakan.", className: "bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]" };
    case "expired":
      return { label: "Kedaluwarsa", note: "Batas waktu pembayaran telah berakhir.", className: "bg-red-50 text-red-700" };
    case "cancelled":
      return { label: "Dibatalkan", note: "Transaksi ini telah dibatalkan.", className: "bg-red-50 text-red-700" };
    case "rejected":
      return { label: "Pembayaran ditolak", note: "Hubungi admin jika kamu sudah melakukan pembayaran.", className: "bg-red-50 text-red-700" };
    default:
      return { label: "Menunggu pembayaran", note: "Selesaikan pembayaran agar tiket dapat diterbitkan.", className: "bg-amber-50 text-amber-800" };
  }
}

function DetailRow({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[var(--yn-border)] py-3.5 last:border-0">
      <dt className="text-sm text-[var(--yn-muted)]">{label}</dt>
      <dd className={`max-w-[65%] text-right text-sm font-semibold ${accent ? "text-[var(--yn-accent)]" : "text-[var(--yn-foreground)]"}`}>
        {value}
      </dd>
    </div>
  );
}

export default function OrderLayout({ params }: OrderLayoutProps) {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.order);
  const isLoading = useAppSelector((state) => state.order.loading);
  const error = useAppSelector((state) => state.order.error);
  const [hasLearningMaterial, setHasLearningMaterial] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const isCurrentOrder = order?.public_id === params.public_id;

  useEffect(() => {
    if (
      isCurrentOrder &&
      order?.status === "paid" &&
      getGroupUrl(order.event)
    ) {
      setIsGroupDialogOpen(true);
    }
  }, [isCurrentOrder, order?.event, order?.status]);

  useEffect(() => {
    if (!isCurrentOrder) dispatch(getOrderByPublicID(params.public_id));
  }, [dispatch, isCurrentOrder, params.public_id]);

  useEffect(() => {
    if (!isCurrentOrder || order?.status !== "pending" || order.charge?.provider !== "shopee_qris") return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") dispatch(getOrderByPublicID(params.public_id));
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [dispatch, isCurrentOrder, order?.charge?.provider, order?.status, params.public_id]);

  useEffect(() => {
    if (!isCurrentOrder || order?.status !== "paid" || !order.event?.slug) {
      setHasLearningMaterial(false);
      return;
    }
    let active = true;
    user_api.get(`/events/${order.event.slug}/learning`)
      .then((response) => {
        const hasContent = Array.isArray(response.data) && response.data.some((episode) => Array.isArray(episode.contents) && episode.contents.length > 0);
        if (active) setHasLearningMaterial(hasContent);
      })
      .catch(() => { if (active) setHasLearningMaterial(false); });
    return () => { active = false; };
  }, [isCurrentOrder, order?.event?.slug, order?.status]);

  if (error && !isCurrentOrder) {
    return (
      <MainLayout>
        <CommonHeader title="Detail Transaksi" isShowBack />
        <main className="yn-container py-12 md:py-20">
          <div role="alert" className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-7 text-red-800">
            <CircleAlert aria-hidden="true" className="h-7 w-7" />
            <h1 className="mt-4 text-xl font-semibold">Detail transaksi belum bisa dimuat</h1>
            <p className="mt-2 text-sm leading-relaxed">Pastikan kamu masuk dengan akun yang melakukan pemesanan ini, lalu coba kembali.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => dispatch(getOrderByPublicID(params.public_id))} className="rounded-full bg-red-800 px-5 py-2.5 text-sm font-semibold text-white">
                Coba lagi
              </button>
              <Link href="/orders" className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold">
                Kembali ke riwayat
              </Link>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (!isCurrentOrder || (isLoading && !order)) {
    return (
      <MainLayout>
        <CommonHeader title="Detail Transaksi" isShowBack />
        <Loader />
      </MainLayout>
    );
  }

  const event = order.event;
  const status = statusCopy(order.status);
  const ticketAmount = order.amount ?? 0;
  const donation = order.donation ?? 0;
  const adminFee = order.admin_fee ?? 0;
  const discountAmount = order.discount_amount ?? 0;
  const baseTotal = Math.max(0, ticketAmount + donation + adminFee - discountAmount);
  const total = order.charge?.amount ?? baseTotal;
  const ticketCount = order.user_tickets?.length ?? 0;
  const isShopeeQRIS = order.charge?.provider === "shopee_qris";
  const canConfirm = !isShopeeQRIS && !["paid", "expired", "cancelled"].includes(order.status ?? "pending");
  const groupUrl = getGroupUrl(event);

  return (
    <MainLayout>
      <CommonHeader title="Detail Transaksi" isShowBack />
      <main className="yn-container pb-28 pt-10 md:pb-36 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">Order #{order.public_id?.toUpperCase()}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--yn-foreground)] sm:text-5xl">Detail pesanan tiketmu.</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}>{status.label}</span>
              <p className="text-sm text-[var(--yn-muted)]">{status.note}</p>
            </div>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)] lg:items-start">
            <div className="space-y-6">
              <section className={`${sectionClass} overflow-hidden p-0`}>
                <div className="grid sm:grid-cols-[180px_1fr]">
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--yn-surface-muted)] sm:aspect-auto sm:min-h-64">
                    {event?.image_url ? (
                      <img src={event.image_url} alt={`Poster ${event.title ?? "event"}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full min-h-44 items-center justify-center text-[var(--yn-muted)]"><Ticket aria-hidden="true" className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--yn-accent)]">Event</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">{event?.title || "Event YukNgaji Solo"}</h2>
                    <div className="mt-5 space-y-3 text-sm text-[var(--yn-muted)]">
                      <p className="flex items-start gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--yn-accent)]" /><span>{event?.title?.includes("Speaker")?"Setiap Ahad 1, 8, 15 dan 22 November 2026 Jam 09.00 WIB - Selesai": formatEventDate(event?.start_at)}</span></p>
                      {event?.location_desc?.[0] && <p className="flex items-start gap-3"><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--yn-accent)]" /><span>{event.location_desc[0]}</span></p>}
                      <p className="flex items-start gap-3"><Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--yn-accent)]" /><span>{ticketCount > 0 ? `${ticketCount} tiket dalam pesanan` : "Tiket event"}</span></p>
                    </div>
                  </div>
                </div>
              </section>

              {order.status === "pending" && <OrderPaymentMethodCard />}

              {ticketCount > 0 && (
                <section className={sectionClass}>
                  <div className="flex items-center gap-3">
                    <Ticket aria-hidden="true" className="h-5 w-5 text-[var(--yn-accent)]" />
                    <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">Pemilik tiket</h2>
                  </div>
                  <div className="mt-5 divide-y divide-[var(--yn-border)]">
                    {order.user_tickets?.map((ticket, index) => (
                      <div key={ticket.id ?? `${ticket.user_email}-${index}`} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--yn-foreground)]">{ticket.user_name || `Peserta ${index + 1}`}</p>
                          <p className="mt-1 truncate text-xs text-[var(--yn-muted)]">{ticket.user_email || "Email belum tersedia"}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[var(--yn-surface-muted)] px-3 py-1 text-xs text-[var(--yn-muted)]">{ticket.ticket?.name || "Tiket"}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <section className={sectionClass}>
                <div className="flex items-center gap-3">
                  <ReceiptText aria-hidden="true" className="h-5 w-5 text-[var(--yn-accent)]" />
                  <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">Ringkasan transaksi</h2>
                </div>
                <dl className="mt-4">
                  <DetailRow label="Order ID" value={`#${order.public_id?.toUpperCase()}`} />
                  <DetailRow label="Dibuat" value={formatDate(order.created_at)} />
                  <DetailRow label="Tiket" value={amountLabel(ticketAmount)} />
                  {donation > 0 && <DetailRow label="Donasi" value={formatRupiah(donation)} />}
                  {adminFee > 0 && <DetailRow label="Biaya pembayaran" value={formatRupiah(adminFee)} />}
                  {discountAmount > 0 && <DetailRow label={order.voucher_code ? `Voucher (${order.voucher_code})` : "Voucher"} value={`−${formatRupiah(discountAmount)}`} />}
                  {order.charge?.unique_code ? <DetailRow label="Kode unik QRIS" value={`+${formatRupiah(order.charge.unique_code)}`} /> : null}
                  <DetailRow label="Total transaksi" value={amountLabel(total)} accent />
                </dl>
              </section>

              <div className="grid gap-3">
                {order.status === "paid" && (
                  <Link href={`/orders/${params.public_id}/tickets`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--yn-accent-dark)]">
                    <Ticket aria-hidden="true" className="h-4 w-4" /> Lihat tiket <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
                {order.status === "paid" && hasLearningMaterial && event?.slug && (
                  <Link href={`/events/${event.slug}/learning`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-3 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-accent-soft)]">
                    <BookOpen aria-hidden="true" className="h-4 w-4 text-[var(--yn-accent)]" /> Lihat materi event
                  </Link>
                )}
                {canConfirm && (
                  <a href={getWhatsAppUrl(order, total)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--yn-accent-dark)]">
                    <MessageCircle aria-hidden="true" className="h-4 w-4" /> Konfirmasi pembayaran
                  </a>
                )}
                {order.status === "paid" && groupUrl && (
                  <button type="button" onClick={() => setIsGroupDialogOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-3 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]">
                    <Users aria-hidden="true" className="h-4 w-4" /> Gabung Peserta
                  </button>
                )}
                <Link href="/orders" className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]">
                  Kembali ke riwayat transaksi
                </Link>
              </div>

              {order.status === "pending" && order.expired_at && (
                <p className="flex items-start gap-2 px-2 text-xs leading-relaxed text-[var(--yn-muted)]">
                  <Clock3 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Pembayaran berlaku sampai {formatDate(order.expired_at)}.
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 shadow-xl sm:p-6">
          <DialogHeader className="gap-4 pr-9">
            <span className="flex size-10 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
              <Users aria-hidden="true" className="size-[18px]" />
            </span>
            <DialogTitle className="text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[var(--yn-foreground)]">
              Masuk ke Grup Peserta
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-6 text-[var(--yn-muted)]">
              Kamu sudah bisa bergabung ke grup {event?.title ? `“${event.title}”` : "event"}. Grup ini digunakan untuk informasi teknis, pengumuman, dan koordinasi peserta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2.5 border-0 bg-transparent p-0 sm:justify-stretch">
            <button type="button" onClick={() => setIsGroupDialogOpen(false)} className="min-h-11 rounded-full px-4 text-sm font-semibold text-[var(--yn-muted)] transition hover:bg-[var(--yn-surface-muted)] hover:text-[var(--yn-foreground)] sm:flex-1">
              Nanti saja
            </button>
            {groupUrl && (
              <a href={groupUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsGroupDialogOpen(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--yn-accent-dark)] sm:flex-[1.35]">
                Lanjut ke WhatsApp <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

function getGroupUrl(event: Order["event"]) {
  return event?.wa_group_url || (
    event?.divisi?.name?.includes("Sports")
      ? "https://chat.whatsapp.com/HSRFShOBsjpKUHiyJV49BZ"
      : event?.title?.includes("Speaking")
        ? "https://chat.whatsapp.com/JUy14CJKEhyEpQcdjhFoCi"
        : null
  );
}

const phoneNumber = "+6282262448523";
const phoneKeysFemale = "+6285772149565";
const phoneSports = "+6287872721044";

function getWhatsAppUrl(order: Order, total: number) {
  let phone = phoneNumber;
  if (order.event?.divisi?.name?.includes("KEY") && order.user?.gender !== "male") phone = phoneKeysFemale;
  if (order.event?.divisi?.name?.includes("Sports")) phone = phoneSports;

  const message = [
    "Konfirmasi Pembayaran",
    "",
    `Order ID: ${order.public_id ?? "-"}`,
    `Nama Event: ${order.event?.title ?? "-"}`,
    `Metode Pembayaran: ${order.payment_method?.name ?? "-"}`,
    `Total Transfer: ${amountLabel(total)}`,
    `Nama Pemesan: ${order.user?.name ?? "-"}`,
  ].join("\n");

  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
