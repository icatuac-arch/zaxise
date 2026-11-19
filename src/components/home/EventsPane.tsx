"use client";

import { useState, useEffect } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  metro_area: string;
  category: string;
  price: string;
  image_url: string;
  slug: string;
  short_id: string;
}

const REGIONS: { label: string; metro: string }[] = [
  { label: "San Francisco Bay Area", metro: "Bay Area" },
  { label: "Dallas–Fort Worth", metro: "Dallas" },
  { label: "Seattle", metro: "Seattle" },
  { label: "New York / New Jersey", metro: "New York" },
  { label: "Chicago", metro: "Chicago" },
  { label: "Houston", metro: "Houston" },
  { label: "Atlanta", metro: "Atlanta" },
  { label: "Los Angeles", metro: "LA" },
  { label: "Washington DC", metro: "DC" },
  { label: "Phoenix", metro: "Phoenix" },
  { label: "Austin", metro: "Austin" },
  { label: "Philadelphia", metro: "Philadelphia" },
];

const CATEGORY_ICONS: Record<string, string> = {
  vocal: "♫",
  dance: "💃",
  instrumental: "🎵",
  standup: "🎤",
  play: "🎭",
  movies: "🎬",
  festival: "🎉",
  competition: "🏆",
  poetry: "📜",
};

const ICON_BG = ["#eee9ff", "#dcf6ef", "#fff0e6", "#ffe8f1", "#e4edff"];

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EventsPane() {
  const [regionIdx, setRegionIdx] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const region = REGIONS[regionIdx];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/portal/events?metro=${encodeURIComponent(region.metro)}&limit=5`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [region.metro]);

  return (
    <section
      id="community"
      className="rounded-[20px] border border-[#ebebf3] bg-white p-[21px]"
      style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="text-[20px] font-[750] leading-[1.25]"
            style={{ letterSpacing: "-0.5px" }}
          >
            Happening near you
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Indian culture, music &amp; community
          </p>
        </div>
        <select
          value={regionIdx}
          onChange={(e) => setRegionIdx(Number(e.target.value))}
          className="rounded-[10px] border border-line bg-[#f8f8fc] px-2 py-[7px] text-[12px] text-ink"
          aria-label="Choose your city"
        >
          {REGIONS.map((r, i) => (
            <option key={r.metro} value={i}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Feed label */}
      <div className="flex justify-between gap-2.5 mt-3 mb-0.5 text-[10px] tracking-[0.06em] text-[#77758a]">
        <span>UPCOMING EVENTS</span>
        <span>via IndianPrograms.com</span>
      </div>

      {/* Region title */}
      <div className="text-[14px] font-[700] text-[#5643bd] mb-1">
        {region.label}
      </div>

      {/* Event rows */}
      <div>
        {loading ? (
          <div className="py-8 text-center text-[13px] text-muted">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-muted">
            No upcoming events in {region.label}. Try another city.
          </div>
        ) : (
          events.map((event, i) => (
            <a
              key={event.id}
              href={`https://indianprograms.com/e/${event.slug || event.short_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-[11px] border-b border-[#ebeaf2] min-h-[76px] transition-colors hover:bg-[#fafafe] -mx-2 px-2 rounded-lg"
            >
              {/* Event image or category icon */}
              <div
                className="w-14 h-14 rounded-[14px] grid place-items-center text-[26px] shrink-0 overflow-hidden"
                style={{ background: ICON_BG[i % ICON_BG.length] }}
              >
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  CATEGORY_ICONS[event.category] || "🎶"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <b className="block text-[14px] leading-snug line-clamp-1">
                  {event.title}
                </b>
                <small className="block text-[12px] text-[#77758a] mt-[3px]">
                  {formatEventDate(event.date)}
                  {event.time ? ` · ${event.time}` : ""}
                  {event.venue ? ` · ${event.venue}` : ""}
                </small>
                <small className="block text-[12px] text-[#77758a]">
                  {event.city}, {event.state}
                </small>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <span className="text-[11px] text-[#6d50df] capitalize">
                  {event.category}
                </span>
                {event.price && (
                  <div className="text-[12px] font-[600] text-[#087d64] mt-0.5">
                    {event.price === "0" || event.price === "Free"
                      ? "Free"
                      : `$${event.price}`}
                  </div>
                )}
              </div>
            </a>
          ))
        )}
      </div>

      <a
        href="https://indianprograms.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
      >
        Browse all events on IndianPrograms ↗
      </a>
    </section>
  );
}
