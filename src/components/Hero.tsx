"use client";
import { motion } from "motion/react";
import DotField from "./DotField";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Letters rise out of a clipped line, one after another.
function RisingWord({
  text,
  delay,
  className = "",
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block overflow-hidden -mb-[0.1em] pb-[0.24em] pr-[0.06em] align-bottom ${className}`}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "115%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.045 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[85svh] flex-col justify-end overflow-hidden px-5 pb-8 pt-24 md:min-h-[78svh] md:px-10 md:pb-10"
    >
      <DotField className="absolute inset-0 h-full w-full" />

      <div className="relative">
        <h1
          aria-label="Jake Floch"
          className="font-display text-[clamp(5rem,31vw,12rem)] leading-[0.82] tracking-[-0.055em] md:text-[clamp(7rem,20.5vw,24rem)]"
        >
          <RisingWord text="Jake" delay={0.15} className="max-md:block" />
          <span aria-hidden className="max-md:hidden">
            {" "}
          </span>
          <RisingWord
            text="Floch"
            delay={0.35}
            className="text-accent max-md:block"
          />
        </h1>

        <div className="mt-6 flex flex-col gap-6 border-t border-line pt-6 md:mt-4 md:flex-row md:items-center md:justify-between">
          <motion.div
            {...fade(0.9)}
            className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-dim"
          >
            <span className="flex items-center gap-2 text-fg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Software Engineer
            </span>
            <span>Emory University · Atlanta, GA</span>
            <span>Class of 2027</span>
          </motion.div>
          <motion.div {...fade(1.05)} className="flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">
              View work <span className="arrow">↗</span>
            </a>
            <a href="#contact" className="btn btn-line">
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
