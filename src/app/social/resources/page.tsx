import Link from 'next/link';
import {
  ArrowRight, Wrench, FileText, BookOpen, Video,
  Hash, Type, ImageIcon, CalendarDays, Target, Layout,
  Smartphone, Share2, MessageCircle
} from 'lucide-react';

const freeTools = [
  { icon: Hash, title: 'Hashtag Generator', desc: 'Generate trending, relevant hashtags for any niche. Powered by AI.' },
  { icon: Type, title: 'Caption Generator', desc: 'AI writes scroll-stopping captions in your brand voice. Just describe your post.' },
  { icon: ImageIcon, title: 'Image Resizer', desc: 'Resize images for every platform in one click. Instagram, X, LinkedIn, TikTok, Pinterest.' },
  { icon: CalendarDays, title: 'Best Time to Post Calculator', desc: 'Find the optimal posting times for your audience and timezone.' },
];

const templates = [
  { icon: CalendarDays, title: 'Content Calendar Template', desc: 'A 30-day content calendar spreadsheet ready to customize for your brand.' },
  { icon: Target, title: 'Social Media Strategy Template', desc: 'Complete strategy document covering goals, audience, content pillars, and KPIs.' },
  { icon: Layout, title: 'Social Media Audit Template', desc: 'Audit your current presence and identify gaps and opportunities.' },
  { icon: FileText, title: 'Brand Voice Guide Template', desc: 'Define your brand personality, tone, and messaging for consistent social presence.' },
];

const guides = [
  { icon: Share2, title: 'Instagram Growth Guide 2026', desc: 'The complete guide to growing on Instagram — Reels, Stories, SEO, and algorithm tips.' },
  { icon: MessageCircle, title: 'X (Twitter) Strategy Guide', desc: 'How to build authority and grow your audience on X in the post-algorithm era.' },
  { icon: Smartphone, title: 'TikTok for Business Guide', desc: 'The complete TikTok playbook for brands and creators looking to grow their presence.' },
  { icon: BookOpen, title: 'LinkedIn Content Playbook', desc: 'Turn your LinkedIn into a lead generation machine with proven content frameworks.' },
];

const webinars = [
  { title: 'Mastering AI for Social Media', date: 'June 12, 2026', status: 'upcoming' },
  { title: 'Content Batching Masterclass', date: 'June 19, 2026', status: 'upcoming' },
  { title: 'How to Boost Engagement on Instagram', date: 'May 15, 2026', status: 'past' },
  { title: 'Social Media ROI: Measuring What Matters', date: 'May 8, 2026', status: 'past' },
];

export default function ResourcesPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-violet-600 -top-32 -left-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-cyan-500 -bottom-24 -right-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Resources</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Free tools, templates, and <span className="gradient-text">knowledge</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Level up your social media game with free tools, downloadable templates, in-depth guides, and expert webinars.
          </p>
        </div>
      </section>

      {/* Free Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Free Tools</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeTools.map((t) => (
              <div key={t.title} className="feature-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <t.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-violet-400 font-medium">
                  Try it free <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Templates */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Templates</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t) => (
              <div key={t.title} className="feature-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <t.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-pink-400 font-medium">
                  Download free <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Guides */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Guides</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((g) => (
              <div key={g.title} className="feature-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <g.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{g.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{g.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-cyan-400 font-medium">
                  Read guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Webinars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Webinars</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {webinars.map((w) => (
              <div key={w.title} className="feature-card p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{w.title}</h3>
                  <p className="text-sm text-slate-400">{w.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  w.status === 'upcoming'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                }`}>
                  {w.status === 'upcoming' ? 'Upcoming' : 'Watch Recording'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to put it all into practice?</h2>
            <p className="text-slate-400 mb-8">Start using SocialMarketly for free and apply everything you&apos;ve learned.</p>
            <Link href="/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
