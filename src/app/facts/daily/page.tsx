"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CalendarDays, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: string;
  publishedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T00:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Space: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  Animals: "bg-green-500/15 text-green-700",
  "Human Body": "bg-rose-500/15 text-rose-700",
  History: "bg-amber-500/15 text-amber-700",
  Geography: "bg-teal-500/15 text-teal-700",
  Science: "bg-sky-500/15 text-sky-700",
  Technology: "bg-violet-500/15 text-violet-700",
  Food: "bg-orange-500/15 text-orange-700",
  Language: "bg-pink-500/15 text-pink-700",
  Ocean: "bg-cyan-500/15 text-cyan-700",
  Music: "bg-purple-500/15 text-purple-700",
  Sports: "bg-lime-500/15 text-lime-700",
  Art: "bg-fuchsia-500/15 text-fuchsia-700",
  Nature: "bg-emerald-500/15 text-emerald-700",
  Math: "bg-blue-500/15 text-blue-700",
  Psychology: "bg-red-500/15 text-red-700",
  Culture: "bg-yellow-500/15 text-yellow-700",
  Medicine: "bg-rose-500/15 text-rose-700",
  Economics: "bg-amber-500/15 text-amber-700",
  Architecture: "bg-stone-500/15 text-stone-700",
  Astronomy: "bg-indigo-500/15 text-indigo-700",
  Chemistry: "bg-lime-500/15 text-lime-700",
  "Climate & Weather": "bg-sky-500/15 text-sky-700",
  Engineering: "bg-zinc-500/15 text-zinc-700",
  Environment: "bg-green-500/15 text-green-700",
  Geology: "bg-amber-700/15 text-amber-800",
  Inventions: "bg-violet-500/15 text-violet-700",
  "Law & Government": "bg-slate-500/15 text-slate-700",
  Literature: "bg-orange-500/15 text-orange-700",
  Mythology: "bg-purple-500/15 text-purple-700",
  Philosophy: "bg-stone-500/15 text-stone-700",
  "Photography & Film": "bg-gray-500/15 text-gray-700",
  Religion: "bg-yellow-500/15 text-yellow-700",
  Transportation: "bg-blue-500/15 text-blue-700",
  "World Records": "bg-red-500/15 text-red-700",
  Archaeology: "bg-amber-500/15 text-amber-700",
  Biology: "bg-emerald-500/15 text-emerald-700",
  Energy: "bg-yellow-500/15 text-yellow-700",
  Communication: "bg-teal-500/15 text-teal-700",
  Agriculture: "bg-green-700/15 text-green-800",
};

const CARD_NUMBERS = ["①", "②", "③", "④", "⑤"];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function DailyDigestPage() {
  const today = todayISO();
  const [selectedDate, setSelectedDate] = useState(today);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchDigest = useCallback(async (date: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/daily?date=${date}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setFacts(data.facts ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDigest(selectedDate);
  }, [selectedDate, fetchDigest]);

  // Navigate dates (max 30 days back, not into the future)
  const canGoBack = selectedDate > offsetDate(today, -30);
  const canGoForward = selectedDate < today;

  function goBack() {
    if (canGoBack) setSelectedDate((d) => offsetDate(d, -1));
  }
  function goForward() {
    if (canGoForward) setSelectedDate((d) => offsetDate(d, +1));
  }

  // Date picker: restrict range
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val >= offsetDate(today, -30) && val <= today) {
      setSelectedDate(val);
    }
  }

  // Share button
  async function shareDigest() {
    if (!facts.length) return;

    const lines = [
      `📚 Did You Know? — Daily Digest for ${formatDisplayDate(selectedDate)}`,
      "",
      ...facts.map(
        (f, i) =>
          `${CARD_NUMBERS[i]} [${f.category}]\n${f.text}`
      ),
      "",
      "🔗 didyouknow.app/daily",
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: create a textarea
      const ta = document.createElement("textarea");
      ta.value = lines.join("\n");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const isToday = selectedDate === today;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <CalendarDays
            size={22}
            className="text-[var(--accent)] shrink-0"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Daily Digest
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-[var(--text)]">
          {isToday ? "Today's" : "Daily"} Five
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--muted)]">
          Five fascinating facts from five different categories — a new set every day.
        </p>
      </div>

      {/* ── Date Navigation ── */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="btn"
          aria-label="Previous day"
          title="Previous day"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="date"
            value={selectedDate}
            min={offsetDate(today, -30)}
            max={today}
            onChange={handleDateChange}
            className="w-full sm:w-auto px-3 py-2 bg-transparent border border-[var(--muted)]/40 font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
          />
        </div>

        <button
          onClick={goForward}
          disabled={!canGoForward}
          className="btn"
          aria-label="Next day"
          title="Next day"
        >
          <ChevronRight size={14} />
        </button>

        <button
          onClick={shareDigest}
          disabled={loading || !facts.length}
          className="btn btn-primary flex items-center gap-2 ml-auto"
          title="Copy digest to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Share2 size={14} />
              Share Today&apos;s Digest
            </>
          )}
        </button>
      </div>

      {/* ── Date label ── */}
      <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-6">
        {formatDisplayDate(selectedDate)}
        {isToday && (
          <span className="ml-2 px-1.5 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] align-middle">
            Today
          </span>
        )}
      </p>

      {/* ── Loading ── */}
      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border border-[var(--muted)]/25 bg-[var(--surface)] p-6 animate-pulse"
            >
              <div className="h-4 w-24 bg-[var(--muted)]/20 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-[var(--muted)]/15 rounded w-full" />
                <div className="h-3 bg-[var(--muted)]/15 rounded w-5/6" />
                <div className="h-3 bg-[var(--muted)]/15 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 text-center">
          <p className="font-mono text-sm text-[var(--accent)]">
            Failed to load today&apos;s digest. Please try again.
          </p>
          <button
            onClick={() => fetchDigest(selectedDate)}
            className="btn mt-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Facts ── */}
      {!loading && !error && facts.length > 0 && (
        <div className="space-y-5">
          {facts.map((fact, i) => {
            const colorClass =
              CATEGORY_COLORS[fact.category] ??
              "bg-[var(--surface)] text-[var(--muted)]";

            return (
              <article
                key={fact.id}
                className="group border border-[var(--muted)]/25 bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-colors duration-200"
              >
                <div className="p-6">
                  {/* Card header: number + category */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="font-display text-2xl font-bold text-[var(--muted)]/40 leading-none select-none shrink-0 mt-0.5">
                      {CARD_NUMBERS[i]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${colorClass}`}
                    >
                      {fact.category}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-[var(--muted)]/50 uppercase tracking-wide shrink-0">
                      {fact.difficulty}
                    </span>
                  </div>

                  {/* Fact text */}
                  <p className="font-display text-lg leading-relaxed text-[var(--text)]">
                    {fact.text}
                  </p>

                  {/* Tags */}
                  {fact.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {fact.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] text-[var(--muted)] border border-[var(--muted)]/25 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card footer: source */}
                <div className="px-6 py-3 border-t border-[var(--muted)]/15 flex items-center justify-between gap-4">
                  <a
                    href={fact.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors truncate"
                    title={fact.source.name}
                  >
                    Source: {fact.source.name}
                  </a>
                  <Link
                    href={`/facts/${fact.id}`}
                    className="font-mono text-xs text-[var(--muted)]/60 hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0"
                  >
                    View →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && facts.length === 0 && (
        <div className="text-center py-16 border border-[var(--muted)]/20">
          <p className="font-display text-xl text-[var(--muted)]">
            No facts found for this date.
          </p>
        </div>
      )}

      {/* ── Footer CTA ── */}
      {!loading && facts.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[var(--muted)]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--muted)] text-center sm:text-left">
            Come back tomorrow for five new facts from different categories.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/browse" className="btn">
              Browse All Facts
            </Link>
            <Link href="/stats" className="btn btn-primary">
              Your Stats →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
