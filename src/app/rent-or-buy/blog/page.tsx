import Link from 'next/link';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — RentOrBuy',
  description: 'Expert insights on the housing market, homeownership costs, and smart financial strategies for renters and buyers.',
};

const posts = [
  {
    href: '/blog/housing-market-2026',
    title: '2026 Housing Market Outlook',
    excerpt: 'Interest rate trends, inventory forecasts, and what buyers and renters should expect for the rest of 2026.',
    date: 'June 2026',
    readTime: '6 min read',
    tag: 'Market',
  },
  {
    href: '/blog/hidden-costs-homeownership',
    title: 'Hidden Costs of Homeownership Most Buyers Miss',
    excerpt: 'From maintenance to opportunity cost, the expenses that catch first-time homeowners off guard.',
    date: 'June 2026',
    readTime: '5 min read',
    tag: 'Costs',
  },
  {
    href: '/blog/rent-invest-difference',
    title: 'The Rent and Invest the Difference Strategy',
    excerpt: 'Can renting and investing the savings outperform buying? We break down the math with real examples.',
    date: 'June 2026',
    readTime: '7 min read',
    tag: 'Strategy',
  },
];

export default function BlogPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 font-medium mb-2">
            <FileText className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Latest Insights</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Expert analysis on the housing market, homeownership economics, and strategies for building wealth whether you rent or buy.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {posts.map((post) => (
          <Link
            key={post.href}
            href={post.href}
            className="group block bg-card border border-card-border rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">{post.tag}</span>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="text-xs text-muted">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{post.excerpt}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary shrink-0 mt-2 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <AdBanner />
    </div>
  );
}
