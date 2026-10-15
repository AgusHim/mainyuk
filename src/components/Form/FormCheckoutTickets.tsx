"use client";

import CheckoutPaymentMethodCard from "@/components/Card/CheckoutPaymentMethodCard";
import CheckoutTicketsCard from "@/components/Card/CheckoutTicketsCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { postOrder, setAuthToUserTicket, setUserTicket } from "@/redux/slices/orderSlice";
import { CreateOrder, Order } from "@/types/order";
import { ValidateField } from "@/utils/Validation/Validation";
import { ArrowRight, Check, LoaderCircle, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldValue = string | boolean;
type FormValues = Record<string, FieldValue>;
type FormErrors = Record<string, string | undefined>;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 text-sm text-[var(--yn-foreground)] outline-none transition placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)] read-only:bg-[var(--yn-surface-muted)] read-only:text-[var(--yn-muted)]";

export const FormCheckoutTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const event = useAppSelector((state) => state.event.event);
  const checkout = useAppSelector((state) => state.order.checkout);
  const paymentMethod = useAppSelector((state) => state.order.payment_method);
  const adminFee = useAppSelector((state) => state.order.admin_fee);
  const isLoadingOrder = useAppSelector((state) => state.order.isLoadingOrder);

  const [formData, setFormData] = useState<FormValues>(() => {
    const initial: FormValues = {};
    checkout.forEach((entry, index) => {
      initial[`${index}_name`] = entry.user_name ?? "";
      initial[`${index}_email`] = entry.user_email ?? "";
      initial[`${index}_gender`] = entry.user_gender ?? "male";
      initial[`${index}_isUseAuth`] = false;
    });
    return initial;
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const ticketSubtotal = checkout.reduce((total, entry) => total + (entry.ticket?.price ?? 0), 0);
  const totalPayment = ticketSubtotal + adminFee;
  const needsPayment = ticketSubtotal > 0;

  function ticketGender(index: number) {
    return checkout[index]?.ticket?.gender_allowed?.toLowerCase() ?? "both";
  }

  function useAccountData(index: number, checked: boolean) {
    const allowed = ticketGender(index);
    const gender = user?.gender?.toLowerCase() ?? "";

    if (checked && gender !== allowed && allowed !== "both") {
      toast.info(`Tiket ini khusus untuk ${allowed === "male" ? "laki-laki" : "perempuan"}.`);
      return;
    }

    const updates: FormValues = {
      [`${index}_isUseAuth`]: checked,
      [`${index}_name`]: checked ? user?.name ?? "" : "",
      [`${index}_email`]: checked ? user?.email ?? "" : "",
      [`${index}_gender`]: checked ? user?.gender?.toLowerCase() ?? "male" : "male",
    };
    setFormData((previous) => ({ ...previous, ...updates }));
    setFormErrors((previous) => ({
      ...previous,
      [`${index}_name`]: undefined,
      [`${index}_email`]: undefined,
      [`${index}_gender`]: undefined,
    }));

    if (checked) {
      dispatch(setAuthToUserTicket({ index, auth: { name: user?.name ?? "", email: user?.email ?? "", gender: gender || "male" } }));
    } else {
      dispatch(setUserTicket({ index, type: "name", value: "" }));
      dispatch(setUserTicket({ index, type: "email", value: "" }));
      dispatch(setUserTicket({ index, type: "gender", value: "male" }));
    }
  }

  function updateField(index: number, field: "name" | "email" | "gender", value: string) {
    const key = `${index}_${field}`;
    const error = ValidateField(field, value, ticketGender(index));
    setFormData((previous) => ({ ...previous, [key]: value }));
    setFormErrors((previous) => ({ ...previous, [key]: error }));
    dispatch(setUserTicket({ index, type: field, value }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    checkout.forEach((_, index) => {
      (["name", "email", "gender"] as const).forEach((field) => {
        const key = `${index}_${field}`;
        nextErrors[key] = ValidateField(field, String(formData[key] ?? ""), ticketGender(index));
      });
    });
    setFormErrors(nextErrors);
    const firstInvalid = Object.entries(nextErrors).find(([, value]) => Boolean(value));
    if (firstInvalid) {
      document.getElementById(firstInvalid[0])?.focus();
      toast.info(firstInvalid[1]);
      return false;
    }
    return true;
  }

  async function handleSubmit(eventSubmit: React.FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;
    if (needsPayment && !paymentMethod) {
      document.getElementById("payment-methods")?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.info("Pilih metode pembayaran untuk melanjutkan.");
      return;
    }
    if (!event?.slug || checkout.length === 0) {
      toast.error("Data checkout tidak lengkap. Pilih tiket kembali.");
      return;
    }

    const body: CreateOrder = {
      donation: 0,
      event_id: event.slug,
      admin_fee: adminFee,
      user_tickets: checkout,
      payment_method_id: paymentMethod?.id ?? "",
    };

    try {
      const result = (await dispatch(postOrder(body)).unwrap()) as Order;
      sessionStorage.removeItem(`event-checkout:${event.slug}`);
      router.replace(`/orders/${result.public_id}`);
    } catch {
      setSubmitError("Pesanan belum berhasil dibuat. Periksa data lalu coba lagi.");
      toast.error("Pesanan belum berhasil dibuat. Periksa data lalu coba lagi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <UserRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--yn-accent)]" />
            <div>
              <h2 className="text-xl font-semibold text-[var(--yn-foreground)]">Pemilik tiket</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--yn-muted)]">Isi data sesuai identitas setiap peserta. Tiket akan dikirim ke email yang tercantum.</p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {checkout.map((entry, index) => {
              const usesAccount = Boolean(formData[`${index}_isUseAuth`]);
              const allowedGender = ticketGender(index);
              return (
                <fieldset key={`${entry.ticket_id}-${index}`} className="rounded-2xl border border-[var(--yn-border)] p-4 sm:p-5">
                  <legend className="px-2 text-sm font-semibold text-[var(--yn-foreground)]">Peserta {index + 1} · {entry.ticket?.name ?? "Tiket event"}</legend>

                  <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl bg-[var(--yn-surface-muted)] p-3 text-sm text-[var(--yn-foreground)]">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${usesAccount ? "border-[var(--yn-accent)] bg-[var(--yn-accent)] text-white" : "border-[var(--yn-border)] bg-[var(--yn-surface)]"}`}>
                      {usesAccount && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
                    </span>
                    <input type="checkbox" checked={usesAccount} onChange={(event) => useAccountData(index, event.target.checked)} className="sr-only" />
                    Gunakan data akun saya
                  </label>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-[var(--yn-foreground)]">
                      Nama lengkap
                      <input id={`${index}_name`} name={`${index}_name`} type="text" autoComplete="name" placeholder="Nama sesuai identitas" value={String(formData[`${index}_name`] ?? "")} onChange={(event) => updateField(index, "name", event.target.value)} readOnly={usesAccount} aria-invalid={Boolean(formErrors[`${index}_name`])} aria-describedby={formErrors[`${index}_name`] ? `${index}_name-error` : undefined} className={inputClass} />
                      {formErrors[`${index}_name`] && <span id={`${index}_name-error`} className="mt-1.5 block text-xs font-medium text-red-600">{formErrors[`${index}_name`]}</span>}
                    </label>

                    <label className="text-sm font-medium text-[var(--yn-foreground)]">
                      Email
                      <input id={`${index}_email`} name={`${index}_email`} type="email" autoComplete="email" inputMode="email" placeholder="nama@email.com" value={String(formData[`${index}_email`] ?? "")} onChange={(event) => updateField(index, "email", event.target.value)} readOnly={usesAccount} aria-invalid={Boolean(formErrors[`${index}_email`])} aria-describedby={formErrors[`${index}_email`] ? `${index}_email-error` : undefined} className={inputClass} />
                      {formErrors[`${index}_email`] && <span id={`${index}_email-error`} className="mt-1.5 block text-xs font-medium text-red-600">{formErrors[`${index}_email`]}</span>}
                    </label>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-[var(--yn-foreground)]">Jenis kelamin</p>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {(["male", "female"] as const).map((gender) => {
                        const selected = formData[`${index}_gender`] === gender;
                        const unavailable = allowedGender !== "both" && allowedGender !== gender;
                        return (
                          <label key={gender} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-sm transition ${selected ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]" : "border-[var(--yn-border)] text-[var(--yn-muted)]"} ${(usesAccount || unavailable) ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[var(--yn-accent)]"}`}>
                            <input id={selected ? `${index}_gender` : undefined} type="radio" name={`${index}_gender`} value={gender} checked={selected} disabled={usesAccount || unavailable} onChange={(event) => updateField(index, "gender", event.target.value)} className="h-4 w-4 accent-[var(--yn-accent)]" />
                            {gender === "male" ? "Laki-laki" : "Perempuan"}
                          </label>
                        );
                      })}
                    </div>
                    {allowedGender !== "both" && <p className="mt-2 text-xs text-[var(--yn-muted)]">Tiket ini khusus untuk {allowedGender === "male" ? "laki-laki" : "perempuan"}.</p>}
                    {formErrors[`${index}_gender`] && <span className="mt-1.5 block text-xs font-medium text-red-600">{formErrors[`${index}_gender`]}</span>}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </section>

        <CheckoutPaymentMethodCard />
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <CheckoutTicketsCard />
        {submitError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submitError}</div>}
        <button type="submit" disabled={isLoadingOrder} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--yn-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60">
          {isLoadingOrder ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Membuat pesanan…</> : <>Konfirmasi pembelian <ArrowRight aria-hidden="true" className="h-4 w-4" /></>}
        </button>
        <p className="flex items-start justify-center gap-2 px-3 text-center text-xs leading-relaxed text-[var(--yn-muted)]"><ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />Data peserta hanya digunakan untuk penerbitan tiket dan informasi event.</p>
      </aside>
    </form>
  );
};
