import Link from 'next/link';
import { ArrowLeft, DollarSign } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Much House Can You Afford? — RentOrBuy',
  description: 'Learn the 28/36 rule, DTI ratios, hidden costs of homeownership, and how to plan your emergency fund before buying a home.',
};

export default function AffordabilityPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Planning</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">How Much House Can You Afford?</h1>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Just because a lender approves you for a certain amount does not mean you should spend it all. Here is how to figure out what you can truly afford.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">The 28/36 Rule</h2>
          <p className="text-muted leading-relaxed mb-3">
            The most widely used guideline for housing affordability is the 28/36 rule. The front-end ratio (the portion of your income spent on housing alone) says your total monthly housing costs — including your mortgage payment, property taxes, insurance, HOA fees (Homeowners Association fees — monthly or annual dues charged by a community for shared amenities and maintenance, common with condos and planned neighborhoods), and PMI (Private Mortgage Insurance — the extra fee you pay if your down payment is less than 20%) — should not exceed 28% of your gross monthly income (your pay before taxes are taken out). The back-end ratio (the portion of your income spent on all debts combined) says your total monthly debt payments (housing plus car loans, student loans, credit card minimums, and any other recurring debts) should not exceed 36% of your gross monthly income.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            For example, if your household earns $120,000 annually ($10,000 per month gross), your housing costs should ideally stay under $2,800 per month, and your total debt payments under $3,600 per month. If you already have $500 per month in other debts, your maximum housing payment drops to $3,100 per month under the back-end ratio.
          </p>
          <p className="text-muted leading-relaxed">
            Some lenders will approve borrowers up to 43% or even 50% DTI (debt-to-income ratio), especially for FHA and VA loans, but exceeding the 28/36 thresholds puts you at greater risk of financial stress, leaving little room for savings, emergencies, or lifestyle expenses.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-green-700">28%</div>
              <div className="text-xs text-green-800 mt-1">Max housing-to-income ratio</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-green-700">36%</div>
              <div className="text-xs text-green-800 mt-1">Max total debt-to-income ratio</div>
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Hidden Costs of Homeownership</h2>
          <p className="text-muted leading-relaxed mb-3">
            Many first-time buyers focus only on the mortgage payment and are surprised by the true cost of owning a home. Property taxes can add $300 to $1,000+ per month depending on your location and property value. Home insurance typically runs $100 to $300 per month. Maintenance and repairs average 1% to 2% of the home&apos;s value annually — on a $500,000 home, budget $5,000 to $10,000 per year.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Other costs frequently overlooked include HOA fees (Homeowners Association fees — monthly or annual charges for shared spaces and services in your community), higher utility bills compared to renting, landscaping and lawn care, pest control, and the inevitable major repairs — a new roof costs $8,000 to $15,000, HVAC (heating, ventilation, and air conditioning) replacement runs $5,000 to $10,000, and foundation repairs can reach $10,000 or more.
          </p>
          <p className="text-muted leading-relaxed">
            Beyond financial costs, homeownership requires significant time investment. Yard work, cleaning gutters, minor repairs, managing contractors — these tasks can consume 5 to 10 hours per week that renters spend on other activities.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Emergency Fund Considerations</h2>
          <p className="text-muted leading-relaxed mb-3">
            Before buying, ensure you have adequate emergency savings beyond your down payment and closing costs. Financial advisors recommend maintaining 3 to 6 months of living expenses in accessible savings. For homeowners, this buffer is even more important because you cannot call a landlord when the water heater dies or the roof springs a leak.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            A common mistake is draining savings entirely for the down payment. While a larger down payment reduces your monthly costs and eliminates PMI (the extra monthly insurance fee) at 20%, having zero savings leaves you vulnerable. A better approach might be putting 15% down (paying PMI temporarily) while keeping a healthy emergency fund, rather than stretching to 20% down and having nothing left.
          </p>
          <p className="text-muted leading-relaxed">
            Consider setting up a dedicated home maintenance fund, contributing at least 1% of your home&apos;s value annually. This creates a cushion for both routine maintenance and major repairs, preventing you from relying on credit cards or emergency savings when issues arise.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">What Lenders Look At</h2>
          <p className="text-muted leading-relaxed mb-3">
            Lenders evaluate four key factors when determining how much you can borrow: income stability and documentation, credit score and credit history, debt-to-income ratio, and assets and reserves. They want to see at least two years of steady employment, a strong credit profile, manageable existing debt, and enough cash for down payment, closing costs, and a few months of reserves.
          </p>
          <p className="text-muted leading-relaxed">
            Self-employed borrowers face additional scrutiny. Lenders typically average your income over the past two years using tax returns, which can be challenging if your income has varied or if you take aggressive deductions. Bank statement loans are available for self-employed borrowers but often come with higher rates and larger down payment requirements.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">A More Conservative Approach</h2>
          <p className="text-muted leading-relaxed mb-3">
            Consider basing your budget on one income if you are a dual-income household. This provides protection against job loss and ensures you can manage payments through difficult times. Some financial planners recommend the 25% rule — keeping your mortgage payment (principal and interest only — that is, just the loan payment itself, not including taxes or insurance) at or below 25% of your take-home pay (your pay after taxes).
          </p>
          <p className="text-muted leading-relaxed">
            Think about your entire financial picture, not just the mortgage. Do you want to continue saving for retirement at 15% of income? Do you have children or plan to? Do you travel? Will you need a new car in the next few years? Your home should support your lifestyle goals, not consume them.
          </p>
        </section>
      </div>

      <AdBanner />

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-dark mb-2">What does this mean for you?</h2>
        <p className="text-muted leading-relaxed">
          A simple starting point: take your gross monthly income (before taxes), multiply by 0.28, and that is a reasonable upper limit for your total monthly housing cost — including the mortgage, taxes, insurance, and any HOA fees. For example, if you earn $8,000/month before taxes, aim to keep total housing costs under $2,240/month. And remember: the down payment is not the only cash you need. Budget for closing costs (2-5% of the home price) and keep an emergency fund with at least 3-6 months of living expenses.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Check Your Affordability
        </Link>
        <Link href="/guides/closing-costs" className="btn-secondary inline-flex items-center gap-2">
          Next: Closing Costs
        </Link>
      </div>
    </div>
  );
}
