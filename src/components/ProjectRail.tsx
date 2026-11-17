"use client";
import { useEffect, useRef, type ReactNode } from "react";

const DRIFT = 30; // resting speed, px per second — the rail never goes slower
const FRICTION_MS = 700; // time constant for a throw easing back to DRIFT
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag
const MAX_FLING = 5000; // px per second
const KEY_NUDGE = 1100; // px per second given by an arrow key

// A horizontal strip of cards that drifts on its own and loops seamlessly.
// `sets` are identical copies of the same cards laid end to end; the track is
// moved with a GPU transform and wraps by one copy's width.
//
// It can be grabbed and thrown. A throw sets the direction and speed, and the
// speed then decays exponentially back to DRIFT, never to zero: the rail only
// stands still while it is actually being held. Horizontal trackpad scrolling
// and the arrow keys move it too.
export default function ProjectRail({ sets }: { sets: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rest = reduce ? 0 : DRIFT;

    let raf = 0;
    let running = false;
    let last = 0;
    let x = 0; // px scrolled, always within [0, period)
    let dir = 1; // 1 moves the cards left, -1 right
    let speed = rest; // px per second, never below `rest` unless held
    let period = 0;
    let keyboardFocus = false;

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

    const wrap = (v: number) =>
      period > 0 ? ((v % period) + period) % period : v;
    const render = () => {
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
    };

    // Layout is only read here, never inside the animation frame.
    const measure = () => {
      const a = track.children[0] as HTMLElement | undefined;
      const b = track.children[1] as HTMLElement | undefined;
      period = a && b ? b.offsetLeft - a.offsetLeft : 0;
      x = wrap(x);
      render();
    };

    const tick = (t: number) => {
      const dt = Math.min(48, t - last);
      last = t;
      if (!dragging) {
        const floor = keyboardFocus ? 0 : rest;
        speed = floor + (speed - floor) * Math.exp(-dt / FRICTION_MS);
        if (speed - floor < 0.5) speed = floor;
        x = wrap(x + (dir * speed * dt) / 1000);
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // The loop only runs while the rail is on screen.
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(el);
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    measure();

    const throwWith = (v: number) => {
      const clamped = Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
      if (Math.abs(clamped) > rest) {
        dir = clamped > 0 ? 1 : -1;
        speed = Math.abs(clamped);
      } else {
        speed = rest;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pressed = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startPos = x;
      lastT = e.timeStamp;
      dragVel = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        el.dataset.dragging = "true";
        try {
          el.setPointerCapture(pointerId);
        } catch {
          // Pointer already gone; the drag still works while over the rail.
        }
      }
      x = wrap(startPos - dx);
      // Smoothed pointer velocity, so one jittery sample can't set the throw.
      const dtMove = e.timeStamp - lastT;
      if (dtMove > 0) {
        const instant = (-(e.clientX - lastX) / dtMove) * 1000;
        dragVel = dragVel * 0.65 + instant * 0.35;
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
      // Holding still before letting go means no throw, just the drift.
      throwWith(e.timeStamp - lastT > 90 ? 0 : dragVel);
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

    // Sideways trackpad / shift-wheel scrolling moves the rail directly.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x = wrap(x + e.deltaX);
      if (e.deltaX !== 0) dir = e.deltaX > 0 ? 1 : -1;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      dir = e.key === "ArrowRight" ? 1 : -1;
      speed = KEY_NUDGE;
    };

    // Keyboard focus on a card link: bring that card to the left edge and
    // hold the rail still so the focused link doesn't slide away.
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target === el || !target.matches(":focus-visible")) return;
      keyboardFocus = true;
      const card = target.closest("article");
      if (card) x = wrap(card.offsetLeft - 20);
      // Focusing can scroll an overflow:hidden box natively; undo that.
      el.scrollLeft = 0;
    };
    const onFocusOut = () => {
      keyboardFocus = false;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
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
      data-cursor="drag"
      className="rail -mx-5 overflow-hidden px-5 md:-mx-10 md:px-10"
    >
      <div ref={trackRef} className="rail-track flex w-max gap-5">
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
    </div>
  );
}
