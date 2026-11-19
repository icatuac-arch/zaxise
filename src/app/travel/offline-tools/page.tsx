'use client'

import { COUNTRIES } from '@/data/travel/destinations'

const DOWNLOAD_CHECKLIST = [
  'Offline maps for every city you plan to visit.',
  'Translation app with downloaded language packs.',
  'Digital copies of passport, visa, and travel insurance.',
  'Hotel and flight confirmation PDFs.',
  'Emergency contact list saved in notes app.',
  'Currency converter app with offline rates.',
  'Local transit maps and schedules.',
  'Restaurant and attraction lists with addresses saved offline.',
  'Travel guidebook PDF or e-book.',
  'Phrasebook for the local language.',
]

const MAP_APPS = [
  {
    name: 'Maps.me',
    description: 'Free, detailed offline maps powered by OpenStreetMap. Excellent for walking navigation, hiking trails, and finding nearby points of interest without data.',
    platforms: 'iOS, Android',
    pros: ['Completely free', 'Very detailed maps', 'Great for hiking trails', 'Bookmarks and route planning'],
    tip: 'Download country maps before your trip — they can be 100-500 MB each.',
  },
  {
    name: 'Google Maps (Offline)',
    description: 'Download specific map regions for offline use. Includes turn-by-turn driving navigation, business listings, and reviews.',
    platforms: 'iOS, Android',
    pros: ['Familiar interface', 'Offline driving navigation', 'Business hours and reviews cached', 'Auto-updates downloaded areas on Wi-Fi'],
    tip: 'Tap your profile picture, then "Offline maps" to download areas. Each area expires after 30 days.',
  },
  {
    name: 'OsmAnd',
    description: 'Open-source offline maps with advanced features for hikers and cyclists. Supports GPX track import, contour lines, and hillshade overlays.',
    platforms: 'iOS, Android',
    pros: ['Highly customizable', 'Topographic maps', 'GPX support', 'No tracking or ads (paid version)'],
    tip: 'The free version limits downloads to 7 maps. The paid version is a one-time purchase.',
  },
]

const TRANSLATION_APPS = [
  {
    name: 'Google Translate',
    description: 'Download language packs for fully offline text translation. Camera mode translates signs and menus in real-time. Conversation mode handles two-way spoken translation.',
    platforms: 'iOS, Android',
    languages: '100+ languages, 59 available offline',
    features: ['Camera translation (point at signs/menus)', 'Conversation mode', 'Handwriting input', 'Phrasebook with starred translations'],
    tip: 'Download language packs on Wi-Fi before your trip. Japanese, Thai, and Hindi packs are each about 40-50 MB.',
  },
  {
    name: 'iTranslate',
    description: 'Polished translation app with offline mode, voice-to-voice translation, and a lens feature for translating text in images.',
    platforms: 'iOS, Android',
    languages: '100+ languages, offline requires premium',
    features: ['Voice-to-voice translation', 'Lens mode for signs and menus', 'Verb conjugation tables', 'Website translation'],
    tip: 'The free version is online-only. Offline packs require iTranslate Pro.',
  },
]

const CURRENCY_APPS = [
  {
    name: 'XE Currency',
    description: 'Industry-standard exchange rate app. Caches the last updated rates for offline use. Supports every world currency and precious metals.',
    platforms: 'iOS, Android, Web',
    tip: 'Open the app once on Wi-Fi each morning to refresh rates. Cached rates remain available offline all day.',
  },
  {
    name: 'Currency (by Jeffrey Grossman)',
    description: 'Clean, minimalist currency converter with Apple Watch support. Automatically caches rates for offline use.',
    platforms: 'iOS',
    tip: 'Set your home currency and destination currencies as favorites for quick conversion.',
  },
]

const PACKING_LISTS: { type: string; icon: string; items: string[] }[] = [
  {
    type: 'City Trip',
    icon: '\uD83C\uDFD9\uFE0F',
    items: [
      'Comfortable walking shoes (broken in)',
      'Daypack or crossbody anti-theft bag',
      'Portable phone charger (10,000+ mAh)',
      'Universal power adapter',
      'Light rain jacket or compact umbrella',
      'Smart casual outfit for restaurants',
      'Reusable water bottle',
      'Photocopies of documents in a separate bag',
    ],
  },
  {
    type: 'Beach Vacation',
    icon: '\uD83C\uDFD6\uFE0F',
    items: [
      'Reef-safe sunscreen (SPF 50+)',
      'Swimsuit (pack two for rotation)',
      'Quick-dry towel',
      'Water shoes or sandals',
      'Snorkel gear (if space allows)',
      'Waterproof phone pouch',
      'Aloe vera gel for sunburn',
      'Light cover-up for beach-to-town transitions',
    ],
  },
  {
    type: 'Hiking Trip',
    icon: '\u26F0\uFE0F',
    items: [
      'Broken-in hiking boots with ankle support',
      'Moisture-wicking base layers',
      'Waterproof outer shell',
      'Trekking poles (collapsible)',
      'First aid kit with blister supplies',
      'Headlamp with extra batteries',
      'Trail snacks (nuts, energy bars, dried fruit)',
      'Water purification tablets or filter',
    ],
  },
  {
    type: 'Cold Weather',
    icon: '\u2744\uFE0F',
    items: [
      'Thermal base layers (merino wool)',
      'Insulated down or synthetic jacket',
      'Waterproof outer layer',
      'Warm hat, gloves, and scarf',
      'Insulated waterproof boots',
      'Hand warmers',
      'Lip balm with SPF',
      'Moisturizer (cold air dries skin fast)',
    ],
  },
]

const ESIM_OPTIONS = [
  { name: 'Airalo', description: 'eSIMs for 200+ countries. Buy and install before you fly. Plans start at $4.50 for 1 GB.', tip: 'Install the eSIM before departure — activation just requires a data connection.' },
  { name: 'Holafly', description: 'Unlimited data eSIMs for 60+ countries. Flat daily rate, no throttling.', tip: 'Great for heavy data users. Check if your destination offers unlimited plans.' },
  { name: 'Nomad', description: 'Affordable regional eSIMs covering multiple countries in one plan (e.g., all of Europe or Southeast Asia).', tip: 'Regional plans are more cost-effective if you are visiting multiple countries in one trip.' },
]

const PHONE_SETUP_STEPS = [
  'Check that your phone supports eSIM (most phones from 2020 onwards do).',
  'Purchase and install an eSIM for your destination before departure.',
  'Download offline maps for every city on your itinerary.',
  'Save your accommodation addresses in Google Maps or Maps.me as starred/bookmarked locations.',
  'Store emergency contacts in your phone\'s emergency info (accessible from lock screen).',
  'Download offline translation packs for destination languages.',
  'Save digital copies of your passport, visa, insurance, and flight confirmations.',
  'Enable Find My Device / Find My iPhone in case your phone is lost or stolen.',
  'Set up a VPN if traveling to countries with internet restrictions.',
  'Charge a portable battery pack and pack your charging cables.',
]

export default function OfflineToolsPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Offline Travel Tools</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Apps, checklists, and resources to prepare before you go — so you are never stranded without a connection.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Download Checklist */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Download Before You Go</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ol className="space-y-3">
              {DOWNLOAD_CHECKLIST.map((item, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Offline Map Apps */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Offline Map Apps</h2>
          <div className="space-y-4">
            {MAP_APPS.map((app) => (
              <div key={app.name} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <h3 className="font-serif text-xl font-semibold text-[#0F172A]">{app.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium w-fit">{app.platforms}</span>
                </div>
                <p className="text-[#0F172A]/80 mb-3">{app.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {app.pros.map((pro, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{pro}</span>
                  ))}
                </div>
                <div className="bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                  <p className="text-sm text-[#0F172A]/70">
                    <span className="font-semibold text-[#F59E0B]">Tip:</span> {app.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Translation Apps */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Offline Translation Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRANSLATION_APPS.map((app) => (
              <div key={app.name} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-[#0F172A] mb-1">{app.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium">{app.platforms}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">{app.languages}</span>
                </div>
                <p className="text-sm text-[#0F172A]/80 mb-3">{app.description}</p>
                <ul className="space-y-1 mb-3">
                  {app.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#0F172A]">
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                  <p className="text-sm text-[#0F172A]/70">
                    <span className="font-semibold text-[#F59E0B]">Tip:</span> {app.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Currency Converter Apps */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Currency Converter Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRENCY_APPS.map((app) => (
              <div key={app.name} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <h3 className="font-serif text-xl font-semibold text-[#0F172A]">{app.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium w-fit">{app.platforms}</span>
                </div>
                <p className="text-sm text-[#0F172A]/80 mb-3">{app.description}</p>
                <div className="bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                  <p className="text-sm text-[#0F172A]/70">
                    <span className="font-semibold text-[#F59E0B]">Tip:</span> {app.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Info Cards */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Emergency Info Cards</h2>
          <p className="text-[#0F172A]/70 mb-4">
            Print these cards (Ctrl+P / Cmd+P) and keep them in your wallet. Each card shows emergency numbers for the country you are visiting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
            {COUNTRIES.map((country) => (
              <div
                key={country.id}
                className="bg-white rounded-xl border-2 border-[#E2E8F0] p-5 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-[#E2E8F0] pb-3 print:border-black">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0F172A]">{country.name}</h3>
                    <p className="text-xs text-[#0F172A]/60">Emergency Numbers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {country.emergencyNumbers.map((num, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-[#0F172A]/80">{num.service}</span>
                      <span className="font-mono font-bold text-[#0EA5E9] text-lg print:text-black">{num.number}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#E2E8F0] print:border-black">
                  <p className="text-xs text-[#0F172A]/50">Currency: {country.currency.code} ({country.currency.symbol}) | Language: {country.language.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Packing Checklists */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Packing Checklists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PACKING_LISTS.map((list) => (
              <div key={list.type} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <span className="text-2xl">{list.icon}</span>
                  {list.type}
                </h3>
                <ul className="space-y-2">
                  {list.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[#0F172A] text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-[#E2E8F0] mt-0.5 print:border-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Essential Phone Setup */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Essential Phone Setup</h2>

          {/* eSIM Options */}
          <h3 className="font-serif text-2xl font-semibold text-[#0F172A] mb-4">eSIM Providers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {ESIM_OPTIONS.map((opt) => (
              <div key={opt.name} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-semibold text-[#0EA5E9] mb-2">{opt.name}</h4>
                <p className="text-sm text-[#0F172A]/80 mb-3">{opt.description}</p>
                <div className="bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                  <p className="text-xs text-[#0F172A]/70">
                    <span className="font-semibold text-[#F59E0B]">Tip:</span> {opt.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Setup Steps */}
          <h3 className="font-serif text-2xl font-semibold text-[#0F172A] mb-4">Pre-Trip Phone Checklist</h3>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ol className="space-y-3">
              {PHONE_SETUP_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
