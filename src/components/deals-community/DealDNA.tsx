'use client';

import { Zap, TrendingDown, Shield, Clock } from 'lucide-react';

interface DealDNAProps {
  dealDNA: {
    reason: string;
    confidence: 'high' | 'medium' | 'low';
  };
  lowestEver: boolean;
  priceHistory: { date: string; price: number }[];
  currentPrice: number;
}

function getReasonIcon(reason: string) {
  const r = reason.toLowerCase();
  if (r.includes('clearance') || r.includes('seasonal')) return TrendingDown;
  if (r.includes('flash') || r.includes('lightning')) return Zap;
  if (r.includes('match') || r.includes('guarantee')) return Shield;
  return Clock;
}

function getConfidenceStyle(confidence: 'high' | 'medium' | 'low') {
  switch (confidence) {
    case 'high':
      return { bg: 'bg-deal-green', text: 'text-deal-green', border: 'border-l-deal-green', label: 'High Confidence' };
    case 'medium':
      return { bg: 'bg-deal-gold', text: 'text-deal-gold', border: 'border-l-deal-gold', label: 'Medium Confidence' };
    case 'low':
      return { bg: 'bg-deal-red', text: 'text-deal-red', border: 'border-l-deal-red', label: 'Low Confidence' };
  }
}

export default function DealDNA({ dealDNA, lowestEver, priceHistory, currentPrice }: DealDNAProps) {
  if (!dealDNA) return null;

  const Icon = getReasonIcon(dealDNA.reason);
  const conf = getConfidenceStyle(dealDNA.confidence);

  // Build historical context
  const historicalNotes: string[] = [];
  if (priceHistory && priceHistory.length >= 2) {
    const lastMonth = priceHistory[priceHistory.length - 2];
    if (lastMonth) {
      historicalNotes.push(`This item was $${lastMonth.price} last month`);
    }
    const prices = priceHistory.map((p) => p.price);
    const allTimeLow = Math.min(...prices);
    const allTimeHigh = Math.max(...prices);
    if (allTimeHigh !== allTimeLow) {
      historicalNotes.push(`Price range: $${allTimeLow} - $${allTimeHigh} over 6 months`);
    }
  }

  return (
    <div className={`bg-white border border-card-border rounded-xl overflow-hidden border-l-4 ${conf.border}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-heading text-lg font-bold flex items-center gap-2">
            <span className="text-lg">🧬</span> Deal DNA
          </h3>
          <span className={`${conf.bg} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {conf.label}
          </span>
        </div>

        {/* Main Reason */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg ${conf.bg}/10 flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${conf.text}`} />
          </div>
          <div>
            <p className="text-text-heading font-semibold text-sm">Why this deal is good</p>
            <p className="text-text-body text-sm mt-0.5">{dealDNA.reason}</p>
          </div>
        </div>

        {/* Lowest Ever Flag */}
        {lowestEver && (
          <div className="flex items-center gap-2 bg-green-50 border border-deal-green/20 rounded-lg px-4 py-3 mb-4">
            <span className="text-lg">🏆</span>
            <div>
              <p className="text-deal-green font-bold text-sm">Lowest Price Ever Recorded</p>
              <p className="text-text-muted text-xs">We&apos;ve never seen this product cheaper. Buy with confidence.</p>
            </div>
          </div>
        )}

        {/* Historical Context */}
        {historicalNotes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-card-border">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">Historical Context</p>
            <ul className="space-y-1.5">
              {historicalNotes.map((note, i) => (
                <li key={i} className="flex items-center gap-2 text-text-body text-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  {note}
                </li>
              ))}
              {currentPrice && (
                <li className="flex items-center gap-2 text-deal-green text-sm font-medium">
                  <span className="w-1.5 h-1.5 bg-deal-green rounded-full shrink-0" />
                  Current price: ${currentPrice}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
