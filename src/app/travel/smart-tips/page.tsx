'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  SEASONAL_ADVICE,
  FIRST_TIMER_TIPS,
  GENERAL_FIRST_TIMER_TIPS,
  BUDGET_HACKS,
  SAFETY_SMART_TIPS,
} from '@/data/travel/smart-tips'

const COUNTRY_LABELS: Record<string, { name: string; flag: string }> = {
  japan: { name: 'Japan', flag: '🇯🇵' },
  italy: { name: 'Italy', flag: '🇮🇹' },
  thailand: { name: 'Thailand', flag: '🇹🇭' },
  france: { name: 'France', flag: '🇫🇷' },
  india: { name: 'India', flag: '🇮🇳' },
}

const COUNTRY_SLUGS = ['japan', 'italy', 'thailand', 'france', 'india']

const EARLY_BIRD_EXAMPLES = [
  {
    country: 'Japan',
    flag: '🇯🇵',
    peak: 'Cherry blossom season (late March - April)',
    earlyWindow: 'First 2 weeks of March',
    benefit: 'Catch early blooms, 40% fewer crowds, 30% lower prices',
  },
  {
    country: 'Italy',
    flag: '🇮🇹',
    peak: 'Summer (June - August)',
    earlyWindow: 'Last week of May',
    benefit: 'Warm weather already here, summer crowds haven\'t arrived, 25% cheaper hotels',
  },
  {
    country: 'Thailand',
    flag: '🇹🇭',
    peak: 'Cool season (November - February)',
    earlyWindow: 'Last 2 weeks of October',
    benefit: 'Rains ending, beaches empty, cheapest flights of the year',
  },
  {
    country: 'France',
    flag: '🇫🇷',
    peak: 'Summer (June - August)',
    earlyWindow: 'Last 2 weeks of May',
    benefit: 'Perfect weather, no summer crowds, museum lines are short',
  },
  {
    country: 'India',
    flag: '🇮🇳',
    peak: 'Cool season (October - March)',
    earlyWindow: 'Last week of September',
    benefit: 'Monsoon ends, air is clean, landscapes are green, lowest prices',
  },
]

export default function SmartTipsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [firstTimerCountry, setFirstTimerCountry] = useState<string>('japan')

  const filteredAdvice =
    selectedCountry === 'all'
      ? SEASONAL_ADVICE
      : SEASONAL_ADVICE.filter((s) => s.country === selectedCountry)

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white">Smart Travel Tips</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">💡</span>
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
                Smart Travel Tips &amp; Recommendations
              </h1>
              <p className="text-xl text-white/80 mt-2">
                Insider advice to travel smarter, cheaper, and better
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">

        {/* Country Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCountry === 'all'
                ? 'bg-[#0EA5E9] text-white shadow-md'
                : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
            }`}
          >
            All Countries
          </button>
          {COUNTRY_SLUGS.map((slug) => (
            <button
              key={slug}
              onClick={() => setSelectedCountry(slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCountry === slug
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
              }`}
            >
              <span>{COUNTRY_LABELS[slug].flag}</span>
              {COUNTRY_LABELS[slug].name}
            </button>
          ))}
        </div>

        {/* When to Really Go */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">When to Really Go</h2>
          <p className="text-slate-500 mb-8">
            Peak season isn&apos;t always the best season. Here&apos;s when to actually visit.
          </p>
          <div className="space-y-8">
            {filteredAdvice.map((advice) => {
              const label = COUNTRY_LABELS[advice.country]
              return (
                <div
                  key={advice.country}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#0EA5E9]/5 to-transparent px-6 py-4 border-b border-[#E2E8F0]">
                    <h3 className="font-serif text-2xl font-bold text-[#0F172A] flex items-center gap-3">
                      <span className="text-3xl">{label?.flag}</span>
                      {label?.name}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Peak */}
                      <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-sm">🔥</span>
                          <div>
                            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Peak Season</span>
                            <p className="text-sm font-bold text-red-800">{advice.peakSeason.months}</p>
                          </div>
                        </div>
                        <p className="text-sm text-red-700 leading-relaxed">{advice.peakSeason.why}</p>
                      </div>
                      {/* Shoulder */}
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-sm">✨</span>
                          <div>
                            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Shoulder Season</span>
                            <p className="text-sm font-bold text-amber-800">{advice.shoulderSeason.months}</p>
                          </div>
                        </div>
                        <p className="text-sm text-amber-700 leading-relaxed">{advice.shoulderSeason.why}</p>
                        <p className="text-xs font-semibold text-amber-600 mt-2 bg-amber-100 rounded-full px-3 py-1 inline-block">
                          {advice.shoulderSeason.savings}
                        </p>
                      </div>
                      {/* Off */}
                      <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sm">❄️</span>
                          <div>
                            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Off Season</span>
                            <p className="text-sm font-bold text-sky-800">{advice.offSeason.months}</p>
                          </div>
                        </div>
                        <p className="text-sm text-sky-700 leading-relaxed">{advice.offSeason.why}</p>
                        <p className="text-xs font-semibold text-sky-600 mt-2 bg-sky-100 rounded-full px-3 py-1 inline-block">
                          {advice.offSeason.savings}
                        </p>
                      </div>
                    </div>

                    {/* Pro Tip Callout */}
                    <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
                        <div>
                          <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">Pro Tip</span>
                          <p className="text-sm text-amber-900 leading-relaxed mt-1 font-medium">{advice.proTip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* The 1-2 Weeks Early Rule */}
        <section>
          <div className="bg-gradient-to-br from-[#0EA5E9]/5 via-white to-amber-50 rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎯</span>
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#0F172A]">The 1-2 Weeks Early Rule</h2>
                <p className="text-slate-500 mt-1">The single best travel hack we know</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8">
              <p className="text-lg text-[#0F172A] leading-relaxed">
                Arriving <strong>1-2 weeks before peak season</strong> gives you <strong>80% of the experience at 60% of the cost</strong>.
                You get lower hotel prices, shorter queues, fewer crowds, and nearly the same weather. The attractions are all open,
                the locals aren&apos;t yet overwhelmed, and you travel like an insider rather than a tourist.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-emerald-200 p-4">
                <h4 className="font-bold text-emerald-700 flex items-center gap-2 text-sm">
                  <span>✅</span> What You Get
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#8226;</span> 30-40% lower accommodation prices</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#8226;</span> 50-80% shorter queues at attractions</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#8226;</span> More authentic local interactions</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#8226;</span> Better restaurant availability</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#8226;</span> Cheaper flights</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-red-200 p-4">
                <h4 className="font-bold text-red-700 flex items-center gap-2 text-sm">
                  <span>⚠️</span> What You Might Miss
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#8226;</span> Full bloom / peak colors (but early is often still beautiful)</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#8226;</span> Some seasonal festivals</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#8226;</span> Slightly less predictable weather</li>
                </ul>
              </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#0F172A] mb-4">Country-by-Country Examples</h3>
            <div className="space-y-3">
              {EARLY_BIRD_EXAMPLES.map((ex) => (
                <div key={ex.country} className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-2xl">{ex.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#0F172A] text-sm">{ex.country}</h4>
                    <p className="text-xs text-slate-500">Peak: {ex.peak}</p>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[#0EA5E9]">{ex.earlyWindow}</p>
                    <p className="text-xs text-slate-500">{ex.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* First-Timer Essentials */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">First-Timer Essentials</h2>
          <p className="text-slate-500 mb-8">
            Things you wish someone had told you before your first trip
          </p>

          {/* General tips */}
          <div className="bg-gradient-to-r from-sky-50 to-[#FAFBFC] rounded-2xl border border-sky-100 p-6 mb-8">
            <h3 className="font-serif text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <span>🌍</span> For Any International Trip
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GENERAL_FIRST_TIMER_TIPS.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{tip.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Country selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {COUNTRY_SLUGS.map((slug) => (
              <button
                key={slug}
                onClick={() => setFirstTimerCountry(slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  firstTimerCountry === slug
                    ? 'bg-[#0EA5E9] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
                }`}
              >
                <span>{COUNTRY_LABELS[slug].flag}</span>
                {COUNTRY_LABELS[slug].name}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(FIRST_TIMER_TIPS[firstTimerCountry] || []).map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{tip.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Budget Hacks */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Budget Hacks</h2>
          <p className="text-slate-500 mb-8">
            Travel better without spending more. These tips save real money.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUDGET_HACKS.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{tip.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Smarts */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Safety Smarts</h2>
          <p className="text-slate-500 mb-8">
            Quick safety tips to keep you protected on the road
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {SAFETY_SMART_TIPS.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{tip.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/travel/safety"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0EA5E9] text-white font-medium rounded-full hover:bg-[#0284C7] transition-colors shadow-md"
            >
              View Full Safety Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
