"use client";
import React, { useEffect, useRef } from "react";

// Custom cursor that appears only over inputs, buttons/links, cards, and nav.
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);
  const variantRef = useRef<"button" | "card" | "input" | null>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const show = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        el.style.opacity = "1";
        document.body.classList.add("custom-cursor-active");
      }
    };
    const hide = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        el.style.opacity = "0";
      }
      document.body.classList.remove("custom-cursor-active");
      el.removeAttribute("data-variant");
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      // Eelements where the cursor should be visible
      const onInput = !!target?.closest(
        'input, textarea, [data-slot="input"], [data-slot="textarea"]'
      );
      const onButton = !!target?.closest(
        'button, a, [role="button"], [data-grid-shield]'
      );
      const onCard = !!target?.closest("[data-surface]"); // shadcn cards, etc.
      const onNav = !!target?.closest("nav.nav-dark");

      // Only show over these targets
      if (!(onInput || onButton || onCard || onNav)) {
        return hide();
      }

      // Priority order: input > button > (card/nav share the same look)
      const v: NonNullable<typeof variantRef.current> = onInput
        ? "input"
        : onButton
        ? "button"
        : "card";
      variantRef.current = v;

      // Size by variant
      let w = 8,
        h = 8;
      if (v === "button") {
        w = 22;
        h = 22;
      } else if (v === "card") {
        w = 18;
        h = 18;
      } else if (v === "input") {
        w = 2;
        h = 22;
      }

      // Directly translate the element instead of using React state
      // for smoother motion without triggering re-renders.
      const x = e.clientX - w / 2;
      const y = e.clientY - h / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.setAttribute("data-variant", v);
      show();
    };

    const onPointerLeave = () => hide();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden />;
}