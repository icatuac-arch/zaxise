import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rent or Buy Calculator Disclaimer — ZAXISE',
  description: 'Important disclaimer for the Rent or Buy calculator and housing tools on zaxise.com.',
};

export default function RentOrBuyDisclaimerPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-4">
          <Link
            href="/rent-or-buy"
            className="text-sm text-[var(--accent)] hover:underline font-medium"
          >
            &larr; Back to Rent or Buy
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">
          Rent or Buy Calculator Disclaimer
        </h1>
        <p className="text-muted text-sm mb-10">Last updated: November 2026</p>

        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-xl p-5 mb-10">
          <p className="text-ink font-semibold text-sm">
            Important: The Rent or Buy calculator and all related housing tools on this Site are for
            informational and educational purposes only. They do not constitute financial, real estate,
            investment, tax, or legal advice. Always consult qualified professionals before making
            housing or financial decisions.
          </p>
        </div>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">1. Not Financial or Real Estate Advice</h2>
            <p>
              The Rent or Buy calculator, affordability estimator, pre-qualification tool, mortgage comparisons,
              and all related content on zaxise.com are provided by ZAXIS Ventures LLC for informational and
              educational purposes only. <strong>We are not financial advisors, mortgage brokers, real estate
              agents, or licensed professionals.</strong> Nothing on these pages should be interpreted as a
              recommendation to buy, sell, rent, or enter into any financial transaction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">2. Calculations Are Estimates Only</h2>
            <p>
              All calculations, projections, and results produced by our tools are estimates and
              approximations based on the inputs you provide and general assumptions. They do not account
              for every factor that affects real-world housing costs. Actual mortgage payments, closing costs,
              tax implications, insurance premiums, maintenance expenses, and investment returns may differ
              significantly from the estimates shown. Market conditions, interest rates, and local regulations
              change frequently and may not be reflected in our tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">3. Assumptions and Limitations</h2>
            <p className="mb-3">Our calculators use simplified models that may include assumptions such as:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Constant interest rates over the analysis period</li>
              <li>Uniform annual appreciation or depreciation rates for home values</li>
              <li>Generalized tax deduction estimates that may not apply to your specific tax situation</li>
              <li>Standard assumptions for insurance, maintenance, and HOA costs that vary widely by location</li>
              <li>Simplified investment return projections that do not account for market volatility or taxes on gains</li>
            </ul>
            <p className="mt-3">
              These simplifications are necessary for a general-purpose tool but mean the results should
              be treated as a starting point for your research, not a definitive answer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">4. Your Data Stays in Your Browser</h2>
            <p>
              The Rent or Buy calculator and related tools run entirely in your browser. The financial
              information you enter &mdash; including income, savings, home prices, and rent amounts &mdash;
              is processed locally on your device and is <strong>not transmitted to or stored on our
              servers</strong>. For more details, see our{' '}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">5. Market Data and Rates</h2>
            <p>
              Any mortgage rates, market data, median home prices, or statistical figures referenced on
              these pages are sourced from publicly available data and are shown for illustrative purposes
              only. They may not reflect current conditions in your area and should not be used as the basis
              for financial decisions. Always verify current rates with lenders and current market data with
              local real estate professionals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">6. No Endorsement of Products or Services</h2>
            <p>
              References to mortgage types, loan programs, government programs, or financial products are
              for educational purposes and do not constitute an endorsement or recommendation. The Site
              displays advertisements through Google AdSense; advertised products and services are not
              endorsed by ZAXIS Ventures LLC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">7. Consult Qualified Professionals</h2>
            <p>
              Before making any housing or financial decisions, we strongly recommend consulting with:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>A licensed mortgage broker or lender for accurate loan terms and pre-approval</li>
              <li>A licensed real estate agent for market conditions and property valuations</li>
              <li>A certified financial planner for personalized financial analysis</li>
              <li>A tax professional for understanding the tax implications of buying vs. renting</li>
              <li>A real estate attorney for legal review of purchase agreements and contracts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">8. Limitation of Liability</h2>
            <p>
              ZAXIS Ventures LLC shall not be liable for any financial loss, damages, or adverse outcomes
              resulting from decisions made based on information or calculations provided by the Rent or Buy
              calculator or any related tools and content on this Site. Use of these tools is entirely at
              your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">9. Contact</h2>
            <p>
              If you have questions about this disclaimer, please contact us at{' '}
              <a href="mailto:hello@zaxise.com" className="text-[var(--accent)] hover:underline font-medium">
                hello@zaxise.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line text-sm text-muted">
          See also: <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>
          {' '}&middot;{' '}
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
          {' '}&middot;{' '}
          <Link href="/disclaimer" className="text-[var(--accent)] hover:underline">General Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
