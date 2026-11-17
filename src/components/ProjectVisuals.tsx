import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import HarnessDemo from "./HarnessDemo";

// Code-drawn recreations of each project's real interface, using the layout,
// copy and colours from that project's own source. Sample data (names,
// addresses, amounts) is made up. Every visual fills a 350 x 219 frame.

const PIXEL: CSSProperties = { fontFamily: "var(--font-pixel), monospace" };

function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative aspect-[16/10] overflow-hidden border-b border-line ${className}`}
    >
      {children}
    </div>
  );
}

// Harness: a replay of its demo attack, in its own dashboard colours.
export function HarnessVisual() {
  return (
    <Frame className="bg-ink">
      <div className="visual-grid absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 w-[26rem] -translate-x-1/2 -translate-y-1/2 scale-[0.6]">
        <HarnessDemo />
      </div>
    </Frame>
  );
}

// Cornucopia: the app's home tab — search, filter chips, the Food
// Walkability card and the "Nearest Options" list.
const OPTIONS = [
  {
    emoji: "🛒",
    name: "Neighborhood Market",
    distance: "0.3 mi",
    type: "Supermarket",
    snap: true,
    price: "$",
    address: "214 Oak Street",
  },
  {
    emoji: "🥫",
    name: "Community Food Pantry",
    distance: "0.6 mi",
    type: "Food Pantry",
    snap: false,
    price: "",
    address: "58 Church Avenue",
  },
];

export function CornucopiaVisual() {
  return (
    <Frame className="bg-[#f5f7fb]">
      {/* Laid out at phone width, then scaled to the frame. */}
      <div className="absolute left-0 top-0 w-[515px] origin-top-left scale-[0.68] p-4 font-sans text-[#0f172a]">
        <div className="flex items-center rounded-2xl border border-[#94a3b8]/25 bg-white/85 px-3.5 py-2.5">
          <svg viewBox="0 0 16 16" className="mr-2.5 h-4 w-4 fill-none stroke-[#64748b] stroke-2">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] text-[#94a3b8]">
            Search by name or address
          </span>
        </div>

        <div className="mt-3 flex gap-2.5 text-[13px]">
          <span className="rounded-full bg-[#1d4ed8] px-3.5 py-1.5 font-semibold text-white">
            All
          </span>
          <span className="rounded-full border border-[#166534]/20 bg-[#166534]/8 px-3.5 py-1.5 font-bold text-[#166534]">
            SNAP/EBT
          </span>
          {["$", "$$", "$$$", "Bakery"].map((f) => (
            <span
              key={f}
              className="rounded-full border border-[#94a3b8]/20 bg-[#0f172a]/6 px-3.5 py-1.5 text-[#475569]"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-3.5 rounded-[22px] border border-[#6366f1]/25 bg-[#6366f1]/10 px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-semibold text-[#312e81]">
              Food Walkability
            </span>
            <span className="text-[22px] font-bold text-[#16a34a]">Good</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0f172a]/15">
            <div className="h-full w-[78%] rounded-full bg-[#16a34a]" />
          </div>
          <p className="mt-2 text-[12px] text-[#0f172a]">
            Plenty of options within a short walk.
          </p>
        </div>

        <p className="mb-2 mt-4 text-[18px] font-semibold">Nearest Options</p>
        <ul className="space-y-2.5">
          {OPTIONS.map((o) => (
            <li
              key={o.name}
              className="flex items-center rounded-[20px] border border-[#94a3b8]/25 bg-white/92 px-3.5 py-3 shadow-[0_6px_14px_rgb(15_23_42/0.06)]"
            >
              <span className="mr-3.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0f172a]/6 text-[18px]">
                {o.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[16px] font-semibold">
                    {o.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-[#3b82f6]/12 px-2.5 py-0.5 text-[12px] font-semibold text-[#1d4ed8]">
                    {o.distance}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8]" />
                  <span className="text-[12px] text-[#64748b]">{o.type}</span>
                  {o.snap && (
                    <span className="rounded-[10px] border border-[#166534]/20 bg-[#166534]/8 px-2 text-[11px] font-bold text-[#166534]">
                      SNAP
                    </span>
                  )}
                  {o.price && (
                    <span className="rounded-[10px] border border-[#6366f1]/25 bg-[#6366f1]/12 px-2 text-[11px] font-bold text-[#4338ca]">
                      {o.price}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-[13px] text-[#475569]">
                  📍 {o.address}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

// Raging Gambler: a top-down casino floor in the game's pixel-art style,
// with the health bar, money and level HUD.
const SHOTS = [
  { dx: "34px", dy: "-18px", delay: "0s" },
  { dx: "34px", dy: "-18px", delay: "0.45s" },
];

export function RagingGamblerVisual() {
  return (
    <Frame className="bg-[#4a0f1b]">
      <svg
        viewBox="0 0 176 110"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="rg-carpet" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#5a1422" />
            <rect width="8" height="8" fill="#661828" />
            <rect x="8" y="8" width="8" height="8" fill="#661828" />
            <rect x="3" y="3" width="2" height="2" fill="#7d2434" />
            <rect x="11" y="11" width="2" height="2" fill="#7d2434" />
          </pattern>
        </defs>
        <g shapeRendering="crispEdges">
          <rect width="176" height="110" fill="url(#rg-carpet)" />
          {/* Back wall with gold trim */}
          <rect width="176" height="15" fill="#1c0a10" />
          <rect y="15" width="176" height="2" fill="#d4a72c" />
          {/* Slot machines against the wall */}
          {[104, 122, 140].map((sx) => (
            <g key={sx}>
              <rect x={sx} y="17" width="12" height="14" fill="#2b2f3a" />
              <rect x={sx + 2} y="19" width="8" height="5" fill="#f4f4f5" />
              <rect x={sx + 3} y="20" width="2" height="3" fill="#dc2626" />
              <rect x={sx + 7} y="20" width="2" height="3" fill="#dc2626" />
              <rect x={sx + 2} y="26" width="8" height="2" fill="#d4a72c" />
            </g>
          ))}
          {/* Card tables */}
          {[
            [18, 36],
            [124, 72],
          ].map(([tx, ty]) => (
            <g key={tx}>
              <rect x={tx} y={ty} width="36" height="22" fill="#5a3a1a" />
              <rect x={tx + 2} y={ty + 2} width="32" height="18" fill="#0f6b3c" />
              <rect x={tx + 6} y={ty + 6} width="4" height="6" fill="#f4f4f5" />
              <rect x={tx + 12} y={ty + 6} width="4" height="6" fill="#f4f4f5" />
              <rect x={tx + 24} y={ty + 10} width="3" height="3" fill="#dc2626" />
              <rect x={tx + 28} y={ty + 8} width="3" height="3" fill="#d4a72c" />
            </g>
          ))}
          {/* Coins on the floor */}
          {[
            [66, 84],
            [96, 40],
            [44, 74],
          ].map(([cx, cy]) => (
            <g key={cx}>
              <rect x={cx} y={cy} width="4" height="4" fill="#d4a72c" />
              <rect x={cx + 1} y={cy + 1} width="1" height="1" fill="#fde68a" />
            </g>
          ))}
          {/* Enemies */}
          {[
            [118, 44, "0s"],
            [146, 52, "0.7s"],
            [70, 30, "1.3s"],
          ].map(([ex, ey, delay]) => (
            <g
              key={ex}
              className="bob"
              style={{ animationDelay: delay as string }}
            >
              <rect x={ex} y={ey} width="8" height="8" fill="#7c3aed" />
              <rect x={Number(ex) + 1} y={Number(ey) + 2} width="2" height="2" fill="#fff" />
              <rect x={Number(ex) + 5} y={Number(ey) + 2} width="2" height="2" fill="#fff" />
              <rect x={ex} y={Number(ey) + 8} width="2" height="2" fill="#5b21b6" />
              <rect x={Number(ex) + 6} y={Number(ey) + 8} width="2" height="2" fill="#5b21b6" />
            </g>
          ))}
          {/* Shots */}
          {SHOTS.map((s) => (
            <rect
              key={s.delay}
              x="88"
              y="60"
              width="3"
              height="2"
              fill="#fde047"
              className="shot"
              style={
                {
                  "--dx": s.dx,
                  "--dy": s.dy,
                  animationDelay: s.delay,
                } as CSSProperties
              }
            />
          ))}
          {/* Player in a top hat */}
          <rect x="78" y="56" width="8" height="9" fill="#f1e4cf" />
          <rect x="78" y="61" width="8" height="5" fill="#1f2937" />
          <rect x="80" y="58" width="1" height="1" fill="#111" />
          <rect x="83" y="58" width="1" height="1" fill="#111" />
          <rect x="76" y="54" width="12" height="2" fill="#0b0b0c" />
          <rect x="78" y="49" width="8" height="5" fill="#0b0b0c" />
          <rect x="78" y="52" width="8" height="1" fill="#dc2626" />
          <rect x="86" y="60" width="5" height="2" fill="#9ca3af" />
          {/* Crosshair */}
          <g fill="#fff">
            <rect x="128" y="36" width="1" height="3" />
            <rect x="128" y="42" width="1" height="3" />
            <rect x="124" y="40" width="3" height="1" />
            <rect x="130" y="40" width="3" height="1" />
          </g>
          {/* HUD: health */}
          <rect x="5" y="4" width="46" height="7" fill="#0b0b0c" />
          <rect x="6" y="5" width="30" height="5" fill="#dc2626" />
          <rect x="6" y="5" width="30" height="1" fill="#f87171" />
        </g>
        <text x="57" y="11" fontSize="9" fill="#fde047" style={PIXEL}>
          $250
        </text>
        <text x="171" y="11" fontSize="9" fill="#f4f4f5" textAnchor="end" style={PIXEL}>
          LEVEL 3
        </text>
      </svg>
    </Frame>
  );
}

// Invitide: the landing page — cream on charcoal, thick borders, pixel type
// and the octopus mascot with its speech bubble.
export function InvitideVisual() {
  const cream = "#E4DDC4";
  return (
    <Frame className="bg-[#1F1F1F]">
      <div
        className="absolute inset-0 flex flex-col p-3.5 uppercase"
        style={{ color: cream }}
      >
        <div className="flex items-center justify-between font-mono">
          <span className="text-[13px] tracking-tight">Invitide</span>
          <span className="flex gap-1.5 text-[7px]">
            {["Login", "Sign up"].map((l) => (
              <span key={l} className="border-2 px-1.5 py-0.5" style={{ borderColor: cream }}>
                {l}
              </span>
            ))}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-between gap-2">
          <div style={PIXEL}>
            <p className="text-[31px] leading-[0.95]">
              Ride the wave
              <br />
              of connection.
            </p>
            <p className="mt-2 text-[12px] leading-none">
              Create or join an event in seconds.
            </p>
            <div className="mt-3 flex gap-2 font-sans text-[8px] font-medium">
              {["Create event", "My events"].map((l) => (
                <span key={l} className="border-2 px-2 py-1" style={{ borderColor: cream }}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center">
            <div
              className="relative rounded-md border-[3px] px-2 py-1 text-center text-[11px] leading-tight shadow-[3px_3px_0_#000]"
              style={{ ...PIXEL, borderColor: cream }}
            >
              Let&apos;s plan
              <br />
              your event!
              <span
                className="absolute -bottom-[8px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent"
                style={{ borderTopColor: cream }}
              />
            </div>
            <div className="bob relative mt-2 h-[84px] w-[84px]">
              <Image
                src="/invitide_logo.png"
                alt=""
                fill
                sizes="84px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// GalleryBoard: the teacher's view — class code header over a grid of live
// student whiteboards, on the app's faint graph-paper background.
const BOARDS = [
  { name: "Maya", d: "M8 30 C 18 6, 30 6, 36 22 S 54 38, 62 12" },
  { name: "Leo", d: "M12 10 L 12 32 M12 21 L 28 21 M28 10 L 28 32 M40 10 L 40 32 L 58 32" },
  { name: "Priya", d: "M10 12 L 30 12 L 30 30 L 10 30 Z M40 34 L 60 10" },
  { name: "Sam", d: "M8 34 Q 22 4, 36 22 T 62 20" },
  { name: "Ava", d: "M8 14 L 20 30 L 32 12 L 44 30 L 60 12" },
  { name: "Noah", d: "M22 21 A 13 13 0 1 0 48 21 A 13 13 0 1 0 22 21" },
];

export function GalleryBoardVisual() {
  return (
    <Frame className="bg-white">
      <div
        className="absolute inset-0 p-3.5 font-sans"
        style={{
          backgroundImage:
            "linear-gradient(to right, #73737320 1px, transparent 1px), linear-gradient(to bottom, #73737320 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 shadow-sm">
          <p className="text-[15px] font-bold leading-tight text-black">
            Class Code: 4F7K2
          </p>
          <p className="text-[10px] text-[#6b7280]">Connected Students: 6</p>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {BOARDS.map((b, i) => (
            <div
              key={b.name}
              className="relative rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-sm"
            >
              <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ef4444] text-[7px] font-bold leading-none text-white">
                X
              </span>
              <svg viewBox="0 0 70 42" className="w-full rounded-sm border border-[#e5e7eb] bg-white">
                <path
                  d={b.d}
                  pathLength={1}
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="draw"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              </svg>
              <p className="mt-1 text-center text-[9px] text-black">{b.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
