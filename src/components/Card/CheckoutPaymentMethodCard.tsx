"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { setPaymentMethod } from "@/redux/slices/orderSlice";
import { CreditCard, Landmark, QrCode, WalletCards } from "lucide-react";
import { useEffect } from "react";

function methodTypeLabel(type: string) {
  const normalized = type.toLowerCase();
  if (normalized === "bank") return "Transfer bank";
  if (normalized.includes("wallet")) return "E-wallet";
  if (normalized === "qris" || normalized.includes("qr")) return "QRIS";
  return type;
}

function MethodIcon({ type }: { type: string }) {
  const normalized = type.toLowerCase();
  if (normalized === "bank") return <Landmark aria-hidden="true" className="h-4 w-4" />;
  if (normalized.includes("wallet")) return <WalletCards aria-hidden="true" className="h-4 w-4" />;
  if (normalized.includes("qr")) return <QrCode aria-hidden="true" className="h-4 w-4" />;
  return <CreditCard aria-hidden="true" className="h-4 w-4" />;
}

export default function CheckoutPaymentMethodCard() {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector((state) => state.paymentMethod.data);
  const isLoading = useAppSelector((state) => state.paymentMethod.loading);
  const error = useAppSelector((state) => state.paymentMethod.error);
  const selectedMethod = useAppSelector((state) => state.order.payment_method);
  const checkout = useAppSelector((state) => state.order.checkout);
  const needsPayment = checkout.some((entry) => (entry.ticket?.price ?? 0) > 0);

  useEffect(() => {
    if (needsPayment && paymentMethods.length === 0) dispatch(getPaymentMethod());
  }, [dispatch, needsPayment, paymentMethods.length]);

  if (!needsPayment) return null;

  return (
    <section id="payment-methods" className="scroll-mt-24 rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7">
      <div>
        <h2 className="text-xl font-semibold text-[var(--yn-foreground)]">Metode pembayaran</h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--yn-muted)]">Pilih satu metode. Detail transfer akan tampil setelah pesanan dibuat.</p>
      </div>

      {isLoading && paymentMethods.length === 0 ? (
        <p role="status" className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-5 text-sm text-[var(--yn-muted)]">Memuat metode pembayaran…</p>
      ) : error && paymentMethods.length === 0 ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>Metode pembayaran belum bisa dimuat.</p>
          <button type="button" onClick={() => dispatch(getPaymentMethod())} className="mt-3 font-semibold underline">Coba lagi</button>
        </div>
      ) : paymentMethods.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-5 text-sm text-[var(--yn-muted)]">Belum ada metode pembayaran yang tersedia.</p>
      ) : (
        <div role="radiogroup" aria-label="Metode pembayaran" className="mt-6 grid gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => {
            const selected = selectedMethod?.id === method.id;
            return (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => dispatch(setPaymentMethod(method))}
                className={`flex min-h-20 items-center gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yn-accent)] ${selected ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]" : "border-[var(--yn-border)] hover:border-[var(--yn-accent)]"}`}
              >
                <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                  {method.image_url ? <img src={method.image_url} alt="" className="max-h-full max-w-full object-contain" /> : <MethodIcon type={method.type} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--yn-foreground)]">{method.name}</span>
                  <span className="mt-1 block text-xs text-[var(--yn-muted)]">{methodTypeLabel(method.type)}</span>
                </span>
                <span className={`h-4 w-4 shrink-0 rounded-full border-4 ${selected ? "border-[var(--yn-accent)] bg-white" : "border-[var(--yn-border)]"}`} />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
