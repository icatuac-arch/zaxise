import fs from "fs";
import path from "path";
import { getAllFacts } from "./facts";
import type { Fact } from "./schema";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  factIds: string[];
  publishedAt: string;
}

export interface BlogArticleWithFacts extends BlogArticle {
  facts: Fact[];
}

/* ------------------------------------------------------------------ */
/*  Data loading                                                        */
/* ------------------------------------------------------------------ */

const articlesPath = path.join(process.cwd(), "content/blog/articles.json");

let articlesCache: BlogArticle[] | null = null;

function loadArticles(): BlogArticle[] {
  if (articlesCache) return articlesCache;
  const raw = fs.readFileSync(articlesPath, "utf-8");
  articlesCache = JSON.parse(raw) as BlogArticle[];
  return articlesCache;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Returns all 40 blog articles sorted by publishedAt descending.
 */
export function getAllArticles(): BlogArticle[] {
  return loadArticles()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/**
 * Returns a single article by slug, with its facts resolved.
 */
export function getArticleBySlug(
  slug: string
): BlogArticleWithFacts | undefined {
  const article = loadArticles().find((a) => a.slug === slug);
  if (!article) return undefined;

  const allFacts = getAllFacts();
  const factMap = new Map(allFacts.map((f) => [f.id, f]));

  const facts = article.factIds
    .map((id) => factMap.get(id))
    .filter((f): f is Fact => f !== undefined);

  return { ...article, facts };
}

/**
 * Returns up to 3 related articles: same category first, then by adjacent date.
 */
export function getRelatedArticles(
  slug: string,
  limit: number = 3
): BlogArticle[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return all.slice(0, limit);

  const sameCategory = all.filter(
    (a) => a.slug !== slug && a.category === current.category
  );

  const others = all.filter(
    (a) => a.slug !== slug && a.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}
