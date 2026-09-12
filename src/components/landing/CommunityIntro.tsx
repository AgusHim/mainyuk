import Image from "next/image";
import Reveal from "./Reveal";

export default function CommunityIntro() {
  return (
    <section className="yn-section bg-[#F0EFE9]">
      <div className="yn-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6B5A] md:text-sm">
                YukNgaji Solo
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-6 max-w-[18ch] font-semibold text-[#171717]"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                }}
              >
                Bukan hanya datang ke event.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="yn-text-content mt-8 text-base leading-[1.65] text-[#6F6D66] md:text-lg md:leading-[1.7]">
                Kami membangun ruang untuk bertemu, belajar, bergerak, dan
                tumbuh bersama. Dari kajian santai, jalan-jalan keliling
                kota, sampai olahraga bareng — semuanya karena satu hal:
                hidup lebih bermakna saat dijalani bersama.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                  <Image
                    src="https://i.ibb.co.com/kQw8pRK/teori-of-life-2.png"
                    alt="Komunitas YukNgaji Solo sedang berkegiatan"
                    fill
                    sizes="(min-width: 1024px) 380px, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-[28px] md:mt-12">
                  <Image
                    src="https://i.ibb.co.com/9s0bFzN/teori-of-life-3.png"
                    alt="Momen ngobrol bersama di kegiatan YukNgaji Solo"
                    fill
                    sizes="(min-width: 1024px) 380px, 50vw"
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
