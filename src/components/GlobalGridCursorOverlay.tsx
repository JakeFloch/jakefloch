"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Build a transitioning gradient between purple and cyan.
function buildGradient(steps: number): string[] {
  const from = [168, 85, 247];
  const to = [6, 182, 212];
  const s = Math.max(2, steps);
  const out: string[] = [];
  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  for (let i = 0; i < s; i++) {
    const t = easeInOut(i / (s - 1));
    out.push(
      [
        Math.round(from[0] + (to[0] - from[0]) * t),
        Math.round(from[1] + (to[1] - from[1]) * t),
        Math.round(from[2] + (to[2] - from[2]) * t),
      ].join(",")
    );
  }
  return out;
}

interface GlobalGridCursorOverlayProps {
  cellSize: number;
  fadeOutSeconds: number;
  intensity: number;
  gradientColors?: string[];
  gradientAdvanceEvery?: number;
  gradientSteps?: number;
  maxFps?: number;
}

export default function GlobalGridCursorOverlay({
  cellSize,
  fadeOutSeconds,
  intensity,
  gradientColors,
  gradientAdvanceEvery = 1,
  gradientSteps = 400,
  maxFps = 120,
}: GlobalGridCursorOverlayProps) {
  const [layout, setLayout] = useState<null | {
    cellSize: number;
    gridWidth: number;
    gridHeight: number;
    rowsCount: number;
    cols: number;
  }>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const prevActiveRef = useRef<number | null>(null);
  const fadeMs = fadeOutSeconds * 1000;
  const [litAt, setLitAt] = useState<
    Record<number, { t: number; ci: number; eh: boolean }>
  >({});
  const [now, setNow] = useState<number>(() =>
    typeof performance !== "undefined" ? performance.now() : Date.now()
  );
  const lastFrameRef = useRef(now);
  const frameInterval = 1000 / Math.max(1, maxFps);
  // Gradient: use provided list or build eased ramp once.
  const gradient = React.useMemo(
    () =>
      gradientColors?.length ? gradientColors : buildGradient(gradientSteps),
    [gradientColors, gradientSteps]
  );
  const colorIndexRef = useRef(0);
  const directionRef = useRef(1); // ping-pong between ends to avoid harsh wrap
  const litCountRef = useRef(0); // advance color every N lit cells
  const nextColorIndex = () => {
    const current = colorIndexRef.current;
    litCountRef.current += 1;
    if (litCountRef.current >= (gradientAdvanceEvery || 1)) {
      litCountRef.current = 0;
      if (gradient.length > 1) {
        let next = colorIndexRef.current + directionRef.current;
        if (next >= gradient.length - 1) {
          next = gradient.length - 1;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        colorIndexRef.current = next;
      }
    }
    return current;
  };

  const compute = useCallback(() => {
    // Clamp very small cell sizes to avoid high DOM counts
    const size = Math.max(4, cellSize);
    const cols = Math.ceil(window.innerWidth / size);
    const rowsCount = Math.ceil(document.documentElement.scrollHeight / size);
    setLayout({
      cellSize: size,
      cols,
      rowsCount,
      gridWidth: cols * size,
      gridHeight: rowsCount * size,
    });
  }, [cellSize]);

  useEffect(() => {
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [compute]);

  useEffect(() => {
    let frame: number;
    const loop = () => {
      const t = performance?.now ? performance.now() : Date.now();
      if (
        t - lastFrameRef.current >= frameInterval &&
        Object.keys(litAt).length
      ) {
        lastFrameRef.current = t;
        setNow(t);
        setLitAt((m) => {
          if (!Object.keys(m).length) return m;
          const updated: typeof m = {};
          for (const k in m) {
            const e = m[k];
            // Drop cells once fully faded
            if (t - e.t < fadeMs) updated[k] = e;
          }
          return updated;
        });
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [frameInterval, fadeMs, litAt]);

  const applyPointer = useCallback(
    (clientX: number, clientY: number, target?: EventTarget | null) => {
      if (!layout) return;
      // Skip drawing when hovering (buttons/links)
      if (
        target instanceof HTMLElement &&
        target.closest("[data-grid-shield]")
      ) {
        prevActiveRef.current = null;
        if (activeId !== null) setActiveId(null);
        return;
      }
      // Slightly enhanced glow for project/about sections
      const enhance = !!(
        target instanceof HTMLElement &&
        (target.closest("#projects") || target.closest("#about"))
      );
      const col = Math.floor(clientX / layout.cellSize);
      const row = Math.floor(clientY / layout.cellSize);
      if (row < 0 || row >= layout.rowsCount || col < 0 || col >= layout.cols)
        return;
      const id = row * layout.cols + col;
      const prev = prevActiveRef.current;
      if (prev !== null && prev !== id) {
        const prevRow = Math.floor(prev / layout.cols);
        const prevCol = prev % layout.cols;
        const dRow = row - prevRow;
        const dCol = col - prevCol;
        const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
        if (steps > 0) {
          const batch: Record<number, { t: number; ci: number; eh: boolean }> =
            {};
          for (let s = 0; s <= steps; s++) {
            const r = Math.round(prevRow + (dRow * s) / steps);
            const c = Math.round(prevCol + (dCol * s) / steps);
            if (r < 0 || r >= layout.rowsCount || c < 0 || c >= layout.cols)
              continue;
            const pathId = r * layout.cols + c;
            if (pathId === id) continue;
            const existing = litAt[pathId];
            batch[pathId] = {
              t: now,
              ci: nextColorIndex(),
              eh: existing ? existing.eh : enhance,
            };
          }
          setLitAt((m) => {
            const merged = { ...m, ...batch };
            const prevExisting = merged[prev];
            merged[prev] = {
              t: now,
              ci: nextColorIndex(),
              eh: prevExisting ? prevExisting.eh : enhance,
            };
            return merged;
          });
        } else {
          setLitAt((m) => {
            const prevExisting = m[prev];
            return {
              ...m,
              [prev]: {
                t: now,
                ci: nextColorIndex(),
                eh: prevExisting ? prevExisting.eh : enhance,
              },
            };
          });
        }
      }
      prevActiveRef.current = id;
      setActiveId(id);
      setLitAt((m) => {
        const existing = m[id];
        return {
          ...m,
          [id]: {
            t: now,
            ci: nextColorIndex(),
            eh: existing ? existing.eh : enhance,
          },
        };
      });
    },
    [layout, litAt, now, activeId]
  );

  useEffect(() => {
    const handler = (e: PointerEvent) =>
      applyPointer(e.clientX, e.clientY, e.target);
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, [applyPointer]);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-10"
      aria-hidden
    >
      {layout && (
        <div
          className="absolute top-0 left-0"
          style={{
            width: layout.gridWidth,
            height: layout.gridHeight,
            backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.02) 0 1px, transparent 1px ${layout.cellSize}px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0 1px, transparent 1px ${layout.cellSize}px)`,
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          }}
        />
      )}
      {layout && (
        <div
          className="absolute top-0 left-0"
          style={{ width: layout.gridWidth, height: layout.gridHeight }}
        >
          {Object.entries(litAt).map(([k, entry]) => {
            const id = Number(k);
            const row = Math.floor(id / layout.cols);
            const col = id % layout.cols;
            let opacity = intensity;
            if (id !== activeId) {
              const elapsed = now - entry.t;
              if (elapsed < fadeMs)
                opacity = intensity * (1 - elapsed / fadeMs);
              else opacity = 0;
            }
            if (opacity <= 0) return null;
            const rgb = gradient[entry.ci] || "212,212,216";
            const enhanced = entry.eh && opacity > 0;
            const f = opacity / intensity;
            return (
              <motion.div
                key={id}
                style={{
                  position: "absolute",
                  left: col * layout.cellSize,
                  top: row * layout.cellSize,
                  width: layout.cellSize,
                  height: layout.cellSize,
                  backgroundColor: `rgba(${rgb},${opacity})`,
                  transition: "none",
                  boxShadow: enhanced
                    ? id === activeId
                      ? `0 0 10px rgba(168,85,247,${
                          0.6 * f
                        }), 0 0 22px rgba(56,189,248,${0.35 * f})`
                      : `0 0 6px rgba(168,85,247,${
                          0.45 * f
                        }), 0 0 14px rgba(56,189,248,${0.25 * f})`
                    : "inset 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
