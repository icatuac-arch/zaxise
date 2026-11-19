import { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import DealsBoard from "@/components/deals/DealsBoard";
import type { TechDeal } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Tech Deals — Verified Daily Deals on Electronics | Zaxise",
  description:
    "Verified tech deals updated daily. Phones, TVs, laptops, audio, gaming, and more — every price checked on the retailer's own page.",
};

async function getLatestDeals(): Promise<{
  deals: TechDeal[];
  feedDate: string;
  lastVerified: string | null;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { deals: [], feedDate: "", lastVerified: null };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: feedData } = await supabase
    .from("tech_deals_feeds")
    .select("feed_date")
    .order("feed_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!feedData) {
    return { deals: [], feedDate: "", lastVerified: null };
  }

  const feedDate = feedData.feed_date;

  const { data: deals } = await supabase
    .from("tech_deals")
    .select("*")
    .eq("feed_date", feedDate)
    .order("tier", { ascending: true });

  if (!deals || deals.length === 0) {
    return { deals: [], feedDate, lastVerified: null };
  }

  const lastVerified = deals.reduce<string | null>((latest, deal) => {
    if (!deal.last_verified_at) return latest;
    if (!latest) return deal.last_verified_at;
    return deal.last_verified_at > latest ? deal.last_verified_at : latest;
  }, null);

  return {
    deals: deals as TechDeal[],
    feedDate,
    lastVerified,
  };
}

async function DealsContent() {
  const { deals, feedDate, lastVerified } = await getLatestDeals();

  if (deals.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line bg-white py-20 text-center">
          <p className="text-4xl mb-4">🏷️</p>
          <h1 className="text-2xl font-bold text-navy">
            Tech Deals Coming Soon
          </h1>
          <p className="mt-2 text-muted">
            Verified daily tech deals will appear here once the first feed is
            pushed. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <DealsBoard
        deals={deals}
        feedDate={feedDate}
        lastVerified={lastVerified}
      />
    </div>
  );
}

function DealsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="animate-pulse rounded-2xl border border-line bg-white py-20 text-center">
        <p className="text-muted">Loading deals...</p>
      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Suspense fallback={<DealsLoading />}>
        <DealsContent />
      </Suspense>
    </div>
  );
}
