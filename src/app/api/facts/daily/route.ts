import { NextRequest, NextResponse } from "next/server";
import { getAllFacts } from "../../../../lib/facts";
import { CATEGORIES } from "../../../../lib/schema";

/**
 * Deterministic integer hash of a string (djb2 variant).
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash |= 0; // Keep it 32-bit signed
  }
  return Math.abs(hash);
}

/**
 * Picks 5 facts from 5 different categories for a given date string.
 * The selection is fully deterministic — same date always yields the same 5 facts.
 */
function getDailyFacts(dateStr: string) {
  const allFacts = getAllFacts();

  // Build a category → facts map
  const byCategory: Record<string, typeof allFacts> = {};
  for (const fact of allFacts) {
    if (!byCategory[fact.category]) byCategory[fact.category] = [];
    byCategory[fact.category].push(fact);
  }

  const availableCategories = CATEGORIES.filter(
    (c) => (byCategory[c]?.length ?? 0) > 0
  );

  // Pick 5 distinct categories using the date hash + a per-slot seed
  const selectedCategories: string[] = [];
  const categoryCopy = [...availableCategories];

  for (let slot = 0; slot < 5 && categoryCopy.length > 0; slot++) {
    const seed = hashString(`${dateStr}-cat-${slot}`);
    const idx = seed % categoryCopy.length;
    selectedCategories.push(categoryCopy[idx]);
    categoryCopy.splice(idx, 1);
  }

  // For each chosen category, pick one fact deterministically
  const facts = selectedCategories.map((category, slot) => {
    const pool = byCategory[category];
    const seed = hashString(`${dateStr}-fact-${slot}-${category}`);
    return pool[seed % pool.length];
  });

  return facts;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Accept a ?date=YYYY-MM-DD param; defaults to today (UTC)
  const dateParam = searchParams.get("date");

  let dateStr: string;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    dateStr = dateParam;
  } else {
    const now = new Date();
    dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  }

  const facts = getDailyFacts(dateStr);

  return NextResponse.json({ date: dateStr, facts });
}
