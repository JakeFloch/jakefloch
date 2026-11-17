import type { ReactNode } from "react";
import HarnessDemo from "./HarnessDemo";
import ProjectRail from "./ProjectRail";
import {
  CornucopiaVisual,
  GalleryBoardVisual,
  InvitideVisual,
  RagingGamblerVisual,
} from "./ProjectVisuals";
import { Reveal, SectionLabel } from "./Reveal";

type Project = {
  title: string;
  kind: string;
  description: string;
  tech: string[];
  Visual: () => ReactNode;
  links: { demo: string; github: string };
};

const PROJECTS: Project[] = [
  {
    title: "Cornucopia",
    kind: "Mobile app",
    description:
      "Aggregates nearby food options and highlights distance, affordability, and SNAP/EBT eligibility using OpenStreetMap and USDA SNAP retailer data.",
    tech: ["Expo", "React Native", "Supabase", "PostgreSQL", "TypeScript"],
    Visual: CornucopiaVisual,
    links: {
      demo: "https://devpost.com/software/cornucopia-9gpkcw",
      github: "https://github.com/alexlautin/cornucopia",
    },
  },
  {
    title: "Raging Gambler",
    kind: "Unity game",
    description:
      "A casino-themed top-down arcade shooter. Fight through levels of enemies and obstacles, buy upgrades, and wager your own and your enemies' attributes for money.",
    tech: ["Unity", "C#", "Unity Scripting API"],
    Visual: RagingGamblerVisual,
    links: {
      demo: "https://miguelchaveznava.itch.io/raging-gambler",
      github: "https://github.com/JMBreard/CS370-Raging-Gambler",
    },
  },
  {
    title: "Invitide",
    kind: "Web platform",
    description:
      "Event management where you create, manage, and share events with friends, generate AI event descriptions, and track attendance with QR codes.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Socket.io"],
    Visual: InvitideVisual,
    links: {
      demo: "https://invitide.vercel.app/",
      github: "https://github.com/alexlautin/invitide",
    },
  },
  {
    title: "GalleryBoard",
    kind: "Web platform",
    description:
      "A collaborative classroom whiteboard. Teachers create rooms, students join with a code, and everyone gets a real-time private board the teacher can preview live.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    Visual: GalleryBoardVisual,
    links: {
      demo: "https://galleryboard.vercel.app/",
      github: "https://github.com/alexlautin/galleryboard",
    },
  },
];

function ExternalLink({
  href,
  children,
  clone = false,
}: {
  href: string;
  children: ReactNode;
  clone?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={clone ? -1 : undefined}
      className="link text-sm font-medium"
    >
      {children} <span aria-hidden>↗</span>
    </a>
  );
}

// Tech list set as a single mono line with blue slashes between items.
function Stack({ items }: { items: string[] }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="label">Stack</p>
      <ul className="mt-2 flex flex-wrap gap-y-1 font-mono text-[11px] leading-relaxed text-fg/85">
        {items.map((item, i) => (
          <li key={item} className="flex items-center whitespace-nowrap">
            {item}
            {i < items.length - 1 && (
              <span aria-hidden className="mx-2 text-accent">
                /
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// One pass of the project cards. The rail repeats these to loop; repeats are
// clones, kept out of the tab order.
function cards(clone: boolean) {
  return PROJECTS.map((p, i) => (
    <article
      key={p.title}
      className="group flex w-[18.5rem] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-300 hover:border-fg/25 sm:w-[21rem]"
    >
      <p.Visual />
      <div className="flex flex-1 flex-col p-6">
        <span className="label">
          {String(i + 2).padStart(2, "0")} · {p.kind}
        </span>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[-0.03em]">
          {p.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg/70">
          {p.description}
        </p>
        <div className="mt-5">
          <Stack items={p.tech} />
        </div>
        <div className="mt-auto flex gap-6 pt-6">
          <span className="text-accent">
            <ExternalLink href={p.links.demo} clone={clone}>
              Live demo
            </ExternalLink>
          </span>
          <span className="text-fg/70">
            <ExternalLink href={p.links.github} clone={clone}>
              GitHub
            </ExternalLink>
          </span>
        </div>
      </div>
    </article>
  ));
}

export default function Projects() {
  return (
    <section id="work" className="px-5 py-28 md:px-10 md:py-44">
      <div className="flex items-end justify-between gap-6">
        <div>
          <SectionLabel n="02">Selected work</SectionLabel>
          <Reveal>
            <h2 className="mt-8 font-display text-[clamp(3.25rem,10vw,10rem)] leading-[0.9] tracking-[-0.05em]">
              Things I&apos;ve <em className="text-accent">built</em>
            </h2>
          </Reveal>
        </div>
        <p className="label hidden pb-3 md:block">
          ({String(PROJECTS.length + 1).padStart(2, "0")})
        </p>
      </div>

      {/* Featured: Harness */}
      <Reveal className="mt-14 md:mt-20">
        <article
          className="grid overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-300 hover:border-fg/25 lg:grid-cols-2"
        >
          <div className="relative z-10 flex flex-col p-7 md:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip !border-accent/50 !text-accent">Latest</span>
              <span className="chip">Emory Hacks · Nov 2026</span>
            </div>
            <h3 className="mt-8 font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.04em]">
              Harness
            </h3>
            <p className="label mt-3">A local monitor for AI coding agents</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/75">
              Harness watches what Claude Code and Codex do on your computer,
              including the parts their own windows don&apos;t show. It follows
              every process, file, and connection an agent starts, turns it
              into a safety score out of 100, and can pause the agent before a
              malicious install script walks off with your secrets. Runs
              entirely locally as a macOS menu bar and Windows tray app. Built
              with a team of three.
            </p>
            <div className="mt-8 max-w-xl">
              <Stack
                items={[
                  "Node.js",
                  "JavaScript",
                  "Tauri 2",
                  "Rust",
                  "Claude Code hooks",
                  "Next.js",
                ]}
              />
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <a
                href="https://devpost.com/software/harness-1rhedk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid"
              >
                View on Devpost <span className="arrow">↗</span>
              </a>
              <a
                href="https://github.com/alexlautin/harness"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line"
              >
                GitHub <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[26rem] items-center justify-center overflow-hidden border-t border-line p-6 md:p-12 lg:border-l lg:border-t-0">
            <div
              aria-hidden
              className="absolute inset-0 visual-grid"
            />
            <div className="relative z-10 flex w-full justify-center">
              <HarnessDemo />
            </div>
          </div>
        </article>
      </Reveal>

      {/* The rest: a slow, looping side-scroller */}
      <Reveal className="mt-16 md:mt-24">
        <div className="mb-6 flex items-center justify-between">
          <p className="label">More projects</p>
          <p className="label">Scroll or hover to pause</p>
        </div>
        <ProjectRail sets={[cards(false), cards(true), cards(true)]} />
      </Reveal>
    </section>
  );
}
