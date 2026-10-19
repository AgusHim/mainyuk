"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setCheckout } from "@/redux/slices/orderSlice";
import { getPublicTickets } from "@/redux/slices/ticketSlice";
import { Ticket } from "@/types/ticket";
import { UserTicket } from "@/types/user_ticket";
import { sendGAEvent } from "@next/third-parties/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ticketStatus = (ticket: Ticket) => {
  const now = Date.now();
  const remaining = ticket.max_pax && ticket.max_pax > 0
    ? Math.max(0, ticket.max_pax - (ticket.sold_pax ?? 0))
    : Number.POSITIVE_INFINITY;
  if (now < new Date(ticket.start_at).getTime()) return "Belum dibuka";
  if (now > new Date(ticket.end_at).getTime()) return "Penjualan ditutup";
  if (remaining === 0) return "Habis";
  return null;
};

export const FormEventDetailTickets: React.FC<{ slug: string }> = ({
  slug,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.ticket.loading);
  const ticketError = useAppSelector((state) => state.ticket.error);

  const [formData, setFormData] = useState<{ [key: string]: number }>({});
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (event?.id) {
      setTickets(null);
      dispatch(getPublicTickets(event.id)).then((e) => {
        if (getPublicTickets.fulfilled.match(e)) {
          setTickets((e.payload as Ticket[]).filter((ticket) => ticket.visibility === "public").sort((a, b) => a.price - b.price));
          let form: { [key: string]: number } = {};
          for (let index in e.payload) {
            const ticket = e.payload[index];
            form[`${ticket.id}_qty`] = 0;
            form[`${ticket.id}_price`] = ticket.price;
          }
          setFormData(form);
        }
      });
    }
  }, [dispatch, event?.id, reload]);

  const totalPayment = () => {
    let total = 0;
    if (tickets != null) {
      for (let index in tickets!) {
        const ticket = tickets[index];
        const qty = formData[`${ticket.id}_qty`];
        const price = formData[`${ticket.id}_price`];
        total = total + (qty ?? 0) * (price ?? 0);
      }
    }
    return total;
  };
  const increaseQty = (ticket: Ticket) => {
    if (ticketStatus(ticket)) return;
    const name = `${ticket.id}_qty`;
    const current = formData[name] ?? 0;
    const pax_multiplier = ticket.pax_multiplier ?? 1;
    const max_order_pax = ticket.max_order_pax ?? 1;
    const update = current + pax_multiplier;
    const available = ticket.max_pax && ticket.max_pax > 0
      ? ticket.max_pax - (ticket.sold_pax ?? 0)
      : Number.POSITIVE_INFINITY;
    const limit = Math.min(max_order_pax, available);

    if (update <= limit) {
      setFormData({ ...formData, [name]: update });
    }
  };

  const decreaseQty = (ticket: Ticket) => {
    const name = `${ticket.id}_qty`;
    const current = formData[name] ?? 0;
    const pax_multiplier = ticket.pax_multiplier ?? 1;
    const update = current - pax_multiplier;
    if (update >= 0) {
      setFormData({ ...formData, [name]: update });
    }
  };
  const checkAllValuesAreZero = () => {
    const hasAnyQty = Object.entries(formData).some(
      ([key, value]) => key.includes("_qty") && value > 0
    );
    // console.log(formData);
    return !hasAnyQty;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (checkAllValuesAreZero()) {
      toast.info("Kamu belum memilih tiket 😭");
      return;
    }
    sendGAEvent('event', 'event.tickets.buy', { 'event_id': event?.id, 'event_name': event?.title });
    let orderTickets: UserTicket[] = [];
    for (let index in tickets!) {
      const ticket = tickets[index];
      const qty = formData[`${ticket.id}_qty`];
      if (qty > 0) {
        for (let i = 0; i < qty; i++) {
          orderTickets.push({
            ticket_id: ticket.id,
            ticket: ticket,
            event_id: event?.id,
          });
        }
      }
    }
    dispatch(setCheckout(orderTickets));
    try {
      sessionStorage.setItem(`event-checkout:${slug}`, JSON.stringify(orderTickets));
    } catch {
      // Booking tetap bisa lanjut selama pilihan tiket masih ada di halaman ini.
    }
    route.push(`/events/${slug}/checkout`);
  };
  if (isLoading || (tickets == null && !ticketError)) {
    return <section id="tickets" className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 text-sm text-[var(--yn-muted)]" role="status">Memuat pilihan tiket…</section>;
  }

  const today = new Date();
  const startAt = event?.start_at ? new Date(event.start_at) : null;
  const closeAt = event?.close_at ? new Date(event.close_at) : null;
  if ((startAt && today > startAt) || (closeAt && today > closeAt) || event?.isAllowedToOrder === false) {
    return (
      <section id="tickets" className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8">
        <h2 className="text-xl font-semibold text-[var(--yn-foreground)]">Pendaftaran ditutup</h2>
        <p className="mt-2 text-sm text-[var(--yn-muted)]">Tiket untuk event ini sudah tidak dapat dipesan.</p>
        {startAt && today > startAt && <Button asChild className="mt-5 rounded-full w-full"><Link href={`/events/${event?.slug}/qna`}>Masuk Q&A</Link></Button>}
      </section>
    );
  }

  if (ticketError) {
    return (
      <section id="tickets" role="alert" className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800">
        <h2 className="font-semibold">Pilihan tiket gagal dimuat</h2>
        <p className="mt-1 text-sm">Coba lagi agar kamu bisa memilih tiket dan melanjutkan booking.</p>
        <button type="button" onClick={() => setReload((value) => value + 1)} className="mt-4 rounded-full bg-red-800 px-5 py-2 text-sm font-semibold text-white">Coba lagi</button>
      </section>
    );
  }

  if (tickets == null || tickets.length == 0) {
    return <section id="tickets" className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-8 text-sm text-[var(--yn-muted)]">Belum ada tiket publik untuk event ini.</section>;
  }

  return (
    <>
      <section id="tickets" className="scroll-mt-24 rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 shadow-sm sm:p-8">
        <div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <div>
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--yn-accent)]">Pendaftaran</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--yn-foreground)]">Pilihan Tiket</h2>
                  <p className="mt-1 text-sm text-[var(--yn-muted)]">Pilih jumlah tiket, lalu lanjutkan ke data pemesan dan pembayaran.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {tickets?.map((e) => (
                    <div
                      key={e.id}
                      className={`flex flex-col overflow-hidden rounded-2xl border ${formData[`${e.id}_qty`] > 0 ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]" : "border-[var(--yn-border)]"}`}
                    >
                      <div className="px-4 py-3">
                        <h3 className="font-semibold text-base text-[var(--yn-foreground)]">
                          {e.name}
                        </h3>
                        <p className="text-sm text-[var(--yn-muted)]">
                          {e.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-dashed border-[var(--yn-border)] px-4 py-3">
                        <div>
                          {e.original_price != null && e.original_price > e.price && (
                            <p className="text-xs text-[var(--yn-muted)] line-through">Rp{e.original_price.toLocaleString("id-ID")}</p>
                          )}
                          <p className="font-semibold text-sm text-[var(--yn-foreground)]">
                            {e.price == 0
                              ? "Gratis"
                              : e.price == 1
                                ? "Pay As You Wish"
                                : `Rp${e.price.toLocaleString("id-ID")}`}
                          </p>
                        </div>
                        {formData[`${e.id}_qty`] == 0 ? (
                          ticketStatus(e) ? (
                            <button
                              type="button"
                              className="cursor-not-allowed rounded-full bg-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600"
                              disabled
                            >
                              {ticketStatus(e)}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="rounded-full bg-[var(--yn-accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--yn-accent-dark)]"
                              onClick={() => {
                                increaseQty(e);
                              }}
                            >
                              Pilih tiket
                            </button>
                          )
                        ) : (
                          <div className="flex items-center gap-x-1">
                            <button
                              type="button"
                              aria-label={`Kurangi tiket ${e.name}`}
                              onClick={() => {
                                decreaseQty(e);
                              }}
                              className="rounded-lg border border-[var(--yn-border)] bg-[var(--yn-surface)] p-2 text-[var(--yn-foreground)]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="size-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            <input
                              readOnly={true}
                              className="w-12 rounded-md border border-[var(--yn-border)] bg-[var(--yn-surface)] p-1 text-center text-[var(--yn-foreground)]"
                              name={e.name}
                              type="text"
                              value={formData[`${e.id}_qty`]}
                            />
                            <button
                              type="button"
                              aria-label={`Tambah tiket ${e.name}`}
                              disabled={(formData[`${e.id}_qty`] ?? 0) + (e.pax_multiplier ?? 1) > Math.min(e.max_order_pax ?? 1, e.max_pax && e.max_pax > 0 ? e.max_pax - (e.sold_pax ?? 0) : Number.POSITIVE_INFINITY)}
                              onClick={() => {
                                increaseQty(e);
                              }}
                              className="rounded-lg border border-[var(--yn-border)] bg-[var(--yn-surface)] p-2 text-[var(--yn-foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="size-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <div className="mt-5 flex items-center justify-between gap-x-4 border-t border-[var(--yn-border)] pt-5 text-[var(--yn-foreground)]">
                <p className="font-medium text-sm">Total harga</p>
                <p className="font-bold text-xl">
                  {totalPayment() === 0 && Object.keys(formData).length > 0 ? "Gratis" : totalPayment() === 1 ? "Bayar seikhlasnya" : `Rp${totalPayment().toLocaleString("id-ID")}`}
                </p>
              </div>
            </div>
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <button
                type="submit"
                disabled={checkAllValuesAreZero()}
                className={`grid w-full place-items-center rounded-full p-3 text-base font-semibold ${checkAllValuesAreZero() ? "cursor-not-allowed bg-neutral-200 text-neutral-500" : "bg-[var(--yn-accent)] text-white hover:bg-[var(--yn-accent-dark)]"}`}
              >
                Lanjutkan booking →
              </button>
              {checkAllValuesAreZero() && <p className="text-center text-xs text-[var(--yn-muted)]">Pilih setidaknya satu tiket untuk melanjutkan.</p>}
              <div className="mt-5"></div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
