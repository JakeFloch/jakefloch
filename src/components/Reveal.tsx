"use client";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Fade-and-rise the first time the element scrolls into view.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="label flex items-center gap-3">
      <span className="text-accent">{n}</span>
      <span className="h-px w-10 bg-line" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={accent ? "text-accent" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

// A paragraph whose words light up one by one as it scrolls through the
// viewport. The last `accentWords` words are set in the accent colour.
export function ScrollWords({
  text,
  accentWords = 0,
  className,
}: {
  text: string;
  accentWords?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          accent={i >= words.length - accentWords}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}
