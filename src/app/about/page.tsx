import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — ZAXISE',
  description:
    'About ZAXISE — a unified portal by ZAXIS Ventures LLC serving the Indian-American community with events, deals, tools, travel guides, and more.',
};

export default function AboutPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">About ZAXISE</h1>
        <p className="text-muted text-sm mb-10">Your community portal, all in one place</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Our Mission</h2>
            <p>
              ZAXISE exists to bring the Indian-American community a single, trusted destination for
              everything that matters in daily life &mdash; from discovering local events and snagging
              the best tech deals to planning travel, exploring career opportunities, and accessing
              powerful everyday tools. We believe the community deserves a purpose-built portal that
              understands its needs, celebrates its culture, and delivers genuine value without
              the noise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">What We Offer</h2>
            <p className="mb-4">
              ZAXISE consolidates a growing suite of features under one roof, so you spend less time
              jumping between apps and more time doing what matters:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Events:</strong> A comprehensive calendar of Indian-American community events
                &mdash; festivals, religious gatherings, cultural performances, networking meetups,
                and more &mdash; searchable by city, date, and category.
              </li>
              <li>
                <strong>Tech Deals:</strong> Daily curated electronics deals with price history,
                stock tracking, and historical-low alerts so you never overpay.
              </li>
              <li>
                <strong>Tools &amp; Calculators:</strong> Over 20 browser-based utilities including
                image editors, PDF tools, QR code generators, unit converters, and financial
                calculators &mdash; all running locally on your device with zero data sent to
                our servers.
              </li>
              <li>
                <strong>Travel Guides:</strong> Curated destination guides, itineraries, and tips
                for popular travel spots, with a focus on routes and destinations beloved by the
                Indian-American community.
              </li>
              <li>
                <strong>Internships:</strong> A directory of internship opportunities to help
                students and early-career professionals find their next step.
              </li>
              <li>
                <strong>Social Media Utilities:</strong> Handy tools for social content creation,
                profile optimization, and engagement tracking.
              </li>
              <li>
                <strong>Did You Know:</strong> Thousands of fascinating facts across dozens of
                categories &mdash; trivia, quizzes, and games that make learning fun.
              </li>
              <li>
                <strong>Community Directory:</strong> Discover Indian-owned businesses, temples,
                organizations, and services in your area.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Our Story</h2>
            <p className="mb-3">
              ZAXISE was born from a simple observation: the Indian-American community &mdash; one of
              the fastest-growing and most vibrant in the United States &mdash; lacked a single,
              well-crafted hub that brought together the resources scattered across dozens of
              different sites and apps.
            </p>
            <p>
              Built and operated by <strong>ZAXIS Ventures LLC</strong>, ZAXISE launched with an
              events portal and has since grown to encompass deals, tools, travel, trivia, and much
              more. We are a small, passionate team committed to building something the community
              can rely on &mdash; fast, ad-supported, free to use, and always improving. Every
              feature we ship is designed to be genuinely useful, polished, and respectful of
              your time and privacy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-3">Get in Touch</h2>
            <p>
              We love hearing from the community &mdash; whether it&rsquo;s a feature request, a bug
              report, a partnership idea, or just a kind word.
            </p>
            <p className="mt-3">
              <Link href="/contact" className="text-[var(--accent)] hover:underline font-medium">
                Visit our Contact page
              </Link>{' '}
              or email us directly at{' '}
              <a href="mailto:branade@gmail.com" className="text-[var(--accent)] hover:underline font-medium">
                branade@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line text-sm text-muted">
          <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>
          {' '}&middot;{' '}
          <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
          {' '}&middot;{' '}
          <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>
        </div>
      </div>
    </div>
  );
}
