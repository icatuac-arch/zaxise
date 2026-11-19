'use client';

import { sampleDeals } from '@/lib/deals-community/sampleDeals';

function getSavingsPercent(original: number, sale: number) {
  return Math.round(((original - sale) / original) * 100);
}

export default function LiveDealTicker() {
  const tickerItems = sampleDeals.map((deal) => {
    const savings = getSavingsPercent(deal.originalPrice, deal.salePrice);
    return {
      text: `${deal.title.split(' \u{2014} ')[0]}`,
      price: `$${deal.salePrice}`,
      store: deal.store,
      savings: `${savings}% off`,
      time: deal.postedAt,
      isHot: deal.isHot,
    };
  });

  // Duplicate for seamless loop
  const allItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      <div className="flex items-center h-10">
        {/* Live badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-500 px-4 h-full z-10 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-wider">LIVE</span>
        </div>

        {/* Scrolling content */}
        <div className="flex animate-ticker whitespace-nowrap">
          {allItems.map((item, index) => (
            <span key={index} className="inline-flex items-center gap-2 px-6 text-xs font-medium">
              {item.isHot && <span className="text-amber-400">{'\u{1F525}'}</span>}
              <span className="text-slate-100">{item.text}</span>
              <span className="text-amber-400 font-bold">{item.price}</span>
              <span className="text-slate-400">at {item.store}</span>
              <span className="text-emerald-400 font-semibold">({item.savings})</span>
              <span className="text-slate-500">{'\u{2022}'} {item.time}</span>
              <span className="text-slate-700 mx-2">{'\u{2502}'}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 90s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
