import Link from 'next/link';
import {
  ArrowRight, Building2, ShoppingBag, Mic2, Store, Globe,
  CheckCircle
} from 'lucide-react';

const solutions = [
  {
    icon: Building2,
    title: 'For Agencies',
    href: '/solutions/agencies',
    desc: 'Manage multiple clients from one dashboard. White-label reports, team collaboration, and approval workflows built for agency scale.',
    gradient: 'from-violet-500 to-purple-600',
    highlights: ['Multi-client dashboards', 'White-label reports', 'Team approval workflows', 'Client portals'],
  },
  {
    icon: ShoppingBag,
    title: 'For E-Commerce',
    href: '/solutions/ecommerce',
    desc: 'Drive traffic to your store from social media. E-commerce friendly content tools, scheduling, analytics, and UTM link tracking.',
    gradient: 'from-pink-500 to-rose-600',
    highlights: ['E-commerce content tools', 'UTM link tracking', 'Engagement analytics', 'AI product captions'],
  },
  {
    icon: Mic2,
    title: 'For Creators & Influencers',
    href: '/solutions/creators',
    desc: 'Grow your audience and land brand deals. Analytics that prove your value, content scheduling, and link-in-bio all in one place.',
    gradient: 'from-amber-500 to-orange-600',
    highlights: ['Audience growth tools', 'Media kit generation', 'Cross-platform analytics', 'Link-in-bio'],
  },
  {
    icon: Store,
    title: 'For Small Business',
    href: '/solutions/small-business',
    desc: 'Look like a big brand on a small budget. AI writes your posts, scheduler handles consistency, and analytics show what works.',
    gradient: 'from-emerald-500 to-teal-600',
    highlights: ['AI content writer', 'Set-and-forget scheduling', 'Local business tools', 'Free forever'],
  },
  {
    icon: Globe,
    title: 'For Enterprise',
    href: '/solutions/enterprise',
    desc: 'Enterprise-grade social media management with advanced security, SSO, custom integrations, and dedicated support.',
    gradient: 'from-cyan-500 to-blue-600',
    highlights: ['SSO & SAML', 'Advanced permissions', 'API access', 'Dedicated support'],
  },
];

export default function SolutionsPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-violet-600 -top-32 -left-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-pink-600 -bottom-24 -right-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Solutions</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Built for <span className="gradient-text">how you work</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Whether you&apos;re a solo creator, growing small business, agency managing dozens of clients, or enterprise team — SocialMarketly adapts to your workflow.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {solutions.map((s, i) => (
            <div key={s.title} className="feature-card p-8 grid md:grid-cols-2 gap-8 items-center">
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-5`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{s.title}</h2>
                <p className="text-slate-400 leading-relaxed mb-6">{s.desc}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {s.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
                <Link href={s.href} className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="glass rounded-xl p-6 h-64 flex items-center justify-center">
                  <s.icon className="w-24 h-24 opacity-20" style={{ color: s.gradient.includes('violet') ? '#7C3AED' : s.gradient.includes('pink') ? '#EC4899' : s.gradient.includes('amber') ? '#F59E0B' : s.gradient.includes('emerald') ? '#10B981' : '#06B6D4' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Not sure which plan fits?</h2>
              <p className="text-white/80 mb-8">Start free and upgrade as you grow. Every solution includes our core features at no cost.</p>
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
