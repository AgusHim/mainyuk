"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { addToCart, getProductDetail } from "@/redux/slices/shopSlice";
import { VariantView } from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import {
  Check,
  ChevronRight,
  ImageOff,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_QTY = 10;

interface ProductDetailPageProps {
  slug: string;
}

const DetailSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] lg:gap-12">
    <div className="aspect-square animate-pulse rounded-[1.75rem] bg-[var(--yn-surface-muted)]" />
    <div className="space-y-5 py-2">
      <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-12 w-4/5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-7 w-40 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-40 animate-pulse rounded-[1.5rem] bg-[var(--yn-surface-muted)]" />
    </div>
  </div>
);

const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const storedProduct = useAppSelector((state) => state.shop.product);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const user = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.shop.cart);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  const product = storedProduct?.slug === slug ? storedProduct : null;

  useEffect(() => {
    dispatch(getProductDetail(slug));
  }, [dispatch, slug]);

  const variants: VariantView[] = useMemo(
    () => product?.variants ?? [],
    [product]
  );
  const selected = variants.find((variant) => variant.id === variantId) ?? null;
  const cartCount = cart.reduce((total, line) => total + line.qty, 0);

  const gallery = useMemo(() => {
    if (!product) return [];

    const images = [
      ...(product.cover_image_url
        ? [{ id: "cover", image_url: product.cover_image_url }]
        : []),
      ...product.images,
    ];
    return images.filter(
      (image, index) =>
        images.findIndex((candidate) => candidate.image_url === image.image_url) ===
        index
    );
  }, [product]);

  useEffect(() => {
    if (variants.length === 0) {
      setVariantId("");
      return;
    }

    setVariantId((current) => {
      if (
        current !== "" &&
        variants.some((variant) => variant.id === current)
      ) {
        return current;
      }
      return (
        variants.find((variant) => variant.available > 0)?.id ?? variants[0].id
      );
    });
  }, [variants]);

  useEffect(() => {
    setQty(1);
  }, [variantId]);

  useEffect(() => {
    setActiveImage(gallery[0]?.image_url ?? "");
  }, [gallery]);

  const existingQty = selected
    ? cart.find((line) => line.variant_id === selected.id)?.qty ?? 0
    : 0;
  const maxQty = selected
    ? Math.min(
        Math.max(selected.available - existingQty, 0),
        Math.max(MAX_QTY - existingQty, 0)
      )
    : 0;
  const selectedLabel = selected?.label || "Standar";
  const totalPrice = selected ? selected.price * qty : 0;

  useEffect(() => {
    if (maxQty > 0) {
      setQty((current) => Math.min(Math.max(current, 1), maxQty));
    }
  }, [maxQty]);

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/signin?redirectTo=/shop/${slug}`);
      return;
    }
    if (!selected) {
      toast.error("Pilih varian terlebih dahulu");
      return;
    }
    if (maxQty <= 0) {
      toast.error("Jumlah maksimum varian ini sudah ada di keranjang");
      return;
    }

    dispatch(
      addToCart({
        variant_id: selected.id,
        qty: Math.min(qty, maxQty),
        meta: {
          product_name: product?.name ?? "",
          variant_label: selectedLabel,
          slug: product?.slug ?? "",
        },
      })
    );
    toast.success(`${qty} produk ditambahkan ke keranjang`);
  };

  const retry = () => dispatch(getProductDetail(slug));

  return (
    <MainLayout>
      <CommonHeader title="Detail Produk" isShowBack isShowTrailing={false}>
        <Link
          href="/shop/cart"
          aria-label={`Keranjang${cartCount > 0 ? `, ${cartCount} barang` : ""}`}
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] text-[var(--yn-foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--yn-surface-muted)]"
        >
          <ShoppingBag aria-hidden="true" className="size-4" />
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--yn-accent)] px-1 text-[10px] font-bold leading-none text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </Link>
      </CommonHeader>

      <main className="yn-container pb-12 pt-6 md:pb-20 md:pt-9">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-1.5 text-sm text-[var(--yn-muted)]"
        >
          <Link href="/shop" className="transition hover:text-[var(--yn-foreground)]">
            Shop
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span className="truncate text-[var(--yn-foreground)]">
            {product?.name ?? "Detail produk"}
          </span>
        </nav>

        {!product && isLoading ? (
          <DetailSkeleton />
        ) : !product ? (
          <section className="flex min-h-[28rem] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
              <PackageCheck aria-hidden="true" className="size-6" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
              Produk belum dapat ditampilkan
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--yn-muted)]">
              {error
                ? "Terjadi kendala saat mengambil detail produk. Silakan coba lagi."
                : "Produk ini mungkin sudah tidak tersedia atau tautannya berubah."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {error ? (
                <button
                  type="button"
                  onClick={retry}
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--yn-accent-dark)] disabled:opacity-60"
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Coba lagi
                </button>
              ) : null}
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]"
              >
                Kembali ke shop
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-12 xl:gap-16">
            <section aria-label="Galeri produk" className="min-w-0">
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-[var(--yn-border)] bg-[var(--yn-surface-muted)]">
                {activeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-[var(--yn-muted)]">
                    <ImageOff aria-hidden="true" className="size-8" />
                    <span className="text-sm">Foto produk belum tersedia</span>
                  </div>
                )}
                <span
                  className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                    product.available > 0
                      ? "bg-[var(--yn-surface)]/90 text-[var(--yn-foreground)]"
                      : "bg-[var(--yn-foreground)]/80 text-white"
                  }`}
                >
                  {product.available > 0
                    ? `${product.available} tersedia`
                    : "Stok habis"}
                </span>
              </div>

              {gallery.length > 1 ? (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((image, index) => {
                    const isActive = activeImage === image.image_url;
                    return (
                      <button
                        key={`${image.id}-${image.image_url}`}
                        type="button"
                        onClick={() => setActiveImage(image.image_url)}
                        aria-label={`Lihat foto ${index + 1}`}
                        aria-pressed={isActive}
                        className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                          isActive
                            ? "border-[var(--yn-accent)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.image_url}
                          alt=""
                          className="h-full w-full rounded-[0.8rem] object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {product.description ? (
                <div className="mt-8 border-t border-[var(--yn-border)] pt-7 lg:mt-10">
                  <h2 className="text-lg font-semibold text-[var(--yn-foreground)]">
                    Tentang produk
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--yn-muted)] md:text-base">
                    {product.description}
                  </p>
                </div>
              ) : null}
            </section>

            <section className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent-dark)]">
                Merchandise resmi
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[var(--yn-foreground)] md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]">
                {selected
                  ? formatRupiah(selected.price)
                  : product.min_price === product.max_price
                  ? formatRupiah(product.min_price)
                  : `${formatRupiah(product.min_price)} – ${formatRupiah(
                      product.max_price
                    )}`}
              </p>

              <div className="mt-7 rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-semibold text-[var(--yn-foreground)]">
                    Pilih varian
                  </h2>
                  {selected ? (
                    <span className="text-xs text-[var(--yn-muted)]">
                      {selected.available} tersedia
                    </span>
                  ) : null}
                </div>

                {variants.length === 0 ? (
                  <p className="mt-3 rounded-2xl bg-[var(--yn-surface-muted)] p-4 text-sm leading-6 text-[var(--yn-muted)]">
                    Produk ini belum memiliki varian yang dapat dibeli.
                  </p>
                ) : (
                  <div
                    className="mt-3 grid gap-2"
                    role="radiogroup"
                    aria-label="Varian produk"
                  >
                    {variants.map((variant) => {
                      const soldOut = variant.available <= 0;
                      const isActive = variant.id === variantId;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          disabled={soldOut}
                          onClick={() => setVariantId(variant.id)}
                          className={`flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                            isActive
                              ? "border-[var(--yn-accent)] bg-[var(--yn-accent-soft)]"
                              : "border-[var(--yn-border)] hover:border-[var(--yn-accent)]"
                          } ${soldOut ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                                isActive
                                  ? "border-[var(--yn-accent)] bg-[var(--yn-accent)] text-white"
                                  : "border-[var(--yn-border)]"
                              }`}
                            >
                              {isActive ? (
                                <Check aria-hidden="true" className="size-3" />
                              ) : null}
                            </span>
                            <span className="text-sm font-semibold text-[var(--yn-foreground)]">
                              {variant.label || "Standar"}
                            </span>
                          </span>
                          <span className="text-right text-xs text-[var(--yn-muted)]">
                            {formatRupiah(variant.price)}
                            <span className="block">
                              {soldOut ? "Habis" : `${variant.available} tersedia`}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selected && maxQty > 0 ? (
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--yn-border)] pt-5">
                    <div>
                      <p className="text-sm font-semibold text-[var(--yn-foreground)]">
                        Jumlah
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--yn-muted)]">
                        Maksimal {maxQty} lagi
                      </p>
                    </div>
                    <div className="flex items-center rounded-full border border-[var(--yn-border)] bg-[var(--yn-background)] p-1">
                      <button
                        type="button"
                        onClick={() => setQty((value) => Math.max(value - 1, 1))}
                        disabled={qty <= 1}
                        aria-label="Kurangi jumlah"
                        className="flex size-9 items-center justify-center rounded-full text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)] disabled:opacity-30"
                      >
                        <Minus aria-hidden="true" className="size-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold tabular-nums text-[var(--yn-foreground)]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQty((value) => Math.min(value + 1, maxQty))
                        }
                        disabled={qty >= maxQty}
                        aria-label="Tambah jumlah"
                        className="flex size-9 items-center justify-center rounded-full text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)] disabled:opacity-30"
                      >
                        <Plus aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {selected && maxQty <= 0 && selected.available > 0 ? (
                  <p className="mt-5 rounded-2xl bg-[var(--yn-surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--yn-muted)]">
                    Batas pembelian varian ini sudah ada di keranjangmu.
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selected || maxQty <= 0}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--yn-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <ShoppingBag aria-hidden="true" className="size-4" />
                  {!user
                    ? "Masuk untuk belanja"
                    : selected && maxQty > 0
                    ? `Tambah · ${formatRupiah(totalPrice)}`
                    : "Tidak dapat ditambahkan"}
                </button>

                {cartCount > 0 ? (
                  <Link
                    href="/shop/cart"
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--yn-border)] text-sm font-semibold text-[var(--yn-foreground)] transition hover:bg-[var(--yn-surface-muted)]"
                  >
                    Lihat keranjang ({cartCount})
                  </Link>
                ) : null}

                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--yn-muted)]">
                  <PackageCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[var(--yn-accent-dark)]"
                  />
                  Harga dan ketersediaan akan diperiksa kembali saat checkout.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default ProductDetailPage;
