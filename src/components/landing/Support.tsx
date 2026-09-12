import Reveal from "./Reveal";

export default function Support() {
  return (
    <section className="yn-section border-t border-[#E4E2DA]">
      <div className="yn-container">
        <div className="rounded-[32px] bg-white p-8 md:p-16">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6B5A] md:text-sm">
                  Dukung Gerakan Ini
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h2
                  className="mt-6 max-w-[18ch] font-semibold text-[#171717]"
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
                <p className="yn-text-content mt-6 text-base leading-[1.65] text-[#6F6D66]">
                  Dukunganmu membantu kegiatan komunitas tetap berjalan —
                  terbuka, transparan, dan tepat sasaran.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:pl-8">
              <Reveal delay={200}>
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, Saya ingin support dakwah YN Solo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#1F6B5A] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#174F43] md:text-base"
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
