"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Music,
  ChevronRight,
  Loader2,
} from "lucide-react";

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

const CATEGORY_COLORS: Record<string, string> = {
  vocal: "from-orange-500 to-red-500",
  dance: "from-pink-500 to-rose-500",
  instrumental: "from-blue-500 to-indigo-500",
  standup: "from-yellow-500 to-amber-500",
  play: "from-purple-500 to-violet-500",
  movies: "from-cyan-500 to-blue-500",
  festival: "from-emerald-500 to-green-500",
  competition: "from-red-500 to-orange-500",
};

export default function EventsPane() {
  const [events, setEvents] = useState<Event[]>([]);
  const [metro, setMetro] = useState("Bay Area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get saved metro preference
    const saved = localStorage.getItem("zaxise_metro");
    if (saved) setMetro(saved);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/portal/events?metro=${encodeURIComponent(metro)}&limit=8`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [metro]);

  const handleMetroChange = (newMetro: string) => {
    setMetro(newMetro);
    localStorage.setItem("zaxise_metro", newMetro);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Events Near You</h2>
            <p className="text-xs text-muted">From IndianPrograms.com</p>
          </div>
        </div>
        <select
          value={metro}
          onChange={(e) => handleMetroChange(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
        >
          {[
            "Bay Area", "New York", "LA", "Chicago", "Dallas", "Houston",
            "DC", "Atlanta", "Seattle", "Phoenix", "Philadelphia", "Boston",
            "San Diego", "Denver", "Austin", "NJ", "Orlando", "Tampa",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted">
          No upcoming events in {metro}. Try another metro area.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.a
              key={event.id}
              href={`https://indianprograms.com/e/${event.slug || event.short_id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex gap-3 rounded-xl border border-border bg-surface p-3 transition-all hover:border-orange-500/30 hover:bg-surface-hover"
            >
              {/* Event image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${CATEGORY_COLORS[event.category] || "from-indigo-500 to-purple-500"}`}
                  >
                    <Music className="h-6 w-6 text-white/80" />
                  </div>
                )}
              </div>

              {/* Event info */}
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <h3 className="text-sm font-semibold leading-snug line-clamp-1 group-hover:text-orange-400 transition-colors">
                  {event.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.date)}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.city}, {event.state}
                  </span>
                </div>
                {event.price && (
                  <span className="mt-1 text-xs font-medium text-emerald-400">
                    {event.price === "0" || event.price === "Free"
                      ? "Free"
                      : `$${event.price}`}
                  </span>
                )}
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 self-center text-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          ))}
        </div>
      )}

      <a
        href="https://indianprograms.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted transition-all hover:border-orange-500/30 hover:text-orange-400"
      >
        View all events on IndianPrograms.com
        <ChevronRight className="h-4 w-4" />
      </a>
    </section>
  );
}
