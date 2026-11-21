import Link from 'next/link';
import {
  Calendar, BarChart3, Sparkles, Smartphone, Users, LayoutGrid,
  Hash, Palette, ArrowRight, CheckCircle, Inbox, Ear, DollarSign,
  LinkIcon, Upload, Compass, Building2
} from 'lucide-react';

const allFeatures = [
  {
    icon: Calendar, title: 'Smart Scheduler', href: '/features/scheduler',
    desc: 'Schedule posts across all platforms with AI-powered timing optimization. Queue content for weeks ahead, set recurring posts, and let our algorithm pick the best times for maximum engagement.',
    gradient: 'from-violet-500 to-purple-600',
    highlights: ['AI-optimized posting times', 'Bulk scheduling', 'Queue management', 'Auto-posting'],
  },
  {
    icon: BarChart3, title: 'Analytics Dashboard', href: '/features/analytics',
    desc: 'Track engagement, reach, follower growth, and more with beautiful visual reports. Understand what content performs best and make data-driven decisions.',
    gradient: 'from-cyan-500 to-blue-600',
    highlights: ['Real-time metrics', 'Cross-platform reports', 'Growth tracking', 'Export reports'],
  },
  {
    icon: Sparkles, title: 'AI Content Creator', href: '/features/ai-writer',
    desc: 'Generate captions, hashtags, post ideas, and full content strategies with our built-in AI. Never stare at a blank screen again.',
    gradient: 'from-pink-500 to-rose-600',
    highlights: ['Caption generation', 'Hashtag suggestions', 'Content ideas', 'Tone customization'],
  },
  {
    icon: Inbox, title: 'Social Inbox', href: '/features/inbox',
    desc: 'One unified inbox for every DM, comment, and mention across all platforms. Smart labels, team assignment, and resolution tracking — never miss a message.',
    gradient: 'from-violet-500 to-indigo-600',
    highlights: ['Unified messages', 'Smart labels', 'Team assignment', 'Saved replies'],
  },
  {
    icon: Ear, title: 'Social Listening', href: '/features/listening',
    desc: 'Monitor brand mentions across the internet. Track competitor keywords, analyze sentiment, and get real-time alerts when your brand is mentioned.',
    gradient: 'from-cyan-500 to-teal-600',
    highlights: ['Brand monitoring', 'Sentiment analysis', 'Competitor tracking', 'Real-time alerts'],
  },
  {
    icon: DollarSign, title: 'ROI Tracking', href: '/features/roi',
    desc: 'Measure actual sales and leads from social posts. Built-in UTM link builder, revenue attribution, and monthly ROI reports.',
    gradient: 'from-emerald-500 to-green-600',
    highlights: ['Revenue attribution', 'UTM builder', 'Conversion tracking', 'Monthly reports'],
  },
  {
    icon: Smartphone, title: 'Multi-Platform Support', href: '/features/scheduler',
    desc: 'One dashboard for Instagram, Facebook, X, LinkedIn, TikTok, YouTube, Pinterest, and Threads. Manage everything from a single, unified interface.',
    gradient: 'from-amber-500 to-orange-600',
    highlights: ['8+ platforms', 'Unified inbox', 'Cross-posting', 'Platform-specific formatting'],
  },
  {
    icon: Users, title: 'Team Collaboration', href: '/features/team',
    desc: 'Invite your team, assign roles, and set up approval workflows. Perfect for agencies managing multiple clients and brands.',
    gradient: 'from-emerald-500 to-teal-600',
    highlights: ['Role-based access', 'Approval workflows', 'Team chat', 'Activity logs'],
  },
  {
    icon: LayoutGrid, title: 'Content Calendar', href: '/features/calendar',
    desc: 'Visual drag-and-drop calendar to see your entire content strategy at a glance. Plan weeks and months ahead with ease.',
    gradient: 'from-indigo-500 to-violet-600',
    highlights: ['Drag-and-drop', 'Monthly view', 'Color coding', 'Content templates'],
  },
  {
    icon: LinkIcon, title: 'Link in Bio', href: '/features/link-in-bio',
    desc: 'Beautiful customizable landing page for your bio link. Unlimited links, full analytics, themes, and custom branding — a free Linktree alternative.',
    gradient: 'from-pink-500 to-rose-600',
    highlights: ['Unlimited links', 'Click analytics', 'Custom themes', 'Custom domain'],
  },
  {
    icon: Upload, title: 'Bulk Upload', href: '/features/bulk-upload',
    desc: 'Schedule a month of content in minutes. Import from CSV, map columns to post fields, preview everything, and publish in bulk.',
    gradient: 'from-amber-500 to-orange-600',
    highlights: ['CSV import', 'Smart mapping', 'Bulk preview', 'Template download'],
  },
  {
    icon: Compass, title: 'Content Discovery', href: '/features/content-discovery',
    desc: 'Never run out of ideas. Holiday calendar, RSS feeds, trending topics, and an AI-powered content inspiration engine.',
    gradient: 'from-indigo-500 to-purple-600',
    highlights: ['Holiday calendar', 'RSS integration', 'Trending topics', 'AI inspiration'],
  },
  {
    icon: Hash, title: 'Hashtag Research', href: '/features/hashtags',
    desc: 'Discover trending hashtags, track their performance over time, and save groups for quick reuse. Maximize your content reach.',
    gradient: 'from-sky-500 to-cyan-600',
    highlights: ['Trending hashtags', 'Performance tracking', 'Saved groups', 'Competition analysis'],
  },
  {
    icon: Palette, title: 'Image Studio', href: '/features/image-studio',
    desc: 'Edit, resize, add text, and apply filters to images. Use platform-optimized templates to create scroll-stopping visuals.',
    gradient: 'from-rose-500 to-pink-600',
    highlights: ['Image editor', 'Resize for platforms', 'Templates', 'Brand kit'],
  },
  {
    icon: Building2, title: 'White Label', href: '/features/white-label',
    desc: 'Remove SocialMarketly branding and present the platform as your own. Custom branded reports, client portals, and custom domains for agencies.',
    gradient: 'from-slate-500 to-zinc-600',
    highlights: ['Branded reports', 'Client portal', 'Custom domain', 'No our branding'],
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-violet-600 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-pink-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Features</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            All the tools you need,{' '}
            <span className="gradient-text-violet">none of the cost</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From smart scheduling to AI content creation, explore every feature that makes SocialMarketly the best free social media management platform.
          </p>
        </div>
      </section>

      {/* Features List */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {allFeatures.map((f, i) => (
            <div key={f.title} className="feature-card p-8 grid md:grid-cols-2 gap-8 items-center">
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{f.title}</h2>
                <p className="text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {f.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
                <Link href={f.href} className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="glass rounded-xl p-6 h-64 flex items-center justify-center">
                  <f.icon className={`w-24 h-24 opacity-20`} style={{ color: f.gradient.includes('violet') ? '#7C3AED' : f.gradient.includes('cyan') ? '#06B6D4' : f.gradient.includes('pink') ? '#EC4899' : f.gradient.includes('amber') ? '#F59E0B' : f.gradient.includes('emerald') ? '#10B981' : f.gradient.includes('indigo') ? '#6366F1' : f.gradient.includes('sky') ? '#0EA5E9' : '#F43F5E' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-400 mb-8">All features included in the free plan. No credit card required.</p>
            <Link href="/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
              Start Free Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
