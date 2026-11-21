'use client';

import React, { useState } from 'react';

/* ─── colour tokens ─── */
const C = {
  primary: '#D97706',
  secondary: '#10B981',
  dark: '#0F172A',
  bg: '#FAFBFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
};

/* ─── tiny reusable bits ─── */
const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="mb-10 text-center">
    <h2
      className="font-serif text-3xl md:text-4xl font-bold mb-3"
      style={{ color: C.dark }}
    >
      {children}
    </h2>
    {sub && <p className="text-lg max-w-3xl mx-auto" style={{ color: '#64748B' }}>{sub}</p>}
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl shadow-sm p-6 ${className}`}
    style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
  >
    {children}
  </div>
);

const Badge = ({ children, color = C.primary }: { children: React.ReactNode; color?: string }) => (
  <span
    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2"
    style={{ backgroundColor: `${color}15`, color }}
  >
    {children}
  </span>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block text-sm font-medium px-3 py-1 rounded-full"
    style={{ backgroundColor: `${C.secondary}20`, color: C.secondary }}
  >
    {children}
  </span>
);

/* ─── data ─── */

const routes: {
  id: string;
  title: string;
  days: number;
  tag: string;
  tagColor: string;
  overview: string;
  cities: { name: string; country: string; stay: string; highlights: string[]; transport?: string; transportTime?: string; transportCost?: string }[];
  budget: { backpacker: string; midrange: string; comfort: string };
}[] = [
  {
    id: 'eastafrica',
    title: 'East Africa Safari',
    days: 10,
    tag: 'Wildlife',
    tagColor: C.primary,
    overview: 'The classic African safari experience through Kenya and Tanzania, ending with relaxation on the beaches of Zanzibar.',
    cities: [
      { name: 'Nairobi', country: 'Kenya', stay: 'Day 1', highlights: ['David Sheldrick Elephant Trust', 'Giraffe Centre', 'Nairobi National Park', 'Karen Blixen Museum'] },
      { name: 'Masai Mara', country: 'Kenya', stay: 'Days 2-4', highlights: ['Big Five game drives', 'Great Migration (Jul-Oct)', 'Maasai village visit', 'Hot air balloon safari'], transport: 'Bush plane or drive', transportTime: '45 min flight / 5h drive', transportCost: '$150-250 flight / $40 drive' },
      { name: 'Serengeti', country: 'Tanzania', stay: 'Days 5-7', highlights: ['Endless plains game drives', 'Wildebeest migration', 'Kopje rock formations', 'Big cat sightings'], transport: 'Drive via border', transportTime: '6-8 hours', transportCost: '$60-100 (transfer)' },
      { name: 'Ngorongoro Crater', country: 'Tanzania', stay: 'Day 8', highlights: ['World\'s largest caldera', 'Dense wildlife concentration', 'Black rhino sightings', 'Maasai Boma'], transport: 'Safari vehicle', transportTime: '3 hours', transportCost: 'Included in safari' },
      { name: 'Zanzibar', country: 'Tanzania', stay: 'Days 9-10', highlights: ['Stone Town UNESCO heritage', 'Spice tour', 'White sand beaches', 'Snorkeling & diving'], transport: 'Flight from Arusha', transportTime: '1.5 hours', transportCost: '$100-200' },
    ],
    budget: { backpacker: '$150-250/day', midrange: '$300-500/day', comfort: '$600-1200/day' },
  },
  {
    id: 'southernafrica',
    title: 'Southern Africa',
    days: 14,
    tag: 'Diverse',
    tagColor: '#3B82F6',
    overview: 'From cosmopolitan Cape Town through the scenic Garden Route to Kruger safaris, Victoria Falls, and the deserts of Namibia.',
    cities: [
      { name: 'Cape Town', country: 'South Africa', stay: 'Days 1-3', highlights: ['Table Mountain cable car', 'Cape of Good Hope', 'Bo-Kaap neighborhood', 'Robben Island', 'V&A Waterfront'] },
      { name: 'Garden Route', country: 'South Africa', stay: 'Days 4-6', highlights: ['Tsitsikamma canopy tour', 'Knysna lagoon & Heads', 'Bloukrans Bridge bungee', 'Storms River mouth trail'], transport: 'Rental car', transportTime: '4-5 hours to start', transportCost: '$35-60/day rental' },
      { name: 'Kruger National Park', country: 'South Africa', stay: 'Days 7-9', highlights: ['Big Five game drives', 'Self-drive safari option', 'Bush walks with rangers', 'Sunset drives'], transport: 'Domestic flight to Nelspruit', transportTime: '2 hours', transportCost: '$80-150' },
      { name: 'Victoria Falls', country: 'Zimbabwe/Zambia', stay: 'Days 10-11', highlights: ['Falls viewpoints', 'Devil\'s Pool swim (dry season)', 'Zambezi sunset cruise', 'White water rafting'], transport: 'Flight via Johannesburg', transportTime: '4 hours (1 stop)', transportCost: '$150-300' },
      { name: 'Namibia', country: 'Namibia', stay: 'Days 12-14', highlights: ['Sossusvlei dunes at sunrise', 'Deadvlei', 'Etosha National Park', 'Skeleton Coast', 'Swakopmund adventure'], transport: 'Flight to Windhoek', transportTime: '2 hours', transportCost: '$100-250' },
    ],
    budget: { backpacker: '$60-100/day', midrange: '$150-300/day', comfort: '$400-800/day' },
  },
  {
    id: 'northafrica',
    title: 'North Africa Explorer',
    days: 10,
    tag: 'Culture & History',
    tagColor: '#8B5CF6',
    overview: 'Ancient civilizations, vibrant souks, vast deserts, and Mediterranean coastlines across Morocco, Tunisia, and Egypt.',
    cities: [
      { name: 'Marrakech', country: 'Morocco', stay: 'Days 1-2', highlights: ['Jemaa el-Fnaa square', 'Bahia Palace', 'Majorelle Garden', 'Souk shopping', 'Hammam experience'] },
      { name: 'Fez', country: 'Morocco', stay: 'Day 3', highlights: ['Fez Medina (UNESCO)', 'Chouara Tanneries', 'Bou Inania Madrasa', 'Pottery workshops'], transport: 'Train', transportTime: '7 hours', transportCost: '$15-30' },
      { name: 'Sahara Desert', country: 'Morocco', stay: 'Day 4', highlights: ['Camel trek to desert camp', 'Sunrise over Erg Chebbi dunes', 'Berber drumming under stars', 'Sandboarding'], transport: 'Private transfer via Midelt', transportTime: '8 hours', transportCost: '$40-80' },
      { name: 'Tunis & Carthage', country: 'Tunisia', stay: 'Days 5-6', highlights: ['Carthage ruins', 'Sidi Bou Said blue village', 'Bardo Museum mosaics', 'Medina of Tunis'], transport: 'Flight', transportTime: '3 hours', transportCost: '$80-180' },
      { name: 'Cairo', country: 'Egypt', stay: 'Days 7-8', highlights: ['Pyramids of Giza & Sphinx', 'Egyptian Museum', 'Khan el-Khalili bazaar', 'Nile felucca ride'], transport: 'Flight', transportTime: '3 hours', transportCost: '$60-150' },
      { name: 'Luxor', country: 'Egypt', stay: 'Days 9-10', highlights: ['Valley of the Kings', 'Karnak Temple', 'Luxor Temple', 'Hot air balloon at sunrise'], transport: 'Overnight train or flight', transportTime: '10h train / 1h flight', transportCost: '$15 train / $60-120 flight' },
    ],
    budget: { backpacker: '$30-50/day', midrange: '$80-150/day', comfort: '$200-400/day' },
  },
];

const tourOperators = [
  { name: '&Beyond', url: 'andbeyond.com', desc: 'Luxury safari lodges across East and Southern Africa', who: 'Luxury travelers', price: '$$$$' },
  { name: 'African Travel Inc', url: 'africantravelinc.com', desc: 'Tailor-made safaris and cultural tours', who: 'Couples & families', price: '$$$-$$$$' },
  { name: 'Nomad Africa', url: 'nomadtours.co.za', desc: 'Overland camping and lodge tours', who: 'Adventure seekers', price: '$$' },
  { name: 'Intrepid Travel', url: 'intrepidtravel.com', desc: 'Small group responsible travel', who: 'Conscious travelers', price: '$$-$$$' },
  { name: 'G Adventures', url: 'gadventures.com', desc: 'Adventure and cultural group tours', who: 'Solo & group travelers', price: '$$-$$$' },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function AfricaGuidePage() {
  const [activeRoute, setActiveRoute] = useState('eastafrica');

  return (
    <main style={{ backgroundColor: C.bg }}>
      {/* ════════ 1. HERO ════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-32 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #92400E 40%, #78350F 70%, ${C.dark} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <p className="uppercase tracking-widest text-sm mb-4 opacity-80">Zaxise Presents</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Ultimate Africa<br />Travel Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Safari adventures, ancient civilizations, stunning landscapes, and vibrant cultures across the world&apos;s most diverse continent.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { n: '54', l: 'Countries' },
              { n: '3', l: 'Curated Routes' },
              { n: '5', l: 'Tour Operators' },
              { n: '&#x267E;', l: 'Experiences' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl md:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: s.n }} />
                <div className="text-sm opacity-80 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TABLE OF CONTENTS ════════ */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            ['#visa', 'Visa Info'],
            ['#routes', 'Safari Routes'],
            ['#transport', 'Getting Around'],
            ['#health', 'Health & Safety'],
            ['#operators', 'Tour Operators'],
            ['#budget', 'Budget Guide'],
            ['#safety', 'Safety Tips'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}30` }}
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* ════════ 2. VISA GUIDE ════════ */}
      <section id="visa" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Visa requirements vary hugely across Africa. Here is what you need for the most popular destinations.">
          Africa Visa Guide
        </SectionTitle>

        <Card className="mb-6">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>Visa Overview</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            Unlike Europe&apos;s Schengen system, Africa has no unified visa zone. Each country has its own entry requirements, and these can differ drastically. Some countries are visa-free for many nationalities, while others require advance applications with supporting documents.
          </p>
          <p className="leading-relaxed" style={{ color: '#475569' }}>
            Always check the latest requirements with the relevant embassy before travel, as visa policies change frequently across the continent.
          </p>
        </Card>

        {/* East Africa Tourist Visa */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.secondary}20` }}>
              &#127758;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>East Africa Tourist Visa</h4>
              <Badge color={C.secondary}>Multi-Country</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Countries:</strong> Kenya, Uganda, and Rwanda share a joint tourist visa.</p>
                <p><strong>Cost:</strong> $100 for a single visa that covers all three countries.</p>
                <p><strong>Duration:</strong> 90 days total. Multiple entries between the three countries allowed.</p>
                <p><strong>How to apply:</strong> Apply online through Kenya&apos;s eVisa portal or Uganda&apos;s immigration website. Apply at least 2 weeks before travel.</p>
                <p><strong>Best for:</strong> Travelers combining Kenyan safaris with gorilla trekking in Uganda or Rwanda.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* South Africa */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#10B98120' }}>
              &#10003;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>South Africa</h4>
              <Badge color="#10B981">Visa-Free for US/UK</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>US &amp; UK citizens:</strong> Visa-free for up to 90 days for tourism. Passport must be valid for 30+ days beyond departure and have 2 blank pages.</p>
                <p><strong>EU citizens:</strong> Most EU nationalities are visa-free for 90 days.</p>
                <p><strong>India:</strong> Visa required. Apply at the South African embassy/consulate. Processing takes 5-10 business days.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Egypt */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.primary}20` }}>
              &#127466;&#127468;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>Egypt</h4>
              <Badge color={C.primary}>e-Visa Available</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>e-Visa:</strong> Available for US, UK, EU, Australia, Canada, and many other nationalities. Apply at visa2egypt.gov.eg.</p>
                <p><strong>Cost:</strong> $25 (single entry, 30 days) or $60 (multiple entry, 180 days).</p>
                <p><strong>Processing:</strong> Usually approved within 5-7 business days.</p>
                <p><strong>Visa on arrival:</strong> Also available at Cairo and other international airports for eligible nationalities ($25).</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Morocco */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#10B98120' }}>
              &#10003;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>Morocco</h4>
              <Badge color="#10B981">Visa-Free 90 Days</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>US, UK &amp; EU citizens:</strong> Visa-free for up to 90 days. No advance application needed.</p>
                <p><strong>What you need:</strong> Valid passport (6+ months validity), proof of accommodation, return ticket.</p>
                <p><strong>India:</strong> Visa required. Apply at the Moroccan embassy. Processing takes 7-15 business days.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Other countries note */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Other Popular Destinations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { country: 'Tanzania', info: 'Visa on arrival or e-Visa ($50, 90 days). Required for most nationalities.' },
              { country: 'Namibia', info: 'Visa-free for US, UK, EU (90 days). Visa required for Indian nationals.' },
              { country: 'Ethiopia', info: 'e-Visa for all nationalities ($52-82, 30-90 days). Apply at evisa.gov.et.' },
              { country: 'Botswana', info: 'Visa-free for US, UK, EU (90 days). One of Africa\'s easiest entries.' },
              { country: 'Ghana', info: 'Visa required for most nationalities. Apply at embassy ($60-150).' },
              { country: 'Senegal', info: 'Visa-free for US, UK, EU (90 days). Emerging tourism destination.' },
            ].map((c) => (
              <div key={c.country} className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.dark }}>{c.country}</p>
                <p className="text-sm" style={{ color: '#475569' }}>{c.info}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 3. TOUR ROUTES ════════ */}
      <section id="routes" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Three expertly crafted routes covering East, Southern, and North Africa for every travel style.">
            Africa Safari Routes &amp; Itineraries
          </SectionTitle>

          {/* Route tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRoute(r.id)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeRoute === r.id ? C.primary : C.card,
                  color: activeRoute === r.id ? '#fff' : C.dark,
                  border: `1px solid ${activeRoute === r.id ? C.primary : C.border}`,
                }}
              >
                {r.title} ({r.days}d)
              </button>
            ))}
          </div>

          {/* Active route detail */}
          {routes.filter((r) => r.id === activeRoute).map((route) => (
            <div key={route.id}>
              <Card className="mb-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge color={route.tagColor}>{route.tag}</Badge>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold mt-2" style={{ color: C.dark }}>{route.title}</h3>
                    <p className="mt-2" style={{ color: '#64748B' }}>{route.overview}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: C.primary }}>{route.days}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>days</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { label: 'Backpacker', value: route.budget.backpacker, icon: '&#127890;' },
                    { label: 'Mid-range', value: route.budget.midrange, icon: '&#127976;' },
                    { label: 'Comfort', value: route.budget.comfort, icon: '&#10024;' },
                  ].map((b) => (
                    <div key={b.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                      <div className="text-xl mb-1" dangerouslySetInnerHTML={{ __html: b.icon }} />
                      <div className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{b.label}</div>
                      <div className="text-sm font-bold" style={{ color: C.dark }}>{b.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-4">
                {route.cities.map((city, idx) => (
                  <Card key={city.name} className="relative">
                    {idx < route.cities.length - 1 && (
                      <div className="hidden md:block absolute left-10 -bottom-4 w-0.5 h-4" style={{ backgroundColor: C.primary + '40' }} />
                    )}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: C.primary }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-serif text-lg font-bold" style={{ color: C.dark }}>{city.name}, {city.country}</h4>
                          <Pill>{city.stay}</Pill>
                        </div>

                        {city.transport && (
                          <div className="flex flex-wrap gap-4 text-xs mb-3 p-2 rounded-lg" style={{ backgroundColor: C.bg }}>
                            <span><strong>Transport:</strong> {city.transport}</span>
                            <span><strong>Time:</strong> {city.transportTime}</span>
                            <span><strong>Cost:</strong> {city.transportCost}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {city.highlights.map((h) => (
                            <span key={h} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${C.primary}08`, color: '#475569', border: `1px solid ${C.border}` }}>
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ 4. GETTING AROUND ════════ */}
      <section id="transport" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Safari vehicles, domestic flights, local transport, and bush planes across the continent.">
          Getting Around Africa
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                <span className="text-xl">&#128663;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Safari Vehicles</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>What to expect:</strong> Most safaris use modified 4x4 Land Cruisers or Land Rovers with pop-up roofs for game viewing and photography.</p>
              <p><strong>Self-drive safaris:</strong> Possible in South Africa (Kruger), Namibia, and Botswana. Rent a 4x4 from major agencies. International license required.</p>
              <p><strong>Guided safaris:</strong> Essential in East Africa (Kenya, Tanzania). Your driver-guide knows animal behavior, tracks, and the best viewing spots.</p>
              <p><strong>Cost:</strong> Guided safari day rates range from $200-500/day in East Africa. Self-drive 4x4 rentals from $50-100/day in Southern Africa.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}15` }}>
                <span className="text-xl">&#9992;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Domestic Flights</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['Kenya Airways', 'Ethiopian Airlines', 'South African Airways', 'RwandAir'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>Ethiopian Airlines:</strong> Africa&apos;s largest airline with the best pan-African network. Hub in Addis Ababa connects to 60+ African cities.</p>
              <p><strong>Kenya Airways:</strong> Excellent East Africa coverage. Nairobi hub connects to most safari destinations.</p>
              <p><strong>Bush planes:</strong> Small aircraft (Cessna Caravan) connect remote safari camps and airstrips. Essential for reaching lodges in the Masai Mara, Serengeti, and Okavango Delta. Luggage limits: 15-20kg in soft bags only.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
                <span className="text-xl">&#128656;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Local Transport</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Matatus (Kenya):</strong> Minibuses that are the backbone of local transport. Cheap and frequent but can be crowded. Negotiate fares or pay standard rates.</p>
              <p><strong>Dalla-dallas (Tanzania):</strong> Similar to matatus. Cover urban and intercity routes. Very affordable but slow.</p>
              <p><strong>Ride-hailing apps:</strong> Uber works in South Africa, Kenya, Tanzania, Ghana, and Egypt. Bolt (formerly Taxify) has wider African coverage.</p>
              <p><strong>Shared taxis:</strong> Common across West and North Africa. Fixed routes, leave when full. Very affordable.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EC489915' }}>
                <span className="text-xl">&#128652;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Bush Planes &amp; Overland</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Bush planes:</strong> The only way to reach many remote safari camps. Operators like SafariLink (Kenya) and Coastal Aviation (Tanzania) run scheduled bush flights.</p>
              <p><strong>Overland trucks:</strong> Companies like Nomad Africa and Dragoman run multi-week overland camping tours across the continent. A great budget way to cover huge distances.</p>
              <p><strong>Long-distance buses:</strong> Companies like Intercape (Southern Africa) and Modern Coast (East Africa) connect major cities. Comfortable and affordable.</p>
              <p><strong>Trains:</strong> Limited rail networks. Notable routes include the Rovos Rail luxury train (South Africa) and the TAZARA railway (Tanzania to Zambia).</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 5. HEALTH & SAFETY ════════ */}
      <section id="health" className="py-16" style={{ backgroundColor: `${C.secondary}08` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Essential health precautions and vaccinations for traveling in Africa.">
            Health &amp; Vaccinations
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Required &amp; Recommended Vaccinations</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="font-bold mb-2" style={{ color: '#DC2626' }}>Yellow Fever (Required)</p>
                  <p>Required for entry to many African countries including Kenya, Tanzania, Uganda, Rwanda, Ethiopia, Ghana, and Senegal. You must carry your International Certificate of Vaccination (yellow card). Get vaccinated at least 10 days before travel. One dose provides lifetime protection.</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold mb-1" style={{ color: C.dark }}>Recommended vaccinations</p>
                  <p>Hepatitis A &amp; B, Typhoid, Tetanus, Polio (booster), Meningitis (for sub-Saharan travel), Rabies (if visiting remote areas or doing wildlife activities).</p>
                </div>
                <p><strong>Consult a travel medicine clinic</strong> at least 6-8 weeks before your trip for personalized medical advice.</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Malaria Prevention</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
                  <p className="font-bold mb-2" style={{ color: C.primary }}>Essential Precaution</p>
                  <p>Malaria is present in most of sub-Saharan Africa. Take antimalarial medication (Malarone, Doxycycline, or Mefloquine) as prescribed by your doctor. Start taking medication before arrival as directed.</p>
                </div>
                <p><strong>Additional protection:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Use DEET-based insect repellent (30-50% concentration)</li>
                  <li>Sleep under treated mosquito nets (most lodges provide these)</li>
                  <li>Wear long sleeves and pants at dusk and dawn</li>
                  <li>Mosquitoes are most active between dusk and dawn</li>
                </ul>
                <p><strong>Low-risk areas:</strong> Cape Town, Johannesburg, Nairobi city center, Marrakech, and high-altitude regions above 2,000m are generally malaria-free.</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Water &amp; Food Safety</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <p><strong>Drinking water:</strong> Do not drink tap water in most African countries. Use bottled water (check the seal is intact), or bring a water purifier/SteriPen.</p>
                <p><strong>Ice:</strong> Avoid ice in drinks unless at upscale hotels and restaurants that use purified water.</p>
                <p><strong>Street food:</strong> Choose busy stalls where food is cooked fresh in front of you. Avoid pre-prepared salads and unpeeled fruits from street vendors.</p>
                <p><strong>Bring:</strong> Oral rehydration salts, anti-diarrheal medication, and a basic first-aid kit.</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Wildlife Safety</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <p><strong>On safari:</strong> Stay inside the vehicle unless your guide says otherwise. Never approach or feed wildlife. Keep noise to a minimum.</p>
                <p><strong>Walking safaris:</strong> Only with armed, trained rangers. Follow their instructions exactly. Walk in single file.</p>
                <p><strong>Distance rules:</strong> Keep at least 100m from elephants, 200m from hippos, and never get between a hippo and water.</p>
                <p><strong>At camp:</strong> Keep tent zipped at night. Use a flashlight when walking between tents. Never store food in your tent.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ════════ 6. TOUR OPERATORS ════════ */}
      <section id="operators" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Reputable safari and tour operators to help plan your African adventure. These are informational resources, not affiliate links.">
          Tour Operators &amp; Safari Companies
        </SectionTitle>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tourOperators.map((op) => (
            <Card key={op.name}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-lg" style={{ color: C.dark }}>{op.name}</h4>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${C.secondary}15`, color: C.secondary }}>{op.price}</span>
              </div>
              <p className="text-sm mb-2" style={{ color: '#475569' }}>{op.desc}</p>
              <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>Best for: {op.who}</p>
              <div className="px-3 py-2 rounded-lg text-sm font-medium text-center" style={{ backgroundColor: C.bg, color: C.primary, border: `1px solid ${C.border}` }}>
                {op.url}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════ 7. BUDGET GUIDE ════════ */}
      <section id="budget" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Daily costs vary dramatically across Africa depending on the country and travel style.">
            Africa Budget Guide
          </SectionTitle>

          <Card className="mb-8">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Average Daily Costs by Region</h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>Approximate daily cost including accommodation, food, transport, and activities.</p>
            <div className="space-y-2">
              {[
                { region: 'Morocco', cost: '$30-80/day', bar: 15, note: 'Very affordable, excellent riads for $20-60' },
                { region: 'Egypt', cost: '$25-70/day', bar: 12, note: 'One of the cheapest countries; tours extra' },
                { region: 'South Africa', cost: '$50-150/day', bar: 30, note: 'Affordable by Western standards; great value' },
                { region: 'Kenya (non-safari)', cost: '$30-80/day', bar: 18, note: 'Affordable outside safari zones' },
                { region: 'East Africa (safari)', cost: '$200-500/day', bar: 70, note: 'Safaris are the big expense; park fees + guides' },
                { region: 'Tanzania (safari)', cost: '$250-600/day', bar: 80, note: 'Park fees alone are $60-80/day per person' },
                { region: 'Namibia', cost: '$60-200/day', bar: 40, note: 'Self-drive keeps costs down' },
                { region: 'Botswana', cost: '$200-1000/day', bar: 90, note: 'Premium safari destination; very expensive' },
              ].map((c) => (
                <div key={c.region} className="flex items-center gap-3">
                  <span className="text-sm w-52 flex-shrink-0" style={{ color: C.dark }}>{c.region}</span>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                    <div
                      className="h-full rounded-full flex items-center px-3"
                      style={{
                        width: `${c.bar + 10}%`,
                        background: `linear-gradient(90deg, ${C.primary}, ${C.primary}90)`,
                      }}
                    >
                      <span className="text-xs text-white font-medium whitespace-nowrap">{c.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-serif text-lg font-bold mb-3" style={{ color: C.dark }}>Money-Saving Tips</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                {[
                  'Travel in shoulder season (Nov-Dec, Mar-May) for lower safari rates',
                  'Join group safaris to split vehicle and guide costs',
                  'Stay in tented camps instead of luxury lodges',
                  'Self-drive in South Africa and Namibia',
                  'Cook at campsites when possible',
                  'Use local transport between cities instead of flights',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.secondary }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="font-serif text-lg font-bold mb-3" style={{ color: C.dark }}>Safari Costs Breakdown</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                {[
                  'Park entry fees: $30-80/day per person',
                  'Safari vehicle + driver-guide: $150-300/day',
                  'Lodge/tented camp: $100-800/night',
                  'Bush plane flights: $150-400 per sector',
                  'Tips for guides: $10-20/day recommended',
                  'Hot air balloon safari: $400-500 per person',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.primary }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="font-serif text-lg font-bold mb-3" style={{ color: C.dark }}>Currency &amp; Payments</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                {[
                  'US Dollars widely accepted in East Africa safari zones',
                  'South African Rand (ZAR) used in South Africa, Namibia, Lesotho, Eswatini',
                  'ATMs available in major cities; carry cash for rural areas',
                  'M-Pesa mobile money dominant in Kenya and Tanzania',
                  'Credit cards accepted at hotels and lodges; cash for markets',
                  'Bring crisp, post-2006 US bills (older notes often rejected)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#3B82F6' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ════════ 8. SAFETY ════════ */}
      <section id="safety" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Safety varies hugely by country. Tourist areas are generally safe with common-sense precautions.">
          Safety in Africa
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>General Safety</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p>Africa is a vast continent with 54 countries, and safety levels vary enormously. Popular tourist destinations like <strong>Morocco, South Africa, Kenya, Tanzania, Namibia, and Egypt</strong> are well-set-up for tourism with established safety infrastructure.</p>
              <p>Most crime affecting tourists is opportunistic theft. Violent crime against tourists is uncommon in tourist areas.</p>
              <div className="p-4 rounded-xl mt-3" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold mb-1" style={{ color: C.primary }}>Key advice</p>
                <p>Research your specific countries thoroughly. Hire local guides. Register with your embassy. Carry copies of your passport. Use hotel safes for valuables.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Country-Specific Tips</h3>
            <div className="space-y-3">
              {[
                { country: 'South Africa', tip: 'Don\'t walk alone at night in cities. Use Uber. Be vigilant in Johannesburg. Cape Town and safari areas are generally safe.' },
                { country: 'Kenya & Tanzania', tip: 'Safari areas very safe. Nairobi: avoid walking at night. Zanzibar: modest dress outside beach resorts.' },
                { country: 'Morocco', tip: 'Generally very safe. Medinas can be disorienting — hire a guide initially. Ignore persistent touts firmly but politely.' },
                { country: 'Egypt', tip: 'Tourist areas well-policed. Avoid border regions with Libya and Sinai (except Sharm el-Sheikh). Dress modestly outside resort areas.' },
              ].map((c) => (
                <div key={c.country} className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm mb-1" style={{ color: C.dark }}>{c.country}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{c.tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ FOOTER-ISH ════════ */}
      <section className="text-center py-16 px-4">
        <p className="font-serif text-2xl font-bold mb-3" style={{ color: C.dark }}>Ready to Explore Africa?</p>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#64748B' }}>
          This guide covers the essentials for planning your African adventure. From Saharan sunrises to Serengeti sunsets, Africa will change the way you see the world. Safe travels!
        </p>
        <p className="text-xs mt-6" style={{ color: '#94A3B8' }}>
          Last updated: April 2026. Information is subject to change — always verify visa and health requirements with official sources before traveling.
        </p>
      </section>
    </main>
  );
}
