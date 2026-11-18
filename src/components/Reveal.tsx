"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

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

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-dim">{children}</p>;
}

// A paragraph whose words light up one by one as it scrolls through the
// viewport. The last `accentWords` words are set in the accent colour.
//
// Words switch on and off in steps with a short CSS fade, and the DOM is only
// touched when the number of lit words changes — not on every scroll frame.
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
  const lit = useRef(-1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });
  const words = text.split(" ");

  const paint = (p: number) => {
    const el = ref.current;
    if (!el) return;
    const n = Math.round(p * words.length);
    if (n === lit.current) return;
    const spans = el.children;
    const lo = Math.max(0, Math.min(n, lit.current));
    const hi = Math.max(n, lit.current);
    for (let i = lit.current < 0 ? 0 : lo; i < (lit.current < 0 ? spans.length : hi); i++) {
      (spans[i] as HTMLElement).dataset.lit = i < n ? "true" : "false";
    }
    lit.current = n;
  };
  useMotionValueEvent(scrollYProgress, "change", paint);
  useEffect(() => paint(scrollYProgress.get()));

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          data-lit="false"
          className={`scroll-word ${i >= words.length - accentWords ? "text-accent" : ""}`}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
