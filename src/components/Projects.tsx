import type { ReactNode } from "react";
import ProjectRail from "./ProjectRail";
import {
  CornucopiaVisual,
  GalleryBoardVisual,
  HarnessVisual,
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
  demoLabel?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Harness",
    kind: "Emory Hacks · 2026",
    description:
      "Watches what Claude Code and Codex do on your computer, including what their own windows don't show. Scores the risk out of 100 and can pause an agent before an install script takes your secrets. Built with a team of three.",
    tech: ["Node.js", "JavaScript", "Tauri 2", "Rust", "Claude Code hooks"],
    Visual: HarnessVisual,
    links: {
      demo: "https://devpost.com/software/harness-1rhedk",
      github: "https://github.com/alexlautin/harness",
    },
    demoLabel: "Devpost",
  },
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

// Tech list set as a single mono line with blue slashes between items.
function Stack({ items }: { items: string[] }) {
  return (
    <div className="border-t border-line pt-4">
      <ul className="flex flex-wrap gap-y-1 font-mono text-[11px] leading-relaxed text-fg/85">
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
  return PROJECTS.map((p) => (
    <article key={p.title} className="card flex w-[22rem] shrink-0 flex-col">
      <header className="flex h-10 items-center border-b border-line px-5 text-xs text-dim">
        {p.kind}
      </header>
      <p.Visual />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.75rem] leading-none tracking-[-0.035em]">
          {p.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg/65">
          {p.description}
        </p>
        <div className="mt-auto pt-5">
          <Stack items={p.tech} />
        </div>
      </div>
      <footer className="grid grid-cols-2 border-t border-line">
        {[
          { label: p.demoLabel ?? "Live demo", href: p.links.demo },
          { label: "GitHub", href: p.links.github },
        ].map((link, j) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={clone ? -1 : undefined}
            className={`card-link ${j > 0 ? "border-l border-line" : ""}`}
          >
            {link.label}
            <span aria-hidden className="arrow">
              ↗
            </span>
          </a>
        ))}
      </footer>
    </article>
  ));
}

export default function Projects() {
  return (
    <section id="work" className="px-5 pb-6 pt-20 md:px-10 md:pb-10 md:pt-28">
      <SectionLabel>Selected work</SectionLabel>
      <Reveal>
        <h2 className="mt-6 font-display text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-[-0.04em] md:mt-8">
          Things I&apos;ve <em className="text-accent">built</em>
        </h2>
      </Reveal>

      {/* A slow, looping side-scroller that can be grabbed and thrown */}
      <Reveal className="mt-10 md:mt-14">
        <ProjectRail sets={[cards(false), cards(true), cards(true)]} />
      </Reveal>
    </section>
  );
}
