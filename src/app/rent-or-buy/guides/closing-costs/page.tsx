import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Closing Costs Explained — RentOrBuy',
  description: 'A detailed breakdown of buyer and seller closing costs, what to expect, and what is negotiable when buying or selling a home.',
};

export default function ClosingCostsPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Costs</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Closing Costs Explained</h1>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Closing costs are the fees and expenses you pay on the day the home sale becomes official (called &quot;closing&quot; or &quot;settlement&quot;). They are separate from your down payment and can significantly impact the total cash you need.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Buyer Closing Costs (2-5% of Purchase Price)</h2>
          <p className="text-muted leading-relaxed mb-4">
            As a buyer, your closing costs typically range from 2% to 5% of the purchase price. On a $500,000 home, that means $10,000 to $25,000 in addition to your down payment. These costs are itemized on your Closing Disclosure (a standardized document that lists every fee you will pay — your lender is required by law to send it to you), which you must receive at least three business days before closing.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-card-border">
                  <th className="text-left py-2 text-muted font-medium">Cost Item</th>
                  <th className="text-right py-2 text-muted font-medium">Typical Range</th>
                  <th className="text-left py-2 pl-4 text-muted font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Loan Origination Fee</td>
                  <td className="text-right font-mono">0.5-1%</td>
                  <td className="pl-4">Lender fee for processing the loan</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Appraisal</td>
                  <td className="text-right font-mono">$300-$600</td>
                  <td className="pl-4">A professional evaluates the home to confirm it is worth what you are paying — required by your lender</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Home Inspection</td>
                  <td className="text-right font-mono">$300-$600</td>
                  <td className="pl-4">Optional but highly recommended</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Title Search & Insurance</td>
                  <td className="text-right font-mono">$1,000-$3,000</td>
                  <td className="pl-4">A title search checks public records to confirm the seller truly owns the property; title insurance protects you if a claim on the property surfaces later</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Attorney Fees</td>
                  <td className="text-right font-mono">$500-$2,000</td>
                  <td className="pl-4">Required in some states</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Recording Fees</td>
                  <td className="text-right font-mono">$50-$500</td>
                  <td className="pl-4">Fee paid to the county government to officially record that you are the new owner</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Escrow Deposits</td>
                  <td className="text-right font-mono">2-6 months</td>
                  <td className="pl-4">Money set aside in a special account (called escrow) so your lender can pay your property taxes and insurance on your behalf</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Prepaid Interest</td>
                  <td className="text-right font-mono">Varies</td>
                  <td className="pl-4">Interest from closing to month end</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-medium text-dark">Transfer Taxes</td>
                  <td className="text-right font-mono">Varies</td>
                  <td className="pl-4">State/local tax on property transfer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <AdBanner />

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Seller Closing Costs (5-8% of Sale Price)</h2>
          <p className="text-muted leading-relaxed mb-4">
            Sellers typically pay more in closing costs than buyers, primarily due to real estate agent commissions. Total seller costs usually range from 5% to 8% of the sale price. On a $500,000 home, that is $25,000 to $40,000.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            The largest seller cost is typically the real estate agent commission, traditionally 5-6% of the sale price split between the listing and buyer&apos;s agents. Following the 2024 NAR (National Association of Realtors) settlement, commission structures are changing, and buyers may increasingly pay their own agents directly. Sellers also pay their share of transfer taxes, prorated property taxes (the seller&apos;s share of property taxes for the portion of the year they owned the home), title insurance for the buyer (in some states), and any negotiated repairs or credits.
          </p>
          <p className="text-muted leading-relaxed">
            If the seller has a mortgage, the remaining balance must be paid off from sale proceeds, along with any prepayment penalties (rare with modern mortgages). Home warranty coverage provided to the buyer, staging costs, and pre-listing repairs are additional expenses.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">What Is Negotiable?</h2>
          <p className="text-muted leading-relaxed mb-3">
            More closing costs are negotiable than most buyers realize. Lender fees like origination charges (the fee a lender charges for processing your loan) and discount points (optional upfront fees you can pay to lower your interest rate — one &quot;point&quot; equals 1% of the loan amount) can often be reduced by shopping multiple lenders. Title and escrow companies can be shopped for competitive pricing. In buyer-favorable markets, sellers may agree to pay a portion of the buyer&apos;s closing costs (called seller concessions), reducing the cash you need at closing.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Common negotiation strategies include asking the seller for closing cost credits (typically 2-3% of the price), comparing Loan Estimates from at least three lenders, shopping for title insurance independently (you are not required to use the lender&apos;s preferred company), negotiating the commission structure with your real estate agent, and requesting lender credits in exchange for a slightly higher interest rate.
          </p>
          <p className="text-muted leading-relaxed">
            Some costs are non-negotiable, including government recording fees, transfer taxes, and required inspections mandated by the lender or local regulations. However, knowing which costs are flexible gives you leverage in negotiations.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Strategies to Reduce Closing Costs</h2>
          <p className="text-muted leading-relaxed mb-3">
            Several strategies can help minimize your closing costs. First, closing at the end of the month reduces prepaid interest charges. Second, some lenders offer no-closing-cost mortgages, where fees are rolled into a slightly higher interest rate — this can make sense if you plan to sell or refinance within a few years. Third, first-time buyer programs in many states offer closing cost assistance grants.
          </p>
          <p className="text-muted leading-relaxed">
            Always review your Closing Disclosure carefully and compare it to the Loan Estimate (a document your lender gives you early in the process that previews your expected costs) you received when applying. By law, certain fees cannot increase, and others can increase by no more than 10%. If you see unexpected charges, question them before closing. You have every right to understand and challenge every line item.
          </p>
        </section>
      </div>

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-dark mb-2">What does this mean for you?</h2>
        <p className="text-muted leading-relaxed">
          When saving up to buy a home, do not just think about the down payment. On a $500,000 home with 10% down, you need $50,000 for the down payment <em>plus</em> roughly $10,000 to $25,000 for closing costs — so budget $60,000 to $75,000 in total cash. Get your Loan Estimate from at least 2-3 lenders and compare them line by line. And remember: some of these costs are negotiable, so do not be afraid to ask.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Try the Calculator
        </Link>
        <Link href="/guides/rent-vs-buy-factors" className="btn-secondary inline-flex items-center gap-2">
          Next: Rent vs Buy Factors
        </Link>
      </div>
    </div>
  );
}
