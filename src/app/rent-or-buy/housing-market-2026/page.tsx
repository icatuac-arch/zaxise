import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 Housing Market Outlook — RentOrBuy',
  description: 'Interest rate trends, inventory forecasts, and what buyers and renters should expect from the 2026 housing market.',
};

export default function HousingMarket2026Page() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Market</span>
            <span className="text-xs text-white/70 flex items-center gap-1"><Calendar className="w-3 h-3" /> June 2026</span>
            <span className="text-xs text-white/70">6 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">2026 Housing Market Outlook</h1>
          <p className="text-white/90 text-lg">What trends, rates, and conditions buyers and renters should be watching this year.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Interest Rate Environment</h2>
          <p className="text-muted leading-relaxed mb-3">
            After years of elevated mortgage rates following the post-pandemic inflation surge, 2026 has seen a gradual moderation. The Federal Reserve (the central bank that influences interest rates across the economy) has signaled a cautious easing approach, and 30-year fixed mortgage rates have settled in the mid-6% range for most of the year, down from peaks above 7.5% in late 2023 and early 2024. A &quot;30-year fixed&quot; means your interest rate stays the same for the entire 30-year loan — your monthly payment never changes due to rate fluctuations.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Most economists project rates could drift toward the high 5% to low 6% range by the end of 2026, though unexpected inflation data or geopolitical events could disrupt this trajectory. The consensus view is that sub-5% rates from the 2020-2021 era are unlikely to return in the foreseeable future, and buyers should plan accordingly.
          </p>
          <p className="text-muted leading-relaxed">
            For prospective buyers, the current rate environment creates an interesting dynamic: while rates are higher than recent lows, they remain below historical averages (the 50-year average is approximately 7.7%). The popular advice to &quot;marry the house, date the rate&quot; reflects the reality that you can refinance (replace your current mortgage with a new one at a lower interest rate) when rates drop, but home prices tend to rise over time.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Inventory and Supply</h2>
          <p className="text-muted leading-relaxed mb-3">
            Housing inventory (the number of homes available for sale) remains below pre-pandemic levels in most markets, though it has improved from the extreme lows of 2022-2023. The &quot;lock-in effect&quot; continues to constrain supply — millions of homeowners with mortgages at 3-4% are reluctant to sell and take on a new mortgage at current rates, reducing the number of existing homes on the market. In other words, why would you give up a $2,000/month payment to buy a similar home with a $3,200/month payment?
          </p>
          <p className="text-muted leading-relaxed mb-3">
            New construction has picked up, with builders increasingly targeting the entry-level market. However, new homes still represent a relatively small share of total sales, and construction costs (labor, materials, land, regulations) keep new home prices elevated. Many builders are offering rate buydowns (where the builder pays upfront to lower your mortgage interest rate for the first few years) and other incentives to attract buyers rather than reducing list prices.
          </p>
          <p className="text-muted leading-relaxed">
            The inventory picture varies dramatically by region. Sunbelt markets that saw massive price increases during the pandemic (Austin, Boise, Phoenix) have seen more inventory growth and price corrections, while supply-constrained markets (Northeast, West Coast) remain tight with continued price pressure.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Price Trends</h2>
          <p className="text-muted leading-relaxed mb-3">
            National home prices have continued to appreciate (increase in value) modestly, with median prices up roughly 3-4% year-over-year in early 2026. On a $400,000 home, that means the value grew by $12,000 to $16,000 over the past year. This pace is closer to the long-term historical average and a welcome normalization from the unsustainable double-digit increases of 2021-2022.
          </p>
          <p className="text-muted leading-relaxed">
            However, the market is increasingly bifurcated. Affordable homes in desirable locations continue to see strong demand and competition, while luxury properties and homes in overbuilt markets may face softening. Buyers in the $300,000 to $500,000 range in growing metro areas will likely face the most competition, while buyers with larger budgets may find more negotiating leverage.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">The Rental Market</h2>
          <p className="text-muted leading-relaxed mb-3">
            Rents have stabilized in many markets after significant increases in 2021-2023. A wave of new apartment construction, particularly in Sunbelt cities, has increased rental supply and moderated rent growth. National rent growth is running at approximately 2-3% annually, though some markets with high new supply are seeing flat or slightly declining rents.
          </p>
          <p className="text-muted leading-relaxed">
            For renters weighing whether to buy, the narrowing gap between rent growth and mortgage costs is making the rent-vs-buy calculation more nuanced. In markets where rent is significantly cheaper than buying (after accounting for tax benefits and equity building — equity is the portion of your home you actually own, which grows as you pay down the mortgage), the financial argument for continued renting remains strong, especially for those who would invest the savings.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">What Should You Do?</h2>
          <p className="text-muted leading-relaxed mb-3">
            Rather than trying to time the market, focus on your personal financial readiness. Can you afford the total cost of homeownership without stretching your budget? Do you have adequate savings beyond the down payment? Are you likely to stay in the area for at least 5-7 years? Is your job situation stable?
          </p>
          <p className="text-muted leading-relaxed">
            If you answer yes to these questions and find a home you love at a price you can afford, current market conditions should not be a deterrent. If you need to stretch beyond your comfort zone to buy, consider waiting while you build more savings and hope for better conditions. The best time to buy is when you are financially ready, not when a headline tells you to.
          </p>
        </section>
      </div>

      <AdBanner />

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Run Your Numbers
        </Link>
        <Link href="/blog" className="btn-secondary inline-flex items-center gap-2">
          More Articles
        </Link>
      </div>
    </div>
  );
}
