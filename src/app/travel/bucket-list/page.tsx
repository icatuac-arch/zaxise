/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  CheckCircle2,
  Heart,
  Share2,
  Copy,
  Check,
  Globe,
  Filter,
  Trophy,
  Target,
  Plane,
  Star,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { COUNTRIES } from '@/data/travel/destinations';

// ─── TYPES ─────────────────────────────────────────────────

interface BucketItem {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  countrySlug: string;
  continent: string;
  category: string;
  imageUrl?: string;
}

type ItemStatus = 'want' | 'visited' | null;
type FilterMode = 'all' | 'want' | 'visited';

// ─── BUILD BUCKET ITEMS FROM DATA ──────────────────────────

function buildBucketItems(): BucketItem[] {
  const items: BucketItem[] = [];
  for (const country of COUNTRIES) {
    for (const state of country.states || []) {
      for (const city of state.cities || []) {
        for (const attraction of city.attractions || []) {
          if (attraction.countryRank && attraction.countryRank <= 10) {
            items.push({
              id: `${country.slug}-${attraction.id}`,
              name: attraction.name,
              country: country.name,
              countryFlag: country.flag,
              countrySlug: country.slug,
              continent: country.continent || 'Other',
              category: attraction.category || 'landmark',
              imageUrl: attraction.imageUrl,
            });
          }
        }
      }
    }
  }
  return items;
}

const CONTINENT_ORDER = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Europe / Asia', 'Other'];

const CONTINENT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Asia: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
  Europe: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  'North America': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'South America': { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
  Africa: { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500' },
  Oceania: { bg: 'bg-cyan-50', text: 'text-cyan-700', bar: 'bg-cyan-500' },
  'Europe / Asia': { bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-500' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-700', bar: 'bg-slate-500' },
};

// ─── COMPONENT ─────────────────────────────────────────────

export default function BucketListPage() {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [collapsedContinents, setCollapsedContinents] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const allItems = useMemo(() => buildBucketItems(), []);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wt-bucket-list');
    if (stored) {
      try {
        setStatuses(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  const saveStatuses = useCallback((newStatuses: Record<string, ItemStatus>) => {
    setStatuses(newStatuses);
    localStorage.setItem('wt-bucket-list', JSON.stringify(newStatuses));
  }, []);

  const toggleStatus = useCallback(
    (itemId: string, status: 'want' | 'visited') => {
      const current = statuses[itemId];
      const newStatuses = { ...statuses };
      if (current === status) {
        delete newStatuses[itemId];
      } else {
        newStatuses[itemId] = status;
      }
      saveStatuses(newStatuses);
    },
    [statuses, saveStatuses]
  );

  // Stats
  const stats = useMemo(() => {
    const wantCount = Object.values(statuses).filter((s) => s === 'want').length;
    const visitedCount = Object.values(statuses).filter((s) => s === 'visited').length;
    const countriesVisited = new Set(
      allItems.filter((item) => statuses[item.id] === 'visited').map((item) => item.country)
    ).size;
    const totalCountries = new Set(allItems.map((item) => item.country)).size;
    return { wantCount, visitedCount, countriesVisited, totalCountries, totalItems: allItems.length };
  }, [statuses, allItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    let items = allItems;
    if (filterMode === 'want') items = items.filter((i) => statuses[i.id] === 'want');
    if (filterMode === 'visited') items = items.filter((i) => statuses[i.id] === 'visited');
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.country.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, statuses, filterMode, search]);

  // Group by continent
  const grouped = useMemo(() => {
    const groups: Record<string, BucketItem[]> = {};
    for (const item of filteredItems) {
      const continent = item.continent || 'Other';
      if (!groups[continent]) groups[continent] = [];
      groups[continent].push(item);
    }
    return groups;
  }, [filteredItems]);

  const sortedContinents = useMemo(
    () => Object.keys(grouped).sort((a, b) => CONTINENT_ORDER.indexOf(a) - CONTINENT_ORDER.indexOf(b)),
    [grouped]
  );

  // Continent stats for progress bars
  const continentStats = useMemo(() => {
    const result: Record<string, { total: number; visited: number; want: number }> = {};
    for (const item of allItems) {
      const c = item.continent || 'Other';
      if (!result[c]) result[c] = { total: 0, visited: 0, want: 0 };
      result[c].total++;
      if (statuses[item.id] === 'visited') result[c].visited++;
      if (statuses[item.id] === 'want') result[c].want++;
    }
    return result;
  }, [allItems, statuses]);

  const toggleContinent = useCallback((continent: string) => {
    setCollapsedContinents((prev) => ({ ...prev, [continent]: !prev[continent] }));
  }, []);

  const shareList = useCallback(async () => {
    const text = `My WorldTourly Bucket List: ${stats.visitedCount + stats.wantCount} destinations, ${stats.countriesVisited} countries visited, ${stats.wantCount} to go!\n\nBuild yours: worldtourly.com/bucket-list`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [stats]);

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Bucket List</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#F59E0B] rounded-xl">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
              Travel Bucket List
            </h1>
          </div>
          <p className="text-xl text-white/80 mt-2 max-w-2xl">
            Build your dream travel list. Mark places you want to visit and check off the ones you have already been to. How much of the world have you seen?
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.visitedCount}</p>
            <p className="text-sm text-slate-500">Visited</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-50 rounded-lg mb-2">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats.wantCount}</p>
            <p className="text-sm text-slate-500">Want to Visit</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#0EA5E9]/10 rounded-lg mb-2">
              <Globe className="w-5 h-5 text-[#0EA5E9]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">
              {stats.countriesVisited}
              <span className="text-base font-normal text-slate-400">/{stats.totalCountries}</span>
            </p>
            <p className="text-sm text-slate-500">Countries</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#F59E0B]/10 rounded-lg mb-2">
              <Trophy className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">
              {stats.totalItems > 0 ? Math.round((stats.visitedCount / stats.totalItems) * 100) : 0}%
            </p>
            <p className="text-sm text-slate-500">World Explored</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex gap-2">
            {(['all', 'want', 'visited'] as FilterMode[]).map((mode) => {
              const labels: Record<FilterMode, string> = { all: 'All Destinations', want: 'Want to Visit', visited: 'Already Visited' };
              const icons: Record<FilterMode, any> = { all: MapPin, want: Heart, visited: CheckCircle2 };
              const Icon = icons[mode];
              return (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterMode === mode
                      ? 'bg-[#0EA5E9] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] w-48"
            />
            <button
              onClick={shareList}
              className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Continent Sections */}
        {sortedContinents.map((continent) => {
          const items = grouped[continent];
          const cStats = continentStats[continent] || { total: 0, visited: 0, want: 0 };
          const colors = CONTINENT_COLORS[continent] || CONTINENT_COLORS.Other;
          const isCollapsed = collapsedContinents[continent];
          const visitedPct = cStats.total > 0 ? Math.round((cStats.visited / cStats.total) * 100) : 0;

          return (
            <section key={continent} className="mb-8">
              {/* Continent Header */}
              <button
                onClick={() => toggleContinent(continent)}
                className="w-full flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0EA5E9]/30 transition-colors mb-3"
              >
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Globe className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-serif font-bold text-[#0F172A]">{continent}</h2>
                    <span className="text-xs text-slate-400">({items.length} places)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden max-w-xs">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${visitedPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {cStats.visited}/{cStats.total} visited ({visitedPct}%)
                    </span>
                  </div>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Items grid */}
              {!isCollapsed && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const status = statuses[item.id];
                    const isVisited = status === 'visited';
                    const isWant = status === 'want';

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border p-4 transition-all ${
                          isVisited
                            ? 'border-green-300 bg-green-50/50'
                            : isWant
                            ? 'border-pink-300 bg-pink-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl flex-shrink-0">{item.countryFlag}</span>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/travel/country/${item.countrySlug}`}
                              className="text-[#0F172A] font-semibold hover:text-[#0EA5E9] transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">{item.country}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => toggleStatus(item.id, 'want')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isWant
                                ? 'bg-pink-100 text-pink-700 border border-pink-300'
                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-pink-300 hover:text-pink-600'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWant ? 'fill-pink-500' : ''}`} />
                            Want to go
                          </button>
                          <button
                            onClick={() => toggleStatus(item.id, 'visited')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isVisited
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-green-300 hover:text-green-600'
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isVisited ? 'fill-green-500 text-white' : ''}`} />
                            Visited
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">No places found</h3>
            <p className="text-slate-500">
              {filterMode !== 'all'
                ? 'No destinations in this category yet. Start adding some!'
                : 'Try a different search term.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
