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
          {String(i + 1).padStart(2, "0")} · {p.kind}
        </span>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[-0.03em]">
          {p.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg/70">
          {p.description}
        </p>
        <div className="mt-auto pt-5">
          <Stack items={p.tech} />
        </div>
        <div className="flex gap-6 pt-6">
          <span className="text-accent">
            <ExternalLink href={p.links.demo} clone={clone}>
              {p.demoLabel ?? "Live demo"}
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
    <section id="work" className="px-5 pb-6 pt-28 md:px-10 md:pb-10 md:pt-44">
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
          ({String(PROJECTS.length).padStart(2, "0")})
        </p>
      </div>

      {/* A slow, looping side-scroller that can be grabbed and thrown */}
      <Reveal className="mt-14 md:mt-20">
        <p className="label mb-6 text-right">Drag to scroll</p>
        <ProjectRail sets={[cards(false), cards(true), cards(true)]} />
      </Reveal>
    </section>
  );
}
