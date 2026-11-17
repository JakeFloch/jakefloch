"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";

// A looping replay of Harness's demo attack: an agent runs `npm install`, a
// dependency's install script reads .env and uploads it, and Harness pauses
// the agent. Colors follow Harness's own dark palette.
const STEPS = [
  { depth: 0, cmd: "claude", note: "agent" },
  { depth: 1, cmd: 'zsh -lc "npm install"', note: "" },
  { depth: 2, cmd: "npm install", note: "" },
  { depth: 3, cmd: "color-helpers › postinstall", note: "install script", risk: "warn" },
  { depth: 4, cmd: "cat .env", note: "read secrets", risk: "bad" },
  { depth: 4, cmd: "curl -X POST …", note: "uploaded data", risk: "bad" },
] as const;

const LAST = STEPS.length; // one step past the tree: the "paused" banner

function scoreAt(step: number) {
  if (step >= 5) return { value: 20, name: "Act", color: "#ff8d86" };
  if (step >= 4) return { value: 55, name: "Review", color: "#f2bd63" };
  return { value: 100, name: "Clear", color: "#45dcc6" };
}

export default function HarnessDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(LAST);
      return;
    }
    if (!inView) return;
    // Advance one row at a time, hold on the final frame, then replay.
    const timer = setTimeout(
      () => setStep((s) => (s >= LAST ? 0 : s + 1)),
      step >= LAST ? 3800 : step === 0 ? 900 : 650
    );
    return () => clearTimeout(timer);
  }, [inView, reduce, step]);

  const score = scoreAt(step);
  const C = 2 * Math.PI * 20;

  return (
    <div
      ref={ref}
      className="w-full max-w-md overflow-hidden rounded-2xl border border-[#303b41] bg-[#0b0e10] font-mono text-[12.5px] text-[#e8eef0] shadow-2xl shadow-black/60"
      role="img"
      aria-label="Animated replay of Harness catching an install script that reads a .env file and uploads it, then pausing the agent."
    >
      <div className="flex items-center justify-between border-b border-[#303b41] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#fbfaf7]">
            <Image
              src="/harness-pug.png"
              alt=""
              fill
              sizes="36px"
              className="object-contain p-1"
            />
          </span>
          <div className="font-sans">
            <p className="text-sm font-semibold leading-tight">Harness</p>
            <p className="text-xs text-[#a0adb3]">1 agent · watching</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-sans text-xs font-medium transition-colors duration-500"
            style={{ color: score.color }}
          >
            {score.name}
          </span>
          <span className="relative grid h-12 w-12 place-items-center">
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#1a2125" strokeWidth="4" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                stroke={score.color}
                strokeDasharray={C}
                strokeDashoffset={C * (1 - score.value / 100)}
                style={{ transition: "stroke-dashoffset 600ms ease, stroke 500ms" }}
              />
            </svg>
            <span className="relative font-sans text-sm font-semibold tabular-nums">
              {score.value}
            </span>
          </span>
        </div>
      </div>

      <ul className="space-y-1 px-3 py-4">
        {STEPS.map((s, i) => {
          const shown = step > i;
          const risk = "risk" in s ? s.risk : undefined;
          const tone =
            risk === "bad"
              ? "bg-[#ff8d86]/10 text-[#ff8d86]"
              : risk === "warn"
              ? "bg-[#f2bd63]/10 text-[#f2bd63]"
              : "";
          return (
            <li
              key={i}
              className={`flex items-center justify-between gap-3 rounded-md py-1.5 pr-2 transition-all duration-500 ${tone} ${
                shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ paddingLeft: 8 + s.depth * 11 }}
            >
              <span className="truncate">
                {s.depth > 0 && <span className="mr-2 text-[#64747d]">└</span>}
                {s.cmd}
              </span>
              {s.note && (
                <span
                  className={`shrink-0 text-[10.5px] uppercase tracking-wider ${
                    risk ? "" : "text-[#64747d]"
                  }`}
                >
                  {s.note}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={`flex items-center gap-3 border-t border-[#303b41] px-4 py-3 font-sans text-[13px] transition-opacity duration-500 ${
          step >= LAST ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#c4b0f4]/15 text-[10px] text-[#c4b0f4]">
          ❚❚
        </span>
        <span>
          Agent paused by <span className="text-[#45dcc6]">Auto-protect</span>
        </span>
      </div>
    </div>
  );
}
