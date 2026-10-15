"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createDonation } from "@/redux/slices/fundraisingSlice";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { formatRupiah } from "@/utils/currency";
import {
  ArrowRight,
  Check,
  CreditCard,
  Eye,
  LoaderCircle,
  LockKeyhole,
  MessageCircleMore,
  UserRoundX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

interface FormDonationProps {
  campaignSlug: string;
  onCancel?: () => void;
}

const CheckboxCard = ({
  checked,
  disabled = false,
  onChange,
  icon,
  title,
  description,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <label
    className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
      checked
        ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]"
        : "border-[var(--yn-border)]"
    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[var(--yn-accent)]"}`}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="sr-only"
    />
    <span
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border ${
        checked
          ? "border-[var(--yn-accent)] bg-[var(--yn-accent)] text-white"
          : "border-[var(--yn-border)] bg-[var(--yn-surface)]"
      }`}
    >
      {checked ? <Check aria-hidden="true" className="size-3.5" /> : null}
    </span>
    <span className="min-w-0">
      <span className="flex items-center gap-2 text-sm font-semibold text-[var(--yn-foreground)]">
        {icon}
        {title}
      </span>
      <span className="mt-1 block text-xs leading-5 text-[var(--yn-muted)]">
        {description}
      </span>
    </span>
  </label>
);

export default function FormDonation({
  campaignSlug,
  onCancel,
}: FormDonationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const paymentMethods = useAppSelector((state) => state.paymentMethod.data);
  const paymentLoading = useAppSelector(
    (state) => state.paymentMethod.loading
  );
  const paymentError = useAppSelector((state) => state.paymentMethod.error);
  const isLoading = useAppSelector((state) => state.fundraising.loading);

  const [amount, setAmount] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAmount, setShowAmount] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");

  const clientToken = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  useEffect(() => {
    if (paymentMethods.length === 0) dispatch(getPaymentMethod());
  }, [dispatch, paymentMethods.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (amount <= 0) {
      document.getElementById("donation-amount")?.focus();
      toast.error("Nominal donasi belum diisi");
      return;
    }

    try {
      const result = await dispatch(
        createDonation({
          campaign_slug: campaignSlug,
          amount,
          is_anonymous: isAnonymous,
          show_amount: isAnonymous ? false : showAmount,
          message: message.trim() === "" ? null : message.trim(),
          payment_method_id: paymentMethodId === "" ? null : paymentMethodId,
          client_token: clientToken,
        })
      ).unwrap();

      toast.success("Donasi dibuat. Silakan lanjutkan pembayaran.");
      router.replace(`/donations/status/${result.donation.public_id}`);
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Donasi belum berhasil dibuat"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-7" noValidate>
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--yn-foreground)]">
          Nominal donasi
        </legend>
        <div className="relative mt-3">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-[var(--yn-muted)]">
            Rp
          </span>
          <input
            id="donation-amount"
            type="number"
            min={1000}
            step={1000}
            inputMode="numeric"
            value={amount === 0 ? "" : amount}
            onChange={(event) => setAmount(Number(event.target.value) || 0)}
            placeholder="50.000"
            className="h-14 w-full rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-background)] pl-12 pr-4 text-lg font-semibold text-[var(--yn-foreground)] outline-none transition placeholder:font-normal placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              aria-pressed={amount === value}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                amount === value
                  ? "border-[var(--yn-foreground)] bg-[var(--yn-foreground)] text-[var(--yn-background)]"
                  : "border-[var(--yn-border)] text-[var(--yn-muted)] hover:border-[var(--yn-accent)] hover:text-[var(--yn-foreground)]"
              }`}
            >
              {formatRupiah(value)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-semibold text-[var(--yn-foreground)]">
          <CreditCard aria-hidden="true" className="size-4 text-[var(--yn-accent-dark)]" />
          Metode pembayaran
        </legend>
        <p className="mt-1 text-xs leading-5 text-[var(--yn-muted)]">
          Instruksi transfer lengkap akan tampil setelah donasi dibuat.
        </p>

        {paymentLoading && paymentMethods.length === 0 ? (
          <p
            role="status"
            className="mt-3 rounded-2xl bg-[var(--yn-surface-muted)] p-4 text-sm text-[var(--yn-muted)]"
          >
            Memuat metode pembayaran…
          </p>
        ) : paymentError && paymentMethods.length === 0 ? (
          <div
            role="alert"
            className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>Metode pembayaran belum dapat dimuat.</p>
            <button
              type="button"
              onClick={() => dispatch(getPaymentMethod())}
              className="mt-2 font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <div
            className="mt-3 grid gap-2 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Metode pembayaran donasi"
          >
            <button
              type="button"
              role="radio"
              aria-checked={paymentMethodId === ""}
              onClick={() => setPaymentMethodId("")}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                paymentMethodId === ""
                  ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]"
                  : "border-[var(--yn-border)] hover:border-[var(--yn-accent)]"
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--yn-surface-muted)] text-[var(--yn-muted)]">
                <CreditCard aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--yn-foreground)]">
                  Pilih nanti
                </span>
                <span className="mt-0.5 block text-xs text-[var(--yn-muted)]">
                  Minta instruksi pengurus
                </span>
              </span>
            </button>

            {paymentMethods.map((method) => {
              const selected = paymentMethodId === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethodId(method.id)}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    selected
                      ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]"
                      : "border-[var(--yn-border)] hover:border-[var(--yn-accent)]"
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                    {method.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={method.image_url}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <CreditCard aria-hidden="true" className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--yn-foreground)]">
                      {method.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--yn-muted)]">
                      {method.account_name}
                    </span>
                  </span>
                  <span
                    className={`size-4 shrink-0 rounded-full border-4 ${
                      selected
                        ? "border-[var(--yn-accent)] bg-white"
                        : "border-[var(--yn-border)]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[var(--yn-foreground)]">
          Privasi donasi
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <CheckboxCard
            checked={isAnonymous}
            onChange={setIsAnonymous}
            icon={<UserRoundX aria-hidden="true" className="size-4" />}
            title="Donasi anonim"
            description="Nama dan nominal disembunyikan dari daftar donatur."
          />
          <CheckboxCard
            checked={isAnonymous ? false : showAmount}
            disabled={isAnonymous}
            onChange={setShowAmount}
            icon={<Eye aria-hidden="true" className="size-4" />}
            title="Tampilkan nominal"
            description="Nominal terlihat pada daftar donatur publik."
          />
        </div>
      </fieldset>

      <label className="block text-sm font-semibold text-[var(--yn-foreground)]">
        <span className="flex items-center gap-2">
          <MessageCircleMore
            aria-hidden="true"
            className="size-4 text-[var(--yn-accent-dark)]"
          />
          Doa atau dukungan
          <span className="font-normal text-[var(--yn-muted)]">(opsional)</span>
        </span>
        <textarea
          id="donation-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Tulis doa atau dukungan untuk program ini…"
          className="mt-3 w-full resize-none rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-background)] px-4 py-3 text-sm font-normal leading-6 text-[var(--yn-foreground)] outline-none transition placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
        />
        <span className="mt-1.5 flex justify-between gap-3 text-xs font-normal text-[var(--yn-muted)]">
          <span>Pesan tampil setelah ditinjau pengurus.</span>
          <span>{message.length}/500</span>
        </span>
      </label>

      <div className="border-t border-[var(--yn-border)] pt-6">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[var(--yn-border)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)] disabled:opacity-50"
            >
              Batal
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isLoading || amount <= 0}
            className="inline-flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--yn-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Membuat donasi…
              </>
            ) : (
              <>
                Lanjutkan {amount > 0 ? `· ${formatRupiah(amount)}` : ""}
                <ArrowRight aria-hidden="true" className="size-4" />
              </>
            )}
          </button>
        </div>
        <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-[var(--yn-muted)]">
          <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          Donasi baru tercatat setelah pembayaran diverifikasi pengurus.
        </p>
      </div>
    </form>
  );
}
