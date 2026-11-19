"use client";

import { useEffect, useState } from "react";

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
}

const CATEGORY_BG: Record<string, string> = {
  Phones: "#eee9ff",
  TVs: "#dcf6ef",
  Audio: "#fff0e6",
  Laptops: "#e4edff",
  Gaming: "#ffe8f1",
  Monitors: "#dcf6ef",
  Wearables: "#fff0e6",
  Cameras: "#eee9ff",
};

function formatPrice(n: number): string {
  if (n === 0) return "$0";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 === 0 ? 0 : 2 });
}

export default function DealsPane() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/top-deals")
      .then((r) => r.json())
      .then((data) => setDeals(data.deals || []))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="deals"
      className="rounded-[20px] border border-[#ebebf3] bg-white p-[21px]"
      style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="text-[20px] font-[750] leading-[1.25]"
            style={{ letterSpacing: "-0.5px" }}
          >
            Tech deals worth exploring
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Find more value in everyday tech
          </p>
        </div>
        <a
          href="/deals"
          className="shrink-0 text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
        >
          View all →
        </a>
      </div>

      {/* Feed label */}
      <div className="flex justify-between gap-2.5 mt-3 mb-1 text-[10px] tracking-[0.06em] text-[#77758a]">
        <span>TODAY&apos;S TOP DEALS</span>
        <span>Verified daily prices</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[13px] text-muted">
          Loading deals...
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d9c9ae] bg-[#fcfaf5] p-5 mt-2">
          <div className="text-[11px] font-[800] uppercase tracking-[2px] text-[#087d70]">
            Deal feed status
          </div>
          <b className="mt-2 block text-lg">Something good is coming.</b>
          <p className="mt-2 text-[13px] text-muted">
            New verified tech offers will appear here daily.
          </p>
        </div>
      ) : (
        <div>
          {deals.slice(0, 4).map((deal) => (
            <a
              key={deal.id}
              href={deal.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-[11px] border-b border-[#ebeaf2] min-h-[76px] transition-colors hover:bg-[#fafafe] -mx-1 px-1 rounded-lg"
            >
              <div
                className="w-[60px] h-[60px] rounded-[14px] grid place-items-center shrink-0 overflow-hidden"
                style={{ background: CATEGORY_BG[deal.category] || "#eee9ff" }}
              >
                {deal.image_url ? (
                  <img
                    src={deal.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[20px]">🏷️</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <b className="block text-[14px] leading-snug line-clamp-1">
                  {deal.product_name}
                </b>
                <small className="block text-[12px] text-[#77758a] mt-[3px]">
                  {deal.retailer} · {deal.category}
                </small>
                <strong className="text-[15px] text-[#25243b]">
                  {formatPrice(deal.price_current)}{" "}
                  {deal.price_list > deal.price_current && (
                    <del className="text-[12px] font-normal text-[#999]">
                      {formatPrice(deal.price_list)}
                    </del>
                  )}
                </strong>
              </div>
              {deal.discount_pct > 0 && (
                <span
                  className="ml-auto shrink-0 whitespace-nowrap rounded-[20px] px-2 py-[5px] text-[11px] text-[#087d64]"
                  style={{ background: "#e0f8ef" }}
                >
                  {Math.round(deal.discount_pct)}% off
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      <a
        href="/deals"
        className="mt-3 inline-block text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
      >
        Browse all tech deals →
      </a>
    </section>
  );
}
