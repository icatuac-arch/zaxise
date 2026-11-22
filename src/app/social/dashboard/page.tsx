'use client';

import Link from 'next/link';
import {
  BarChart3, Calendar, Clock, TrendingUp, Users, Eye, Heart,
  MessageCircle, Share2, ArrowRight, Bell, Search, Plus, Settings,
  Sparkles, Camera, Send, AtSign
} from 'lucide-react';

const scheduledPosts = [
  { platform: 'Instagram', time: '10:00 AM', title: 'New product launch announcement with behind-the-scenes...', status: 'Scheduled', color: '#E4405F' },
  { platform: 'Twitter/X', time: '11:30 AM', title: 'Industry insights thread about social media trends 2026...', status: 'Scheduled', color: '#1DA1F2' },
  { platform: 'LinkedIn', time: '2:00 PM', title: 'Thought leadership article on industry trends...', status: 'In Review', color: '#0A66C2' },
  { platform: 'TikTok', time: '5:00 PM', title: 'Quick tutorial: 3 tips for better video editing...', status: 'Draft', color: '#FF0050' },
  { platform: 'Facebook', time: '6:30 PM', title: 'Community poll: What content do you want to see next?', status: 'Scheduled', color: '#1877F2' },
];

const recentActivity = [
  { action: 'Post published on Instagram', time: 'Sample activity', icon: Camera },
  { action: 'New comment received on post', time: 'Sample activity', icon: AtSign },
  { action: 'Team member approved a post', time: 'Sample activity', icon: Users },
  { action: 'Weekly analytics report ready', time: 'Sample activity', icon: BarChart3 },
];

export default function DashboardPage() {
  return (
    <div className="relative">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="bg-orb w-[400px] h-[400px] bg-violet-600 -top-32 -right-32" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">Dashboard Preview</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Your command center for <span className="gradient-text-violet">social media</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            This is a preview of what your SocialMarketly dashboard looks like. Sign up free to get your own.
          </p>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass rounded-2xl overflow-hidden glow-border">
            {/* Top Bar */}
            <div className="bg-slate-900/80 border-b border-slate-700/50 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-violet-400" />
                <span className="font-bold text-white">SocialMarketly</span>
                <div className="hidden sm:flex items-center gap-1 ml-4 px-3 py-1.5 bg-slate-800 rounded-lg">
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">Search...</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <Bell className="w-5 h-5 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <Settings className="w-5 h-5 text-slate-400" />
                </button>
                <div className="w-8 h-8 rounded-full gradient-violet-pink flex items-center justify-center">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="hidden md:block w-56 bg-slate-900/60 border-r border-slate-700/50 p-4 min-h-[600px]">
                <div className="space-y-1">
                  {[
                    { icon: BarChart3, label: 'Dashboard', active: true },
                    { icon: Calendar, label: 'Calendar', active: false },
                    { icon: Clock, label: 'Scheduled', active: false },
                    { icon: Sparkles, label: 'AI Writer', active: false },
                    { icon: BarChart3, label: 'Analytics', active: false },
                    { icon: Users, label: 'Team', active: false },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-violet-500/20 text-violet-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="section-divider my-4" />
                <p className="text-xs text-slate-500 px-3 mb-2 uppercase tracking-wider">Accounts</p>
                <div className="space-y-2 px-1">
                  {[
                    { name: '@brandname', platform: 'Instagram', color: '#E4405F' },
                    { name: '@brandname', platform: 'Twitter/X', color: '#1DA1F2' },
                    { name: 'Brand Name', platform: 'LinkedIn', color: '#0A66C2' },
                    { name: '@brandtiktok', platform: 'TikTok', color: '#FF0050' },
                    { name: 'Brand Page', platform: 'Facebook', color: '#1877F2' },
                  ].map((acc) => (
                    <div key={acc.platform} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm">
                      <div className="w-2 h-2 rounded-full" style={{ background: acc.color }} />
                      <span className="text-slate-400 text-xs">{acc.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Welcome & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Good morning!</h2>
                    <p className="text-slate-400 text-sm">Here is what is happening with your social accounts today.</p>
                  </div>
                  <button className="btn-primary px-4 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
                    <span className="relative z-10 flex items-center gap-2"><Plus className="w-4 h-4" /> Create Post</span>
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Followers', value: '—', change: 'Connect accounts to see', icon: Users, trend: 'neutral', color: 'text-slate-400' },
                    { label: 'Engagement Rate', value: '—', change: 'Your data will appear here', icon: Heart, trend: 'neutral', color: 'text-slate-400' },
                    { label: 'Posts This Week', value: '—', change: 'Schedule posts to track', icon: Calendar, trend: 'neutral', color: 'text-slate-400' },
                    { label: 'Total Impressions', value: '—', change: 'Real-time tracking', icon: Eye, trend: 'neutral', color: 'text-slate-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 hover:border-violet-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className="w-5 h-5 text-slate-500" />
                        <TrendingUp className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                    </div>
                  ))}
                </div>

                {/* Chart + Activity */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-2 bg-slate-800/40 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Engagement Overview</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-300">7 days</span>
                        <span className="px-2 py-1 rounded text-slate-500 hover:bg-slate-700 cursor-pointer">30 days</span>
                        <span className="px-2 py-1 rounded text-slate-500 hover:bg-slate-700 cursor-pointer">90 days</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                      {[
                        { day: 'Mon', likes: 65, comments: 30, shares: 15 },
                        { day: 'Tue', likes: 80, comments: 45, shares: 20 },
                        { day: 'Wed', likes: 55, comments: 25, shares: 18 },
                        { day: 'Thu', likes: 90, comments: 50, shares: 30 },
                        { day: 'Fri', likes: 70, comments: 35, shares: 22 },
                        { day: 'Sat', likes: 95, comments: 55, shares: 35 },
                        { day: 'Sun', likes: 85, comments: 40, shares: 28 },
                      ].map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col gap-0.5">
                            <div className="w-full rounded-t" style={{ height: `${d.likes}%`, background: 'linear-gradient(to top, #7C3AED, #A855F7)' }} />
                            <div className="w-full" style={{ height: `${d.comments}%`, background: 'linear-gradient(to top, #EC4899, #F472B6)' }} />
                            <div className="w-full rounded-b" style={{ height: `${d.shares}%`, background: 'linear-gradient(to top, #06B6D4, #22D3EE)' }} />
                          </div>
                          <span className="text-xs text-slate-500 mt-1">{d.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-500" /><span className="text-xs text-slate-400">Likes</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-pink-500" /><span className="text-xs text-slate-400">Comments</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-cyan-500" /><span className="text-xs text-slate-400">Shares</span></div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30">
                    <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                            <a.icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-300">{a.action}</p>
                            <p className="text-xs text-slate-500">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scheduled Posts */}
                <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Upcoming Scheduled Posts</h3>
                    <span className="text-xs text-violet-400 cursor-pointer hover:text-violet-300">View All</span>
                  </div>
                  <div className="space-y-3">
                    {scheduledPosts.map((post, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">
                        <div className="w-2 h-8 rounded-full" style={{ background: post.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{post.title}</p>
                          <p className="text-xs text-slate-500">{post.platform} &middot; {post.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.status === 'Scheduled' ? 'bg-emerald-500/20 text-emerald-400' :
                          post.status === 'In Review' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-600/30 text-slate-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">This is just a preview. Sign up to get your own dashboard.</p>
            <Link href="/social/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
              Get Your Free Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
