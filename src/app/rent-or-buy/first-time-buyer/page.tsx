import Link from 'next/link';
import { ArrowLeft, Home, CheckCircle } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'First-Time Home Buyer Guide — RentOrBuy',
  description: 'A comprehensive guide for first-time home buyers covering saving for a down payment, credit scores, pre-approval, finding a home, making an offer, and closing.',
};

export default function FirstTimeBuyerPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rent-or-buy/guides" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Essential</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">First-Time Home Buyer Guide</h1>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Buying your first home is exciting, complex, and one of the most significant financial decisions you will ever make. This guide walks you through every step.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 prose prose-slate max-w-none space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">1. Start by Saving for a Down Payment</h2>
          <p className="text-muted leading-relaxed mb-3">
            The down payment is the lump sum of cash you pay upfront toward the purchase price of your home — the rest is covered by your mortgage loan. While the traditional advice has been to put 20% down (that&apos;s $100,000 on a $500,000 home), many buyers purchase homes with significantly less. FHA loans (loans insured by the Federal Housing Administration, a government agency that helps people with lower credit scores or smaller savings become homeowners) require as little as 3.5% down (that&apos;s $17,500 on a $500,000 home), and some conventional loans accept 3% down. VA loans (loans backed by the Department of Veterans Affairs — available to military veterans and active-duty service members) and USDA loans (loans backed by the U.S. Department of Agriculture — available to buyers in eligible rural and suburban areas) offer 0% down options for eligible borrowers.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            However, putting less than 20% down comes with trade-offs. You will likely pay PMI (Private Mortgage Insurance — an extra monthly fee that protects the lender in case you stop making payments; it does not protect you). PMI typically costs 0.3% to 1.5% of the loan amount annually. On a $400,000 loan, that is $1,200 to $6,000 per year added to your housing costs. PMI is removed once you reach 20% equity (meaning you own at least 20% of your home&apos;s value, either through payments or price appreciation).
          </p>
          <p className="text-muted leading-relaxed">
            Strategies for saving include automating transfers to a high-yield savings account, reducing discretionary spending, considering down payment assistance programs in your state, and exploring gift funds from family (which most lenders allow with proper documentation).
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">2. Understand Your Credit Score</h2>
          <p className="text-muted leading-relaxed mb-3">
            Your credit score is one of the most important factors in determining both whether you qualify for a mortgage and what interest rate you will pay. Even a small difference in rate can cost tens of thousands of dollars over the life of a loan.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Conventional loans (standard mortgage loans not backed by a government agency) typically require a minimum score of 620, while FHA loans may accept scores as low as 580 (or 500 with 10% down). However, the best rates are reserved for borrowers with scores above 740. Before applying, check your credit reports for errors, pay down high balances, avoid opening new credit accounts, and keep credit utilization below 30% (meaning if you have a $10,000 credit limit, try to keep your balance under $3,000).
          </p>
          <p className="text-muted leading-relaxed">
            If your score needs improvement, consider spending 6 to 12 months focused on building credit before applying. A 0.5% rate improvement on a $400,000 mortgage saves roughly $40,000 over 30 years.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">3. Get Pre-Approved</h2>
          <p className="text-muted leading-relaxed mb-3">
            Pre-approval is when a lender (the bank or mortgage company that will give you the loan) reviews your financial information — your income, debts, savings, and credit history — and provides a conditional commitment saying &quot;we are willing to lend you up to this amount.&quot; It is different from pre-qualification, which is just a rough estimate based on information you tell the lender yourself. Pre-approval involves a credit check, income verification, and documentation review, so it carries much more weight.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Getting pre-approved offers several advantages. It shows sellers you are a serious, qualified buyer. It helps you understand exactly how much you can borrow. It speeds up the closing process once you find a home. In competitive markets, many sellers will not even consider offers from buyers without pre-approval.
          </p>
          <p className="text-muted leading-relaxed">
            Shop multiple lenders to compare rates and fees. Mortgage applications within a 45-day window are treated as a single credit inquiry, so rate shopping will not hurt your credit score.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">4. Finding the Right Home</h2>
          <p className="text-muted leading-relaxed mb-3">
            Work with a buyer&apos;s agent who knows your target market. A good agent will help you understand fair market values, identify potential issues with properties, and negotiate effectively. In most transactions, the seller pays the buyer&apos;s agent commission, so representation costs you nothing directly.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Make a list of must-haves versus nice-to-haves. Consider commute times, school districts, neighborhood safety, future development plans, and proximity to amenities. Visit properties at different times of day. Drive the neighborhood on weekday evenings and weekends to get a realistic feel.
          </p>
          <p className="text-muted leading-relaxed">
            Look beyond cosmetic issues to structural fundamentals. A home with ugly carpet but solid bones is far better than a beautifully staged home with foundation problems. Be patient. The average buyer looks at 10 to 15 homes before making an offer.
          </p>
        </section>

        <AdBanner />

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">5. Making an Offer and Negotiation</h2>
          <p className="text-muted leading-relaxed mb-3">
            Your offer should be based on comparable sales (recent sale prices of similar homes nearby — often called &quot;comps&quot;), the condition of the home, how long it has been on the market, and current market conditions. Your agent will help you craft a competitive offer that includes the purchase price, earnest money deposit (a good-faith deposit, typically 1-3% of the price or $5,000 to $15,000 on a $500,000 home, that shows the seller you are serious — this money goes toward your down payment at closing), contingencies (conditions that must be met for the sale to go through — if they are not met, you can back out), and your desired closing timeline.
          </p>
          <p className="text-muted leading-relaxed">
            Common contingencies include financing (allowing you to back out if your loan falls through), inspection (allowing renegotiation or withdrawal based on what the inspector finds wrong with the home), and appraisal (protecting you if the home&apos;s appraised value — an independent professional&apos;s estimate of what the home is actually worth — comes in lower than the purchase price). In hot markets, waiving contingencies can make your offer more competitive, but this carries significant risk.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">6. Home Inspection</h2>
          <p className="text-muted leading-relaxed mb-3">
            Never skip the home inspection. A qualified inspector will evaluate the home&apos;s structure, roof, plumbing, electrical, HVAC (heating, ventilation, and air conditioning system), and other systems. The inspection typically costs $300 to $600, depending on the home&apos;s size and location, but can save you from purchasing a money pit.
          </p>
          <p className="text-muted leading-relaxed">
            After the inspection, you can negotiate repairs with the seller, ask for a price reduction, request credits at closing, or walk away from the deal if major issues are discovered. Consider getting specialized inspections for termites, radon, mold, or sewer lines if the general inspector recommends them.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">7. The Closing Process</h2>
          <p className="text-muted leading-relaxed mb-3">
            Closing (also called &quot;settlement&quot;) is the final step where ownership officially transfers to you. Think of it as the finish line of the home-buying process. The process typically takes 30 to 45 days from the accepted offer. During this time, the lender will process your loan (a step called underwriting, where the lender double-checks everything to make sure the loan is a safe bet), order an appraisal, and conduct a title search (a review of public records to confirm the seller actually owns the property and no one else has a legal claim to it). You will receive a Closing Disclosure (a standardized document listing every cost you will pay) at least three business days before closing, detailing all costs.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            At closing, you will sign numerous documents, pay closing costs (typically 2-5% of the purchase price — that&apos;s $10,000 to $25,000 on a $500,000 home), and receive the keys. Closing costs include lender fees, title insurance (a policy that protects you in case someone later claims they have a legal right to the property), escrow deposits (money set aside in a special account to cover future property tax and insurance payments), recording fees, and prepaid interest.
          </p>
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h3 className="text-sm font-bold text-dark mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" /> First-Time Buyer Checklist
            </h3>
            <ul className="text-sm text-muted space-y-1">
              <li>Check and improve your credit score (6-12 months before)</li>
              <li>Save for down payment and closing costs</li>
              <li>Get pre-approved by 2-3 lenders</li>
              <li>Find a buyer&apos;s agent</li>
              <li>Search for homes within your budget</li>
              <li>Make an offer with appropriate contingencies</li>
              <li>Complete home inspection</li>
              <li>Finalize your mortgage</li>
              <li>Review Closing Disclosure carefully</li>
              <li>Do a final walkthrough before closing</li>
              <li>Close and get your keys</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Try the Calculator
        </Link>
        <Link href="/rent-or-buy/guides/mortgage-types" className="btn-secondary inline-flex items-center gap-2">
          Next: Mortgage Types
        </Link>
      </div>
    </div>
  );
}
