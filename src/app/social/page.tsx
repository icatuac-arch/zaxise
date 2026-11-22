'use client';

import Link from 'next/link';
import {
  Calendar, BarChart3, Sparkles, Smartphone, Users, LayoutGrid,
  Hash, Palette, ArrowRight, CheckCircle, Star, Play, Zap,
  TrendingUp, Globe, Shield, ChevronDown, ChevronUp,
  Camera, MessageCircle, AtSign, Video, Tv, Send
} from 'lucide-react';
import { useState } from 'react';

/* ───── HERO ───── */
function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-slate-300">100% Free. No credit card. No catch.</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6" style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text">Manage All Your</span>
          <br />
          <span className="text-white">Social Media.</span>
          <br />
          <span className="gradient-text-cyan">One Place. Free Forever.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10" style={{ animationDelay: '0.2s' }}>
          Schedule posts, track analytics, grow your audience — across every platform.
          No credit card. No trial period. Just powerful tools, completely free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
          <Link href="/social/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2 shadow-lg shadow-amber-500/20">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/social/dashboard" className="btn-secondary text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2">
            <Play className="w-5 h-5 text-violet-400" /> Watch Demo
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ───── SOCIAL PROOF ───── */
function SocialProof() {
  const platforms = [
    { name: 'Instagram', emoji: '📸' },
    { name: 'Facebook', emoji: '👥' },
    { name: 'Twitter/X', emoji: '𝕏' },
    { name: 'LinkedIn', emoji: '💼' },
    { name: 'TikTok', emoji: '🎵' },
    { name: 'Pinterest', emoji: '📌' },
    { name: 'YouTube', emoji: '▶️' },
    { name: 'Threads', emoji: '🧵' },
  ];
  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm mb-2">Works with all major platforms</p>
        <p className="text-2xl font-bold text-white mb-8">One dashboard for everything</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-2xl mx-auto">
          {platforms.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:border-violet-500/40 transition-all">
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-[10px] text-slate-400">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── FEATURES GRID ───── */
const features = [
  { icon: Calendar, title: 'Smart Scheduler', desc: 'Schedule posts across all platforms. AI picks the best times for maximum engagement.', gradient: 'from-violet-500 to-purple-600' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track engagement, reach, and growth. Beautiful visual reports you can share.', gradient: 'from-cyan-500 to-blue-600' },
  { icon: Sparkles, title: 'AI Content Creator', desc: 'Generate captions, hashtags, and post ideas with AI. Never run out of content.', gradient: 'from-pink-500 to-rose-600' },
  { icon: Smartphone, title: 'Multi-Platform', desc: 'One dashboard for Instagram, Facebook, X, LinkedIn, TikTok, YouTube, Pinterest.', gradient: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite your team. Assign roles. Set up approval workflows to stay aligned.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: LayoutGrid, title: 'Content Calendar', desc: 'Visual drag-and-drop calendar. See your entire content strategy at a glance.', gradient: 'from-indigo-500 to-violet-600' },
  { icon: Hash, title: 'Hashtag Research', desc: 'Find trending hashtags. Track performance. Save groups for quick access.', gradient: 'from-sky-500 to-cyan-600' },
  { icon: Palette, title: 'Image Studio', desc: 'Edit, resize, add text to images. Templates optimized for every platform.', gradient: 'from-rose-500 to-pink-600' },
];

function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Powerful Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Everything you need to <span className="gradient-text-violet">manage social media</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            From scheduling to analytics to AI-powered content creation — all built into one beautiful, free platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 hover:border-violet-500/40 transition-all group text-center">
              <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/social/features" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Explore all features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───── WHY FREE ───── */
function WhyFree() {
  const competitors = [
    { name: 'Hootsuite', price: '$99/mo' },
    { name: 'Buffer', price: '$72/mo' },
    { name: 'Sprout Social', price: '$249/mo' },
    { name: 'SocialMarketly', price: '$0', highlight: true },
  ];

  return (
    <section className="py-24 relative">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-pink-400 mb-3 tracking-wider uppercase">Why Free?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Social media tools should be <span className="gradient-text">accessible to everyone</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            SocialMarketly is backed by <strong className="text-white">ZAXIS Ventures LLC</strong> — committed to
            democratizing digital marketing tools. Every creator, small business, and agency
            deserves enterprise-grade tools without the enterprise price tag.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Shield className="w-6 h-6 text-emerald-400" />
            <p className="text-white font-medium text-sm">No hidden fees. No data selling. Your data stays yours.</p>
          </div>
        </div>
        {/* Price comparison */}
        <div className="max-w-md mx-auto rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
          <h3 className="text-base font-semibold text-white mb-4 text-center">Monthly Cost Comparison</h3>
          <div className="space-y-2">
            {competitors.map((c) => (
              <div
                key={c.name}
                className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                  c.highlight
                    ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30'
                    : 'bg-slate-800/40'
                }`}
              >
                <span className={`font-medium text-sm ${c.highlight ? 'text-white' : 'text-slate-400'}`}>
                  {c.name}
                </span>
                <span className={`font-bold ${
                  c.highlight ? 'text-lg text-green-400' : 'text-slate-500 line-through'
                }`}>
                  {c.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Save up to <span className="text-amber-400 font-semibold">$2,988/year</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───── HOW IT WORKS ───── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Connect Your Accounts',
      desc: 'Link Instagram, Facebook, X, LinkedIn, TikTok, YouTube, and Pinterest in seconds.',
      icon: Globe,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      num: '02',
      title: 'Create & Schedule',
      desc: 'Use AI to write content, plan with the visual calendar, and schedule at optimal times.',
      icon: Calendar,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      num: '03',
      title: 'Track & Grow',
      desc: 'Monitor real-time analytics, identify trends, and grow your audience consistently.',
      icon: TrendingUp,
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-cyan-400 mb-3 tracking-wider uppercase">How It Works</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Up and running in <span className="gradient-text-cyan">3 easy steps</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-violet-500/50 to-transparent -translate-x-8 z-0" />
              )}
              <div className="feature-card p-8 text-center relative z-10">
                <div className="text-4xl font-extrabold gradient-text mb-4">{s.num}</div>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-5`}>
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── WHY SWITCH ───── */
function WhySwitch() {
  const reasons = [
    { title: 'Save $1,000+/year', desc: 'Hootsuite, Sprout Social, and Buffer charge $29–$249/month. We charge nothing. Do the math.', gradient: 'from-green-500 to-emerald-500' },
    { title: 'All features. Day one.', desc: 'No "upgrade to unlock" gates. Every feature — AI writer, analytics, scheduling, team tools — available immediately.', gradient: 'from-violet-500 to-purple-500' },
    { title: 'All platforms in one place', desc: 'Instagram, Facebook, X, LinkedIn, TikTok, YouTube, Pinterest, Threads — manage them all from one dashboard.', gradient: 'from-cyan-500 to-blue-500' },
    { title: 'Built for everyone', desc: 'Whether you are a solo creator, small business, agency, or enterprise — the same powerful tools, zero barriers.', gradient: 'from-amber-500 to-orange-500' },
    { title: 'AI-powered content', desc: 'Generate captions, hashtags, and post ideas with built-in AI. No separate subscription needed.', gradient: 'from-pink-500 to-rose-500' },
    { title: 'Your data stays yours.', desc: 'Your data stays in your browser\'s local storage — we don\'t collect or transmit personal data. We will never sell your information.', gradient: 'from-indigo-500 to-violet-500' },
  ];
  return (
    <section className="py-24 relative">
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-amber-400 mb-3 tracking-wider uppercase">Why SocialMarketly</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            6 reasons to <span className="gradient-text">make the switch</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="feature-card p-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-4`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── FAQ ───── */
const faqs = [
  { q: 'Is SocialMarketly really free?', a: 'Yes, 100% free — forever. All features are included: unlimited social accounts, unlimited scheduled posts, full analytics, AI content creator, and more. No credit card required, no trial that expires.' },
  { q: 'What social media platforms do you support?', a: 'We support all major platforms: Instagram, Facebook, Twitter/X, LinkedIn, TikTok, Pinterest, YouTube, and Threads. We\'re constantly adding more.' },
  { q: 'Is my data safe?', a: 'Your data stays in your browser\'s local storage — we don\'t collect or transmit personal data. Your content and analytics data belong to you. We\'re committed to privacy and transparency.' },
  { q: 'Are there any limits on the free plan?', a: 'There is no paid plan — everything is free. You get unlimited accounts, unlimited posts, full analytics, AI tools, team collaboration, and all features listed on our features page. No upgrades needed.' },
  { q: 'Do you have AI features?', a: 'Yes! Our built-in AI writer can generate captions, hashtags, post ideas, and even suggest the best posting times based on your audience data. It\'s included in the free plan.' },
  { q: 'How is this different from Hootsuite or Buffer?', a: 'Unlike Hootsuite ($99/mo) and Buffer ($72/mo), SocialMarketly is free. But free doesn\'t mean basic — we offer comparable features including scheduling, analytics, team collaboration, and AI content creation.' },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative">
      <div className="relative max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-emerald-400 mb-3 tracking-wider uppercase">FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Got questions? <span className="gradient-text-cyan">We&apos;ve got answers</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="feature-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-white pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-violet-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── CTA BANNER ───── */
function CTABanner() {
  return (
    <section className="py-24 relative">
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative text-center py-16 px-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Ready to take control of your social media?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join creators and brands using SocialMarketly to grow their audience.
            </p>
            <Link
              href="/social/pricing"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-lg px-10 py-4 rounded-2xl hover:bg-slate-100 transition-colors shadow-xl"
            >
              Start Free — No Credit Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── PAGE ───── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <div className="section-divider max-w-5xl mx-auto" />
      <FeaturesGrid />
      <div className="section-divider max-w-5xl mx-auto" />
      <WhyFree />
      <div className="section-divider max-w-5xl mx-auto" />
      <HowItWorks />
      <div className="section-divider max-w-5xl mx-auto" />
      <WhySwitch />
      <div className="section-divider max-w-5xl mx-auto" />
      <FAQ />
      <CTABanner />
    </>
  );
}
