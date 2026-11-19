import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, ShoppingBag, DollarSign, Tag, TrendingUp, Package, BarChart3 } from 'lucide-react';

const features = [
  { icon: Tag, title: 'E-Commerce Friendly Tools', desc: 'Create and schedule social content optimized for driving traffic to your online store.' },
  { icon: DollarSign, title: 'UTM Link Tracking', desc: 'Built-in UTM link builder helps you track which social posts drive the most traffic to your store.' },
  { icon: Package, title: 'Content Scheduling', desc: 'Plan and schedule product announcements, promotions, and launches across all your social channels.' },
  { icon: TrendingUp, title: 'Performance Analytics', desc: 'Track engagement on your e-commerce social content to understand what resonates with shoppers.' },
  { icon: BarChart3, title: 'Engagement Reports', desc: 'Weekly and monthly reports showing your social content performance and audience growth.' },
  { icon: ShoppingBag, title: 'Visual Content Tools', desc: 'Create eye-catching product content with AI captions, hashtag research, and image tools.' },
];

export default function EcommercePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-pink-600 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-violet-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-sm font-semibold text-pink-400 mb-3 tracking-wider uppercase">For E-Commerce</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Turn followers into <span className="gradient-text">paying customers</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Drive traffic to your store from social media. E-commerce friendly content tools, scheduling, analytics, and UTM tracking — all free.
          </p>
          <Link href="/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Social commerce, simplified</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every tool you need to sell more through social media — without paying for expensive e-commerce social plugins.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="feature-card p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Why e-commerce brands choose SocialMarketly</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Schedule product-focused content across all social platforms from one dashboard</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">UTM link tracking to understand which posts drive the most store traffic</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">AI-powered captions and hashtags optimized for product promotion</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Completely free — no per-product fees, no transaction charges</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-rose-700 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Start selling through social</h2>
              <p className="text-white/80 mb-8">Start promoting your products on social media today. Free forever.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
