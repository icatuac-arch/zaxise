"use client";

import { useEffect } from "react";
import { useStreak } from "@/components/StreakTracker";

/**
 * Invisible client component mounted on fact detail pages.
 * Records the fact view + category in streak and explored storage.
 */
export function FactViewTracker({ category }: { category: string }) {
  const { recordFactRead, recordCategoryExplored } = useStreak();

  useEffect(() => {
    recordFactRead();
    recordCategoryExplored(category);
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
