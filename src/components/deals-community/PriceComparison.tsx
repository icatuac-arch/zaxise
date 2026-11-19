'use client';

import { ExternalLink, Check } from 'lucide-react';

interface CompetitorPrice {
  store: string;
  price: number;
  url: string;
}

interface PriceComparisonProps {
  competitorPrices: CompetitorPrice[];
  currentStore: string;
  currentPrice: number;
}

export default function PriceComparison({ competitorPrices, currentStore, currentPrice }: PriceComparisonProps) {
  if (!competitorPrices || competitorPrices.length === 0) return null;

  // Combine current store with competitors
  const allPrices = [
    { store: currentStore, price: currentPrice, url: '#', isCurrent: true },
    ...competitorPrices.map((cp) => ({ ...cp, isCurrent: false })),
  ].sort((a, b) => a.price - b.price);

  const cheapest = allPrices[0].price;
  const mostExpensive = allPrices[allPrices.length - 1].price;
  const maxSavings = mostExpensive - cheapest;

  return (
    <div className="bg-white border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-heading text-lg font-bold">Price Comparison</h3>
        <span className="text-text-muted text-xs">
          Save up to <span className="text-deal-green font-bold">${maxSavings}</span> by choosing wisely
        </span>
      </div>

      <div className="space-y-3">
        {allPrices.map((item, index) => {
          const isCheapest = index === 0;
          const savingsVsMostExpensive = mostExpensive - item.price;

          return (
            <div
              key={item.store}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                item.isCurrent
                  ? 'border-primary/30 bg-blue-50/50'
                  : isCheapest
                  ? 'border-deal-green/30 bg-green-50/30'
                  : 'border-card-border bg-white'
              }`}
            >
              {/* Rank / Check */}
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                {isCheapest ? (
                  <span className="w-8 h-8 bg-deal-green text-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="w-8 h-8 bg-alt-bg text-text-muted rounded-full flex items-center justify-center text-xs font-bold">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Store name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-text-heading text-sm font-bold">{item.store}</span>
                  {item.isCurrent && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      YOU&apos;RE HERE
                    </span>
                  )}
                  {isCheapest && (
                    <span className="bg-deal-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      BEST PRICE
                    </span>
                  )}
                </div>
                {savingsVsMostExpensive > 0 && (
                  <span className="text-deal-green text-xs font-medium">
                    Save ${savingsVsMostExpensive} vs highest
                  </span>
                )}
              </div>

              {/* Price */}
              <span className={`text-lg font-extrabold shrink-0 ${isCheapest ? 'text-deal-green' : 'text-text-heading'}`}>
                ${item.price}
              </span>

              {/* Get Deal button */}
              {!item.isCurrent && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                >
                  Get Deal <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
