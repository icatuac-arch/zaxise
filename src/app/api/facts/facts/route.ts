import { NextRequest, NextResponse } from "next/server";
import {
  getAllFacts,
  getFactsByCategory,
  getRandomFact,
  getTodaysFact,
  searchFacts,
  getCategoryCounts,
} from "../../../../lib/facts";
import { CATEGORIES } from "../../../../lib/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const query = searchParams.get("q");
  const random = searchParams.get("random");
  const today = searchParams.get("today");
  const counts = searchParams.get("counts");

  // Return category counts
  if (counts === "true") {
    return NextResponse.json({
      categories: CATEGORIES,
      counts: getCategoryCounts(),
    });
  }

  // Return today's fact
  if (today === "true") {
    return NextResponse.json({ fact: getTodaysFact() });
  }

  // Return a random fact
  if (random === "true") {
    return NextResponse.json({ fact: getRandomFact() });
  }

  // Search with optional category filter
  if (query) {
    const result = searchFacts(query, category || undefined, page, limit);
    return NextResponse.json({
      ...result,
      categories: [...CATEGORIES],
    });
  }

  // Filter by category
  if (category) {
    const result = getFactsByCategory(category, page, limit);
    return NextResponse.json({
      ...result,
      categories: [...CATEGORIES],
    });
  }

  // Default: return all facts with pagination
  const allFacts = getAllFacts();
  const total = allFacts.length;
  const start = (page - 1) * limit;
  const paginated = allFacts.slice(start, start + limit);

  return NextResponse.json({
    facts: paginated,
    total,
    page,
    limit,
    categories: [...CATEGORIES],
  });
}
