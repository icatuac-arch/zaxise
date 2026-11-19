"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  ArrowRightLeft,
  Clock,
  Briefcase,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Zap,
  Baby,
  CalendarRange,
  Plus,
  Minus,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function diffYMD(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

function businessDays(start: Date, end: Date, includeEnd: boolean): number {
  let count = 0;
  const cur = new Date(start);
  const limit = new Date(end);
  if (includeEnd) limit.setDate(limit.getDate() + 1);
  while (cur < limit) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function countWeekends(totalDays: number, start: Date): number {
  let weekends = 0;
  const cur = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    if (cur.getDay() === 0 || cur.getDay() === 6) weekends++;
    cur.setDate(cur.getDate() + 1);
  }
  return Math.floor(weekends / 2);
}

function leapYearsBetween(y1: number, y2: number): number {
  let count = 0;
  for (let y = y1; y <= y2; y++) {
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) count++;
  }
  return count;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* ------------------------------------------------------------------ */
/*  STAT CARD                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted text-sm">
        {icon}
        {label}
      </div>
      <p className="text-xl sm:text-2xl font-heading font-bold text-[#E2E8F0]">
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DateDifferencePage() {
  const today = toDateStr(new Date());

  // Mode toggle
  const [mode, setMode] = useState<"difference" | "add-subtract">(
    "difference"
  );

  // Date Difference state
  const [startStr, setStartStr] = useState(today);
  const [endStr, setEndStr] = useState(today);
  const [includeEnd, setIncludeEnd] = useState(false);

  // Add/Subtract state
  const [asStartStr, setAsStartStr] = useState(today);
  const [asDays, setAsDays] = useState(0);
  const [asMonths, setAsMonths] = useState(0);
  const [asYears, setAsYears] = useState(0);
  const [asOperation, setAsOperation] = useState<"add" | "subtract">("add");

  const start = parseDate(startStr);
  const end = parseDate(endStr);

  const result = useMemo(() => {
    if (!start || !end) return null;

    let s = start;
    let e = end;
    let swapped = false;
    if (s > e) {
      [s, e] = [e, s];
      swapped = true;
    }

    const diffMs = e.getTime() - s.getTime() + (includeEnd ? 86400000 : 0);
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = totalDays / 7;
    const totalMonths =
      (e.getFullYear() - s.getFullYear()) * 12 +
      (e.getMonth() - s.getMonth()) +
      (includeEnd ? 0 : 0);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    const ymd = diffYMD(s, e);
    if (includeEnd) {
      // adjust days +1
      const adjEnd = new Date(e);
      adjEnd.setDate(adjEnd.getDate() + 1);
      const adj = diffYMD(s, adjEnd);
      ymd.years = adj.years;
      ymd.months = adj.months;
      ymd.days = adj.days;
    }

    const bDays = businessDays(s, e, includeEnd);
    const weekends = countWeekends(totalDays, s);
    const leapYears = leapYearsBetween(s.getFullYear(), e.getFullYear());

    return {
      swapped,
      ymd,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      bDays,
      weekends,
      leapYears,
    };
  }, [start, end, includeEnd]);

  // Add/Subtract result
  const asResult = useMemo(() => {
    const startDate = parseDate(asStartStr);
    if (!startDate) return null;
    if (asDays === 0 && asMonths === 0 && asYears === 0) return null;

    const resultDate = new Date(startDate);
    const multiplier = asOperation === "add" ? 1 : -1;

    // Apply years first, then months, then days
    resultDate.setFullYear(resultDate.getFullYear() + asYears * multiplier);
    resultDate.setMonth(resultDate.getMonth() + asMonths * multiplier);
    resultDate.setDate(resultDate.getDate() + asDays * multiplier);

    const dayOfWeek = DAY_NAMES[resultDate.getDay()];
    const formattedDate = resultDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate total days between start and result
    const diffMs = Math.abs(resultDate.getTime() - startDate.getTime());
    const totalDaysDiff = Math.round(diffMs / 86400000);

    return {
      date: resultDate,
      dateStr: toDateStr(resultDate),
      dayOfWeek,
      formattedDate,
      totalDaysDiff,
    };
  }, [asStartStr, asDays, asMonths, asYears, asOperation]);

  function handleSwap() {
    const tmp = startStr;
    setStartStr(endStr);
    setEndStr(tmp);
  }

  function handleTodayTo() {
    setStartStr(today);
  }

  function handleBirthToToday() {
    setEndStr(today);
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <CalendarDays className="w-4 h-4" />
            Date Tool
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#E2E8F0] mb-3">
            Date Difference Calculator
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Calculate the exact time between any two dates — in years, months,
            days, weeks, hours, minutes, seconds, and business days.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl overflow-hidden border border-card-border bg-card-bg">
            <button
              onClick={() => setMode("difference")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
                mode === "difference"
                  ? "bg-primary text-[#030712]"
                  : "text-muted hover:text-[#E2E8F0]"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Date Difference
            </button>
            <button
              onClick={() => setMode("add-subtract")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
                mode === "add-subtract"
                  ? "bg-primary text-[#030712]"
                  : "text-muted hover:text-[#E2E8F0]"
              }`}
            >
              <Plus className="w-4 h-4" />
              Add/Subtract Days
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* DATE DIFFERENCE MODE                         */}
        {/* ============================================ */}
        {mode === "difference" && (
          <>
            {/* Date Pickers */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
              <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                {/* Start */}
                <div>
                  <label className="block text-sm text-muted mb-1.5 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startStr}
                    onChange={(e) => setStartStr(e.target.value)}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Swap */}
                <button
                  onClick={handleSwap}
                  title="Swap dates"
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors self-end mb-1"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                {/* End */}
                <div>
                  <label className="block text-sm text-muted mb-1.5 font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endStr}
                    onChange={(e) => setEndStr(e.target.value)}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Swap mobile */}
              <button
                onClick={handleSwap}
                className="sm:hidden mt-3 flex items-center gap-2 text-primary text-sm"
              >
                <ArrowRightLeft className="w-4 h-4" /> Swap dates
              </button>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4 mt-5">
                {/* Toggle */}
                <button
                  onClick={() => setIncludeEnd(!includeEnd)}
                  className="flex items-center gap-2 text-sm text-[#E2E8F0]"
                >
                  {includeEnd ? (
                    <ToggleRight className="w-6 h-6 text-primary" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-muted" />
                  )}
                  Include end date
                </button>

                {/* Quick buttons */}
                <button
                  onClick={handleTodayTo}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" /> Today as start
                </button>
                <button
                  onClick={handleBirthToToday}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                >
                  <Baby className="w-3.5 h-3.5" /> Today as end
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <>
                {result.swapped && (
                  <p className="text-center text-sm text-yellow-400 mb-4">
                    Dates were swapped (start was after end).
                  </p>
                )}

                {/* Primary breakdown */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-6">
                  <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
                    <CalendarRange className="w-5 h-5 text-primary" />
                    Date Breakdown
                  </h2>
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-[#E2E8F0]">
                    {result.ymd.years > 0 && (
                      <span>
                        {result.ymd.years}{" "}
                        <span className="text-primary">
                          {result.ymd.years === 1 ? "year" : "years"}
                        </span>
                        ,{" "}
                      </span>
                    )}
                    {result.ymd.months > 0 && (
                      <span>
                        {result.ymd.months}{" "}
                        <span className="text-secondary">
                          {result.ymd.months === 1 ? "month" : "months"}
                        </span>

            <AdBanner />
                        ,{" "}
                      </span>
                    )}
                    <span>
                      {result.ymd.days}{" "}
                      <span className="text-muted">
                        {result.ymd.days === 1 ? "day" : "days"}
                      </span>
                    </span>
                  </p>
                </div>

                {/* Totals grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Total Days"
                    value={fmt(result.totalDays)}
                  />
                  <StatCard
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Total Weeks"
                    value={result.totalWeeks.toFixed(1)}
                  />
                  <StatCard
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Total Months"
                    value={fmt(result.totalMonths)}
                  />
                  <StatCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Total Hours"
                    value={fmt(result.totalHours)}
                  />
                  <StatCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Total Minutes"
                    value={fmt(result.totalMinutes)}
                  />
                  <StatCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Total Seconds"
                    value={fmt(result.totalSeconds)}
                  />
                  <StatCard
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Business Days"
                    value={fmt(result.bDays)}
                  />
                </div>

                {/* Fun facts */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8">
                  <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    Fun Facts
                  </h2>
                  <ul className="space-y-3 text-[#E2E8F0]">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">&#x2022;</span>
                      That&#39;s roughly{" "}
                      <span className="font-semibold text-secondary">
                        {fmt(result.weekends)}
                      </span>{" "}
                      full weekends
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">&#x2022;</span>
                      <span className="font-semibold text-primary">
                        {fmt(result.leapYears)}
                      </span>{" "}
                      leap year{result.leapYears !== 1 ? "s" : ""} in between
                    </li>
                    {result.totalDays > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-secondary mt-1">&#x2022;</span>
                        About{" "}
                        <span className="font-semibold">
                          {fmt(result.totalDays * 3)}
                        </span>{" "}
                        meals eaten (3/day)
                      </li>
                    )}
                    {result.totalDays >= 365 && (
                      <li className="flex items-start gap-2">
                        <span className="text-secondary mt-1">&#x2022;</span>
                        You slept roughly{" "}
                        <span className="font-semibold">
                          {fmt(Math.round(result.totalHours / 3))}
                        </span>{" "}
                        hours (8h/day)
                      </li>
                    )}
                    {result.totalDays > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-secondary mt-1">&#x2022;</span>
                        Your heart beat about{" "}
                        <span className="font-semibold text-red-400">
                          {fmt(result.totalDays * 100000)}
                        </span>{" "}
                        times (100k/day)
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* ADD/SUBTRACT MODE                            */}
        {/* ============================================ */}
        {mode === "add-subtract" && (
          <>
            <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
              {/* Start Date */}
              <div className="mb-6">
                <label className="block text-sm text-muted mb-1.5 font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  value={asStartStr}
                  onChange={(e) => setAsStartStr(e.target.value)}
                  className="w-full sm:w-64 bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Add/Subtract Toggle */}
              <div className="mb-6">
                <label className="block text-sm text-muted mb-2 font-medium">
                  Operation
                </label>
                <div className="inline-flex rounded-lg overflow-hidden border border-card-border">
                  <button
                    onClick={() => setAsOperation("add")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      asOperation === "add"
                        ? "bg-primary text-[#030712]"
                        : "bg-dark-bg text-muted hover:text-[#E2E8F0]"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    onClick={() => setAsOperation("subtract")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      asOperation === "subtract"
                        ? "bg-primary text-[#030712]"
                        : "bg-dark-bg text-muted hover:text-[#E2E8F0]"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    Subtract
                  </button>
                </div>
              </div>

              {/* Duration Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1.5 font-medium">
                    Years
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={asYears}
                    onChange={(e) =>
                      setAsYears(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5 font-medium">
                    Months
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={asMonths}
                    onChange={(e) =>
                      setAsMonths(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5 font-medium">
                    Days
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={asDays}
                    onChange={(e) =>
                      setAsDays(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Quick set today */}
              <div className="mt-4">
                <button
                  onClick={() => setAsStartStr(today)}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" /> Set to today
                </button>
              </div>
            </div>

            {/* Result */}
            {asResult && (
              <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-primary" />
                  Result
                </h2>

                {/* Resulting date */}
                <div className="mb-6">
                  <p className="text-sm text-muted mb-2">
                    {asOperation === "add" ? "Adding" : "Subtracting"}{" "}
                    {asYears > 0 && (
                      <span>
                        {asYears} {asYears === 1 ? "year" : "years"}
                        {asMonths > 0 || asDays > 0 ? ", " : ""}
                      </span>
                    )}
                    {asMonths > 0 && (
                      <span>
                        {asMonths} {asMonths === 1 ? "month" : "months"}
                        {asDays > 0 ? ", " : ""}
                      </span>
                    )}
                    {asDays > 0 && (
                      <span>
                        {asDays} {asDays === 1 ? "day" : "days"}
                      </span>
                    )}{" "}
                    {asOperation === "add" ? "to" : "from"}{" "}
                    {parseDate(asStartStr)?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-[#E2E8F0]">
                    {asResult.formattedDate}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Day of Week"
                    value={asResult.dayOfWeek}
                  />
                  <StatCard
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Total Days Apart"
                    value={fmt(asResult.totalDaysDiff)}
                  />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!asResult && (
              <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 text-center">
                <p className="text-muted">
                  Enter the number of days, months, or years to add or subtract
                  to see the resulting date.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
