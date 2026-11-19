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
      className="hero-gradient relative overflow-hidden rounded-[28px] text-[#202039] grid gap-8 p-[45px_44px] lg:grid-cols-[1.25fr_1fr]"
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
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#6546d9]">
          Built for the Indian-American community
        </div>
        <h1
          className="mt-[18px] mb-[18px] text-[clamp(38px,5vw,65px)] leading-[1.04] font-[780]"
          style={{ letterSpacing: "-3.4px" }}
        >
          {greeting}
          <br />
          Your world, <em className="not-italic font-[780] text-[#6747e8]">closer.</em>
        </h1>
        <p className="max-w-[480px] text-[16px] leading-[1.65] text-[#555971]">
          Discover Indian events across America, stay connected to home, find
          useful tools and make everyday life a little easier.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#community"
            className="inline-block rounded-[12px] bg-[#6849ed] px-5 py-3 text-[13px] font-[700] text-white transition-all hover:bg-[#5234d5] hover:-translate-y-0.5"
            style={{ boxShadow: "0 5px 12px rgba(104,73,237,0.13)" }}
          >
            Explore what&apos;s happening →
          </a>
          <a
            href="#tools"
            className="inline-block rounded-[12px] border border-[#ded7fa] bg-white/60 px-5 py-3 text-[13px] font-[700] text-[#413775]"
          >
            Explore free tools
          </a>
        </div>
      </div>

      {/* Live clocks */}
      <div
        className="relative self-center rounded-[24px] border border-white bg-white/[0.66] p-5"
        style={{ boxShadow: "0 12px 35px rgba(59,56,103,0.047)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <b className="text-[15px]">Across two worlds</b>
          <span className="flex items-center gap-2 text-[11px] font-[750] tracking-[0.5px] text-green">
            <i className="dot-pulse" />
            LIVE TIME
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[10px]">
          {(clocks || ZONES.map(([city]) => ({ city, time: "--:--:--", day: "---" }))).map(
            (c) => (
              <div
                key={c.city}
                className="rounded-[15px] border border-[#eeedf6] bg-white px-3 py-3.5"
              >
                <div className="text-[12px] font-[650] text-muted">{c.city}</div>
                <div
                  className="text-[clamp(18px,2.15vw,27px)] font-[750] leading-tight tabular-nums text-[#24233a] whitespace-nowrap"
                  style={{ letterSpacing: "-1px" }}
                >
                  {c.time}
                </div>
                <div className="text-[11px] text-[#73778b]">{c.day}</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
