"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Shuffle,
  Heart,
  Share2,
  BookOpen,
  ChevronLeft,
  Filter,
  X,
  Check,
} from "lucide-react";

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  publishedAt: string;
}

const CATEGORIES = [
  "Space",
  "Animals",
  "Human Body",
  "History",
  "Geography",
  "Science",
  "Technology",
  "Food",
  "Language",
  "Ocean",
  "Music",
  "Sports",
  "Art",
  "Nature",
  "Math",
  "Psychology",
  "Culture",
  "Medicine",
  "Economics",
  "Architecture",
  "Astronomy",
  "Chemistry",
  "Climate & Weather",
  "Engineering",
  "Environment",
  "Geology",
  "Inventions",
  "Law & Government",
  "Literature",
  "Mythology",
  "Philosophy",
  "Photography & Film",
  "Religion",
  "Transportation",
  "World Records",
  "Archaeology",
  "Biology",
  "Energy",
  "Communication",
  "Agriculture",
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "var(--accent)",
  medium: "var(--secondary)",
  hard: "var(--muted)",
};

function categorySlug(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ExplorePage() {
  const [allFacts, setAllFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [toast, setToast] = useState("");
  const [pool, setPool] = useState<Fact[]>([]);
  const [poolIndex, setPoolIndex] = useState(0);
  const initialized = useRef(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Load all facts once
  useEffect(() => {
    fetch("/api/facts?limit=100&page=1")
      .then((r) => r.json())
      .then((data) => {
        // We need to load all facts — fetch with a large limit
        const total = data.total;
        const pages = Math.ceil(total / 100);
        const promises = Array.from({ length: pages }, (_, i) =>
          fetch(`/api/facts?limit=100&page=${i + 1}`).then((r) => r.json())
        );
        return Promise.all(promises);
      })
      .then((pages) => {
        const all: Fact[] = pages.flatMap((p) => p.facts || []);
        setAllFacts(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build shuffled pool whenever filters or allFacts change
  useEffect(() => {
    if (allFacts.length === 0) return;
    let filtered = allFacts;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(
        (f) => f.difficulty === selectedDifficulty.toLowerCase()
      );
    }
    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setPoolIndex(0);
    setSeenIds(new Set());
    initialized.current = false;
  }, [allFacts, selectedCategory, selectedDifficulty]);

  // Pick first fact when pool is ready
  useEffect(() => {
    if (pool.length > 0 && !initialized.current) {
      initialized.current = true;
      setCurrentFact(pool[0]);
      setSeenIds(new Set([pool[0].id]));
      setPoolIndex(1);
    }
  }, [pool]);

  const nextFact = useCallback(
    (dir: "left" | "right" = "right") => {
      if (pool.length === 0 || animating) return;

      setDirection(dir);
      setAnimating(true);

      setTimeout(() => {
        let nextIndex = poolIndex;
        // If we've exhausted the pool, reshuffle and start over
        if (nextIndex >= pool.length) {
          const reshuffled = [...pool].sort(() => Math.random() - 0.5);
          setPool(reshuffled);
          nextIndex = 0;
        }

        const fact = pool[nextIndex];
        setCurrentFact(fact);
        setSeenIds((prev) => new Set([...prev, fact.id]));
        setPoolIndex(nextIndex + 1);
        setAnimating(false);
      }, 280);
    },
    [pool, poolIndex, animating]
  );

  const toggleFavorite = () => {
    if (!currentFact) return;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(currentFact.id)) {
        next.delete(currentFact.id);
        showToast("Removed from favorites");
      } else {
        next.add(currentFact.id);
        showToast("Added to favorites!");
      }
      return next;
    });
  };

  const shareFact = async () => {
    if (!currentFact) return;
    const text = `Did you know? ${currentFact.text} — via didyouknow`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: "Did You Know?" });
      } catch {
        // dismissed
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextFact("right");
      } else if (e.key === "ArrowLeft") {
        nextFact("left");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextFact]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      nextFact(dx < 0 ? "right" : "left");
    }
    touchStartX.current = null;
  };

  const isFav = currentFact ? favorites.has(currentFact.id) : false;
  const seenCount = seenIds.size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-mono text-sm text-[var(--muted)] tracking-widest uppercase animate-pulse">
          Loading facts…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header bar */}
      <div className="border-b border-[var(--muted)]/20">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--muted)] tracking-wide">
              {seenCount} discovered this session
            </span>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1.5"
              title="Filter"
            >
              <Filter size={13} />
              Filter
              {(selectedCategory !== "All" || selectedDifficulty !== "All") && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="border-b border-[var(--muted)]/20 bg-[var(--surface)]">
          <div className="max-w-3xl mx-auto px-6 py-5 space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["All", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pill text-[11px] py-1 px-2.5 ${selectedCategory === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Easy", "Medium", "Hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`pill text-[11px] py-1 px-2.5 ${selectedDifficulty === d ? "active" : ""}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setFilterOpen(false)}
                className="btn btn-primary text-xs py-1.5 px-4"
              >
                <Check size={13} /> Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main card area */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {pool.length === 0 ? (
          <div className="text-center">
            <p className="font-display text-2xl mb-3">No facts match your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              className="btn"
            >
              <X size={14} /> Clear Filters
            </button>
          </div>
        ) : currentFact ? (
          <div
            className="w-full max-w-2xl"
            style={{
              animation: animating
                ? direction === "right"
                  ? "slideOutLeft 280ms ease forwards"
                  : "slideOutRight 280ms ease forwards"
                : "slideInRight 300ms ease both",
            }}
          >
            {/* Card */}
            <div
              className="border-2 border-[var(--text)] bg-[var(--surface)] p-8 md:p-12 relative"
              style={{ minHeight: "320px" }}
            >
              {/* Top badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="stamp">{currentFact.category}</span>
                <span
                  className="stamp"
                  style={{
                    background: DIFFICULTY_COLORS[currentFact.difficulty],
                    color: "var(--bg)",
                    borderColor: DIFFICULTY_COLORS[currentFact.difficulty],
                  }}
                >
                  {currentFact.difficulty}
                </span>
              </div>

              {/* Fact text */}
              <p
                className="font-display font-light text-[var(--text)] leading-relaxed mb-8"
                style={{ fontSize: "clamp(20px, 3.5vw, 30px)" }}
              >
                {currentFact.text}
              </p>

              {/* Tags */}
              {currentFact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {currentFact.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/chains?tag=${encodeURIComponent(tag)}`}
                      className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 border border-[var(--muted)]/40 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Source */}
              <p className="font-mono text-xs text-[var(--muted)]">
                Source:{" "}
                <a
                  href={currentFact.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] transition-colors underline underline-offset-2"
                >
                  {currentFact.source.name}
                </a>
              </p>

              {/* Seen count */}
              <div className="absolute top-4 right-4 font-mono text-[10px] text-[var(--muted)] tracking-wide">
                #{seenCount}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-5 justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`btn gap-2 ${isFav ? "btn-primary" : ""}`}
                  title={isFav ? "Remove favorite" : "Favorite"}
                >
                  <Heart size={15} fill={isFav ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">
                    {isFav ? "Favorited" : "Favorite"}
                  </span>
                </button>

                <button onClick={shareFact} className="btn gap-2" title="Share">
                  <Share2 size={15} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <Link
                  href={`/browse?category=${encodeURIComponent(currentFact.category)}`}
                  className="btn gap-2"
                  title="Deep Dive"
                >
                  <BookOpen size={15} />
                  <span className="hidden sm:inline">Deep Dive</span>
                </Link>
              </div>

              <button
                onClick={() => nextFact("right")}
                className="btn btn-primary gap-2 text-sm px-6 py-3"
                disabled={animating}
              >
                <Shuffle size={16} />
                Next Fact
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="font-mono text-[10px] text-[var(--muted)]/60 text-center mt-4 tracking-wide hidden md:block">
              Press Space or → for next · Swipe to navigate
            </p>
          </div>
        ) : null}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50 pointer-events-none"
          style={{ background: "var(--text)", color: "var(--bg)" }}
        >
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-60px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(60px); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
