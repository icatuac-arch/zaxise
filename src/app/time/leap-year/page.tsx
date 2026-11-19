"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowDown,
  ListOrdered,
  Lightbulb,
  PartyPopper,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function isLeapYear(y: number): boolean {
  if (y % 400 === 0) return true;
  if (y % 100 === 0) return false;
  if (y % 4 === 0) return true;
  return false;
}

function getNextLeapYears(from: number, count: number): number[] {
  const years: number[] = [];
  let y = from;
  while (years.length < count) {
    if (isLeapYear(y)) years.push(y);
    y++;
  }
  return years;
}

function daysUntilNextFeb29(): { date: Date; days: number } {
  const now = new Date();
  const y = now.getFullYear();
  for (let i = 0; i < 8; i++) {
    const candidate = y + i;
    if (isLeapYear(candidate)) {
      const feb29 = new Date(candidate, 1, 29);
      if (feb29.getTime() > now.getTime()) {
        const diff = Math.ceil(
          (feb29.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { date: feb29, days: diff };
      }
    }
  }
  return { date: new Date(), days: 0 };
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function LeapYearPage() {
  const currentYear = new Date().getFullYear();
  const [yearInput, setYearInput] = useState<string>(String(currentYear));
  const year = parseInt(yearInput, 10);
  const validYear = !isNaN(year) && year > 0 && year < 100000;
  const leap = validYear ? isLeapYear(year) : null;

  const upcomingLeapYears = useMemo(
    () => getNextLeapYears(currentYear, 20),
    [currentYear]
  );

  const nextFeb29 = useMemo(() => daysUntilNextFeb29(), []);

  const FACTS = [
    {
      icon: <PartyPopper className="h-5 w-5 text-secondary" />,
      text: 'February 29 babies ("leaplings") number about 5 million worldwide.',
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      text: "Chances of being born on Feb 29: 1 in 1,461.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
      text: "The year 2000 was special: a leap year by the 400 rule.",
    },
    {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      text: "1900 was NOT a leap year (divisible by 100 but not 400).",
    },
    {
      icon: <Calendar className="h-5 w-5 text-secondary" />,
      text: "Without leap years, the calendar would drift 24 days per century.",
    },
  ];

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-4 py-1.5 text-sm text-muted">
            <Calendar className="h-4 w-4 text-secondary" />
            Date Tool
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Leap Year{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Enter any year to find out if it&apos;s a leap year, and learn how
            the rules work.
          </p>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  YEAR INPUT + RESULT                                      */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12 rounded-2xl border border-card-border bg-card-bg p-6 sm:p-10">
          <label
            htmlFor="year-input"
            className="mb-2 block text-sm font-medium text-muted"
          >
            Enter a year
          </label>
          <input
            id="year-input"
            type="number"
            min={1}
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            className="mb-6 w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-2xl font-bold text-white outline-none focus:border-primary sm:text-3xl"
          />

          {validYear && leap !== null && (
            <div
              className={`flex items-center justify-center gap-3 rounded-xl p-6 text-center ${
                leap
                  ? "border border-green-500/30 bg-green-500/10"
                  : "border border-red-500/30 bg-red-500/10"
              }`}
            >
              {leap ? (
                <CheckCircle2 className="h-8 w-8 flex-shrink-0 text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 flex-shrink-0 text-red-400" />
              )}
              <p className="font-heading text-2xl font-bold sm:text-3xl">
                {year}{" "}
                <span className={leap ? "text-green-400" : "text-red-400"}>
                  {leap ? "IS" : "is NOT"}
                </span>{" "}
                a leap year
              </p>
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/*  RULES EXPLAINED (DECISION TREE)                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <Lightbulb className="h-6 w-6 text-primary" />
            How It Works
          </h2>
          <div className="rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8">
            <div className="flex flex-col items-center gap-2">
              {/* Step 1 */}
              <DecisionNode question="Is the year divisible by 4?" />
              <div className="flex w-full max-w-lg items-start justify-center gap-8">
                <Branch label="No">
                  <ResultBadge result={false} />
                </Branch>
                <Branch label="Yes">
                  <ArrowDown className="mx-auto h-5 w-5 text-muted" />
                </Branch>
              </div>

              {/* Step 2 */}
              <DecisionNode question="Divisible by 100?" />
              <div className="flex w-full max-w-lg items-start justify-center gap-8">
                <Branch label="No">
                  <ResultBadge result={true} />
                </Branch>
                <Branch label="Yes">
                  <ArrowDown className="mx-auto h-5 w-5 text-muted" />
                </Branch>
              </div>

              {/* Step 3 */}
              <DecisionNode question="Divisible by 400?" />
              <div className="flex w-full max-w-lg items-start justify-center gap-8">
                <Branch label="No">
                  <ResultBadge result={false} />
                </Branch>
                <Branch label="Yes">
                  <ResultBadge result={true} />
                </Branch>
              </div>
            </div>
          </div>
        </section>

        <AdBanner />

        {/* -------------------------------------------------------- */}
        {/*  UPCOMING LEAP YEARS                                      */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <ListOrdered className="h-6 w-6 text-secondary" />
            Next 20 Leap Years
          </h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-10">
            {upcomingLeapYears.map((y) => (
              <button
                key={y}
                onClick={() => setYearInput(String(y))}
                className={`rounded-lg border p-3 text-center font-heading text-lg font-bold transition-colors ${
                  y === year
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-card-border bg-card-bg hover:border-primary/50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/*  LEAP YEAR FACTS                                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            Leap Year Facts
          </h2>
          <div className="space-y-3">
            {FACTS.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-card-border bg-card-bg p-4"
              >
                {f.icon}
                <p className="text-[#E2E8F0]">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/*  BORN ON FEB 29?                                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-4">
          <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
            <PartyPopper className="h-6 w-6 text-secondary" />
            Born on February 29?
          </h2>
          <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-center sm:p-10">
            <Clock className="mx-auto mb-4 h-10 w-10 text-secondary" />
            <p className="mb-2 text-lg text-muted">
              Your next <span className="font-bold text-white">REAL</span>{" "}
              birthday is on
            </p>
            <p className="font-heading text-3xl font-bold text-white sm:text-4xl">
              February 29, {nextFeb29.date.getFullYear()}
            </p>
            <p className="mt-3 text-2xl font-bold text-secondary">
              {nextFeb29.days} days away
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function DecisionNode({ question }: { question: string }) {
  return (
    <div className="rounded-lg border border-primary/40 bg-primary/10 px-6 py-3 text-center font-semibold">
      {question}
    </div>
  );
}

function Branch({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-bold uppercase text-muted">
        <ArrowRight className="h-3 w-3" />
        {label}
      </span>
      {children}
    </div>
  );
}

function ResultBadge({ result }: { result: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
        result
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {result ? "Leap Year" : "Not a Leap Year"}
    </span>
  );
}

