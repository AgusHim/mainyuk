import Image from "next/image";
import Reveal from "./Reveal";

const HERO_PHOTOS = [
  "https://i.ibb.co.com/dtcz1tw/teori-of-life-1.png",
  "https://i.ibb.co.com/kQw8pRK/teori-of-life-2.png",
  "https://i.ibb.co.com/9s0bFzN/teori-of-life-3.png",
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: "clamp(48px, 8vw, 96px)", paddingBottom: "clamp(72px, 10vw, 160px)" }}
    >
      <div className="yn-container">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent)] md:text-sm">
                YukNgaji Solo
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1
                className="max-w-[13ch] font-semibold text-[var(--yn-foreground)]"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 6rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                }}
              >
                Teman untuk tumbuh dan bahagia bersama.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="yn-text-content mt-8 text-base leading-[1.65] text-[var(--yn-muted)] md:text-lg md:leading-[1.7]">
                Ruang bertemu, belajar, bergerak, dan bertumbuh untuk pemuda
                di Solo dan sekitarnya. Datang sendiri, pulang bareng
                teman-teman baru.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#event"
                  className="flex min-h-[44px] items-center rounded-full bg-[var(--yn-accent)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[var(--yn-accent-dark)] md:text-base"
                >
                  Lihat Event
                </a>
                <a
                  href="#temanbahagia"
                  className="flex min-h-[44px] items-center rounded-full border border-[var(--yn-border)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--yn-foreground)] transition-all duration-200 hover:-translate-y-px hover:bg-[var(--yn-surface)] md:text-base"
                >
                  Kenal Lebih Dekat
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-8 text-sm text-[var(--yn-muted)]">
                Komunitas dakwah pemuda Surakarta&nbsp;
                <span className="font-medium text-[var(--yn-accent)]">#TemanBahagia</span>
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[24px]">
                  <Image
                    src={HERO_PHOTOS[0]}
                    alt="Kebersamaan komunitas YukNgaji Solo"
                    fill
                    priority
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-[24px]">
                  <Image
                    src={HERO_PHOTOS[1]}
                    alt="Aktivitas YukNgaji Solo bersama teman-teman"
                    fill
                    sizes="(min-width: 1024px) 230px, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-[24px]">
                  <Image
                    src={HERO_PHOTOS[2]}
                    alt="Momen kebersamaan pemuda YukNgaji Solo"
                    fill
                    sizes="(min-width: 1024px) 230px, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
