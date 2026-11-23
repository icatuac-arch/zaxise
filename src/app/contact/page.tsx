import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — ZAXISE',
  description:
    'Get in touch with the ZAXISE team — general inquiries, advertising, feedback, and partnership opportunities.',
};

export default function ContactPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">Contact Us</h1>
        <p className="text-muted text-sm mb-10">We&rsquo;d love to hear from you</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">General Inquiries</h2>
            <p>
              For questions, suggestions, bug reports, or anything else, reach out to us at:
            </p>
            <p className="mt-3">
              <a
                href="mailto:branade@gmail.com"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline font-medium text-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                branade@gmail.com
              </a>
            </p>
            <p className="mt-3 text-muted text-sm">
              We typically respond within 24&ndash;48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Advertising &amp; Partnerships</h2>
            <p>
              Interested in advertising on ZAXISE or exploring a partnership? We work with brands
              and organizations that serve the Indian-American community. Our site reaches a highly
              engaged audience across events, deals, travel, and tools.
            </p>
            <p className="mt-3">
              For advertising inquiries, media kits, or sponsorship opportunities, please email:
            </p>
            <p className="mt-2">
              <a
                href="mailto:branade@gmail.com?subject=Advertising%20Inquiry"
                className="text-[var(--accent)] hover:underline font-medium"
              >
                branade@gmail.com
              </a>{' '}
              <span className="text-muted">(subject: Advertising Inquiry)</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Feedback &amp; Feature Requests</h2>
            <p>
              ZAXISE is built for the community, and your feedback directly shapes what we build
              next. Whether you have an idea for a new tool, want to see events from a specific
              city, or think something could work better &mdash; we want to know.
            </p>
            <p className="mt-3">
              Drop us a line at{' '}
              <a
                href="mailto:branade@gmail.com?subject=Feedback"
                className="text-[var(--accent)] hover:underline font-medium"
              >
                branade@gmail.com
              </a>{' '}
              with &ldquo;Feedback&rdquo; in the subject line.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Report an Issue</h2>
            <p>
              Found a broken link, incorrect information, or a technical issue? Please let us know
              so we can fix it promptly. Include the page URL and a brief description of the problem.
            </p>
            <p className="mt-3">
              Email:{' '}
              <a
                href="mailto:branade@gmail.com?subject=Bug%20Report"
                className="text-[var(--accent)] hover:underline font-medium"
              >
                branade@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Operated By</h2>
            <p>
              <strong>ZAXIS Ventures LLC</strong>
            </p>
            <p className="text-muted mt-1">
              ZAXISE is proudly built and operated in the United States.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line text-sm text-muted">
          <Link href="/about" className="text-[var(--accent)] hover:underline">About</Link>
          {' '}&middot;{' '}
          <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>
          {' '}&middot;{' '}
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
