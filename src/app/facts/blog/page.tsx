"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogArticle } from "@/lib/facts/blog";

/* ------------------------------------------------------------------ */
/*  Static article data inlined at build time via server boundary      */
/*  We import from a client-safe JSON module                           */
/* ------------------------------------------------------------------ */
import articlesData from "@/../content/blog/articles.json";

const ALL_ARTICLES: BlogArticle[] = (articlesData as BlogArticle[]).sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

const ALL_CATEGORIES = [
  "All",
  ...Array.from(new Set(ALL_ARTICLES.map((a) => a.category))).sort(),
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Article card                                                        */
/* ------------------------------------------------------------------ */

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col gap-3 p-5 rounded-2xl border border-[var(--muted)]/20 bg-[var(--surface)]/40 hover:bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-all duration-200"
    >
      {/* Category badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] uppercase tracking-wider font-semibold">
          {article.category}
        </span>
        <time
          dateTime={article.publishedAt}
          className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider"
        >
          {formatDate(article.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h2 className="font-display text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
        {article.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
        {article.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--muted)]/10">
        <span className="font-mono text-[10px] text-[var(--muted)]">
          {article.factIds.length} facts inside
        </span>
        <span className="font-mono text-xs text-[var(--accent)] group-hover:translate-x-0.5 transition-transform duration-150">
          Read →
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    let result = ALL_ARTICLES;

    if (activeCategory !== "All") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Page header */}
      <header className="mb-10">
        <p className="font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-2">
          Did You Know? · Blog
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
          Explore Facts by Topic
        </h1>
        <p className="text-[var(--muted)] text-base max-w-2xl leading-relaxed">
          40 in-depth articles covering every category in our almanac — from
          Space and Animals to Philosophy and World Records. Each article curates
          the most fascinating facts we have on the subject.
        </p>
      </header>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8.5"
              cy="8.5"
              r="5.75"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <line
              x1="13"
              y1="13"
              x2="18"
              y2="18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/60 font-mono text-sm text-[var(--text)] placeholder:text-[var(--muted)]/60 outline-none focus:border-[var(--accent)]/50 transition-colors"
          />
        </div>

        {/* Article count */}
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] self-center flex-shrink-0">
          <span className="tabular-nums">{filtered.length}</span>
          <span>article{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Category filter pills */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter by category"
      >
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all duration-150 border ${
              activeCategory === cat
                ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
                : "bg-transparent text-[var(--muted)] border-[var(--muted)]/30 hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-[var(--muted)]">
            No articles match your search.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="mt-4 font-mono text-xs text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* RSS link */}
      <div className="mt-12 pt-8 border-t border-[var(--muted)]/10 flex items-center gap-3">
        <a
          href="/feed.xml"
          className="flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          aria-label="RSS Feed"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden="true">
            <circle cx="4" cy="16" r="2" />
            <path d="M2 10a8 8 0 0 1 8 8H8a6 6 0 0 0-6-6v-2z" />
            <path d="M2 4a14 14 0 0 1 14 14h-2A12 12 0 0 0 2 6V4z" />
          </svg>
          RSS Feed
        </a>
        <span className="text-[var(--muted)]/30" aria-hidden="true">·</span>
        <span className="font-mono text-xs text-[var(--muted)]">
          {ALL_ARTICLES.length} articles across {ALL_CATEGORIES.length - 1} categories
        </span>
      </div>
    </div>
  );
}
