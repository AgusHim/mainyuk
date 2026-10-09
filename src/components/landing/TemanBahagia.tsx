import Reveal from "./Reveal";

const ORANGE = "#f5820a";
const INK = "#171717";

function PhoneIllustration() {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" className="h-full w-full">
      {/* sparkles */}
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M44 96V74" />
        <path d="M26 106 8 96" />
        <path d="M64 78l12-14" />
      </g>
      {/* phone */}
      <g transform="rotate(-14 132 112)">
        <rect x="94" y="34" width="78" height="142" rx="20" fill={ORANGE} />
        <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round">
          <path d="M112 74q8-8 16 0t16 0 14 0" />
          <path d="M112 96q8-8 16 0t16 0 14 0" />
          <path d="M112 118q8-8 16 0t16 0" />
          <path d="M112 140q8-8 16 0t16 0 14 0" />
        </g>
      </g>
      {/* hand */}
      <path
        d="M128 218c-30 0-52-11-62-31-4-8 1-16 10-16 5 0 9 3 12 7l-8-40c-2-8 4-14 11-14 6 0 10 4 11 10l4 22-2-32c-1-7 5-12 12-12 6 0 11 5 11 12l1 30 2-22c1-7 7-11 13-10 6 1 10 7 10 14l-3 42c-2 24-17 40-32 40z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrownIllustration() {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" className="h-full w-full">
      {/* sparkles */}
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M120 46V28" />
        <path d="M74 62 64 46" />
        <path d="M166 62l10-16" />
        <path d="M58 98H40" />
        <path d="M182 98h18" />
      </g>
      {/* motion arcs */}
      <g stroke={ORANGE} strokeWidth="4" strokeLinecap="round">
        <path d="M178 152q10 12 0 24" />
        <path d="M190 142q16 22 0 44" />
      </g>
      {/* crown */}
      <g transform="rotate(-12 120 74)">
        <path
          d="M92 84l-8-26 18 13 18-22 18 22 18-13-8 26z"
          fill={INK}
          strokeLinejoin="round"
        />
      </g>
      {/* body */}
      <path
        d="M120 104c-9 0-16 6-19 15l-21 68c-2 8 3 13 11 13h58c8 0 13-5 11-13l-21-68c-3-9-10-15-19-15z"
        fill={ORANGE}
      />
      {/* head */}
      <circle cx="120" cy="104" r="24" fill="#ffffff" />
      {/* face */}
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M111 101q3-3 6 0" />
        <path d="M126 101q3-3 6 0" />
        <path d="M113 112q7 7 14 0" />
      </g>
    </svg>
  );
}

function HandsIllustration() {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" className="h-full w-full">
      {/* burst */}
      <g stroke="#8fc7d1" strokeWidth="5" strokeLinecap="round">
        <path d="M120 34V14" />
        <path d="M64 52 50 36" />
        <path d="M176 52l14-16" />
        <path d="M38 104H16" />
        <path d="M202 104h22" />
        <path d="M54 166l-18 14" />
        <path d="M186 166l18 14" />
      </g>
      {/* praying hands — two palms pressed together */}
      <path
        d="M118 58c-9 14-20 34-24 58-4 24 2 48 24 72V58z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M122 58c9 14 20 34 24 58 4 24-2 48-24 72V58z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M120 78v116" />
        <path d="M106 118c-3 22 0 42 10 58" />
        <path d="M134 118c3 22 0 42-10 58" />
      </g>
    </svg>
  );
}

const CARDS = [
  {
    caption: "Menjadikan YN Solo sebagai trendsetter dakwah kreatif",
    Illustration: PhoneIllustration,
    tilt: "lg:rotate-[-7deg]",
  },
  {
    caption: "Menyamakan dan membangun Growth Mindset Rangers Yuk Ngaji Solo",
    Illustration: CrownIllustration,
    tilt: "lg:z-10 lg:-translate-y-3",
  },
  {
    caption: "Menjadi wadah dakwah yang positif, bertumbuh, dan berdampak untuk Solo",
    Illustration: HandsIllustration,
    tilt: "lg:rotate-[7deg]",
  },
];

export default function TemanBahagia() {
  return (
    <section
      id="temanbahagia"
      className="yn-section overflow-hidden border-t border-[var(--yn-border)]"
    >
      <div className="yn-container">
        <Reveal>
          <h2
            className="mx-auto text-center font-semibold"
            style={{
              fontSize: "clamp(2rem, 7vw, 5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block text-[var(--yn-foreground)]">
              Taat Bahagia,
            </span>
            <span className="block text-[#a3a3a3]">Maksiat Sengsara</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <div className="mt-14 flex justify-center md:mt-20">
          <div className="flex w-full max-w-[420px] flex-col items-center gap-6 px-5 lg:w-max lg:max-w-none lg:flex-row lg:items-center lg:gap-16 lg:px-0 xl:gap-28">
            {CARDS.map((card) => {
              const { Illustration } = card;
              return (
                <article
                  key={card.caption}
                  className={`flex w-full max-w-[420px] flex-col items-center justify-between gap-8 rounded-[28px] bg-white px-7 py-10 text-center shadow-[0_28px_70px_-38px_rgba(23,23,23,0.4)] transition-shadow duration-300 hover:shadow-[0_34px_80px_-34px_rgba(23,23,23,0.5)] lg:aspect-[5/6] lg:w-[380px] lg:max-w-none lg:px-9 xl:w-[420px] ${card.tilt}`}
                >
                  <div className="flex w-full flex-1 items-center justify-center">
                    <div className="h-[160px] w-[160px] lg:h-[190px] lg:w-[190px]">
                      <Illustration />
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-[1.35] tracking-tight text-[var(--yn-foreground)] md:text-xl">
                    {card.caption}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
