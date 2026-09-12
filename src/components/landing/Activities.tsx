import Reveal from "./Reveal";

const ACTIVITIES = [
  {
    number: "01",
    title: "Walking Tour",
    description:
      "Bergerak, ngobrol, dan menikmati kota Solo bersama teman-teman baru.",
    href: "/walking-tour",
  },
  {
    number: "02",
    title: "Fun Sport",
    description: "Olahraga santai yang membangun kebersamaan dan semangat.",
    href: "https://www.instagram.com/solofunsport/",
  },
  {
    number: "03",
    title: "Event Komunitas",
    description: "Ruang belajar, berbagi cerita, dan bertemu dengan banyak teman.",
    href: "/events",
  },
];

export default function Activities() {
  return (
    <section id="aktivitas" className="yn-section border-t border-[#E4E2DA]">
      <div className="yn-container">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6B5A] md:text-sm">
            Aktivitas
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-6 max-w-[20ch] font-semibold text-[#171717]"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.045em",
            }}
          >
            Tempat kami bertemu dan bergerak.
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-[#E4E2DA] border-t border-[#E4E2DA] md:mt-20">
          {ACTIVITIES.map((activity, index) => (
            <Reveal key={activity.number} delay={index * 100}>
              <a
                href={activity.href}
                className="group grid grid-cols-1 items-baseline gap-3 py-10 transition-colors hover:bg-white/60 md:grid-cols-12 md:gap-8 md:py-12"
              >
                <span className="text-4xl font-semibold text-[#E4E2DA] transition-colors group-hover:text-[#1F6B5A] md:col-span-2 md:text-6xl">
                  {activity.number}
                </span>
                <span className="text-2xl font-semibold tracking-tight text-[#171717] md:col-span-4 md:text-4xl">
                  {activity.title}
                </span>
                <span className="max-w-[420px] text-base leading-[1.65] text-[#6F6D66] md:col-span-5">
                  {activity.description}
                </span>
                <span className="text-sm font-medium text-[#1F6B5A] md:col-span-1 md:text-right">
                  &rarr;
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
