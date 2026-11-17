"use client";
import { useEffect, useRef } from "react";

const GAP = 30; // px between dots
const RADIUS = 200; // px of pointer influence

// Canvas dot grid that drifts on its own and bulges, brightens and warms
// around the pointer. Pauses when scrolled out of view.
export default function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0,
      running = false;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const draw = (t: number) => {
      const time = t / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;
      ctx.clearRect(0, 0, w, h);

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const wave =
            Math.sin(x * 0.006 + time * 0.7) * Math.cos(y * 0.008 - time * 0.45);
          let alpha = 0.11 + 0.09 * wave;
          let size = 1;
          let px = x;
          let py = y;
          let hot = 0;

          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / RADIUS;
            hot = f * f;
            px += (dx / d) * hot * 16;
            py += (dy / d) * hot * 16;
            size += hot * 2.4;
            alpha += hot * 0.8;
          }

          // white (244,244,245) -> blue (51,120,255) as the dot heats up
          const r = Math.round(244 - 193 * hot);
          const g = Math.round(244 - 124 * hot);
          const b = Math.round(245 + 10 * hot);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, alpha)})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) onLeave();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(canvas);
    resize();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onLeave);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
