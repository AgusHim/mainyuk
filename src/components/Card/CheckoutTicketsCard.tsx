"use client";

import { useAppSelector } from "@/hooks/hooks";
import { formatRupiah } from "@/utils/currency";
import { ReceiptText } from "lucide-react";

function amountLabel(value: number) {
  if (value === 0) return "Gratis";
  if (value === 1) return "Bayar seikhlasnya";
  return formatRupiah(value);
}

export default function CheckoutTicketsCard({ discountAmount = 0, voucherCode = "" }: { discountAmount?: number; voucherCode?: string }) {
  const checkout = useAppSelector((state) => state.order.checkout);
  const paymentMethod = useAppSelector((state) => state.order.payment_method);
  const adminFee = useAppSelector((state) => state.order.admin_fee);
  const ticketIds = Array.from(new Set(checkout.map((entry) => entry.ticket_id)));
  const subtotal = checkout.reduce((total, entry) => total + (entry.ticket?.price ?? 0), 0);
  const total = Math.max(0, subtotal + adminFee - discountAmount);

  return (
    <section className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <ReceiptText aria-hidden="true" className="h-5 w-5 text-[var(--yn-accent)]" />
        <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">Ringkasan pembayaran</h2>
      </div>

      <dl className="mt-5 space-y-4">
        {ticketIds.map((ticketId) => {
          const entries = checkout.filter((entry) => entry.ticket_id === ticketId);
          const unitPrice = entries[0]?.ticket?.price ?? 0;
          return (
            <div key={ticketId ?? entries[0]?.ticket?.name} className="flex items-start justify-between gap-4">
              <dt className="text-sm text-[var(--yn-muted)]"><span className="font-medium text-[var(--yn-foreground)]">{entries.length}×</span> {entries[0]?.ticket?.name ?? "Tiket"}</dt>
              <dd className="shrink-0 text-sm font-semibold text-[var(--yn-foreground)]">{amountLabel(entries.length * unitPrice)}</dd>
            </div>
          );
        })}

        {paymentMethod && adminFee > 0 && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-[var(--yn-muted)]">{paymentMethod.type.toLowerCase() === "bank" ? "Kode unik" : "Biaya pembayaran"}</dt>
            <dd className="shrink-0 text-sm font-semibold text-[var(--yn-foreground)]">{formatRupiah(adminFee)}</dd>
          </div>
        )}
        {discountAmount > 0 && <div className="flex items-start justify-between gap-4 text-[var(--yn-accent-dark)]"><dt className="text-sm">Voucher {voucherCode ? `(${voucherCode})` : ""}</dt><dd className="shrink-0 text-sm font-semibold">-{formatRupiah(discountAmount)}</dd></div>}
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--yn-border)] pt-5">
        <div><p className="text-xs text-[var(--yn-muted)]">Total pembayaran</p><p className="mt-1 text-xl font-bold text-[var(--yn-foreground)]">{amountLabel(total)}</p></div>
        <span className="text-xs text-[var(--yn-muted)]">{checkout.length} tiket</span>
      </div>
    </section>
  );
}
