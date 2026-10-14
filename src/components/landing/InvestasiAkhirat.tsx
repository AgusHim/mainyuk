"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function InvestasiAkhirat() {
  return (
    <section
      id="donasi"
      className="relative w-full overflow-hidden bg-[#000a18] py-16 sm:py-20 md:py-24 lg:py-28"
    >
      {/* Background radial glow halus untuk kedalaman atmosfer */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(6,182,212,0.06),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full">
        {/* Judul Utama 2 Baris Sesuai Referensi section-6.png */}
        <div className="yn-container mb-8 text-center sm:mb-12 md:mb-16">
          <Reveal>
            <h2
              className="mx-auto text-center font-bold text-white"
              style={{
                fontSize: "clamp(1.75rem, 3.8vw, 3.5rem)",
                lineHeight: 1.16,
                letterSpacing: "-0.03em",
              }}
            >
              Mari Berinvestasi Untuk Akhirat Dengan
              <br />
              Cara Mendukung Aktivitas YN Solo
            </h2>
          </Reveal>
        </div>

        {/* Visual Pita Panorama Melengkung dengan Kartu QR di Tengah */}
        <div className="relative mx-auto w-full max-w-[1440px] px-3 sm:px-6">
          <Reveal delay={120}>
            <div className="relative aspect-[2880/1000] w-full overflow-hidden rounded-[20px] sm:rounded-[28px]">
              <Image
                src="/images/landing/investasi/ribbon-full.png"
                alt="Mari Berinvestasi Untuk Akhirat Dengan Cara Mendukung Aktivitas YN Solo"
                fill
                priority
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="object-cover"
              />

              {/* Area Interaktif Hotspot di atas Kartu QRIS di Tengah */}
              <Link
                href="/donations"
                aria-label="Buka Halaman Donasi Dakwah"
                className="group absolute left-1/2 top-1/2 aspect-[440/500] w-[18%] min-w-[110px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[22px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.45)] focus:outline-none focus:ring-4 focus:ring-amber-400/60"
              />
            </div>
          </Reveal>

          {/* Kartu Khusus Mobile agar QR Code dan Tombol Tetap Jelas & Mudah Ditekan */}
          <div className="mt-8 flex flex-col items-center px-4 sm:hidden">
            <Reveal delay={180}>
              <Link
                href="/donations"
                className="group relative flex flex-col items-center overflow-hidden rounded-[24px] bg-gradient-to-br from-cyan-400 via-sky-500 to-amber-500 p-[2.5px] shadow-[0_16px_40px_-10px_rgba(245,158,11,0.35)] transition-transform active:scale-95"
              >
                <div className="flex flex-col items-center rounded-[22px] bg-white p-5 text-center">
                  <div className="relative h-44 w-40">
                    <Image
                      src="/images/landing/investasi/qr-card.png"
                      alt="Donasi Dakwah"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
