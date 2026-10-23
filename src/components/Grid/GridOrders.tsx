"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getOrders } from "@/redux/slices/orderSlice";
import { getMyDonations } from "@/redux/slices/fundraisingSlice";
import { getMyShopOrders } from "@/redux/slices/shopSlice";
import { Order } from "@/types/order";
import { DonationView, donationStatusLabel } from "@/types/fundraising";
import { ShopOrder, fulfillmentStatusLabel, paymentStatusLabel } from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Tab = "tickets" | "donations" | "shop";

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: "tickets", label: "Tiket Event", description: "Tiket untuk kegiatan yang kamu ikuti." },
  { id: "donations", label: "Donasi", description: "Jejak dukunganmu untuk kegiatan dan program komunitas." },
  { id: "shop", label: "Shop", description: "Pesanan merchandise YukNgaji Solo." },
];

const cardClass = "group block rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 transition-colors hover:border-[var(--yn-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)] sm:p-6";

function formatDate(value?: string) {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date) + " WIB";
}

function ticketStatusLabel(status?: string) {
  switch (status) {
    case "paid": return "Lunas";
    case "pending": return "Menunggu pembayaran";
    case "cancelled": return "Dibatalkan";
    case "expired": return "Kedaluwarsa";
    case "rejected": return "Ditolak";
    default: return status || "Status belum tersedia";
  }
}

function Status({ children, positive = false }: { children: React.ReactNode; positive?: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${positive ? "bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]" : "bg-[var(--yn-surface-muted)] text-[var(--yn-muted)]"}`}>{children}</span>;
}

function TicketCard({ order }: { order: Order }) {
  const baseTotal = Math.max(0, (order.amount ?? 0) + (order.donation ?? 0) + (order.admin_fee ?? 0) - (order.discount_amount ?? 0));
  const total = order.charge?.amount ?? baseTotal;
  return (
    <Link href={`/orders/${order.public_id}`} className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--yn-muted)]">#{order.public_id}</p>
          <p className="mt-1 text-xs text-[var(--yn-muted)]">{formatDate(order.created_at)}</p>
        </div>
        <Status positive={order.status === "paid"}>{ticketStatusLabel(order.status)}</Status>
      </div>
      <div className="mt-5 flex items-center gap-4 border-t border-[var(--yn-border)] pt-5">
        {order.event?.image_url && <img src={order.event.image_url} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold text-[var(--yn-foreground)]">{order.event?.title || "Tiket event"}</h3>
          <p className="mt-1 text-sm text-[var(--yn-muted)]">{order.user_tickets?.length ? `${order.user_tickets.length} tiket` : "Pesanan tiket event"}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--yn-muted)]">Total transaksi</p>
          <p className="mt-1 font-semibold text-[var(--yn-foreground)]">{total === 0 ? "Gratis" : formatRupiah(total)}</p>
          {order.charge?.unique_code ? <p className="mt-1 text-xs text-[var(--yn-muted)]">Termasuk kode unik +{formatRupiah(order.charge.unique_code)}</p> : null}
        </div>
        <span className="text-sm font-semibold text-[var(--yn-accent)]">Lihat detail →</span>
      </div>
    </Link>
  );
}

function DonationCard({ donation }: { donation: DonationView }) {
  const total = donation.charge?.amount ?? donation.paid_amount ?? donation.amount;
  return (
    <Link href={`/donations/status/${donation.public_id}`} className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-medium text-[var(--yn-muted)]">#{donation.public_id}</p><p className="mt-1 text-xs text-[var(--yn-muted)]">{formatDate(donation.created_at)}</p></div>
        <Status positive={donation.status === "confirmed"}>{donationStatusLabel(donation.status)}</Status>
      </div>
      <h3 className="mt-5 border-t border-[var(--yn-border)] pt-5 text-base font-semibold text-[var(--yn-foreground)]">{donation.campaign_title}</h3>
      <p className="mt-1 text-sm text-[var(--yn-muted)]">Donasi untuk program komunitas</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--yn-muted)]">Total transaksi</p>
          <p className="mt-1 font-semibold text-[var(--yn-foreground)]">{formatRupiah(total)}</p>
          {donation.charge?.unique_code ? <p className="mt-1 text-xs text-[var(--yn-muted)]">Termasuk kode unik +{formatRupiah(donation.charge.unique_code)}</p> : null}
        </div>
        <span className="text-sm font-semibold text-[var(--yn-accent)]">Lihat detail →</span>
      </div>
    </Link>
  );
}

function ShopCard({ order }: { order: ShopOrder }) {
  const itemCount = order.items?.reduce((sum, item) => sum + item.qty, 0);
  const total = order.charge?.amount ?? order.paid_amount ?? order.total;
  return (
    <Link href={`/shop/orders/${order.public_id}`} className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-medium text-[var(--yn-muted)]">#{order.public_id}</p><p className="mt-1 text-xs text-[var(--yn-muted)]">{formatDate(order.created_at)}</p></div>
        <Status positive={order.payment_status === "paid"}>{paymentStatusLabel(order.payment_status)}</Status>
      </div>
      <h3 className="mt-5 border-t border-[var(--yn-border)] pt-5 text-base font-semibold text-[var(--yn-foreground)]">{order.items?.[0]?.product_name || "Pesanan shop"}</h3>
      <p className="mt-1 text-sm text-[var(--yn-muted)]">{itemCount ? `${itemCount} barang · ` : ""}{fulfillmentStatusLabel(order.fulfillment_status)}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--yn-muted)]">Total transaksi</p>
          <p className="mt-1 font-semibold text-[var(--yn-foreground)]">{formatRupiah(total)}</p>
          {order.charge?.unique_code ? <p className="mt-1 text-xs text-[var(--yn-muted)]">Termasuk kode unik +{formatRupiah(order.charge.unique_code)}</p> : null}
        </div>
        <span className="text-sm font-semibold text-[var(--yn-accent)]">Lihat detail →</span>
      </div>
    </Link>
  );
}

export default function GridOrders() {
  const dispatch = useAppDispatch();
  const ticketOrders = useAppSelector((state) => state.order.orders);
  const donations = useAppSelector((state) => state.fundraising.myDonations);
  const donationsHasMore = useAppSelector((state) => state.fundraising.myDonationsHasMore);
  const shopOrders = useAppSelector((state) => state.shop.orders);
  const shopHasMore = useAppSelector((state) => state.shop.ordersHasMore);

  const [activeTab, setActiveTab] = useState<Tab>("tickets");
  const [queryReady, setQueryReady] = useState(false);
  const [loaded, setLoaded] = useState<Record<Tab, boolean>>({ tickets: false, donations: false, shop: false });
  const [loading, setLoading] = useState<Record<Tab, boolean>>({ tickets: false, donations: false, shop: false });
  const [errors, setErrors] = useState<Record<Tab, string | null>>({ tickets: null, donations: null, shop: null });
  const [pages, setPages] = useState({ donations: 0, shop: 0 });

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "tickets" || requestedTab === "donations" || requestedTab === "shop") {
      setActiveTab(requestedTab);
    }
    setQueryReady(true);
  }, []);

  const load = useCallback(async (tab: Tab, page = 1) => {
    setLoading((previous) => ({ ...previous, [tab]: true }));
    setErrors((previous) => ({ ...previous, [tab]: null }));
    try {
      if (tab === "tickets") await dispatch(getOrders()).unwrap();
      if (tab === "donations") await dispatch(getMyDonations(page)).unwrap();
      if (tab === "shop") await dispatch(getMyShopOrders({ page })).unwrap();
      setLoaded((previous) => ({ ...previous, [tab]: true }));
      if (tab !== "tickets") setPages((previous) => ({ ...previous, [tab]: page }));
    } catch {
      setErrors((previous) => ({ ...previous, [tab]: "Riwayat belum bisa dimuat. Coba lagi sebentar." }));
    } finally {
      setLoading((previous) => ({ ...previous, [tab]: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (queryReady && !loaded[activeTab] && !loading[activeTab] && !errors[activeTab]) void load(activeTab);
  }, [activeTab, loaded, loading, errors, load, queryReady]);

  const current = tabs.find((tab) => tab.id === activeTab)!;
  const empty = activeTab === "tickets" ? ticketOrders?.length === 0 : activeTab === "donations" ? donations.length === 0 : shopOrders?.length === 0;
  const hasMore = activeTab === "donations" ? donationsHasMore : activeTab === "shop" ? shopHasMore : false;

  return (
    <main className="yn-container pb-28 pt-10 md:pb-36 md:pt-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">Aktivitasmu</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--yn-foreground)] sm:text-5xl">Riwayat transaksi</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--yn-muted)]">Semua tiket, donasi, dan pesanan shop dalam satu tempat.</p>
      </div>

      <div role="tablist" aria-label="Jenis transaksi" className="mt-10 flex gap-2 overflow-x-auto border-b border-[var(--yn-border)] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`orders-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="orders-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => {
              const index = tabs.findIndex((item) => item.id === tab.id);
              const next = event.key === "ArrowRight" ? tabs[(index + 1) % tabs.length] : event.key === "ArrowLeft" ? tabs[(index + tabs.length - 1) % tabs.length] : null;
              if (next) { event.preventDefault(); setActiveTab(next.id); document.getElementById(`orders-tab-${next.id}`)?.focus(); }
            }}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)] ${activeTab === tab.id ? "bg-[var(--yn-foreground)] text-[var(--yn-surface)]" : "text-[var(--yn-muted)] hover:bg-[var(--yn-surface-muted)] hover:text-[var(--yn-foreground)]"}`}
          >{tab.label}</button>
        ))}
      </div>

      <section id="orders-panel" role="tabpanel" aria-labelledby={`orders-tab-${activeTab}`} tabIndex={0} className="mt-8 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)]">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[var(--yn-foreground)]">{current.label}</h3>
          <p className="mt-1 text-sm text-[var(--yn-muted)]">{current.description}</p>
        </div>

        {errors[activeTab] && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{errors[activeTab]} <button type="button" onClick={() => void load(activeTab, loaded[activeTab] ? (activeTab === "tickets" ? 1 : pages[activeTab] + 1) : 1)} className="ml-2 font-semibold underline">Coba lagi</button></div>}

        {!loaded[activeTab] && loading[activeTab] ? (
          <p role="status" className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 text-sm text-[var(--yn-muted)]">Memuat riwayat {current.label.toLowerCase()}…</p>
        ) : loaded[activeTab] && empty ? (
          <div className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 sm:p-10">
            <p className="text-lg font-semibold text-[var(--yn-foreground)]">Belum ada riwayat {current.label.toLowerCase()}</p>
            <p className="mt-2 text-sm text-[var(--yn-muted)]">Aktivitasmu akan tampil di sini setelah transaksi pertama.</p>
            <Link href={activeTab === "tickets" ? "/events" : activeTab === "donations" ? "/donations" : "/shop"} className="mt-5 inline-block rounded-full bg-[var(--yn-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--yn-accent-dark)]">{activeTab === "tickets" ? "Lihat event" : activeTab === "donations" ? "Lihat program donasi" : "Jelajahi shop"} →</Link>
          </div>
        ) : loaded[activeTab] ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeTab === "tickets" && ticketOrders?.map((order) => <TicketCard key={order.id ?? order.public_id} order={order} />)}
            {activeTab === "donations" && donations.map((donation) => <DonationCard key={donation.id} donation={donation} />)}
            {activeTab === "shop" && shopOrders?.map((order) => <ShopCard key={order.id} order={order} />)}
          </div>
        ) : null}

        {loaded[activeTab] && hasMore && (
          <button type="button" onClick={() => void load(activeTab, pages[activeTab as "donations" | "shop"] + 1)} disabled={loading[activeTab]} className="mt-6 w-full rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-5 py-3 text-sm font-semibold text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)] disabled:opacity-50">{loading[activeTab] ? "Memuat…" : "Muat lebih banyak"}</button>
        )}
      </section>
    </main>
  );
}
