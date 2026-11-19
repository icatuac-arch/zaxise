'use client';

import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageCircle, ExternalLink, Clock, Flame } from 'lucide-react';
import { FEATURES } from '@/lib/deals-community/features';

export interface Deal {
  id: string;
  title: string;
  store: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  url: string;
  dealScore: number;
  votes: number;
  comments: number;
  postedAt: string;
  expiresAt: string;
  isHot: boolean;
  description?: string;
  priceHistory: { date: string; price: number }[];
  competitorPrices: { store: string; price: number; url: string }[];
  dealDNA: { reason: string; confidence: 'high' | 'medium' | 'low' };
  stackable: { type: string; savings: string }[];
  lowestEver: boolean;
}

function getDealScoreColor(score: number) {
  if (score >= 8) return 'bg-deal-green text-white';
  if (score >= 5) return 'bg-deal-gold text-white';
  return 'bg-gray-400 text-white';
}

function getSavingsPercent(original: number, sale: number) {
  return Math.round(((original - sale) / original) * 100);
}

function getCategoryBorderClass(category: string) {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'electronics': return 'cat-electronics';
    case 'fashion': return 'cat-fashion';
    case 'home': return 'cat-home';
    case 'gaming': return 'cat-gaming';
    case 'travel': return 'cat-travel';
    case 'food': return 'cat-food';
    case 'fitness': return 'cat-fitness';
    case 'books': return 'cat-books';
    case 'kids': return 'cat-kids';
    default: return '';
  }
}

export default function DealCard({ deal }: { deal: Deal }) {
  const savings = getSavingsPercent(deal.originalPrice, deal.salePrice);

  return (
    <div className={`group relative bg-white border border-card-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-primary/20 ${getCategoryBorderClass(deal.category)}`}>
      {/* Image / Placeholder */}
      <div className="relative h-52 bg-alt-bg overflow-hidden">
        {deal.image ? (
          <>
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="card-image-overlay absolute inset-0 pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-5xl opacity-20">
              {deal.category === 'Electronics' ? '\u{1F4F1}' :
               deal.category === 'Fashion' ? '\u{1F45F}' :
               deal.category === 'Home' ? '\u{1F3E0}' :
               deal.category === 'Gaming' ? '\u{1F3AE}' :
               deal.category === 'Travel' ? '\u{2708}\u{FE0F}' :
               deal.category === 'Food' ? '\u{1F37D}\u{FE0F}' :
               deal.category === 'Fitness' ? '\u{1F3CB}\u{FE0F}' :
               deal.category === 'Books' ? '\u{1F4DA}' :
               deal.category === 'Kids' ? '\u{1F9F8}' : '\u{1F4E6}'}
            </span>
          </div>
        )}

        {/* Store Badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-text-heading text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {deal.store}
        </span>

        {/* Savings Badge */}
        <span className="absolute top-3 right-3 bg-deal-green text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
          {savings}% OFF
        </span>

        {/* Hot / Expiring Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {deal.isHot && (
            <span className="flex items-center gap-1 bg-deal-red text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Flame className="w-3 h-3" /> HOT
            </span>
          )}
          {deal.expiresAt && (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Clock className="w-3 h-3" /> {deal.expiresAt}
            </span>
          )}
        </div>

        {/* Lowest Ever Badge */}
        {deal.lowestEver && (
          <span className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            Lowest Ever
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-primary text-xs font-semibold uppercase tracking-wide">
          {deal.category}
        </span>

        {/* Title */}
        <Link href={`/deal/${deal.id}`}>
          <h3 className="text-text-heading font-bold text-sm mt-1 line-clamp-2 leading-snug hover:text-primary transition-colors">
            {deal.title}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-deal-red text-xl font-extrabold">
            ${deal.salePrice}
          </span>
          <span className="text-text-muted text-sm line-through">
            ${deal.originalPrice}
          </span>
          <span className="text-deal-green text-sm font-bold ml-auto">
            Save ${deal.originalPrice - deal.salePrice}
          </span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border">
          {/* Votes */}
          {FEATURES.VOTING && (
          <div className="flex items-center gap-1">
            <button className="p-1 hover:text-deal-green transition-colors text-text-muted" aria-label="Upvote">
              <ArrowUp className="w-4 h-4" />
            </button>
            <span className="text-text-heading text-xs font-bold min-w-[2ch] text-center">
              {deal.votes}
            </span>
            <button className="p-1 hover:text-deal-red transition-colors text-text-muted" aria-label="Downvote">
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          )}

          {/* Deal Score */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${getDealScoreColor(deal.dealScore)}`}
            title={`Deal Score: ${deal.dealScore}`}
          >
            {deal.dealScore}
          </div>

          {/* Comments */}
          {FEATURES.COMMENTS && (
          <Link
            href={`/deal/${deal.id}#comments`}
            className="flex items-center gap-1 text-text-muted hover:text-text-body transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{deal.comments}</span>
          </Link>
          )}

          {/* Time */}
          <span className="text-text-muted text-xs">{deal.postedAt}</span>

          {/* Get Deal Button */}
          <Link
            href={`/deal/${deal.id}`}
            className="flex items-center gap-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            View Deal <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
