import Reveal from "./Reveal";

export default function TemanBahagia() {
  return (
    <section id="temanbahagia" className="yn-section border-t border-[#E4E2DA]">
      <div className="yn-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6B5A] md:text-sm">
                #TemanBahagia
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-6 max-w-[16ch] font-semibold text-[#171717]"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                }}
              >
                Hidup lebih seru ketika dijalani bersama.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="yn-text-content mt-8 text-base leading-[1.65] text-[#6F6D66] md:text-lg md:leading-[1.7]">
                YukNgaji Solo hadir sebagai ruang bertemu, belajar, bergerak,
                dan bertumbuh bersama. Bukan sekadar acara yang datang dan
                pergi — tetapi perjalanan yang dijalani bareng teman-teman.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {["Belajar", "Bergerak", "Bertumbuh", "Bersama"].map((word) => (
                  <div
                    key={word}
                    className="flex min-h-[120px] items-end rounded-[24px] bg-[#F0EFE9] p-6 md:min-h-[140px]"
                  >
                    <span className="text-lg font-semibold tracking-tight text-[#171717] md:text-xl">
                      {word}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
