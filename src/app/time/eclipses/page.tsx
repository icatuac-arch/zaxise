"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sun,
  Moon,
  Eye,
  Shield,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  MapPin,
  Info,
  AlertTriangle,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type EclipseKind =
  | "Total Solar"
  | "Annular Solar"
  | "Partial Solar"
  | "Total Lunar"
  | "Partial Lunar"
  | "Penumbral Lunar";

interface Eclipse {
  date: string; // ISO
  type: EclipseKind;
  visibility: string;
}

const solarEclipses: Eclipse[] = [
  { date: "2026-02-17", type: "Annular Solar", visibility: "Antarctica, South Atlantic" },
  { date: "2026-08-12", type: "Total Solar", visibility: "Arctic, Greenland, Iceland, Spain, Russia" },
  { date: "2027-02-06", type: "Annular Solar", visibility: "Chile, Argentina, Atlantic, Africa" },
  { date: "2027-08-02", type: "Total Solar", visibility: "Morocco, Spain, Algeria, Tunisia, Libya, Egypt, Saudi Arabia" },
  { date: "2028-01-26", type: "Annular Solar", visibility: "South America, Atlantic, Spain, Portugal" },
  { date: "2028-07-22", type: "Total Solar", visibility: "Australia, New Zealand" },
  { date: "2029-01-14", type: "Partial Solar", visibility: "North America" },
  { date: "2029-06-12", type: "Partial Solar", visibility: "Arctic" },
  { date: "2029-12-05", type: "Partial Solar", visibility: "Antarctica" },
  { date: "2030-06-01", type: "Annular Solar", visibility: "North Africa, Greece, Turkey, Russia, China, Japan" },
  { date: "2030-11-25", type: "Total Solar", visibility: "Southern Africa, Indian Ocean, Australia" },
];

const lunarEclipses: Eclipse[] = [
  { date: "2026-03-03", type: "Total Lunar", visibility: "Americas, Europe, Africa" },
  { date: "2026-08-28", type: "Partial Lunar", visibility: "East Asia, Australia, Pacific, Americas" },
  { date: "2027-02-20", type: "Penumbral Lunar", visibility: "Americas, Europe, Africa" },
  { date: "2027-07-18", type: "Penumbral Lunar", visibility: "East Asia, Australia, Pacific, Americas" },
  { date: "2027-08-17", type: "Penumbral Lunar", visibility: "Pacific, Americas, Europe, Africa" },
  { date: "2028-01-12", type: "Partial Lunar", visibility: "Americas, Europe, Africa" },
  { date: "2028-07-06", type: "Partial Lunar", visibility: "East Asia, Australia, Pacific, Americas" },
  { date: "2028-12-31", type: "Total Lunar", visibility: "Americas, Europe, Africa, West Asia" },
  { date: "2029-06-26", type: "Total Lunar", visibility: "Americas, Europe, Africa, West Asia" },
  { date: "2029-12-20", type: "Total Lunar", visibility: "Americas, Europe, Africa, West Asia" },
];

const allEclipses: Eclipse[] = [...solarEclipses, ...lunarEclipses].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function isSolar(e: Eclipse) {
  return e.type.includes("Solar");
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(iso: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso + "T00:00:00");
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

function typeColor(type: EclipseKind): string {
  switch (type) {
    case "Total Solar":
      return "#EAB308";
    case "Annular Solar":
      return "#F97316";
    case "Partial Solar":
      return "#CBD5E1";
    case "Total Lunar":
      return "#EF4444";
    case "Partial Lunar":
      return "#F87171";
    case "Penumbral Lunar":
      return "#64748B";
  }
}

function typeBgClass(type: EclipseKind): string {
  switch (type) {
    case "Total Solar":
      return "bg-yellow-500/10 border-yellow-500/30";
    case "Annular Solar":
      return "bg-orange-500/10 border-orange-500/30";
    case "Partial Solar":
      return "bg-slate-400/10 border-slate-400/30";
    case "Total Lunar":
      return "bg-red-500/10 border-red-500/30";
    case "Partial Lunar":
      return "bg-red-400/10 border-red-400/30";
    case "Penumbral Lunar":
      return "bg-slate-500/10 border-slate-500/30";
  }
}

/* ------------------------------------------------------------------ */
/*  SVG ICONS FOR ECLIPSE TYPES                                        */
/* ------------------------------------------------------------------ */

function EclipseTypeIcon({ type, size = 40 }: { type: EclipseKind; size?: number }) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  if (type === "Total Solar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="corona" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#EAB308" stopOpacity="0" />
            <stop offset="80%" stopColor="#EAB308" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-gold">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r + 2} fill="url(#corona)" />
        <circle cx={cx} cy={cy} r={r * 0.85} fill="#EAB308" opacity="0.15" filter="url(#glow-gold)" />
        <circle cx={cx} cy={cy} r={r * 0.6} fill="#030712" />
      </svg>
    );
  }

  if (type === "Annular Solar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="glow-orange">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r * 0.75} fill="none" stroke="#F97316" strokeWidth="3" filter="url(#glow-orange)" />
        <circle cx={cx} cy={cy} r={r * 0.5} fill="#030712" />
      </svg>
    );
  }

  if (type === "Partial Solar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r * 0.65} fill="#CBD5E1" opacity="0.4" />
        <circle cx={cx + r * 0.25} cy={cy} r={r * 0.6} fill="#030712" />
      </svg>
    );
  }

  if (type === "Total Lunar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="blood-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r * 0.65} fill="url(#blood-moon)" filter="url(#glow-red)" />
      </svg>
    );
  }

  if (type === "Partial Lunar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r * 0.65} fill="#94A3B8" opacity="0.5" />
        <circle cx={cx - r * 0.2} cy={cy} r={r * 0.6} fill="#7F1D1D" opacity="0.7" />
      </svg>
    );
  }

  // Penumbral Lunar
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r * 0.65} fill="#475569" opacity="0.5" />
      <circle cx={cx} cy={cy} r={r * 0.65} fill="#64748B" opacity="0.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO SVG — SOLAR ECLIPSE ILLUSTRATION                              */
/* ------------------------------------------------------------------ */

function HeroEclipseSVG() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      className="mx-auto"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-corona-outer" cx="50%" cy="50%" r="50%">
          <stop offset="30%" stopColor="#EAB308" stopOpacity="0" />
          <stop offset="55%" stopColor="#EAB308" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#F97316" stopOpacity="0.12" />
          <stop offset="85%" stopColor="#EAB308" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-corona-inner" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#FBBF24" stopOpacity="0" />
          <stop offset="72%" stopColor="#FBBF24" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <filter id="hero-glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hero-soft-glow">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        {/* stars */}
        <filter id="twinkle">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* background stars */}
      {[
        [45, 30], [280, 55], [30, 260], [290, 240], [70, 130],
        [250, 150], [160, 30], [140, 290], [55, 200], [270, 100],
        [200, 270], [100, 60], [220, 40], [40, 170], [260, 200],
        [180, 60], [120, 240], [80, 80], [230, 280], [300, 160],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7} fill="white" opacity={0.3 + (i % 4) * 0.15} filter="url(#twinkle)" />
      ))}

      {/* outer corona glow */}
      <circle cx="160" cy="160" r="140" fill="url(#hero-corona-outer)" />

      {/* inner corona ring */}
      <circle cx="160" cy="160" r="95" fill="url(#hero-corona-inner)" filter="url(#hero-glow)" />

      {/* thin bright ring around the moon */}
      <circle cx="160" cy="160" r="62" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.6" filter="url(#hero-glow)" />
      <circle cx="160" cy="160" r="63" fill="none" stroke="#FDE68A" strokeWidth="0.5" opacity="0.4" />

      {/* the dark moon disk */}
      <circle cx="160" cy="160" r="60" fill="#030712" />

      {/* subtle corona streamers */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 160 + Math.cos(rad) * 64;
        const y1 = 160 + Math.sin(rad) * 64;
        const x2 = 160 + Math.cos(rad) * (100 + (i % 2) * 20);
        const y2 = 160 + Math.sin(rad) * (100 + (i % 2) * 20);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FBBF24"
            strokeWidth={i % 2 === 0 ? 1 : 0.5}
            opacity={0.15 + (i % 3) * 0.05}
            filter="url(#hero-soft-glow)"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  NEXT-ECLIPSE COUNTDOWN                                             */
/* ------------------------------------------------------------------ */

function useCountdown(targetISO: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(targetISO + "T00:00:00");
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { days, hours, minutes, seconds };
}

/* ------------------------------------------------------------------ */
/*  ALIGNMENT DIAGRAMS FOR EXPLAINER                                   */
/* ------------------------------------------------------------------ */

function AlignmentDiagram({ type }: { type: string }) {
  const w = 220;
  const h = 60;
  const sunR = 18;
  const moonR = 10;
  const earthR = 12;

  const sunX = 30;
  const moonX = 110;
  const earthX = 190;
  const cy = 30;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto">
      {/* connecting line */}
      <line x1={sunX + sunR} y1={cy} x2={earthX - earthR} y2={cy} stroke="#1E293B" strokeWidth="1" strokeDasharray="4 3" />

      {/* sun */}
      <circle cx={sunX} cy={cy} r={sunR} fill="#FBBF24" opacity="0.9" />
      <text x={sunX} y={h - 2} textAnchor="middle" className="fill-muted text-[9px]">Sun</text>

      {/* moon */}
      {type === "total-solar" && (
        <circle cx={moonX} cy={cy} r={moonR + 1} fill="#1E293B" stroke="#FBBF24" strokeWidth="1" opacity="0.9" />
      )}
      {type === "annular-solar" && (
        <>
          <circle cx={moonX} cy={cy} r={moonR - 2} fill="#1E293B" />
          <circle cx={moonX} cy={cy} r={moonR - 2} fill="none" stroke="#F97316" strokeWidth="1" />
        </>
      )}
      {type === "partial-solar" && (
        <>
          <circle cx={moonX} cy={cy} r={moonR} fill="#94A3B8" opacity="0.3" />
          <circle cx={moonX + 5} cy={cy} r={moonR} fill="#1E293B" />
        </>
      )}
      {(type === "total-lunar" || type === "partial-lunar" || type === "penumbral-lunar") && (
        <circle cx={moonX} cy={cy} r={moonR} fill="#94A3B8" opacity="0.5" />
      )}
      <text x={moonX} y={h - 2} textAnchor="middle" className="fill-muted text-[9px]">Moon</text>

      {/* earth */}
      <circle cx={earthX} cy={cy} r={earthR} fill="#06B6D4" opacity="0.7" />
      {type === "total-lunar" && (
        <>
          {/* earth shadow cone toward moon */}
          <line x1={earthX - earthR} y1={cy - 8} x2={moonX + moonR + 2} y2={cy - 4} stroke="#7F1D1D" strokeWidth="0.5" opacity="0.5" />
          <line x1={earthX - earthR} y1={cy + 8} x2={moonX + moonR + 2} y2={cy + 4} stroke="#7F1D1D" strokeWidth="0.5" opacity="0.5" />
        </>
      )}
      <text x={earthX} y={h - 2} textAnchor="middle" className="fill-muted text-[9px]">Earth</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  STAR FIELD BACKGROUND (CSS-BASED FOR PERFORMANCE)                  */
/* ------------------------------------------------------------------ */

function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, white 50%, transparent 100%), " +
            "radial-gradient(1px 1px at 30% 65%, white 50%, transparent 100%), " +
            "radial-gradient(1px 1px at 50% 10%, white 50%, transparent 100%), " +
            "radial-gradient(1px 1px at 70% 40%, white 50%, transparent 100%), " +
            "radial-gradient(1px 1px at 90% 80%, white 50%, transparent 100%), " +
            "radial-gradient(0.5px 0.5px at 15% 50%, white 50%, transparent 100%), " +
            "radial-gradient(0.5px 0.5px at 45% 85%, white 50%, transparent 100%), " +
            "radial-gradient(0.5px 0.5px at 75% 15%, white 50%, transparent 100%), " +
            "radial-gradient(0.5px 0.5px at 85% 55%, white 50%, transparent 100%), " +
            "radial-gradient(0.5px 0.5px at 25% 90%, white 50%, transparent 100%), " +
            "radial-gradient(1.5px 1.5px at 60% 30%, rgba(251,191,36,0.6) 50%, transparent 100%), " +
            "radial-gradient(1.5px 1.5px at 20% 75%, rgba(6,182,212,0.4) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function EclipsesPage() {
  const [filter, setFilter] = useState<"all" | "solar" | "lunar">("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [expandedExplainer, setExpandedExplainer] = useState<string | null>(null);

  const nextEclipse = useMemo(() => {
    return allEclipses.find((e) => daysUntil(e.date) > 0) || allEclipses[0];
  }, []);

  const countdown = useCountdown(nextEclipse.date);

  const filtered = useMemo(() => {
    let list = allEclipses;
    if (filter === "solar") list = list.filter(isSolar);
    if (filter === "lunar") list = list.filter((e) => !isSolar(e));
    if (yearFilter) list = list.filter((e) => new Date(e.date).getFullYear() === yearFilter);
    return list;
  }, [filter, yearFilter]);

  const years = [2026, 2027, 2028, 2029, 2030];

  return (
    <div className="relative min-h-screen bg-dark-bg">
      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        <StarField />
        {/* radial gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(79,70,229,0.08) 0%, transparent 70%), " +
              "radial-gradient(ellipse 40% 40% at 50% 60%, rgba(234,179,8,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <HeroEclipseSVG />
          <h1 className="font-heading mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Eclipse Calendar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted sm:text-xl">
            Track every solar and lunar eclipse from 2026 to 2030. Countdowns, visibility regions, and everything you need to witness the cosmos in motion.
          </p>
        </div>
      </section>

      {/* ---- NEXT ECLIPSE BANNER ---- */}
      <section className="relative mx-auto max-w-5xl px-4">
        <div
          className="overflow-hidden rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm"
          style={{
            boxShadow: `0 0 60px -15px ${typeColor(nextEclipse.type)}25`,
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${typeColor(nextEclipse.type)}, transparent)`,
            }}
          />
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            {/* icon + info */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
              <EclipseTypeIcon type={nextEclipse.type} size={56} />
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Next Eclipse
                </p>
                <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                  {nextEclipse.type}
                </h2>
                <p className="text-sm text-muted">
                  {formatDate(nextEclipse.date)}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3 w-3" />
                  {nextEclipse.visibility}
                </div>
              </div>
            </div>

            {/* countdown */}
            <div className="flex gap-3 sm:ml-auto sm:gap-4">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hrs" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Sec" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span
                    className="font-heading text-2xl font-extrabold tabular-nums sm:text-3xl"
                    style={{ color: typeColor(nextEclipse.type) }}
                  >
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- FILTER TABS ---- */}
      <section className="mx-auto mt-12 max-w-5xl px-4 sm:mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Eclipse Timeline
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-card-border bg-card-bg/60 p-1">
              {(["all", "solar", "lunar"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    filter === f
                      ? "bg-primary text-white"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {f === "all" ? "All" : f === "solar" ? (
                    <span className="flex items-center gap-1"><Sun className="h-3 w-3" /> Solar</span>
                  ) : (
                    <span className="flex items-center gap-1"><Moon className="h-3 w-3" /> Lunar</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-card-border bg-card-bg/60 p-1">
              <button
                onClick={() => setYearFilter(null)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  yearFilter === null ? "bg-secondary text-white" : "text-muted hover:text-white"
                }`}
              >
                All Years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    yearFilter === y ? "bg-secondary text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- TIMELINE ---- */}
        <div className="relative mt-8">
          {/* vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-card-border to-transparent sm:left-8" />

          <div className="space-y-4">
            {filtered.map((eclipse) => {
              const d = daysUntil(eclipse.date);
              const isPast = d < 0;
              const isNext = eclipse.date === nextEclipse.date;
              const color = typeColor(eclipse.type);

              return (
                <div
                  key={eclipse.date + eclipse.type}
                  className={`relative pl-12 sm:pl-20 ${isPast ? "opacity-50" : ""}`}
                >
                  {/* timeline dot */}
                  <div
                    className="absolute left-3 top-5 h-4 w-4 rounded-full border-2 sm:left-6"
                    style={{
                      borderColor: color,
                      backgroundColor: isNext ? color : "#0F172A",
                      boxShadow: isNext ? `0 0 12px ${color}60` : "none",
                    }}
                  />

                  <div
                    className={`rounded-xl border p-4 transition-all hover:border-opacity-60 sm:p-5 ${
                      isNext
                        ? "border-primary/40 bg-card-bg ring-1 ring-primary/20"
                        : "border-card-border bg-card-bg/60"
                    }`}
                    style={
                      isNext
                        ? { boxShadow: `0 0 30px -10px ${color}20` }
                        : undefined
                    }
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <EclipseTypeIcon type={eclipse.type} size={36} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${typeBgClass(eclipse.type)}`}
                              style={{ color }}
                            >
                              {eclipse.type}
                            </span>
                            {isNext && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                                <Sparkles className="h-2.5 w-2.5" /> Next
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-200">
                            {formatDate(eclipse.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-1.5 sm:items-end">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{eclipse.visibility}</span>
                        </div>
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: d === 0 ? "#22C55E" : d > 0 ? "#94A3B8" : "#64748B",
                          }}
                        >
                          {d === 0
                            ? "Today!"
                            : d > 0
                            ? `${d} day${d !== 1 ? "s" : ""} away`
                            : `${Math.abs(d)} day${Math.abs(d) !== 1 ? "s" : ""} ago`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted">
              <Filter className="mx-auto mb-3 h-8 w-8 opacity-40" />
              <p>No eclipses match your filters.</p>
            </div>
          )}
        </div>
      </section>

      <AdBanner />

      {/* ---- ECLIPSE TYPES EXPLAINER ---- */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:mt-28">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Understanding Eclipse Types
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Not all eclipses are the same. Here is what makes each type unique and how they occur.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {([
            {
              type: "Total Solar" as const,
              key: "total-solar",
              desc: "The Moon completely covers the Sun, revealing the corona. The sky darkens and stars become visible. The most spectacular of all eclipses.",
              rarity: "Rare at any given location (every 375 years on average)",
            },
            {
              type: "Annular Solar" as const,
              key: "annular-solar",
              desc: "The Moon is too far from Earth to fully cover the Sun, creating a brilliant 'ring of fire' around the dark lunar disk.",
              rarity: "Occurs when the Moon is near apogee",
            },
            {
              type: "Partial Solar" as const,
              key: "partial-solar",
              desc: "Only part of the Sun is obscured by the Moon. Visible from a wider area than total or annular eclipses.",
              rarity: "Most common type of solar eclipse",
            },
            {
              type: "Total Lunar" as const,
              key: "total-lunar",
              desc: "Earth's shadow completely covers the Moon, turning it a deep red or copper color — the famous 'Blood Moon' effect caused by sunlight filtering through Earth's atmosphere.",
              rarity: "Visible from an entire hemisphere",
            },
            {
              type: "Partial Lunar" as const,
              key: "partial-lunar",
              desc: "Only a portion of the Moon enters Earth's darkest shadow (umbra). Part of the Moon appears darkened while the rest stays bright.",
              rarity: "More common than total lunar eclipses",
            },
            {
              type: "Penumbral Lunar" as const,
              key: "penumbral-lunar",
              desc: "The Moon passes through Earth's faint outer shadow (penumbra). The dimming is subtle and often hard to notice without careful observation.",
              rarity: "Subtle — easy to miss without knowing",
            },
          ]).map(({ type, key, desc, rarity }) => {
            const open = expandedExplainer === key;
            return (
              <button
                key={key}
                onClick={() => setExpandedExplainer(open ? null : key)}
                className={`group rounded-xl border text-left transition-all ${
                  open
                    ? "border-primary/30 bg-card-bg ring-1 ring-primary/10"
                    : "border-card-border bg-card-bg/60 hover:border-card-border/80"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <EclipseTypeIcon type={type} size={32} />
                      <span
                        className="text-sm font-bold"
                        style={{ color: typeColor(type) }}
                      >
                        {type}
                      </span>
                    </div>
                    {open ? (
                      <ChevronUp className="h-4 w-4 text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted" />
                    )}
                  </div>

                  {open && (
                    <div className="mt-4 space-y-3">
                      <AlignmentDiagram type={key} />
                      <p className="text-sm leading-relaxed text-slate-300">
                        {desc}
                      </p>
                      <p className="text-xs italic text-muted">{rarity}</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- SAFETY TIPS ---- */}
      <section className="mx-auto mt-20 max-w-4xl px-4 pb-20 sm:mt-28 sm:pb-28">
        <div className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 via-card-bg to-card-bg">
          <div className="flex items-center gap-3 border-b border-yellow-500/10 bg-yellow-500/5 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/15">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-yellow-300">
              Solar Eclipse Safety
            </h2>
          </div>
          <div className="p-6 sm:p-8">
            <p className="mb-6 text-sm leading-relaxed text-slate-300">
              Looking directly at the Sun during a solar eclipse can cause permanent eye damage or blindness. Follow these essential safety guidelines.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Eye,
                  title: "Use Certified Eclipse Glasses",
                  text: "Only use glasses that meet the ISO 12312-2 international safety standard. Regular sunglasses are NOT safe, no matter how dark.",
                },
                {
                  icon: AlertTriangle,
                  title: "Never Look Through Optics Unfiltered",
                  text: "Cameras, binoculars, and telescopes concentrate sunlight and can cause instant damage. Use proper solar filters on the front of the optics.",
                },
                {
                  icon: Info,
                  title: "Pinhole Projection",
                  text: "A safe alternative: poke a small hole in cardboard and project the Sun's image onto a flat surface behind it. Great for groups and children.",
                },
                {
                  icon: Sparkles,
                  title: "Totality Exception",
                  text: "During the brief total phase of a total solar eclipse ONLY, it is safe to view with the naked eye. Put glasses back on immediately when the Sun reappears.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-lg border border-card-border bg-card-bg/60 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-yellow-400" />
                    <h3 className="text-sm font-semibold text-slate-200">
                      {title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
