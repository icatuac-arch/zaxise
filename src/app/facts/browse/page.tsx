"use client";

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, Shuffle, Brain, Heart, Share2, ChevronRight } from "lucide-react";
import { CategoryVisuals, getImmersiveCardStyle } from "@/components/facts/CategoryVisuals";
import { getCategoryMeta, CATEGORIES as CATEGORY_DATA } from "@/data/facts/categories";

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: string;
}

const CATEGORY_NAMES = [
  "Agriculture", "Animals", "Archaeology", "Architecture", "Art",
  "Astronomy", "Biology", "Chemistry", "Climate & Weather", "Communication",
  "Culture", "Economics", "Energy", "Engineering", "Environment", "Food",
  "Geography", "Geology", "History", "Human Body", "Inventions",
  "Language", "Law & Government", "Literature", "Math", "Medicine",
  "Music", "Mythology", "Nature", "Ocean", "Philosophy",
  "Photography & Film", "Psychology", "Religion", "Science", "Space",
  "Sports", "Technology", "Transportation", "World Records",
];

const DIFFICULTIES = ["All", "easy", "medium", "hard"];
const LIMIT = 12;

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-12 text-center font-mono text-[var(--muted)]">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const [facts, setFacts] = useState<Fact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(urlCategory && CATEGORY_NAMES.includes(urlCategory) ? urlCategory : "All");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [teaserFacts, setTeaserFacts] = useState<Record<string, string>>({});
  const [featuredCategory, setFeaturedCategory] = useState("");
  const [factsRead, setFactsRead] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sortMode, setSortMode] = useState<"random" | "newest">("random");
  const [editorsPick, setEditorsPick] = useState<number>(0);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(true);

  // Sync category from URL params
  useEffect(() => {
    if (urlCategory && CATEGORY_NAMES.includes(urlCategory) && urlCategory !== category) {
      setCategory(urlCategory);
      setFacts([]);
      setPage(1);
      hasMoreRef.current = true;
    }
  }, [urlCategory]);

  const isImmersive = category !== "All";
  const meta = useMemo(() => isImmersive ? getCategoryMeta(category) : null, [category, isImmersive]);
  const imm = meta?.immersive ?? null;

  // Fetch category counts on mount
  useEffect(() => {
    fetch("/api/facts?counts=true")
      .then((r) => r.json())
      .then((data) => {
        if (data.counts) setCategoryCounts(data.counts);
      })
      .catch(() => {});
  }, []);

  // Set featured category and editor's pick randomly on mount
  useEffect(() => {
    const idx = Math.floor(Math.random() * CATEGORY_NAMES.length);
    setFeaturedCategory(CATEGORY_NAMES[idx]);
    setEditorsPick(Math.floor(Math.random() * LIMIT));
  }, []);

  // Load teaser facts for the "All" grid
  useEffect(() => {
    if (category !== "All") return;
    const loadTeasers = async () => {
      const teasers: Record<string, string> = {};
      // Load a handful at a time to avoid hammering
      const promises = CATEGORY_NAMES.map(async (cat) => {
        try {
          const res = await fetch(`/api/facts?category=${encodeURIComponent(cat)}&limit=1&page=${Math.floor(Math.random() * 20) + 1}`);
          const data = await res.json();
          if (data.facts?.[0]) teasers[cat] = data.facts[0].text;
        } catch { /* skip */ }
      });
      await Promise.all(promises);
      setTeaserFacts(teasers);
    };
    loadTeasers();
  }, [category]);

  // Fetch facts for selected category
  const fetchFacts = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    const params = new URLSearchParams({ page: String(pageNum), limit: String(LIMIT) });
    if (category !== "All") params.set("category", category);
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/facts?${params}`);
      const data = await res.json();
      let results = data.facts || [];
      if (difficulty !== "All") {
        results = results.filter((f: Fact) => f.difficulty === difficulty);
      }
      if (sortMode === "random") {
        results = [...results].sort(() => Math.random() - 0.5);
      }
      if (append) {
        setFacts((prev) => [...prev, ...results]);
      } else {
        setFacts(results);
      }
      setTotal(data.total || 0);
      hasMoreRef.current = results.length === LIMIT && (data.total || 0) > pageNum * LIMIT;
    } catch {
      if (!append) setFacts([]);
    }
    setLoading(false);
    setLoadingMore(false);
  }, [category, search, difficulty, sortMode]);

  useEffect(() => {
    if (category !== "All") {
      setPage(1);
      fetchFacts(1);
    }
  }, [category, search, difficulty, sortMode, fetchFacts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Infinite scroll observer
  useEffect(() => {
    if (!isImmersive) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFacts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isImmersive, page, loadingMore, loading, fetchFacts]);

  // Confetti on 10 facts read
  useEffect(() => {
    if (factsRead === 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [factsRead]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setFacts([]);
    setFactsRead(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAll = () => {
    setCategory("All");
    setFacts([]);
    setDifficulty("All");
    setSortMode("random");
    setSearch("");
    setSearchInput("");
  };

  const handleRandomFact = async () => {
    try {
      const res = await fetch("/api/facts?random=true");
      const data = await res.json();
      if (data.fact && data.fact.category === category) {
        setFacts([data.fact, ...facts]);
      } else {
        // Fetch from current category
        const p = Math.floor(Math.random() * Math.ceil(total / LIMIT)) + 1;
        fetchFacts(p);
      }
    } catch { /* ignore */ }
  };

  const handleShare = async (fact: Fact) => {
    const text = `Did you know? ${fact.text}`;
    if (navigator.share) {
      await navigator.share({ title: "Did You Know?", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const containerStyle: React.CSSProperties = isImmersive && imm ? {
    '--cat-bg': imm.bg,
    '--cat-text': imm.text,
    '--cat-accent': imm.accent,
    '--cat-surface': imm.surface,
    '--cat-muted': imm.muted,
  } as React.CSSProperties : {};

  // Difficulty breakdown
  const difficultyBreakdown = useMemo(() => {
    if (!isImmersive) return null;
    const easy = facts.filter((f) => f.difficulty === "easy").length;
    const medium = facts.filter((f) => f.difficulty === "medium").length;
    const hard = facts.filter((f) => f.difficulty === "hard").length;
    return { easy, medium, hard };
  }, [facts, isImmersive]);

  /* ============================= */
  /* RENDER: "All" Category Grid   */
  /* ============================= */
  if (!isImmersive) {
    const featuredMeta = featuredCategory ? getCategoryMeta(featuredCategory) : null;
    const featuredImm = featuredMeta?.immersive;

    return (
      <div className="min-h-screen" style={{ background: "var(--bg, #0a0a0f)" }}>
        {/* Confetti */}
        {showConfetti && <ConfettiBurst />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: "var(--text, #fff)" }}>
              <span className="inline-block animate-bounce-slow mr-2" style={{ fontSize: "1.2em" }}>&#127775;</span>
              Pick a World to Explore!
            </h1>
            <p className="text-lg opacity-70" style={{ color: "var(--muted, #aaa)" }}>
              Tap a category to dive into incredible facts
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" style={{ color: "var(--muted, #aaa)" }} />
            <input
              type="text"
              placeholder="&#128269; Search 40,000+ facts..."
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); if (e.target.value) setCategory("All"); }}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              style={{
                background: "var(--surface, #1a1a2e)",
                border: "2px solid rgba(124,58,237,0.3)",
                color: "var(--text, #fff)",
              }}
            />
          </div>

          {/* Featured spotlight */}
          {featuredMeta && featuredImm && !searchInput && (
            <button
              onClick={() => handleCategorySelect(featuredCategory)}
              className="w-full mb-10 p-8 rounded-3xl text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl relative overflow-hidden group"
              style={{
                background: featuredImm.gradientBg,
                border: `2px solid ${featuredImm.accent}40`,
              }}
            >
              <div className="absolute inset-0 opacity-10">
                {featuredImm.floatingExtras?.map((e, i) => (
                  <span
                    key={i}
                    className="absolute text-4xl"
                    style={{
                      top: `${15 + (i * 20) % 70}%`,
                      left: `${10 + (i * 25) % 80}%`,
                      opacity: 0.3,
                      transform: `rotate(${i * 15}deg)`,
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-7xl sm:text-8xl group-hover:animate-bounce">{featuredMeta.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: `${featuredImm.accent}30`, color: featuredImm.accent }}>
                      &#11088; Featured World
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1" style={{ color: featuredImm.text }}>
                    {featuredCategory}
                  </h2>
                  <p className="text-base opacity-80 mb-2" style={{ color: featuredImm.muted }}>
                    {featuredMeta.tagline}
                  </p>
                  {teaserFacts[featuredCategory] && (
                    <p className="text-sm italic opacity-70 line-clamp-2" style={{ color: featuredImm.text }}>
                      &quot;{teaserFacts[featuredCategory]}&quot;
                    </p>
                  )}
                </div>
                <ChevronRight className="w-8 h-8 opacity-50 hidden sm:block" style={{ color: featuredImm.accent }} />
              </div>
            </button>
          )}

          {/* Category grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {CATEGORY_NAMES.map((cat, idx) => {
              const catMeta = getCategoryMeta(cat);
              const catImm = catMeta.immersive;
              const count = categoryCounts[cat] || 0;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="group relative flex flex-col items-center justify-center text-center p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden min-h-[220px] sm:min-h-[280px]"
                  style={{
                    background: catImm.gradientBg,
                    border: `1.5px solid ${catImm.accent}30`,
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ boxShadow: `inset 0 0 40px ${catImm.accent}20, 0 0 30px ${catImm.accent}15` }}
                  />

                  {/* Background emoji pattern */}
                  <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
                    {catImm.floatingExtras?.slice(0, 3).map((e, i) => (
                      <span key={i} className="absolute text-3xl" style={{ top: `${20 + i * 30}%`, left: `${10 + i * 30}%`, transform: `rotate(${i * 20}deg)` }}>
                        {e}
                      </span>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="text-5xl sm:text-6xl lg:text-7xl mb-2 group-hover:animate-bounce transition-transform duration-300">
                      {catMeta.emoji}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight" style={{ color: catImm.text }}>
                      {cat}
                    </h3>
                    <p className="text-xs opacity-70 line-clamp-2 px-1" style={{ color: catImm.muted }}>
                      {catMeta.tagline}
                    </p>
                    {count > 0 && (
                      <span className="mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: `${catImm.accent}25`, color: catImm.accent }}>
                        {count.toLocaleString()} facts inside!
                      </span>
                    )}
                    {teaserFacts[cat] && (
                      <p className="mt-2 text-[11px] italic opacity-60 line-clamp-2 leading-relaxed" style={{ color: catImm.text }}>
                        &quot;{teaserFacts[cat].slice(0, 80)}...&quot;
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  /* ======================================= */
  /* RENDER: Immersive Category View         */
  /* ======================================= */
  const cardStyle = imm ? getImmersiveCardStyle(imm) : {};

  return (
    <div
      className="relative min-h-screen transition-colors duration-500 immersive-category-active"
      style={containerStyle}
    >
      {/* Immersive background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryVisuals category={category} />
      </div>

      {/* Confetti */}
      {showConfetti && <ConfettiBurst />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Category Hero Banner */}
        <div
          className="rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden"
          style={{
            background: imm ? `linear-gradient(135deg, ${imm.surface}, ${imm.accent}15)` : undefined,
            border: imm ? `1.5px solid ${imm.accent}30` : undefined,
            minHeight: "200px",
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
            {meta?.immersive.floatingExtras?.map((e, i) => (
              <span
                key={i}
                className="absolute text-5xl sm:text-6xl"
                style={{
                  top: `${10 + (i * 18) % 60}%`,
                  right: `${5 + (i * 15) % 40}%`,
                  transform: `rotate(${i * 25 - 30}deg)`,
                  opacity: 0.4,
                }}
              >
                {e}
              </span>
            ))}
          </div>

          <div className="relative z-10">
            {/* Back button */}
            <button
              onClick={handleBackToAll}
              className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: imm ? `${imm.accent}20` : undefined,
                color: imm?.accent,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <span className="text-6xl sm:text-7xl lg:text-8xl">{meta?.emoji}</span>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1" style={{ color: imm?.text }}>
                  {category}
                </h1>
                <p className="text-base sm:text-lg opacity-80 mb-3" style={{ color: imm?.muted }}>
                  {meta?.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: `${imm?.accent}20`, color: imm?.accent }}>
                    {total.toLocaleString()} facts
                  </span>
                  {difficultyBreakdown && (
                    <>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                        &#128994; {difficultyBreakdown.easy} Easy
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                        &#128993; {difficultyBreakdown.medium} Medium
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                        &#128308; {difficultyBreakdown.hard} Hard
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleRandomFact}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: imm?.accent, color: "#fff" }}
              >
                <Shuffle className="w-4 h-4" />
                &#127922; Random Fact
              </button>
              <Link
                href={`/quiz?category=${encodeURIComponent(category)}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: `${imm?.accent}25`, color: imm?.accent, border: `1.5px solid ${imm?.accent}40` }}
              >
                <Brain className="w-4 h-4" />
                &#129504; Quiz Me
              </Link>
            </div>
          </div>
        </div>

        {/* Quick filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Difficulty pills */}
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); setPage(1); setFacts([]); }}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 min-h-[44px]"
                style={
                  difficulty === d
                    ? { background: imm?.accent, color: "#fff" }
                    : { background: `${imm?.accent}15`, color: imm?.muted, border: `1px solid ${imm?.accent}25` }
                }
              >
                {d === "All" ? "All Levels" : d === "easy" ? "&#128994; Easy" : d === "medium" ? "&#128993; Medium" : "&#128308; Hard"}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1.5 ml-auto">
            <button
              onClick={() => setSortMode("random")}
              className="px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[44px]"
              style={sortMode === "random" ? { background: `${imm?.accent}30`, color: imm?.accent } : { color: imm?.muted }}
            >
              &#127922; Random
            </button>
            <button
              onClick={() => setSortMode("newest")}
              className="px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[44px]"
              style={sortMode === "newest" ? { background: `${imm?.accent}30`, color: imm?.accent } : { color: imm?.muted }}
            >
              &#10024; Newest
            </button>
          </div>
        </div>

        {/* Search within category */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: imm?.muted }} />
          <input
            type="text"
            placeholder={`Search ${category} facts...`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              background: imm?.surface,
              border: `1.5px solid ${imm?.accent}25`,
              color: imm?.text,
              outlineColor: imm?.accent,
            }}
          />
        </div>

        {/* Fact Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 animate-pulse"
                style={{ ...cardStyle, opacity: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full" style={{ background: `${imm?.accent}20` }} />
                  <div className="h-4 w-20 rounded" style={{ background: `${imm?.accent}15` }} />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full rounded" style={{ background: `${imm?.accent}12` }} />
                  <div className="h-4 w-4/5 rounded" style={{ background: `${imm?.accent}10` }} />
                  <div className="h-4 w-2/3 rounded" style={{ background: `${imm?.accent}08` }} />
                </div>
                <div className="text-center mt-4 text-xs font-medium animate-pulse" style={{ color: imm?.muted }}>
                  Loading amazing facts...
                </div>
              </div>
            ))}
          </div>
        ) : facts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">{meta?.emoji}</span>
            <p className="text-lg font-medium" style={{ color: imm?.muted }}>
              No facts found matching your criteria.
            </p>
            <button
              onClick={() => { setDifficulty("All"); setSearch(""); setSearchInput(""); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: `${imm?.accent}20`, color: imm?.accent }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {facts.map((fact, idx) => {
              const isMindBlower = idx > 0 && idx % 5 === 0;
              const isEditorPick = idx === editorsPick;

              return (
                <div
                  key={`${fact.id}-${idx}`}
                  className="relative rounded-2xl p-6 sm:p-8 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                  style={{
                    ...cardStyle,
                    animationDelay: `${(idx % LIMIT) * 80}ms`,
                    animation: `fadeSlideUp 0.5s ease-out ${(idx % LIMIT) * 80}ms both`,
                  }}
                  onMouseEnter={() => setFactsRead((p) => p + 1)}
                >
                  {/* Special badges */}
                  {isMindBlower && (
                    <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20" style={{ background: "#FF6B6B", color: "#fff" }}>
                      &#129327; MIND-BLOWER
                    </span>
                  )}
                  {isEditorPick && !isMindBlower && (
                    <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20" style={{ background: "#FFD700", color: "#1a1a1a" }}>
                      &#11088; Editor&apos;s Pick
                    </span>
                  )}

                  {/* Header: emoji + difficulty */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta?.emoji}</span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      fact.difficulty === "hard" ? "bg-red-500/20 text-red-400" :
                      fact.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {fact.difficulty === "hard" ? "&#128308;" : fact.difficulty === "medium" ? "&#128993;" : "&#128994;"} {fact.difficulty.charAt(0).toUpperCase() + fact.difficulty.slice(1)}
                    </span>
                  </div>

                  {/* Fact text */}
                  <Link href={`/facts/${fact.id}`} className="flex-1">
                    <p
                      className="text-lg sm:text-xl leading-relaxed font-medium"
                      style={{ color: imm?.text }}
                    >
                      {fact.text}
                    </p>
                  </Link>

                  {/* Source */}
                  {fact.source?.url ? (
                    <a
                      href={fact.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium hover:underline opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: imm?.accent }}
                    >
                      Source: {fact.source.name}
                    </a>
                  ) : (
                    <p className="text-xs opacity-50" style={{ color: imm?.muted }}>
                      {fact.source?.name}
                    </p>
                  )}

                  {/* Tags */}
                  {fact.tags && fact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {fact.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{ background: `${imm?.accent}15`, color: imm?.accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: `${imm?.accent}15` }}>
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 min-h-[44px]"
                      style={{ color: imm?.muted }}
                      aria-label="Save"
                    >
                      <Heart className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => handleShare(fact)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 min-h-[44px]"
                      style={{ color: imm?.muted }}
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <Link
                      href={`/facts/${fact.id}`}
                      className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 min-h-[44px]"
                      style={{ color: imm?.accent }}
                    >
                      Read more <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Engagement: Did you know? */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs opacity-50" style={{ color: imm?.muted }}>Did you know this?</span>
                    <button className="text-xs px-2 py-1 rounded-md hover:scale-110 transition-transform" style={{ background: `${imm?.accent}15`, color: imm?.accent }}>
                      Yes!
                    </button>
                    <button className="text-xs px-2 py-1 rounded-md hover:scale-110 transition-transform" style={{ background: `${imm?.accent}15`, color: imm?.accent }}>
                      No way!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: `${imm?.accent}30`, borderTopColor: imm?.accent }} />
              <span className="text-sm font-medium" style={{ color: imm?.muted }}>Loading more facts...</span>
            </div>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerRef} className="h-10" />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================ */
/* Confetti Burst Component                     */
/* ============================================ */

function ConfettiBurst() {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#FF7979"];
  const particles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 8}px`,
    rotation: `${Math.random() * 360}deg`,
    drift: `${(Math.random() - 0.5) * 200}px`,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} ease-out forwards`,
            transform: `rotate(${p.rotation})`,
            '--drift': p.drift,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(var(--drift, 50px)) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
