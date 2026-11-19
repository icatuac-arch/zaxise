"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, Tag, Hash, ArrowRight, X } from "lucide-react";

interface TagEntry {
  name: string;
  count: number;
}

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  publishedAt: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "var(--accent)",
  medium: "var(--secondary)",
  hard: "var(--muted)",
};

function TagCloud({
  tags,
  activeTag,
  onTagClick,
}: {
  tags: TagEntry[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}) {
  if (tags.length === 0) return null;

  const maxCount = tags[0]?.count || 1;
  const minCount = tags[tags.length - 1]?.count || 1;
  const range = maxCount - minCount || 1;

  // Display top 80 tags in cloud
  const cloudTags = tags.slice(0, 80);

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center py-4">
      {cloudTags.map((tag) => {
        const ratio = (tag.count - minCount) / range;
        // Font size from 11px to 28px
        const fontSize = Math.round(11 + ratio * 17);
        const opacity = 0.55 + ratio * 0.45;
        const isActive = activeTag === tag.name;

        return (
          <button
            key={tag.name}
            onClick={() => onTagClick(tag.name)}
            title={`${tag.name} — ${tag.count} facts`}
            className="font-mono tracking-wide leading-tight transition-all hover:text-[var(--accent)] cursor-pointer"
            style={{
              fontSize: `${fontSize}px`,
              opacity: isActive ? 1 : opacity,
              color: isActive ? "var(--accent)" : "var(--text)",
              fontWeight: isActive ? 700 : ratio > 0.6 ? 600 : 400,
              textDecoration: isActive ? "underline" : "none",
              textUnderlineOffset: "3px",
            }}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}

function FactCard({
  fact,
  onTagClick,
}: {
  fact: Fact;
  onTagClick: (tag: string) => void;
}) {
  return (
    <div className="border border-[var(--muted)]/25 bg-[var(--surface)] p-5 hover:border-[var(--muted)]/50 transition-colors">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Link
          href={`/browse?category=${encodeURIComponent(fact.category)}`}
          className="stamp hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors"
        >
          {fact.category}
        </Link>
        <span
          className="stamp"
          style={{
            background: DIFFICULTY_COLORS[fact.difficulty],
            color: "var(--bg)",
            borderColor: DIFFICULTY_COLORS[fact.difficulty],
          }}
        >
          {fact.difficulty}
        </span>
      </div>

      {/* Fact text */}
      <p className="font-display text-base leading-relaxed text-[var(--text)] mb-4">
        {fact.text}
      </p>

      {/* Tags */}
      {fact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {fact.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 border border-[var(--muted)]/40 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Source */}
      <a
        href={fact.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      >
        {fact.source.name} ↗
      </a>
    </div>
  );
}

function ChainsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTag = searchParams.get("tag");

  const [allTags, setAllTags] = useState<TagEntry[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  const [activeTag, setActiveTag] = useState<string | null>(urlTag);
  const [tagSearch, setTagSearch] = useState("");
  const [tagFacts, setTagFacts] = useState<Fact[]>([]);
  const [tagTotal, setTagTotal] = useState(0);
  const [tagPage, setTagPage] = useState(1);
  const [factsLoading, setFactsLoading] = useState(false);
  const [relatedTags, setRelatedTags] = useState<TagEntry[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load all tags on mount
  useEffect(() => {
    setTagsLoading(true);
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data) => {
        setAllTags(data.tags || []);
        setTagsLoading(false);
      })
      .catch(() => setTagsLoading(false));
  }, []);

  // Load facts when activeTag changes
  const loadTagFacts = useCallback(
    async (tag: string, page: number = 1, append: boolean = false) => {
      setFactsLoading(true);
      try {
        const res = await fetch(
          `/api/tags?tag=${encodeURIComponent(tag)}&page=${page}&limit=12`
        );
        const data = await res.json();
        if (append) {
          setTagFacts((prev) => [...prev, ...(data.facts || [])]);
        } else {
          setTagFacts(data.facts || []);
          setRelatedTags(data.relatedTags || []);
          setTagTotal(data.total || 0);
          setTagPage(1);
        }
      } finally {
        setFactsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (activeTag) {
      loadTagFacts(activeTag, 1, false);
    } else {
      setTagFacts([]);
      setRelatedTags([]);
      setTagTotal(0);
    }
  }, [activeTag, loadTagFacts]);

  // Sync URL param
  useEffect(() => {
    if (urlTag && urlTag !== activeTag) {
      setActiveTag(urlTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTag]);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    router.push(`/chains?tag=${encodeURIComponent(tag)}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearTag = () => {
    setActiveTag(null);
    router.push("/chains", { scroll: false });
  };

  const loadMore = () => {
    if (!activeTag) return;
    const nextPage = tagPage + 1;
    setTagPage(nextPage);
    loadTagFacts(activeTag, nextPage, true);
  };

  // Filtered tags for search
  const displayedTags = tagSearch
    ? allTags.filter((t) =>
        t.name.toLowerCase().includes(tagSearch.toLowerCase())
      )
    : allTags;

  const hasMore = tagFacts.length < tagTotal;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 mb-8"
      >
        <ChevronLeft size={14} /> Back
      </Link>

      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Hash size={22} className="text-[var(--accent)]" />
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]">
            Fact Chains
          </h1>
        </div>
        <p className="font-display italic text-lg text-[var(--muted)] mt-2">
          Explore {allTags.length.toLocaleString()} unique tags across 40,000+
          facts — click any tag to follow the chain
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        {/* Main column */}
        <div className="min-w-0">
          {/* Tag Cloud */}
          <section className="mb-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-4 flex items-center gap-2">
              <Tag size={13} /> Tag Cloud
            </h2>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tags…"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full max-w-sm pl-9 pr-4 py-2 bg-transparent border border-[var(--muted)]/30 font-mono text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--text)] transition-colors"
              />
              {tagSearch && (
                <button
                  onClick={() => setTagSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {tagsLoading ? (
              <p className="font-mono text-xs text-[var(--muted)] animate-pulse">
                Loading tags…
              </p>
            ) : tagSearch ? (
              // Search results list
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {displayedTags.slice(0, 60).map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={`font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 border transition-colors ${
                      activeTag === tag.name
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--muted)]/40 text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
                    }`}
                  >
                    #{tag.name}
                    <span className="ml-1 opacity-60">{tag.count}</span>
                  </button>
                ))}
                {displayedTags.length === 0 && (
                  <p className="font-mono text-xs text-[var(--muted)]">
                    No tags found for &quot;{tagSearch}&quot;
                  </p>
                )}
              </div>
            ) : (
              <TagCloud
                tags={allTags}
                activeTag={activeTag}
                onTagClick={handleTagClick}
              />
            )}
          </section>

          {/* Active tag results */}
          {activeTag && (
            <section>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--muted)]/20">
                <h2 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
                  <span className="text-[var(--accent)]">#</span>
                  {activeTag}
                </h2>
                <span className="font-mono text-xs text-[var(--muted)] tracking-wide">
                  {tagTotal.toLocaleString()} fact{tagTotal !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearTag}
                  className="ml-auto text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                  title="Clear filter"
                >
                  <X size={16} />
                </button>
              </div>

              {factsLoading && tagFacts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-[var(--muted)]/20 bg-[var(--surface)] p-5 h-40 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tagFacts.map((fact) => (
                      <FactCard
                        key={fact.id}
                        fact={fact}
                        onTagClick={handleTagClick}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={loadMore}
                        disabled={factsLoading}
                        className="btn gap-2"
                      >
                        {factsLoading ? (
                          "Loading…"
                        ) : (
                          <>
                            Load more
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                      <p className="font-mono text-[10px] text-[var(--muted)] mt-2">
                        Showing {tagFacts.length} of {tagTotal}
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* No tag selected — call to action */}
          {!activeTag && !tagsLoading && (
            <div className="mt-4 p-8 border border-[var(--muted)]/20 text-center">
              <Hash size={32} className="mx-auto mb-3 text-[var(--muted)]" />
              <p className="font-display italic text-xl text-[var(--text)] mb-2">
                Click any tag to explore the chain
              </p>
              <p className="font-mono text-xs text-[var(--muted)]">
                Each fact links to others through shared tags — follow the
                thread as far as it goes
              </p>
            </div>
          )}
        </div>

        {/* Sidebar: Related Tags */}
        <aside className="mt-10 lg:mt-0">
          {activeTag && relatedTags.length > 0 && (
            <div className="lg:sticky lg:top-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-4 flex items-center gap-2">
                <Tag size={13} /> Related Tags
              </h3>
              <div className="space-y-1">
                {relatedTags.map((rt) => (
                  <button
                    key={rt.name}
                    onClick={() => handleTagClick(rt.name)}
                    className="w-full text-left flex items-center justify-between px-3 py-2 font-mono text-xs text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Hash size={11} className="text-[var(--muted)] flex-shrink-0" />
                      <span className="truncate">{rt.name}</span>
                    </span>
                    <span className="text-[var(--muted)] group-hover:text-[var(--accent)] ml-2 flex-shrink-0">
                      {rt.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Explore CTA */}
              <div className="mt-6 pt-4 border-t border-[var(--muted)]/20">
                <Link
                  href="/explore"
                  className="btn w-full justify-center gap-2 text-xs"
                >
                  Random Walk <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* Top tags when no tag is selected */}
          {!activeTag && !tagsLoading && allTags.length > 0 && (
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] mb-4 flex items-center gap-2">
                <Tag size={13} /> Top Tags
              </h3>
              <div className="space-y-1">
                {allTags.slice(0, 25).map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className="w-full text-left flex items-center justify-between px-3 py-2 font-mono text-xs text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Hash size={11} className="text-[var(--muted)] flex-shrink-0" />
                      <span className="truncate">{tag.name}</span>
                    </span>
                    <span className="text-[var(--muted)] group-hover:text-[var(--accent)] ml-2 flex-shrink-0">
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function ChainsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-mono text-sm text-[var(--muted)] tracking-widest uppercase animate-pulse">
            Loading…
          </p>
        </div>
      }
    >
      <ChainsContent />
    </Suspense>
  );
}
