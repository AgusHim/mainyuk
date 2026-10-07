"use client";
import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import {
  cartLines,
  createShopOrder,
  removeFromCart,
  updateCartQty,
} from "@/redux/slices/shopSlice";
import { FulfillmentMethod } from "@/types/shop";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

// Batas per baris, sama dengan CHECK (qty <= 10) di shop_order_items.
const MAX_QTY = 10;

const ShopCartPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector((state) => state.shop.cart);
  const cartMeta = useAppSelector((state) => state.shop.cartMeta);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const methods = useAppSelector((state) => state.paymentMethod.data);

  const [method, setMethod] = useState<FulfillmentMethod>("pickup");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");

  useEffect(() => {
    if (methods.length === 0) {
      dispatch(getPaymentMethod());
    }
  }, [dispatch, methods.length]);

  const isShipping = method === "shipping";

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    if (recipientName.trim() === "") {
      toast.error("Nama penerima wajib diisi");
      return;
    }
    if (isShipping && recipientPhone.trim() === "") {
      toast.error("Nomor telepon penerima wajib diisi");
      return;
    }
    if (isShipping && recipientAddress.trim() === "") {
      toast.error("Alamat pengiriman wajib diisi");
      return;
    }

    // Payload dibangun lewat `cartLines`, sehingga hanya id varian dan jumlah
    // yang berangkat — tidak ada harga maupun nama yang ikut.
    dispatch(
      createShopOrder({
        items: cartLines(cart),
        fulfillment_method: method,
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        recipient_address: isShipping ? recipientAddress.trim() : "",
        payment_method_id: paymentMethodId === "" ? null : paymentMethodId,
      })
    )
      .unwrap()
      .then((order) => {
        toast.success("Pesanan dibuat. Selesaikan pembayarannya.");
        router.push(`/shop/orders/${order.public_id}`);
      })
      .catch(() => {
        // Interceptor api sudah menampilkan pesan galat dari server.
      });
  };

  return (
    <RequiredAuthLayout redirectTo={"/shop/cart"}>
      <MainLayout>
        <CommonHeader
          title="Keranjang"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          {error != null ? (
            <div
              role="alert"
              className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
            >
              <span>{error}</span>
            </div>
          ) : null}
          {cart.length === 0 ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <p className="text-black">Keranjang masih kosong.</p>
              <Link
                href="/shop"
                className="mt-3 inline-block font-bold text-black underline"
              >
                Belanja dulu
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-base font-semibold text-black">
                  Isi keranjang
                </h2>
                <div className="mt-3 grid gap-3">
                  {cart.map((line) => {
                    const meta = cartMeta[line.variant_id];
                    return (
                      <div
                        key={line.variant_id}
                        className="rounded-lg border-2 border-black bg-yellow-200 p-3"
                      >
                        <p className="text-sm font-bold text-black">
                          {meta?.product_name || "Produk"}
                        </p>
                        <p className="text-xs text-black">
                          {meta?.variant_label || "Varian"}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateCartQty({
                                    variant_id: line.variant_id,
                                    qty: line.qty - 1,
                                  })
                                )
                              }
                              className="h-8 w-8 rounded-lg border-2 border-black bg-white font-bold text-black"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-bold text-black">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              disabled={line.qty >= MAX_QTY}
                              onClick={() =>
                                dispatch(
                                  updateCartQty({
                                    variant_id: line.variant_id,
                                    qty: line.qty + 1,
                                  })
                                )
                              }
                              className="h-8 w-8 rounded-lg border-2 border-black bg-white font-bold text-black disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(line.variant_id))}
                            className="text-xs font-bold text-danger underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-black">
                  Harga dan ketersediaan dihitung ulang server saat checkout.
                  Bila stok tidak lagi cukup, pesanan ditolak dan tidak ada yang
                  ditahan.
                </p>
              </div>

              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-base font-semibold text-black">
                  Cara menerima
                </h2>
                <div className="mt-3 flex gap-2">
                  {(["pickup", "shipping"] as FulfillmentMethod[]).map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMethod(option)}
                        className={`rounded-full border-2 border-black px-4 py-1 text-sm font-bold ${
                          method === option
                            ? "bg-primary text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {option === "pickup" ? "Ambil sendiri" : "Dikirim"}
                      </button>
                    )
                  )}
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-bold text-black">
                      Nama penerima
                    </span>
                    <input
                      value={recipientName}
                      onChange={(event) => setRecipientName(event.target.value)}
                      className="rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-black"
                      placeholder="Nama lengkap"
                    />
                  </label>

                  {isShipping ? (
                    <>
                      <label className="grid gap-1">
                        <span className="text-sm font-bold text-black">
                          Nomor telepon penerima
                        </span>
                        <input
                          value={recipientPhone}
                          onChange={(event) =>
                            setRecipientPhone(event.target.value)
                          }
                          className="rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-black"
                          placeholder="08xxxxxxxxxx"
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-bold text-black">
                          Alamat pengiriman
                        </span>
                        <textarea
                          value={recipientAddress}
                          onChange={(event) =>
                            setRecipientAddress(event.target.value)
                          }
                          rows={3}
                          className="rounded-lg border-2 border-black bg-white px-3 py-2 text-sm text-black"
                          placeholder="Alamat lengkap"
                        />
                      </label>
                      <p className="text-xs text-black">
                        Ongkos kirim belum termasuk. Pengurus mengisinya setelah
                        memeriksa alamat, dan total akhir tampil di halaman
                        pesanan sebelum Anda transfer.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-black">
                      Barang diambil di lokasi yang pengurus sampaikan setelah
                      pembayaran dikonfirmasi.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <h2 className="text-base font-semibold text-black">
                  Metode pembayaran
                </h2>
                {methods.length === 0 ? (
                  <p className="mt-2 text-sm text-black">
                    Belum ada metode pembayaran yang aktif. Hubungi pengurus.
                  </p>
                ) : (
                  <div className="mt-3 grid gap-2">
                    {methods.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethodId(option.id)}
                        className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 text-left ${
                          paymentMethodId === option.id
                            ? "border-primary bg-yellow-200"
                            : "border-black bg-white"
                        }`}
                      >
                        <span className="text-sm font-bold text-black">
                          {option.name}
                        </span>
                        <span className="text-xs text-black">
                          {option.account_name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full rounded-xl border-2 border-black bg-primary py-3 font-bold text-white shadow-custom disabled:opacity-50"
              >
                {isLoading ? "Memproses…" : "Checkout"}
              </button>
            </div>
          )}
        </div>
        <BottomNavBar />
      </MainLayout>
    </RequiredAuthLayout>
  );
};

export default ShopCartPage;
