"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Tag,
  TrendingDown,
  Zap,
} from "lucide-react";
import {
  type TechDeal,
  groupByCategory,
  CATEGORY_ICONS,
  CATEGORY_ORDER,
  formatVerifiedDate,
} from "@/lib/deals";
import DealCard from "./DealCard";

interface DealsBoardProps {
  deals: TechDeal[];
  feedDate: string;
  lastVerified: string | null;
}

type FilterMode = "all" | "historical-low" | "biggest-savings";

export default function DealsBoard({
  deals,
  feedDate,
  lastVerified,
}: DealsBoardProps) {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Apply filters
  let filtered = deals;

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.product_name.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.retailer.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  if (filterMode === "historical-low") {
    filtered = filtered.filter((d) => d.is_historical_low);
  } else if (filterMode === "biggest-savings") {
    filtered = [...filtered].sort((a, b) => b.discount_pct - a.discount_pct);
  }

  if (activeCategory) {
    filtered = filtered.filter((d) => d.category === activeCategory);
  }

  const grouped = groupByCategory(filtered);
  const presentCategories = Array.from(grouped.keys());

  // All categories present in today's feed for the filter chips
  const allCategories = Array.from(
    new Set(deals.map((d) => d.category))
  ).sort(
    (a, b) =>
      (CATEGORY_ORDER.indexOf(a as any) ?? 99) -
      (CATEGORY_ORDER.indexOf(b as any) ?? 99)
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Tech <span className="gradient-text">Deals</span>
              </h1>
            </div>
            <p className="text-muted">
              {deals.length} verified deals for{" "}
              {new Date(feedDate + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </motion.div>

        {/* Freshness line (spec §4) */}
        {lastVerified && (
          <p className="mt-3 text-xs text-muted">
            Prices verified {formatVerifiedDate(lastVerified)} — prices and
            stock can change; the retailer&apos;s page is final.
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-6 space-y-3">
        {/* Mode filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMode("all")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              filterMode === "all"
                ? "bg-accent text-white shadow-lg shadow-accent/25"
                : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            All Deals
          </button>
          <button
            onClick={() => setFilterMode("historical-low")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              filterMode === "historical-low"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" />
            Historical Lows
          </button>
          <button
            onClick={() => setFilterMode("biggest-savings")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              filterMode === "biggest-savings"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Biggest Savings
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !activeCategory
                ? "bg-zinc-700 text-white"
                : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            All Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-zinc-700 text-white"
                  : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {CATEGORY_ICONS[cat] || "📦"} {cat} (
              {deals.filter((d) => d.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Deals grid grouped by category */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface py-20 text-center">
          <p className="text-lg font-semibold text-muted">No deals found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search or filter
          </p>
        </div>
      ) : activeCategory ? (
        // Single category — flat grid
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        // Grouped by category
        <div className="space-y-12">
          {Array.from(grouped.entries()).map(([category, catDeals]) => (
            <section key={category}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">
                  {CATEGORY_ICONS[category] || "📦"}
                </span>
                <h2 className="text-xl font-bold">{category}</h2>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                  {catDeals.length} {catDeals.length === 1 ? "deal" : "deals"}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
