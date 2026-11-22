"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { proxyImg } from "@/lib/imgProxy";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  type TechDeal,
  isCarrierDeal,
  formatPrice,
  formatDate,
} from "@/lib/deals";

interface DealCardProps {
  deal: TechDeal;
  isNew?: boolean;
}

function getPriceVerdict(deal: TechDeal): { label: string; color: string } | null {
  if (deal.is_historical_low) return { label: "LOWEST EVER", color: "bg-emerald-600 text-white" };
  if (deal.price_90d_low && deal.price_90d_low > 0 && deal.price_current <= deal.price_90d_low)
    return { label: "AT ITS LOW", color: "bg-emerald-500 text-white" };
  if (deal.price_previous && deal.price_current < deal.price_previous) {
    const drop = deal.price_previous - deal.price_current;
    return { label: `PRICE DROP ↓ ${formatPrice(drop)}`, color: "bg-blue-600 text-white" };
  }
  return null;
}

export default function DealCard({ deal, isNew }: DealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const carrier = isCarrierDeal(deal);
  const savings = deal.price_list - deal.price_current;
  const verdict = getPriceVerdict(deal);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-zinc-600 hover:shadow-xl hover:shadow-black/20">
      {/* Image */}
      <div className="relative h-48 bg-zinc-900 flex items-center justify-center p-4">
        <img
          src={proxyImg(deal.image_url)}
          alt={deal.product_name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              NEW
            </span>
          )}
          {verdict && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-lg ${verdict.color}`}>
              {verdict.label.startsWith("LOWEST") && <TrendingDown className="h-3 w-3" />}
              {verdict.label}
            </span>
          )}
          {carrier && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              <AlertTriangle className="h-3 w-3" />
              Carrier Terms
            </span>
          )}
        </div>

        {/* Discount badge */}
        {deal.discount_pct > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-sm font-bold text-white shadow-lg">
            -{Math.round(deal.discount_pct)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Retailer */}
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            {deal.retailer}
          </span>
          {deal.brand && (
            <span className="text-xs text-muted">{deal.brand}</span>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {deal.product_name}
        </h3>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-extrabold text-emerald-400">
            {formatPrice(deal.price_current)}
          </span>
          {deal.price_list > deal.price_current && (
            <span className="text-sm text-muted line-through">
              {formatPrice(deal.price_list)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="mt-1 text-xs font-medium text-emerald-400/80">
            You save {formatPrice(savings)}
          </p>
        )}

        {/* Price context line */}
        {deal.price_90d_low && deal.price_90d_low > 0 && (
          <p className="mt-1 text-[11px] text-zinc-400">
            Lowest tracked: {formatPrice(deal.price_90d_low)}
            {deal.price_current <= deal.price_90d_low && (
              <span className="text-emerald-400"> — today&apos;s price is the lowest we&apos;ve seen</span>
            )}
          </p>
        )}

        {/* Carrier warning */}
        {carrier && (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
            Carrier terms apply — see details below
          </p>
        )}

        {/* Meta */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          {deal.first_posted_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Posted {formatDate(deal.first_posted_at)}
            </span>
          )}
          {deal.in_stock && (
            <span className="flex items-center gap-1 text-emerald-400/70">
              <ShieldCheck className="h-3 w-3" />
              In stock
            </span>
          )}
        </div>

        {/* Expand/collapse for details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-light transition-colors hover:text-white"
        >
          {expanded ? (
            <>
              Hide details <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              View details <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                {/* Deal note — full text, never truncated (spec §5 rule 4) */}
                {deal.deal_note && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                      Deal Details
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {deal.deal_note}
                    </p>
                  </div>
                )}

                {/* Stock note */}
                {deal.stock_note && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                      Stock
                    </p>
                    <p className="text-xs text-zinc-400">{deal.stock_note}</p>
                  </div>
                )}

                {/* Price history line */}
                <div>
                  <p className="mb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                    Price Context
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                      <span className="text-muted">List price</span>
                      <span className="ml-2 font-semibold">
                        {formatPrice(deal.price_list)}
                      </span>
                    </div>
                    {deal.price_90d_low !== null && (
                      <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                        <span className="text-muted">90-day low</span>
                        <span className="ml-2 font-semibold">
                          {formatPrice(deal.price_90d_low)}
                        </span>
                      </div>
                    )}
                    <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                      <span className="text-muted">Yesterday</span>
                      <span className="ml-2 font-semibold">
                        {formatPrice(deal.price_previous)}
                      </span>
                    </div>
                    {deal.first_posted_at && (
                      <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                        <span className="text-muted">First posted</span>
                        <span className="ml-2 font-semibold">
                          {formatDate(deal.first_posted_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Get Deal button — always direct retailer link (spec §5 rule 1) */}
        <a
          href={deal.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:brightness-110"
        >
          Get Deal
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
