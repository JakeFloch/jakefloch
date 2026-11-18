import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { SOCIALS } from "@/components/SocialIcons";

const STACK = [
  "Python",
  "SQL",
  "TypeScript",
  "Java",
  "React",
  "Next.js",
  "Spark",
  "Trino",
  "PostgreSQL",
  "OpenCV",
  "Tailwind",
  "Unity",
];

function Marquee() {
  // The list is rendered twice so the -50% loop is seamless.
  return (
    <div
      className="marquee-wrap overflow-hidden border-y border-line py-5"
      aria-label={`Tech stack: ${STACK.join(", ")}`}
    >
      <div className="marquee" aria-hidden>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {STACK.map((item) => (
              <li
                key={item}
                className="flex items-center font-display text-2xl tracking-[-0.03em] md:text-3xl"
              >
                <span className="px-6 md:px-8">{item}</span>
                <span className="text-lg text-accent">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-line px-5 py-8 md:px-10">
        <div className="flex flex-col gap-3 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jake Floch</p>
          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-dim transition-colors duration-300 hover:text-fg"
              >
                <s.Icon className="h-4 w-4" />
              </a>
            ))}
            <a href="#top" className="link text-fg">
              Back to top <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
