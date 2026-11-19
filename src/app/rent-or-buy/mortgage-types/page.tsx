import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Understanding Mortgage Types — RentOrBuy',
  description: 'A comprehensive guide to mortgage types including fixed-rate, ARM, FHA, VA, USDA, and jumbo loans with pros and cons of each.',
};

export default function MortgageTypesPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded">Loans</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Understanding Mortgage Types</h1>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Choosing the right mortgage is just as important as choosing the right home. Here is a detailed look at every major mortgage type available to you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">30-Year Fixed-Rate Mortgage</h2>
          <p className="text-muted leading-relaxed mb-3">
            The 30-year fixed-rate mortgage is the most popular loan in America, chosen by roughly 90% of home buyers. Your interest rate and monthly principal and interest payment (principal is the portion that pays down what you owe, and interest is the fee the bank charges for lending you the money) remain the same for the entire 30-year term, providing maximum predictability for budgeting.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            The primary advantage is stability. You know exactly what your mortgage payment will be for the next three decades, regardless of what happens in the economy or interest rate markets. This makes financial planning straightforward and protects you from rate increases.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The trade-off is that 30-year rates are typically 0.5% to 1% higher than 15-year rates, and you pay significantly more interest over the life of the loan. On a $400,000 mortgage at 6.5%, you would pay roughly $510,000 in total interest — more than the loan itself.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-green-800 mb-1">Pros</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>Predictable payments</li>
                <li>Lowest monthly payment of fixed options</li>
                <li>Protection from rising rates</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-800 mb-1">Cons</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>Higher total interest paid</li>
                <li>Higher rate than shorter terms</li>
                <li>Slow equity building in early years (most of your early payments go toward interest, not paying down what you owe)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">15-Year Fixed-Rate Mortgage</h2>
          <p className="text-muted leading-relaxed mb-3">
            A 15-year fixed mortgage offers a lower interest rate (typically 0.5% to 0.75% less than a 30-year) and builds equity (the portion of your home you truly own) much faster. On a $400,000 mortgage at 6%, you would pay approximately $215,000 in total interest, less than half what you would pay on a 30-year term.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The downside is significantly higher monthly payments. The same $400,000 loan would cost roughly $3,375/month versus $2,398/month on a 30-year, a difference of nearly $1,000 per month. This reduces your flexibility and may affect your ability to qualify based on DTI ratios (debt-to-income ratio — the percentage of your monthly income that goes toward paying debts; lenders use this to decide if you can handle the payments).
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-green-800 mb-1">Pros</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>Lower interest rate</li>
                <li>Much less total interest paid</li>
                <li>Faster equity building</li>
                <li>Own your home sooner</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-800 mb-1">Cons</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>Higher monthly payment</li>
                <li>Less financial flexibility</li>
                <li>Harder to qualify</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">ARM (Adjustable-Rate Mortgage)</h2>
          <p className="text-muted leading-relaxed mb-3">
            An ARM (Adjustable-Rate Mortgage — a loan where the interest rate can change over time) offers a fixed rate for an initial period (commonly 5, 7, or 10 years), after which the rate adjusts periodically based on a market index plus a margin. A 5/1 ARM means the rate is fixed for 5 years, then adjusts once per year. A 7/1 ARM is fixed for 7 years, and so on.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            ARMs typically offer lower initial rates than comparable fixed-rate mortgages, saving money during the fixed period. They make financial sense if you plan to sell or refinance (replace your current loan with a new one, usually to get a better rate) before the adjustment period begins. Most ARMs include rate caps limiting how much the rate can increase at each adjustment and over the life of the loan.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The risk is that rates could rise significantly after the fixed period, potentially increasing your payment by hundreds of dollars per month. If you cannot sell or refinance, you could be stuck with an unaffordable payment. ARMs are best for borrowers with a clear exit strategy.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-green-800 mb-1">Pros</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>Lower initial rate and payment</li>
                <li>Savings if you sell/refinance early</li>
                <li>Rate caps provide some protection</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-800 mb-1">Cons</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>Payment uncertainty after fixed period</li>
                <li>Rates could increase substantially</li>
                <li>More complex to understand</li>
              </ul>
            </div>
          </div>
        </section>

        <AdBanner />

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">FHA Loans</h2>
          <p className="text-muted leading-relaxed mb-3">
            FHA loans are insured by the Federal Housing Administration (a government agency that makes homeownership more accessible by backing loans for people with lower credit scores or smaller down payments). They are designed for borrowers who may not qualify for conventional loans. They require as little as 3.5% down (that&apos;s $17,500 on a $500,000 home) with a credit score of 580 or higher (10% down with scores of 500-579). They are more forgiving of credit issues, past bankruptcies, and higher debt-to-income ratios.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The catch is that FHA loans require mortgage insurance (an extra fee that protects the lender if you stop paying) for the entire life of the loan (unless you put 10% or more down, in which case MIP — Mortgage Insurance Premium, the FHA&apos;s version of PMI — drops off after 11 years). This includes an upfront premium of 1.75% of the loan amount (that&apos;s $6,125 on a $350,000 loan, which is usually rolled into the loan) and an annual premium of 0.55% to 1.05%. On a $350,000 loan, that adds roughly $160 to $306 per month to your payment.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-green-800 mb-1">Pros</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>Low down payment (3.5%)</li>
                <li>Lower credit score requirements</li>
                <li>Flexible debt-to-income ratios</li>
                <li>Gift funds allowed for entire down payment</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-800 mb-1">Cons</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>Lifetime mortgage insurance (usually)</li>
                <li>Loan limits by county</li>
                <li>Property must meet FHA standards</li>
                <li>Higher total cost than conventional</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">VA Loans</h2>
          <p className="text-muted leading-relaxed mb-3">
            VA loans (backed by the Department of Veterans Affairs) are available to eligible veterans, active-duty service members, and some surviving spouses. They offer some of the most favorable terms available: zero down payment, no PMI (Private Mortgage Insurance), competitive rates, and limited closing costs.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            VA loans do charge a one-time funding fee (1.25% to 3.3% of the loan amount, depending on service history and down payment), which can be financed into the loan. Some disabled veterans are exempt from this fee. VA loans also have no maximum loan amount for borrowers with full entitlement, though lenders may have their own limits.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-green-800 mb-1">Pros</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>No down payment required</li>
                <li>No mortgage insurance</li>
                <li>Competitive interest rates</li>
                <li>No prepayment penalty (no fee for paying off the loan early)</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-800 mb-1">Cons</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>VA funding fee</li>
                <li>Only for eligible military members</li>
                <li>Property must be primary residence</li>
                <li>VA appraisal required (the VA sends its own appraiser to confirm the home&apos;s value)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">USDA Loans</h2>
          <p className="text-muted leading-relaxed mb-3">
            USDA loans are backed by the U.S. Department of Agriculture and are designed for low-to-moderate income buyers in eligible rural and suburban areas. Like VA loans, they offer 100% financing (the loan covers the entire purchase price) with no down payment required.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Income limits apply (generally 115% of the area median income), and the property must be in a USDA-eligible area. Many suburban areas outside major cities qualify. USDA loans charge an upfront guarantee fee of 1% and an annual fee of 0.35%, which is lower than FHA mortgage insurance.
          </p>
        </section>

        <section className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-3">Jumbo Loans</h2>
          <p className="text-muted leading-relaxed mb-3">
            Jumbo loans exceed the conforming loan limits (the maximum loan amount that government-backed agencies will guarantee) set by the Federal Housing Finance Agency. In 2026, the conforming limit for most areas is $766,550, and up to $1,149,825 in high-cost areas. Any mortgage above these limits is considered a jumbo loan and carries stricter requirements because the lender takes on more risk.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Jumbo loans typically require higher credit scores (700+), larger down payments (10-20%), and lower debt-to-income ratios. Interest rates may be slightly higher than conforming loans, and lenders often require larger cash reserves. They are common in expensive markets like San Francisco, New York, and Los Angeles.
          </p>
        </section>
      </div>

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-dark mb-2">What does this mean for you?</h2>
        <p className="text-muted leading-relaxed">
          If you are buying your first home and want the simplest, most predictable option, a <strong>30-year fixed-rate mortgage</strong> is the most common choice. If you are a veteran or active military, look into a <strong>VA loan</strong> first — the terms are hard to beat. If your credit score is below 620 or your savings are limited, an <strong>FHA loan</strong> may be your best path. If you know you will move within 5-7 years, an <strong>ARM</strong> could save you money — but make sure you understand the risks. When in doubt, talk to 2-3 lenders and compare their offers side by side.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Try the Calculator
        </Link>
        <Link href="/guides/affordability" className="btn-secondary inline-flex items-center gap-2">
          Next: How Much Can You Afford?
        </Link>
      </div>
    </div>
  );
}
