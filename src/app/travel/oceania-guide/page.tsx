'use client';

import React, { useState } from 'react';

/* ─── colour tokens ─── */
const C = {
  primary: '#0EA5E9',
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
    id: 'aueastcoast',
    title: 'Australia East Coast',
    days: 14,
    tag: 'Most Popular',
    tagColor: C.primary,
    overview: 'The quintessential Australian road trip from the harbour city of Sydney to the tropical reefs of Cairns.',
    cities: [
      { name: 'Sydney', country: 'Australia', stay: 'Days 1-3', highlights: ['Sydney Opera House', 'Harbour Bridge climb', 'Bondi to Coogee coastal walk', 'The Rocks markets', 'Darling Harbour'] },
      { name: 'Blue Mountains', country: 'Australia', stay: 'Day 4', highlights: ['Three Sisters viewpoint', 'Scenic World cable car', 'Bushwalking trails', 'Katoomba village'], transport: 'Train from Central', transportTime: '2 hours', transportCost: 'AU$8-12' },
      { name: 'Byron Bay', country: 'Australia', stay: 'Days 5-6', highlights: ['Cape Byron lighthouse', 'Surfing at The Pass', 'Farmers markets', 'Nimbin day trip'], transport: 'Flight to Gold Coast + shuttle', transportTime: '1.5h flight + 1h shuttle', transportCost: 'AU$80-150' },
      { name: 'Gold Coast', country: 'Australia', stay: 'Day 7', highlights: ['Surfers Paradise', 'Burleigh Heads', 'Currumbin Wildlife Sanctuary', 'Theme parks'], transport: 'Bus', transportTime: '1.5 hours', transportCost: 'AU$20-35' },
      { name: 'Airlie Beach', country: 'Australia', stay: 'Days 8-9', highlights: ['Whitsunday Islands sailing', 'Whitehaven Beach', 'Heart Reef scenic flight', 'Great Barrier Reef snorkeling'], transport: 'Flight to Proserpine', transportTime: '1.5 hours', transportCost: 'AU$100-200' },
      { name: 'Cairns', country: 'Australia', stay: 'Days 10-14', highlights: ['Great Barrier Reef diving', 'Daintree Rainforest', 'Kuranda Scenic Railway', 'Fitzroy Island', 'Palm Cove', 'Cape Tribulation'], transport: 'Flight', transportTime: '1.5 hours', transportCost: 'AU$80-160' },
    ],
    budget: { backpacker: 'AU$80-120/day', midrange: 'AU$180-280/day', comfort: 'AU$350+/day' },
  },
  {
    id: 'nzroadtrip',
    title: 'New Zealand Road Trip',
    days: 14,
    tag: 'Adventure',
    tagColor: '#10B981',
    overview: 'Both islands of New Zealand by campervan or rental car, from geothermal wonders to alpine landscapes.',
    cities: [
      { name: 'Auckland', country: 'New Zealand', stay: 'Days 1-2', highlights: ['Sky Tower', 'Waiheke Island wine tasting', 'Rangitoto Island hike', 'Viaduct Harbour', 'Mission Bay'] },
      { name: 'Rotorua', country: 'New Zealand', stay: 'Day 3', highlights: ['Te Puia geothermal park', 'Wai-O-Tapu mud pools', 'Maori cultural performance', 'Redwoods Treewalk'], transport: 'Drive', transportTime: '3 hours', transportCost: 'NZ$40-60 fuel' },
      { name: 'Taupo', country: 'New Zealand', stay: 'Day 4', highlights: ['Huka Falls', 'Tongariro Alpine Crossing', 'Lake Taupo kayaking', 'Bungy jumping'], transport: 'Drive', transportTime: '1 hour', transportCost: 'NZ$15-20 fuel' },
      { name: 'Wellington', country: 'New Zealand', stay: 'Days 5-6', highlights: ['Te Papa museum', 'Cuba Street', 'Mount Victoria lookout', 'Craft beer scene', 'Weta Workshop tour'], transport: 'Drive via Tongariro', transportTime: '5 hours', transportCost: 'NZ$60-80 fuel' },
      { name: 'Christchurch', country: 'New Zealand', stay: 'Day 7', highlights: ['Cardboard Cathedral', 'Botanic Gardens', 'Punting on the Avon', 'Street art trail'], transport: 'Interislander ferry + drive', transportTime: '3.5h ferry + 4.5h drive', transportCost: 'NZ$75-150 ferry + NZ$60 fuel' },
      { name: 'Mt Cook', country: 'New Zealand', stay: 'Day 8', highlights: ['Hooker Valley Track', 'Mueller Hut route', 'Tasman Glacier boat tour', 'Stargazing'], transport: 'Drive', transportTime: '4 hours', transportCost: 'NZ$50-60 fuel' },
      { name: 'Queenstown', country: 'New Zealand', stay: 'Days 9-11', highlights: ['Milford Sound cruise', 'Skyline Gondola & luge', 'Bungy at Kawarau Bridge', 'Arrowtown', 'Fergburger'], transport: 'Drive', transportTime: '3.5 hours', transportCost: 'NZ$45-55 fuel' },
      { name: 'Milford Sound', country: 'New Zealand', stay: 'Days 12-14', highlights: ['Milford Sound overnight cruise', 'Kayaking among waterfalls', 'Routeburn Track (day hike)', 'Te Anau Glowworm Caves'], transport: 'Drive', transportTime: '3.5 hours', transportCost: 'NZ$45-55 fuel' },
    ],
    budget: { backpacker: 'NZ$80-130/day', midrange: 'NZ$180-300/day', comfort: 'NZ$400+/day' },
  },
  {
    id: 'combined',
    title: 'Combined AU + NZ',
    days: 21,
    tag: 'Grand Tour',
    tagColor: '#F59E0B',
    overview: 'The ultimate Oceania adventure combining Australia\'s highlights with New Zealand\'s stunning landscapes in three weeks.',
    cities: [
      { name: 'Sydney', country: 'Australia', stay: 'Days 1-3', highlights: ['Opera House', 'Harbour Bridge', 'Bondi Beach', 'The Rocks', 'Royal Botanic Garden'] },
      { name: 'Cairns', country: 'Australia', stay: 'Days 4-6', highlights: ['Great Barrier Reef', 'Daintree Rainforest', 'Kuranda Railway', 'Esplanade lagoon'], transport: 'Domestic flight', transportTime: '3 hours', transportCost: 'AU$100-250' },
      { name: 'Melbourne', country: 'Australia', stay: 'Days 7-9', highlights: ['Laneways & coffee culture', 'Great Ocean Road day trip', 'Queen Victoria Market', 'MCG & sports culture'], transport: 'Domestic flight', transportTime: '3 hours', transportCost: 'AU$80-200' },
      { name: 'Auckland', country: 'New Zealand', stay: 'Days 10-11', highlights: ['Sky Tower', 'Waiheke Island', 'Rangitoto Island', 'Viaduct Harbour'], transport: 'Trans-Tasman flight', transportTime: '3.5 hours', transportCost: 'AU$150-350' },
      { name: 'Rotorua & Taupo', country: 'New Zealand', stay: 'Days 12-13', highlights: ['Geothermal parks', 'Maori culture', 'Huka Falls', 'Tongariro Crossing'], transport: 'Drive/bus', transportTime: '3 hours', transportCost: 'NZ$40-60' },
      { name: 'Wellington', country: 'New Zealand', stay: 'Day 14', highlights: ['Te Papa', 'Cuba Street', 'Cable car', 'Craft beer'], transport: 'Drive', transportTime: '5 hours', transportCost: 'NZ$60-80 fuel' },
      { name: 'Christchurch', country: 'New Zealand', stay: 'Day 15', highlights: ['Rebuild exploration', 'Botanic Gardens', 'Street art'], transport: 'Ferry + drive', transportTime: '8 hours total', transportCost: 'NZ$120-180' },
      { name: 'Queenstown', country: 'New Zealand', stay: 'Days 16-18', highlights: ['Milford Sound', 'Bungy jumping', 'Arrowtown', 'Skyline Gondola'], transport: 'Drive', transportTime: '5 hours', transportCost: 'NZ$60-80 fuel' },
      { name: 'Mt Cook & Tekapo', country: 'New Zealand', stay: 'Days 19-21', highlights: ['Hooker Valley Track', 'Stargazing at Tekapo', 'Tasman Glacier', 'Church of the Good Shepherd'], transport: 'Drive', transportTime: '3 hours', transportCost: 'NZ$40-50 fuel' },
    ],
    budget: { backpacker: 'AU$90-140/day', midrange: 'AU$200-320/day', comfort: 'AU$400+/day' },
  },
];

const tourOperators = [
  { name: 'Contiki', url: 'contiki.com', desc: 'Group tours for young travelers across AU & NZ', who: '18-35 age group', price: '$$-$$$' },
  { name: 'Topdeck Travel', url: 'topdecktravel.com', desc: 'Budget-friendly group tours with activity focus', who: '18-39 travelers', price: '$$' },
  { name: 'Stray NZ', url: 'straytravel.com', desc: 'Hop-on hop-off adventure bus network across NZ', who: 'Backpackers & solo travelers', price: '$-$$' },
  { name: 'Oz Experience', url: 'ozexperience.com', desc: 'Hop-on hop-off bus passes along Australia\'s east coast', who: 'Budget & backpackers', price: '$-$$' },
  { name: 'Intrepid Travel', url: 'intrepidtravel.com', desc: 'Sustainable small group tours in AU, NZ & Pacific', who: 'Responsible travelers', price: '$$-$$$' },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function OceaniaGuidePage() {
  const [activeRoute, setActiveRoute] = useState('aueastcoast');

  return (
    <main style={{ backgroundColor: C.bg }}>
      {/* ════════ 1. HERO ════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-32 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0369A1 40%, #065F46 70%, ${C.dark} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <p className="uppercase tracking-widest text-sm mb-4 opacity-80">WorldTourly Presents</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Australia, New Zealand<br />&amp; Pacific Islands Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            From the Great Barrier Reef to Milford Sound, explore the stunning natural wonders of Oceania with this comprehensive travel guide.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { n: '14', l: 'Countries' },
              { n: '3', l: 'Curated Routes' },
              { n: '5', l: 'Tour Operators' },
              { n: '&#x267E;', l: 'Adventures' },
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
            ['#routes', 'Tour Routes'],
            ['#transport', 'Getting Around'],
            ['#seasons', 'Best Time to Visit'],
            ['#budget', 'Budget Guide'],
            ['#operators', 'Tour Operators'],
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
        <SectionTitle sub="Visa requirements for Australia, New Zealand, and the Pacific Islands.">
          Oceania Visa Guide
        </SectionTitle>

        {/* Australia */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.primary}20` }}>
              &#127462;&#127482;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>Australia</h4>
              <Badge color={C.primary}>ETA / eVisitor Required</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>US citizens:</strong> Electronic Travel Authority (ETA) via the Australian ETA app. Cost: AU$20. Valid for 12 months, stays up to 3 months.</p>
                <p><strong>UK &amp; EU citizens:</strong> eVisitor (subclass 651) — free, apply online. Valid for 12 months, stays up to 3 months per visit.</p>
                <p><strong>India:</strong> Visitor visa (subclass 600) required. Apply online via ImmiAccount. Cost: AU$190. Processing: 20-30 days.</p>
                <p><strong>Biosecurity:</strong> Australia has extremely strict biosecurity. Declare ALL food, plant material, and animal products on your arrival card. Heavy fines for non-compliance.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* New Zealand */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.secondary}20` }}>
              &#127475;&#127487;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>New Zealand</h4>
              <Badge color={C.secondary}>NZeTA Required</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>US, UK &amp; EU citizens:</strong> New Zealand Electronic Travel Authority (NZeTA) required. Apply via the NZeTA app (NZ$17) or online (NZ$23). Valid for 2 years, stays up to 3 months.</p>
                <p><strong>International Visitor Conservation and Tourism Levy (IVL):</strong> NZ$35 per person, paid during NZeTA application.</p>
                <p><strong>India:</strong> Visitor visa required. Apply online. Cost: NZ$211. Processing: 20-25 working days.</p>
                <p><strong>Australia citizens:</strong> Visa-free — can live and work indefinitely.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pacific Islands */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#F59E0B20' }}>
              &#127796;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>Pacific Islands</h4>
              <Badge color="#F59E0B">Generally Visa-Free</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Fiji:</strong> Visa-free for most nationalities (4 months for US/UK/EU). Permit issued on arrival.</p>
                <p><strong>French Polynesia (Tahiti):</strong> Same rules as France/Schengen. US/UK visa-free 90 days. EU citizens: no visa needed.</p>
                <p><strong>Samoa:</strong> Entry permit on arrival for most nationalities (60 days).</p>
                <p><strong>Vanuatu:</strong> Visa-free for most nationalities (30 days, extendable).</p>
                <p><strong>Cook Islands:</strong> Visa-free for all nationalities (31 days). No passport control — NZ territory.</p>
                <p><strong>Tonga:</strong> Visa-free on arrival for most nationalities (31 days).</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ════════ 3. TOUR ROUTES ════════ */}
      <section id="routes" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Three curated routes from east coast Australia to New Zealand's South Island and a combined grand tour.">
            Oceania Tour Routes &amp; Itineraries
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
        <SectionTitle sub="Campervans, domestic flights, buses, and ferries across Australia and New Zealand.">
          Getting Around Oceania
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                <span className="text-xl">&#128656;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Campervan Rentals</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>The Oceania way to travel:</strong> Campervans let you combine transport and accommodation, saving money and offering ultimate freedom. Hugely popular in both Australia and New Zealand.</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['Jucy', 'Wicked Campers', 'Britz', 'Maui', 'Spaceships', 'Travellers Autobarn'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>Cost:</strong> Budget campervans from AU$30-60/day (Jucy, Wicked). Premium from AU$100-200/day (Britz, Maui). Holiday parks with powered sites: AU$30-50/night. Many free/low-cost DOC camping in NZ.</p>
              <p><strong>Tip:</strong> Book relocation deals (one-way rentals) for huge discounts — companies need vehicles moved between cities.</p>
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
                {['Qantas', 'Jetstar', 'Air New Zealand', 'Rex Airlines'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>Australia:</strong> Distances are huge. Sydney to Cairns is 2,400 km — fly (3 hours) rather than drive (30+ hours). Jetstar offers budget fares from AU$60-150 on popular routes.</p>
              <p><strong>New Zealand:</strong> Air New Zealand and Jetstar connect all major cities. Flights are short (Auckland to Queenstown: 2 hours). Book ahead for fares from NZ$50-100.</p>
              <p><strong>Trans-Tasman:</strong> Sydney/Melbourne to Auckland: 3-3.5 hours. Multiple daily flights. From AU$150-350 return if booked in advance.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F59E0B15' }}>
                <span className="text-xl">&#128652;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Bus &amp; Coach</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Greyhound Australia:</strong> The main long-distance bus network. Hop-on hop-off passes available (e.g., AU$249 for Sydney to Cairns). Comfortable with WiFi and charging.</p>
              <p><strong>InterCity (NZ):</strong> New Zealand&apos;s main bus network connecting all major towns. FlexiPass lets you buy travel hours to use flexibly.</p>
              <p><strong>Stray &amp; Kiwi Experience (NZ):</strong> Hop-on hop-off backpacker buses with fun guides, activity stops, and social atmosphere. Great for solo travelers.</p>
              <p><strong>Tip:</strong> Australian distances are deceptive on maps. Sydney to Melbourne by bus is 10 hours. Fly if time is limited.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
                <span className="text-xl">&#9973;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Ferries</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Interislander &amp; Bluebridge (NZ):</strong> Ferry between Wellington (North Island) and Picton (South Island). 3.5 hours through the stunning Marlborough Sounds. NZ$55-150 per person; vehicles extra.</p>
              <p><strong>Spirit of Tasmania:</strong> Melbourne to Devonport (Tasmania). 9-11 hour overnight crossing. From AU$99 per person.</p>
              <p><strong>Sydney Harbour ferries:</strong> Part of the public transport network. Great for getting to Manly Beach and Taronga Zoo.</p>
              <p><strong>Fiji ferries:</strong> Awesome Adventures Fiji runs backpacker-friendly island-hopping passes (Bula Pass). Great way to explore the Yasawa and Mamanuca Islands.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 5. BEST TIME TO VISIT ════════ */}
      <section id="seasons" className="py-16" style={{ backgroundColor: `${C.secondary}08` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Reverse seasons, tropical climates, and year-round Pacific paradise.">
            Best Time to Visit Oceania
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                region: 'Australia (Southern)',
                emoji: '&#127759;',
                color: C.primary,
                details: [
                  'Reverse seasons to Northern Hemisphere: December-February is summer',
                  'Summer (Dec-Feb): Best for beaches, Sydney, Melbourne. Hot (25-40 C)',
                  'Autumn (Mar-May): Pleasant weather, fewer crowds. Great for road trips',
                  'Winter (Jun-Aug): Mild in Sydney/Melbourne. Ski season in Victorian Alps',
                  'Spring (Sep-Nov): Wildflowers, whale watching, pleasant temperatures',
                ],
                best: 'September-November and March-May offer the best balance of weather and value.',
              },
              {
                region: 'Australia (Tropical North)',
                emoji: '&#127796;',
                color: '#F59E0B',
                details: [
                  'Dry season (May-Oct): Best time to visit Cairns, Great Barrier Reef, and Darwin',
                  'Wet season (Nov-Apr): Heavy rain, humidity, cyclone risk. Cheaper prices.',
                  'Great Barrier Reef: Best visibility June-October. Stinger season Nov-May (wear stinger suits)',
                  'Uluru/Red Centre: Best April-September (winter). Summer exceeds 45 C',
                ],
                best: 'May to October is ideal for tropical Australia and the Reef.',
              },
              {
                region: 'New Zealand',
                emoji: '&#127752;',
                color: C.secondary,
                details: [
                  'Also reverse seasons: December-February is summer',
                  'Summer (Dec-Feb): Best weather, longest days. Peak tourist season.',
                  'Autumn (Mar-May): Stunning foliage, fewer crowds, great hiking weather',
                  'Winter (Jun-Aug): Ski season at Queenstown, Wanaka, Ruapehu. Cold and wet elsewhere',
                  'Spring (Sep-Nov): Blooming gardens, lambing season, shoulder pricing',
                ],
                best: 'December-March for hiking and outdoor activities. June-August for skiing.',
              },
              {
                region: 'Pacific Islands (Fiji, Samoa, Tonga)',
                emoji: '&#9728;',
                color: '#EC4899',
                details: [
                  'Year-round warm temperatures (26-32 C)',
                  'Dry season (May-Oct): Best time to visit. Lower humidity, less rain',
                  'Wet season (Nov-Apr): Hotter, more humid, afternoon storms. Cyclone risk',
                  'Water temperature always 25-29 C — perfect for diving year-round',
                  'Peak season: July-September (Australian/NZ school holidays)',
                ],
                best: 'May to October for the best weather. November-April for deals.',
              },
            ].map((s) => (
              <Card key={s.region}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl" dangerouslySetInnerHTML={{ __html: s.emoji }} />
                  <div>
                    <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>{s.region}</h3>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {s.details.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold p-2 rounded-lg" style={{ backgroundColor: `${s.color}10`, color: s.color }}>
                  {s.best}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 6. BUDGET GUIDE ════════ */}
      <section id="budget" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Oceania is expensive compared to Asia or South America, but smart planning makes it manageable.">
          Oceania Budget Guide
        </SectionTitle>

        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Average Daily Costs</h3>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>Approximate daily cost per person including accommodation, food, transport, and 1-2 activities.</p>
          <div className="space-y-2">
            {[
              { region: 'Fiji / Pacific Islands', cost: 'AU$60-150/day', bar: 25 },
              { region: 'New Zealand (campervan)', cost: 'AU$80-140/day', bar: 35 },
              { region: 'New Zealand (hotels)', cost: 'AU$120-250/day', bar: 50 },
              { region: 'Australia (backpacker)', cost: 'AU$80-120/day', bar: 35 },
              { region: 'Australia (mid-range)', cost: 'AU$150-280/day', bar: 55 },
              { region: 'Australia (comfort)', cost: 'AU$300-500+/day', bar: 80 },
            ].map((c) => (
              <div key={c.region} className="flex items-center gap-3">
                <span className="text-sm w-56 flex-shrink-0" style={{ color: C.dark }}>{c.region}</span>
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-serif text-lg font-bold mb-3" style={{ color: C.dark }}>Money-Saving Tips</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                'Campervan travel saves on accommodation (AU$30-60/day vs AU$100+ for hotels)',
                'Free/low-cost DOC campsites throughout New Zealand',
                'Cook your own meals — supermarkets like Woolworths, Coles, Countdown',
                'Travel in shoulder season (Mar-May, Sep-Nov) for 20-40% lower prices',
                'Get a Greyhound bus pass or Kiwi Experience pass for transport savings',
                'Free activities: beaches, hiking trails, national parks (many free in AU)',
                'Look for campervan relocation deals for near-free rentals',
                'Happy hour deals and pub meals are great value in both countries',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.secondary }} />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-serif text-lg font-bold mb-3" style={{ color: C.dark }}>Currency &amp; Payments</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="space-y-2">
                {[
                  { country: 'Australia', currency: 'Australian Dollar (AUD)', rate: '~0.65 USD' },
                  { country: 'New Zealand', currency: 'NZ Dollar (NZD)', rate: '~0.60 USD' },
                  { country: 'Fiji', currency: 'Fijian Dollar (FJD)', rate: '~0.45 USD' },
                ].map((c) => (
                  <div key={c.country} className="flex justify-between px-2 py-1 rounded" style={{ backgroundColor: C.bg }}>
                    <span style={{ color: C.dark }}>{c.country}</span>
                    <span style={{ color: '#64748B' }}>{c.currency}</span>
                  </div>
                ))}
              </div>
              <p><strong>Contactless payments:</strong> Both Australia and NZ are nearly cashless. Tap-to-pay works almost everywhere including markets and small shops.</p>
              <p><strong>Tipping:</strong> Not expected or required in Australia or New Zealand. Some upscale restaurants may have a tip jar.</p>
              <p><strong>Tip:</strong> Use a Wise or Revolut card for the best exchange rates. Avoid airport currency exchange.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 7. TOUR OPERATORS ════════ */}
      <section id="operators" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Reputable tour operators and transport networks for exploring Oceania.">
            Tour Operators &amp; Travel Companies
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
        </div>
      </section>

      {/* ════════ FOOTER-ISH ════════ */}
      <section className="text-center py-16 px-4">
        <p className="font-serif text-2xl font-bold mb-3" style={{ color: C.dark }}>Ready to Explore Oceania?</p>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#64748B' }}>
          From the Great Barrier Reef to Milford Sound, from Sydney&apos;s harbour to Auckland&apos;s volcanoes, Oceania offers some of the planet&apos;s most extraordinary natural landscapes. Grab a campervan and go!
        </p>
        <p className="text-xs mt-6" style={{ color: '#94A3B8' }}>
          Last updated: April 2026. Information is subject to change — always verify visa and entry requirements with official government websites before traveling.
        </p>
      </section>
    </main>
  );
}
