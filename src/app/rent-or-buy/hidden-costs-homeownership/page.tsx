import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hidden Costs of Homeownership Most Buyers Miss — RentOrBuy',
  description: 'The expenses that catch first-time homeowners off guard: maintenance, repairs, utilities, opportunity cost, and more.',
};

export default function HiddenCostsPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Costs</span>
            <span className="text-xs text-white/70 flex items-center gap-1"><Calendar className="w-3 h-3" /> June 2026</span>
            <span className="text-xs text-white/70">5 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Hidden Costs of Homeownership Most Buyers Miss</h1>
          <p className="text-white/90 text-lg">The expenses beyond the mortgage that can add $10,000+ per year to the true cost of owning a home.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Maintenance and Repairs</h2>
          <p className="text-muted leading-relaxed mb-3">
            The general rule of thumb is to budget 1% to 2% of your home&apos;s value annually for maintenance and repairs. On a $500,000 home, that is $5,000 to $10,000 per year, or $417 to $833 per month. This is money most first-time buyers do not account for in their monthly housing budget.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Some years you may spend very little. Other years, a single repair can cost thousands. A new roof runs $8,000 to $15,000. Replacing an HVAC system (your heating, ventilation, and air conditioning — the equipment that keeps your home warm in winter and cool in summer) costs $5,000 to $12,000. A water heater replacement is $1,000 to $3,000. Sewer line repairs can reach $5,000 to $20,000. These are not if-they-happen expenses — they are when-they-happen expenses.
          </p>
          <p className="text-muted leading-relaxed">
            Older homes typically require more maintenance. A 50-year-old home with original systems will demand significantly more investment than a new construction property. When buying, factor the age and condition of major systems (roof, HVAC, plumbing, electrical) into your long-term cost projections.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Higher Utility Costs</h2>
          <p className="text-muted leading-relaxed mb-3">
            Homeowners typically pay more for utilities than renters, even for comparable-sized spaces. Houses generally have more square footage to heat and cool, less insulation than modern apartments, and separate systems for water heating. The average American homeowner pays $300 to $500 per month in utilities, compared to $150 to $250 for renters.
          </p>
          <p className="text-muted leading-relaxed">
            Additional utility costs that surprise new homeowners include water and sewer charges (often included in rent), trash collection, lawn watering in summer, and higher electricity bills from running a full household. If you are moving from an apartment to a house, expect your utility costs to increase by 30% to 60%.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Property Tax Increases</h2>
          <p className="text-muted leading-relaxed mb-3">
            While your mortgage payment is fixed (on a fixed-rate loan), your property taxes are not. Local governments can and do raise tax rates, and your home&apos;s assessed value (what the local government says your home is worth for tax purposes) typically increases over time, further increasing your tax bill. In many areas, property taxes increase by 2% to 5% annually.
          </p>
          <p className="text-muted leading-relaxed">
            On a $500,000 home with a 1.1% tax rate, you start at $5,500 per year ($458/month). If the assessed value grows 3% annually and the tax rate stays the same, in 10 years you would be paying over $7,300 per year ($612/month) — an increase of $154 per month. If the tax rate also increases, the impact is compounded.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Insurance Cost Increases</h2>
          <p className="text-muted leading-relaxed mb-3">
            Homeowner&apos;s insurance premiums have been rising significantly, particularly in disaster-prone areas. Climate-related events (hurricanes, wildfires, flooding) have pushed insurance costs up 20% to 50% or more in some regions over the past few years. In extreme cases, insurers have pulled out of certain markets entirely.
          </p>
          <p className="text-muted leading-relaxed">
            If you are buying in a flood zone, earthquake-prone area, or wildfire-risk region, factor in substantially higher insurance costs and the potential for further increases. Supplemental policies (flood insurance, earthquake insurance) can add $1,000 to $5,000+ annually to your costs.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Opportunity Cost</h2>
          <p className="text-muted leading-relaxed mb-3">
            Perhaps the most overlooked hidden cost is the opportunity cost of the money locked in your home. Opportunity cost means what you give up by choosing one option over another. Your down payment, closing costs (the fees you pay when you finalize a home purchase — things like lender fees, title insurance, and appraisal costs, typically 2-5% of the home price), and ongoing equity (the portion of the home you own outright) are money that could be invested elsewhere. If you put $100,000 down and the stock market returns 7% annually (meaning $100,000 grows to about $197,000 after 10 years), the opportunity cost over that decade is roughly $97,000 in investment gains you missed out on.
          </p>
          <p className="text-muted leading-relaxed">
            Of course, your home may also appreciate (go up in value), and the leverage of a mortgage (the fact that you control a $500,000 asset with only $100,000 of your own money) amplifies your return on the down payment. But the opportunity cost is real and should be part of your analysis. Our calculator accounts for this by comparing the renter&apos;s investment portfolio growth against the buyer&apos;s equity accumulation.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Time and Effort</h2>
          <p className="text-muted leading-relaxed mb-3">
            Homeownership requires significant time investment that renters do not face. Yard work, gutter cleaning, snow removal, appliance maintenance, contractor management, and DIY repairs consume hours every week. If you value your time, this is a meaningful cost that should factor into your decision.
          </p>
          <p className="text-muted leading-relaxed">
            You can outsource much of this work, but that adds to the financial cost. A lawn service runs $100 to $300 per month. A house cleaner costs $150 to $400 per visit. Snow removal, gutter cleaning, and pest control add more. The convenience of renting — calling the landlord when something breaks — has real financial and lifestyle value.
          </p>
        </section>
      </div>

      <AdBanner />

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Calculate True Costs
        </Link>
        <Link href="/blog" className="btn-secondary inline-flex items-center gap-2">
          More Articles
        </Link>
      </div>
    </div>
  );
}
