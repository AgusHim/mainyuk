import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="yn-section bg-[#171717] text-white">
      <div className="yn-container text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 md:text-sm">
            #TemanBahagia
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mx-auto mt-6 max-w-[18ch] font-semibold"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.045em",
            }}
          >
            Cari teman. Temukan makna. Tumbuh bersama.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#event"
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#171717] transition-all duration-200 hover:-translate-y-px hover:bg-[#F0EFE9] sm:w-auto md:text-base"
            >
              Lihat Event
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum, min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-white/10 sm:w-auto md:text-base"
            >
              Chat dengan Admin
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
