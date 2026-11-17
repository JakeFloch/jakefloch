"use client";
import { useEffect, useRef } from "react";

// The site's only cursor. A white dot that inverts whatever is beneath it,
// grows over links and buttons, thins to a caret over text fields, and turns
// into a labelled "drag" disc over anything marked data-cursor="drag".
// The system pointer is hidden while this is mounted (html.custom-cursor);
// touch devices never mount it. Only transforms and opacity are animated.
export default function CursorFollower() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = document.documentElement;
    // Hide the system pointer for as long as this component is mounted, not
    // from the first move, so the two can never be on screen together.
    root.classList.add("custom-cursor");

    let state = "";
    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      el.dataset.state = next;
    };
    const hide = () => {
      el.dataset.visible = "false";
    };

    const classify = (target: Element | null) =>
      setState(
        target?.closest("input, textarea")
          ? "text"
          : target?.closest("a, button")
          ? "active"
          : target?.closest('[data-cursor="drag"]')
          ? "drag"
          : "idle"
      );

    let px = -1;
    let py = -1;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      // Tracks the pointer 1:1 — any lag makes a replacement cursor feel off.
      el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      classify(e.target as Element | null);
      if (el.dataset.visible !== "true") el.dataset.visible = "true";
    };

    // Scrolling moves the page under a still pointer; re-check what's there
    // so the cursor doesn't keep the shape of something that scrolled away.
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame || px < 0) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        classify(document.elementFromPoint(px, py));
      });
    };

    const onDown = () => {
      el.dataset.pressed = "true";
    };
    const onUp = () => {
      el.dataset.pressed = "false";
    };

    // window doesn't reliably fire pointerleave; a pointerout with no
    // relatedTarget means the pointer left the document entirely.
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
      root.classList.remove("custom-cursor");
      hide();
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden>
      <span className="cursor-dot" />
      <span className="cursor-label">
        <span>‹</span>drag<span>›</span>
      </span>
    </div>
  );
}
