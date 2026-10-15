"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getProducts } from "@/redux/slices/shopSlice";
import { ProductSort } from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import {
  ArrowRight,
  History,
  ImageOff,
  PackageOpen,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const sorts: { value: ProductSort; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga terendah" },
  { value: "termahal", label: "Harga tertinggi" },
];

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)]">
    <div className="aspect-[4/5] animate-pulse bg-[var(--yn-surface-muted)]" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-5 w-4/5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
      <div className="h-4 w-2/5 animate-pulse rounded-full bg-[var(--yn-surface-muted)]" />
    </div>
  </div>
);

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.shop.products);
  const hasMore = useAppSelector((state) => state.shop.productsHasMore);
  const isLoading = useAppSelector((state) => state.shop.loading);
  const error = useAppSelector((state) => state.shop.error);
  const cart = useAppSelector((state) => state.shop.cart);
  const [sort, setSort] = useState<ProductSort>("terbaru");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    dispatch(getProducts({ sort, page: 1 }));
  }, [dispatch, sort]);

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      await dispatch(getProducts({ sort, page: nextPage })).unwrap();
      setPage(nextPage);
    } catch {
      // Error request sudah ditampilkan dari state Redux.
    }
  };

  const retry = () => {
    setPage(1);
    dispatch(getProducts({ sort, page: 1 }));
  };

  const cartCount = cart.reduce((total, line) => total + line.qty, 0);
  const showInitialLoading = products == null && isLoading;

  return (
    <MainLayout>
      <CommonHeader title="Shop" isShowBack isShowTrailing={false}>
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

      <main className="yn-container pb-12 pt-8 md:pb-20 md:pt-14">
        <section className="grid items-end gap-8 border-b border-[var(--yn-border)] pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:pb-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent-dark)]">
              YN Solo Shop
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--yn-foreground)] sm:text-5xl md:text-6xl">
              Bawa semangat baik ke keseharianmu.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--yn-muted)] md:text-lg">
              Temukan merchandise resmi YN Solo, dibuat untuk menemani
              langkah dan cerita baikmu setiap hari.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/shop/orders"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-5 text-sm font-semibold text-[var(--yn-foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--yn-surface-muted)]"
            >
              <History aria-hidden="true" className="size-4" />
              Riwayat pesanan
            </Link>
            <Link
              href="/shop/cart"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--yn-accent-dark)]"
            >
              <ShoppingBag aria-hidden="true" className="size-4" />
              Keranjang{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
          </div>
        </section>

        <section className="pt-8 md:pt-10" aria-labelledby="product-heading">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-muted)]">
                Koleksi
              </p>
              <h2
                id="product-heading"
                className="mt-1 text-2xl font-semibold tracking-tight text-[var(--yn-foreground)]"
              >
                Pilihan merchandise
              </h2>
            </div>

            <div
              className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-end"
              role="group"
              aria-label="Urutkan produk"
            >
              {sorts.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSort(option.value)}
                  aria-pressed={sort === option.value}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${sort === option.value
                    ? "border-[var(--yn-foreground)] bg-[var(--yn-foreground)] text-[var(--yn-background)]"
                    : "border-[var(--yn-border)] bg-[var(--yn-surface)] text-[var(--yn-muted)] hover:border-[var(--yn-foreground)] hover:text-[var(--yn-foreground)]"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error != null ? (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>Produk belum berhasil dimuat. Coba beberapa saat lagi.</p>
              <button
                type="button"
                onClick={retry}
                disabled={isLoading}
                className="inline-flex items-center gap-2 self-start font-semibold text-red-800 disabled:opacity-50 sm:self-auto"
              >
                <RefreshCw aria-hidden="true" className="size-4" />
                Coba lagi
              </button>
            </div>
          ) : null}

          {showInitialLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Memuat produk">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products != null && products.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
                <PackageOpen aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--yn-foreground)]">
                Koleksi sedang disiapkan
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--yn-muted)]">
                Belum ada produk yang terbit. Kembali lagi nanti untuk melihat
                koleksi terbaru.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products?.map((product) => {
                const isSoldOut = product.available <= 0;
                const price =
                  product.min_price === product.max_price
                    ? formatRupiah(product.min_price)
                    : `${formatRupiah(product.min_price)} – ${formatRupiah(
                      product.max_price
                    )}`;

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-[var(--yn-border)] bg-[var(--yn-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--yn-accent)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--yn-surface-muted)]">
                      {product.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.cover_image_url}
                          alt={product.name}
                          className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${isSoldOut ? "grayscale" : ""
                            }`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--yn-muted)]">
                          <ImageOff aria-hidden="true" className="size-7" />
                          <span className="sr-only">Foto produk belum tersedia</span>
                        </div>
                      )}

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${isSoldOut
                          ? "bg-[var(--yn-foreground)]/80 text-white"
                          : "bg-[var(--yn-surface)]/90 text-[var(--yn-foreground)]"
                          }`}
                      >
                        {isSoldOut ? "Stok habis" : `Tersedia ${product.available}`}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold leading-snug tracking-tight text-[var(--yn-foreground)]">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-sm font-semibold text-[var(--yn-accent-dark)]">
                            {price}
                          </p>
                        </div>
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--yn-border)] text-[var(--yn-muted)] transition group-hover:border-[var(--yn-accent)] group-hover:bg-[var(--yn-accent-soft)] group-hover:text-[var(--yn-accent-dark)]">
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {hasMore && (products?.length ?? 0) > 0 ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-6 text-sm font-semibold text-[var(--yn-foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--yn-surface-muted)] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <RefreshCw aria-hidden="true" className="size-4 animate-spin" />
                ) : null}
                {isLoading ? "Memuat produk" : "Lihat lebih banyak"}
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </MainLayout>
  );
};

export default ShopPage;
