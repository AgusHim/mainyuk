"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getProducts } from "@/redux/slices/shopSlice";
import { formatRupiah } from "@/utils/currency";
import Reveal from "./Reveal";

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  imageUrl: string;
  slug?: string;
  href: string;
}

/* 3 produk default sesuai dengan gambar referensi section-5.png */
const DEFAULT_MERCH: MerchItem[] = [
  {
    id: "merch-1",
    name: "T-Shirt Idea Series Katun Oversize S-2XL",
    price: 169000,
    formattedPrice: "Rp169.000",
    imageUrl: "/images/landing/merch/merch-1.png",
    slug: "t-shirt-idea-series-oversize",
    href: "/shop/t-shirt-idea-series-oversize",
  },
  {
    id: "merch-2",
    name: "T-Shirt Idea Series Katun Oversize S-2XL",
    price: 169000,
    formattedPrice: "Rp169.000",
    imageUrl: "/images/landing/merch/merch-2.png",
    slug: "t-shirt-idea-series-oversize-white",
    href: "/shop/t-shirt-idea-series-oversize",
  },
  {
    id: "merch-3",
    name: "Totebag Yn Lego & Sky Kanvas Navy 47×36cm",
    price: 90000,
    formattedPrice: "Rp90.000",
    imageUrl: "/images/landing/merch/merch-3.png",
    slug: "totebag-yn-lego-sky-kanvas-navy",
    href: "/shop/totebag-yn-lego-sky-kanvas-navy",
  },
];

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <Link
      href={item.href}
      className="group block w-full transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Box Gambar Produk dengan sudut membulat dan latar belakang abu-abu terang */}
      <div className="relative aspect-[421/526] w-full overflow-hidden rounded-[24px] bg-[#f1f1f1] shadow-[0_12px_32px_-16px_rgba(23,23,23,0.12)] transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-16px_rgba(23,23,23,0.18)]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Informasi Produk: Nama & Harga */}
      <div className="mt-4 px-1 text-left">
        <h3 className="line-clamp-2 text-[14.5px] sm:text-[15px] font-medium leading-snug text-[#171717] transition-colors group-hover:text-[#ef7f00]">
          {item.name}
        </h3>
        <p className="mt-1 text-[17px] sm:text-[18px] font-bold tracking-tight text-[#ef7f00]">
          {item.formattedPrice}
        </p>
      </div>
    </Link>
  );
}

export default function LimitedMerch() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.shop.products);
  const error = useAppSelector((state) => state.shop.error);

  // Ambil data produk terbaru dari server (shop_service.go / ListProducts)
  useEffect(() => {
    if (products == null && !error) {
      dispatch(getProducts({ sort: "terbaru", page: 1 }));
    }
  }, [dispatch, products, error]);

  // Siapkan daftar item: jika server menyediakan produk, gunakan data server;
  // jika kosong atau offline, tampilkan 3 produk default sesuai section-5.png
  const merchItems = useMemo<MerchItem[]>(() => {
    if (!products || products.length === 0) {
      return DEFAULT_MERCH;
    }

    return DEFAULT_MERCH.map((fallback, idx) => {
      const prod = products[idx];
      if (!prod) return fallback;

      return {
        id: prod.id,
        name: prod.name,
        price: prod.min_price,
        formattedPrice: formatRupiah(prod.min_price),
        imageUrl: prod.cover_image_url || fallback.imageUrl,
        slug: prod.slug,
        href: `/shop/${prod.slug}`,
      };
    });
  }, [products]);

  return (
    <section id="merchandise" className="yn-section border-t border-[var(--yn-border)]">
      <div className="yn-container">
        {/* Judul Section 5 */}
        <Reveal>
          <h2
            className="mx-auto text-center font-bold text-[#061120]"
            style={{
              fontSize: "clamp(1.75rem, 3.35vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Limited Merch YN Solo
          </h2>
        </Reveal>

        {/* Grid 3 Produk Sesuai Referensi */}
        <div className="mx-auto mt-10 w-full max-w-[1240px] md:mt-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {merchItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 90}>
                <MerchCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
