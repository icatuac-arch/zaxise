import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — ZAXISE',
  description: 'Terms of Service for zaxise.com, operated by ZAXIS Ventures LLC.',
};

export default function TermsPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">Terms of Service</h1>
        <p className="text-muted text-sm mb-10">Last updated: November 2026</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using zaxise.com (the &ldquo;Site&rdquo;), operated by ZAXIS Ventures LLC
              (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use the Site. We reserve the right to
              update these terms at any time. Continued use of the Site after changes constitutes acceptance of
              the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">2. Description of Service</h2>
            <p>
              ZAXISE is a portal serving the Indian-American community, consolidating events, deals, tools,
              calculators, travel guides, trivia, social media utilities, and other resources under one platform.
              Some features are informational, some are interactive tools that run in your browser, and some
              involve community-contributed content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">3. Use of the Site</h2>
            <p className="mb-3">You agree to use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-ink">
              <li>Use the Site in any way that violates applicable federal, state, or local law</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
              <li>Interfere with or disrupt the Site&rsquo;s infrastructure or other users&rsquo; experience</li>
              <li>Scrape, crawl, or use automated tools to extract data without our prior written consent</li>
              <li>Upload or transmit malicious code, spam, or harmful content</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">4. Intellectual Property</h2>
            <p>
              All content on the Site &mdash; including text, graphics, logos, icons, images, software, and
              compilation of content &mdash; is the property of ZAXIS Ventures LLC or its content suppliers and
              is protected by United States and international copyright, trademark, and other intellectual
              property laws. You may not reproduce, distribute, modify, or create derivative works from any
              content on this Site without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">5. User-Generated Content</h2>
            <p>
              Certain features of the Site allow users to submit content, including but not limited to deal
              submissions, comments, and community posts. By submitting content, you grant ZAXIS Ventures LLC
              a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, reproduce, and
              distribute such content in connection with the Site. You represent that you own or have the right
              to submit any content you post and that it does not violate the rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">6. Third-Party Links and Advertising</h2>
            <p>
              The Site may contain links to third-party websites and displays advertisements served by
              Google AdSense and other advertising partners. We do not control and are not responsible for
              the content, privacy policies, or practices of any third-party websites or advertising networks.
              Your interactions with third-party sites and advertisers are solely between you and those parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">7. Disclaimers</h2>
            <p>
              The Site and all content, tools, calculators, and services are provided on an &ldquo;as is&rdquo;
              and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
              We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other
              harmful components. The tools and calculators on this Site are for informational and educational
              purposes only and do not constitute professional advice of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ZAXIS Ventures LLC and its officers, directors, employees,
              and agents shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages arising out of or related to your use of or inability to use the Site, including but not
              limited to damages for loss of profits, data, or other intangible losses, even if we have been
              advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ZAXIS Ventures LLC from and against any claims, damages,
              losses, liabilities, and expenses (including reasonable attorneys&rsquo; fees) arising out of or
              related to your use of the Site, your violation of these Terms, or your violation of any rights of
              a third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States
              and the state in which ZAXIS Ventures LLC is organized, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">11. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hello@zaxise.com" className="text-[var(--accent)] hover:underline font-medium">
                hello@zaxise.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line text-sm text-muted">
          See also: <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
          {' '}&middot;{' '}
          <Link href="/disclaimer" className="text-[var(--accent)] hover:underline">Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
