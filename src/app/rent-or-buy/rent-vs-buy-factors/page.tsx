import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent vs Buy: Key Factors — RentOrBuy',
  description: 'The key factors in the rent vs buy decision: time horizon, market conditions, opportunity cost, tax benefits, flexibility, and emotional considerations.',
};

export default function RentVsBuyFactorsPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rent-or-buy/guides" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Strategy</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Rent vs Buy: Key Factors</h1>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            The rent vs. buy decision is not just about monthly payments. It involves time horizon, opportunity cost, market conditions, lifestyle preferences, and emotional factors.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Time Horizon: The Most Important Factor</h2>
          <p className="text-muted leading-relaxed mb-3">
            How long you plan to stay in one place is arguably the single most important factor in the rent vs. buy decision. Buying a home involves significant transaction costs — closing costs on purchase (2-5% of price, or $10,000-$25,000 on a $500,000 home), closing costs on sale (5-8% of price), and moving expenses. These costs create a hurdle that takes years of appreciation (the increase in your home&apos;s value over time) and equity building (the portion of your home you actually own, which grows as you pay down the mortgage and as the home&apos;s value increases) to overcome.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            In most markets, you need to stay in a home for at least 5 to 7 years before buying becomes financially advantageous over renting. In high-cost markets with slow appreciation, the breakeven point can be 7 to 10 years or longer. Use our calculator to determine your specific breakeven timeline based on your local market conditions.
          </p>
          <p className="text-muted leading-relaxed">
            If you expect to move within 3 years for career, family, or lifestyle reasons, renting is almost always the better financial choice. If you plan to stay 10+ years, buying usually wins — assuming you buy within your means and the local market is not dramatically overvalued.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Market Conditions and Timing</h2>
          <p className="text-muted leading-relaxed mb-3">
            Local market conditions significantly impact the rent vs. buy equation. The price-to-rent ratio (home price divided by annual rent for a comparable property) is a useful metric. When this ratio is below 15, buying is generally favorable. Between 15 and 20, the decision is closer. Above 20, renting often makes more financial sense.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            However, timing the market is extremely difficult. The same experts who warned of a housing bubble in 2020 were proven wrong as prices surged. While you should not buy at the peak of a clearly overheated market, waiting for a crash that never comes means years of rising rents and lost equity building.
          </p>
          <p className="text-muted leading-relaxed">
            Interest rates also play a major role. At 3% rates, buying was financially compelling almost everywhere. At 7%, the math becomes much more challenging. But rates can be refinanced when they drop, while purchase prices locked in during high-rate periods often represent better values since higher rates reduce competition and price growth.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Opportunity Cost of the Down Payment</h2>
          <p className="text-muted leading-relaxed mb-3">
            A frequently overlooked factor is the opportunity cost of your down payment. A $100,000 down payment tied up in home equity could alternatively be invested in a diversified stock portfolio. Historically, the stock market has returned roughly 10% annually before inflation (about 7% real return), while home prices have appreciated roughly 3-4% annually.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            However, this comparison is not quite fair. Homeownership provides leverage (using borrowed money to amplify your returns) — with 20% down, you control an asset worth 5 times your investment. If a $500,000 home appreciates 3% ($15,000), that is a 15% return on your $100,000 down payment. And you would have paid rent regardless, so the equity (ownership stake) you build through mortgage payments is partially replacing rent expense.
          </p>
          <p className="text-muted leading-relaxed">
            The opportunity cost argument favors renting in markets where the price-to-rent ratio is high and when expected investment returns are strong. It favors buying in affordable markets and when the monthly cost of buying (after tax deductions) is close to or less than renting.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Tax Benefits of Homeownership</h2>
          <p className="text-muted leading-relaxed mb-3">
            Homeowners can deduct mortgage interest and property taxes on their federal income tax returns, but only if they itemize deductions (meaning you list individual tax breaks instead of taking the single lump-sum &quot;standard deduction&quot; that everyone gets). Since the Tax Cuts and Jobs Act of 2017 nearly doubled the standard deduction (to $15,700 for single filers and $31,400 for married filing jointly in 2026), many homeowners now find that the standard deduction exceeds their itemized deductions, reducing or eliminating this tax benefit of owning a home.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            The mortgage interest deduction is limited to interest on up to $750,000 of mortgage debt, and the property tax deduction is capped at $10,000 combined with state and local income taxes (known as the SALT cap — State And Local Tax deduction limit). These limits mean the tax benefit is most valuable for homeowners with large mortgages in high-tax states who have other significant itemized deductions.
          </p>
          <p className="text-muted leading-relaxed">
            Another significant tax benefit is the capital gains exclusion on your primary residence. Capital gains are the profit you make when you sell something for more than you paid — for example, if you bought a home for $400,000 and sell it for $650,000, your capital gain is $250,000. When you sell your primary home, you can exclude up to $250,000 of that profit (single) or $500,000 (married filing jointly) from capital gains tax, provided you have lived in the home for at least two of the past five years. This is a substantial benefit that renters do not receive on their investment gains.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Flexibility and Lifestyle</h2>
          <p className="text-muted leading-relaxed mb-3">
            Renting offers flexibility that homeownership cannot match. Moving for a job opportunity, downsizing after a life change, or relocating to a different city is dramatically simpler when renting. A lease ending is weeks of logistics; selling a home involves months of preparation, showing, negotiation, and closing.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Renting also eliminates maintenance responsibilities. When the dishwasher breaks, you call the landlord. When the roof leaks, it is not your problem. This is not just a financial benefit — it is a lifestyle one. Some people genuinely do not want the responsibilities of homeownership, and that is a perfectly valid preference.
          </p>
          <p className="text-muted leading-relaxed">
            On the other hand, owning provides stability. You cannot be evicted because a landlord decides to sell. You can renovate, paint, have pets, and make the space truly yours. For families with school-age children, the stability of homeownership in a good school district is often a primary motivation.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Emotional and Psychological Factors</h2>
          <p className="text-muted leading-relaxed mb-3">
            The financial analysis is important, but human beings are not spreadsheets. Homeownership carries deep emotional significance for many people — pride of ownership, a sense of community, stability for children, and the freedom to create a space that is truly yours. These intangible benefits have real value even if they do not appear on a balance sheet.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Homeownership also serves as a forced savings mechanism. Many people who would never discipline themselves to invest the difference between renting and buying will faithfully make their mortgage payment. Over 30 years, this forced savings builds substantial wealth through equity accumulation, even if the rate of return is lower than the stock market.
          </p>
          <p className="text-muted leading-relaxed">
            However, the pressure of a large mortgage can cause stress, limit career flexibility (you cannot easily take a lower-paying dream job), and reduce your ability to take risks. The emotional benefits of ownership must be weighed against the emotional costs of financial constraint and maintenance obligations.
          </p>
        </section>
      </div>

      <AdBanner />

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-dark mb-2">What does this mean for you?</h2>
        <p className="text-muted leading-relaxed">
          There is no universally &quot;right&quot; answer to rent vs. buy — it depends on your situation. The biggest question is: <strong>how long will you stay?</strong> If less than 5 years, renting usually wins financially. If more than 7 years, buying usually comes out ahead. In between, it depends on your local market. Use our calculator to run the numbers for your specific situation, and remember that lifestyle factors — stability, flexibility, maintenance responsibility — matter just as much as the math.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Run the Numbers
        </Link>
        <Link href="/rent-or-buy/guides" className="btn-secondary inline-flex items-center gap-2">
          All Guides
        </Link>
      </div>
    </div>
  );
}
