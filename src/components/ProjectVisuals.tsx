import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

// Code-drawn recreations of each project's real interface, using the layout,
// copy and colours from that project's own source. Sample data (names,
// addresses, amounts) is made up. Every visual fills a 350 x 219 frame and
// is static: looping animations here were the main source of scroll lag.

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

// Shared backdrop for the window and phone mockups.
function Stage({ children }: { children: ReactNode }) {
  return (
    <Frame className="bg-ink">
      <div className="visual-grid absolute inset-0" />
      {children}
    </Frame>
  );
}

// Harness: the desktop app's Alerts view in its dark theme, mid-incident —
// the sidebar with agents and score, the purple "paused" banner, and the
// alert list. Colours, sizes and wording follow public/styles.css and app.js.
const H = {
  bg: "#1e1f21",
  side: "#262729",
  sep: "rgba(255,255,255,.08)",
  text: "#ececee",
  text2: "#a1a1a7",
  icon: "#5fd4c1",
  red: "#ff6b62",
  purple: "#c792fa",
  amber: "#f2b44f",
  green: "#3ccf6e",
  stripe: "rgba(255,255,255,.022)",
  field: "rgba(255,255,255,.07)",
  sel: "rgba(255,255,255,.09)",
};

const ICON: Record<string, string> = {
  house: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  pause: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM10 15V9M14 15V9",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  key: "M15.5 7.5 19 4m2-2-9.6 9.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zM15.5 7.5l3 3L22 7l-3-3",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  box: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  terminal: "M4 17l6-6-6-6M12 19h8",
  shield: "M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4",
  settings: "M20 7h-9M14 17H5M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
};

function HIcon({ name, color, size = 15 }: { name: string; color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d={ICON[name]} />
    </svg>
  );
}

const ALERTS = [
  { icon: "pause", title: "Harness paused Claude Code", verdict: "Paused", tone: H.purple, when: "now" },
  { icon: "upload", title: "Uploaded data to 203.0.113.9", verdict: "Dangerous", tone: H.red, when: "4s" },
  { icon: "key", title: "Claude Code got hold of a decoy secret: aws_credentials", verdict: "Dangerous", tone: H.red, when: "5s" },
  { icon: "file", title: "Opened a .env file in my-app", verdict: "Risky", tone: H.red, when: "5s" },
  { icon: "box", title: "color-helpers ran an install script", verdict: "Worth a look", tone: H.amber, when: "6s" },
  { icon: "terminal", title: "Ran npm install", verdict: "Note", tone: "#94c7ff", when: "8s" },
];

export function HarnessVisual() {
  const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
  return (
    <Stage>
      <div className="absolute left-[15px] top-[14px] h-[400px] w-[640px] origin-top-left scale-50">
        <div
          className="flex h-full overflow-hidden rounded-[10px] shadow-[0_24px_60px_rgb(0_0_0/0.6)] ring-1 ring-white/12"
          style={{ background: H.bg, color: H.text, fontFamily: font, fontSize: 13, lineHeight: 1.4 }}
        >
          {/* Sidebar */}
          <div className="flex w-[176px] shrink-0 flex-col px-2.5 pb-2.5" style={{ background: H.side, borderRight: `1px solid ${H.sep}` }}>
            <div className="flex h-[46px] items-center gap-[7px] px-1">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="h-[11px] w-[11px] rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="mb-1 flex items-center gap-2 px-2">
              <span className="relative h-5 w-5">
                <Image src="/harness-pug.png" alt="" fill sizes="20px" className="object-contain" />
              </span>
              <span className="flex-1 text-[13px] font-semibold">Harness</span>
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: H.green }} />
            </div>
            {[
              { icon: "house", label: "Home" },
              { icon: "activity", label: "Activity" },
              { icon: "bell", label: "Alerts", count: "5", on: true },
            ].map((it) => (
              <div
                key={it.label}
                className="flex h-7 items-center gap-2 rounded-md px-2"
                style={{ background: it.on ? H.sel : undefined }}
              >
                <HIcon name={it.icon} color={H.icon} />
                <span className="flex-1">{it.label}</span>
                {it.count && <span className="text-[12px] font-semibold" style={{ color: H.red }}>{it.count}</span>}
              </div>
            ))}
            <p className="px-2 pb-1 pt-3.5 text-[11px] font-semibold" style={{ color: H.text2 }}>Agents</p>
            {[
              { label: "Claude Code", dot: H.purple },
              { label: "Codex", dot: H.green },
            ].map((a) => (
              <div key={a.label} className="flex h-7 items-center gap-2 rounded-md px-2">
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: a.dot }} />
                <span className="flex-1 truncate">{a.label}</span>
              </div>
            ))}
            <div className="mt-auto pt-2.5" style={{ borderTop: `1px solid ${H.sep}` }}>
              <div className="grid gap-1.5 rounded-md px-2 pb-2 pt-1.5">
                <div className="flex items-baseline justify-between">
                  <span style={{ color: H.text2 }}>Safety score</span>
                  <span style={{ color: H.text2 }}>
                    <b className="text-[20px] font-semibold tracking-[-0.02em]" style={{ color: H.text }}>28</b> / 100
                  </span>
                </div>
                <span className="block h-1 overflow-hidden rounded-sm" style={{ background: "rgba(255,255,255,.1)" }}>
                  <span className="block h-full w-[28%] rounded-sm" style={{ background: H.red }} />
                </span>
                <span className="text-[12px] font-semibold" style={{ color: H.red }}>Act</span>
              </div>
              <div className="flex h-7 items-center gap-2 px-2">
                <HIcon name="shield" color={H.icon} />
                <span className="flex-1">Auto-protect</span>
                <span className="text-[12px]" style={{ color: H.text2 }}>On</span>
              </div>
              <div className="flex h-7 items-center gap-2 px-2">
                <HIcon name="settings" color={H.icon} />
                <span>Settings</span>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-[52px] shrink-0 items-center gap-3 pl-5 pr-3.5" style={{ borderBottom: `1px solid ${H.sep}` }}>
              <div className="min-w-0 flex-1 leading-[1.25]">
                <p className="text-[13px] font-semibold">Alerts</p>
                <p className="truncate text-[11px]" style={{ color: H.text2 }}>
                  Risky moments and what Harness did about them
                </p>
              </div>
              <div className="flex h-7 w-[120px] items-center gap-1.5 rounded-[7px] px-2 text-[12px]" style={{ background: H.field, color: H.text2 }}>
                <HIcon name="search" size={13} />
                Search
              </div>
            </div>

            <div
              className="flex shrink-0 items-center gap-2.5 py-[9px] pl-5 pr-3.5"
              style={{ background: "color-mix(in srgb, #c792fa 9%, #1e1f21)", borderBottom: `1px solid ${H.sep}` }}
            >
              <HIcon name="pause" color={H.purple} size={16} />
              <p className="min-w-0 flex-1 truncate">
                <b className="font-semibold">Harness paused Claude Code in my-app.</b>{" "}
                <span style={{ color: H.text2 }}>It sent data to a server Harness doesn&apos;t recognize.</span>
              </p>
              <span className="flex h-[26px] items-center rounded-md px-3 text-[12px]" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                Let It Continue
              </span>
              <span className="flex h-[26px] items-center rounded-md bg-[#e5484d] px-3 text-[12px] font-medium text-white">
                End Session
              </span>
            </div>

            <div
              className="grid h-7 shrink-0 items-center pl-3 pr-4 text-[11px] font-medium"
              style={{ gridTemplateColumns: "minmax(0,1fr) 104px 62px", color: H.text2, borderBottom: `1px solid ${H.sep}` }}
            >
              <span className="pl-[22px]">What happened</span>
              <span className="pl-2.5" style={{ borderLeft: `1px solid ${H.sep}` }}>Verdict</span>
              <span className="pl-2.5" style={{ borderLeft: `1px solid ${H.sep}` }}>When</span>
            </div>
            <ul className="flex-1 pb-2 pt-1">
              {ALERTS.map((r, i) => (
                <li
                  key={r.title}
                  className="mx-1.5 grid h-[30px] items-center rounded-md pl-1.5 pr-2.5"
                  style={{
                    gridTemplateColumns: "minmax(0,1fr) 104px 62px",
                    background: i === 1 ? "#13705f" : i % 2 ? H.stripe : undefined,
                  }}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="w-3" />
                    <HIcon name={r.icon} size={14} color={i === 1 ? "#fff" : H.text2} />
                    <span className="truncate">{r.title}</span>
                  </span>
                  <span className="flex items-center gap-[7px] pl-2.5" style={{ color: i === 1 ? "#fff" : r.tone }}>
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: i === 1 ? "#fff" : r.tone }} />
                    {r.verdict}
                  </span>
                  <span className="pl-2.5 tabular-nums" style={{ color: i === 1 ? "rgba(255,255,255,.82)" : H.text2 }}>
                    {r.when}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex h-[26px] shrink-0 items-center px-5 text-[11px]" style={{ borderTop: `1px solid ${H.sep}`, color: H.text2 }}>
              <span className="flex-1">6 alerts · Watching 2 agents</span>
              <span>Activity log stored on this computer</span>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

// Cornucopia: two phones showing the app's home tab — the hero, search,
// filter chips and Food Walkability card, then the "Nearest Options" list.
// Built at real phone size (390pt wide) and scaled down.
const OPTIONS = [
  { emoji: "🛒", name: "Neighborhood Market", distance: "0.3 mi", type: "Supermarket", snap: true, price: "$", address: "214 Oak Street" },
  { emoji: "🥫", name: "Community Food Pantry", distance: "0.6 mi", type: "Food Pantry", snap: false, price: "", address: "58 Church Avenue" },
  { emoji: "🥦", name: "Saturday Farmers Market", distance: "0.8 mi", type: "Greengrocer", snap: true, price: "$$", address: "Park Plaza" },
  { emoji: "🍲", name: "Grace Soup Kitchen", distance: "1.1 mi", type: "Soup Kitchen", snap: false, price: "", address: "9 Elm Court" },
];

function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute w-[390px] origin-top-left scale-[0.385] rounded-[56px] bg-[#0b0b0c] p-[11px] shadow-[0_30px_80px_rgb(0_0_0/0.7)] ring-1 ring-white/15 ${className}`}
    >
      <div className="h-[760px] overflow-hidden rounded-[46px] bg-[#f5f7fb] font-sans text-[#0f172a]">
        <div className="relative flex h-[52px] items-center justify-between px-8 text-[16px] font-semibold">
          <span>9:41</span>
          <span className="absolute left-1/2 top-[11px] h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-[#0b0b0c]" />
          <span className="flex items-center gap-1.5">
            <span className="flex items-end gap-[2px]">
              {[5, 8, 11, 14].map((h) => (
                <span key={h} className="w-[3px] rounded-sm bg-[#0f172a]" style={{ height: h }} />
              ))}
            </span>
            <span className="ml-1 h-[12px] w-[24px] rounded-[4px] border-2 border-[#0f172a] p-[1px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-[#0f172a]" />
            </span>
          </span>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  );
}

function OptionCard({ o }: { o: (typeof OPTIONS)[number] }) {
  return (
    <div className="flex items-center rounded-[20px] border border-[#94a3b8]/25 bg-white/92 px-4 py-3.5 shadow-[0_6px_14px_rgb(15_23_42/0.06)]">
      <span className="mr-3.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0f172a]/6 text-[18px]">
        {o.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[17px] font-semibold">{o.name}</span>
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
        <p className="mt-1 truncate text-[13px] text-[#475569]">📍 {o.address}</p>
      </div>
    </div>
  );
}

export function CornucopiaVisual() {
  return (
    <Stage>
      {/* Home: hero, search, filters, walkability */}
      <Phone className="left-[22px] top-[16px]">
        <p className="mt-2 text-[36px] font-bold leading-tight">Cornucopia</p>
        <p className="mt-1 text-[16px] text-[#475569]">
          Fresh, dignified food access wherever you stand.
        </p>
        <div className="mt-5 flex items-center rounded-2xl border border-[#94a3b8]/25 bg-white/85 px-3.5 py-3">
          <svg viewBox="0 0 16 16" className="mr-2.5 h-4 w-4 fill-none stroke-[#64748b] stroke-2">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" strokeLinecap="round" />
          </svg>
          <span className="text-[16px] text-[#94a3b8]">Search by name or address</span>
        </div>
        <div className="mt-3 flex gap-2.5 overflow-hidden text-[13px]">
          <span className="shrink-0 rounded-full bg-[#1d4ed8] px-3.5 py-1.5 font-semibold text-white">All</span>
          <span className="shrink-0 rounded-full border border-[#166534]/20 bg-[#166534]/8 px-3.5 py-1.5 font-bold text-[#166534]">
            SNAP/EBT
          </span>
          {["$", "$$", "$$$", "Bakery"].map((f) => (
            <span key={f} className="shrink-0 rounded-full border border-[#94a3b8]/20 bg-[#0f172a]/6 px-3.5 py-1.5 text-[#475569]">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-[22px] border border-[#6366f1]/25 bg-[#6366f1]/10 px-[18px] py-4">
          <p className="text-[15px] font-semibold text-[#312e81]">Food Walkability</p>
          <p className="my-1.5 text-[30px] font-bold leading-tight text-[#16a34a]">Good</p>
          <div className="h-2 overflow-hidden rounded-full bg-[#0f172a]/15">
            <div className="h-full w-[78%] rounded-full bg-[#16a34a]" />
          </div>
          <p className="mt-2 text-[13px]">Plenty of options within a short walk.</p>
          <p className="mt-1 text-[12px] text-[#475569]">Tap to learn how we calculate this</p>
        </div>
        <div className="my-5 h-px bg-[#94a3b8]/25" />
        <p className="text-[20px] font-semibold">Nearest Options</p>
      </Phone>

      {/* Scrolled: the list */}
      <Phone className="left-[186px] top-[36px]">
        <div className="mb-3 mt-2 flex items-baseline justify-between">
          <p className="text-[20px] font-semibold">Nearest Options</p>
          <p className="text-[12px] text-[#64748b]">Updated 2:14 PM</p>
        </div>
        <div className="space-y-3">
          {OPTIONS.map((o) => (
            <OptionCard key={o.name} o={o} />
          ))}
        </div>
      </Phone>
    </Stage>
  );
}

// Raging Gambler: a top-down casino floor in the game's pixel-art style,
// with the health bar, money and level HUD.
// Two bullets in flight from the player toward the crosshair.
const SHOTS = [
  [96, 56],
  [110, 49],
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
            [118, 44],
            [146, 52],
            [70, 30],
          ].map(([ex, ey]) => (
            <g key={ex}>
              <rect x={ex} y={ey} width="8" height="8" fill="#7c3aed" />
              <rect x={ex + 1} y={ey + 2} width="2" height="2" fill="#fff" />
              <rect x={ex + 5} y={ey + 2} width="2" height="2" fill="#fff" />
              <rect x={ex} y={ey + 8} width="2" height="2" fill="#5b21b6" />
              <rect x={ex + 6} y={ey + 8} width="2" height="2" fill="#5b21b6" />
            </g>
          ))}
          {/* Shots */}
          {SHOTS.map(([bx, by]) => (
            <rect key={bx} x={bx} y={by} width="3" height="2" fill="#fde047" />
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
            <div className="relative mt-2 h-[84px] w-[84px]">
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

// GalleryBoard: the teacher's view in a browser window — the class code card
// over a four-column grid of live student whiteboards, on the app's faint
// graph-paper background. Built at desktop size and scaled down.
const BOARDS = [
  { name: "Maya", color: "#000", d: "M10 52 C 26 10, 46 10, 56 38 S 86 66, 104 20" },
  { name: "Leo", color: "#2563eb", d: "M18 18 L 18 62 M18 40 L 44 40 M44 18 L 44 62 M62 18 L 62 62 L 92 62" },
  { name: "Priya", color: "#000", d: "M14 20 L 48 20 L 48 56 L 14 56 Z M62 62 L 100 16" },
  { name: "Sam", color: "#dc2626", d: "M10 60 Q 34 6, 56 40 T 104 34" },
  { name: "Ava", color: "#000", d: "M12 26 L 30 58 L 48 22 L 66 58 L 84 22 L 102 52" },
  { name: "Noah", color: "#16a34a", d: "M36 40 A 20 20 0 1 0 76 40 A 20 20 0 1 0 36 40 M56 20 L 56 60" },
  { name: "Zoe", color: "#000", d: "M14 58 L 34 22 L 54 58 M22 44 L 46 44 M66 22 L 66 58 L 98 58" },
  { name: "Eli", color: "#2563eb", d: "M14 40 C 30 14, 44 66, 60 40 S 90 14, 104 40" },
];

export function GalleryBoardVisual() {
  return (
    <Stage>
      <div className="absolute left-[15px] top-[14px] w-[760px] origin-top-left scale-[0.42]">
        <div className="overflow-hidden rounded-[12px] bg-white font-sans shadow-[0_24px_60px_rgb(0_0_0/0.6)] ring-1 ring-white/12">
          <div className="flex h-[38px] items-center gap-2 border-b border-[#e5e7eb] bg-[#f3f4f6] px-4">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
            ))}
            <span className="mx-auto flex h-6 w-[300px] items-center justify-center rounded-md bg-white text-[12px] text-[#6b7280]">
              galleryboard.vercel.app
            </span>
          </div>
          <div
            className="p-8"
            style={{
              backgroundImage:
                "linear-gradient(to right, #73737320 1px, transparent 1px), linear-gradient(to bottom, #73737320 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="mb-6 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-black">Class Code: 4F7K2</p>
              <p className="text-[#6b7280]">Connected Students: 8</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {BOARDS.map((b) => (
                <div key={b.name} className="relative rounded-lg border border-[#e2e8f0] bg-white p-4 shadow-sm">
                  <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#ef4444] text-[12px] text-white">
                    X
                  </span>
                  <svg viewBox="0 0 116 80" className="w-full rounded border border-[#e5e7eb] bg-white">
                    <path
                      d={b.d}
                      fill="none"
                      stroke={b.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-center text-sm text-black">{b.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

