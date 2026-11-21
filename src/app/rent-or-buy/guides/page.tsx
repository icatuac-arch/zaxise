import Link from 'next/link';
import { BookOpen, Home, DollarSign, FileText, Scale, TrendingUp } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Buying Guides — RentOrBuy',
  description: 'Comprehensive guides covering everything from first-time home buying to understanding mortgage types, affordability, closing costs, and key rent vs buy factors.',
};

const guides = [
  {
    href: '/guides/first-time-buyer',
    icon: Home,
    title: 'First-Time Home Buyer Guide',
    description: 'Everything you need to know about buying your first home — from saving for a down payment to closing day.',
    tag: 'Essential',
  },
  {
    href: '/guides/mortgage-types',
    icon: FileText,
    title: 'Understanding Mortgage Types',
    description: 'Fixed-rate, ARM, FHA, VA, USDA, and jumbo loans explained with pros and cons of each.',
    tag: 'Loans',
  },
  {
    href: '/guides/affordability',
    icon: DollarSign,
    title: 'How Much House Can You Afford?',
    description: 'The 28/36 rule, DTI ratios, hidden costs of homeownership, and emergency fund planning.',
    tag: 'Planning',
  },
  {
    href: '/guides/closing-costs',
    icon: Scale,
    title: 'Closing Costs Explained',
    description: 'A detailed breakdown of buyer and seller closing costs — what to expect and what is negotiable.',
    tag: 'Costs',
  },
  {
    href: '/guides/rent-vs-buy-factors',
    icon: TrendingUp,
    title: 'Rent vs Buy: Key Factors',
    description: 'Time horizon, market conditions, opportunity cost, tax benefits, flexibility, and emotional factors.',
    tag: 'Strategy',
  },
];

export default function GuidesPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 font-medium mb-2">
            <BookOpen className="w-4 h-4" />
            Educational Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Home Buying Guides</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Whether you are a first-time buyer or experienced homeowner, these guides will help you make informed decisions about one of the biggest financial commitments of your life.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link
              key={guide.href}
              href={guide.href}
              className="group bg-card border border-card-border rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded mb-2">{guide.tag}</span>
                  <h2 className="text-lg font-bold text-dark group-hover:text-primary transition-colors mb-1">{guide.title}</h2>
                  <p className="text-sm text-muted leading-relaxed">{guide.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <AdBanner />

      <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h2 className="text-lg font-bold text-dark mb-2">Ready to crunch the numbers?</h2>
        <p className="text-sm text-muted mb-4">Use our free calculator to compare renting vs buying with your specific financial situation.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Open Calculator
        </Link>
      </div>
      </div>
    </div>
  );
}
