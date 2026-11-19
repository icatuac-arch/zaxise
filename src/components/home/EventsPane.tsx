"use client";

import { useState, useEffect, useCallback } from "react";

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
  language: string;
  price: string;
  image_url: string;
  short_id: string;
}

const REGIONS: { label: string; metro: string }[] = [
  { label: "All Cities", metro: "" },
  { label: "San Francisco Bay Area", metro: "Bay Area" },
  { label: "Dallas–Fort Worth", metro: "Dallas" },
  { label: "Seattle", metro: "Seattle" },
  { label: "New York", metro: "New York" },
  { label: "New Jersey", metro: "NJ" },
  { label: "Chicago", metro: "Chicago" },
  { label: "Houston", metro: "Houston" },
  { label: "Atlanta", metro: "Atlanta" },
  { label: "Los Angeles", metro: "LA" },
  { label: "Washington DC", metro: "DC" },
  { label: "Phoenix", metro: "Phoenix" },
  { label: "Austin", metro: "Austin" },
  { label: "Philadelphia", metro: "Philadelphia" },
  { label: "Boston", metro: "Boston" },
  { label: "Denver", metro: "Denver" },
  { label: "San Diego", metro: "San Diego" },
  { label: "Orlando", metro: "Orlando" },
  { label: "Tampa", metro: "Tampa" },
];

const CATEGORIES = [
  { label: "All Types", value: "" },
  { label: "🎤 Vocal / Concert", value: "vocal" },
  { label: "💃 Dance", value: "dance" },
  { label: "🎬 Movies", value: "movies" },
  { label: "🎭 Theater / Play", value: "play" },
  { label: "😂 Standup Comedy", value: "standup" },
  { label: "🎉 Festival", value: "festival" },
  { label: "📜 Poetry", value: "poetry" },
];

const LANGUAGES = [
  { label: "All Languages", value: "" },
  { label: "Hindi", value: "Hindi" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Marathi", value: "Marathi" },
  { label: "Bengali", value: "Bengali" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "English", value: "English" },
  { label: "Multilingual", value: "Multilingual" },
  { label: "Urdu", value: "Urdu" },
];

const CATEGORY_ICONS: Record<string, string> = {
  vocal: "🎤",
  dance: "💃",
  instrumental: "🎵",
  standup: "😂",
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
  const [regionIdx, setRegionIdx] = useState(1); // Default: Bay Area
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [dateRange, setDateRange] = useState(""); // "", "this-week", "this-month", or custom date
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const region = REGIONS[regionIdx];

  const fetchEvents = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (region.metro) params.set("metro", region.metro);
    if (category) params.set("category", category);
    if (language) params.set("language", language);
    params.set("limit", "8");

    // Date range
    if (dateRange === "this-week") {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      params.set("dateTo", end.toISOString().split("T")[0]);
    } else if (dateRange === "this-month") {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      params.set("dateTo", end.toISOString().split("T")[0]);
    } else if (dateRange === "next-month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      params.set("dateFrom", start.toISOString().split("T")[0]);
      params.set("dateTo", end.toISOString().split("T")[0]);
    }

    fetch(`/api/portal/events?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [region.metro, category, language, dateRange]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const activeFilterCount =
    (category ? 1 : 0) + (language ? 1 : 0) + (dateRange ? 1 : 0);

  return (
    <section
      id="community"
      className="rounded-[20px] border border-[#ebebf3] bg-white p-[21px]"
      style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
    >
      {/* Header */}
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
            <option key={r.metro + i} value={i}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters row */}
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-[8px] border border-line bg-[#f8f8fc] px-2 py-[5px] text-[11px] text-ink"
          aria-label="Event type"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-[8px] border border-line bg-[#f8f8fc] px-2 py-[5px] text-[11px] text-ink"
          aria-label="Language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-[8px] border border-line bg-[#f8f8fc] px-2 py-[5px] text-[11px] text-ink"
          aria-label="Date range"
        >
          <option value="">Any Date</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="next-month">Next Month</option>
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setCategory("");
              setLanguage("");
              setDateRange("");
            }}
            className="rounded-[8px] bg-[#eee9ff] px-2 py-[5px] text-[11px] font-[600] text-[#6245d9] hover:bg-[#e2dbff] transition-colors"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* Feed label */}
      <div className="flex justify-between gap-2.5 mt-3 mb-0.5 text-[10px] tracking-[0.06em] text-[#77758a]">
        <span>UPCOMING EVENTS</span>
        <span>via IndianPrograms.com</span>
      </div>

      {/* Event rows */}
      <div>
        {loading ? (
          <div className="py-10 text-center text-[13px] text-muted">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-muted">
            No upcoming events match your filters.
            {activeFilterCount > 0 && " Try broadening your search."}
          </div>
        ) : (
          events.map((event, i) => (
            <a
              key={event.id}
              href={`https://indianprograms.com/e/${event.short_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-[11px] border-b border-[#ebeaf2] min-h-[76px] transition-colors hover:bg-[#fafafe] -mx-2 px-2 rounded-lg"
            >
              {/* Event image or category icon */}
              <div
                className="w-14 h-14 rounded-[14px] grid place-items-center text-[22px] shrink-0 overflow-hidden"
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
                  {event.city ? ` · ${event.city}, ${event.state}` : ""}
                </small>
                {/* Tags row */}
                <div className="flex items-center gap-1.5 mt-1">
                  {event.language && (
                    <span className="rounded-[4px] bg-[#f3f4f9] px-1.5 py-[1px] text-[10px] font-[600] text-[#555971]">
                      {event.language}
                    </span>
                  )}
                  {event.category && (
                    <span className="rounded-[4px] bg-[#eee9ff] px-1.5 py-[1px] text-[10px] font-[600] text-[#6d50df] capitalize">
                      {event.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-auto shrink-0 text-right">
                {event.price && (
                  <div className="text-[13px] font-[700] text-[#087d64]">
                    {event.price === "0" ||
                    event.price === "Free" ||
                    event.price === "free"
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
