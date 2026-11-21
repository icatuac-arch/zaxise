import Link from 'next/link';
import { CheckCircle, ArrowRight, X } from 'lucide-react';

const competitors = [
  { name: 'Hootsuite', price: '$99/mo', annual: '$1,188/yr' },
  { name: 'Sprout Social', price: '$249/mo', annual: '$2,988/yr' },
  { name: 'Agorapulse', price: '$79/mo', annual: '$948/yr' },
  { name: 'Buffer', price: '$72/mo', annual: '$864/yr' },
  { name: 'Sendible', price: '$29/mo', annual: '$348/yr' },
  { name: 'SocialMarketly', price: '$0', annual: '$0 — Forever', highlight: true },
];

const features = [
  'Unlimited social accounts',
  'Unlimited scheduled posts',
  'Full analytics & reporting',
  'AI Content Creator',
  'Visual content calendar',
  'Hashtag research & groups',
  'Image Studio',
  'Team collaboration',
  'Social Inbox',
  'Social Listening',
  'ROI Tracking',
  'Link in Bio builder',
  'Bulk upload (CSV)',
  'Content discovery',
  'White-label reports',
  'Priority support',
];

const reasons = [
  {
    title: 'We believe social media tools should be accessible to everyone',
    desc: 'Small businesses, creators, nonprofits, students — everyone deserves professional tools without a $100/month barrier.',
  },
  {
    title: 'Backed by ZAXIS Ventures LLC',
    desc: 'We are a venture-backed company with a long-term vision. Our model is sustainability, not squeezing users for subscriptions.',
  },
  {
    title: 'No hidden costs. No "upgrade to unlock" traps',
    desc: 'Every feature listed is available to every user. We do not gate features behind paywalls. What you see is what you get.',
  },
  {
    title: 'Your privacy matters.',
    desc: 'We do not sell your data. We do not monetize your content. SocialMarketly is supported by non-intrusive advertising.',
  },
];

export default function WhyFreePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="bg-orb w-[600px] h-[600px] top-[-200px] left-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 mb-6">
            💸 Zero cost. Zero catch. Zero limits.
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">100% Free.</span>{' '}
            <span className="text-white">Seriously.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            While others charge $99–$249/month for social media management, we give you the same tools for free. No trial. No credit card. No expiration.
          </p>
        </div>
      </section>

      {/* Competitor comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            What you&apos;d pay elsewhere
          </h2>
          <div className="grid gap-3">
            {competitors.map((c) => (
              <div
                key={c.name}
                className={`flex items-center justify-between px-6 py-4 rounded-xl ${
                  c.highlight
                    ? 'bg-gradient-to-r from-violet-600/30 to-pink-600/30 border-2 border-violet-400/60 shadow-lg shadow-violet-500/10'
                    : 'glass'
                }`}
              >
                <div className="flex items-center gap-3">
                  {c.highlight ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400/60" />
                  )}
                  <span className={`font-semibold ${c.highlight ? 'text-white text-lg' : 'text-slate-300'}`}>
                    {c.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold font-mono ${c.highlight ? 'text-2xl text-green-400' : 'text-lg text-slate-400'}`}>
                    {c.price}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {c.annual}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            That&apos;s up to <span className="text-white font-bold">$2,988/year</span> you save by choosing SocialMarketly.
          </p>
        </div>
      </section>

      {/* Everything included */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Everything included. No upgrades needed.
          </h2>
          <p className="text-slate-400 text-center mb-10">
            Other tools make you pay for each feature. We give you all of them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 px-4 py-3 glass rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-slate-200">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why free */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            &ldquo;But why is it free?&rdquo;
          </h2>
          <div className="grid gap-6">
            {reasons.map((r, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Still have questions?
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Will it always be free?', a: 'Yes. We have no plans to introduce mandatory pricing. If we ever add a premium tier in the future, the free tier will remain fully functional with all current features.' },
              { q: 'What\'s the catch?', a: 'There is no catch. We display non-intrusive ads to support the platform, but we never sell your data. No bait-and-switch.' },
              { q: 'Are there any limits?', a: 'The platform is designed to be generous. You get unlimited accounts, unlimited posts, full analytics, AI tools — everything listed on our features page.' },
              { q: 'How do you make money?', a: 'SocialMarketly is supported by advertising revenue. We display relevant, non-intrusive ads to keep the platform free for all users. We will never sell your personal data.' },
              { q: 'Is my data safe?', a: 'Your data stays in your browser\'s local storage — we don\'t collect or transmit personal data. We will never sell your information. Read our Privacy Policy for details.' },
              { q: 'Can I use this for my agency / clients?', a: 'Yes! We have white-label features, team collaboration, and client management — all free. Many agencies use us to manage 10+ client accounts.' },
            ].map((faq, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop paying for social media tools.
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join creators and businesses who switched to free.
          </p>
          <Link href="/dashboard" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-slate-500 mt-4">No credit card. No trial. Just free.</p>
        </div>
      </section>
    </div>
  );
}
