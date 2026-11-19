"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Moon,
  Sun,
  Star,
  Telescope,
  Rocket,
  ExternalLink,
  Calendar,
  Eye,
  EyeOff,
  Sunrise,
  Sunset,
  Newspaper,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  MOON PHASE CALCULATIONS                                           */
/* ------------------------------------------------------------------ */

function getMoonPhaseData(date: Date) {
  // Known new moon reference: Jan 6 2000 18:14 UTC
  const knownNew = new Date("2000-01-06T18:14:00Z").getTime();
  const synodicMonth = 29.53058867;
  const diff = (date.getTime() - knownNew) / (1000 * 60 * 60 * 24);
  const cycles = diff / synodicMonth;
  const phase = cycles - Math.floor(cycles); // 0-1

  let phaseName: string;
  let emoji: string;
  if (phase < 0.0338) {
    phaseName = "New Moon";
    emoji = "\uD83C\uDF11";
  } else if (phase < 0.216) {
    phaseName = "Waxing Crescent";
    emoji = "\uD83C\uDF12";
  } else if (phase < 0.283) {
    phaseName = "First Quarter";
    emoji = "\uD83C\uDF13";
  } else if (phase < 0.466) {
    phaseName = "Waxing Gibbous";
    emoji = "\uD83C\uDF14";
  } else if (phase < 0.534) {
    phaseName = "Full Moon";
    emoji = "\uD83C\uDF15";
  } else if (phase < 0.716) {
    phaseName = "Waning Gibbous";
    emoji = "\uD83C\uDF16";
  } else if (phase < 0.783) {
    phaseName = "Last Quarter";
    emoji = "\uD83C\uDF17";
  } else if (phase < 0.9662) {
    phaseName = "Waning Crescent";
    emoji = "\uD83C\uDF18";
  } else {
    phaseName = "New Moon";
    emoji = "\uD83C\uDF11";
  }

  const illumination =
    phase <= 0.5
      ? Math.round(phase * 2 * 100)
      : Math.round((1 - phase) * 2 * 100);

  // Next full moon & new moon
  const nextFull = findNextPhase(date, 0.5, synodicMonth, knownNew);
  const nextNew = findNextPhase(date, 0.0, synodicMonth, knownNew);

  return { phase, phaseName, emoji, illumination, nextFull, nextNew };
}

function findNextPhase(
  from: Date,
  targetPhase: number,
  synodicMonth: number,
  knownNew: number
): Date {
  const msPerDay = 1000 * 60 * 60 * 24;
  let d = new Date(from.getTime() + msPerDay);
  for (let i = 0; i < 35; i++) {
    const diff = (d.getTime() - knownNew) / msPerDay;
    const cycles = diff / synodicMonth;
    const phase = cycles - Math.floor(cycles);
    const distance = Math.abs(phase - targetPhase);
    if (distance < 0.017 || distance > 0.983) return d;
    d = new Date(d.getTime() + msPerDay);
  }
  return d;
}

/* ------------------------------------------------------------------ */
/*  MOON SVG COMPONENT                                                */
/* ------------------------------------------------------------------ */

function MoonSVG({ phase }: { phase: number }) {
  // phase 0 = new, 0.5 = full, 1 = new again
  // We render a circle with an overlay to simulate the shadow
  const size = 180;
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  // Calculate the terminator curve
  // phase 0-0.5: waxing (right side lit), 0.5-1: waning (left side lit)
  let terminatorX: number;
  if (phase <= 0.5) {
    terminatorX = Math.cos(phase * 2 * Math.PI) * r;
  } else {
    terminatorX = Math.cos(phase * 2 * Math.PI) * r;
  }

  const litSide = phase <= 0.5 ? "right" : "left";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]"
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonSurface" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D4A017" />
        </radialGradient>
        <radialGradient id="moonCrater1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4960F" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C4960F" stopOpacity="0" />
        </radialGradient>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r + 15} fill="url(#moonGlow)" />
      {/* Moon base */}
      <circle cx={cx} cy={cy} r={r} fill="url(#moonSurface)" />
      {/* Craters */}
      <g clipPath="url(#moonClip)" opacity="0.35">
        <circle cx={cx - 25} cy={cy - 20} r={14} fill="url(#moonCrater1)" />
        <circle cx={cx + 30} cy={cy + 15} r={10} fill="url(#moonCrater1)" />
        <circle cx={cx + 10} cy={cy - 35} r={8} fill="url(#moonCrater1)" />
        <circle cx={cx - 15} cy={cy + 30} r={12} fill="url(#moonCrater1)" />
        <circle cx={cx + 35} cy={cy - 15} r={6} fill="url(#moonCrater1)" />
        <circle cx={cx - 40} cy={cy + 5} r={9} fill="url(#moonCrater1)" />
      </g>
      {/* Shadow overlay */}
      <g clipPath="url(#moonClip)">
        {phase < 0.01 || phase > 0.99 ? (
          // New moon - fully dark
          <circle cx={cx} cy={cy} r={r} fill="#030712" opacity="0.92" />
        ) : phase > 0.49 && phase < 0.51 ? (
          // Full moon - no shadow
          <></>
        ) : (
          <path
            d={
              litSide === "right"
                ? `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${Math.abs(terminatorX)} ${r} 0 0 ${terminatorX > 0 ? 1 : 0} ${cx} ${cy - r} Z`
                : `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(terminatorX)} ${r} 0 0 ${terminatorX < 0 ? 0 : 1} ${cx} ${cy - r} Z`
            }
            fill="#030712"
            opacity="0.88"
          />
        )}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ECLIPSES DATA                                                     */
/* ------------------------------------------------------------------ */

interface EclipseData {
  date: string;
  dateObj: Date;
  type: string;
  kind: "solar" | "lunar";
  visibility: string;
}

const eclipses: EclipseData[] = [
  {
    date: "Aug 12, 2026",
    dateObj: new Date("2026-08-12"),
    type: "Total Solar Eclipse",
    kind: "solar",
    visibility: "Arctic, Greenland, Iceland, Spain",
  },
  {
    date: "Feb 6, 2027",
    dateObj: new Date("2027-02-06"),
    type: "Annular Solar Eclipse",
    kind: "solar",
    visibility: "South America, Africa",
  },
  {
    date: "Jul 18, 2027",
    dateObj: new Date("2027-07-18"),
    type: "Partial Lunar Eclipse",
    kind: "lunar",
    visibility: "Americas, Europe, Africa",
  },
  {
    date: "Aug 2, 2027",
    dateObj: new Date("2027-08-02"),
    type: "Total Solar Eclipse",
    kind: "solar",
    visibility: "Morocco, Spain, Algeria, Egypt",
  },
  {
    date: "Jan 12, 2028",
    dateObj: new Date("2028-01-12"),
    type: "Partial Solar Eclipse",
    kind: "solar",
    visibility: "Antarctica, South Pacific",
  },
  {
    date: "Jul 6, 2028",
    dateObj: new Date("2028-07-06"),
    type: "Partial Solar Eclipse",
    kind: "solar",
    visibility: "Southern Asia, Australia",
  },
  {
    date: "Dec 31, 2028",
    dateObj: new Date("2028-12-31"),
    type: "Total Lunar Eclipse",
    kind: "lunar",
    visibility: "Europe, Africa, Asia, Australia",
  },
];

function daysUntil(target: Date, now: Date): number {
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ------------------------------------------------------------------ */
/*  PLANET VISIBILITY (simplified seasonal approximation)             */
/* ------------------------------------------------------------------ */

type Visibility = "Evening" | "Morning" | "Not Visible" | "All Night";

interface PlanetInfo {
  name: string;
  color: string;
  size: string;
  visibility: Visibility;
}

function getPlanetVisibility(month: number): PlanetInfo[] {
  // Approximate visibility patterns based on month (simplified)
  const patterns: Record<string, Visibility[]> = {
    Mercury: [
      "Evening", "Morning", "Evening", "Morning", "Evening", "Morning",
      "Evening", "Morning", "Evening", "Morning", "Evening", "Morning",
    ],
    Venus: [
      "Morning", "Morning", "Morning", "Evening", "Evening", "Evening",
      "Evening", "Evening", "Morning", "Morning", "Morning", "Morning",
    ],
    Mars: [
      "Evening", "Evening", "Evening", "Not Visible", "Not Visible", "Morning",
      "Morning", "Morning", "Evening", "Evening", "All Night", "All Night",
    ],
    Jupiter: [
      "Morning", "Morning", "Morning", "Morning", "Evening", "Evening",
      "All Night", "All Night", "Evening", "Evening", "Evening", "Morning",
    ],
    Saturn: [
      "Morning", "Morning", "Evening", "Evening", "Evening", "All Night",
      "All Night", "Evening", "Evening", "Morning", "Morning", "Morning",
    ],
  };

  const colors: Record<string, string> = {
    Mercury: "#9CA3AF",
    Venus: "#FBBF24",
    Mars: "#EF4444",
    Jupiter: "#F97316",
    Saturn: "#D4A017",
  };

  const sizes: Record<string, string> = {
    Mercury: "w-4 h-4",
    Venus: "w-6 h-6",
    Mars: "w-5 h-5",
    Jupiter: "w-8 h-8",
    Saturn: "w-7 h-7",
  };

  return Object.entries(patterns).map(([name, vis]) => ({
    name,
    color: colors[name],
    size: sizes[name],
    visibility: vis[month],
  }));
}

/* ------------------------------------------------------------------ */
/*  QUICK LINKS                                                       */
/* ------------------------------------------------------------------ */

const quickLinks = [
  {
    name: "NASA",
    url: "https://www.nasa.gov",
    desc: "National Aeronautics and Space Administration",
    icon: Rocket,
  },
  {
    name: "ESA",
    url: "https://www.esa.int",
    desc: "European Space Agency",
    icon: Globe,
  },
  {
    name: "ISRO",
    url: "https://www.isro.gov.in",
    desc: "Indian Space Research Organisation",
    icon: Rocket,
  },
  {
    name: "JAXA",
    url: "https://global.jaxa.jp",
    desc: "Japan Aerospace Exploration Agency",
    icon: Star,
  },
  {
    name: "SpaceX",
    url: "https://www.spacex.com",
    desc: "Space Exploration Technologies",
    icon: Rocket,
  },
  {
    name: "ISS Live",
    url: "https://www.nasa.gov/nasalive",
    desc: "International Space Station Live Stream",
    icon: Globe,
  },
  {
    name: "Hubble Gallery",
    url: "https://hubblesite.org/images/gallery",
    desc: "Hubble Space Telescope Image Gallery",
    icon: Telescope,
  },
];

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
}

interface SpaceNewsArticle {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  published_at: string;
  url: string;
  news_site: string;
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function AstronomyPage() {
  const [now] = useState(() => new Date());
  const [apod, setApod] = useState<APODData | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [news, setNews] = useState<SpaceNewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const moon = useMemo(() => getMoonPhaseData(now), [now]);
  const planets = useMemo(() => getPlanetVisibility(now.getMonth()), [now]);

  useEffect(() => {
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
      .then((r) => r.json())
      .then((data) => setApod(data))
      .catch(() => {})
      .finally(() => setApodLoading(false));

    fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=6")
      .then((r) => r.json())
      .then((data) => setNews(data.results || []))
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="relative overflow-hidden">
      {/* Background stars effect */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0F172A_0%,_#030712_70%)]" />
        {/* Animated subtle star dots via CSS */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #E2E8F0, transparent),
              radial-gradient(1px 1px at 80px 120px, #94A3B8, transparent),
              radial-gradient(1px 1px at 160px 60px, #E2E8F0, transparent),
              radial-gradient(1.5px 1.5px at 250px 200px, #FDE68A, transparent),
              radial-gradient(1px 1px at 350px 80px, #94A3B8, transparent),
              radial-gradient(1px 1px at 420px 160px, #E2E8F0, transparent),
              radial-gradient(1.5px 1.5px at 550px 30px, #06B6D4, transparent),
              radial-gradient(1px 1px at 650px 220px, #94A3B8, transparent),
              radial-gradient(1px 1px at 750px 100px, #E2E8F0, transparent),
              radial-gradient(1px 1px at 850px 180px, #94A3B8, transparent),
              radial-gradient(1.5px 1.5px at 950px 50px, #FDE68A, transparent),
              radial-gradient(1px 1px at 100px 300px, #E2E8F0, transparent),
              radial-gradient(1px 1px at 300px 350px, #94A3B8, transparent),
              radial-gradient(1px 1px at 500px 310px, #E2E8F0, transparent),
              radial-gradient(1.5px 1.5px at 700px 380px, #06B6D4, transparent),
              radial-gradient(1px 1px at 900px 340px, #94A3B8, transparent)`,
            backgroundSize: "1000px 400px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ============ HERO HEADER ============ */}
        <header className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Telescope className="h-4 w-4" />
            Astronomy Dashboard
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore the{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Night Sky
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Moon phases, upcoming eclipses, planet visibility, and the latest
            from the cosmos — all in one place.
          </p>
        </header>

        {/* ============ TOP ROW: MOON + ECLIPSES ============ */}
        <div className="mb-10 grid gap-8 lg:grid-cols-5">
          {/* ---- MOON PHASE WIDGET ---- */}
          <section className="lg:col-span-2 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm p-8 flex flex-col items-center text-center relative overflow-hidden">
            {/* Glow accent */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-amber-400/10 blur-3xl" />

            <h2 className="font-heading text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Moon className="h-5 w-5 text-amber-300" />
              Moon Phase
            </h2>
            <p className="text-xs text-muted mb-6">{formatDate(now)}</p>

            <MoonSVG phase={moon.phase} />

            <div className="mt-6 space-y-1">
              <p className="text-2xl font-heading font-bold text-white">
                {moon.phaseName}
              </p>
              <p className="text-secondary text-lg font-semibold">
                {moon.illumination}% Illuminated
              </p>
            </div>

            <div className="mt-6 w-full grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-dark-bg/60 border border-card-border/60 p-3">
                <p className="text-muted text-xs mb-1">Next Full Moon</p>
                <p className="text-white font-semibold">{formatDate(moon.nextFull)}</p>
              </div>
              <div className="rounded-xl bg-dark-bg/60 border border-card-border/60 p-3">
                <p className="text-muted text-xs mb-1">Next New Moon</p>
                <p className="text-white font-semibold">{formatDate(moon.nextNew)}</p>
              </div>
            </div>
          </section>

          {/* ---- UPCOMING ECLIPSES ---- */}
          <section className="lg:col-span-3 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-400" />
              Upcoming Eclipses
            </h2>

            <div className="space-y-3">
              {eclipses.map((e, i) => {
                const days = daysUntil(e.dateObj, now);
                const isNext = i === 0;
                return (
                  <div
                    key={e.date}
                    className={`relative flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                      isNext
                        ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(79,70,229,0.08)]"
                        : "border-card-border/60 bg-dark-bg/40 hover:border-card-border"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        e.kind === "solar"
                          ? "bg-amber-400/15 text-amber-400"
                          : "bg-indigo-400/15 text-indigo-400"
                      }`}
                    >
                      {e.kind === "solar" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">
                          {e.type}
                        </span>
                        {isNext && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Next
                          </span>
                        )}
                      </div>
                      <p className="text-muted text-xs mt-0.5">
                        {e.date} &middot; {e.visibility}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-sm font-bold ${
                          isNext ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {days}
                      </span>
                      <p className="text-[10px] text-muted">days away</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <AdBanner />

        {/* ============ PLANET VISIBILITY ============ */}
        <section className="mb-10 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-60 rounded-full bg-secondary/10 blur-3xl" />
          <h2 className="font-heading text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Eye className="h-5 w-5 text-secondary" />
            Planet Visibility Tonight
          </h2>
          <p className="text-sm text-muted mb-6">
            Approximate visibility for{" "}
            {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {planets.map((p) => {
              const isVisible = p.visibility !== "Not Visible";
              return (
                <div
                  key={p.name}
                  className={`group relative flex flex-col items-center rounded-xl border p-5 text-center transition-all ${
                    isVisible
                      ? "border-card-border bg-dark-bg/60 hover:border-secondary/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]"
                      : "border-card-border/40 bg-dark-bg/30 opacity-60"
                  }`}
                >
                  {/* Planet dot */}
                  <div
                    className={`mb-3 rounded-full ${p.size}`}
                    style={{
                      backgroundColor: p.color,
                      boxShadow: isVisible
                        ? `0 0 16px ${p.color}55`
                        : "none",
                    }}
                  />
                  <p className="font-semibold text-white text-sm">{p.name}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    {isVisible ? (
                      <>
                        {p.visibility === "Morning" && (
                          <Sunrise className="h-3.5 w-3.5 text-amber-400" />
                        )}
                        {p.visibility === "Evening" && (
                          <Sunset className="h-3.5 w-3.5 text-indigo-400" />
                        )}
                        {p.visibility === "All Night" && (
                          <Star className="h-3.5 w-3.5 text-secondary" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            p.visibility === "Morning"
                              ? "text-amber-400"
                              : p.visibility === "Evening"
                              ? "text-indigo-400"
                              : "text-secondary"
                          }`}
                        >
                          {p.visibility}
                        </span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-muted-dark" />
                        <span className="text-xs text-muted-dark">
                          Not Visible
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ APOD ============ */}
        <section className="mb-10 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm overflow-hidden relative">
          <div className="pointer-events-none absolute -top-24 right-1/4 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
          <div className="p-8 pb-4">
            <h2 className="font-heading text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              NASA Astronomy Picture of the Day
            </h2>
            <p className="text-sm text-muted">
              Curated daily by NASA scientists
            </p>
          </div>

          {apodLoading ? (
            <div className="flex items-center justify-center p-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : apod ? (
            <div className="md:flex">
              {/* Image */}
              <div className="relative md:w-1/2 aspect-video md:aspect-auto md:min-h-[360px]">
                {apod.media_type === "image" ? (
                  <Image
                    src={apod.url}
                    alt={apod.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="h-full w-full min-h-[300px]"
                    allowFullScreen
                  />
                )}
              </div>
              {/* Details */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="text-xs text-muted mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {apod.date}
                </span>
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  {apod.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-6">
                  {apod.explanation}
                </p>
                {apod.hdurl && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    View HD Image
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-muted">
              Unable to load the Astronomy Picture of the Day. Please try again later.
            </div>
          )}
        </section>

        {/* ============ SPACE NEWS ============ */}
        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-secondary" />
              Latest Space News
            </h2>
          </div>

          {newsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-card-border bg-card-bg/80 overflow-hidden"
                >
                  <div className="aspect-video bg-card-border/30" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-card-border/40 rounded w-3/4" />
                    <div className="h-3 bg-card-border/30 rounded w-full" />
                    <div className="h-3 bg-card-border/30 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm overflow-hidden transition-all hover:border-card-border hover:shadow-[0_0_30px_rgba(79,70,229,0.06)] hover:-translate-y-0.5"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-card-border/20">
                        <Rocket className="h-10 w-10 text-muted-dark" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card-bg/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-[11px] text-muted">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                        {article.news_site}
                      </span>
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary group-hover:gap-2 transition-all">
                      Read more
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-card-border bg-card-bg/80 p-16 text-center text-muted">
              Unable to load space news. Please try again later.
            </div>
          )}
        </section>

        {/* ============ QUICK LINKS ============ */}
        <section className="mb-4 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
          <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Quick Links
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-xl border border-card-border/60 bg-dark-bg/40 p-5 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(79,70,229,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                      {link.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted leading-tight hidden sm:block">
                      {link.desc}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
