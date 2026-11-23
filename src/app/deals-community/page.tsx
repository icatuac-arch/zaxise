'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUp, ExternalLink, Flame, Clock, Mail } from 'lucide-react';
import DealCard from '@/components/deals-community/DealCard';
import { sampleDeals, categories, stores } from '@/lib/deals-community/sampleDeals';

type SortTab = 'hot' | 'new' | 'voted' | 'expiring';

function getCategoryPillStyle(slug: string) {
  switch (slug) {
    case 'electronics': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'fashion': return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'home': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'gaming': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'travel': return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'food': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'fitness': return 'bg-green-50 text-green-700 border-green-200';
    case 'books': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'kids': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-slate-900 text-white border-slate-800';
  }
}

function getStoreClass(name: string) {
  const key = name.toLowerCase().replace(/\s+/g, '');
  switch (key) {
    case 'amazon': return 'store-amazon';
    case 'bestbuy': return 'store-bestbuy';
    case 'walmart': return 'store-walmart';
    case 'target': return 'store-target';
    case 'nike': return 'store-nike';
    case 'apple': return 'store-apple';
    case 'ebay': return 'store-ebay';
    case 'macys': return 'store-macys';
    case 'doordash': return 'store-doordash';
    case 'alaskaairlines': return 'store-alaska';
    default: return 'bg-gradient-to-br from-slate-500 to-slate-700';
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<SortTab>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  const featuredDeal = sampleDeals.find((d) => d.dealScore >= 9.5) || sampleDeals[0];
  const featuredSavings = Math.round(
    ((featuredDeal.originalPrice - featuredDeal.salePrice) / featuredDeal.originalPrice) * 100
  );

  const sortedDeals = [...sampleDeals].sort((a, b) => {
    switch (activeTab) {
      case 'hot':
        return b.dealScore - a.dealScore;
      case 'new':
        return 0;
      case 'voted':
        return b.votes - a.votes;
      case 'expiring':
        return a.expiresAt.localeCompare(b.expiresAt);
      default:
        return 0;
    }
  });

  const tabs: { key: SortTab; label: string; emoji: string }[] = [
    { key: 'hot', label: 'Hottest', emoji: '\u{1F525}' },
    { key: 'new', label: 'Newest', emoji: '\u{1F195}' },
    { key: 'voted', label: 'Most Voted', emoji: '\u{1F451}' },
    { key: 'expiring', label: 'Ending Soon', emoji: '\u{23F0}' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-700 py-10 sm:py-14 px-4">
        {/* Shimmer overlay */}
        <div className="hero-shimmer absolute inset-0 pointer-events-none" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Find the Best{' '}
            <span className="text-amber-400">Deals</span>,{' '}
            Every Day
          </h1>
          <p className="mt-3 text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Discover deals on electronics, fashion, home, travel, and more — all in one place.
          </p>

          {/* Hero Search */}
          <div className="mt-5 max-w-xl mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search for deals, stores, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 !rounded-full !text-sm !bg-white !border-white/20 shadow-lg text-text-heading"
            />
          </div>

          {/* Stats */}
          <div className="mt-5 flex items-center justify-center gap-6 text-blue-200 text-xs sm:text-sm">
            <span className="font-semibold text-white">10,000+</span> Deals
            <span className="text-blue-400/50">|</span>
            <span className="font-semibold text-white">500+</span> Stores
            <span className="text-blue-400/50">|</span>
            <span className="font-semibold text-amber-300">100% Free</span>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug ? `/deals-community/category/${cat.slug}` : '/deals-community'}
                className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-sm font-semibold transition-all whitespace-nowrap shrink-0 hover:shadow-sm hover:scale-[1.03] ${getCategoryPillStyle(cat.slug)}`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-text-heading mb-6 flex items-center gap-2">
            Deal of the Day
          </h2>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
                {featuredDeal.image ? (
                  <>
                    <img
                      src={featuredDeal.image}
                      alt={featuredDeal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-blue-800">
                    <span className="text-8xl opacity-20">{'\u{1F4E6}'}</span>
                  </div>
                )}
                {featuredDeal.isHot && (
                  <span className="absolute top-4 left-4 flex items-center gap-1 bg-deal-red text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    <Flame className="w-4 h-4" /> HOT DEAL
                  </span>
                )}
                {featuredDeal.lowestEver && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Lowest Ever
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  {featuredDeal.store} &middot; {featuredDeal.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-snug">
                  {featuredDeal.title}
                </h3>

                <div className="flex items-baseline gap-4 mt-4">
                  <span className="text-4xl font-extrabold text-amber-400">
                    ${featuredDeal.salePrice}
                  </span>
                  <span className="text-xl text-slate-400 line-through">
                    ${featuredDeal.originalPrice}
                  </span>
                  <span className="bg-deal-green text-white text-sm font-extrabold px-3 py-1 rounded-full">
                    {featuredSavings}% OFF
                  </span>
                </div>

                <p className="text-emerald-400 text-lg font-bold mt-2">
                  You save ${featuredDeal.originalPrice - featuredDeal.salePrice}
                </p>

                <div className="flex items-center gap-4 mt-4 text-slate-300 text-sm">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4 text-emerald-400" /> {featuredDeal.votes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-400" /> {featuredDeal.expiresAt}
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/deals-community/deal/${featuredDeal.id}`}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg"
                  >
                    View Deal <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Hottest Deals */}
      <section className="px-4 mt-16 py-12 bg-alt-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-extrabold text-text-heading">
              Today&apos;s Hottest Deals
            </h2>
            <div className="flex gap-1 border-b border-card-border overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-text-body hover:border-slate-300'
                  }`}
                >
                  <span>{tab.emoji}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Stores */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-text-heading mb-6">
            Trending Stores
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stores.map((store) => (
              <Link
                key={store.name}
                href={`/deals-community/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center gap-2 px-6 py-4 bg-white border border-card-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all shrink-0 min-w-[120px] group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md ${getStoreClass(store.name)}`}>
                  {store.name.charAt(0)}
                </div>
                <span className="text-text-heading text-sm font-semibold group-hover:text-primary transition-colors">{store.name}</span>
                <span className="text-text-muted text-xs">{store.deals} deals</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup — disabled for now */}
    </div>
  );
}
