"use client";

import { useEffect, useState } from "react";

const ZONES: [string, string][] = [
  ["🇺🇸 San Francisco", "America/Los_Angeles"],
  ["🇮🇳 Mumbai", "Asia/Kolkata"],
  ["🇺🇸 New York", "America/New_York"],
  ["🇺🇸 Chicago", "America/Chicago"],
];

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

function getClocks(): ClockData[] {
  const now = new Date();
  return ZONES.map(([city, tz]) => ({
    city,
    time: now.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    day: now.toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  }));
}

export default function HeroSection() {
  const [greeting, setGreeting] = useState("Namaste!");
  const [clocks, setClocks] = useState<ClockData[] | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setClocks(getClocks());
    const interval = setInterval(() => setClocks(getClocks()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="clocks"
      className="hero-gradient relative overflow-hidden rounded-3xl text-white grid gap-8 p-10 lg:grid-cols-[1.25fr_1fr]"
    >
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute -right-28 -top-40 h-[460px] w-[460px] rounded-full border border-white/[0.09]"
        style={{
          boxShadow: "0 0 0 36px rgba(255,255,255,0.035), 0 0 0 75px rgba(255,255,255,0.025)",
        }}
      />

      <div className="relative">
        <div className="text-[11px] font-[800] uppercase tracking-[2px] text-[#f1c784]">
          Your everyday connection
        </div>
        <h1 className="mt-3 font-serif text-[clamp(40px,5vw,70px)] leading-[1.04] tracking-[-2px] font-normal">
          {greeting}
          <br />
          Your world, <em className="text-[#f0c480]">closer.</em>
        </h1>
        <p className="mt-4 max-w-[480px] text-[16px] text-[#d1dee4]">
          Discover Indian events across America, stay connected to home, find
          useful tools and make everyday life a little easier.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#community"
            className="inline-block rounded-[9px] bg-gold px-5 py-3 font-[800] text-[#16283b]"
          >
            Explore what&apos;s happening →
          </a>
          <a
            href="#tools"
            className="inline-block rounded-[9px] border border-white/25 bg-white/[0.06] px-5 py-3 font-[800] text-white"
          >
            Explore free tools
          </a>
        </div>
      </div>

      {/* Live clocks */}
      <div className="relative self-center rounded-[18px] border border-white/15 bg-white/[0.05] p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <b className="text-sm">Across two worlds</b>
          <span className="flex items-center gap-2 text-[11px] font-[750] tracking-[1px]">
            <i className="dot-pulse" />
            LIVE TIME
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(clocks || ZONES.map(([city]) => ({ city, time: "--:--:--", day: "---" }))).map(
            (c) => (
              <div
                key={c.city}
                className="rounded-xl bg-[#091e31]/50 px-3.5 py-3"
              >
                <div className="text-xs text-[#d1dce1]">{c.city}</div>
                <div className="text-[26px] font-[650] leading-tight tracking-[-1px] tabular-nums">
                  {c.time}
                </div>
                <div className="text-[11px] text-[#adbec9]">{c.day}</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
