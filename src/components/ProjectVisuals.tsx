import type { ReactNode } from "react";
import HarnessDemo from "./HarnessDemo";

// Illustrative, code-drawn stand-ins for each project's interface. They are
// sketches of what the product does, not screenshots.

function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-line bg-ink"
    >
      <div className="visual-grid absolute inset-0" />
      <div className="relative scale-[0.82] transition-transform duration-700 ease-out group-hover:scale-[0.87]">
        {children}
      </div>
    </div>
  );
}

// Harness: a replay of its demo attack, shrunk to fit the card.
export function HarnessVisual() {
  return (
    <Frame>
      <div className="w-[26rem] scale-[0.6]">
        <HarnessDemo />
      </div>
    </Frame>
  );
}

// Cornucopia: a phone listing nearby food options with SNAP/EBT flags.
const PLACES = [
  { name: "Farmers market", meta: "0.3 mi · $", snap: true },
  { name: "Corner grocery", meta: "0.6 mi · $$", snap: true },
  { name: "Community pantry", meta: "0.9 mi · Free", snap: false },
  { name: "Food co-op", meta: "1.4 mi · $$", snap: true },
];

export function CornucopiaVisual() {
  return (
    <Frame>
      <div className="translate-y-10 rounded-t-[2rem] border border-b-0 border-white/15 bg-ink-2 p-2.5 pb-0 shadow-2xl shadow-black/70">
        <div className="w-56 rounded-t-[1.4rem] bg-ink-3 px-4 pb-6 pt-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />
          <div className="flex items-baseline justify-between">
            <p className="font-display text-base">Near you</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
              4 places
            </p>
          </div>
          <ul className="mt-3 space-y-2">
            {PLACES.map((p, i) => (
              <li
                key={p.name}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                  i === 0 ? "border-accent/60 bg-accent/10" : "border-white/8"
                }`}
              >
                <div>
                  <p className="text-[12px] font-medium leading-tight">{p.name}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-dim">{p.meta}</p>
                </div>
                {p.snap && (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[8px] font-semibold tracking-wider text-white">
                    SNAP
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

// Raging Gambler: a top-down arena with a player, enemies and shots.
const SHOTS = [
  { dx: "92px", dy: "-58px", delay: "0s" },
  { dx: "120px", dy: "30px", delay: "0.35s" },
  { dx: "-96px", dy: "-44px", delay: "0.7s" },
];

export function RagingGamblerVisual() {
  return (
    <Frame>
      <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/15 bg-ink-2 shadow-2xl shadow-black/70">
        <div className="absolute inset-3 rounded-lg border border-dashed border-white/10" />
        {/* HUD */}
        <div className="absolute inset-x-4 top-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
          <span className="text-fg">$ 1,250</span>
          <span className="rounded-full border border-accent/60 px-2 py-0.5 text-accent">
            Wager ×2
          </span>
        </div>
        <div className="absolute bottom-3 left-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-5 rounded-full ${i < 2 ? "bg-fg" : "bg-white/15"}`}
            />
          ))}
        </div>
        {/* Enemies */}
        <span className="bob absolute left-[72%] top-[24%] h-5 w-5 rounded-[5px] bg-white/25" />
        <span
          className="bob absolute left-[84%] top-[62%] h-5 w-5 rounded-[5px] bg-white/25"
          style={{ animationDelay: "0.8s" }}
        />
        <span
          className="bob absolute left-[14%] top-[26%] h-5 w-5 rounded-[5px] bg-white/25"
          style={{ animationDelay: "1.4s" }}
        />
        {/* Chips on the floor */}
        <span className="absolute left-[30%] top-[70%] h-2.5 w-2.5 rounded-full border-2 border-accent" />
        <span className="absolute left-[60%] top-[78%] h-2.5 w-2.5 rounded-full border-2 border-accent" />
        {/* Player and its shots */}
        <div className="absolute left-[44%] top-[50%]">
          {SHOTS.map((s) => (
            <span
              key={s.delay}
              className="shot absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-accent"
              style={
                {
                  "--dx": s.dx,
                  "--dy": s.dy,
                  animationDelay: s.delay,
                } as React.CSSProperties
              }
            />
          ))}
          <span className="relative block h-6 w-6 rounded-full bg-fg shadow-[0_0_0_6px_rgb(255_255_255/0.08)]" />
        </div>
      </div>
    </Frame>
  );
}

// Invitide: an event ticket with a QR code for check-in.
const QR = 15;
function qrCell(x: number, y: number) {
  const finder = (cx: number, cy: number) => {
    const dx = x - cx;
    const dy = y - cy;
    if (dx < 0 || dy < 0 || dx > 4 || dy > 4) return null;
    const edge = dx === 0 || dy === 0 || dx === 4 || dy === 4;
    return edge || (dx === 2 && dy === 2);
  };
  for (const [cx, cy] of [
    [0, 0],
    [QR - 5, 0],
    [0, QR - 5],
  ]) {
    const hit = finder(cx, cy);
    if (hit !== null) return hit;
  }
  // Clear a quiet row/column beside each finder, then a fixed pattern.
  if ((x === 5 && (y < 6 || y > QR - 7)) || (y === 5 && (x < 6 || x > QR - 7)))
    return false;
  if (x === QR - 6 && y < 6) return false;
  if (y === QR - 6 && x < 6) return false;
  return (x * 7 + y * 13 + x * y) % 3 === 0 || (x + y * 2) % 5 === 0;
}

export function InvitideVisual() {
  const cells: ReactNode[] = [];
  for (let y = 0; y < QR; y++)
    for (let x = 0; x < QR; x++)
      if (qrCell(x, y))
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);

  return (
    <Frame>
      <div className="flex w-[21rem] overflow-hidden rounded-2xl border border-white/15 bg-ink-2 shadow-2xl shadow-black/70">
        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-accent">
            Sat · 8:00 PM
          </p>
          <p className="mt-2 font-display text-xl leading-[1.05]">
            Rooftop movie night
          </p>
          <div className="mt-3 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-white/12" />
            <span className="block h-1.5 w-4/5 rounded-full bg-white/12" />
            <span className="block h-1.5 w-3/5 rounded-full bg-white/12" />
          </div>
          <div className="mt-auto flex items-center gap-2 pt-5">
            <div className="flex -space-x-1.5">
              {["bg-fg", "bg-accent", "bg-dim", "bg-white/30"].map((c) => (
                <span
                  key={c}
                  className={`h-5 w-5 rounded-full border-2 border-ink-2 ${c}`}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-dim">
              42 going
            </span>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-2 border-l border-dashed border-white/20 p-4">
          <div className="relative overflow-hidden rounded-lg bg-fg p-2">
            <svg viewBox={`0 0 ${QR} ${QR}`} className="h-24 w-24 fill-ink">
              {cells}
            </svg>
            <span
              className="scan absolute inset-x-0 top-1 h-0.5 bg-accent shadow-[0_0_10px_2px_rgb(51_120_255/0.8)]"
              style={{ "--scan": "100px" } as React.CSSProperties}
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-dim">
            Check in
          </span>
        </div>
      </div>
    </Frame>
  );
}

// GalleryBoard: the teacher's live grid of student whiteboards.
const BOARDS = [
  "M8 30 C 18 6, 30 6, 36 22 S 54 38, 62 12",
  "M10 12 L 30 12 L 30 30 L 10 30 Z M40 34 L 60 10",
  "M8 34 Q 22 4, 36 22 T 62 20",
  "M12 10 L 12 32 M12 21 L 28 21 M28 10 L 28 32 M40 10 L 40 32 L 58 32",
  "M35 8 A 13 13 0 1 0 35.1 8 M35 21 L 46 14",
  "M8 14 L 20 30 L 32 12 L 44 30 L 60 12",
];

export function GalleryBoardVisual() {
  return (
    <Frame>
      <div className="w-[21rem] rounded-2xl border border-white/15 bg-ink-2 p-4 shadow-2xl shadow-black/70">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
          <span className="text-fg">
            Room <span className="text-accent">4F7K2</span>
          </span>
          <span className="flex items-center gap-1.5 text-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            6 live
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {BOARDS.map((d, i) => (
            <div
              key={i}
              className={`rounded-lg border bg-fg p-1 ${
                i === 1 ? "border-accent ring-2 ring-accent/40" : "border-transparent"
              }`}
            >
              <svg viewBox="0 0 70 42" className="w-full">
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`draw ${i === 1 ? "stroke-accent" : "stroke-ink"}`}
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
