"use client";

import { useState, useRef, useEffect } from "react";
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
  Eye,
  EyeOff,
} from "lucide-react";
import {
  type TechDeal,
  isCarrierDeal,
  formatPrice,
  formatDate,
  getAgeLabel,
  getDealAgeDays,
  formatVerifiedShort,
  getVerdict,
  isWatchHintShown,
  markWatchHintShown,
} from "@/lib/deals";

interface DealCardProps {
  deal: TechDeal;
  isNew?: boolean;
  feedDate: string;
  isWatched?: boolean;
  onWatch?: (deal: TechDeal) => void;
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

export default function DealCard({ deal, isNew, feedDate, isWatched, onWatch }: DealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carrier = isCarrierDeal(deal);
  const savings = deal.price_list - deal.price_current;
  const verdict = getPriceVerdict(deal);
  const buyOrWait = getVerdict(deal, feedDate);
  const ageLabel = getAgeLabel(deal.first_posted_at, feedDate);
  const ageDays = getDealAgeDays(deal.first_posted_at, feedDate);
  const isNewToday = ageDays === 0;
  const isLastChance = ageDays >= 14;
  const verifiedShort = formatVerifiedShort(deal.last_verified_at);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E9DFE4] bg-white transition-all hover:border-[#801C45]/40 hover:shadow-xl hover:shadow-[#801C45]/10">
      {/* Image */}
      <div className="relative h-48 bg-[#F3E6ED] flex items-center justify-center p-4">
        <img
          src={proxyImg(deal.image_url)}
          alt={deal.product_name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isNewToday && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#801C45] px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              NEW TODAY
            </span>
          )}
          {isLastChance && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              LAST CHANCE
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

        {/* Watch button */}
        {onWatch && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatch(deal);
            }}
            onMouseEnter={() => {
              if (!isWatchHintShown()) {
                setShowHint(true);
                markWatchHintShown();
                hintTimeout.current = setTimeout(() => setShowHint(false), 3000);
              }
            }}
            onTouchStart={() => {
              if (!isWatchHintShown()) {
                setShowHint(true);
                markWatchHintShown();
                hintTimeout.current = setTimeout(() => setShowHint(false), 3000);
              }
            }}
            className={`absolute right-3 bottom-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-md transition-all ${
              isWatched
                ? "bg-[#801C45] text-white"
                : "bg-white/90 text-[#801C45] hover:bg-[#801C45]/10 backdrop-blur-sm"
            }`}
            title={isWatched ? "Stop watching" : "Watch this deal"}
          >
            {isWatched ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                Watching
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Watch
              </>
            )}
          </button>
        )}

        {/* Watch hint tooltip */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute right-3 bottom-12 z-20 rounded-lg bg-[#29232B] px-3 py-2 text-[11px] text-white shadow-lg max-w-[180px] leading-snug"
            >
              Watch it — we&apos;ll flag it here if the price drops.
              <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-[#29232B]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Retailer */}
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-[#801C45]/10 px-2.5 py-0.5 text-xs font-semibold text-[#801C45]">
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
          <span className="text-2xl font-extrabold text-emerald-600">
            {formatPrice(deal.price_current)}
          </span>
          {deal.price_list > deal.price_current && (
            <span className="text-sm text-muted line-through">
              {formatPrice(deal.price_list)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="mt-1 text-xs font-medium text-emerald-700/80">
            You save {formatPrice(savings)}
          </p>
        )}

        {/* Shipping & delivered cost */}
        {deal.shipping_cost != null && deal.shipping_cost > 0 && (
          <p className="mt-1 text-xs text-[#71646C]">
            🚚 +{formatPrice(deal.shipping_cost)} shipping
          </p>
        )}
        {deal.price_total != null && (
          <p className="mt-1 text-xs font-semibold text-[#29232B]">
            Delivered: {formatPrice(deal.price_total)}
            {deal.shipping_note ? (
              <span className="ml-1 font-normal text-[#71646C]">({deal.shipping_note})</span>
            ) : null}
          </p>
        )}

        {/* Price context line */}
        {deal.price_90d_low && deal.price_90d_low > 0 && (
          <p className="mt-1 text-[11px] text-[#71646C]">
            Lowest tracked: {formatPrice(deal.price_90d_low)}
            {deal.price_current <= deal.price_90d_low && (
              <span className="text-emerald-400"> — today&apos;s price is the lowest we&apos;ve seen</span>
            )}
          </p>
        )}

        {/* Buy or Wait verdict */}
        {buyOrWait && (
          <div
            className={`mt-2 flex items-start gap-1.5 rounded-lg px-3 py-2 text-xs font-medium leading-snug ${
              buyOrWait.color === 'green'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : buyOrWait.color === 'amber'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <span className="flex-shrink-0 mt-px">{buyOrWait.icon}</span>
            <span>{buyOrWait.label}</span>
          </div>
        )}

        {/* Carrier warning */}
        {carrier && (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
            Carrier terms apply — see details below
          </p>
        )}

        {/* Age + Verified meta */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          {deal.first_posted_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ageLabel}
              {verifiedShort && (
                <span className="text-[#71646C]"> · Verified {verifiedShort}</span>
              )}
            </span>
          )}
          {deal.in_stock && (
            <span className="flex items-center gap-1 text-emerald-600/80">
              <ShieldCheck className="h-3 w-3" />
              In stock
            </span>
          )}
        </div>

        {/* Expand/collapse for details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-[#801C45] transition-colors hover:text-[#631437]"
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
                    <p className="text-xs leading-relaxed text-[#29232B]">
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
                    <p className="text-xs text-[#71646C]">{deal.stock_note}</p>
                  </div>
                )}

                {/* Price history line */}
                <div>
                  <p className="mb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                    Price Context
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-[#F3E6ED] px-3 py-2">
                      <span className="text-muted">List price</span>
                      <span className="ml-2 font-semibold text-[#29232B]">
                        {formatPrice(deal.price_list)}
                      </span>
                    </div>
                    {deal.price_90d_low !== null && (
                      <div className="rounded-lg bg-[#F3E6ED] px-3 py-2">
                        <span className="text-muted">90-day low</span>
                        <span className="ml-2 font-semibold text-[#29232B]">
                          {formatPrice(deal.price_90d_low)}
                        </span>
                      </div>
                    )}
                    <div className="rounded-lg bg-[#F3E6ED] px-3 py-2">
                      <span className="text-muted">Yesterday</span>
                      <span className="ml-2 font-semibold text-[#29232B]">
                        {formatPrice(deal.price_previous)}
                      </span>
                    </div>
                    {deal.first_posted_at && (
                      <div className="rounded-lg bg-[#F3E6ED] px-3 py-2">
                        <span className="text-muted">First posted</span>
                        <span className="ml-2 font-semibold text-[#29232B]">
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
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#801C45] to-[#9E3D63] py-3 text-sm font-bold text-white shadow-lg shadow-[#801C45]/20 transition-all hover:shadow-[#801C45]/30 hover:brightness-110"
        >
          Get Deal
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
