"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string; // ISO date string YYYY-MM-DD
  totalFactsRead: number;
  totalDays: number;
}

interface StreakContextValue {
  streak: StreakData;
  recordFactRead: () => void;
  recordCategoryExplored: (category: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "dyk-streak";
const EXPLORED_KEY = "dyk-explored";

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function defaultStreak(): StreakData {
  return {
    currentStreak: 1,
    longestStreak: 1,
    lastVisit: todayISO(),
    totalFactsRead: 0,
    totalDays: 1,
  };
}

function loadStreak(): StreakData {
  if (typeof window === "undefined") return defaultStreak();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStreak();
    return JSON.parse(raw) as StreakData;
  } catch {
    return defaultStreak();
  }
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Computes updated streak on visit. Returns new StreakData.
 */
function computeVisitStreak(existing: StreakData): StreakData {
  const today = todayISO();
  const yesterday = yesterdayISO();

  if (existing.lastVisit === today) {
    // Already visited today — no change to streak counts
    return existing;
  }

  let newCurrent: number;
  if (existing.lastVisit === yesterday) {
    // Consecutive day
    newCurrent = existing.currentStreak + 1;
  } else {
    // Streak broken
    newCurrent = 1;
  }

  const newLongest = Math.max(newCurrent, existing.longestStreak);
  return {
    ...existing,
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastVisit: today,
    totalDays: existing.totalDays + 1,
  };
}

/* ------------------------------------------------------------------ */
/*  Context + Provider                                                  */
/* ------------------------------------------------------------------ */

const StreakContext = createContext<StreakContextValue>({
  streak: defaultStreak(),
  recordFactRead: () => {},
  recordCategoryExplored: () => {},
});

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState<StreakData>(defaultStreak);

  // On mount: load from localStorage and record today's visit
  useEffect(() => {
    const loaded = loadStreak();
    const updated = computeVisitStreak(loaded);
    setStreak(updated);
    saveStreak(updated);
  }, []);

  const recordFactRead = useCallback(() => {
    setStreak((prev) => {
      const next = { ...prev, totalFactsRead: prev.totalFactsRead + 1 };
      saveStreak(next);
      return next;
    });
  }, []);

  const recordCategoryExplored = useCallback((category: string) => {
    try {
      const raw = localStorage.getItem(EXPLORED_KEY);
      const explored: Record<string, number> = raw ? JSON.parse(raw) : {};
      explored[category] = (explored[category] || 0) + 1;
      localStorage.setItem(EXPLORED_KEY, JSON.stringify(explored));
    } catch {
      // ignore
    }
  }, []);

  return (
    <StreakContext.Provider value={{ streak, recordFactRead, recordCategoryExplored }}>
      {children}
    </StreakContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useStreak() {
  return useContext(StreakContext);
}

/* ------------------------------------------------------------------ */
/*  StreakTracker UI Component                                          */
/* ------------------------------------------------------------------ */

export function StreakTracker() {
  const { streak } = useStreak();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const streakLabel =
    streak.currentStreak === 1 ? "day streak" : "day streak";

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      {/* Fire + current streak */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--muted)]/40 bg-[var(--surface)]"
        title={`${streak.currentStreak}-day streak`}
      >
        <span className="text-base leading-none">🔥</span>
        <span className="font-bold text-[var(--accent)]">
          {streak.currentStreak}
        </span>
        <span className="text-[var(--muted)] uppercase tracking-wide">
          {streakLabel}
        </span>
      </div>

      {/* Longest streak badge */}
      {streak.longestStreak > 1 && (
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[var(--muted)]/30 bg-[var(--surface)]"
          title={`Longest streak: ${streak.longestStreak} days`}
        >
          <span className="text-base leading-none">🏆</span>
          <span className="text-[var(--muted)] uppercase tracking-wide">
            Best&nbsp;
          </span>
          <span className="font-bold text-[var(--text)]">
            {streak.longestStreak}
          </span>
        </div>
      )}
    </div>
  );
}
