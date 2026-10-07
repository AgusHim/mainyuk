"use client";
import { Charge, DonationView } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import QRCode from "qrcode.react";
import { toast } from "sonner";

interface DonationPaymentCardProps {
  donation: DonationView;
  charge?: Charge | null;
}

const DonationPaymentCard = ({
  donation,
  charge,
}: DonationPaymentCardProps) => {
  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.info("Berhasil copy"))
      .catch(() => toast.error("Gagal copy"));
  };

  const instructions = charge?.instructions ?? [];

  return (
    <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
      <h2 className="text-lg font-semibold text-black">
        Lakukan transfer ke rekening berikut
      </h2>

      <div className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3">
        <p className="text-sm text-black">Nominal transfer</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-xl font-bold text-black">
            {formatRupiah(donation.amount)}
          </p>
          <button
            type="button"
            onClick={() => handleCopy(`${donation.amount}`)}
            className="rounded border border-primary px-2 py-1 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Salin
          </button>
        </div>
        <p className="mt-2 text-xs text-black">
          Transfer harus <span className="font-bold">tepat sejumlah itu</span>.
          Nominal yang tidak sama tidak dapat diverifikasi pengurus.
        </p>
      </div>

      {instructions.length === 0 ? (
        <p className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
          Metode pembayaran belum dipilih. Hubungi pengurus untuk mendapatkan
          nomor rekening tujuan.
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {instructions.map((instruction) => {
            const isQris = instruction.type?.toLowerCase() === "qris";
            return (
              <div
                key={instruction.method_id}
                className="rounded-lg border-2 border-black bg-yellow-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  {instruction.image_url ? (
                    <img
                      src={instruction.image_url}
                      alt={instruction.name}
                      width={96}
                      height={32}
                      className="object-scale-down"
                    />
                  ) : null}
                  <div className="flex-1">
                    <p className="text-lg font-bold text-black">
                      {instruction.name}
                    </p>
                    <p className="text-sm text-black">
                      {instruction.account_name}
                    </p>
                  </div>
                </div>

                {isQris ? (
                  <div className="my-3 flex justify-center rounded-lg bg-white p-3">
                    <QRCode value={instruction.account_number} size={200} />
                  </div>
                ) : (
                  <div className="my-3 flex items-center justify-between gap-2 rounded-lg bg-yellow-300 p-3">
                    <p className="text-xl font-bold text-black">
                      {instruction.account_number}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(instruction.account_number)}
                      className="rounded border border-primary px-2 py-1 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                    >
                      Salin
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 border-t border-black pt-4">
        <p className="text-sm text-black">
          Sudah transfer? Sampaikan bukti dan referensi transfer ke pengurus
          lewat kanal yang biasa dipakai. Setelah diperiksa, status donasi di
          halaman ini berubah menjadi <span className="font-bold">terkonfirmasi</span>.
        </p>
      </div>
    </div>
  );
};

export default DonationPaymentCard;
