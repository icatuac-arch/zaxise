"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  publishedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Region definitions                                                  */
/* ------------------------------------------------------------------ */

interface Region {
  id: string;
  name: string;
  emoji: string;
  description: string;
  searchTerms: string[];
  /* CSS gradient for card */
  gradientFrom: string;
  gradientTo: string;
  /* SVG path approximate coords (for decorative dot) */
  dotX: number;
  dotY: number;
}

const REGIONS: Region[] = [
  {
    id: "africa",
    name: "Africa",
    emoji: "🌍",
    description: "Egypt · Nigeria · Kenya · Sahara · Congo · Ethiopia · Morocco",
    searchTerms: [
      "Africa", "Egypt", "Nigeria", "Kenya", "Sahara", "Ethiopia",
      "Morocco", "Congo", "Tanzania", "Sudan", "Ghana", "Zimbabwe",
      "Nile", "Kilimanjaro", "Savanna", "Serengeti",
    ],
    gradientFrom: "#D97706",
    gradientTo: "#92400E",
    dotX: 50,
    dotY: 55,
  },
  {
    id: "asia",
    name: "Asia",
    emoji: "🌏",
    description: "China · India · Japan · Korea · Southeast Asia · Middle East",
    searchTerms: [
      "Asia", "China", "India", "Japan", "Korea", "Thailand",
      "Vietnam", "Indonesia", "Philippines", "Turkey", "Iran",
      "Arabia", "Himalaya", "Silk Road", "Buddhism", "Hindi",
    ],
    gradientFrom: "#DC2626",
    gradientTo: "#7F1D1D",
    dotX: 72,
    dotY: 38,
  },
  {
    id: "europe",
    name: "Europe",
    emoji: "🏛️",
    description: "Rome · Paris · Greece · Germany · Britain · Scandinavia",
    searchTerms: [
      "Europe", "France", "Germany", "Rome", "Greece", "Britain",
      "Spain", "Italy", "Russia", "Scandinavia", "Renaissance",
      "Viking", "Roman", "Medieval", "Celtic", "Byzantine",
    ],
    gradientFrom: "#2563EB",
    gradientTo: "#1E3A8A",
    dotX: 48,
    dotY: 28,
  },
  {
    id: "north-america",
    name: "North America",
    emoji: "🗽",
    description: "USA · Canada · Mexico · Caribbean · Central America",
    searchTerms: [
      "America", "United States", "Canada", "Mexico", "Caribbean",
      "Alaska", "NASA", "Hollywood", "Native American", "Aztec",
      "Maya", "Mississippi", "Grand Canyon", "New York",
    ],
    gradientFrom: "#16A34A",
    gradientTo: "#14532D",
    dotX: 20,
    dotY: 35,
  },
  {
    id: "south-america",
    name: "South America",
    emoji: "🌿",
    description: "Brazil · Amazon · Andes · Argentina · Peru · Colombia",
    searchTerms: [
      "Brazil", "Amazon", "Andes", "Argentina", "Peru", "Colombia",
      "Chile", "Patagonia", "Venezuela", "Bolivia", "Inca",
      "Rainforest", "Rio", "Machu Picchu",
    ],
    gradientFrom: "#059669",
    gradientTo: "#064E3B",
    dotX: 30,
    dotY: 62,
  },
  {
    id: "oceania",
    name: "Oceania",
    emoji: "🦘",
    description: "Australia · New Zealand · Pacific Islands · Polynesia",
    searchTerms: [
      "Australia", "Pacific", "New Zealand", "Polynesia", "Melanesia",
      "Aboriginal", "Maori", "Great Barrier Reef", "Outback",
      "Hawaii", "Papua", "Fiji",
    ],
    gradientFrom: "#0891B2",
    gradientTo: "#164E63",
    dotX: 80,
    dotY: 68,
  },
  {
    id: "polar",
    name: "Polar Regions",
    emoji: "🧊",
    description: "Arctic · Antarctica · Greenland · Tundra · Permafrost",
    searchTerms: [
      "Arctic", "Antarctica", "Greenland", "Polar", "Tundra",
      "Permafrost", "Glacier", "Ice", "Aurora", "Northern Lights",
      "Penguin", "Polar Bear",
    ],
    gradientFrom: "#7C3AED",
    gradientTo: "#3B0764",
    dotX: 50,
    dotY: 10,
  },
];

/* ------------------------------------------------------------------ */
/*  Simple SVG World Map (decorative backdrop)                         */
/* ------------------------------------------------------------------ */

function WorldMapSVG({ selectedId }: { selectedId: string | null }) {
  return (
    <svg
      viewBox="0 0 100 75"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Stylized continent silhouettes — simplified polygons */}
      {/* Background ocean */}
      <rect width="100" height="75" fill="var(--surface)" rx="4" />

      {/* Grid lines */}
      {[15, 30, 45, 60].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--muted)" strokeWidth="0.1" strokeDasharray="1,2" opacity="0.3" />
      ))}
      {[20, 40, 60, 80].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="75" stroke="var(--muted)" strokeWidth="0.1" strokeDasharray="1,2" opacity="0.3" />
      ))}

      {/* Equator */}
      <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="var(--accent)" strokeWidth="0.2" opacity="0.4" />

      {/* Africa */}
      <polygon
        points="44,30 52,28 56,32 58,42 55,55 50,60 44,56 40,48 40,38"
        fill={selectedId === "africa" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "africa" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* Europe */}
      <polygon
        points="42,18 50,16 54,20 52,26 46,28 40,26 38,22"
        fill={selectedId === "europe" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "europe" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* Asia */}
      <polygon
        points="54,18 72,16 85,22 88,30 82,38 70,40 58,36 52,28 52,22"
        fill={selectedId === "asia" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "asia" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* North America */}
      <polygon
        points="8,16 22,14 30,20 28,30 22,38 14,36 8,28"
        fill={selectedId === "north-america" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "north-america" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* South America */}
      <polygon
        points="22,42 32,40 36,46 34,58 28,64 20,60 18,52"
        fill={selectedId === "south-america" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "south-america" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* Oceania */}
      <polygon
        points="74,50 84,48 88,54 84,60 74,60 70,56"
        fill={selectedId === "oceania" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "oceania" ? 0.7 : 0.25}
        className="transition-all duration-300"
      />
      {/* Polar/Arctic cap */}
      <ellipse
        cx="50" cy="4" rx="28" ry="6"
        fill={selectedId === "polar" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "polar" ? 0.5 : 0.15}
        className="transition-all duration-300"
      />
      {/* Antarctica */}
      <ellipse
        cx="50" cy="73" rx="22" ry="4"
        fill={selectedId === "polar" ? "var(--accent)" : "var(--muted)"}
        opacity={selectedId === "polar" ? 0.5 : 0.15}
        className="transition-all duration-300"
      />

      {/* Region dots */}
      {REGIONS.map((r) => (
        <circle
          key={r.id}
          cx={r.dotX}
          cy={r.dotY}
          r={selectedId === r.id ? 2.5 : 1.5}
          fill={selectedId === r.id ? "var(--accent)" : "var(--text)"}
          opacity={selectedId === r.id ? 1 : 0.4}
          className="transition-all duration-300"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Region Card                                                         */
/* ------------------------------------------------------------------ */

function RegionCard({
  region,
  selected,
  factCount,
  loading,
  onClick,
}: {
  region: Region;
  selected: boolean;
  factCount: number | null;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left rounded-xl border-2 transition-all duration-200 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        selected
          ? "border-[var(--accent)] shadow-lg scale-[1.02]"
          : "border-[var(--muted)]/20 hover:border-[var(--muted)]/50 hover:scale-[1.01]"
      }`}
    >
      {/* Gradient header */}
      <div
        className="relative h-20 flex items-center justify-between px-5"
        style={{
          background: `linear-gradient(135deg, ${region.gradientFrom}22, ${region.gradientTo}44)`,
          borderBottom: selected
            ? "1px solid var(--accent)"
            : "1px solid transparent",
        }}
      >
        <span className="text-4xl" role="img" aria-label={region.name}>
          {region.emoji}
        </span>
        <div className="text-right">
          {loading ? (
            <span className="font-mono text-[10px] text-[var(--muted)] animate-pulse">
              ...
            </span>
          ) : factCount !== null ? (
            <div>
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: region.gradientFrom }}
              >
                {factCount}
              </span>
              <p className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">
                facts
              </p>
            </div>
          ) : null}
        </div>

        {selected && (
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-ping"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card body */}
      <div className="px-5 py-3 bg-[var(--surface)]">
        <h3
          className={`font-display font-semibold text-base mb-0.5 transition-colors ${
            selected ? "text-[var(--accent)]" : "text-[var(--text)] group-hover:text-[var(--accent)]"
          }`}
        >
          {region.name}
        </h3>
        <p className="font-mono text-[10px] text-[var(--muted)] leading-relaxed line-clamp-1">
          {region.description}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Fact list item                                                       */
/* ------------------------------------------------------------------ */

function FactItem({ fact, index }: { fact: Fact; index: number }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = `Did you know? ${fact.text}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: "Did You Know?" }); } catch { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      className="border border-[var(--muted)]/15 bg-[var(--surface)] rounded-lg p-5 flex gap-4 group hover:border-[var(--muted)]/35 transition-colors"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Index number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--muted)]/30 flex items-center justify-center">
        <span className="font-mono text-[10px] text-[var(--muted)]">{index + 1}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="stamp text-[9px]">{fact.category}</span>
          {fact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-wide px-1.5 py-0.5 border border-[var(--muted)]/25 text-[var(--muted)] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="font-display text-sm text-[var(--text)] leading-relaxed mb-3">
          {fact.text}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/share/${fact.id}`}
            className="font-mono text-[10px] text-[var(--accent)] hover:underline uppercase tracking-wide"
          >
            View →
          </Link>
          <button
            onClick={share}
            className="font-mono text-[10px] text-[var(--muted)] hover:text-[var(--accent)] uppercase tracking-wide transition-colors"
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <Link
            href={`/browse?category=${encodeURIComponent(fact.category)}`}
            className="font-mono text-[10px] text-[var(--muted)] hover:text-[var(--accent)] uppercase tracking-wide transition-colors"
          >
            More {fact.category} →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Geographic Pin Feed                                                 */
/* ------------------------------------------------------------------ */

function PinFeed({ facts }: { facts: Fact[] }) {
  const GEO_TERMS = [
    "Africa", "Asia", "Europe", "America", "Australia", "Pacific",
    "ocean", "mountain", "river", "island", "desert", "forest",
    "city", "country", "continent", "world", "global",
  ];

  const geoFacts = facts.filter((f) => {
    const combined = (f.text + " " + f.tags.join(" ")).toLowerCase();
    return GEO_TERMS.some((term) => combined.includes(term.toLowerCase()));
  });

  if (geoFacts.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--muted)] text-center py-8">
        No location-tagged facts found in the current dataset.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {geoFacts.slice(0, 12).map((fact, i) => (
        <FactItem key={fact.id} fact={fact} index={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Map Page                                                       */
/* ------------------------------------------------------------------ */

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionFacts, setRegionFacts] = useState<Fact[]>([]);
  const [factCounts, setFactCounts] = useState<Record<string, number>>({});
  const [loadingRegion, setLoadingRegion] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [randomFact, setRandomFact] = useState<Fact | null>(null);
  const [showRandom, setShowRandom] = useState(false);
  const [tab, setTab] = useState<"regions" | "pins">("regions");
  const [allFacts, setAllFacts] = useState<Fact[]>([]);
  const factsRef = useRef<HTMLDivElement>(null);

  /* Load fact counts for all regions on mount */
  useEffect(() => {
    async function loadCounts() {
      setLoadingCounts(true);
      const counts: Record<string, number> = {};

      await Promise.all(
        REGIONS.map(async (region) => {
          /* Use first search term as primary query */
          const q = encodeURIComponent(region.searchTerms[0]);
          try {
            const res = await fetch(`/api/facts?q=${q}&limit=1`);
            if (res.ok) {
              const data = await res.json();
              counts[region.id] = data.total ?? 0;
            }
          } catch {
            counts[region.id] = 0;
          }
        })
      );

      setFactCounts(counts);
      setLoadingCounts(false);
    }

    loadCounts();
  }, []);

  /* Load all facts for pin feed */
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("/api/facts?limit=100&page=1");
        if (!res.ok) return;
        const data = await res.json();
        const total = data.total ?? data.facts?.length ?? 0;
        const pages = Math.ceil(total / 100);

        if (pages <= 1) {
          setAllFacts(data.facts ?? []);
          return;
        }

        const results = await Promise.all(
          Array.from({ length: pages }, (_, i) =>
            fetch(`/api/facts?limit=100&page=${i + 1}`).then((r) => r.json())
          )
        );
        setAllFacts(results.flatMap((r) => r.facts ?? []));
      } catch { /* silent */ }
    }
    loadAll();
  }, []);

  /* Fetch facts for selected region */
  const selectRegion = useCallback(async (regionId: string) => {
    if (selectedRegion === regionId) {
      setSelectedRegion(null);
      setRegionFacts([]);
      setShowRandom(false);
      return;
    }

    setSelectedRegion(regionId);
    setShowRandom(false);
    setLoadingRegion(true);

    const region = REGIONS.find((r) => r.id === regionId)!;

    /* Fetch across multiple search terms and merge */
    const termResults = await Promise.all(
      region.searchTerms.slice(0, 4).map(async (term) => {
        try {
          const res = await fetch(
            `/api/facts?q=${encodeURIComponent(term)}&limit=20`
          );
          if (res.ok) {
            const data = await res.json();
            return data.facts ?? [];
          }
        } catch { /* silent */ }
        return [];
      })
    );

    /* Deduplicate by id */
    const seen = new Set<string>();
    const merged: Fact[] = [];
    for (const batch of termResults) {
      for (const fact of batch) {
        if (!seen.has(fact.id)) {
          seen.add(fact.id);
          merged.push(fact);
        }
      }
    }

    setRegionFacts(merged.slice(0, 20));
    setLoadingRegion(false);

    /* Scroll to facts panel */
    setTimeout(() => {
      factsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [selectedRegion]);

  /* Pick random fact from selected region */
  const pickRandom = () => {
    if (regionFacts.length === 0) return;
    const idx = Math.floor(Math.random() * regionFacts.length);
    setRandomFact(regionFacts[idx]);
    setShowRandom(true);
  };

  const currentRegion = REGIONS.find((r) => r.id === selectedRegion);

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <div className="border-b border-[var(--muted)]/20 bg-[var(--surface)]/40">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-2">
                ◎ World Map
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-[var(--text)]">
                Facts by Location
              </h1>
              <p className="font-mono text-xs text-[var(--muted)] mt-2">
                Explore knowledge across continents and regions of the world.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex border border-[var(--muted)]/25 rounded-lg overflow-hidden">
              {(["regions", "pins"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`font-mono text-[10px] uppercase tracking-wider px-4 py-2 transition-colors ${
                    tab === t
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {t === "regions" ? "🗺 Regions" : "📍 Location Feed"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* ── Decorative world map ── */}
        <div className="relative border border-[var(--muted)]/20 rounded-xl overflow-hidden bg-[var(--surface)]/30" style={{ height: "220px" }}>
          <WorldMapSVG selectedId={selectedRegion} />
          {/* Overlay labels */}
          <div className="absolute inset-0 pointer-events-none flex items-end p-4">
            <p className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-widest opacity-60">
              Select a region below to explore facts
            </p>
          </div>
          {currentRegion && (
            <div className="absolute top-3 left-3 bg-[var(--bg)]/90 border border-[var(--accent)]/30 rounded-lg px-3 py-2 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                {currentRegion.emoji} {currentRegion.name}
              </p>
            </div>
          )}
        </div>

        {/* ── Tab content ── */}
        {tab === "regions" ? (
          <>
            {/* Region cards grid */}
            <section aria-label="World regions">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {REGIONS.map((region) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    selected={selectedRegion === region.id}
                    factCount={factCounts[region.id] ?? null}
                    loading={loadingCounts}
                    onClick={() => selectRegion(region.id)}
                  />
                ))}
              </div>
            </section>

            {/* ── Selected region facts panel ── */}
            {selectedRegion && (
              <section
                ref={factsRef}
                aria-label={`Facts from ${currentRegion?.name}`}
                className="space-y-6"
              >
                {/* Panel header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--muted)]/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {currentRegion?.emoji}
                    </span>
                    <div>
                      <h2 className="font-display text-xl text-[var(--text)]">
                        {currentRegion?.name}
                      </h2>
                      <p className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wide">
                        {loadingRegion ? "Loading…" : `${regionFacts.length} facts found`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={pickRandom}
                      disabled={loadingRegion || regionFacts.length === 0}
                      className="btn text-xs py-2 px-4"
                    >
                      🎲 Random from {currentRegion?.name}
                    </button>
                    <button
                      onClick={() => { setSelectedRegion(null); setRegionFacts([]); setShowRandom(false); }}
                      className="btn text-xs py-2 px-3"
                      aria-label="Close region panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Random fact spotlight */}
                {showRandom && randomFact && (
                  <div
                    className="border-2 border-[var(--accent)] bg-[var(--surface)] rounded-xl p-6 relative"
                    role="region"
                    aria-label="Random fact spotlight"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="stamp text-[9px]">🎲 Random Pick</span>
                      <span className="stamp text-[9px]">{randomFact.category}</span>
                    </div>
                    <p className="font-display text-lg md:text-xl text-[var(--text)] leading-relaxed mb-4">
                      {randomFact.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/share/${randomFact.id}`}
                        className="font-mono text-xs text-[var(--accent)] hover:underline uppercase tracking-wide"
                      >
                        Full fact →
                      </Link>
                      <button
                        onClick={pickRandom}
                        className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] uppercase tracking-wide transition-colors"
                      >
                        Another one →
                      </button>
                      <button
                        onClick={() => setShowRandom(false)}
                        className="ml-auto font-mono text-[10px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                        aria-label="Close spotlight"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Fact list */}
                {loadingRegion ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div
                      className="w-8 h-8 border-2 border-[var(--muted)]/30 border-t-[var(--accent)] rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest animate-pulse">
                      Searching the globe…
                    </p>
                  </div>
                ) : regionFacts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-display text-lg text-[var(--muted)] mb-2">
                      No facts found for this region.
                    </p>
                    <p className="font-mono text-xs text-[var(--muted)]">
                      Try a different region or{" "}
                      <Link href="/browse" className="text-[var(--accent)] hover:underline">
                        browse all facts
                      </Link>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {regionFacts.map((fact, i) => (
                      <FactItem key={fact.id} fact={fact} index={i} />
                    ))}
                  </div>
                )}

                {/* See more link */}
                {!loadingRegion && regionFacts.length > 0 && (
                  <div className="text-center pt-4 border-t border-[var(--muted)]/20">
                    <Link
                      href={`/browse?q=${encodeURIComponent(currentRegion?.searchTerms[0] ?? "")}`}
                      className="font-mono text-xs text-[var(--accent)] hover:underline uppercase tracking-wide"
                    >
                      Browse all {currentRegion?.name} facts →
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Empty state — no region selected */}
            {!selectedRegion && (
              <div className="text-center py-12 border border-dashed border-[var(--muted)]/25 rounded-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
                  No region selected
                </p>
                <p className="font-display text-lg text-[var(--text)]">
                  Click any region card above to explore facts from that part of the world.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Pin feed tab */
          <section aria-label="Location-tagged facts">
            <div className="mb-6">
              <h2 className="font-display text-xl text-[var(--text)] mb-1">
                Location-Tagged Facts
              </h2>
              <p className="font-mono text-xs text-[var(--muted)]">
                Facts that mention specific places, continents, or geographic features.
              </p>
            </div>
            {allFacts.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="font-mono text-xs text-[var(--muted)] animate-pulse uppercase tracking-widest">
                  Loading facts…
                </p>
              </div>
            ) : (
              <PinFeed facts={allFacts} />
            )}
          </section>
        )}

        {/* ── Stats bar ── */}
        <div className="border border-[var(--muted)]/15 rounded-xl bg-[var(--surface)]/40 p-5">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-[var(--text)]">{REGIONS.length}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">Regions</p>
            </div>
            <div className="w-px bg-[var(--muted)]/20" aria-hidden="true" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-[var(--text)]">
                {Object.values(factCounts).reduce((a, b) => a + b, 0) || "—"}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">Total Geo Facts</p>
            </div>
            <div className="w-px bg-[var(--muted)]/20" aria-hidden="true" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-[var(--text)]">7</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">Continents</p>
            </div>
            <div className="w-px bg-[var(--muted)]/20" aria-hidden="true" />
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-[var(--accent)]">
                {selectedRegion ? (factCounts[selectedRegion] ?? "—") : "—"}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">Selected Region</p>
            </div>
          </div>
        </div>

        {/* ── Footer nav ── */}
        <div className="flex flex-wrap gap-4 justify-center pb-8">
          {[
            { href: "/explore", label: "◎ Explore" },
            { href: "/browse", label: "▤ Browse All" },
            { href: "/daily", label: "📰 Daily Digest" },
            { href: "/quiz", label: "? Quiz" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors border border-[var(--muted)]/20 hover:border-[var(--accent)]/40 px-4 py-2 rounded-full"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
