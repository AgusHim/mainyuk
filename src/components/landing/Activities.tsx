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
    <section id="aktivitas" className="yn-section border-t border-[var(--yn-border)]">
      <div className="yn-container">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yn-accent)] md:text-sm">
            Aktivitas
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-6 max-w-[20ch] font-semibold text-[var(--yn-foreground)]"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.045em",
            }}
          >
            Tempat kami bertemu dan bergerak.
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-[var(--yn-border)] border-t border-[var(--yn-border)] md:mt-20">
          {ACTIVITIES.map((activity, index) => (
            <Reveal key={activity.number} delay={index * 100}>
              <a
                href={activity.href}
                className="group grid grid-cols-1 items-baseline gap-3 py-10 transition-colors hover:bg-[var(--yn-surface)]/60 md:grid-cols-12 md:gap-8 md:py-12"
              >
                <span className="text-4xl font-semibold text-[var(--yn-border)] transition-colors group-hover:text-[var(--yn-accent)] md:col-span-2 md:text-6xl">
                  {activity.number}
                </span>
                <span className="text-2xl font-semibold tracking-tight text-[var(--yn-foreground)] md:col-span-4 md:text-4xl">
                  {activity.title}
                </span>
                <span className="max-w-[420px] text-base leading-[1.65] text-[var(--yn-muted)] md:col-span-5">
                  {activity.description}
                </span>
                <span className="text-sm font-medium text-[var(--yn-accent)] md:col-span-1 md:text-right">
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
