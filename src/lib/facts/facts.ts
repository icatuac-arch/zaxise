import fs from "fs";
import path from "path";
import { type Fact } from "./schema";

const factsDirectory = path.join(process.cwd(), "content/facts");

// Module-level cache: category filename -> Fact[]
const categoryCache = new Map<string, Fact[]>();
let allFactsCache: Fact[] | null = null;

/**
 * Converts a category name to its JSON filename.
 * e.g. "Human Body" -> "human-body.json", "Climate & Weather" -> "climate-weather.json"
 */
export function categoryToFilename(category: string): string {
  return (
    category
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") + ".json"
  );
}

/**
 * Reads a single category batch file and caches it.
 */
function readCategoryFile(filename: string): Fact[] {
  if (categoryCache.has(filename)) {
    return categoryCache.get(filename)!;
  }

  const filePath = path.join(factsDirectory, filename);
  if (!fs.existsSync(filePath)) {
    categoryCache.set(filename, []);
    return [];
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContents);

  // Support both array format (new batch files) and single object (legacy)
  const facts: Fact[] = Array.isArray(data) ? data : [data];
  categoryCache.set(filename, facts);
  return facts;
}

/**
 * Returns all facts from all category batch files.
 */
export function getAllFacts(): Fact[] {
  if (allFactsCache) {
    return allFactsCache;
  }

  const fileNames = fs.readdirSync(factsDirectory);
  const facts: Fact[] = [];

  for (const name of fileNames) {
    if (!name.endsWith(".json")) continue;
    const loaded = readCategoryFile(name);
    facts.push(...loaded);
  }

  facts.sort((a, b) => a.id.localeCompare(b.id));
  allFactsCache = facts;
  return facts;
}

export interface PaginatedResult {
  facts: Fact[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Returns facts filtered by category with pagination.
 */
export function getFactsByCategory(
  category: string,
  page: number = 1,
  limit: number = 20
): PaginatedResult {
  const filename = categoryToFilename(category);
  let facts = readCategoryFile(filename);

  // Fallback: search all facts if dedicated file not found
  if (facts.length === 0) {
    facts = getAllFacts().filter((f) => f.category === category);
  }

  const total = facts.length;
  const start = (page - 1) * limit;
  const paginated = facts.slice(start, start + limit);

  return { facts: paginated, total, page, limit };
}

/**
 * Find a fact by its ID.
 */
export function getFactById(id: string): Fact | undefined {
  const facts = getAllFacts();
  return facts.find((f) => f.id === id);
}

/**
 * Returns a random fact.
 */
export function getRandomFact(): Fact {
  const facts = getAllFacts();
  const index = Math.floor(Math.random() * facts.length);
  return facts[index];
}

/**
 * Returns a deterministic fact for today's date.
 */
export function getTodaysFact(): Fact {
  const facts = getAllFacts();
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const index = Math.abs(hash) % facts.length;
  return facts[index];
}

/**
 * Search facts by query string with optional category filter and pagination.
 */
export function searchFacts(
  query: string,
  category?: string,
  page: number = 1,
  limit: number = 20
): PaginatedResult {
  let facts = getAllFacts();

  if (category) {
    facts = facts.filter((f) => f.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    facts = facts.filter(
      (f) =>
        f.text.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = facts.length;
  const start = (page - 1) * limit;
  const paginated = facts.slice(start, start + limit);

  return { facts: paginated, total, page, limit };
}

/**
 * Returns a map of category -> fact count.
 */
export function getCategoryCounts(): Record<string, number> {
  const facts = getAllFacts();
  const counts: Record<string, number> = {};
  for (const fact of facts) {
    counts[fact.category] = (counts[fact.category] || 0) + 1;
  }
  return counts;
}

/**
 * Returns a deterministic fact for a given date string.
 */
export function getFactForDate(dateStr: string): Fact {
  const facts = getAllFacts();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const index = Math.abs(hash) % facts.length;
  return facts[index];
}
