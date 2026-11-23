import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer — ZAXISE',
  description: 'General disclaimer for zaxise.com, operated by ZAXIS Ventures LLC.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">Disclaimer</h1>
        <p className="text-muted text-sm mb-10">Last updated: November 2026</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">1. General Information Only</h2>
            <p>
              The information provided on zaxise.com (the &ldquo;Site&rdquo;), operated by ZAXIS Ventures LLC,
              is for general informational and educational purposes only. Nothing on this Site should be
              construed as professional advice &mdash; whether financial, legal, medical, real estate, tax,
              or otherwise. You should consult qualified professionals before making decisions based on
              information found on this Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">2. Accuracy of Information</h2>
            <p>
              While we strive to provide accurate and up-to-date information, ZAXIS Ventures LLC makes no
              representations or warranties of any kind, express or implied, about the completeness, accuracy,
              reliability, or suitability of the information, products, services, or related graphics contained
              on the Site. Event details, deal prices, travel information, and other time-sensitive content may
              change without notice. Any reliance you place on such information is strictly at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">3. Tools and Calculators</h2>
            <p>
              The Site provides a variety of free tools and calculators, including but not limited to financial
              calculators, image editors, PDF utilities, text tools, and social media utilities. These tools
              are provided for convenience and informational purposes only. Results produced by these tools are
              estimates or approximations and should not be relied upon as definitive or as a substitute for
              professional analysis. We do not guarantee the accuracy of any calculations or outputs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">4. Deals and Product Information</h2>
            <p>
              Deal listings, prices, availability, and product information displayed on the Site are sourced
              from various retailers and community submissions. Prices and availability may change at any time
              and may vary by location. We do not guarantee the accuracy of prices, deal terms, or product
              availability. Always verify pricing and availability directly with the retailer before making a
              purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">5. Events and Community Content</h2>
            <p>
              Event listings and community-contributed content are provided for informational purposes.
              Event details such as dates, times, locations, and ticket prices are subject to change by event
              organizers. We are not responsible for the accuracy of event information or for any issues
              arising from attending events listed on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">6. External Links</h2>
            <p>
              The Site contains links to external websites. These links are provided for your convenience and
              do not signify our endorsement of those websites or their content. We have no control over the
              nature, content, or availability of external sites. The inclusion of any link does not necessarily
              imply a recommendation or endorsement of the views expressed therein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">7. Advertising</h2>
            <p>
              The Site displays advertisements through Google AdSense and may include affiliate links. We may
              earn revenue from clicks on advertisements or purchases made through affiliate links. The presence
              of advertisements does not constitute an endorsement of the advertised products or services.
              Advertisers are solely responsible for the accuracy of their advertising content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">8. Limitation of Liability</h2>
            <p>
              In no event shall ZAXIS Ventures LLC be liable for any loss or damage &mdash; including without
              limitation, indirect or consequential loss or damage, loss of data, or loss of profits &mdash;
              arising out of or in connection with the use of this Site. This includes any loss or damage
              resulting from reliance on information, tools, calculators, or any other content provided on the
              Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">9. No Professional Relationship</h2>
            <p>
              Use of the Site does not create any professional-client relationship between you and ZAXIS
              Ventures LLC. The Site is not a substitute for professional advice from a qualified financial
              advisor, attorney, accountant, real estate agent, or other professional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">10. Contact</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at{' '}
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
        </div>
      </div>
    </div>
  );
}
