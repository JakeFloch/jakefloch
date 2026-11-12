"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

// Reusable variants for motion
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const NAV_ITEMS = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];
const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
const INDICATOR_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Active section = last one whose top has crossed a probe line 35% down the
// viewport, or the last section once the page is scrolled to the bottom.
function getActiveIndex() {
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  if (atBottom) return SECTION_IDS.length - 1;
  const probe = window.innerHeight * 0.35;
  let current = 0;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= probe) current = i;
  });
  return current;
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Which nav label sits under the sliding pill (drives the white text).
  const [highlightIndex, setHighlightIndex] = useState(0);
  const activeRef = useRef(0);

  // Sliding pill + underline, positioned by motion values (no re-renders).
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorX = useMotionValue(0);
  const indicatorW = useMotionValue(0);
  // Set while a nav click's smooth scroll is in flight. The pill then tracks
  // scroll progress from its start position to the target button, so it moves
  // as one motion that shares the scroll's easing and lands as the scroll does.
  const flightRef = useRef<null | {
    startY: number;
    targetY: number;
    fromX: number;
    fromW: number;
    toIndex: number;
  }>(null);

  const measure = (i: number) => {
    const b = navRefs.current[i];
    return b ? { x: b.offsetLeft, w: b.offsetWidth } : null;
  };

  const moveIndicatorTo = (i: number, instant = false) => {
    const m = measure(i);
    if (!m) return;
    if (instant) {
      indicatorX.jump(m.x);
      indicatorW.jump(m.w);
    } else {
      animate(indicatorX, m.x, INDICATOR_SPRING);
      animate(indicatorW, m.w, INDICATOR_SPRING);
    }
  };

  useMotionValueEvent(indicatorX, "change", (x) => {
    const center = x + indicatorW.get() / 2;
    let best = 0;
    let bestDist = Infinity;
    NAV_ITEMS.forEach((_, i) => {
      const m = measure(i);
      if (!m) return;
      const d = Math.abs(m.x + m.w / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHighlightIndex(best);
  });

  // Place the pill before first paint and whenever the nav resizes.
  useLayoutEffect(() => {
    const container = navRefs.current[0]?.parentElement;
    const place = () => {
      if (!flightRef.current) moveIndicatorTo(activeRef.current, true);
    };
    place();
    if (!container) return;
    const ro = new ResizeObserver(place);
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let frame = 0;

    const endFlight = () => {
      if (!flightRef.current) return;
      flightRef.current = null;
      moveIndicatorTo(activeRef.current); // no-op if already on target
    };

    const update = () => {
      frame = 0;
      const flight = flightRef.current;
      if (flight) {
        const y = window.scrollY;
        const span = flight.targetY - flight.startY;
        const p = span === 0 ? 1 : clamp01((y - flight.startY) / span);
        const to = measure(flight.toIndex);
        if (to) {
          indicatorX.set(lerp(flight.fromX, to.x, p));
          indicatorW.set(lerp(flight.fromW, to.w, p));
        }
      }
      const idx = getActiveIndex();
      const changed = idx !== activeRef.current;
      activeRef.current = idx;
      setActiveIndex(idx);
      if (flight && Math.abs(window.scrollY - flight.targetY) <= 1) {
        endFlight();
      } else if (!flight && changed) {
        moveIndicatorTo(idx);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // User takes over the scroll mid-flight: fall back to scroll-spy.
    const onUserScroll = () => endFlight();

    activeRef.current = getActiveIndex();
    setActiveIndex(activeRef.current);
    moveIndicatorTo(activeRef.current, true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", endFlight);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchstart", onUserScroll, { passive: true });
    window.addEventListener("keydown", onUserScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", endFlight);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchstart", onUserScroll);
      window.removeEventListener("keydown", onUserScroll);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const toIndex = SECTION_IDS.indexOf(sectionId);
    const maxY =
      document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.min(
      maxY,
      Math.max(0, el.getBoundingClientRect().top + window.scrollY)
    );
    if (toIndex >= 0) {
      indicatorX.stop();
      indicatorW.stop();
      if (Math.abs(targetY - window.scrollY) > 1) {
        flightRef.current = {
          startY: window.scrollY,
          targetY,
          fromX: indicatorX.get(),
          fromW: indicatorW.get(),
          toIndex,
        };
      } else {
        moveIndicatorTo(toIndex);
      }
    }
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 nav-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-zinc-100 tracking-tight">
              Jake Floch
            </div>
            <div className="hidden md:flex items-center gap-2 relative">
              {/* Shared pill + underline that slides between items */}
              <motion.span
                aria-hidden
                className="nav-indicator pointer-events-none absolute left-0 top-0 h-full rounded-md bg-primary"
                style={{ x: indicatorX, width: indicatorW }}
              />
              {NAV_ITEMS.map(({ label, id }, i) => {
                const lit = highlightIndex === i;
                return (
                  <Button
                    key={id}
                    ref={(el) => {
                      navRefs.current[i] = el;
                    }}
                    variant="ghost"
                    size="sm"
                    className={`relative font-medium transition-colors px-4 ${
                      lit
                        ? "text-primary-foreground hover:text-primary-foreground hover:bg-transparent"
                        : "text-zinc-300"
                    }`}
                    aria-current={activeIndex === i ? "true" : undefined}
                    onClick={() => scrollToSection(id)}
                    data-grid-shield
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative pt-20 text-white cursor-none"
      >
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-10"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1
              className="grid-title text-5xl md:text-7xl font-bold mb-8 text-gray-100 tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-400">
                Jake Floch
              </span>
            </motion.h1>
            <motion.p
              className="hero-sub text-lg md:text-2xl text-zinc-300/90 mb-4 font-mono flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
            >
              Software Engineer
              <motion.span
                className="ml-2 caret-blink text-purple-400"
                aria-hidden="true"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              >
                |
              </motion.span>
            </motion.p>
            <p className="text-sm md:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed hidden md:block">
              Student at Emory University studying Computer Science with a
              concentration in A.I. and a Business minor.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            <Button
              onClick={() => scrollToSection("projects")}
              className="cursor-none px-8 py-6 text-sm font-semibold tracking-wider btn-hero-outline"
              data-grid-shield
            >
              View Projects
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="cursor-none px-8 py-6 text-sm font-semibold tracking-wider btn-hero-outline"
              data-grid-shield
            >
              Contact Me
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative grid-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            About Me
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              className="space-y-7"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <motion.p
                className="text-lg leading-relaxed text-zinc-300/90"
                variants={fadeUp}
                transition={{ delay: 0.05 }}
              >
                I&apos;m a Computer Science student at Emory University with an
                AI concentration and a Business minor, graduating May 2027. I
                like the problem-solving side of engineering and the part where
                something I built actually gets used.
              </motion.p>
              <motion.p
                className="text-lg leading-relaxed text-zinc-300/90"
                variants={fadeUp}
                transition={{ delay: 0.15 }}
              >
                I&apos;m currently a Data Engineer Intern on Expedia Group&apos;s
                Global Payments team, working on data quality and pipeline
                testing for payment data products. Before that I spent ten
                months as a research assistant at Emory&apos;s School of
                Nursing, building Python and OpenCV pipelines that processed
                thermal and tissue-oximetry imaging into training-ready datasets
                for the lab&apos;s CNN models.
              </motion.p>
              <motion.div
                className="mt-10"
                variants={fadeIn}
                transition={{ delay: 0.25 }}
              >
                <Card
                  data-surface="glow"
                  className="p-6 md:p-8"
                  role="region"
                  aria-labelledby="connect-links-title"
                >
                  <div className="space-y-5">
                    <div>
                      <h3
                        id="connect-links-title"
                        className="text-lg font-semibold tracking-tight text-zinc-100"
                      >
                        Connect & Links
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Quick access to my profiles and resume
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.a
                        href="https://github.com/JakeFloch"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="group h-12 inline-flex items-center rounded-lg border border-white/10 bg-zinc-900/20 px-4 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 will-change-transform"
                        data-grid-shield
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      >
                        <GitHubLogoIcon className="mr-3 h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
                        <span>GitHub</span>
                        <span className="ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          ↗
                        </span>
                      </motion.a>

                      <motion.a
                        href="https://www.linkedin.com/in/jake-floch/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="group h-12 inline-flex items-center rounded-lg border border-white/10 bg-zinc-900/20 px-4 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 will-change-transform"
                        data-grid-shield
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      >
                        <LinkedInLogoIcon className="mr-3 h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
                        <span>LinkedIn</span>
                        <span className="ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          ↗
                        </span>
                      </motion.a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="self-start"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="mt-0">
                <motion.div
                  className="mt-0"
                  variants={fadeIn}
                  transition={{ delay: 0.25 }}
                >
                  <h3 className="text-md font-semibold tracking-[0.15em] text-zinc-400 uppercase mb-4">
                    Education & Experience
                  </h3>
                  <ul className="space-y-4 text-md">
                    <li className="flex items-start gap-3">
                      {/* small gradient dot used as bullet point */}
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          Data Engineer Intern · Expedia Group (Global Payments)
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          June 2026 – August 2026
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          Research Assistant / Developer · Emory University
                          School of Nursing
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          July 2025 – May 2026
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          Software Engineering Intern · Youphoria
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          May 2025 – August 2025
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          B.S. Computer Science · Emory University
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          August 2023 – May 2027
                        </p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cornucopia",
                description:
                  "A mobile app that aggregates nearby food options and highlights key data, such as distance, affordability, and SNAP/EBT eligibility using OpenStreetMap and USDA’s SNAP retailer location data",
                tech: [
                  "Expo",
                  "React Native",
                  "Supabase",
                  "PostgreSQL",
                  "TypeScript",
                  "Git",
                ],
                gradient: "from-orange-300 to-slate-700",
                logo: "/cornucopia.png",
                links: {
                  demo: "https://devpost.com/software/cornucopia-9gpkcw?ref_content=my-projects-tab&ref_feature=my_projects",
                  github: "https://github.com/alexlautin/cornucopia",
                },
              },
              {
                title: "Unity Game - Top-Down Shooter",
                description:
                  "Two dimensional top-down casino themed arcade shooter game where the player navigates through various levels filled with enemies and obstacles. The player can buy upgrades and wager their character's and their enemies' attributes for money.",
                tech: ["Unity", "C#", "Unity Scripting API"],
                gradient: "from-cyan-300 to-slate-900",
                logo: "/unity-69-logo-png-transparent.png",
                links: {
                  demo: "https://miguelchaveznava.itch.io/raging-gambler",
                  github: "https://github.com/JMBreard/CS370-Raging-Gambler",
                },
              },
              {
                title: "Invitide",
                description:
                  "Invitide is a modern event management platform where users can easily create, manage, and share events with friends, generate AI event descriptions, and track attendance with QR codes.",
                tech: [
                  "Next.js",
                  "TypeScript",
                  "React",
                  "Supabase",
                  "PostgreSQL",
                  "Tailwind",
                  "Socket.io",
                  "Shadcn UI",
                ],
                gradient: "from-gray-500 to-fuchsia-100",
                logo: "/invitide_logo.png",
                links: {
                  demo: "https://invitide.vercel.app/",
                  github: "https://github.com/alexlautin/invitide",
                },
              },
              {
                title: "GalleryBoard",
                description:
                  "GalleryBoard is a collaborative classroom whiteboard platform where teachers can create rooms, students can join with a code, and everyone gets a real-time, private whiteboard. Teachers can view live previews of all student boards.",
                tech: [
                  "Next.js",
                  "TypeScript",
                  "React",
                  "Supabase",
                  "PostgreSQL",
                  "Tailwind",
                  "Shadcn UI",
                ],
                gradient: "from-slate-50 to-gray-100",
                logo: "/galleryboardlogo.png",
                links: {
                  demo: "https://galleryboard.vercel.app/",
                  github: "https://github.com/alexlautin/galleryboard",
                },
              },
            ].map((project, index) => (
              <motion.div
                key={project.title}
                className="group relative"
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
              >
                <Card
                  data-surface="glow"
                  className="p-8 transition-all duration-500 h-full hover:shadow-purple-500/10 flex flex-col"
                >
                  <motion.div
                    className={`relative w-full h-48 rounded-xl mb-6 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${project.gradient} shadow-inner overflow-hidden`}
                    layout
                  >
                    <Image
                      src={project.logo}
                      alt={`${project.title} logo`}
                      fill
                      className={`object-contain ${
                        project.title === "GalleryBoard"
                          ? "scale-130 p-3"
                          : "p-6"
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-3 text-zinc-100 tracking-tight card-title-minh">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 desc-minh">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6 badges-minh">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="tech-badge"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto flex space-x-6 text-sm font-medium pt-2">
                    <motion.a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      Live Demo →
                    </motion.a>
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-300 transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      GitHub →
                    </motion.a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative grid-section">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20">
            Contact
          </h2>
          <Card data-surface="subtle" className="p-8 form-dark">
            <form
              action="https://formspree.io/f/mnnbwlek"
              method="POST"
              className="space-y-6"
            >
              <div>
                {/* data-brand-focus enables the gradient focus ring in CSS */}
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="h-12"
                  data-brand-focus="true"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="h-12"
                  data-brand-focus="true"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  required
                  className="resize-none min-h-40"
                  data-brand-focus="true"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-semibold tracking-wider"
                data-grid-shield
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-dark relative overflow-hidden py-6 md:py-8">
        {/* Ambient animated glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 blur-3xl"
            animate={{ x: [-40, 40, -40] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 text-center tracking-wide">
          <motion.div
            className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6 md:mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          />

          {/* Fade-in text */}
          <motion.p
            className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            © 2026 Jake Floch. Built with Next.js and Tailwind CSS.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
