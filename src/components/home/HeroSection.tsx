"use client";

import { useEffect, useState } from "react";

const ALL_ZONES: { label: string; tz: string }[] = [
  { label: "🇺🇸 San Francisco", tz: "America/Los_Angeles" },
  { label: "🇮🇳 Mumbai", tz: "Asia/Kolkata" },
  { label: "🇺🇸 New York", tz: "America/New_York" },
  { label: "🇺🇸 Chicago", tz: "America/Chicago" },
  { label: "🇮🇳 Delhi", tz: "Asia/Kolkata" },
  { label: "🇮🇳 Bangalore", tz: "Asia/Kolkata" },
  { label: "🇮🇳 Chennai", tz: "Asia/Kolkata" },
  { label: "🇮🇳 Kolkata", tz: "Asia/Kolkata" },
  { label: "🇮🇳 Hyderabad", tz: "Asia/Kolkata" },
  { label: "🇮🇳 Pune", tz: "Asia/Kolkata" },
  { label: "🇺🇸 Dallas", tz: "America/Chicago" },
  { label: "🇺🇸 Houston", tz: "America/Chicago" },
  { label: "🇺🇸 Seattle", tz: "America/Los_Angeles" },
  { label: "🇺🇸 Boston", tz: "America/New_York" },
  { label: "🇺🇸 Atlanta", tz: "America/New_York" },
  { label: "🇺🇸 Denver", tz: "America/Denver" },
  { label: "🇺🇸 Phoenix", tz: "America/Phoenix" },
  { label: "🇺🇸 DC", tz: "America/New_York" },
  { label: "🇬🇧 London", tz: "Europe/London" },
  { label: "🇦🇪 Dubai", tz: "Asia/Dubai" },
  { label: "🇸🇬 Singapore", tz: "Asia/Singapore" },
  { label: "🇯🇵 Tokyo", tz: "Asia/Tokyo" },
  { label: "🇦🇺 Sydney", tz: "Australia/Sydney" },
];

const DEFAULT_SELECTIONS = [0, 1, 2, 3]; // SF, Mumbai, NY, Chicago

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 17) return "Good afternoon!";
  return "Good evening!";
}

interface ClockData {
  city: string;
  time: string;
  day: string;
}

function getClocks(indices: number[]): ClockData[] {
  const now = new Date();
  return indices.map((i) => {
    const zone = ALL_ZONES[i] || ALL_ZONES[0];
    return {
      city: zone.label,
      time: now.toLocaleTimeString("en-US", {
        timeZone: zone.tz,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      day: now.toLocaleDateString("en-US", {
        timeZone: zone.tz,
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });
}

function loadSavedClocks(): number[] {
  try {
    const saved = localStorage.getItem("zaxise_clocks");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 4) return parsed;
    }
  } catch {}
  return DEFAULT_SELECTIONS;
}

export default function HeroSection() {
  const [greeting, setGreeting] = useState("Namaste!");
  const [selections, setSelections] = useState<number[]>(DEFAULT_SELECTIONS);
  const [clocks, setClocks] = useState<ClockData[] | null>(null);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const saved = loadSavedClocks();
    setSelections(saved);
    setClocks(getClocks(saved));
    const interval = setInterval(() => {
      setSelections((s) => {
        setClocks(getClocks(s));
        return s;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateClock = (slotIndex: number, zoneIndex: number) => {
    const next = [...selections];
    next[slotIndex] = zoneIndex;
    setSelections(next);
    setClocks(getClocks(next));
    localStorage.setItem("zaxise_clocks", JSON.stringify(next));
    setEditing(null);
  };

  return (
    <section
      id="clocks"
      className="hero-gradient relative overflow-hidden rounded-[28px] text-[#29232B] grid gap-8 p-[45px_44px] lg:grid-cols-[1.25fr_1fr]"
    >
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute rounded-full border border-white/60"
        style={{
          width: 420,
          height: 420,
          right: -45,
          top: -135,
          boxShadow: "0 0 0 36px rgba(255,255,255,0.19), 0 0 0 75px rgba(255,255,255,0.145)",
        }}
      />

      <div className="relative">
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#801C45]">
          Built for the Indian-American community
        </div>
        <h1
          className="mt-[18px] mb-[18px] text-[clamp(38px,5vw,65px)] leading-[1.04] font-[780]"
          style={{ letterSpacing: "-3.4px" }}
        >
          {greeting}
          <br />
          Your world, <em className="not-italic font-[780] text-[#801C45]">closer.</em>
        </h1>
        <p className="max-w-[480px] text-[16px] leading-[1.65] text-[#65545F]">
          Discover Indian events across America, stay connected to home, find
          useful tools and make everyday life a little easier.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#community"
            className="inline-block rounded-[12px] bg-[#801C45] px-5 py-3 text-[13px] font-[700] text-white transition-all hover:bg-[#631437] hover:-translate-y-0.5"
            style={{ boxShadow: "0 5px 12px rgba(128,28,69,0.18)" }}
          >
            Explore what&apos;s happening →
          </a>
          <a
            href="#tools"
            className="inline-block rounded-[12px] border border-[#E9DFE4] bg-white/80 px-5 py-3 text-[13px] font-[700] text-[#801C45]"
          >
            Explore free tools
          </a>
        </div>
      </div>

      {/* Live clocks */}
      <div
        className="relative self-center rounded-[24px] border border-white/80 bg-white/[0.86] p-5"
        style={{ boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <b className="text-[15px]">Across two worlds</b>
          <span className="flex items-center gap-2 text-[11px] font-[750] tracking-[0.5px] text-green">
            <i className="dot-pulse" />
            LIVE TIME
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[10px]">
          {(clocks || DEFAULT_SELECTIONS.map(() => ({ city: "---", time: "--:--:--", day: "---" }))).map(
            (c, i) => (
              <div
                key={i}
                className="relative rounded-[15px] border border-[#E9DFE4] bg-white px-3 py-3.5 cursor-pointer hover:border-[#801C45]/30 transition-colors"
                onClick={() => setEditing(editing === i ? null : i)}
              >
                <div className="text-[12px] font-[650] text-muted">{c.city}</div>
                <div
                  className="text-[clamp(18px,2.15vw,27px)] font-[750] leading-tight tabular-nums text-[#29232B] whitespace-nowrap"
                  style={{ letterSpacing: "-1px" }}
                >
                  {c.time}
                </div>
                <div className="text-[11px] text-[#71646C]">{c.day}</div>
                {/* City picker dropdown */}
                {editing === i && (
                  <div
                    className="absolute left-0 top-full mt-1 z-20 w-[180px] max-h-[200px] overflow-y-auto rounded-xl border border-[#E9DFE4] bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ALL_ZONES.map((zone, zi) => (
                      <button
                        key={zone.label}
                        onClick={() => updateClock(i, zi)}
                        className={`block w-full text-left px-3 py-2 text-[12px] hover:bg-[#F3E6ED] transition-colors ${
                          selections[i] === zi ? "font-bold text-[#801C45] bg-[#F3E6ED]" : ""
                        }`}
                      >
                        {zone.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <p className="mt-2 text-[9px] text-center text-[#71646C]/60">Click a clock to change city</p>
      </div>
    </section>
  );
}
