"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  TrendingDown,
  ExternalLink,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Deal {
  id: string;
  product_name: string;
  brand: string;
  retailer: string;
  category: string;
  product_url: string;
  image_url: string;
  price_current: number;
  price_list: number;
  discount_pct: number;
  is_historical_low: boolean;
  tier: number;
}

export default function DealsPane() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top deals from our own Supabase
    fetch("/api/portal/top-deals")
      .then((r) => r.json())
      .then((data) => setDeals(data.deals || []))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (n: number) =>
    n === 0
      ? "$0"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: n % 1 === 0 ? 0 : 2,
        }).format(n);

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Today&apos;s Top Deals</h2>
            <p className="text-xs text-muted">Verified daily tech deals</p>
          </div>
        </div>
        <a
          href="/deals"
          className="flex items-center gap-1 text-xs font-medium text-accent-light hover:text-white transition-colors"
        >
          See all <ChevronRight className="h-3 w-3" />
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : deals.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted">
          Deals will appear here once the first daily feed is pushed.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {deals.slice(0, 6).map((deal, i) => (
            <motion.a
              key={deal.id}
              href={deal.product_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex gap-3 rounded-xl border border-border bg-surface p-3 transition-all hover:border-yellow-500/30 hover:bg-surface-hover"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 flex items-center justify-center p-1">
                <img
                  src={deal.image_url}
                  alt={deal.product_name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
                {deal.is_historical_low && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
                    <TrendingDown className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <p className="text-xs text-muted">{deal.retailer}</p>
                <h3 className="text-sm font-semibold leading-snug line-clamp-1">
                  {deal.product_name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-emerald-400">
                    {formatPrice(deal.price_current)}
                  </span>
                  {deal.price_list > deal.price_current && (
                    <span className="text-xs text-muted line-through">
                      {formatPrice(deal.price_list)}
                    </span>
                  )}
                  {deal.discount_pct > 0 && (
                    <span className="text-xs font-bold text-red-400">
                      -{Math.round(deal.discount_pct)}%
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 self-center text-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          ))}
        </div>
      )}

      <a
        href="/deals"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted transition-all hover:border-yellow-500/30 hover:text-yellow-400"
      >
        Browse all verified deals
        <ChevronRight className="h-4 w-4" />
      </a>
    </section>
  );
}
