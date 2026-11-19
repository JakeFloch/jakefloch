import { Reveal, ScrollWords, SectionLabel } from "./Reveal";

type Entry = { role: string; org: string; detail?: string; dates: string };

const EXPERIENCE: Entry[] = [
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
];

const EDUCATION: Entry[] = [
  {
    role: "B.S. Computer Science",
    org: "Emory University",
    detail: "Concentration in Artificial Intelligence · Minor in Business",
    dates: "Aug 2023 – May 2027",
  },
];

export default function About() {
  return (
    <section id="about" className="px-5 py-20 md:px-10 md:py-28">
      <SectionLabel>About</SectionLabel>

      <ScrollWords
        className="mt-6 max-w-[26ch] font-display text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-[-0.04em] md:mt-8"
        text="CS student at Emory, most recently a data engineering intern on Expedia Group's Global Payments team. Graduating May 2027."
        accentWords={3}
      />

      <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <div className="max-w-[44rem] space-y-5 text-lg leading-relaxed text-fg/70 md:sticky md:top-28 md:text-[clamp(1.05rem,1.15vw,1.35rem)]">
            <p className="text-xl leading-snug text-fg md:text-[clamp(1.5rem,2vw,2.4rem)] md:leading-[1.25]">
              I build data pipelines, AI tooling, and full-stack products. I
              like the problem-solving side of engineering, and the part where
              something I built actually gets used.
            </p>
            <p>
              At Expedia I built an AI-powered regression testing framework for
              payment data at billion-row scale.
            </p>
            <p>
              Before that I spent ten months as a research assistant at
              Emory&apos;s School of Nursing, building Python and OpenCV
              pipelines that turned thermal and tissue-oximetry imaging into
              training-ready datasets for the lab&apos;s CNN models.
            </p>
          </div>
        </Reveal>

        <div className="space-y-14 md:col-span-7 md:col-start-6">
          {[
            { title: "Experience", items: EXPERIENCE },
            { title: "Education", items: EDUCATION },
          ].map((group) => (
            <div key={group.title}>
              <Reveal>
                <h3 className="mb-1 text-sm font-medium text-dim">{group.title}</h3>
              </Reveal>
              <ul>
                {group.items.map((item, i) => (
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
                        {item.detail && (
                          <p className="mt-1 text-sm text-fg/45">{item.detail}</p>
                        )}
                      </div>
                      <p className="label shrink-0">{item.dates}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
