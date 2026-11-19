"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Hash,
  Search,
  ArrowRight,
  Info,
  Grid3X3,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getISOWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getISOWeekYear(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  return tmp.getUTCFullYear();
}

function getUSWeek(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime() + (start.getDay() * 86400000);
  return Math.ceil((diff / 86400000 + 1) / 7);
}

function isoWeeksInYear(year: number): number {
  const d = new Date(year, 11, 28);
  return getISOWeek(d);
}

function getWeekStartISO(week: number, year: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const start = new Date(jan4);
  start.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  return start;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function WeekNumberPage() {
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentWeekYear = getISOWeekYear(now);
  const totalWeeks = isoWeeksInYear(currentWeekYear);
  const progress = (currentWeek / totalWeeks) * 100;

  const [lookupDate, setLookupDate] = useState(toDateStr(now));
  const [reverseWeek, setReverseWeek] = useState(String(currentWeek));
  const [reverseYear, setReverseYear] = useState(String(now.getFullYear()));

  const lookupResult = useMemo(() => {
    const d = new Date(lookupDate + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    return {
      iso: getISOWeek(d),
      us: getUSWeek(d),
      year: getISOWeekYear(d),
    };
  }, [lookupDate]);

  const reverseResult = useMemo(() => {
    const w = parseInt(reverseWeek);
    const y = parseInt(reverseYear);
    if (!w || !y || w < 1 || w > 53) return null;
    const d = getWeekStartISO(w, y);
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    return { start: d, end };
  }, [reverseWeek, reverseYear]);

  // Calendar grid: all weeks of current year
  const calendarWeeks = useMemo(() => {
    const year = now.getFullYear();
    const weeks: { week: number; start: Date }[] = [];
    const total = isoWeeksInYear(year);
    for (let w = 1; w <= total; w++) {
      weeks.push({ week: w, start: getWeekStartISO(w, year) });
    }
    return weeks;
  }, []);

  // Next 12 months compact grid
  const next12Months = useMemo(() => {
    const months: { month: string; year: number; weeks: number[] }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const weeksInMonth: Set<number> = new Set();
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dd = new Date(d.getFullYear(), d.getMonth(), day);
        weeksInMonth.add(getISOWeek(dd));
      }
      months.push({
        month: MONTH_NAMES[d.getMonth()],
        year: d.getFullYear(),
        weeks: Array.from(weeksInMonth).sort((a, b) => a - b),
      });
    }
    return months;
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Hash className="w-4 h-4" />
            Week Tool
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#E2E8F0] mb-3">
            What Week Is It?
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Week Number Calculator &mdash; find the current week, look up any
            date, or discover when a week starts.
          </p>
        </div>

        {/* Big display */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 sm:p-10 text-center mb-8">
          <p className="text-muted text-sm mb-2 uppercase tracking-wider">
            Current Week
          </p>
          <p className="text-5xl sm:text-7xl font-heading font-extrabold text-[#E2E8F0]">
            Week{" "}
            <span className="text-primary">{currentWeek}</span>
          </p>
          <p className="text-xl text-muted mt-2">
            of {currentWeekYear} &middot; {totalWeeks} weeks this year
          </p>

          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Week 1</span>
              <span>{progress.toFixed(1)}% through the year</span>
              <span>Week {totalWeeks}</span>
            </div>
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Two-column tools */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Lookup */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              What week number is...?
            </h2>
            <input
              type="date"
              value={lookupDate}
              onChange={(e) => setLookupDate(e.target.value)}
              className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
            />
            {lookupResult && (
              <div className="space-y-2">
                <p className="text-[#E2E8F0]">
                  ISO Week:{" "}
                  <span className="font-bold text-primary text-xl">
                    {lookupResult.iso}
                  </span>{" "}
                  <span className="text-muted text-sm">
                    of {lookupResult.year}
                  </span>
                </p>
                <p className="text-[#E2E8F0]">
                  US Week:{" "}
                  <span className="font-bold text-secondary text-xl">
                    {lookupResult.us}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Reverse lookup */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-secondary" />
              When does week ___ start?
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm text-muted mb-1">Week #</label>
                <input
                  type="number"
                  min={1}
                  max={53}
                  value={reverseWeek}
                  onChange={(e) => setReverseWeek(e.target.value)}
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Year</label>
                <input
                  type="number"
                  min={1970}
                  max={2100}
                  value={reverseYear}
                  onChange={(e) => setReverseYear(e.target.value)}
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            {reverseResult && (
              <p className="text-[#E2E8F0]">
                <span className="font-semibold">{fmtDate(reverseResult.start)}</span>
                <span className="text-muted"> &mdash; </span>
                <span className="font-semibold">{fmtDate(reverseResult.end)}</span>
              </p>
            )}
          </div>
        </div>

        <AdBanner />

        {/* Calendar grid */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            {now.getFullYear()} Week Calendar
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
            {calendarWeeks.map((w) => (
              <button
                key={w.week}
                onClick={() => {
                  setReverseWeek(String(w.week));
                  setReverseYear(String(now.getFullYear()));
                }}
                className={`rounded-lg py-2 text-center text-sm font-medium transition-colors ${
                  w.week === currentWeek
                    ? "bg-primary text-white ring-2 ring-primary/50"
                    : "bg-dark-bg text-muted hover:bg-card-border hover:text-[#E2E8F0]"
                }`}
              >
                {w.week}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            Click a week to see its date range above.
          </p>
        </div>

        {/* Next 12 months */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-secondary" />
            Week Numbers for the Next 12 Months
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {next12Months.map((m, i) => (
              <div
                key={i}
                className="bg-dark-bg rounded-lg p-3 border border-card-border"
              >
                <p className="text-sm font-semibold text-[#E2E8F0] mb-1">
                  {m.month} {m.year}
                </p>
                <p className="text-xs text-muted">
                  Weeks:{" "}
                  {m.weeks.map((w, j) => (
                    <span key={j}>
                      <span
                        className={
                          w === currentWeek && m.year === now.getFullYear()
                            ? "text-primary font-bold"
                            : ""
                        }
                      >
                        {w}
                      </span>
                      {j < m.weeks.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ISO vs US explanation */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            ISO vs US Week Numbering
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-heading font-semibold text-primary mb-2">
                ISO 8601 (International)
              </h3>
              <ul className="space-y-1.5 text-sm text-muted">
                <li>&#x2022; Weeks start on <span className="text-[#E2E8F0] font-medium">Monday</span></li>
                <li>&#x2022; Week 1 contains the first <span className="text-[#E2E8F0] font-medium">Thursday</span> of the year</li>
                <li>&#x2022; Used by most of Europe, Asia, and international business</li>
                <li>&#x2022; A year has 52 or 53 weeks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-secondary mb-2">
                US / North American
              </h3>
              <ul className="space-y-1.5 text-sm text-muted">
                <li>&#x2022; Weeks start on <span className="text-[#E2E8F0] font-medium">Sunday</span></li>
                <li>&#x2022; Week 1 begins on <span className="text-[#E2E8F0] font-medium">January 1</span> regardless of day</li>
                <li>&#x2022; Used in the United States, Canada, and some others</li>
                <li>&#x2022; A year can have 53 or 54 weeks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
