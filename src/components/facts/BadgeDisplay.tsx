"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Badge definitions                                                   */
/* ------------------------------------------------------------------ */

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  condition: string;
}

export const BADGES: Badge[] = [
  { id: "first-fact",     title: "First Step",      emoji: "👣", condition: "Read your first fact" },
  { id: "10-facts",       title: "Curious Mind",    emoji: "🧠", condition: "Read 10 facts" },
  { id: "100-facts",      title: "Knowledge Seeker",emoji: "📚", condition: "Read 100 facts" },
  { id: "500-facts",      title: "Fact Machine",    emoji: "⚡", condition: "Read 500 facts" },
  { id: "first-path",     title: "Pathfinder",      emoji: "🗺️", condition: "Complete a learning path" },
  { id: "3-paths",        title: "Scholar",         emoji: "🎓", condition: "Complete 3 paths" },
  { id: "all-paths",      title: "Grandmaster",     emoji: "👑", condition: "Complete all 10 paths" },
  { id: "streak-7",       title: "Week Warrior",    emoji: "🔥", condition: "7-day streak" },
  { id: "streak-30",      title: "Monthly Master",  emoji: "💎", condition: "30-day streak" },
  { id: "quiz-perfect",   title: "Perfect Score",   emoji: "💯", condition: "Score 100% on a quiz" },
  { id: "5-categories",   title: "Renaissance",     emoji: "🎭", condition: "Explore 5 categories" },
  { id: "all-categories", title: "Polymath",        emoji: "🌟", condition: "Explore all 40 categories" },
];

const BADGE_STORAGE_KEY = "dyk-badges";

/* ------------------------------------------------------------------ */
/*  Badge context                                                       */
/* ------------------------------------------------------------------ */

interface BadgeContextValue {
  earned: string[];
  awardBadge: (id: string) => void;
  hasBadge: (id: string) => boolean;
  checkAndAwardBadges: (opts: {
    totalFactsRead?: number;
    completedPaths?: number;
    streakDays?: number;
    quizPerfect?: boolean;
    categoriesExplored?: number;
  }) => void;
  toast: string | null;
}

const BadgeContext = createContext<BadgeContextValue>({
  earned: [],
  awardBadge: () => {},
  hasBadge: () => false,
  checkAndAwardBadges: () => {},
  toast: null,
});

function loadEarned(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BADGE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveEarned(ids: string[]) {
  localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(ids));
}

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [earned, setEarned] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEarned(loadEarned());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const awardBadge = useCallback((id: string) => {
    setEarned((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveEarned(next);
      const badge = BADGES.find((b) => b.id === id);
      if (badge) {
        showToast(`${badge.emoji} Badge unlocked: ${badge.title}!`);
      }
      return next;
    });
  }, [showToast]);

  const hasBadge = useCallback((id: string) => earned.includes(id), [earned]);

  const checkAndAwardBadges = useCallback((opts: {
    totalFactsRead?: number;
    completedPaths?: number;
    streakDays?: number;
    quizPerfect?: boolean;
    categoriesExplored?: number;
  }) => {
    const { totalFactsRead = 0, completedPaths = 0, streakDays = 0, quizPerfect = false, categoriesExplored = 0 } = opts;

    const candidates: Array<[string, boolean]> = [
      ["first-fact",     totalFactsRead >= 1],
      ["10-facts",       totalFactsRead >= 10],
      ["100-facts",      totalFactsRead >= 100],
      ["500-facts",      totalFactsRead >= 500],
      ["first-path",     completedPaths >= 1],
      ["3-paths",        completedPaths >= 3],
      ["all-paths",      completedPaths >= 10],
      ["streak-7",       streakDays >= 7],
      ["streak-30",      streakDays >= 30],
      ["quiz-perfect",   quizPerfect],
      ["5-categories",   categoriesExplored >= 5],
      ["all-categories", categoriesExplored >= 40],
    ];

    setEarned((prev) => {
      let next = [...prev];
      let changed = false;
      for (const [id, condition] of candidates) {
        if (condition && !next.includes(id)) {
          next = [...next, id];
          changed = true;
          const badge = BADGES.find((b) => b.id === id);
          if (badge) {
            // Queue toast — only show first new badge to avoid spam
            showToast(`${badge.emoji} Badge unlocked: ${badge.title}!`);
            break; // show one at a time; next visit will show more
          }
        }
      }
      if (changed) saveEarned(next);
      return next;
    });
  }, [showToast]);

  if (!mounted) {
    return (
      <BadgeContext.Provider value={{ earned: [], awardBadge, hasBadge, checkAndAwardBadges, toast: null }}>
        {children}
      </BadgeContext.Provider>
    );
  }

  return (
    <BadgeContext.Provider value={{ earned, awardBadge, hasBadge, checkAndAwardBadges, toast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 bg-[var(--text)] text-[var(--bg)] font-mono text-xs tracking-wide shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 whitespace-nowrap">
          <span>{toast}</span>
        </div>
      )}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgeContext);
}

/* ------------------------------------------------------------------ */
/*  BadgeGrid — display earned/locked badges                           */
/* ------------------------------------------------------------------ */

export function BadgeGrid({ compact = false }: { compact?: boolean }) {
  const { earned } = useBadges();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (compact) {
    // Only show earned badges compactly
    const earnedBadges = BADGES.filter((b) => earned.includes(b.id));
    if (earnedBadges.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.map((badge) => (
          <div
            key={badge.id}
            title={badge.condition}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--muted)]/30 bg-[var(--surface)] font-mono text-xs text-[var(--text)]"
          >
            <span>{badge.emoji}</span>
            <span>{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {BADGES.map((badge) => {
        const isEarned = earned.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`relative flex flex-col items-center text-center gap-2 p-4 border transition-all duration-200 ${
              isEarned
                ? "border-[var(--muted)]/40 bg-[var(--surface)]"
                : "border-[var(--muted)]/15 bg-[var(--surface)]/40 opacity-50"
            }`}
          >
            <div className={`text-3xl leading-none ${isEarned ? "" : "grayscale"}`}>
              {badge.emoji}
            </div>
            <div className="font-mono text-xs font-semibold text-[var(--text)] uppercase tracking-wider leading-tight">
              {badge.title}
            </div>
            <div className="font-mono text-[10px] text-[var(--muted)] leading-snug">
              {badge.condition}
            </div>
            {isEarned && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
