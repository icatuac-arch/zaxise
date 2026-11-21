import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';

const articles = [
  {
    title: '10 Social Media Trends for 2026',
    excerpt: 'From AI-generated content to short-form video dominance, discover the top trends shaping social media this year and how to leverage them for growth.',
    category: 'Trends',
    readTime: '8 min read',
    date: 'May 20, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'How to Grow Your Instagram to 10K Followers',
    excerpt: 'A step-by-step guide to growing your Instagram following organically. From content strategy to hashtag optimization, learn what actually works in 2026.',
    category: 'Growth',
    readTime: '12 min read',
    date: 'May 18, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'The Best Times to Post on Every Platform',
    excerpt: 'A research-backed guide to the optimal posting times for Instagram, Facebook, X, LinkedIn, TikTok, and YouTube based on industry data.',
    category: 'Strategy',
    readTime: '6 min read',
    date: 'May 15, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'AI in Social Media: A Complete Guide',
    excerpt: 'How AI is transforming social media marketing — from content creation to audience targeting. Learn how to use AI tools effectively without losing authenticity.',
    category: 'AI & Tech',
    readTime: '10 min read',
    date: 'May 12, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Content Calendar Templates (Free Download)',
    excerpt: 'Download our free content calendar templates for Instagram, TikTok, LinkedIn, and multi-platform use. Plan your content strategy like a pro.',
    category: 'Resources',
    readTime: '5 min read',
    date: 'May 10, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Hashtag Strategy: A Complete Guide',
    excerpt: 'The complete guide to hashtag strategy in 2026. Learn how to research, test, and optimize hashtags for better reach on every platform.',
    category: 'Strategy',
    readTime: '9 min read',
    date: 'May 8, 2026',
    author: 'SocialMarketly Team',
    gradient: 'from-indigo-500 to-violet-600',
  },
];

export default function BlogPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-violet-600 -top-32 -left-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-pink-600 -bottom-24 -right-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Blog</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Social media tips, trends &{' '}
            <span className="gradient-text">strategies</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Expert insights to help you grow your audience, create better content, and master social media marketing.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="feature-card p-8 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-xs font-semibold text-violet-400 bg-violet-500/20 px-3 py-1 rounded-full mb-4">Featured</span>
              <h2 className="text-3xl font-bold text-white mb-4">{articles[0].title}</h2>
              <p className="text-slate-400 leading-relaxed mb-6">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {articles[0].author}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {articles[0].readTime}</span>
                <span>{articles[0].date}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-violet-400 font-medium">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="glass rounded-xl h-64 flex items-center justify-center">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${articles[0].gradient} opacity-30`} />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <div key={article.title} className="feature-card overflow-hidden group">
                <div className="h-40 flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${article.gradient} opacity-30`} />
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-semibold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Stay in the loop</h2>
            <p className="text-slate-400 mb-8">Get the latest social media tips and SocialMarketly updates delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
              <button className="btn-primary px-6 py-3 rounded-xl">
                <span className="relative z-10">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
