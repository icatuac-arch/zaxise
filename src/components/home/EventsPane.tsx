"use client";

import { useState } from "react";

const REGIONS = [
  "San Francisco Bay Area",
  "Dallas–Fort Worth",
  "Seattle",
  "New York / New Jersey",
  "Chicago",
  "All USA",
];

const REGION_TITLES: Record<string, string> = {
  "San Francisco Bay Area": "the Bay Area",
  "Dallas–Fort Worth": "Dallas–Fort Worth",
  Seattle: "Seattle",
  "New York / New Jersey": "New York / New Jersey",
  Chicago: "Chicago",
  "All USA": "communities across the USA",
};

export default function EventsPane() {
  const [region, setRegion] = useState("San Francisco Bay Area");

  return (
    <section
      id="community"
      className="rounded-[17px] border border-line bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-[23px]">Events near you</h3>
          <p className="mt-1 text-[13px] text-muted">
            Powered by IndianPrograms.com
          </p>
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-line bg-white px-2 py-[7px] text-sm text-ink"
          aria-label="Region"
        >
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="event-gradient relative mt-4 overflow-hidden rounded-xl px-6 py-6 text-white">
        {/* Decorative */}
        <div className="pointer-events-none absolute -right-2 -top-14 text-[200px] leading-none text-white/[0.07]">
          ✳
        </div>
        <div className="relative">
          <div className="text-[11px] font-[800] uppercase tracking-[2px] text-green-light/80">
            Find your people
          </div>
          <h4 className="mt-2 font-serif text-[28px] font-normal">
            Explore {REGION_TITLES[region] || region}
          </h4>
          <p className="mt-2 text-[#d1e2de]">
            Concerts, festivals, cultural gatherings and more.
          </p>
          <a
            href="https://indianprograms.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-[9px] bg-gold px-5 py-3 font-[800] text-[#16283b]"
          >
            Browse Indian events ↗
          </a>
        </div>
      </div>
    </section>
  );
}
