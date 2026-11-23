import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — ZAXISE',
  description: 'Privacy Policy for zaxise.com, operated by ZAXIS Ventures LLC.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-10">Last updated: November 2026</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">1. Introduction</h2>
            <p>
              ZAXIS Ventures LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
              zaxise.com (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, and
              protect information when you visit or use our Site. We are committed to safeguarding your privacy
              and being transparent about our data practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Usage data:</strong> Pages visited, time spent on pages, referring URLs, browser type,
                device type, and operating system. This is collected through standard web analytics.
              </li>
              <li>
                <strong>Cookies and similar technologies:</strong> We use cookies to improve your experience,
                remember preferences, and serve relevant advertisements. See Section 5 for details.
              </li>
              <li>
                <strong>Voluntarily provided information:</strong> If you submit a deal, leave a comment, sign
                up for alerts, or contact us, we collect the information you choose to provide (such as your
                name or email address).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">3. Client-Side Tools</h2>
            <p>
              Many of the tools and calculators on ZAXISE &mdash; including image editors, PDF tools, text
              utilities, QR code generators, and financial calculators &mdash; run entirely in your browser
              using client-side JavaScript. <strong>These tools do not transmit your data to our servers.</strong>{' '}
              Files you upload to image or PDF tools are processed locally on your device and are never sent
              to or stored on our servers. Your inputs to calculators (such as income, rent amounts, or home
              prices) remain in your browser and are not collected by us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">4. How We Use Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Operate, maintain, and improve the Site and its features</li>
              <li>Understand how visitors use the Site so we can enhance the user experience</li>
              <li>Respond to inquiries and provide support</li>
              <li>Display relevant content and advertisements</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">5. Cookies and Advertising</h2>
            <p className="mb-3">
              The Site uses cookies &mdash; small text files stored on your device &mdash; for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>
                <strong>Essential cookies:</strong> Required for the Site to function properly (e.g., session
                management, user preferences).
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how visitors interact with the Site.
                We use services such as Google Analytics.
              </li>
              <li>
                <strong>Advertising cookies:</strong> We use Google AdSense to display advertisements. Google
                and its advertising partners may use cookies to serve ads based on your prior visits to this
                Site and other websites. You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Google&rsquo;s Ad Settings
                </a>.
              </li>
            </ul>
            <p>
              Most browsers allow you to control cookies through their settings. Disabling cookies may affect
              your experience on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">6. Third-Party Services</h2>
            <p>
              We may use third-party services for analytics, advertising, and content delivery (e.g., Google
              Analytics, Google AdSense, Vercel). These services may collect information about your use of the
              Site in accordance with their own privacy policies. We encourage you to review those policies.
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">7. Data Retention</h2>
            <p>
              We retain voluntarily provided information (such as comments or submissions) for as long as
              necessary to provide our services. Analytics data is retained in accordance with the retention
              settings of the analytics platforms we use. You may request deletion of your personally
              identifiable data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Opt out of personalized advertising</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:hello@zaxise.com" className="text-[var(--accent)] hover:underline font-medium">
                hello@zaxise.com
              </a>.
              We will respond to your request within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">9. Children&rsquo;s Privacy</h2>
            <p>
              The Site is not directed at children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided us with personal
              information, please contact us and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">10. Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect the information we
              collect. However, no method of transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated &ldquo;Last updated&rdquo; date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">12. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@zaxise.com" className="text-[var(--accent)] hover:underline font-medium">
                hello@zaxise.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line text-sm text-muted">
          See also: <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>
          {' '}&middot;{' '}
          <Link href="/disclaimer" className="text-[var(--accent)] hover:underline">Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
