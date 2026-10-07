"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getProducts } from "@/redux/slices/shopSlice";
import { ProductSort } from "@/types/shop";
import { formatRupiah } from "@/utils/currency";
import Link from "next/link";
import { useEffect, useState } from "react";

const sorts: { value: ProductSort; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Termurah" },
  { value: "termahal", label: "Termahal" },
];

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

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getProducts({ sort, page: next }));
  };

  // Jumlah barang, bukan jumlah baris: dua baris varian berbeda yang sama-sama
  // berisi dua potong tetap sepuluh potong di keranjang.
  const cartCount = cart.reduce((total, line) => total + line.qty, 0);

  return (
    <MainLayout>
      <CommonHeader title="Toko" isShowBack={true} isShowTrailing={false} />
      <div className="yn-container bg-yellow-400 p-4">
        <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
          <h1 className="text-lg font-semibold text-black">
            Merchandise resmi
          </h1>
          <p className="mt-1 text-sm text-black">
            Semua produk di sini resmi dari YukNgaji Solo. Pembelian tidak
            berkaitan dengan tiket event, dan tidak pernah menerbitkan atau
            mengubah tiket.
          </p>
          <Link
            href="/shop/orders"
            className="mt-3 inline-block rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black"
          >
            Riwayat pesanan merchandise
          </Link>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {sorts.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={`rounded-full border-2 border-black px-4 py-1 text-sm font-bold ${
                  sort === option.value
                    ? "bg-primary text-white"
                    : "bg-white text-black"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link
            href="/shop/cart"
            className="relative rounded-full border-2 border-black bg-white px-4 py-1 text-sm font-bold text-black"
          >
            Keranjang
            {cartCount > 0 ? (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>

        {error != null ? (
          <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
            {error}
          </div>
        ) : null}

        {products == null && isLoading ? (
          <p className="text-black">Memuat produk…</p>
        ) : products != null && products.length === 0 ? (
          <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-black">
              Belum ada produk yang terbit. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {products?.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="block rounded-xl border-2 border-black bg-yellow-300 p-3 shadow-custom"
              >
                {product.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.cover_image_url}
                    alt={product.name}
                    className="mb-3 h-40 w-full rounded-lg border-2 border-black object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg border-2 border-black bg-yellow-200">
                    <span className="text-sm text-black">Tanpa foto</span>
                  </div>
                )}

                <h2 className="text-base font-semibold text-black">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm font-bold text-black">
                  {product.min_price === product.max_price
                    ? formatRupiah(product.min_price)
                    : `${formatRupiah(product.min_price)} – ${formatRupiah(
                        product.max_price
                      )}`}
                </p>
                <p className="mt-1 text-xs text-black">
                  {product.available > 0
                    ? `Tersedia ${product.available}`
                    : "Stok habis"}
                </p>
              </Link>
            ))}
          </div>
        )}

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="mt-3 w-full rounded-lg border-2 border-black bg-white py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            {isLoading ? "Memuat…" : "Muat produk lain"}
          </button>
        ) : null}
      </div>
      <BottomNavBar />
    </MainLayout>
  );
};

export default ShopPage;
