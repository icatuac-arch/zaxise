"use client";

import { useState, useEffect, useRef } from "react";
import {
  Globe,
  Users,
  Baby,
  Skull,
  TrendingUp,
  Clock,
  Milestone,
  Sparkles,
  Heart,
  RotateCw,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const BASE_POPULATION = 8_200_000_000;
const BASE_DATE = new Date("2026-01-01T00:00:00Z");
const GROWTH_PER_SECOND = 2.3;
const BIRTHS_PER_DAY = 385_000;
const DEATHS_PER_DAY = 170_000;
const BIRTHS_PER_SECOND = BIRTHS_PER_DAY / 86400;
const DEATHS_PER_SECOND = DEATHS_PER_DAY / 86400;

const CONTINENTS = [
  { name: "Asia", population: 4_800_000_000, percent: 59, color: "#4F46E5" },
  { name: "Africa", population: 1_500_000_000, percent: 18, color: "#06B6D4" },
  { name: "Europe", population: 750_000_000, percent: 9, color: "#8B5CF6" },
  {
    name: "North America",
    population: 580_000_000,
    percent: 7,
    color: "#F59E0B",
  },
  {
    name: "South America",
    population: 440_000_000,
    percent: 5,
    color: "#10B981",
  },
  { name: "Oceania", population: 46_000_000, percent: 0.6, color: "#EF4444" },
];

const MILESTONES = [
  { billion: 1, year: 1804, gap: null },
  { billion: 2, year: 1927, gap: 123 },
  { billion: 3, year: 1960, gap: 33 },
  { billion: 4, year: 1974, gap: 14 },
  { billion: 5, year: 1987, gap: 13 },
  { billion: 6, year: 1999, gap: 12 },
  { billion: 7, year: 2011, gap: 12 },
  { billion: 8, year: 2022, gap: 11 },
  { billion: 9, year: 2037, gap: 15, projected: true },
  { billion: 10, year: 2058, gap: 21, projected: true },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}

function fmtDec(n: number, d: number): string {
  return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getMidnightToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function PopulationClockPage() {
  const [now, setNow] = useState<Date>(new Date());
  const pageOpenRef = useRef<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  const secondsSinceBase =
    (now.getTime() - BASE_DATE.getTime()) / 1000;
  const population = BASE_POPULATION + secondsSinceBase * GROWTH_PER_SECOND;

  const secondsSinceMidnight =
    (now.getTime() - getMidnightToday().getTime()) / 1000;
  const birthsToday = secondsSinceMidnight * BIRTHS_PER_SECOND;
  const deathsToday = secondsSinceMidnight * DEATHS_PER_SECOND;
  const netToday = birthsToday - deathsToday;

  const secondsOnPage =
    (now.getTime() - pageOpenRef.current.getTime()) / 1000;
  const babiesSincePage = secondsOnPage * BIRTHS_PER_SECOND;
  const deathsSincePage = secondsOnPage * DEATHS_PER_SECOND;
  const degreesRotated = (secondsOnPage / 86400) * 360;

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-4 py-1.5 text-sm text-muted">
            <Globe className="h-4 w-4 text-secondary" />
            Live Real-Time Data
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            World{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Population Clock
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Watch humanity grow in real-time. Every number you see is ticking
            live.
          </p>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  GIANT LIVE COUNTER                                       */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12 rounded-2xl border border-card-border bg-card-bg p-8 text-center sm:p-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">
            Current World Population
          </p>
          <p className="font-heading text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
            {fmt(population)}
          </p>
          <p className="mt-4 text-muted">
            Growing by ~<span className="text-secondary font-semibold">2.3</span>{" "}
            people every second
          </p>
        </section>

        {/* -------------------------------------------------------- */}
        {/*  STATS DASHBOARD                                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6 text-primary" />
            Today&apos;s Stats
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={<Baby className="h-5 w-5 text-green-400" />}
              label="Births Today"
              value={fmt(birthsToday)}
              sub={`~${fmtDec(BIRTHS_PER_SECOND, 1)}/sec`}
              accent="text-green-400"
            />
            <StatCard
              icon={<Skull className="h-5 w-5 text-red-400" />}
              label="Deaths Today"
              value={fmt(deathsToday)}
              sub={`~${fmtDec(DEATHS_PER_SECOND, 1)}/sec`}
              accent="text-red-400"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-secondary" />}
              label="Net Growth Today"
              value={`+${fmt(netToday)}`}
              sub={`~${fmtDec(BIRTHS_PER_SECOND - DEATHS_PER_SECOND, 1)}/sec`}
              accent="text-secondary"
            />
            <StatCard
              icon={<Baby className="h-5 w-5 text-green-400" />}
              label="Births per Second"
              value={fmtDec(BIRTHS_PER_SECOND, 1)}
              sub={`${fmt(BIRTHS_PER_DAY)}/day`}
              accent="text-green-400"
            />
            <StatCard
              icon={<Skull className="h-5 w-5 text-red-400" />}
              label="Deaths per Second"
              value={fmtDec(DEATHS_PER_SECOND, 1)}
              sub={`${fmt(DEATHS_PER_DAY)}/day`}
              accent="text-red-400"
            />
            <StatCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              label="Net Growth per Second"
              value={fmtDec(GROWTH_PER_SECOND, 1)}
              sub={`~${fmt(GROWTH_PER_SECOND * 86400)}/day`}
              accent="text-primary"
            />
          </div>
        </section>

        <AdBanner />

        {/* -------------------------------------------------------- */}
        {/*  POPULATION BY CONTINENT                                  */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <Users className="h-6 w-6 text-secondary" />
            Population by Continent
          </h2>
          <div className="space-y-4 rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8">
            {CONTINENTS.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted">
                    {fmt(c.population)} ({c.percent}%)
                  </span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-full bg-dark-bg">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(c.percent, 1.5)}%`,
                      backgroundColor: c.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/*  POPULATION MILESTONES                                    */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <Milestone className="h-6 w-6 text-primary" />
            Population Milestones
          </h2>
          <div className="relative rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8">
            {/* vertical line */}
            <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-card-border sm:left-12" />
            <div className="space-y-6">
              {MILESTONES.map((m) => (
                <div key={m.billion} className="relative flex items-start gap-4 pl-6 sm:pl-8">
                  <div
                    className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      m.projected
                        ? "border border-dashed border-muted-dark bg-dark-bg text-muted"
                        : "bg-primary text-white"
                    }`}
                  >
                    {m.billion}B
                  </div>
                  <div>
                    <p className="font-semibold">
                      {m.projected ? `~${m.year}` : m.year}
                      {m.projected && (
                        <span className="ml-2 text-xs text-muted">(projected)</span>
                      )}
                    </p>
                    {m.gap !== null && (
                      <p className="text-sm text-muted">
                        +{m.gap} years from previous billion
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/*  FUN COMPARISONS                                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-secondary" />
            Since You Opened This Page
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <ComparisonCard
              icon={<Baby className="h-6 w-6 text-green-400" />}
              value={fmt(babiesSincePage)}
              label="Babies born"
            />
            <ComparisonCard
              icon={<Heart className="h-6 w-6 text-red-400" />}
              value={fmt(deathsSincePage)}
              label="People passed away"
            />
            <ComparisonCard
              icon={<RotateCw className="h-6 w-6 text-primary" />}
              value={degreesRotated.toFixed(4) + "\u00B0"}
              label="Earth has rotated"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <p className={`font-heading text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}

function ComparisonCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-card-border bg-card-bg p-6 text-center">
      {icon}
      <p className="mt-3 font-heading text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
