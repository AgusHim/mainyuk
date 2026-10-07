"use client";
import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  cancelShopOrder,
  getMyShopOrder,
  submitShopOrderProof,
} from "@/redux/slices/shopSlice";
import {
  fulfillmentMethodLabel,
  fulfillmentStatusLabel,
  paymentStatusLabel,
} from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import { formatStrToDateTime } from "@/utils/convert";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

interface ShopOrderDetailPageProps {
  publicId: string;
}

const ShopOrderDetailPage = ({ publicId }: ShopOrderDetailPageProps) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.shop.order);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const [proofUrl, setProofUrl] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (publicId) {
      dispatch(getMyShopOrder(publicId));
    }
  }, [dispatch, publicId]);

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.info("Berhasil copy"))
      .catch(() => toast.error("Gagal copy"));
  };

  const handleSubmitProof = () => {
    if (proofUrl.trim() === "") {
      toast.error("Tautan bukti transfer wajib diisi");
      return;
    }
    if (reference.trim() === "") {
      toast.error("Referensi transfer wajib diisi");
      return;
    }
    dispatch(
      submitShopOrderProof({
        publicId,
        data: { proof_url: proofUrl.trim(), payment_reference: reference.trim() },
      })
    )
      .unwrap()
      .then(() => {
        setProofUrl("");
        setReference("");
        toast.success("Bukti terkirim. Menunggu pemeriksaan pengurus.");
      })
      .catch(() => {
        // Interceptor api sudah menampilkan pesan galat dari server.
      });
  };

  const handleCancel = () => {
    dispatch(cancelShopOrder(publicId))
      .unwrap()
      .then(() => toast.success("Pesanan dibatalkan"))
      .catch(() => {
        // Interceptor api sudah menampilkan pesan galat dari server.
      });
  };

  const isPending = order?.payment_status === "pending";

  return (
    <RequiredAuthLayout redirectTo={`/shop/orders/${publicId}`}>
      <MainLayout>
        <CommonHeader
          title="Detail Pesanan"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          {error != null ? (
            <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
              {error}
            </div>
          ) : null}

          {order == null && isLoading ? (
            <p className="text-black">Memuat pesanan…</p>
          ) : order == null ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">Pesanan tidak ditemukan.</p>
              <Link
                href="/shop/orders"
                className="mt-3 inline-block font-bold text-black underline"
              >
                Kembali ke riwayat pesanan
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <p className="text-sm text-black">Nomor pesanan</p>
                <p className="text-lg font-semibold text-black">
                  {order.public_id}
                </p>
                <p className="mt-1 text-xs text-black">
                  Dibuat{" "}
                  {formatStrToDateTime(order.created_at, "dd MMM yyyy HH:mm")}
                </p>

                {/* Dua status ditampilkan terpisah: uang dan barang bergerak
                    dengan kecepatan berbeda, dan menggabungkannya membuat
                    "sudah dibayar tetapi belum dikirim" tak dapat dinyatakan. */}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border-2 border-black bg-yellow-200 p-3">
                    <p className="text-xs text-black">Status pembayaran</p>
                    <p className="text-sm font-bold text-black">
                      {paymentStatusLabel(order.payment_status)}
                    </p>
                  </div>
                  <div className="rounded-lg border-2 border-black bg-yellow-200 p-3">
                    <p className="text-xs text-black">Status pemenuhan</p>
                    <p className="text-sm font-bold text-black">
                      {fulfillmentStatusLabel(order.fulfillment_status)}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-xs text-black">
                  Cara menerima: {fulfillmentMethodLabel(order.fulfillment_method)}
                </p>

                {order.decision_reason ? (
                  <p className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
                    Catatan pengurus: {order.decision_reason}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-base font-semibold text-black">
                  Rincian barang
                </h2>
                <div className="mt-3 grid gap-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-lg border-2 border-black bg-yellow-200 p-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-black">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-black">
                          {item.variant_label || "Standar"} · {item.qty} ×{" "}
                          {formatRupiah(item.unit_price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-black">
                        {formatRupiah(item.unit_price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <dl className="mt-3 grid gap-1 text-sm text-black">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{formatRupiah(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Ongkos kirim</dt>
                    <dd>
                      {order.fulfillment_method === "shipping"
                        ? formatRupiah(order.shipping_cost)
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-black pt-1 font-bold">
                    <dt>Total</dt>
                    <dd>{formatRupiah(order.total)}</dd>
                  </div>
                </dl>

                {order.fulfillment_method === "shipping" ? (
                  <div className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-xs text-black">
                    <p>
                      Penerima: {order.recipient_name} · {order.recipient_phone}
                    </p>
                    {order.recipient_address ? (
                      <p className="mt-1">Alamat: {order.recipient_address}</p>
                    ) : null}
                    <p className="mt-1">
                      Nomor resi: {order.tracking_number || "belum tersedia"}
                    </p>
                  </div>
                ) : null}
              </div>

              {isPending ? (
                <>
                  <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                    <h2 className="text-base font-semibold text-black">
                      Transfer ke rekening berikut
                    </h2>

                    <div className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3">
                      <p className="text-sm text-black">Nominal transfer</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="text-xl font-bold text-black">
                          {formatRupiah(order.total)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${order.total}`)}
                          className="rounded border border-primary px-2 py-1 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                        >
                          Salin
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-black">
                        Transfer harus{" "}
                        <span className="font-bold">tepat sejumlah itu</span>.
                        Nominal yang tidak sama tidak dapat diverifikasi
                        pengurus.
                      </p>
                    </div>

                    {(order.charge?.instructions ?? []).length === 0 ? (
                      <p className="mt-3 rounded-lg border-2 border-black bg-yellow-200 p-3 text-sm text-black">
                        Metode pembayaran belum dipilih. Hubungi pengurus untuk
                        mendapatkan nomor rekening tujuan.
                      </p>
                    ) : (
                      <div className="mt-3 grid gap-2">
                        {order.charge?.instructions?.map((instruction) => (
                          <div
                            key={instruction.method_id}
                            className="rounded-lg border-2 border-black bg-yellow-200 p-3"
                          >
                            <p className="text-sm font-bold text-black">
                              {instruction.name}
                            </p>
                            <p className="text-xs text-black">
                              {instruction.account_name}
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <p className="text-base font-bold text-black">
                                {instruction.account_number}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(instruction.account_number)
                                }
                                className="rounded border border-primary px-2 py-1 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                              >
                                Salin
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-xs text-black">
                      Batas waktu pembayaran{" "}
                      {formatStrToDateTime(
                        order.expires_at,
                        "dd MMM yyyy HH:mm"
                      )}
                      . Setelah lewat, stok yang ditahan dilepas dan pesanan
                      dibatalkan otomatis.
                    </p>
                  </div>

                  <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                    <h2 className="text-base font-semibold text-black">
                      Kirim bukti transfer
                    </h2>
                    <p className="mt-1 text-xs text-black">
                      Aplikasi ini belum menerima unggahan berkas. Simpan bukti
                      transfer Anda di layanan penyimpanan, lalu tempelkan
                      tautannya di sini.
                    </p>

                    <div className="mt-3 grid gap-3">
                      <label className="grid gap-1">
                        <span className="text-sm font-bold text-black">
                          Tautan bukti transfer
                        </span>
                        <input
                          value={proofUrl}
                          onChange={(event) => setProofUrl(event.target.value)}
                          className="rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-black"
                          placeholder="https://…"
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-bold text-black">
                          Referensi transfer
                        </span>
                        <input
                          value={reference}
                          onChange={(event) => setReference(event.target.value)}
                          className="rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-black"
                          placeholder="Nomor referensi / nama pengirim"
                        />
                      </label>
                    </div>

                    {order.proof_url ? (
                      <p className="mt-3 text-xs text-black">
                        Bukti terakhir yang tersimpan:{" "}
                        <a
                          href={order.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline"
                        >
                          {order.proof_url}
                        </a>
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleSubmitProof}
                      disabled={isLoading}
                      className="mt-3 w-full rounded-xl border-2 border-black bg-primary py-3 font-bold text-white shadow-custom disabled:opacity-50"
                    >
                      {isLoading ? "Mengirim…" : "Kirim bukti"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="mt-2 w-full rounded-xl border-2 border-black bg-white py-3 font-bold text-danger shadow-custom disabled:opacity-50"
                    >
                      Batalkan pesanan
                    </button>
                    <p className="mt-2 text-xs text-black">
                      Membatalkan melepas stok yang ditahan. Setelah pembayaran
                      dikonfirmasi, pembatalan tidak bisa dilakukan sendiri —
                      hubungi pengurus untuk pengembalian dana.
                    </p>
                  </div>
                </>
              ) : null}

              {order.payment_status === "paid" ? (
                <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <p className="text-black">
                    Pembayaran sudah terverifikasi.
                    {order.rewarded_xp > 0
                      ? ` Anda mendapat ${order.rewarded_xp} XP.`
                      : ""}
                  </p>
                </div>
              ) : null}

              {order.payment_status === "rejected" ? (
                <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <p className="text-black">
                    Pembayaran ditolak. Stok sudah dikembalikan ke toko.
                  </p>
                </div>
              ) : null}

              {order.payment_status === "refunded" ? (
                <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <p className="text-black">
                    Dana pesanan ini sudah dikembalikan.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <BottomNavBar />
      </MainLayout>
    </RequiredAuthLayout>
  );
};

export default ShopOrderDetailPage;
