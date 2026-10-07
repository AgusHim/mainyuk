"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createDonation } from "@/redux/slices/fundraisingSlice";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { formatRupiah } from "@/utils/currency";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Nominal cepat yang paling sering dipakai. Angka tetap, bukan hasil hitungan,
// supaya tidak ada pembulatan yang membingungkan.
const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

interface FormDonationProps {
  campaignSlug: string;
  onCancel?: () => void;
}

export default function FormDonation({
  campaignSlug,
  onCancel,
}: FormDonationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const paymentMethods = useAppSelector((state) => state.paymentMethod.data);
  const isLoading = useAppSelector((state) => state.fundraising.loading);

  const [amount, setAmount] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAmount, setShowAmount] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  // Token idempotensi dibuat sekali per pemuatan form. Karena nilainya tidak
  // berubah selama form hidup, menekan "Donasi" dua kali hanya menghasilkan
  // satu donasi di server.
  const clientToken = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  useEffect(() => {
    if (paymentMethods.length === 0) {
      dispatch(getPaymentMethod());
    }
  }, [dispatch, paymentMethods.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (amount <= 0) {
      toast.error("Nominal donasi belum diisi");
      return;
    }

    try {
      const result = await dispatch(
        createDonation({
          campaign_slug: campaignSlug,
          amount,
          is_anonymous: isAnonymous,
          // Anonim menyembunyikan nama DAN nominal sekaligus; server juga
          // memaksanya, ini hanya supaya tampilan sesuai.
          show_amount: isAnonymous ? false : showAmount,
          message: message.trim() === "" ? null : message.trim(),
          payment_method_id: paymentMethodId === "" ? null : paymentMethodId,
          client_token: clientToken,
        })
      ).unwrap();

      toast.success("Donasi dibuat. Silakan lanjutkan transfer.");
      router.replace(`/donations/status/${result.donation.public_id}`);
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Gagal membuat donasi, coba lagi"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label htmlFor="donation-amount" className="text-black">
          Nominal donasi
        </Label>
        <Input
          id="donation-amount"
          type="number"
          min={1000}
          step={1000}
          value={amount === 0 ? "" : amount}
          onChange={(event) => setAmount(Number(event.target.value) || 0)}
          placeholder="50000"
          className="mt-1 border-2 border-black bg-white text-black"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              className={`rounded-full border-2 border-black px-3 py-1 text-xs font-semibold text-black ${
                amount === value ? "bg-primary" : "bg-white"
              }`}
            >
              {formatRupiah(value)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="donation-payment-method" className="text-black">
          Metode pembayaran
        </Label>
        <select
          id="donation-payment-method"
          value={paymentMethodId}
          onChange={(event) => setPaymentMethodId(event.target.value)}
          className="mt-1 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-black"
        >
          <option value="">Pilih nanti</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name} — {method.account_number}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm text-black">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
            className="h-4 w-4 border-2 border-black"
          />
          Donasi sebagai anonim (nama dan nominal disembunyikan)
        </label>
        <label
          className={`flex items-center gap-2 text-sm ${
            isAnonymous ? "text-black/50" : "text-black"
          }`}
        >
          <input
            type="checkbox"
            checked={isAnonymous ? false : showAmount}
            disabled={isAnonymous}
            onChange={(event) => setShowAmount(event.target.checked)}
            className="h-4 w-4 border-2 border-black"
          />
          Tampilkan nominal di daftar donatur
        </label>
      </div>

      <div>
        <Label htmlFor="donation-message" className="text-black">
          Pesan (opsional)
        </Label>
        <textarea
          id="donation-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Tulis doa atau dukungan…"
          className="mt-1 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-black"
        />
        <p className="mt-1 text-xs text-black">
          Pesan tampil setelah diperiksa pengurus.
        </p>
      </div>

      <div className="flex gap-2">
        {onCancel ? (
          <Button
            type="button"
            onClick={onCancel}
            className="w-full border-2 border-black bg-white text-black"
          >
            Batal
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full border-2 border-black bg-primary text-black"
          style={{ boxShadow: "0px 5px 0px 0px #000000" }}
        >
          {isLoading ? "Memproses…" : "Donasi"}
        </Button>
      </div>
    </form>
  );
}
