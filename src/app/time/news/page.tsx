"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Newspaper,
  Search,
  ExternalLink,
  Loader2,
  ChevronDown,
  Rss,
  Globe,
  Sparkles,
  TrendingUp,
  BookOpen,
  ArrowRight,
  RefreshCw,
  ImageOff,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface Article {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
}

interface APIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { label: "All News", value: "" },
  { label: "NASA", value: "NASA" },
  { label: "SpaceX", value: "SpaceX" },
  { label: "Blue Origin", value: "Blue Origin" },
  { label: "ESA", value: "ESA" },
  { label: "ISRO", value: "ISRO" },
  { label: "Rocket Lab", value: "Rocket Lab" },
  { label: "ISS", value: "ISS" },
  { label: "Mars", value: "Mars" },
  { label: "Artemis", value: "Artemis" },
  { label: "Starship", value: "Starship" },
] as const;

const NEWS_SOURCES = [
  { name: "SpaceNews.com", url: "https://spacenews.com" },
  { name: "NASASpaceflight.com", url: "https://www.nasaspaceflight.com" },
  { name: "Ars Technica", url: "https://arstechnica.com/space" },
  { name: "Space.com", url: "https://www.space.com" },
  { name: "The Verge", url: "https://www.theverge.com/space" },
  { name: "Reuters Space", url: "https://www.reuters.com/science/space" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  SOURCE BADGE COLOR MAP                                             */
/* ------------------------------------------------------------------ */

const BADGE_COLORS: Record<string, string> = {
  SpaceNews: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  NASASpaceflight: "bg-orange-600/20 text-orange-400 border-orange-500/30",
  "Ars Technica": "bg-amber-600/20 text-amber-400 border-amber-500/30",
  "Space.com": "bg-purple-600/20 text-purple-400 border-purple-500/30",
  "The Verge": "bg-pink-600/20 text-pink-400 border-pink-500/30",
  Reuters: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
};

function badgeClass(site: string): string {
  for (const [key, cls] of Object.entries(BADGE_COLORS)) {
    if (site.includes(key)) return cls;
  }
  return "bg-primary/20 text-indigo-400 border-primary/30";
}

/* ------------------------------------------------------------------ */
/*  SKELETON COMPONENTS                                                */
/* ------------------------------------------------------------------ */

function SkeletonFeatured() {
  return (
    <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="aspect-video md:aspect-auto bg-slate-800" />
        <div className="p-8 space-y-4">
          <div className="h-4 w-24 bg-slate-700 rounded" />
          <div className="h-8 w-full bg-slate-700 rounded" />
          <div className="h-8 w-3/4 bg-slate-700 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-700 rounded" />
            <div className="h-4 w-5/6 bg-slate-700 rounded" />
            <div className="h-4 w-2/3 bg-slate-700 rounded" />
          </div>
          <div className="h-4 w-32 bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-slate-700 rounded" />
        <div className="h-5 w-full bg-slate-700 rounded" />
        <div className="h-5 w-3/4 bg-slate-700 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-700 rounded" />
          <div className="h-3 w-4/5 bg-slate-700 rounded" />
        </div>
        <div className="h-3 w-24 bg-slate-700 rounded" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function SpaceNewsPage() {
  /* STATE */
  const [articles, setArticles] = useState<Article[]>([]);
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [tickerHeadline, setTickerHeadline] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  /* FETCH ARTICLES */
  const fetchArticles = useCallback(
    async (newOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError("");

      const search = searchTerm || category;
      const params = new URLSearchParams({
        type: "articles",
        offset: String(newOffset),
      });
      if (search) params.set("search", search);

      try {
        const res = await fetch(`/api/news?${params}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data: APIResponse = await res.json();
        if (append) {
          setArticles((prev) => [...prev, ...data.results]);
        } else {
          setArticles(data.results);
          if (data.results.length > 0 && newOffset === 0) {
            setTickerHeadline(data.results[0].title);
          }
        }
        setTotalCount(data.count);
        setOffset(newOffset + data.results.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load news");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm, category]
  );

  /* FETCH BLOGS */
  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch("/api/news?type=blogs", { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: APIResponse = await res.json();
      setBlogs(data.results);
    } catch {
      /* blogs are secondary, fail silently */
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  /* INITIAL LOAD + REFETCH ON VISIBILITY */
  useEffect(() => {
    fetchArticles(0, false);
    fetchBlogs();
  }, [fetchArticles, fetchBlogs]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchArticles(0, false);
        fetchBlogs();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fetchArticles, fetchBlogs]);

  /* SEARCH HANDLER */
  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      setOffset(0);
    }, 500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearchTerm(searchInput);
    setOffset(0);
  };

  /* CATEGORY CHANGE */
  const handleCategory = (value: string) => {
    setCategory(value);
    setSearchInput("");
    setSearchTerm("");
    setOffset(0);
  };

  /* DERIVED */
  const featured = articles[0] || null;
  const gridArticles = articles.slice(1);
  const hasMore = articles.length < totalCount;

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-card-border">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Newspaper className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-muted bg-clip-text text-transparent">
                Space News
              </h1>
            </div>
          </div>
          <p className="text-muted text-lg max-w-2xl mt-2">
            Real-time coverage from NASA, SpaceX, ESA, and the global space
            industry. Updated continuously.
          </p>
        </div>

        {/* LIVE TICKER */}
        {tickerHeadline && (
          <div className="border-t border-card-border bg-card-bg/60 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-hidden">
              <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Latest
              </span>
              <div className="overflow-hidden whitespace-nowrap">
                <p className="animate-marquee inline-block text-sm text-[#E2E8F0]">
                  {tickerHeadline}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* ── SEARCH ── */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search space news..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-card-border bg-card-bg text-[#E2E8F0] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* ── CATEGORY FILTERS ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                category === cat.value
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-card-bg text-muted border-card-border hover:border-muted-dark hover:text-[#E2E8F0]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchArticles(0, false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* ── FEATURED STORY ── */}
        {loading ? (
          <SkeletonFeatured />
        ) : (
          featured && (
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto md:min-h-[360px] bg-slate-800 overflow-hidden">
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageOff className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold backdrop-blur-sm">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border ${badgeClass(
                          featured.news_site
                        )}`}
                      >
                        {featured.news_site}
                      </span>
                      <span className="text-muted text-xs">
                        {timeAgo(featured.published_at)}
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted leading-relaxed mb-6 line-clamp-4">
                      {featured.summary}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-primary font-medium text-sm group-hover:gap-2.5 transition-all">
                      Read full story{" "}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          )
        )}

        {/* ── ARTICLE COUNT ── */}
        {!loading && totalCount > 0 && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>
              {totalCount.toLocaleString()} articles
              {category ? ` about "${category}"` : ""}
              {searchTerm ? ` matching "${searchTerm}"` : ""}
            </span>
          </div>
        )}

        <AdBanner />

        {/* ── NEWS GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : gridArticles.length === 0 && !error ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted/40 mx-auto mb-4" />
            <p className="text-muted text-lg">No articles found.</p>
            <p className="text-muted/60 text-sm mt-1">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-card-border bg-card-bg overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                {/* Image */}
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${badgeClass(
                        article.news_site
                      )}`}
                    >
                      {article.news_site}
                    </span>
                    <span className="text-muted text-xs ml-auto">
                      {timeAgo(article.published_at)}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-semibold text-white leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {article.summary}
                  </p>

                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── LOAD MORE ── */}
        {!loading && hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => fetchArticles(offset, true)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-card-bg border border-card-border text-[#E2E8F0] font-medium hover:border-primary/40 hover:text-white transition-all disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Load more articles
                </>
              )}
            </button>
          </div>
        )}

        {/* ── BLOG SECTION ── */}
        <section className="pt-8 border-t border-card-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-lg bg-secondary/10 border border-secondary/20">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Analysis &amp; Blogs
              </h2>
              <p className="text-muted text-sm">
                In-depth perspectives from space industry writers
              </p>
            </div>
          </div>

          {blogsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex gap-4 p-4 rounded-xl border border-card-border bg-card-bg"
                >
                  <div className="w-28 h-20 rounded-lg bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-slate-700 rounded" />
                    <div className="h-4 w-full bg-slate-700 rounded" />
                    <div className="h-4 w-2/3 bg-slate-700 rounded" />
                    <div className="h-3 w-20 bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-muted text-center py-8">
              No blog posts available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((blog) => (
                <a
                  key={blog.id}
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 p-4 rounded-xl border border-card-border bg-card-bg hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all"
                >
                  {blog.image_url ? (
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      loading="lazy"
                      className="w-28 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-28 h-20 rounded-lg bg-slate-800 shrink-0 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${badgeClass(
                          blog.news_site
                        )}`}
                      >
                        {blog.news_site}
                      </span>
                      <span className="text-muted text-xs">
                        {timeAgo(blog.published_at)}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-white leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted text-xs mt-1 line-clamp-1">
                      {blog.summary}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ── NEWS SOURCES ── */}
        <section className="pt-8 border-t border-card-border">
          <div className="flex items-center gap-3 mb-6">
            <Rss className="w-5 h-5 text-muted" />
            <h2 className="font-heading text-lg font-semibold text-white">
              News Sources
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {NEWS_SOURCES.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-card-border bg-card-bg hover:border-primary/30 hover:bg-card-bg/80 transition-all text-center"
              >
                <Globe className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0" />
                <span className="text-sm text-muted group-hover:text-[#E2E8F0] transition-colors">
                  {source.name}
                </span>
                <ExternalLink className="w-3 h-3 text-muted/40 group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>

          <p className="text-center text-muted/50 text-xs mt-10 pb-4">
            Data provided by the{" "}
            <a
              href="https://spaceflightnewsapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted"
            >
              Spaceflight News API
            </a>
          </p>
        </section>
      </div>

      {/* ── TICKER ANIMATION STYLE ── */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
