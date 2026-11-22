"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BadgeGrid, useBadges } from "@/components/facts/BadgeDisplay";
import { useStreak } from "@/components/facts/StreakTracker";
import { Map, Trophy, ChevronRight, Star } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Learning paths definition                                           */
/* ------------------------------------------------------------------ */

export const PATHS = [
  { id: "space-explorer",   title: "Space Explorer",      emoji: "🚀", category: "Space",      totalFacts: 30, description: "Journey through the cosmos" },
  { id: "history-buff",     title: "History Buff",        emoji: "📜", category: "History",    totalFacts: 30, description: "Walk through time" },
  { id: "animal-kingdom",   title: "Animal Kingdom",      emoji: "🦁", category: "Animals",    totalFacts: 30, description: "Discover the wild world" },
  { id: "science-lab",      title: "Science Lab",         emoji: "🔬", category: "Science",    totalFacts: 30, description: "Explore how the world works" },
  { id: "world-traveler",   title: "World Traveler",      emoji: "🌍", category: "Geography",  totalFacts: 30, description: "Explore every corner of Earth" },
  { id: "tech-pioneer",     title: "Tech Pioneer",        emoji: "💻", category: "Technology", totalFacts: 30, description: "From circuits to AI" },
  { id: "food-connoisseur", title: "Food Connoisseur",    emoji: "🍕", category: "Food",       totalFacts: 30, description: "Taste the world's knowledge" },
  { id: "ocean-diver",      title: "Ocean Diver",         emoji: "🌊", category: "Ocean",      totalFacts: 30, description: "Dive into the deep" },
  { id: "art-curator",      title: "Art Curator",         emoji: "🎨", category: "Art",        totalFacts: 30, description: "Master the world of art" },
  { id: "myth-hunter",      title: "Myth Hunter",         emoji: "🐉", category: "Mythology",  totalFacts: 30, description: "Legends from every culture" },
] as const;

const PATHS_STORAGE_KEY = "dyk-paths";

export interface PathProgress {
  factsCompleted: number;
  completed: boolean;
  startedAt: string;
}

export type AllPathProgress = Record<string, PathProgress>;

export function loadPathProgress(): AllPathProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PATHS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AllPathProgress;
  } catch {
    return {};
  }
}

export function savePathProgress(data: AllPathProgress) {
  localStorage.setItem(PATHS_STORAGE_KEY, JSON.stringify(data));
}

/* ------------------------------------------------------------------ */
/*  Path Card                                                           */
/* ------------------------------------------------------------------ */

function PathCard({ path, progress }: {
  path: typeof PATHS[number];
  progress: PathProgress | undefined;
}) {
  const completed = progress?.completed ?? false;
  const factsCompleted = progress?.factsCompleted ?? 0;
  const started = factsCompleted > 0;
  const pct = Math.min(100, Math.round((factsCompleted / path.totalFacts) * 100));

  return (
    <Link
      href={`/learn/${path.id}`}
      className={`group relative flex flex-col gap-3 p-5 border transition-all duration-200 hover:shadow-md ${
        completed
          ? "border-[var(--accent)] bg-[var(--surface)]"
          : started
          ? "border-[var(--muted)]/40 bg-[var(--surface)]/60"
          : "border-[var(--muted)]/25 bg-[var(--surface)]/30 hover:border-[var(--muted)]/60 hover:bg-[var(--surface)]"
      }`}
    >
      {/* Completion crown */}
      {completed && (
        <div className="absolute top-3 right-3 text-[var(--accent)] font-mono text-xs flex items-center gap-1">
          <Trophy size={12} />
          <span className="uppercase tracking-wider text-[10px]">Done</span>
        </div>
      )}

      {/* Emoji */}
      <div className="text-4xl leading-none">{path.emoji}</div>

      {/* Title & desc */}
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text)] leading-tight group-hover:text-[var(--accent)] transition-colors">
          {path.title}
        </h2>
        <p className="font-mono text-xs text-[var(--muted)] mt-0.5">{path.description}</p>
      </div>

      {/* Category tag */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--muted)]/30 text-[var(--muted)]">
          {path.category}
        </span>
        <span className="font-mono text-[10px] text-[var(--muted)]">
          {path.totalFacts} facts
        </span>
      </div>

      {/* Progress bar */}
      {started && (
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[var(--muted)]">
              {factsCompleted}/{path.totalFacts} learned
            </span>
            <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--muted)]/15 w-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider">
          {completed ? "Review" : started ? "Continue" : "Start"} →
        </span>
        <ChevronRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats summary                                                       */
/* ------------------------------------------------------------------ */

function LearningStats({ progress }: { progress: AllPathProgress }) {
  const completed = Object.values(progress).filter((p) => p.completed).length;
  const totalFacts = Object.values(progress).reduce((sum, p) => sum + p.factsCompleted, 0);
  const inProgress = Object.values(progress).filter((p) => !p.completed && p.factsCompleted > 0).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {[
        { label: "Paths Completed", value: completed, icon: "🏆" },
        { label: "Facts Learned", value: totalFacts, icon: "📚" },
        { label: "In Progress", value: inProgress, icon: "⏳" },
      ].map((s) => (
        <div key={s.label} className="border border-[var(--muted)]/25 bg-[var(--surface)] p-4 flex flex-col gap-1 text-center">
          <div className="text-2xl leading-none">{s.icon}</div>
          <div className="font-display text-3xl font-bold text-[var(--text)]">{s.value}</div>
          <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LearnPage() {
  const [progress, setProgress] = useState<AllPathProgress>({});
  const [mounted, setMounted] = useState(false);
  const { earned } = useBadges();
  const { streak } = useStreak();

  useEffect(() => {
    setMounted(true);
    setProgress(loadPathProgress());
  }, []);

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Map size={22} className="text-[var(--accent)] shrink-0" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Learning Paths
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)]">
          Your Learning Journey
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--muted)] max-w-xl">
          Guided paths through 10 topics — read facts one at a time, earn badges, and track your progress.
        </p>
      </div>

      {/* ── Stats ── */}
      <LearningStats progress={progress} />

      {/* ── Progress toward all-paths ── */}
      {completedCount > 0 && completedCount < 10 && (
        <div className="mb-8 p-4 border border-[var(--muted)]/25 bg-[var(--surface)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">
              👑 Grandmaster Progress
            </span>
            <span className="font-mono text-xs text-[var(--accent)] font-bold">
              {completedCount}/10 paths
            </span>
          </div>
          <div className="h-2 bg-[var(--muted)]/15">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-700"
              style={{ width: `${(completedCount / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Path grid ── */}
      <section className="mb-14">
        <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-5">
          Choose a Path
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              progress={progress[path.id]}
            />
          ))}
        </div>
      </section>

      {/* ── Badges ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Star size={16} className="text-[var(--accent)]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Badges — {earned.length} earned
          </h2>
          <Link href="/facts/stats" className="ml-auto font-mono text-xs text-[var(--accent)] hover:underline">
            View all stats →
          </Link>
        </div>
        <BadgeGrid />
      </section>
    </div>
  );
}
