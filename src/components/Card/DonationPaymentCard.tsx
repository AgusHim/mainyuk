"use client";

import { Charge, DonationView } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import {
  CheckCircle2,
  Clipboard,
  Clock3,
  CreditCard,
  Info,
  Landmark,
  QrCode as QrCodeIcon,
} from "lucide-react";
import QRCode from "qrcode.react";
import { toast } from "sonner";

interface DonationPaymentCardProps {
  donation: DonationView;
  charge?: Charge | null;
}

const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} disalin`);
    } catch {
      toast.error("Belum berhasil menyalin");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-3 text-xs font-semibold text-[var(--yn-foreground)] transition hover:border-[var(--yn-accent)] hover:bg-[var(--yn-accent-soft)]"
    >
      <Clipboard aria-hidden="true" className="size-3.5" />
      Salin
    </button>
  );
};

const DonationPaymentCard = ({
  donation,
  charge,
}: DonationPaymentCardProps) => {
  const instructions = charge?.instructions ?? [];
  const payableAmount = charge?.amount ?? donation.amount;
  const hasShopeeQRIS = charge?.provider === "shopee_qris" && charge.qris_payload;
  // QRIS ShopeePay adalah QR dinamis dengan nominal unik. Jangan tampilkan
  // QRIS statis dari metode pembayaran pada transaksi yang sama.
  const visibleInstructions = hasShopeeQRIS
    ? instructions.filter((instruction) => instruction.type?.toLowerCase() !== "qris")
    : instructions;

  return (
    <section
      className="rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7"
      aria-labelledby="payment-instruction-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
          <CreditCard aria-hidden="true" className="size-4" />
        </span>
        <div>
          <h2
            id="payment-instruction-title"
            className="text-xl font-semibold text-[var(--yn-foreground)]"
          >
            Selesaikan pembayaran
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--yn-muted)]">
            Transfer sesuai nominal agar donasi dapat diverifikasi dengan tepat.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--yn-surface-muted)] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--yn-muted)]">
          Nominal transfer
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
            {formatRupiah(payableAmount)}
          </p>
          <CopyButton value={`${payableAmount}`} label="Nominal" />
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[var(--yn-muted)]">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {charge?.unique_code ? `Kode unik ${charge.unique_code} sudah termasuk pada nominal. Transfer tepat sesuai nominal agar mutasi tervalidasi otomatis.` : "Transfer tepat sesuai nominal di atas untuk membantu proses pencocokan."}
        </p>
      </div>

      {hasShopeeQRIS ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-[var(--yn-border)] bg-white p-5">
          <QRCode value={charge.qris_payload ?? ""} size={220} />
          <p className="mt-3 text-center text-sm font-semibold text-[var(--yn-foreground)]">QRIS ShopeePay</p>
          <p className="mt-1 text-center text-xs leading-5 text-[var(--yn-muted)]">Pindai QR ini dan bayar tepat {formatRupiah(payableAmount)}. Status akan tervalidasi otomatis.</p>
        </div>
      ) : null}

      {visibleInstructions.length === 0 && !hasShopeeQRIS ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Metode pembayaran belum dipilih. Hubungi pengurus untuk mendapatkan
          rekening tujuan dan sertakan ID donasi saat konfirmasi.
        </div>
      ) : visibleInstructions.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {visibleInstructions.map((instruction) => {
            const isQris = instruction.type?.toLowerCase() === "qris";
            return (
              <article
                key={instruction.method_id}
                className="rounded-2xl border border-[var(--yn-border)] p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--yn-surface-muted)] p-2 text-[var(--yn-muted)]">
                    {instruction.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={instruction.image_url}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : isQris ? (
                      <QrCodeIcon aria-hidden="true" className="size-5" />
                    ) : (
                      <Landmark aria-hidden="true" className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[var(--yn-foreground)]">
                      {instruction.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-[var(--yn-muted)]">
                      a.n. {instruction.account_name}
                    </p>
                  </div>
                </div>

                {isQris ? (
                  <div className="mt-4 flex flex-col items-center rounded-2xl bg-white p-5">
                    <QRCode value={instruction.account_number} size={200} />
                    <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                      Pindai kode QR melalui aplikasi pembayaranmu.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--yn-surface-muted)] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--yn-muted)]">Nomor rekening</p>
                      <p className="mt-0.5 break-all text-lg font-semibold tracking-wide text-[var(--yn-foreground)]">
                        {instruction.account_number}
                      </p>
                    </div>
                    <CopyButton
                      value={instruction.account_number}
                      label="Nomor rekening"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 border-t border-[var(--yn-border)] pt-5">
        <ol className="grid gap-3 text-sm text-[var(--yn-muted)] sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[10px] font-bold text-[var(--yn-accent-dark)]">
              1
            </span>
            Transfer sesuai nominal.
          </li>
          <li className="flex items-start gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[10px] font-bold text-[var(--yn-accent-dark)]">
              2
            </span>
            Simpan bukti transfer.
          </li>
          <li className="flex items-start gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[10px] font-bold text-[var(--yn-accent-dark)]">
              3
            </span>
            Tunggu verifikasi pengurus.
          </li>
        </ol>
        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[var(--yn-accent-soft)] p-4 text-xs leading-5 text-[var(--yn-accent-dark)]">
          {charge?.expires_at ? (
            <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          )}
          {hasShopeeQRIS ? "Status akan diperbarui otomatis setelah mutasi ShopeePay tervalidasi." : "Setelah transfer, sampaikan bukti pembayaran melalui kanal pengurus. Status halaman ini akan diperbarui setelah pembayaran diperiksa."}
        </p>
      </div>
    </section>
  );
};

export default DonationPaymentCard;
