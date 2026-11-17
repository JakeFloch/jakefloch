"use client";
import { useEffect, useRef, type ReactNode } from "react";

const SPEED = 28; // px per second

// A horizontal strip of cards that drifts left on its own and loops
// seamlessly. `sets` are identical copies of the same cards laid end to end;
// once a full copy has scrolled past, the position snaps back by one copy.
// It is an ordinary scroll container, so trackpad, touch and keyboard
// scrolling all work, and the drift pauses while it is hovered or focused.
export default function ProjectRail({ sets }: { sets: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft; // float; scrollLeft itself may round
    let visible = false;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const tick = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[1] as HTMLElement | undefined;
      const period = a && b ? b.offsetLeft - a.offsetLeft : 0;

      // Follow the user if they scrolled since the last frame.
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
      if (!paused.current && visible && !reduce) pos += (SPEED * dt) / 1000;
      if (period > 0 && pos >= period) pos -= period;
      if (Math.abs(el.scrollLeft - pos) >= 0.5) el.scrollLeft = pos;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="More projects"
      tabIndex={0}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="no-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 md:-mx-10 md:px-10"
    >
      {sets.map((set, i) => (
        <div
          key={i}
          // Only the first copy is exposed to assistive tech.
          aria-hidden={i > 0 ? true : undefined}
          className="flex shrink-0 gap-5"
        >
          {set}
        </div>
      ))}
    </div>
  );
}
