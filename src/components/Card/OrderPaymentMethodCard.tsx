"use client";

import { useAppSelector } from "@/hooks/hooks";
import { formatRupiah } from "@/utils/currency";
import { Banknote, Copy, Info } from "lucide-react";
import QRCode from "qrcode.react";
import { toast } from "sonner";

export default function OrderPaymentMethodCard() {
  const order = useAppSelector((state) => state.order.order);
  const total = Math.max(0, (order?.amount ?? 0) + (order?.donation ?? 0) + (order?.admin_fee ?? 0) - (order?.discount_amount ?? 0));
  const payment = order?.payment_method;
  const isQris = payment?.type?.toLowerCase() === "qris";
  const charge = order?.charge;
  const isShopeeQRIS = charge?.provider === "shopee_qris" && Boolean(charge.qris_payload);
  const payableAmount = charge?.amount ?? total;

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} berhasil disalin`);
    } catch {
      toast.error(`${label} gagal disalin`);
    }
  }

  if (!payment) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900 sm:p-7">
        <div className="flex items-start gap-3">
          <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <div><h2 className="font-semibold">Instruksi pembayaran belum tersedia</h2><p className="mt-1 text-sm">Hubungi admin untuk mendapatkan bantuan pembayaran.</p></div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <Banknote aria-hidden="true" className="h-5 w-5 text-[var(--yn-accent)]" />
        <div>
          <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">Instruksi pembayaran</h2>
          <p className="mt-0.5 text-sm text-[var(--yn-muted)]">Transfer sesuai nominal agar pembayaran mudah diverifikasi.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-4 sm:p-5">
        <div className="flex items-center gap-4">
          {payment.image_url && <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2"><img src={payment.image_url} alt={`Logo ${payment.name}`} className="max-h-full max-w-full object-contain" /></div>}
          <div className="min-w-0">
            <p className="font-semibold text-[var(--yn-foreground)]">{payment.name}</p>
            <p className="mt-0.5 text-sm text-[var(--yn-muted)]">a.n. {payment.account_name}</p>
          </div>
        </div>

        {isQris ? (
          <div className="mt-5 flex justify-center rounded-2xl bg-white p-5">
            <QRCode value={isShopeeQRIS ? charge?.qris_payload ?? "" : payment.account_number ?? ""} size={190} />
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-[var(--yn-surface)] p-4">
            <div className="min-w-0"><p className="text-xs text-[var(--yn-muted)]">Nomor rekening</p><p className="mt-1 break-all text-lg font-semibold tracking-wide text-[var(--yn-foreground)]">{payment.account_number}</p></div>
            <button type="button" onClick={() => copy(payment.account_number ?? "", "Nomor rekening")} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--yn-border)] px-3 py-2 text-xs font-semibold text-[var(--yn-accent)] hover:bg-[var(--yn-accent-soft)]"><Copy aria-hidden="true" className="h-3.5 w-3.5" /> Salin</button>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-[var(--yn-surface)] p-4">
          <div><p className="text-xs text-[var(--yn-muted)]">Total transfer</p><p className="mt-1 text-xl font-bold text-[var(--yn-foreground)]">{payableAmount === 1 ? "Bayar seikhlasnya" : formatRupiah(payableAmount)}</p></div>
          {payableAmount !== 1 && <button type="button" onClick={() => copy(String(payableAmount), "Nominal transfer")} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--yn-border)] px-3 py-2 text-xs font-semibold text-[var(--yn-accent)] hover:bg-[var(--yn-accent-soft)]"><Copy aria-hidden="true" className="h-3.5 w-3.5" /> Salin</button>}
        </div>
      </div>

      {payableAmount !== 1 && <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[var(--yn-muted)]"><Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />{isShopeeQRIS ? `Kode unik ${charge?.unique_code ?? ""} sudah termasuk. Bayar tepat sampai digit terakhir; status diperbarui otomatis setelah mutasi Shopee tervalidasi.` : "Transfer tepat sampai digit terakhir, lalu gunakan tombol konfirmasi pembayaran."}</p>}
    </section>
  );
}
