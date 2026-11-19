import { NextRequest, NextResponse } from "next/server";
import { getAllFacts } from "../../../../lib/facts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));

  const facts = getAllFacts();

  // Return facts for a specific tag, paginated
  if (tag) {
    const tagLower = tag.toLowerCase();
    const matching = facts.filter((f) =>
      f.tags.some((t) => t.toLowerCase() === tagLower)
    );

    // Build related tags: tags that co-occur with this tag, sorted by frequency
    const coOccurrence: Record<string, number> = {};
    for (const fact of matching) {
      for (const t of fact.tags) {
        if (t.toLowerCase() !== tagLower) {
          coOccurrence[t] = (coOccurrence[t] || 0) + 1;
        }
      }
    }
    const relatedTags = Object.entries(coOccurrence)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));

    const total = matching.length;
    const start = (page - 1) * limit;
    const paginated = matching.slice(start, start + limit);

    return NextResponse.json({
      tag,
      facts: paginated,
      total,
      page,
      limit,
      relatedTags,
    });
  }

  // Return all unique tags with counts, sorted by count descending
  const tagCounts: Record<string, number> = {};
  for (const fact of facts) {
    for (const t of fact.tags) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
  }

  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({ tags, total: tags.length });
}
