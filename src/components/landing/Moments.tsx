import Image from "next/image";
import Reveal from "./Reveal";

const PHOTOS = [
  {
    src: "https://i.ibb.co.com/dtcz1tw/teori-of-life-1.png",
    alt: "Peserta kegiatan YukNgaji Solo berfoto bersama",
    className: "col-span-2 row-span-2 rounded-[28px] aspect-square",
    sizes: "(min-width: 768px) 620px, 100vw",
  },
  {
    src: "https://i.ibb.co.com/kQw8pRK/teori-of-life-2.png",
    alt: "Momen tawa dan obrolan di kegiatan komunitas",
    className: "col-span-1 row-span-1 rounded-[24px] aspect-square",
    sizes: "(min-width: 768px) 310px, 50vw",
  },
  {
    src: "https://i.ibb.co.com/9s0bFzN/teori-of-life-3.png",
    alt: "Peserta mengikuti sesi kegiatan YukNgaji Solo",
    className: "col-span-1 row-span-1 rounded-[24px] aspect-square",
    sizes: "(min-width: 768px) 310px, 50vw",
  },
];

export default function Moments() {
  return (
    <section id="momen" className="yn-section bg-[var(--yn-surface-muted)]">
      <div className="yn-container-wide">
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent)] md:text-sm">
                Momen Bahagia
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-6 max-w-[18ch] font-semibold text-[var(--yn-foreground)]"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                }}
              >
                Momen yang kami bagi.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={160}>
              <p className="yn-text-content text-base leading-[1.65] text-[var(--yn-muted)] md:text-lg">
                Bukti bahwa komunitas ini benar-benar hidup — dari kajian,
                jalan santai, sampai tawa di sela kegiatan.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-14 grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {PHOTOS.map((photo) => (
              <div key={photo.src} className={`relative overflow-hidden ${photo.className}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes={photo.sizes}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
