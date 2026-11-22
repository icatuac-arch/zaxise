import Link from 'next/link';
import { ArrowRight, Star, Store, Sparkles, Calendar, BarChart3, Clock, MapPin } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'AI Does the Writing', desc: 'Tell AI your business and it writes posts for you. Captions, hashtags, and even content ideas — generated in seconds.' },
  { icon: Calendar, title: 'Set & Forget Scheduling', desc: 'Schedule a week of posts on Sunday, then focus on your business. Content goes out on autopilot.' },
  { icon: BarChart3, title: 'Simple Analytics', desc: 'No data science degree needed. Clear, simple charts show what\'s working and what to do more of.' },
  { icon: Clock, title: 'Save Time on Content', desc: 'Stop spending hours on social. Batch your content, schedule it, and reclaim your time.' },
  { icon: MapPin, title: 'Local Business Tools', desc: 'Google Business integration, local hashtags, and geo-targeted posting for foot traffic.' },
  { icon: Store, title: 'Completely Free', desc: 'No credit card, no trial, no catch. Enterprise tools at zero cost for small businesses.' },
];

export default function SmallBusinessPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-emerald-500 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-violet-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
            <Store className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-sm font-semibold text-emerald-400 mb-3 tracking-wider uppercase">For Small Business</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Big brand presence. <span className="gradient-text-cyan">Small business budget.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            You don&apos;t need a marketing team or a big budget. SocialMarketly&apos;s AI writes your posts, schedules them at the perfect times, and shows you what&apos;s working — completely free.
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
            <h2 className="text-3xl font-bold text-white mb-4">Social media on autopilot</h2>
            <p className="text-slate-400 max-w-xl mx-auto">You have a business to run. Let SocialMarketly handle the social media so you can focus on what matters.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
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
            <h3 className="text-xl font-bold text-white mb-4">Why small businesses choose SocialMarketly</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">No monthly fees — get enterprise-level tools without the enterprise price tag</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">AI-powered content writer helps you create posts quickly in your brand voice</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Batch scheduling lets you plan ahead and focus on running your business</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Simple analytics show what content is working without a learning curve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Grow your business with social media</h2>
              <p className="text-white/80 mb-8">Free forever. No marketing degree required. AI does the heavy lifting.</p>
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
