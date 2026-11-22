"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, Flame, Star, Globe2, Trophy, Award } from "lucide-react";
import { useStreak } from "@/components/facts/StreakTracker";
import { BadgeGrid, useBadges } from "@/components/facts/BadgeDisplay";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface CategoryCount {
  [category: string]: number;
}

interface GlobalStats {
  total: number;
  categories: string[];
  counts: CategoryCount;
}

interface PersonalStats {
  totalFactsRead: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  favorites: number;
  explored: CategoryCount;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function loadPersonalStats(streakData: {
  totalFactsRead: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}): PersonalStats {
  let favorites = 0;
  let explored: CategoryCount = {};

  try {
    const fav = localStorage.getItem("dyk-favorites");
    if (fav) {
      const arr = JSON.parse(fav);
      favorites = Array.isArray(arr) ? arr.length : 0;
    }
  } catch { /* ignore */ }

  try {
    const exp = localStorage.getItem("dyk-explored");
    if (exp) explored = JSON.parse(exp);
  } catch { /* ignore */ }

  return {
    totalFactsRead: streakData.totalFactsRead,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalDays: streakData.totalDays,
    favorites,
    explored,
  };
}

const CATEGORY_EMOJI: Record<string, string> = {
  Space: "🚀",
  Animals: "🐾",
  "Human Body": "🫀",
  History: "📜",
  Geography: "🌍",
  Science: "🔬",
  Technology: "💻",
  Food: "🍽️",
  Language: "💬",
  Ocean: "🌊",
  Music: "🎵",
  Sports: "⚽",
  Art: "🎨",
  Nature: "🌿",
  Math: "➕",
  Psychology: "🧠",
  Culture: "🎭",
  Medicine: "💊",
  Economics: "📈",
  Architecture: "🏛️",
  Astronomy: "🔭",
  Chemistry: "⚗️",
  "Climate & Weather": "🌦️",
  Engineering: "⚙️",
  Environment: "🌱",
  Geology: "🪨",
  Inventions: "💡",
  "Law & Government": "⚖️",
  Literature: "📖",
  Mythology: "🏺",
  Philosophy: "🤔",
  "Photography & Film": "🎬",
  Religion: "🕌",
  Transportation: "🚆",
  "World Records": "🏆",
  Archaeology: "🏺",
  Biology: "🧬",
  Energy: "⚡",
  Communication: "📡",
  Agriculture: "🌾",
};

/* ------------------------------------------------------------------ */
/*  Stat Card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="border border-[var(--muted)]/25 bg-[var(--surface)] p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <div className="font-display text-4xl font-bold text-[var(--text)]">
        {value}
      </div>
      {sub && (
        <div className="font-mono text-xs text-[var(--muted)]">{sub}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bar Chart Row                                                       */
/* ------------------------------------------------------------------ */

function BarRow({
  label,
  count,
  max,
  emoji,
  highlight,
}: {
  label: string;
  count: number;
  max: number;
  emoji?: string;
  highlight?: boolean;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div className="group flex items-center gap-3 py-1.5">
      {/* Label */}
      <div
        className={`font-mono text-xs shrink-0 w-36 truncate ${
          highlight
            ? "text-[var(--accent)] font-semibold"
            : "text-[var(--muted)]"
        }`}
        title={label}
      >
        {emoji && <span className="mr-1">{emoji}</span>}
        {label}
      </div>

      {/* Bar */}
      <div className="flex-1 h-3 bg-[var(--muted)]/10 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            highlight ? "bg-[var(--accent)]" : "bg-[var(--muted)]/40"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Count */}
      <div
        className={`font-mono text-xs shrink-0 w-12 text-right ${
          highlight ? "text-[var(--accent)] font-bold" : "text-[var(--muted)]"
        }`}
      >
        {count.toLocaleString()}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function StatsPage() {
  const { streak } = useStreak();
  const { earned } = useBadges();
  const [mounted, setMounted] = useState(false);
  const [personal, setPersonal] = useState<PersonalStats | null>(null);
  const [global, setGlobal] = useState<GlobalStats | null>(null);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  // Load personal stats after mount (localStorage)
  useEffect(() => {
    setMounted(true);
    setPersonal(loadPersonalStats(streak));
  }, [streak]);

  // Fetch global stats
  useEffect(() => {
    fetch("/api/facts?counts=true")
      .then((r) => r.json())
      .then((data) => {
        const counts: CategoryCount = data.counts ?? {};
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        setGlobal({
          total,
          categories: data.categories ?? [],
          counts,
        });
      })
      .catch(() => {})
      .finally(() => setLoadingGlobal(false));
  }, []);

  if (!mounted) return null;

  const categoriesExplored = personal
    ? Object.keys(personal.explored).length
    : 0;

  // Top explored categories by user
  const topExplored = personal
    ? Object.entries(personal.explored)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    : [];

  const maxExplored = topExplored[0]?.[1] ?? 1;

  // Global bar chart: sort categories by count descending
  const globalSorted = global
    ? Object.entries(global.counts).sort((a, b) => b[1] - a[1])
    : [];
  const maxGlobal = globalSorted[0]?.[1] ?? 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 size={22} className="text-[var(--accent)] shrink-0" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Stats Dashboard
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Your Almanac
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--muted)]">
          Personal reading stats, streaks, and a breakdown of the full fact library.
        </p>
      </div>

      {/* ── Personal Stat Cards ── */}
      <section className="mb-12">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Your Reading Stats
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen size={12} />}
            label="Facts Read"
            value={personal?.totalFactsRead ?? 0}
            sub="across all sessions"
          />
          <StatCard
            icon={<Flame size={12} />}
            label="Current Streak"
            value={`${personal?.currentStreak ?? 0}🔥`}
            sub={`Best: ${personal?.longestStreak ?? 0} days`}
          />
          <StatCard
            icon={<Globe2 size={12} />}
            label="Categories"
            value={categoriesExplored}
            sub={`of ${global?.categories.length ?? 40} explored`}
          />
          <StatCard
            icon={<Star size={12} />}
            label="Favorites"
            value={personal?.favorites ?? 0}
            sub="saved facts"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Trophy size={12} />}
            label="Days Visited"
            value={personal?.totalDays ?? 1}
            sub="total days on site"
          />
          <StatCard
            icon={<BarChart3 size={12} />}
            label="Longest Streak"
            value={`${personal?.longestStreak ?? 0} days`}
            sub="personal best"
          />
        </div>
      </section>

      {/* ── Your Journey ── */}
      {topExplored.length > 0 ? (
        <section className="mb-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            Your Journey
          </h2>
          <p className="font-mono text-xs text-[var(--muted)]/60 mb-5">
            Categories you&apos;ve explored most — tracked as you read facts.
          </p>

          <div className="border border-[var(--muted)]/20 bg-[var(--surface)] px-5 py-4">
            {topExplored.map(([cat, count]) => (
              <BarRow
                key={cat}
                label={cat}
                count={count}
                max={maxExplored}
                emoji={CATEGORY_EMOJI[cat]}
                highlight
              />
            ))}
          </div>

          <p className="mt-3 font-mono text-xs text-[var(--muted)]/50">
            Tip: browse{" "}
            <Link href="/facts/browse" className="underline hover:text-[var(--accent)]">
              all categories
            </Link>{" "}
            to expand your journey.
          </p>
        </section>
      ) : (
        <section className="mb-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            Your Journey
          </h2>
          <div className="border border-[var(--muted)]/20 bg-[var(--surface)] p-8 text-center">
            <p className="font-display text-lg text-[var(--muted)]">
              Your reading journey starts here.
            </p>
            <p className="font-mono text-xs text-[var(--muted)]/60 mt-2 mb-5">
              Start exploring facts and your category breakdown will appear here.
            </p>
            <Link href="/facts/browse" className="btn btn-primary">
              Start Exploring →
            </Link>
          </div>
        </section>
      )}

      {/* ── Global Stats ── */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
          Global Library
        </h2>
        <p className="font-mono text-xs text-[var(--muted)]/60 mb-5">
          {loadingGlobal
            ? "Loading library stats…"
            : `${global?.total.toLocaleString() ?? 0} total facts across ${global?.categories.length ?? 0} categories.`}
        </p>

        {/* Summary cards */}
        {!loadingGlobal && global && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              icon={<BookOpen size={12} />}
              label="Total Facts"
              value={global.total.toLocaleString()}
              sub="in the library"
            />
            <StatCard
              icon={<Globe2 size={12} />}
              label="Categories"
              value={global.categories.length}
              sub="knowledge domains"
            />
          </div>
        )}

        {/* Bar chart */}
        <div className="border border-[var(--muted)]/20 bg-[var(--surface)] px-5 py-4">
          {loadingGlobal ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-28 bg-[var(--muted)]/20 rounded" />
                  <div
                    className="h-3 bg-[var(--muted)]/15 rounded flex-1"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                  <div className="h-3 w-10 bg-[var(--muted)]/20 rounded" />
                </div>
              ))}
            </div>
          ) : (
            globalSorted.map(([cat, count]) => (
              <BarRow
                key={cat}
                label={cat}
                count={count}
                max={maxGlobal}
                emoji={CATEGORY_EMOJI[cat]}
                highlight={
                  personal ? Boolean(personal.explored[cat]) : false
                }
              />
            ))
          )}
        </div>

        <p className="mt-3 font-mono text-xs text-[var(--muted)]/50">
          Highlighted categories are ones you&apos;ve already explored.
        </p>
      </section>

      {/* ── Badges ── */}
      <section className="mt-12 pt-8 border-t border-[var(--muted)]/20">
        <div className="flex items-center gap-3 mb-4">
          <Award size={16} className="text-[var(--accent)]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Badges — {earned.length} earned
          </h2>
          <Link href="/facts/learn" className="ml-auto font-mono text-xs text-[var(--accent)] hover:underline">
            Learning Paths →
          </Link>
        </div>
        <BadgeGrid />
      </section>

      {/* ── CTA ── */}
      <div className="mt-12 pt-8 border-t border-[var(--muted)]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-[var(--muted)] text-center sm:text-left">
          Keep reading to grow your stats. New facts are added regularly.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/facts/daily" className="btn">
            Daily Digest
          </Link>
          <Link href="/facts/quiz" className="btn btn-primary">
            Take a Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
