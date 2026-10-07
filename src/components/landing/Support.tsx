import Reveal from "./Reveal";

export default function Support() {
  return (
    <section className="yn-section border-t border-[var(--yn-border)]">
      <div className="yn-container">
        <div className="rounded-[32px] bg-[var(--yn-surface)] p-8 md:p-16">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent)] md:text-sm">
                  Dukung Gerakan Ini
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h2
                  className="mt-6 max-w-[18ch] font-semibold text-[var(--yn-foreground)]"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Setiap kegiatan tumbuh karena ada teman-teman yang ikut mendukung.
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="yn-text-content mt-6 text-base leading-[1.65] text-[var(--yn-muted)]">
                  Dukunganmu membantu kegiatan komunitas tetap berjalan —
                  terbuka, transparan, dan tepat sasaran.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:pl-8">
              <Reveal delay={200}>
                <a
                  href="/donations"
                  className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--yn-accent)] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[var(--yn-accent-dark)] md:text-base"
                >
                  Dukung YukNgaji Solo
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
