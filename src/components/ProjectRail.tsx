"use client";
import { useEffect, useRef, type ReactNode } from "react";

const DRIFT = 28; // resting speed, px per second
const SETTLE_MS = 900; // time constant for easing back to the resting speed
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag
const MAX_FLING = 4000; // px per second

// A horizontal strip of cards that drifts left on its own and loops
// seamlessly. `sets` are identical copies of the same cards laid end to end;
// once a full copy has scrolled past, the position wraps by one copy.
//
// It can be grabbed with the mouse and thrown: the release velocity carries
// on, then eases back to the resting drift (or to a stop while hovered or
// focused). It is still an ordinary scroll container underneath, so trackpad,
// touch and keyboard scrolling work as usual.
export default function ProjectRail({ sets }: { sets: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft; // float; scrollLeft itself may round
    let vel = 0; // px per second, positive scrolls left
    let visible = false;
    let hovered = false;
    let focused = false;

    // Drag state
    let pressed = false;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let dragVel = 0;
    let suppressClick = false;

    const period = () => {
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[1] as HTMLElement | undefined;
      return a && b ? b.offsetLeft - a.offsetLeft : 0;
    };
    const wrap = (x: number) => {
      const p = period();
      if (p <= 0) return x;
      return ((x % p) + p) % p;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const tick = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;

      if (!dragging) {
        // Follow the user if they scrolled natively since the last frame.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;

        const rest = reduce || hovered || focused || !visible ? 0 : DRIFT;
        vel += (rest - vel) * (1 - Math.exp(-dt / SETTLE_MS));
        if (Math.abs(vel - rest) < 0.5) vel = rest;
        pos = wrap(pos + (vel * dt) / 1000);
      }
      if (Math.abs(el.scrollLeft - pos) >= 0.5) el.scrollLeft = pos;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressed = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startPos = pos;
      lastT = e.timeStamp;
      dragVel = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        try {
          el.setPointerCapture(pointerId);
        } catch {
          // Pointer already gone; the drag still works while over the rail.
        }
        el.dataset.dragging = "true";
      }
      pos = wrap(startPos - dx);
      // Smoothed pointer velocity, so one jittery sample can't set the throw.
      const dtMove = e.timeStamp - lastT;
      if (dtMove > 0) {
        const instant = (-(e.clientX - lastX) / dtMove) * 1000;
        dragVel = dragVel * 0.7 + instant * 0.3;
      }
      lastX = e.clientX;
      lastT = e.timeStamp;
    };

    const onUp = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;
      pressed = false;
      if (!dragging) return;
      dragging = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      // A pause before letting go means no throw.
      const stale = e.timeStamp - lastT > 80;
      vel = stale || reduce ? 0 : Math.max(-MAX_FLING, Math.min(MAX_FLING, dragVel));
      // The click that follows a drag shouldn't open a card's link.
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 0);
    };

    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
    };
    // Stop the browser's own link/image drag from hijacking the gesture.
    const onDragStart = (e: DragEvent) => e.preventDefault();

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = () => {
      focused = false;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Projects"
      tabIndex={0}
      className="rail no-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 md:-mx-10 md:px-10"
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
