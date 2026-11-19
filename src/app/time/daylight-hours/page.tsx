"use client";

import { useState, useMemo } from "react";
import {
  Sun,
  Moon,
  MapPin,
  BarChart3,
  Lightbulb,
  Globe,
  ArrowRight,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  CITY DATA                                                          */
/* ------------------------------------------------------------------ */

interface City {
  name: string;
  country: string;
  lat: number;
  label: string;
}

const CITIES: City[] = [
  { name: "Tromsoe", country: "Norway", lat: 69.6, label: "69.6\u00b0N" },
  { name: "Reykjavik", country: "Iceland", lat: 64.1, label: "64.1\u00b0N" },
  { name: "Stockholm", country: "Sweden", lat: 59.3, label: "59.3\u00b0N" },
  { name: "London", country: "UK", lat: 51.5, label: "51.5\u00b0N" },
  { name: "New York", country: "USA", lat: 40.7, label: "40.7\u00b0N" },
  { name: "Tokyo", country: "Japan", lat: 35.7, label: "35.7\u00b0N" },
  { name: "Cairo", country: "Egypt", lat: 30.0, label: "30.0\u00b0N" },
  { name: "Mumbai", country: "India", lat: 19.1, label: "19.1\u00b0N" },
  { name: "Singapore", country: "Singapore", lat: 1.3, label: "1.3\u00b0N" },
  { name: "Nairobi", country: "Kenya", lat: -1.3, label: "1.3\u00b0S" },
  { name: "Sao Paulo", country: "Brazil", lat: -23.5, label: "23.5\u00b0S" },
  { name: "Sydney", country: "Australia", lat: -33.9, label: "33.9\u00b0S" },
  {
    name: "Cape Town",
    country: "South Africa",
    lat: -33.9,
    label: "33.9\u00b0S",
  },
  {
    name: "Buenos Aires",
    country: "Argentina",
    lat: -34.6,
    label: "34.6\u00b0S",
  },
];

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

const MONTH_DAYS = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];

/* ------------------------------------------------------------------ */
/*  DAYLIGHT CALCULATION                                               */
/* ------------------------------------------------------------------ */

function calcDaylightHours(latDeg: number, dayOfYear: number): number {
  const RAD = Math.PI / 180;
  const declination =
    -23.44 * Math.cos(((360 / 365) * (dayOfYear + 10)) * RAD);
  const latRad = latDeg * RAD;
  const declRad = declination * RAD;
  const cosHA = -Math.tan(latRad) * Math.tan(declRad);

  if (cosHA < -1) return 24; // midnight sun
  if (cosHA > 1) return 0; // polar night

  const hourAngle = Math.acos(cosHA);
  return (2 * hourAngle * 12) / Math.PI;
}

function getMonthlyDaylight(lat: number): number[] {
  return MONTH_DAYS.map((d) => calcDaylightHours(lat, d));
}

function getTodayDaylight(lat: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return calcDaylightHours(lat, dayOfYear);
}

/** Longest & shortest day for a latitude */
function getExtremes(lat: number): { longest: number; shortest: number } {
  let longest = 0;
  let shortest = 24;
  for (let d = 1; d <= 365; d++) {
    const h = calcDaylightHours(lat, d);
    if (h > longest) longest = h;
    if (h < shortest) shortest = h;
  }
  return { longest, shortest };
}

function hoursToHM(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}h ${mins}m`;
}

/** Color from blue (short day) to yellow (long day) */
function daylightColor(hours: number): string {
  const t = Math.min(hours / 24, 1);
  // blue(0) -> cyan(0.33) -> yellow(0.66) -> gold(1)
  if (t < 0.5) {
    const r = Math.round(59 + t * 2 * (6 - 59 + 200));
    const g = Math.round(130 + t * 2 * (182 - 130 + 50));
    const b = Math.round(246 + t * 2 * (212 - 246));
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(6 + (t - 0.5) * 2 * (250 - 6));
  const g = Math.round(182 + (t - 0.5) * 2 * (204 - 182));
  const b = Math.round(212 + (t - 0.5) * 2 * (35 - 212));
  return `rgb(${r},${g},${b})`;
}

const COMPARE_COLORS = ["#4F46E5", "#06B6D4", "#F59E0B"];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function DaylightHoursPage() {
  const [selectedIdx, setSelectedIdx] = useState(4); // New York
  const [compareIdxs, setCompareIdxs] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const city = CITIES[selectedIdx];
  const monthly = useMemo(() => getMonthlyDaylight(city.lat), [city.lat]);
  const todayHours = useMemo(() => getTodayDaylight(city.lat), [city.lat]);
  const extremes = useMemo(() => getExtremes(city.lat), [city.lat]);

  const compareCities = useMemo(
    () => compareIdxs.map((i) => CITIES[i]),
    [compareIdxs]
  );
  const compareMonthly = useMemo(
    () => compareCities.map((c) => getMonthlyDaylight(c.lat)),
    [compareCities]
  );

  function toggleCompare(idx: number) {
    setCompareIdxs((prev) => {
      if (prev.includes(idx)) return prev.filter((i) => i !== idx);
      if (prev.length >= 3) return prev;
      return [...prev, idx];
    });
  }

  // const chartH = 260;
  // const barMaxW = 260;

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-10 sm:pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm mb-6">
          <Sun className="w-4 h-4" />
          Daylight Hours
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-secondary to-primary bg-clip-text text-transparent">
          Daylight Hours Around the World
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-base sm:text-lg">
          Explore how the Sun illuminates different cities throughout the year.
          Compare latitudes from the Arctic Circle to the equator.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-10">
        {/* ── City Selector ───────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Select a City
          </h2>
          <select
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
            className="w-full sm:w-80 bg-dark-bg border border-card-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            {CITIES.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}, {c.country} ({c.label})
              </option>
            ))}
          </select>
        </section>

        {/* ── Today's Daylight ────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-400" />
            Today&apos;s Daylight in {city.name}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-5xl font-heading font-bold text-yellow-300">
              {hoursToHM(todayHours)}
            </div>
            <div className="text-muted text-sm">
              <p>of daylight today at latitude {city.label}</p>
              <p className="mt-1">
                {todayHours >= 12
                  ? `${hoursToHM(todayHours - 12)} more than 12 hours`
                  : `${hoursToHM(12 - todayHours)} less than 12 hours`}
              </p>
            </div>
          </div>
        </section>

        {/* ── Annual Daylight Chart ───────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Annual Daylight — {city.name} ({city.label})
          </h2>
          <p className="text-muted text-sm mb-6">
            Hours of daylight for each month of the year
          </p>

          <div className="space-y-2">
            {MONTHS.map((month, i) => {
              const h = monthly[i];
              const pct = (h / 24) * 100;
              return (
                <div key={month} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-muted font-mono">
                    {month}
                  </span>
                  <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: daylightColor(h),
                      }}
                    />
                    <span className="absolute right-2 top-0 h-full flex items-center text-xs font-mono text-white/70">
                      {hoursToHM(h)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Comparison Mode ─────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              Compare Cities
            </h2>
            <button
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                if (isCompareMode) setCompareIdxs([]);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isCompareMode
                  ? "bg-secondary text-white"
                  : "bg-card-bg border border-card-border text-muted hover:text-white"
              }`}
            >
              {isCompareMode ? "Close Comparison" : "Open Comparison"}
            </button>
          </div>

          {isCompareMode && (
            <>
              <p className="text-muted text-sm mb-4">
                Select up to 3 cities to overlay their daylight charts.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {CITIES.map((c, i) => {
                  const active = compareIdxs.includes(i);
                  const colorIdx = compareIdxs.indexOf(i);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleCompare(i)}
                      disabled={!active && compareIdxs.length >= 3}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        active
                          ? "text-white border-white/30"
                          : "border-card-border text-muted hover:text-white disabled:opacity-30"
                      }`}
                      style={
                        active
                          ? { backgroundColor: COMPARE_COLORS[colorIdx] + "33" }
                          : {}
                      }
                    >
                      {active && <span className="mr-1">&#x2713;</span>}
                      {c.name} ({c.label})
                    </button>
                  );
                })}
              </div>

              {compareIdxs.length > 0 && (
                <div className="space-y-2">
                  {MONTHS.map((month, mi) => (
                    <div key={month} className="flex items-center gap-3">
                      <span className="w-8 text-xs text-muted font-mono">
                        {month}
                      </span>
                      <div className="flex-1 space-y-1">
                        {compareIdxs.map((ci, cIdx) => {
                          const h = compareMonthly[cIdx][mi];
                          const pct = (h / 24) * 100;
                          return (
                            <div
                              key={CITIES[ci].name}
                              className="h-4 bg-white/5 rounded overflow-hidden relative"
                            >
                              <div
                                className="h-full rounded"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: COMPARE_COLORS[cIdx],
                                }}
                              />
                              <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-mono text-white/60">
                                {CITIES[ci].name} {hoursToHM(h)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-card-border">
                    {compareIdxs.map((ci, cIdx) => (
                      <div
                        key={CITIES[ci].name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COMPARE_COLORS[cIdx] }}
                        />
                        <span className="text-white">
                          {CITIES[ci].name}, {CITIES[ci].country}
                        </span>
                        <span className="text-muted">({CITIES[ci].label})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <AdBanner />

        {/* ── Extremes ────────────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Daylight Extremes — {city.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-bg border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  Longest Day (Summer Solstice)
                </span>
              </div>
              <p className="text-2xl font-heading font-bold text-yellow-300">
                {hoursToHM(extremes.longest)}
              </p>
              {extremes.longest >= 24 && (
                <p className="text-xs text-yellow-400/80 mt-1">
                  Midnight sun — 24 hours of continuous daylight
                </p>
              )}
            </div>
            <div className="bg-dark-bg border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">
                  Shortest Day (Winter Solstice)
                </span>
              </div>
              <p className="text-2xl font-heading font-bold text-blue-300">
                {hoursToHM(extremes.shortest)}
              </p>
              {extremes.shortest <= 0 && (
                <p className="text-xs text-blue-400/80 mt-1">
                  Polar night — 0 hours of daylight
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-dark-bg border border-card-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted mb-1">
                Midnight Sun Zone
              </h3>
              <p className="text-white text-sm">
                Above 66.5&deg;N or below 66.5&deg;S
              </p>
              <p className="text-xs text-muted mt-1">
                {Math.abs(city.lat) >= 66.5
                  ? `${city.name} experiences midnight sun`
                  : `${city.name} is outside this zone`}
              </p>
            </div>
            <div className="bg-dark-bg border border-card-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted mb-1">
                Polar Night Zone
              </h3>
              <p className="text-white text-sm">
                Above 66.5&deg;N or below 66.5&deg;S
              </p>
              <p className="text-xs text-muted mt-1">
                {Math.abs(city.lat) >= 66.5
                  ? `${city.name} experiences polar night`
                  : `${city.name} is outside this zone`}
              </p>
            </div>
            <div className="bg-dark-bg border border-card-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted mb-1">
                Equatorial Consistency
              </h3>
              <p className="text-white text-sm">~12 hours year-round</p>
              <p className="text-xs text-muted mt-1">
                {Math.abs(city.lat) < 10
                  ? `${city.name} gets nearly equal daylight year-round`
                  : `${city.name} has significant seasonal variation`}
              </p>
            </div>
          </div>
        </section>

        {/* ── Fun Facts ───────────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Fun Facts About Daylight
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Equatorial Equality",
                text: "At the equator, daylight is approximately 12 hours every single day of the year, with almost no seasonal variation.",
              },
              {
                title: "Arctic Extremes",
                text: "In Tromso, Norway (69.6\u00b0N), summer brings 24 hours of continuous daylight, while winter plunges the city into 0 hours of sunlight.",
              },
              {
                title: "Equinox Speed",
                text: "Day length changes fastest around the equinoxes (March & September). Near the solstices, the change slows almost to a halt.",
              },
            ].map((fact) => (
              <div
                key={fact.title}
                className="bg-dark-bg border border-card-border rounded-xl p-4"
              >
                <h3 className="text-sm font-medium text-yellow-300 mb-2">
                  {fact.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
