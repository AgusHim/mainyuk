"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { addToCart, getProductDetail } from "@/redux/slices/shopSlice";
import { VariantView } from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Batas jumlah per baris keranjang. Angkanya sama dengan CHECK (qty <= 10) di
// shop_order_items; dijaga di sini supaya pembeli tidak pernah menyusun
// keranjang yang pasti ditolak server.
const MAX_QTY = 10;

interface ProductDetailPageProps {
  slug: string;
}

const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.shop.product);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const user = useAppSelector((state) => state.auth.user);
  const [variantId, setVariantId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetail(slug));
    }
  }, [dispatch, slug]);

  const variants: VariantView[] = useMemo(
    () => product?.variants ?? [],
    [product]
  );
  const selected = variants.find((variant) => variant.id === variantId) ?? null;

  // Varian pertama yang masih bisa dijual dipilih otomatis, supaya pembeli
  // tidak perlu menebak varian mana yang ada. Yang habis tetap tampil, hanya
  // tidak bisa dipilih.
  useEffect(() => {
    if (variants.length === 0) {
      setVariantId("");
      return;
    }
    setVariantId((current) => {
      if (current !== "" && variants.some((v) => v.id === current)) {
        return current;
      }
      const firstAvailable = variants.find((v) => v.available > 0);
      return firstAvailable?.id ?? variants[0].id;
    });
  }, [variants]);

  useEffect(() => {
    setQty(1);
  }, [variantId]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.cover_image_url ?? product.images[0]?.image_url ?? "");
    }
  }, [product]);

  const maxQty = selected ? Math.min(selected.available, MAX_QTY) : 0;

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Masuk dulu untuk mulai berbelanja");
      return;
    }
    if (!selected) {
      toast.error("Pilih varian dulu");
      return;
    }
    if (maxQty <= 0) {
      toast.error("Varian ini sedang habis");
      return;
    }
    dispatch(
      addToCart({
        variant_id: selected.id,
        qty: Math.min(qty, maxQty),
        meta: {
          product_name: product?.name ?? "",
          variant_label: selected.label === "" ? "Standar" : selected.label,
          slug: product?.slug ?? "",
        },
      })
    );
    toast.success("Masuk ke keranjang");
  };

  return (
    <MainLayout>
      <CommonHeader
        title="Detail Produk"
        isShowBack={true}
        isShowTrailing={false}
      />
      <div className="yn-container bg-yellow-400 p-4">
        {product == null && isLoading ? (
          <p className="text-black">Memuat produk…</p>
        ) : product == null ? (
          <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-black">
              {error != null ? error : "Produk tidak ditemukan."}
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block font-bold text-black underline"
            >
              Kembali ke toko
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-3 shadow-custom">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-64 w-full rounded-lg border-2 border-black object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-black bg-yellow-200">
                  <span className="text-sm text-black">Tanpa foto</span>
                </div>
              )}

              {product.images.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImage(image.image_url)}
                      className={`shrink-0 rounded-lg border-2 ${
                        activeImage === image.image_url
                          ? "border-primary"
                          : "border-black"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.image_url}
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h1 className="text-lg font-semibold text-black">
                {product.name}
              </h1>

              <p className="mt-2 text-xl font-bold text-black">
                {selected
                  ? formatRupiah(selected.price)
                  : product.min_price === product.max_price
                  ? formatRupiah(product.min_price)
                  : `${formatRupiah(product.min_price)} – ${formatRupiah(
                      product.max_price
                    )}`}
              </p>

              {product.description ? (
                <p className="mt-3 whitespace-pre-line text-sm text-black">
                  {product.description}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h2 className="text-base font-semibold text-black">
                Pilih varian
              </h2>

              {variants.length === 0 ? (
                <p className="mt-2 text-sm text-black">
                  Produk ini belum punya varian, jadi belum bisa dibeli.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {variants.map((variant) => {
                    const soldOut = variant.available <= 0;
                    const isActive = variant.id === variantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={soldOut}
                        onClick={() => setVariantId(variant.id)}
                        className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 text-left ${
                          isActive
                            ? "border-primary bg-yellow-200"
                            : "border-black bg-white"
                        } ${soldOut ? "opacity-50" : ""}`}
                      >
                        <span className="text-sm font-bold text-black">
                          {variant.label === "" ? "Standar" : variant.label}
                        </span>
                        <span className="text-xs text-black">
                          {formatRupiah(variant.price)}
                          {soldOut
                            ? " · habis"
                            : ` · tersedia ${variant.available}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {selected && maxQty > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-bold text-black">Jumlah</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty((value) => Math.max(value - 1, 1))}
                      disabled={qty <= 1}
                      className="h-9 w-9 rounded-lg border-2 border-black bg-white text-lg font-bold text-black disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-bold text-black">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQty((value) => Math.min(value + 1, maxQty))
                      }
                      disabled={qty >= maxQty}
                      className="h-9 w-9 rounded-lg border-2 border-black bg-white text-lg font-bold text-black disabled:opacity-50"
                    >
                      +
                    </button>
                    <span className="text-xs text-black">
                      maksimum {maxQty} per pesanan
                    </span>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selected || maxQty <= 0}
                className="mt-4 w-full rounded-xl border-2 border-black bg-primary py-3 font-bold text-white shadow-custom disabled:opacity-50"
              >
                Masukkan keranjang
              </button>

              <Link
                href="/shop/cart"
                className="mt-2 block w-full rounded-xl border-2 border-black bg-white py-3 text-center font-bold text-black shadow-custom"
              >
                Lihat keranjang
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
