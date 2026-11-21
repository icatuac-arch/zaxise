import Link from 'next/link';
import { TrendingDown, BarChart3, Zap, Calculator, Users, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: TrendingDown,
    title: 'Price History Tracking',
    tagline: 'We show you if it\'s REALLY a deal',
    description: 'Every deal includes a 6-month price history chart so you can see exactly how the price has changed over time. No more guessing if that "sale" price is actually lower than last week. We track it all so you can buy with confidence.',
    color: 'bg-blue-50 text-primary border-primary/20',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    icon: BarChart3,
    title: 'Cross-Store Price Comparison',
    tagline: 'Compare prices across stores instantly',
    description: 'For every deal, we show you the same product\'s price at every major retailer. See at a glance if Amazon, Best Buy, Walmart, or Target has a better price. We even tell you how much you\'d save by switching stores.',
    color: 'bg-emerald-50 text-deal-green border-deal-green/20',
    iconBg: 'bg-deal-green/10 text-deal-green',
  },
  {
    icon: Zap,
    title: 'Deal DNA Analysis',
    tagline: 'Understand WHY a deal is good',
    description: 'Other sites just show you a price. We tell you WHY it\'s a good deal. Is it a seasonal clearance? New model incoming? Flash sale? Our Deal DNA gives you the context you need to decide if NOW is the right time to buy.',
    color: 'bg-amber-50 text-deal-gold border-deal-gold/20',
    iconBg: 'bg-deal-gold/10 text-deal-gold',
  },
  {
    icon: Calculator,
    title: 'Deal Stack Calculator',
    tagline: 'Maximize your savings',
    description: 'Most people leave money on the table. Our Deal Stack Calculator shows you every way to save more on top of the deal price — store coupons, credit card cashback, student discounts, loyalty points. Check the ones that apply and see your REAL final price.',
    color: 'bg-red-50 text-deal-red border-deal-red/20',
    iconBg: 'bg-deal-red/10 text-deal-red',
  },
  {
    icon: Users,
    title: 'Community Verified',
    tagline: 'Real people verify real deals',
    description: 'Every deal is voted on by our community. High deal scores mean real people checked it, confirmed the price, and said "yes, this is legit." No fake deals, no inflated "original" prices, no nonsense.',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24 px-4 border-b border-card-border">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            What makes us different
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-heading leading-tight">
            Not Just Another{' '}
            <span className="text-primary">Deals Site</span>
          </h1>
          <p className="mt-6 text-text-body text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Other deal sites show you a price and a link. We give you the full picture — price history, store comparisons, deal analysis, and savings stacking — so you never overpay again.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`border rounded-2xl p-8 sm:p-10 ${feature.color} transition-all hover:shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-text-muted text-xs font-bold uppercase tracking-wider">
                        Feature {index + 1}
                      </span>
                    </div>
                    <h2 className="text-text-heading text-2xl sm:text-3xl font-extrabold mt-1">
                      {feature.title}
                    </h2>
                    <p className="text-text-heading text-lg font-semibold mt-1 opacity-80">
                      {feature.tagline}
                    </p>
                    <p className="text-text-body mt-3 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Save Smarter?
            </h2>
            <p className="text-blue-100 mt-3 max-w-lg mx-auto">
              Browse today&apos;s deals and see the difference for yourself. Click on any deal to see its full DNA, price history, and savings stack.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-primary font-bold px-8 py-3.5 rounded-xl transition-colors mt-6 text-sm"
            >
              Browse Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
