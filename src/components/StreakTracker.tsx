'use client';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalFactsRead: number;
  lastReadDate: string | null;
}

export function useStreak() {
  return {
    streak: { currentStreak: 0, longestStreak: 0, totalFactsRead: 0, lastReadDate: null } as StreakData,
    recordFactRead: () => {},
    recordCategoryExplored: (_category: string) => {},
  };
}

export function StreakTracker() {
  return null;
}

export default StreakTracker;
