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
  formatPrice,
  getDealAgeDays,
} from "@/lib/deals";
import DealCard from "./DealCard";

interface DealsBoardProps {
  deals: TechDeal[];
  feedDate: string;
  lastVerified: string | null;
  previousDeals: TechDeal[];
  previousFeedDate: string | null;
}

type FilterMode = "all" | "historical-low" | "biggest-savings";

export default function DealsBoard({
  deals,
  feedDate,
  lastVerified,
  previousDeals,
  previousFeedDate,
}: DealsBoardProps) {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // "New Today" logic — deals where first_posted_at equals feed date
  const newTodayDeals = deals
    .filter((d) => d.first_posted_at === feedDate)
    .sort((a, b) => {
      // Historical lows first, then by discount_pct
      if (a.is_historical_low && !b.is_historical_low) return -1;
      if (!a.is_historical_low && b.is_historical_low) return 1;
      return b.discount_pct - a.discount_pct;
    })
    .slice(0, 10);

  // If no deals new today, find the most recent first_posted_at
  let stripDeals = newTodayDeals;
  let stripTitle = "New Today";
  if (newTodayDeals.length === 0) {
    const dates = [...new Set(deals.map((d) => d.first_posted_at).filter(Boolean))].sort().reverse();
    const latestDate = dates[0];
    if (latestDate) {
      stripDeals = deals
        .filter((d) => d.first_posted_at === latestDate)
        .sort((a, b) => {
          if (a.is_historical_low && !b.is_historical_low) return -1;
          if (!a.is_historical_low && b.is_historical_low) return 1;
          return b.discount_pct - a.discount_pct;
        })
        .slice(0, 10);
      stripTitle = "Latest Additions";
    }
  }

  // Track new deal IDs for badge on the main board
  const newDealIds = new Set(stripDeals.map((d) => d.id));

  // "Last Chance" — deals live 14+ days, sorted oldest first
  const lastChanceDeals = deals
    .filter((d) => getDealAgeDays(d.first_posted_at, feedDate) >= 14)
    .sort((a, b) => getDealAgeDays(b.first_posted_at, feedDate) - getDealAgeDays(a.first_posted_at, feedDate));

  // "Gone since yesterday" — deals in previous feed but not in today's
  const currentDealKeys = new Set(
    deals.map((d) => `${d.product_name}|||${d.retailer}`)
  );
  const goneDeals = previousDeals.filter(
    (d) => !currentDealKeys.has(`${d.product_name}|||${d.retailer}`)
  );
  // Find dominant category among gone deals
  let goneCategoryInfo = "";
  if (goneDeals.length > 0) {
    const catCounts = new Map<string, number>();
    for (const d of goneDeals) {
      catCounts.set(d.category, (catCounts.get(d.category) || 0) + 1);
    }
    const topCat = [...catCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCat && topCat[1] > goneDeals.length * 0.4 && goneDeals.length > 1) {
      goneCategoryInfo = ` — mostly ${topCat[0]}`;
    }
  }

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

      {/* "Gone since yesterday" strip */}
      {goneDeals.length > 0 && previousFeedDate && (
        <div className="mb-4 rounded-xl border border-[#E9DFE4] bg-[#F3E6ED]/50 px-4 py-2.5 flex items-center gap-2">
          <span className="text-sm">📉</span>
          <p className="text-xs font-medium text-[#801C45]/80">
            {goneDeals.length} deal{goneDeals.length !== 1 ? "s" : ""} ended overnight{goneCategoryInfo}
          </p>
        </div>
      )}

      {/* New Today / Latest Additions strip */}
      {stripDeals.length > 0 && (
        <div className="mb-6 rounded-2xl border border-[#E9DFE4] bg-gradient-to-r from-[#F3E6ED] via-white to-[#F3E6ED] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#801C45] px-3 py-1 text-xs font-bold text-white">
              ✦ {stripTitle}
            </span>
            <span className="text-xs text-muted">
              {stripDeals.length} deal{stripDeals.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stripDeals.map((deal) => (
              <a
                key={deal.id}
                href={deal.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[200px] rounded-xl border border-[#E9DFE4] bg-white p-3 hover:border-[#801C45]/40 hover:shadow-md transition-all"
              >
                {deal.image_url && (
                  <div className="h-20 w-full rounded-lg bg-gray-50 flex items-center justify-center p-2 mb-2">
                    <img
                      src={deal.image_url.startsWith("https://muse.ai") ? `/api/img?url=${encodeURIComponent(deal.image_url)}` : deal.image_url}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-xs font-semibold leading-snug line-clamp-2 text-gray-900">{deal.product_name}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-emerald-600">{formatPrice(deal.price_current)}</span>
                  {deal.price_list > deal.price_current && (
                    <span className="text-[10px] text-gray-400 line-through">{formatPrice(deal.price_list)}</span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  {deal.is_historical_low && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">LOW</span>
                  )}
                  {deal.discount_pct > 0 && (
                    <span className="text-[10px] font-bold text-red-500">-{Math.round(deal.discount_pct)}%</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Lowest Ever rail */}
      {(() => {
        const lowestEver = deals
          .filter((d) => d.is_historical_low || (d.price_90d_low && d.price_90d_low > 0 && d.price_current <= d.price_90d_low))
          .sort((a, b) => b.discount_pct - a.discount_pct)
          .slice(0, 10);
        if (lowestEver.length === 0) return null;
        return (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                <TrendingDown className="h-3 w-3" /> Lowest Ever
              </span>
              <span className="text-xs text-muted">{lowestEver.length} at tracked lows</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {lowestEver.map((deal) => (
                <a
                  key={deal.id}
                  href={deal.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[200px] rounded-xl border border-emerald-100 bg-white p-3 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  {deal.image_url && (
                    <div className="h-20 w-full rounded-lg bg-gray-50 flex items-center justify-center p-2 mb-2">
                      <img
                        src={deal.image_url.startsWith("https://muse.ai") ? `/api/img?url=${encodeURIComponent(deal.image_url)}` : deal.image_url}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold leading-snug line-clamp-2 text-gray-900">{deal.product_name}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-emerald-600">{formatPrice(deal.price_current)}</span>
                    {deal.price_list > deal.price_current && (
                      <span className="text-[10px] text-gray-400 line-through">{formatPrice(deal.price_list)}</span>
                    )}
                  </div>
                  <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    LOWEST TRACKED
                  </span>
                </a>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Last Chance rail — deals live 14+ days */}
      {lastChanceDeals.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
              ⏳ Last Chance
            </span>
            <span className="text-xs text-muted">{lastChanceDeals.length} deal{lastChanceDeals.length !== 1 ? "s" : ""}</span>
          </div>
          <p className="mb-3 text-[11px] text-[#71646C]">
            These deals have run unusually long and can be pulled by the retailer at any time.
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {lastChanceDeals.map((deal) => (
              <a
                key={deal.id}
                href={deal.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[200px] rounded-xl border border-amber-200 bg-white p-3 hover:border-amber-400 hover:shadow-md transition-all"
              >
                {deal.image_url && (
                  <div className="h-20 w-full rounded-lg bg-gray-50 flex items-center justify-center p-2 mb-2">
                    <img
                      src={deal.image_url.startsWith("https://muse.ai") ? `/api/img?url=${encodeURIComponent(deal.image_url)}` : deal.image_url}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-xs font-semibold leading-snug line-clamp-2 text-gray-900">{deal.product_name}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-emerald-600">{formatPrice(deal.price_current)}</span>
                  {deal.price_list > deal.price_current && (
                    <span className="text-[10px] text-gray-400 line-through">{formatPrice(deal.price_list)}</span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                    LAST CHANCE
                  </span>
                  <span className="text-[10px] text-[#71646C]">
                    Day {getDealAgeDays(deal.first_posted_at, feedDate) + 1}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

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
                ? "bg-[#801C45] text-white"
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
                  ? "bg-[#801C45] text-white"
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
            <DealCard key={deal.id} deal={deal} isNew={newDealIds.has(deal.id)} feedDate={feedDate} />
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
                  <DealCard key={deal.id} deal={deal} isNew={newDealIds.has(deal.id)} feedDate={feedDate} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
