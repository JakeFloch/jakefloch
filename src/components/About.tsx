import { Reveal, ScrollWords, SectionLabel } from "./Reveal";

const EXPERIENCE = [
  {
    role: "Data Engineer Intern",
    org: "Expedia Group · Global Payments",
    dates: "Jun – Aug 2026",
  },
  {
    role: "Research Assistant / Developer",
    org: "Emory University School of Nursing",
    dates: "Jul 2025 – May 2026",
  },
  {
    role: "Software Engineering Intern",
    org: "Youphoria",
    dates: "May – Aug 2025",
  },
  {
    role: "B.S. Computer Science",
    org: "Emory University",
    dates: "Aug 2023 – May 2027",
  },
];

export default function About() {
  return (
    <section id="about" className="px-5 py-28 md:px-10 md:py-44">
      <SectionLabel n="01">About</SectionLabel>

      <ScrollWords
        className="mt-10 max-w-[24ch] font-display text-[clamp(2.2rem,5.4vw,5.5rem)] leading-[1.02] tracking-[-0.045em] md:mt-14"
        text="CS student at Emory, most recently a data engineering intern on Expedia Group's Global Payments team. Graduating May 2027."
        accentWords={3}
      />

      <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-12 md:gap-10">
        <Reveal className="space-y-6 text-lg leading-relaxed text-fg/75 md:col-span-5">
          <p>
            I like the problem-solving side of engineering, and the part where
            something I built actually gets used.
          </p>
          <p>
            This past summer I interned on Expedia Group&apos;s Global Payments
            team, where I built an AI-powered regression testing framework for
            payment data at billion-row scale.
          </p>
          <p>
            Before that I spent ten months as a research assistant at
            Emory&apos;s School of Nursing, building Python and OpenCV pipelines
            that turned thermal and tissue-oximetry imaging into training-ready
            datasets for the lab&apos;s CNN models.
          </p>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <h3 className="label mb-2">Experience &amp; education</h3>
          </Reveal>
          <ul>
            {EXPERIENCE.map((item, i) => (
              <li key={item.role}>
                <Reveal
                  delay={i * 0.07}
                  className="group flex flex-col gap-1 border-b border-line py-6 transition-[padding] duration-300 hover:pl-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="font-display text-2xl leading-tight tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent">
                      {item.role}
                    </p>
                    <p className="mt-1 text-fg/60">{item.org}</p>
                  </div>
                  <p className="label shrink-0">{item.dates}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
