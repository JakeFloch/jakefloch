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

      // Cold dots are plain squares in one fill colour; only the handful
      // near the pointer pay for a colour string and an arc.
      ctx.fillStyle = "#f4f4f5";
      const near = mouse.x > -RADIUS && mouse.y > -RADIUS;
      for (let y = GAP / 2; y < h; y += GAP) {
        const cy = Math.cos(y * 0.008 - time * 0.45);
        const dy = y - mouse.y;
        const rowNear = near && dy > -RADIUS && dy < RADIUS;
        for (let x = GAP / 2; x < w; x += GAP) {
          const alpha = 0.11 + 0.09 * Math.sin(x * 0.006 + time * 0.7) * cy;
          if (rowNear) {
            const dx = x - mouse.x;
            const d2 = dx * dx + dy * dy;
            if (d2 < RADIUS * RADIUS) {
              const d = Math.sqrt(d2) || 1;
              const f = 1 - d / RADIUS;
              const hot = f * f;
              // white (244,244,245) -> blue (51,120,255) as the dot heats up
              const r = Math.round(244 - 193 * hot);
              const g = Math.round(244 - 124 * hot);
              ctx.globalAlpha = Math.min(1, alpha + hot * 0.8);
              ctx.fillStyle = `rgb(${r},${g},255)`;
              ctx.beginPath();
              ctx.arc(
                x + (dx / d) * hot * 16,
                y + (dy / d) * hot * 16,
                1 + hot * 2.4,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.fillStyle = "#f4f4f5";
              continue;
            }
          }
          ctx.globalAlpha = alpha;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
      ctx.globalAlpha = 1;
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
