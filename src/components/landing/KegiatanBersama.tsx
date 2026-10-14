"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getInstagramPosts } from "@/redux/slices/instagramSlice";
import { displayImage } from "@/types/instagram";
import Reveal from "./Reveal";

/* Tujuan tombol. "Join Circle YN" menunjuk halaman komunitas yang sama dengan
   tombol di Hero, supaya keduanya tidak bercabang. */
const JOIN_HREF = "/community";
const VIEW_MORE_HREF = "https://www.instagram.com/yukngajisolo/";

/* Instagram SVG glyph */
function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* YouTube SVG glyph */
function YouTubeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
      <polygon points="9.6,8.5 9.6,15.5 16,12" fill="#ffffff" />
    </svg>
  );
}

/* Balon komentar dengan tiga titik di dalamnya, persis seperti di section-4.png */
function CommentBubble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.8C6.5 2.8 2 6.6 2 11.2c0 2.6 1.4 4.9 3.6 6.3-.2 1.3-.9 2.8-2.2 4 1.9.1 4.1-.6 5.6-1.7.9.3 1.9.4 3 .4 5.5 0 10-3.8 10-8.4S17.5 2.8 12 2.8z" />
      <circle cx="8" cy="11.2" r="1.25" fill="#ffffff" />
      <circle cx="12" cy="11.2" r="1.25" fill="#ffffff" />
      <circle cx="16" cy="11.2" r="1.25" fill="#ffffff" />
    </svg>
  );
}

export interface ActivityCardData {
  id: string;
  username: string;
  platform?: "instagram" | "youtube";
  imageUrl: string;
  aspectRatio: string;
  title?: string;
  caption?: string | string[];
  likes?: number | null;
  comments?: number | null;
  permalink?: string;
}

/* 5 kartu showcase default yang persis sama dengan referensi section-4.png */
const DEFAULT_CARDS: ActivityCardData[] = [
  // Kartu 1: Kolom Kiri Atas
  {
    id: "masudizzulmujahid",
    username: "@masudizzulmujahid",
    platform: "instagram",
    imageUrl: "/images/landing/kegiatan/contoh-1.jpg",
    aspectRatio: "aspect-[4/3]",
    likes: 120,
    comments: 16,
    permalink: "https://www.instagram.com/masudizzulmujahid/",
  },
  // Kartu 2: Tengah Atas (Video / Lebar 2 Kolom)
  {
    id: "yukngajisolo-qurban",
    username: "@yukngajisolo",
    platform: "youtube",
    imageUrl: "/images/landing/kegiatan/contoh-2.jpg",
    aspectRatio: "aspect-[16/9]",
    title: "BUKAN QURBAN BIASA",
    likes: 120,
    comments: 16,
    permalink: "https://www.youtube.com/@yukngajisolo",
  },
  // Kartu 3: Kolom Kanan (Kartu Panjang)
  {
    id: "rini-srj",
    username: "@rini._srj",
    platform: "instagram",
    imageUrl: "/images/landing/kegiatan/contoh-3.jpg",
    aspectRatio: "aspect-[4/3.5]",
    caption: [
      "~merakit puzzle kehidupan~",
      "Carilah tempat dimana dirimu diterima apa adanya, dgn lingkungan yg sesuai tujuan hidup🌻",
      "Nyatanya jalan sendirian itu berat, butuh teman utk jalan bareng🍃🍒",
      "",
      "_Jika jiwamu tidak disibukkan dalam kebenaran, nisca...",
    ],
    likes: 120,
    comments: 16,
    permalink: "https://www.instagram.com/rini._srj/",
  },
  // Kartu 4: Tengah Bawah Kiri (Potret)
  {
    id: "muthiah-jasmine",
    username: "@muthiah_jasmine dan @de...",
    platform: "instagram",
    imageUrl: "/images/landing/kegiatan/contoh-4.jpg",
    aspectRatio: "aspect-[3/4]",
    caption:
      "Jangan lelah berisik dan belajar soal Baitul Maqdis ya. Setiap usaha kita, like, atau share kita walau nggak kelihatan pengaruhnya tapi percaya ga percaya itu berimpact besar. Propaganda mereka itu udah mulai turun kepercayaannya di mata publik. Banyak dari mereka di berbagai belahan dunia lain yang mulai mecari fakta dan kebenaran tentang apa yang terjadi...",
    likes: 120,
    comments: 16,
    permalink: "https://www.instagram.com/muthiah_jasmine/",
  },
  // Kartu 5: Tengah Bawah Kanan (Persegi)
  {
    id: "nisaaqma",
    username: "@nisaaqma",
    platform: "instagram",
    imageUrl: "/images/landing/kegiatan/contoh-5.jpg",
    aspectRatio: "aspect-square",
    caption: [
      'Alhamdulillah, pertengahan bulan lalu berkesempatan mengikuti kegiatan "Sisters Day Out" Yuk Ngaji Solo dengan tema belajar mengelola pangan mandiri di rumah bersama Yoso Farm Homestead.',
      "",
      "Banyak ilmu baru tentang pengelolaan limbah rumah tangga, melestarikan dan memberdayakan makhluk hi...",
    ],
    likes: 120,
    comments: 16,
    permalink: "https://www.instagram.com/nisaaqma/",
  },
];

function ActivityCard({
  item,
  isFeatured = false,
}: {
  item: ActivityCardData;
  isFeatured?: boolean;
}) {
  const isYouTube = item.platform === "youtube";

  const cardContent = (
    <article className="group h-full w-full rounded-[24px] bg-white p-4 sm:p-[18px] shadow-[0_16px_36px_-20px_rgba(23,23,23,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(23,23,23,0.24)]">
      {/* Header */}
      <header className="flex items-center justify-between gap-2.5">
        <span className="truncate text-[14.5px] font-semibold text-[#171717]">
          {item.username}
        </span>
        {isYouTube ? (
          <YouTubeGlyph className="h-5 w-6 shrink-0 text-[#171717]" />
        ) : (
          <InstagramGlyph className="h-5 w-5 shrink-0 text-[#171717]" />
        )}
      </header>

      {/* Image */}
      <div
        className={`relative mt-3 w-full overflow-hidden rounded-[16px] bg-[#f0efe9] ${item.aspectRatio}`}
      >
        <Image
          src={item.imageUrl}
          alt={
            item.title ??
            (typeof item.caption === "string"
              ? item.caption.slice(0, 80)
              : item.username)
          }
          fill
          loading="lazy"
          sizes={
            isFeatured
              ? "(min-width: 1024px) 560px, 100vw"
              : "(min-width: 1024px) 270px, (min-width: 640px) 340px, 100vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Title */}
      {item.title && (
        <h3 className="mt-3 text-[14px] font-bold uppercase tracking-tight text-[#171717]">
          {item.title}
        </h3>
      )}

      {/* Caption */}
      {item.caption && (
        <div className="mt-2.5 space-y-1.5 text-[13px] leading-[1.48] text-[#222222]">
          {Array.isArray(item.caption) ? (
            item.caption.map((paragraph, idx) => (
              <p key={idx} className={paragraph === "" ? "h-1.5" : ""}>
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-[13px] leading-[1.48] text-[#222222]">
              {item.caption}
            </p>
          )}
        </div>
      )}

      {/* Counts Row */}
      <div className="mt-3.5 flex items-center gap-4 text-[13px] font-medium text-[#171717]">
        <span className="flex items-center gap-1.5">
          <Heart className="h-[17px] w-[17px] fill-[#f5342f] text-[#f5342f]" />
          <span className="tabular-nums font-semibold">{item.likes ?? 120}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[#8e8e8e]">
          <CommentBubble className="h-[17px] w-[17px]" />
          <span className="tabular-nums font-semibold text-[#171717]">
            {item.comments ?? 16}
          </span>
        </span>
      </div>
    </article>
  );

  if (!item.permalink) return cardContent;

  return (
    <a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      aria-label={`Buka postingan ${item.username}`}
    >
      {cardContent}
    </a>
  );
}

export default function KegiatanBersama() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.instagram.data);
  const error = useAppSelector((state) => state.instagram.error);

  useEffect(() => {
    if (data == null && !error) {
      dispatch(getInstagramPosts());
    }
  }, [dispatch, data, error]);

  // Siapkan data kartu: bila API berhasil mengembalikan data, gunakan data dinamis
  // tersebut; bila belum ada atau gagal koneksi DB, gunakan kartu default dari section-4.png
  const cards = useMemo(() => {
    if (!data || data.length === 0) {
      return DEFAULT_CARDS;
    }
    return DEFAULT_CARDS.map((fallback, idx) => {
      const post = data[idx];
      if (!post) return fallback;
      const src = displayImage(post);
      return {
        id: post.id,
        username: post.username.startsWith("@") ? post.username : `@${post.username}`,
        platform: (post.permalink?.includes("youtube")
          ? "youtube"
          : fallback.platform) as "instagram" | "youtube",
        imageUrl: src || fallback.imageUrl,
        aspectRatio: fallback.aspectRatio,
        title: idx === 1 ? post.caption?.split("\n")[0] || fallback.title : undefined,
        caption: idx === 1 ? undefined : post.caption || fallback.caption,
        likes: post.like_count ?? fallback.likes,
        comments: post.comments_count ?? fallback.comments,
        permalink: post.permalink || fallback.permalink,
      };
    });
  }, [data]);

  const [card1, card2, card3, card4, card5] = cards;

  return (
    <section id="kegiatan" className="yn-section border-t border-[var(--yn-border)]">
      <div className="yn-container">
        <Reveal>
          <h2
            className="mx-auto text-center font-bold text-[#061120]"
            style={{
              fontSize: "clamp(1.75rem, 3.35vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Kegiatan Bersama YN Solo
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 w-full max-w-[1140px] md:mt-14">
          {/* Bento Grid Layout yang presisi dengan section-4.png:
              - Kolom 1 (Kiri): Kartu 1 (@masudizzulmujahid)
              - Kolom 2 & 3 (Tengah): Kartu 2 (@yukngajisolo) membentang di atas 2 kolom,
                kemudian di bawahnya berdampingan Kartu 4 (@muthiah_jasmine) dan Kartu 5 (@nisaaqma)
              - Kolom 4 (Kanan): Kartu 3 (@rini._srj) kartu vertikal panjang
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Kolom 1 (Kiri) */}
            <div className="w-full">
              <Reveal delay={0}>
                <ActivityCard item={card1} />
              </Reveal>
            </div>

            {/* Kolom 2 & 3 (Tengah) */}
            <div className="w-full md:col-span-2 flex flex-col gap-6">
              <Reveal delay={80}>
                <ActivityCard item={card2} isFeatured />
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <Reveal delay={160}>
                  <ActivityCard item={card4} />
                </Reveal>
                <Reveal delay={240}>
                  <ActivityCard item={card5} />
                </Reveal>
              </div>
            </div>

            {/* Kolom 4 (Kanan) */}
            <div className="w-full">
              <Reveal delay={320}>
                <ActivityCard item={card3} />
              </Reveal>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:mt-14">
          <Link
            href={JOIN_HREF}
            className="rounded-full bg-[#061120] px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Join Circle YN
          </Link>
          <a
            href={VIEW_MORE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#d6d6d6] bg-white px-6 py-3.5 text-sm font-bold text-[#061120] transition-colors hover:border-[#061120]"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  );
}
