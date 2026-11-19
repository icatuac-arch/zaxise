"use client";

import { useState } from "react";

const REGIONS = [
  "San Francisco Bay Area",
  "Dallas–Fort Worth",
  "Seattle",
  "New York / New Jersey",
  "Chicago",
  "Houston",
  "Atlanta",
  "Los Angeles",
];

const CITY_EVENTS: Record<string, string[]> = {
  "San Francisco Bay Area": ["Marathi music & cinema", "Community cultural gathering", "Indian classical concert"],
  "Dallas–Fort Worth": ["Indian musical evening", "Community festival gathering", "Classical arts showcase"],
  "Seattle": ["Indian music night", "Community arts meetup", "Cultural celebration"],
  "New York / New Jersey": ["Bollywood music night", "Desi community meetup", "Indian classical arts"],
  "Chicago": ["Indian cultural evening", "Community get-together", "Music & dance showcase"],
  "Houston": ["Indian music showcase", "Community celebration", "Classical concert"],
  "Atlanta": ["Cultural arts evening", "Indian community meetup", "Music showcase"],
  "Los Angeles": ["Indian cinema evening", "Community cultural gathering", "Live music showcase"],
};

const ICONS = ["♫", "✦", "♪"];
const ICON_BG = ["#eee9ff", "#dcf6ef", "#fff0e6"];
const EVENT_TYPES = ["Music", "Community", "Arts"];

export default function EventsPane() {
  const [region, setRegion] = useState("San Francisco Bay Area");

  const events = CITY_EVENTS[region] || [];

  return (
    <section
      id="community"
      className="rounded-[20px] border border-[#ebebf3] bg-white p-[21px]"
      style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-[750] leading-[1.25]" style={{ letterSpacing: "-0.5px" }}>
            Happening near you
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Indian culture, music &amp; community
          </p>
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-[10px] border border-line bg-[#f8f8fc] px-2 py-[7px] text-[12px] text-ink"
          aria-label="Choose your city"
        >
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Feed label */}
      <div className="flex justify-between gap-2.5 mt-3 mb-0.5 text-[10px] tracking-[0.06em] text-[#77758a]">
        <span>LOCAL SPOTLIGHT</span>
        <span>Illustrative listings</span>
      </div>

      {/* Region title */}
      <div className="text-[14px] font-[700] text-[#5643bd] mb-1">{region}</div>

      {/* Event rows */}
      <div>
        {events.map((name, i) => (
          <div
            key={name}
            className="flex items-center gap-3 py-[11px] border-b border-[#ebeaf2] min-h-[76px]"
          >
            <div
              className="w-14 h-14 rounded-[14px] grid place-items-center text-[26px] shrink-0"
              style={{ background: ICON_BG[i] }}
            >
              {ICONS[i]}
            </div>
            <div className="min-w-0 flex-1">
              <b className="block text-[14px]">{name}</b>
              <small className="block text-[12px] text-[#77758a] mt-[3px]">
                {region} · Date &amp; venue TBD
              </small>
            </div>
            <span className="ml-auto text-[11px] text-[#6d50df] shrink-0">
              {EVENT_TYPES[i]}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://indianprograms.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
      >
        Explore real events on IndianPrograms ↗
      </a>
    </section>
  );
}
