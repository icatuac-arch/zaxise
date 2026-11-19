"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Clock,
  Eye,
  MapPin,
  Compass,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Telescope,
  Moon,
  Flame,
  CloudOff,
  Timer,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface MeteorShower {
  name: string;
  peakStart: string; // ISO date
  peakEnd: string;
  activeStart: string;
  activeEnd: string;
  zhr: number;
  parent: string;
  radiant: string;
  bestViewing: string;
  notes?: string;
}

const showers: MeteorShower[] = [
  {
    name: "Quadrantids",
    peakStart: "2026-01-03",
    peakEnd: "2026-01-04",
    activeStart: "2025-12-28",
    activeEnd: "2026-01-12",
    zhr: 120,
    parent: "2003 EH1",
    radiant: "Bootes",
    bestViewing: "After midnight",
    notes: "Short peak, bright meteors.",
  },
  {
    name: "Lyrids",
    peakStart: "2026-04-22",
    peakEnd: "2026-04-23",
    activeStart: "2026-04-16",
    activeEnd: "2026-04-25",
    zhr: 18,
    parent: "Comet Thatcher",
    radiant: "Lyra",
    bestViewing: "After midnight",
    notes: "Occasional fireballs.",
  },
  {
    name: "Eta Aquariids",
    peakStart: "2026-05-05",
    peakEnd: "2026-05-06",
    activeStart: "2026-04-19",
    activeEnd: "2026-05-28",
    zhr: 50,
    parent: "Comet Halley",
    radiant: "Aquarius",
    bestViewing: "Before dawn",
    notes: "Fast meteors, better in Southern Hemisphere.",
  },
  {
    name: "Delta Aquariids",
    peakStart: "2026-07-30",
    peakEnd: "2026-07-31",
    activeStart: "2026-07-12",
    activeEnd: "2026-08-23",
    zhr: 20,
    parent: "Comet 96P/Machholz",
    radiant: "Aquarius",
    bestViewing: "After midnight",
  },
  {
    name: "Perseids",
    peakStart: "2026-08-12",
    peakEnd: "2026-08-13",
    activeStart: "2026-07-17",
    activeEnd: "2026-08-24",
    zhr: 100,
    parent: "Comet Swift-Tuttle",
    radiant: "Perseus",
    bestViewing: "After midnight",
    notes:
      "Most popular shower, warm summer nights, bright meteors and fireballs.",
  },
  {
    name: "Draconids",
    peakStart: "2026-10-08",
    peakEnd: "2026-10-09",
    activeStart: "2026-10-06",
    activeEnd: "2026-10-10",
    zhr: 10,
    parent: "Comet 21P/Giacobini-Zinner",
    radiant: "Draco",
    bestViewing: "Early evening",
    notes: "Occasional outbursts with thousands per hour.",
  },
  {
    name: "Orionids",
    peakStart: "2026-10-21",
    peakEnd: "2026-10-22",
    activeStart: "2026-10-02",
    activeEnd: "2026-11-07",
    zhr: 20,
    parent: "Comet Halley",
    radiant: "Orion",
    bestViewing: "After midnight",
    notes: "Fast meteors.",
  },
  {
    name: "Taurids",
    peakStart: "2026-11-05",
    peakEnd: "2026-11-12",
    activeStart: "2026-09-10",
    activeEnd: "2026-11-20",
    zhr: 5,
    parent: "Comet Encke",
    radiant: "Taurus",
    bestViewing: "After midnight",
    notes: 'Slow, bright fireballs. "Halloween fireballs."',
  },
  {
    name: "Leonids",
    peakStart: "2026-11-17",
    peakEnd: "2026-11-18",
    activeStart: "2026-11-06",
    activeEnd: "2026-11-30",
    zhr: 15,
    parent: "Comet Tempel-Tuttle",
    radiant: "Leo",
    bestViewing: "After midnight",
    notes: "Storm years every 33 years (next ~2032).",
  },
  {
    name: "Geminids",
    peakStart: "2026-12-13",
    peakEnd: "2026-12-14",
    activeStart: "2026-12-04",
    activeEnd: "2026-12-17",
    zhr: 150,
    parent: "Asteroid 3200 Phaethon",
    radiant: "Gemini",
    bestViewing: "All night (peaks ~2am)",
    notes:
      "Best shower of the year, bright multi-colored meteors.",
  },
  {
    name: "Ursids",
    peakStart: "2026-12-22",
    peakEnd: "2026-12-23",
    activeStart: "2026-12-17",
    activeEnd: "2026-12-26",
    zhr: 10,
    parent: "Comet 8P/Tuttle",
    radiant: "Ursa Minor",
    bestViewing: "After midnight",
  },
];

const MAX_ZHR = 150;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function toDate(iso: string) {
  return new Date(iso + "T00:00:00");
}

function formatShortDate(iso: string) {
  const d = toDate(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatPeakRange(start: string, end: string) {
  const s = toDate(start);
  const e = toDate(end);
  const sMonth = s.toLocaleDateString("en-US", { month: "short" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short" });
  if (sMonth === eMonth) {
    return `${sMonth} ${s.getDate()}-${e.getDate()}`;
  }
  return `${sMonth} ${s.getDate()} - ${eMonth} ${e.getDate()}`;
}

function getStatus(
  shower: MeteorShower,
  now: Date
): "upcoming" | "active" | "passed" {
  const activeStart = toDate(shower.activeStart);
  const activeEnd = toDate(shower.activeEnd);
  activeEnd.setHours(23, 59, 59);
  if (now < activeStart) return "upcoming";
  if (now <= activeEnd) return "active";
  return "passed";
}

function daysUntilPeak(peakStart: string, now: Date): number {
  const peak = toDate(peakStart);
  const diff = peak.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getNextShower(now: Date): MeteorShower | null {
  for (const s of showers) {
    const peakEnd = toDate(s.peakEnd);
    peakEnd.setHours(23, 59, 59);
    if (peakEnd >= now) return s;
  }
  return showers[0];
}

/* ------------------------------------------------------------------ */
/*  COLORS PER SHOWER (for timeline)                                   */
/* ------------------------------------------------------------------ */

const SHOWER_COLORS: Record<string, string> = {
  Quadrantids: "#4F46E5",
  Lyrids: "#06B6D4",
  "Eta Aquariids": "#8B5CF6",
  "Delta Aquariids": "#EC4899",
  Perseids: "#F59E0B",
  Draconids: "#10B981",
  Orionids: "#EF4444",
  Taurids: "#F97316",
  Leonids: "#6366F1",
  Geminids: "#14B8A6",
  Ursids: "#A78BFA",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function MeteorShowersPage() {
  const [now, setNow] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const nextShower = useMemo(() => getNextShower(now), [now]);

  const countdownTo = useMemo(() => {
    if (!nextShower) return { days: 0, hours: 0, minutes: 0 };
    const peak = toDate(nextShower.peakStart);
    const diff = Math.max(0, peak.getTime() - now.getTime());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
    };
  }, [nextShower, now]);

  /* ---- timeline helpers ---- */
  const yearStart = new Date("2026-01-01T00:00:00").getTime();
  const yearEnd = new Date("2026-12-31T23:59:59").getTime();
  const yearSpan = yearEnd - yearStart;

  function pct(iso: string) {
    const t = toDate(iso).getTime();
    // Handle dates in 2025 (Quadrantids activeStart)
    const clamped = Math.max(yearStart, Math.min(yearEnd, t));
    return ((clamped - yearStart) / yearSpan) * 100;
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#030712",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8 text-center px-4">
        {/* SVG starfield with shooting stars */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* static stars */}
          {Array.from({ length: 80 }).map((_, i) => (
            <circle
              key={`s-${i}`}
              cx={`${((i * 37 + 13) % 100)}%`}
              cy={`${((i * 53 + 7) % 100)}%`}
              r={i % 5 === 0 ? 1.5 : 0.8}
              fill="#E2E8F0"
              opacity={0.15 + (i % 4) * 0.15}
            />
          ))}
          {/* shooting star 1 */}
          <line
            x1="10%"
            y1="20%"
            x2="25%"
            y2="35%"
            stroke="url(#meteor1)"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-shootingStar1"
          />
          {/* shooting star 2 */}
          <line
            x1="60%"
            y1="10%"
            x2="75%"
            y2="30%"
            stroke="url(#meteor2)"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-shootingStar2"
          />
          {/* shooting star 3 */}
          <line
            x1="80%"
            y1="15%"
            x2="92%"
            y2="40%"
            stroke="url(#meteor3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-shootingStar3"
          />
          <defs>
            <linearGradient id="meteor1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="meteor2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="meteor3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: "Outfit, sans-serif",
              color: "#E2E8F0",
            }}
          >
            Meteor Shower Calendar
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "#94A3B8" }}
          >
            Track every major meteor shower in 2026. Plan your stargazing
            nights with peak dates, hourly rates, countdowns, and expert
            viewing tips.
          </p>
        </div>

        {/* CSS animations for shooting stars */}
        <style jsx>{`
          @keyframes shootingStar1 {
            0%,
            100% {
              opacity: 0;
              transform: translate(0, 0);
            }
            5% {
              opacity: 1;
            }
            15% {
              opacity: 1;
              transform: translate(60px, 60px);
            }
            20% {
              opacity: 0;
              transform: translate(80px, 80px);
            }
          }
          @keyframes shootingStar2 {
            0%,
            100% {
              opacity: 0;
              transform: translate(0, 0);
            }
            30% {
              opacity: 0;
            }
            35% {
              opacity: 1;
            }
            45% {
              opacity: 1;
              transform: translate(50px, 70px);
            }
            50% {
              opacity: 0;
              transform: translate(70px, 90px);
            }
          }
          @keyframes shootingStar3 {
            0%,
            100% {
              opacity: 0;
              transform: translate(0, 0);
            }
            60% {
              opacity: 0;
            }
            65% {
              opacity: 1;
            }
            75% {
              opacity: 1;
              transform: translate(40px, 60px);
            }
            80% {
              opacity: 0;
              transform: translate(55px, 80px);
            }
          }
          .animate-shootingStar1 {
            animation: shootingStar1 6s ease-in-out infinite;
          }
          .animate-shootingStar2 {
            animation: shootingStar2 7s ease-in-out infinite;
          }
          .animate-shootingStar3 {
            animation: shootingStar3 8s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* ============================================================ */}
      {/*  NEXT SHOWER BANNER                                          */}
      {/* ============================================================ */}
      {nextShower && (
        <section className="max-w-4xl mx-auto px-4 -mt-8 mb-16 relative z-10">
          <div
            className="rounded-2xl p-6 md:p-8 border"
            style={{
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.10))",
              borderColor: "#4F46E5",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} style={{ color: "#F59E0B" }} />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#06B6D4" }}
              >
                Next Meteor Shower
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
            >
              {nextShower.name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "#94A3B8" }}
                >
                  Peak
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#E2E8F0" }}
                >
                  {formatPeakRange(nextShower.peakStart, nextShower.peakEnd)}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "#94A3B8" }}
                >
                  Expected Rate
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#E2E8F0" }}
                >
                  ~{nextShower.zhr}/hr
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "#94A3B8" }}
                >
                  Best Viewing
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#E2E8F0" }}
                >
                  {nextShower.bestViewing}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "#94A3B8" }}
                >
                  Radiant
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#E2E8F0" }}
                >
                  {nextShower.radiant}
                </p>
              </div>
            </div>

            {/* Countdown */}
            {daysUntilPeak(nextShower.peakStart, now) > 0 && (
              <div className="flex items-center gap-4">
                <Timer size={18} style={{ color: "#06B6D4" }} />
                <div className="flex gap-3">
                  {[
                    { val: countdownTo.days, label: "days" },
                    { val: countdownTo.hours, label: "hrs" },
                    { val: countdownTo.minutes, label: "min" },
                  ].map((u) => (
                    <div key={u.label} className="text-center">
                      <span
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: "#4F46E5" }}
                      >
                        {u.val}
                      </span>
                      <span
                        className="text-xs ml-1"
                        style={{ color: "#94A3B8" }}
                      >
                        {u.label}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-sm" style={{ color: "#94A3B8" }}>
                  until peak
                </span>
              </div>
            )}
            {daysUntilPeak(nextShower.peakStart, now) <= 0 && (
              <div className="flex items-center gap-2">
                <Zap size={18} style={{ color: "#F59E0B" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#F59E0B" }}
                >
                  Peak is happening now! Go outside tonight!
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  ANNUAL CALENDAR                                             */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            2026 Meteor Showers
          </h2>
          <p style={{ color: "#94A3B8" }}>
            All major meteor showers for the year with real-time status
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {showers.map((s) => {
            const status = getStatus(s, now);
            const dtp = daysUntilPeak(s.peakStart, now);
            const isExpanded = expandedCard === s.name;
            const barWidth = Math.round((s.zhr / MAX_ZHR) * 100);

            const statusColors: Record<string, { bg: string; text: string; label: string }> = {
              active: { bg: "rgba(16,185,129,0.15)", text: "#10B981", label: "Active Now" },
              upcoming: { bg: "rgba(79,70,229,0.15)", text: "#818CF8", label: "Upcoming" },
              passed: { bg: "rgba(148,163,184,0.1)", text: "#64748B", label: "Passed" },
            };
            const sc = statusColors[status];

            return (
              <div
                key={s.name}
                className="rounded-xl border transition-all duration-200"
                style={{
                  background: "#0F172A",
                  borderColor:
                    status === "active" ? "#10B981" : "#1E293B",
                  opacity: status === "passed" ? 0.6 : 1,
                }}
              >
                {/* Card header */}
                <button
                  className="w-full text-left p-5 flex items-start justify-between gap-3"
                  onClick={() =>
                    setExpandedCard(isExpanded ? null : s.name)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-lg">☄️</span>
                      <h3
                        className="text-lg font-bold"
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          color: "#E2E8F0",
                        }}
                      >
                        {s.name}
                      </h3>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: sc.bg,
                          color: sc.text,
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <span style={{ color: "#94A3B8" }}>
                        <span style={{ color: "#06B6D4" }}>Peak:</span>{" "}
                        {formatPeakRange(s.peakStart, s.peakEnd)}
                      </span>
                      <span style={{ color: "#94A3B8" }}>
                        <span style={{ color: "#06B6D4" }}>ZHR:</span>{" "}
                        {s.zhr}
                      </span>
                      {status === "upcoming" && dtp > 0 && (
                        <span style={{ color: "#818CF8" }}>
                          {dtp} day{dtp !== 1 ? "s" : ""} until peak
                        </span>
                      )}
                    </div>

                    {/* ZHR bar */}
                    <div
                      className="mt-3 h-2 rounded-full overflow-hidden"
                      style={{ background: "#1E293B" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: `linear-gradient(90deg, #4F46E5, #06B6D4)`,
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#64748B" }}
                    >
                      {s.zhr} / {MAX_ZHR} ZHR
                    </p>
                  </div>

                  <span style={{ color: "#94A3B8" }}>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </span>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    className="px-5 pb-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm border-t pt-4"
                    style={{ borderColor: "#1E293B" }}
                  >
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-0.5"
                        style={{ color: "#64748B" }}
                      >
                        Active Period
                      </p>
                      <p style={{ color: "#E2E8F0" }}>
                        {formatShortDate(s.activeStart)} &ndash;{" "}
                        {formatShortDate(s.activeEnd)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-0.5"
                        style={{ color: "#64748B" }}
                      >
                        Parent Body
                      </p>
                      <p style={{ color: "#E2E8F0" }}>{s.parent}</p>
                    </div>
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-0.5"
                        style={{ color: "#64748B" }}
                      >
                        Radiant
                      </p>
                      <p style={{ color: "#E2E8F0" }}>
                        <Compass
                          size={14}
                          className="inline mr-1"
                          style={{ color: "#06B6D4" }}
                        />
                        {s.radiant}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-0.5"
                        style={{ color: "#64748B" }}
                      >
                        Best Viewing
                      </p>
                      <p style={{ color: "#E2E8F0" }}>
                        <Clock
                          size={14}
                          className="inline mr-1"
                          style={{ color: "#06B6D4" }}
                        />
                        {s.bestViewing}
                      </p>
                    </div>
                    {s.notes && (
                      <div className="col-span-2">
                        <p
                          className="text-xs uppercase tracking-wider mb-0.5"
                          style={{ color: "#64748B" }}
                        >
                          Notes
                        </p>
                        <p style={{ color: "#94A3B8" }}>{s.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <AdBanner />

      {/* ============================================================ */}
      {/*  MONTHLY TIMELINE                                            */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Monthly Timeline
          </h2>
          <p style={{ color: "#94A3B8" }}>
            See when each shower is active throughout the year
          </p>
        </div>

        <div
          className="rounded-xl border p-5 md:p-8 overflow-x-auto"
          style={{ background: "#0F172A", borderColor: "#1E293B" }}
        >
          {/* Month headers */}
          <div className="flex mb-1 min-w-[700px]">
            {MONTHS.map((m) => (
              <div
                key={m}
                className="text-xs font-medium text-center"
                style={{
                  width: `${100 / 12}%`,
                  color: "#94A3B8",
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Grid lines */}
          <div className="relative min-w-[700px]">
            <div className="absolute inset-0 flex">
              {MONTHS.map((m) => (
                <div
                  key={m}
                  className="border-l h-full"
                  style={{
                    width: `${100 / 12}%`,
                    borderColor: "#1E293B",
                  }}
                />
              ))}
              <div
                className="border-l h-full"
                style={{ borderColor: "#1E293B" }}
              />
            </div>

            {/* Bars */}
            {showers.map((s) => {
              const left = pct(s.activeStart);
              const right = pct(s.activeEnd);
              const width = Math.max(right - left, 1);
              const peakLeft = pct(s.peakStart);
              const peakRight = pct(s.peakEnd);
              const peakWidth = Math.max(peakRight - peakLeft, 0.5);
              const color = SHOWER_COLORS[s.name] || "#4F46E5";

              return (
                <div
                  key={s.name}
                  className="relative h-8 flex items-center"
                >
                  {/* Active period bar */}
                  <div
                    className="absolute h-3 rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: color,
                      opacity: 0.3,
                    }}
                  />
                  {/* Peak bar */}
                  <div
                    className="absolute h-3 rounded-full"
                    style={{
                      left: `${peakLeft}%`,
                      width: `${peakWidth}%`,
                      background: color,
                      opacity: 0.9,
                    }}
                  />
                  {/* Label */}
                  <span
                    className="absolute text-[10px] font-medium whitespace-nowrap"
                    style={{
                      left: `${Math.min(left + width + 0.5, 85)}%`,
                      color: "#94A3B8",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="flex items-center gap-5 mt-4 pt-4 border-t text-xs min-w-[700px]"
            style={{ borderColor: "#1E293B", color: "#94A3B8" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-2 rounded-full"
                style={{ background: "#4F46E5", opacity: 0.3 }}
              />
              <span>Active period</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-2 rounded-full"
                style={{ background: "#4F46E5", opacity: 0.9 }}
              />
              <span>Peak dates</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VIEWING TIPS                                                */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Viewing Tips
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Maximize your chances of seeing shooting stars
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <CloudOff size={24} />,
              title: "Escape Light Pollution",
              text: "Get at least 30 minutes away from city lights. Darker skies reveal far more meteors.",
            },
            {
              icon: <Eye size={24} />,
              title: "Let Your Eyes Adjust",
              text: "Give your eyes 20-30 minutes to fully adapt to the dark. Avoid looking at your phone.",
            },
            {
              icon: <Compass size={24} />,
              title: "Face the Radiant",
              text: "Look towards the constellation the shower is named after, but scan the whole sky.",
            },
            {
              icon: <Clock size={24} />,
              title: "Go After Midnight",
              text: "Most showers peak after midnight when your location faces into Earth\u2019s orbital path.",
            },
            {
              icon: <Telescope size={24} />,
              title: "No Equipment Needed",
              text: "Use your naked eyes -- no telescope or binoculars needed. They restrict your field of view.",
            },
            {
              icon: <MapPin size={24} />,
              title: "Lie Back",
              text: "Lie flat on your back for the widest view of the sky. A reclining chair works too.",
            },
            {
              icon: <Moon size={24} />,
              title: "Check the Moon",
              text: "A full or bright moon washes out faint meteors. New moon nights are best.",
            },
            {
              icon: <Flame size={24} />,
              title: "Dress Warmly",
              text: "Even summer nights get chilly when you\u2019re lying still. Bring layers, blankets, and hot drinks.",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border p-5"
              style={{
                background: "#0F172A",
                borderColor: "#1E293B",
              }}
            >
              <div className="mb-3" style={{ color: "#06B6D4" }}>
                {tip.icon}
              </div>
              <h3
                className="font-semibold mb-2"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "#E2E8F0",
                }}
              >
                {tip.title}
              </h3>
              <p className="text-sm" style={{ color: "#94A3B8" }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT CAUSES METEOR SHOWERS                                  */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            What Causes Meteor Showers?
          </h2>
          <p style={{ color: "#94A3B8" }}>
            The science behind shooting stars
          </p>
        </div>

        <div
          className="rounded-xl border p-6 md:p-8 space-y-6"
          style={{ background: "#0F172A", borderColor: "#1E293B" }}
        >
          {[
            {
              q: "Comets Leave Debris Trails",
              a: "As comets orbit the Sun, solar heat vaporizes ice and releases dust and rocky particles. These particles spread along the comet\u2019s orbital path, forming a vast debris trail that persists for centuries.",
            },
            {
              q: "Earth Passes Through These Trails",
              a: "Each year, Earth\u2019s orbit intersects the same cometary debris streams at predictable times. This is why meteor showers recur on roughly the same dates every year.",
            },
            {
              q: "Debris Burns Up in the Atmosphere",
              a: "Particles -- most no larger than a grain of sand -- enter Earth\u2019s atmosphere at speeds of 11 to 72 km/s. Friction with air molecules superheats the particle, producing the streak of light we call a meteor or \u201cshooting star.\u201d Most burn up at altitudes of 80 to 120 km.",
            },
            {
              q: "ZHR: Zenith Hourly Rate",
              a: "ZHR is the theoretical maximum number of meteors an observer would see per hour under perfect conditions: the radiant at the zenith, skies dark and clear, and limiting magnitude of 6.5. Real observed rates are typically lower.",
            },
            {
              q: "Meteor vs. Meteorite vs. Meteoroid",
              a: "A meteoroid is a small rocky or metallic body in space. When it enters Earth\u2019s atmosphere and produces a streak of light, that phenomenon is a meteor. If any fragment survives to reach the ground, it is called a meteorite.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3
                className="font-semibold text-lg mb-2 flex items-start gap-2"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "#E2E8F0",
                }}
              >
                <Info
                  size={18}
                  className="mt-1 flex-shrink-0"
                  style={{ color: "#4F46E5" }}
                />
                {item.q}
              </h3>
              <p
                className="text-sm leading-relaxed ml-6"
                style={{ color: "#94A3B8" }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
