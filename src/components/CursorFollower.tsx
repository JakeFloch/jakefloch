"use client";
import { useEffect, useRef } from "react";

// The site's only cursor: a white dot that inverts whatever is beneath it,
// grows over links and buttons, and becomes a caret over text fields. The
// system pointer is hidden while it runs (html.custom-cursor), and comes back
// on touch devices or if this never starts.
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

    const hide = () => {
      el.dataset.visible = "false";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Tracks the pointer 1:1 — any lag makes a replacement cursor feel off.
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      const target = e.target as Element | null;
      const onText = !!target?.closest("input, textarea");
      const onAction = !!target?.closest("a, button, [data-cursor]");
      el.dataset.state = onText ? "text" : onAction ? "active" : "idle";
      el.dataset.visible = "true";
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
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
      root.classList.remove("custom-cursor");
      hide();
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
