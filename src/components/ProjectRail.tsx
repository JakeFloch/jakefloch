"use client";
import { useEffect, useRef, type ReactNode } from "react";

const DRIFT = 30; // resting speed, px per second — the rail never goes slower
const FRICTION_MS = 700; // time constant for a throw easing back to DRIFT
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag
const MAX_FLING = 5000; // px per second
const KEY_NUDGE = 1100; // px per second given by an arrow key
// The animation's clock starts this many loops in, so playing it backwards
// (after a throw to the right) never runs into time zero.
const HEADROOM_LOOPS = 10000;

// A horizontal strip of cards that drifts on its own and loops seamlessly.
// `sets` are identical copies of the same cards laid end to end.
//
// The drift is a Web Animations API animation on the track's transform, so
// the browser runs it on the compositor: it costs the main thread nothing,
// even while the page scrolls. JavaScript only steps in while the rail is
// being dragged, and for the second or two a throw takes to settle, by
// seeking the animation or changing its playback rate. The rate never drops
// below the drift speed, so the rail only stands still while it is held.
export default function ProjectRail({ sets }: { sets: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let anim: Animation | null = null;
    let period = 0; // px in one copy of the cards
    let duration = 1; // ms for one loop at drift speed
    let dir = 1; // 1 moves the cards left, -1 right
    let visible = false;
    let keyboardFocus = false;

    // ---- Dragging ----
    let pressed = false;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastMoveT = 0;
    let dragVel = 0;
    let suppressClick = false;

    // Position helpers: x is px scrolled, in [0, period).
    const timeFor = (x: number) =>
      (HEADROOM_LOOPS + ((x % period) + period) % period / period) * duration;
    const currentX = () => {
      if (!anim || period <= 0) return 0;
      const t = Number(anim.currentTime ?? 0);
      return (((t % duration) + duration) % duration / duration) * period;
    };

    // Speed easing after a throw or key press: one small rAF loop that only
    // runs until the rate is back to the drift.
    let rate = 1; // multiple of DRIFT, always >= 1 in magnitude unless held
    let settleRaf = 0;
    let lastT = 0;
    const setRate = (r: number) => {
      rate = r;
      if (!anim) return;
      const effective = reduce || keyboardFocus ? 0 : r;
      if (effective === 0) anim.pause();
      else {
        anim.playbackRate = effective;
        if (visible && anim.playState !== "running") anim.play();
      }
    };
    const settle = (t: number) => {
      const dt = Math.min(48, t - lastT);
      lastT = t;
      const mag = 1 + (Math.abs(rate) - 1) * Math.exp(-dt / FRICTION_MS);
      if (mag - 1 < 0.02) {
        setRate(dir);
        settleRaf = 0;
        return;
      }
      setRate(dir * mag);
      settleRaf = requestAnimationFrame(settle);
    };
    const throwAt = (pxPerSec: number) => {
      cancelAnimationFrame(settleRaf);
      const v = Math.max(-MAX_FLING, Math.min(MAX_FLING, pxPerSec));
      if (Math.abs(v) > DRIFT) dir = v > 0 ? 1 : -1;
      if (reduce || Math.abs(v) <= DRIFT) {
        setRate(dir);
        return;
      }
      setRate(v / DRIFT);
      lastT = performance.now();
      settleRaf = requestAnimationFrame(settle);
    };

    // (Re)build the animation for the current card widths, keeping place.
    const build = () => {
      const a = track.children[0] as HTMLElement | undefined;
      const b = track.children[1] as HTMLElement | undefined;
      const next = a && b ? b.offsetLeft - a.offsetLeft : 0;
      if (next <= 0 || next === period) return;
      const x = period > 0 ? currentX() * (next / period) : 0;
      anim?.cancel();
      period = next;
      duration = (period / DRIFT) * 1000;
      anim = track.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(${-period}px, 0, 0)` },
        ],
        { duration, iterations: Infinity, easing: "linear" }
      );
      anim.currentTime = timeFor(x);
      if (!visible) anim.pause();
      setRate(rate);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!anim) return;
      if (visible && !dragging) setRate(rate);
      else anim.pause();
    });
    io.observe(el);
    const ro = new ResizeObserver(build);
    ro.observe(track);
    build();

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pressed = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      lastMoveT = e.timeStamp;
      dragVel = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId || !anim) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        cancelAnimationFrame(settleRaf);
        anim.pause();
        startPos = currentX() + dx; // so the rail doesn't jump by the threshold
        el.dataset.dragging = "true";
        try {
          el.setPointerCapture(pointerId);
        } catch {
          // Pointer already gone; the drag still works while over the rail.
        }
      }
      anim.currentTime = timeFor(startPos - dx);
      // Smoothed pointer velocity, so one jittery sample can't set the throw.
      const dtMove = e.timeStamp - lastMoveT;
      if (dtMove > 0) {
        const instant = (-(e.clientX - lastX) / dtMove) * 1000;
        dragVel = dragVel * 0.65 + instant * 0.35;
      }
      lastX = e.clientX;
      lastMoveT = e.timeStamp;
    };

    const onUp = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return;
      pressed = false;
      if (!dragging) return;
      dragging = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      // Holding still before letting go means no throw, just the drift.
      throwAt(e.timeStamp - lastMoveT > 90 ? 0 : dragVel);
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
      if (!anim || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      anim.currentTime = timeFor(currentX() + e.deltaX);
      if (e.deltaX !== 0) {
        dir = e.deltaX > 0 ? 1 : -1;
        if (!settleRaf) setRate(dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      throwAt(e.key === "ArrowRight" ? KEY_NUDGE : -KEY_NUDGE);
    };

    // Keyboard focus on a card link: bring that card to the left edge and
    // hold the rail still so the focused link doesn't slide away.
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target === el || !target.matches(":focus-visible") || !anim) return;
      keyboardFocus = true;
      const card = target.closest("article");
      if (card) anim.currentTime = timeFor(card.offsetLeft - 20);
      setRate(rate);
      // Focusing can scroll an overflow:hidden box natively; undo that.
      el.scrollLeft = 0;
    };
    const onFocusOut = () => {
      if (!keyboardFocus) return;
      keyboardFocus = false;
      setRate(rate);
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
      cancelAnimationFrame(settleRaf);
      anim?.cancel();
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
