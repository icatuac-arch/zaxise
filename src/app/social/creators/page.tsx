import Link from 'next/link';
import { ArrowRight, Star, Mic2, TrendingUp, LinkIcon, BarChart3, Calendar, Sparkles } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Audience Growth', desc: 'AI-powered recommendations to grow your following. Best times to post, optimal hashtags, content ideas.' },
  { icon: BarChart3, title: 'Prove Your Value', desc: 'Generate media kits with verified analytics. Show brands your true reach and engagement rates.' },
  { icon: LinkIcon, title: 'Link in Bio', desc: 'Beautiful customizable landing page for all your links. Track clicks and show sponsors your traffic.' },
  { icon: Calendar, title: 'Content Batching', desc: 'Schedule a week of content in one sitting. Batch create and let the scheduler handle the rest.' },
  { icon: Sparkles, title: 'AI Captions', desc: 'Writer\'s block is over. AI generates scroll-stopping captions, hooks, and CTAs in your voice.' },
  { icon: Mic2, title: 'Cross-Platform', desc: 'Post to Instagram, TikTok, YouTube, X, and more from one place. Repurpose content effortlessly.' },
];

export default function CreatorsPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-amber-500 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-pink-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
            <Mic2 className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-sm font-semibold text-amber-400 mb-3 tracking-wider uppercase">For Creators & Influencers</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Grow your audience. <span className="gradient-text">Land more deals.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The all-in-one platform for creators who are serious about growth. Schedule content, track analytics, build your link-in-bio, and generate media kits — all free.
          </p>
          <Link href="/social/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for the creator economy</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Stop juggling five different apps. Everything a creator needs — scheduling, analytics, link-in-bio, AI captions — in one free platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
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
            <h3 className="text-xl font-bold text-white mb-4">Why creators choose SocialMarketly</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">AI-powered posting time recommendations to help maximize your reach</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Cross-platform scheduling so you can batch content and focus on creating</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Analytics dashboard to understand what content resonates with your audience</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Completely free — no trial period, no credit card, no hidden fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your creator career starts here</h2>
              <p className="text-white/80 mb-8">Join creators already using SocialMarketly to grow. Free forever.</p>
              <Link href="/social/pricing" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
