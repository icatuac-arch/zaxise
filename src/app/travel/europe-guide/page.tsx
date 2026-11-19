'use client';

import React, { useState } from 'react';

/* ─── colour tokens ─── */
const C = {
  primary: '#0EA5E9',
  secondary: '#F59E0B',
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

const schengenCountries = [
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Liechtenstein', flag: '🇱🇮' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
];

const nonSchengenEU = [
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Cyprus', flag: '🇨🇾' },
];

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
    id: 'western',
    title: 'Western Europe Classic',
    days: 14,
    tag: 'Most Popular',
    tagColor: C.primary,
    overview: 'The quintessential European grand tour covering iconic capitals and cultural powerhouses from London to Rome.',
    cities: [
      { name: 'London', country: 'UK', stay: 'Days 1-2', highlights: ['Big Ben & Parliament', 'British Museum (free)', 'Tower of London', 'Borough Market'] },
      { name: 'Paris', country: 'France', stay: 'Days 3-5', highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre & Sacre-Coeur', 'Seine River cruise'], transport: 'Eurostar train', transportTime: '2h 15m', transportCost: '€50-120' },
      { name: 'Amsterdam', country: 'Netherlands', stay: 'Day 6-7', highlights: ['Anne Frank House', 'Rijksmuseum', 'Canal cruise', 'Vondelpark'], transport: 'Thalys train', transportTime: '3h 15m', transportCost: '€35-80' },
      { name: 'Brussels', country: 'Belgium', stay: 'Day 7', highlights: ['Grand Place', 'Belgian waffles & chocolate', 'Manneken Pis'], transport: 'Train', transportTime: '1h 50m', transportCost: '€25-45' },
      { name: 'Frankfurt', country: 'Germany', stay: 'Day 8', highlights: ['Romerberg square', 'Main Tower viewpoint', 'Apple wine in Sachsenhausen'], transport: 'ICE train', transportTime: '3h', transportCost: '€30-60' },
      { name: 'Munich', country: 'Germany', stay: 'Days 9-10', highlights: ['Marienplatz & Glockenspiel', 'English Garden', 'Neuschwanstein day trip', 'Beer halls'], transport: 'ICE train', transportTime: '3h 15m', transportCost: '€30-55' },
      { name: 'Zurich', country: 'Switzerland', stay: 'Day 10', highlights: ['Old Town walk', 'Lake Zurich', 'Lindenhof viewpoint'], transport: 'Train', transportTime: '4h', transportCost: '€40-70' },
      { name: 'Milan', country: 'Italy', stay: 'Day 11', highlights: ['Duomo cathedral', 'Last Supper (book ahead!)', 'Galleria Vittorio Emanuele'], transport: 'Train', transportTime: '3h 30m', transportCost: '€30-60' },
      { name: 'Venice', country: 'Italy', stay: 'Day 12', highlights: ['St. Mark\'s Square', 'Gondola ride', 'Rialto Bridge', 'Murano island'], transport: 'Trenitalia', transportTime: '2h 30m', transportCost: '€15-35' },
      { name: 'Florence', country: 'Italy', stay: 'Day 13', highlights: ['Uffizi Gallery', 'Ponte Vecchio', 'Duomo climb', 'Piazzale Michelangelo sunset'], transport: 'Train', transportTime: '2h', transportCost: '€15-30' },
      { name: 'Rome', country: 'Italy', stay: 'Day 14', highlights: ['Colosseum & Forum', 'Vatican Museums & Sistine Chapel', 'Trevi Fountain', 'Trastevere dining'], transport: 'Trenitalia', transportTime: '1h 30m', transportCost: '€15-30' },
    ],
    budget: { backpacker: '€50-70/day', midrange: '€120-180/day', comfort: '€250+/day' },
  },
  {
    id: 'mediterranean',
    title: 'Mediterranean Coast',
    days: 10,
    tag: 'Sun & Sea',
    tagColor: '#F59E0B',
    overview: 'Sun-drenched beaches, world-class cuisine, and ancient history along the Mediterranean coastline.',
    cities: [
      { name: 'Barcelona', country: 'Spain', stay: 'Days 1-3', highlights: ['Sagrada Familia', 'Park Guell', 'La Boqueria Market', 'Barceloneta Beach'] },
      { name: 'Nice', country: 'France', stay: 'Days 4-5', highlights: ['Promenade des Anglais', 'Old Town', 'Day trip to Monaco', 'Beach clubs'], transport: 'Flight', transportTime: '1h 30m', transportCost: '€30-80' },
      { name: 'Florence', country: 'Italy', stay: 'Day 6', highlights: ['Renaissance art', 'Tuscan cuisine', 'Leather market'], transport: 'Train via Genoa', transportTime: '4h 30m', transportCost: '€25-50' },
      { name: 'Rome', country: 'Italy', stay: 'Days 7-8', highlights: ['Colosseum', 'Vatican', 'Roman Forum', 'Street food tour'], transport: 'Trenitalia', transportTime: '1h 30m', transportCost: '€15-30' },
      { name: 'Amalfi Coast', country: 'Italy', stay: 'Day 9', highlights: ['Positano cliffside views', 'Ravello gardens', 'Lemon groves', 'Boat tour'], transport: 'Train to Naples + bus', transportTime: '3h total', transportCost: '€20-40' },
      { name: 'Athens', country: 'Greece', stay: 'Day 10', highlights: ['Acropolis & Parthenon', 'Plaka old quarter', 'Monastiraki flea market', 'Souvlaki everywhere'], transport: 'Flight', transportTime: '2h', transportCost: '€40-100' },
    ],
    budget: { backpacker: '€45-65/day', midrange: '€100-160/day', comfort: '€220+/day' },
  },
  {
    id: 'eastern',
    title: 'Eastern Europe Budget',
    days: 12,
    tag: 'Best Value',
    tagColor: '#10B981',
    overview: 'Incredible architecture, rich history, and vibrant nightlife at a fraction of Western Europe prices.',
    cities: [
      { name: 'Prague', country: 'Czech Republic', stay: 'Days 1-3', highlights: ['Charles Bridge at sunrise', 'Prague Castle', 'Old Town Square astronomical clock', 'Beer gardens (beer cheaper than water!)'] },
      { name: 'Budapest', country: 'Hungary', stay: 'Days 4-6', highlights: ['Thermal baths (Szechenyi)', 'Ruin bars', 'Parliament building', 'Fisherman\'s Bastion sunset'], transport: 'RegioJet bus', transportTime: '6h 30m', transportCost: '€15-25' },
      { name: 'Krakow', country: 'Poland', stay: 'Days 7-8', highlights: ['Wawel Castle', 'Main Market Square', 'Auschwitz day trip', 'Kazimierz Jewish quarter'], transport: 'FlixBus or train', transportTime: '5h 30m', transportCost: '€15-30' },
      { name: 'Bucharest', country: 'Romania', stay: 'Days 9-10', highlights: ['Palace of Parliament', 'Old Town', 'Day trip to Bran Castle (Dracula)', 'Village Museum'], transport: 'Budget flight', transportTime: '1h 30m', transportCost: '€25-60' },
      { name: 'Istanbul', country: 'Turkey', stay: 'Days 11-12', highlights: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Bosphorus cruise', 'Turkish breakfast'], transport: 'Flight', transportTime: '1h 30m', transportCost: '€30-70' },
    ],
    budget: { backpacker: '€25-40/day', midrange: '€60-100/day', comfort: '€150+/day' },
  },
  {
    id: 'scandinavia',
    title: 'Scandinavian Explorer',
    days: 8,
    tag: 'Nature',
    tagColor: '#8B5CF6',
    overview: 'Dramatic fjords, design capitals, and the magic of northern lights or midnight sun depending on season.',
    cities: [
      { name: 'Copenhagen', country: 'Denmark', stay: 'Days 1-2', highlights: ['Nyhavn colorful harbor', 'Tivoli Gardens', 'Christiania freetown', 'Danish pastries'] },
      { name: 'Stockholm', country: 'Sweden', stay: 'Days 3-4', highlights: ['Gamla Stan old town', 'Vasa Museum', 'ABBA Museum', 'Archipelago boat trip'], transport: 'SAS flight or overnight train', transportTime: '1h 15m flight / 5h train', transportCost: '€50-120' },
      { name: 'Oslo', country: 'Norway', stay: 'Days 5-6', highlights: ['Viking Ship Museum', 'Vigeland Sculpture Park', 'Opera House roof walk', 'Holmenkollen ski jump'], transport: 'SJ train', transportTime: '5h', transportCost: '€40-80' },
      { name: 'Bergen', country: 'Norway', stay: 'Day 6-7', highlights: ['Bryggen wharf (UNESCO)', 'Mount Floyen funicular', 'Fish market', 'Norway in a Nutshell fjord tour'], transport: 'Bergen Railway (scenic!)', transportTime: '7h', transportCost: '€40-70' },
      { name: 'Reykjavik', country: 'Iceland', stay: 'Day 8', highlights: ['Blue Lagoon', 'Golden Circle day tour', 'Hallgrimskirkja church', 'Northern Lights (winter)'], transport: 'Icelandair flight', transportTime: '3h', transportCost: '€80-200' },
    ],
    budget: { backpacker: '€70-100/day', midrange: '€150-220/day', comfort: '€300+/day' },
  },
  {
    id: 'quick',
    title: 'Quick Europe Highlights',
    days: 7,
    tag: 'Time-Saver',
    tagColor: '#EF4444',
    overview: 'Maximum Europe in minimum time. Perfect for those with only one week but big ambitions.',
    cities: [
      { name: 'Paris', country: 'France', stay: 'Days 1-2', highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame area', 'Champs-Elysees'] },
      { name: 'Amsterdam', country: 'Netherlands', stay: 'Day 3', highlights: ['Canal walk', 'Van Gogh Museum', 'Jordaan neighborhood'], transport: 'Thalys train', transportTime: '3h 15m', transportCost: '€35-80' },
      { name: 'Berlin', country: 'Germany', stay: 'Day 4', highlights: ['Brandenburg Gate', 'East Side Gallery (Berlin Wall)', 'Museum Island'], transport: 'ICE train', transportTime: '6h', transportCost: '€40-90' },
      { name: 'Prague', country: 'Czech Republic', stay: 'Days 5-6', highlights: ['Old Town Square', 'Charles Bridge', 'Prague Castle', 'Beer halls'], transport: 'FlixBus or EC train', transportTime: '4h 30m', transportCost: '€20-40' },
      { name: 'Vienna', country: 'Austria', stay: 'Day 7', highlights: ['Schonbrunn Palace', 'St. Stephen\'s Cathedral', 'Sachertorte & coffee houses', 'Naschmarkt'], transport: 'RegioJet train', transportTime: '4h', transportCost: '€15-30' },
    ],
    budget: { backpacker: '€50-70/day', midrange: '€120-170/day', comfort: '€250+/day' },
  },
];

const tourOperators = [
  { name: 'Contiki', url: 'contiki.com', desc: 'Group tours for young travelers', who: '18-35 age group', price: '€€-€€€' },
  { name: 'Intrepid Travel', url: 'intrepidtravel.com', desc: 'Sustainable small group tours', who: 'Responsible travelers', price: '€€-€€€' },
  { name: 'G Adventures', url: 'gadventures.com', desc: 'Adventure and cultural tours', who: 'Adventure seekers', price: '€€' },
  { name: 'Topdeck Travel', url: 'topdecktravel.com', desc: 'Budget group tours', who: '18-39 age group', price: '€€' },
  { name: 'EF Tours', url: 'eftours.com', desc: 'Student and educational tours', who: 'Students & educators', price: '€€-€€€' },
  { name: 'Rick Steves', url: 'ricksteves.com', desc: 'Expert-led European tours', who: 'Cultural enthusiasts', price: '€€€' },
  { name: 'Trafalgar', url: 'trafalgar.com', desc: 'Premium guided tours', who: 'Comfort seekers', price: '€€€-€€€€' },
];

const bookingResources = [
  { name: 'Eurail', url: 'eurail.com', desc: 'Train passes for Europe', who: 'Rail travelers', price: '€€' },
  { name: 'Booking.com', url: 'booking.com', desc: 'Hotels and accommodations', who: 'All travelers', price: '€-€€€€' },
  { name: 'Hostelworld', url: 'hostelworld.com', desc: 'Hostels and budget stays', who: 'Budget travelers', price: '€' },
  { name: 'GetYourGuide', url: 'getyourguide.com', desc: 'Activities and day tours', who: 'Experience seekers', price: '€-€€€' },
  { name: 'Viator', url: 'viator.com', desc: 'Tours and experiences', who: 'All travelers', price: '€-€€€' },
  { name: 'Omio', url: 'omio.com', desc: 'Train, bus, and flight comparison', who: 'All travelers', price: '€-€€€' },
  { name: 'Skyscanner', url: 'skyscanner.com', desc: 'Flight search engine', who: 'All travelers', price: '€-€€€€' },
  { name: 'Rome2Rio', url: 'rome2rio.com', desc: 'How to get from A to B anywhere', who: 'Route planners', price: 'Free tool' },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function EuropeGuidePage() {
  const [activeRoute, setActiveRoute] = useState('western');

  return (
    <main style={{ backgroundColor: C.bg }}>
      {/* ════════ 1. HERO ════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-32 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0369A1 40%, #1E3A5F 70%, ${C.dark} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <p className="uppercase tracking-widest text-sm mb-4 opacity-80">WorldTourly Presents</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Ultimate Europe<br />Travel Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Everything you need to plan, book, and experience the trip of a lifetime across the world&apos;s most visited continent.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { n: '20+', l: 'Countries' },
              { n: '50+', l: 'Cities Covered' },
              { n: '5', l: 'Curated Routes' },
              { n: '∞', l: 'Experiences' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{s.n}</div>
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
            ['#visa', 'Schengen Visa'],
            ['#routes', 'Tour Routes'],
            ['#transport', 'Getting Around'],
            ['#seasons', 'Best Time to Visit'],
            ['#money', 'Money Guide'],
            ['#operators', 'Tour Operators'],
            ['#packing', 'Packing List'],
            ['#safety', 'Safety'],
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

      {/* ════════ 2. SCHENGEN VISA GUIDE ════════ */}
      <section id="visa" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="The single most important thing non-EU travelers need to understand before planning a European trip.">
          Schengen Visa Guide
        </SectionTitle>

        {/* What is Schengen */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>What is the Schengen Area?</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            The Schengen Area is a zone of <strong>27 European countries</strong> that have abolished passport and border controls at their mutual borders.
            With a single <strong>Schengen visa</strong>, you can travel freely between all 27 countries without showing your passport at each border.
            It is named after the 1985 Schengen Agreement, signed in the village of Schengen, Luxembourg.
          </p>
          <p className="leading-relaxed" style={{ color: '#475569' }}>
            This means you go through immigration <strong>once</strong> when you enter the Schengen Area, and once when you leave. Between countries, you simply walk, drive, or take a train across the border with no checks.
          </p>
        </Card>

        {/* Schengen countries list */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>27 Schengen Countries</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {schengenCountries.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: `${C.primary}08`, border: `1px solid ${C.primary}15` }}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium" style={{ color: C.dark }}>{c.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Non-Schengen EU */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Non-Schengen EU Countries</h3>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>These EU countries are NOT part of the Schengen Area. You may need separate entry requirements.</p>
          <div className="flex flex-wrap gap-3">
            {nonSchengenEU.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: `${C.secondary}10`, border: `1px solid ${C.secondary}30` }}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium" style={{ color: C.dark }}>{c.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Visa requirements by passport */}
        <h3 className="font-serif text-2xl font-bold mb-6 text-center" style={{ color: C.dark }}>Visa Requirements by Nationality</h3>

        {/* Visa-free */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#10B98120' }}>
              &#10003;
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>
                US, UK, Canada, Australia, Japan &amp; 60+ countries
              </h4>
              <Badge color="#10B981">Visa-Free</Badge>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Duration:</strong> 90 days in any 180-day rolling period. No visa application needed.</p>
                <p><strong>ETIAS (from 2025):</strong> The European Travel Information and Authorisation System will require pre-registration online. Cost: <strong>€7</strong>, valid for <strong>3 years</strong>. Simple online form, usually approved within minutes.</p>
                <p><strong>What you need:</strong> Valid passport (at least 6 months validity and 2 blank pages), proof of accommodation, proof of sufficient funds, return/onward ticket.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* India */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.secondary}20` }}>
              🇮🇳
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>
                India
              </h4>
              <Badge color={C.secondary}>Schengen Visa Required</Badge>
              <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Cost:</strong> €80 (adults), €40 (children 6-12), free (children under 6).</p>
                <p><strong>Where to apply:</strong> VFS Global center or the embassy/consulate of the country where you will spend the MOST days.</p>
                <p><strong>Processing time:</strong> 15-45 calendar days. <span className="font-semibold" style={{ color: C.primary }}>Apply at least 2 months before your travel date.</span></p>

                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold mb-2" style={{ color: C.dark }}>Documents Required:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Valid passport (at least 2 blank pages, valid 3+ months beyond return date)</li>
                    <li>Completed Schengen visa application form</li>
                    <li>2 recent passport-size photos (35mm x 45mm, white background)</li>
                    <li>Bank statements for last 3-6 months (minimum <strong>€50/day</strong> of travel)</li>
                    <li>Travel insurance with minimum <strong>€30,000 coverage</strong> (medical + repatriation)</li>
                    <li>Confirmed hotel bookings for entire trip</li>
                    <li>Round-trip flight itinerary (do NOT buy final tickets before visa approval)</li>
                    <li>Cover letter explaining purpose, itinerary, and ties to home country</li>
                    <li>Employer letter / business registration / university enrollment letter</li>
                    <li>Income tax returns for last 2-3 years</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="font-bold mb-2" style={{ color: '#DC2626' }}>Common Rejection Reasons:</p>
                  <ul className="space-y-1 list-disc list-inside text-sm">
                    <li>Insufficient financial proof (maintain healthy bank balance for 3+ months before applying)</li>
                    <li>Weak ties to home country (no property, no job letter, no family proof)</li>
                    <li>Inconsistent travel history or itinerary</li>
                    <li>Incomplete documentation</li>
                    <li>Previous visa overstays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* China */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.secondary}20` }}>
              🇨🇳
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: C.dark }}>China</h4>
              <Badge color={C.secondary}>Schengen Visa Required</Badge>
              <div className="mt-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Cost:</strong> €80. Process is similar to Indian nationals. Apply at the embassy of the primary destination country.</p>
                <p className="mt-2"><strong>Documents:</strong> Same as above — passport, financials, insurance (€30,000 minimum), hotel bookings, itinerary, cover letter, and employer/school letter.</p>
                <p className="mt-2"><strong>Processing:</strong> 15-45 days. Some consulates may request an interview. Apply early.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 90/180 rule */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>The 90/180 Day Rule Explained</h3>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <p>You can stay in the Schengen Area for a maximum of <strong>90 days within any 180-day period</strong>. This is a rolling window, not a calendar year.</p>
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
              <p className="font-bold mb-2" style={{ color: C.dark }}>Example:</p>
              <p>You enter France on January 1 and stay until March 31 (90 days). You must then leave the Schengen Area and cannot re-enter until July 1 — because on that date, looking back 180 days to January 1, your previous 90 days have &quot;expired.&quot;</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
              <p className="font-bold mb-2" style={{ color: C.dark }}>Split trip example:</p>
              <p>You spend 30 days in Europe in March, leave, then return in June. You have 60 days remaining in the 180-day window that started in March. Use the official EU Short-Stay Calculator to check your exact days.</p>
            </div>
          </div>
        </Card>

        {/* Pro tips */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Pro Tips for Visa Applications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Choose the right embassy', text: 'Apply at the embassy of the country where you spend the MOST days. If days are equal across countries, apply at the country of first entry.' },
              { title: 'Book refundable flights', text: 'Don\'t buy non-refundable tickets before your visa is approved. Use a flight itinerary/reservation service instead.' },
              { title: 'Show strong ties', text: 'Property ownership, steady employment, family, and a history of returning home after previous trips all strengthen your application.' },
              { title: 'Travel insurance matters', text: 'Must cover the entire Schengen Area, minimum €30,000, include medical emergency and repatriation. Buy from a recognized provider.' },
            ].map((tip) => (
              <div key={tip.title} className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>{tip.title}</p>
                <p className="text-sm" style={{ color: '#475569' }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 3. TOUR ROUTES ════════ */}
      <section id="routes" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Five expertly crafted multi-country itineraries for every travel style and budget.">
            Europe Tour Packages &amp; Suggested Routes
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
              {/* Header card */}
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

                {/* Budget overview */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { label: 'Backpacker', value: route.budget.backpacker, icon: '🎒' },
                    { label: 'Mid-range', value: route.budget.midrange, icon: '🏨' },
                    { label: 'Comfort', value: route.budget.comfort, icon: '✨' },
                  ].map((b) => (
                    <div key={b.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                      <div className="text-xl mb-1">{b.icon}</div>
                      <div className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{b.label}</div>
                      <div className="text-sm font-bold" style={{ color: C.dark }}>{b.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* City-by-city breakdown */}
              <div className="space-y-4">
                {route.cities.map((city, idx) => (
                  <Card key={city.name} className="relative">
                    {/* connector line */}
                    {idx < route.cities.length - 1 && (
                      <div className="hidden md:block absolute left-10 -bottom-4 w-0.5 h-4" style={{ backgroundColor: C.primary + '40' }} />
                    )}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* step number */}
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
        <SectionTitle sub="Trains, planes, buses, and rideshares — how to move between cities efficiently and affordably.">
          Getting Around Europe
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Eurail */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                <span className="text-xl">🚄</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Eurail / Interrail Pass</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>What it is:</strong> A single pass that gives you unlimited train travel across 33 European countries. Eurail is for non-European residents; Interrail is for European residents.</p>
              <p><strong>Approximate costs:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Youth (12-27): ~€309 for 15 days within 2 months</li>
                <li>Adult: ~€439 for 15 days within 2 months</li>
                <li>Continuous pass (unlimited travel): €639+ for 1 month</li>
              </ul>
              <p><strong>Reservation fees:</strong> Some high-speed trains (TGV in France, AVE in Spain, Eurostar) require seat reservations (€10-30 extra). Regional trains usually don&apos;t.</p>
              <p><strong>Best countries for train travel:</strong> Germany, Switzerland, Austria, Netherlands, Belgium, Italy, and Scandinavia have excellent rail networks.</p>
              <p><strong>Tip:</strong> The pass is most cost-effective if you take 3+ long-distance trains. For just 1-2 journeys, point-to-point tickets may be cheaper.</p>
            </div>
          </Card>

          {/* Budget Airlines */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}15` }}>
                <span className="text-xl">&#9992;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Budget Airlines</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['Ryanair', 'EasyJet', 'Wizz Air', 'Vueling'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>Prices:</strong> Flights from €10-50 if booked 4-8 weeks ahead. Peak season and last-minute bookings cost more.</p>
              <p><strong>Hidden fees to watch:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Checked baggage: €20-40 per bag</li>
                <li>Seat selection: €5-30</li>
                <li>Priority boarding: €6-20</li>
                <li>Airport check-in (Ryanair): €55 penalty — always check in online</li>
              </ul>
              <p><strong>Carry-on rules:</strong> Ryanair allows only a small personal bag (40x20x25cm) for free. EasyJet allows a larger cabin bag (45x36x20cm). Always check before you fly.</p>
              <p><strong>Tip:</strong> Budget airlines often fly to secondary airports (e.g., Paris Beauvais, not Charles de Gaulle). Factor in transfer time and cost.</p>
            </div>
          </Card>

          {/* FlixBus */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#10B98115' }}>
                <span className="text-xl">🚌</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>FlixBus</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>What it is:</strong> Europe&apos;s largest long-distance bus network with bright green buses connecting 2,000+ destinations in 40+ countries.</p>
              <p><strong>Prices:</strong> Often the cheapest option. Routes from €5-25 for medium distances. Wi-Fi and power outlets on board.</p>
              <p><strong>Comfort:</strong> Decent for the price. Reclining seats, air conditioning, toilet on board. Overnight buses save hotel costs.</p>
              <p><strong>Best for:</strong> Budget travelers, routes not well-served by trains (e.g., Eastern Europe), and when flights/trains are sold out.</p>
              <p><strong>Booking:</strong> Book via the FlixBus app or flixbus.com. Prices rise closer to departure, so book early.</p>
            </div>
          </Card>

          {/* BlaBlaCar */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
                <span className="text-xl">🚗</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>BlaBlaCar</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>What it is:</strong> A ridesharing platform where drivers offer empty seats in their car for long-distance trips. You share the fuel cost.</p>
              <p><strong>How it works:</strong> Search your route on blablacar.com or the app. Book and pay online. Meet the driver at the pickup point.</p>
              <p><strong>Prices:</strong> Usually 30-50% cheaper than trains. Paris to Lyon might cost €15-25 vs €30-50 by train.</p>
              <p><strong>Safety:</strong> Drivers and passengers are verified and rated. The platform handles payment. Very popular in France, Spain, and Germany.</p>
              <p><strong>Best for:</strong> Routes between smaller cities, meeting locals, and when you want door-to-door-ish travel.</p>
            </div>
          </Card>
        </div>

        {/* Booking sites */}
        <Card className="mt-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Booking &amp; Comparison Sites</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'thetrainline.com', desc: 'Best for UK + European rail tickets. Often cheapest prices.' },
              { name: 'omio.com', desc: 'Compare trains, buses & flights on one platform. Good for route planning.' },
              { name: 'rail.ninja', desc: 'European train tickets with English-friendly interface. Good customer support.' },
              { name: 'Google Flights', desc: 'Best flight search engine. Use "Explore" to find cheapest destinations.' },
              { name: 'skyscanner.com', desc: 'Search "Everywhere" to find cheapest flights from your city.' },
              { name: 'kiwi.com', desc: 'Combines budget airlines for complex multi-city routes. Unique itineraries.' },
            ].map((s) => (
              <div key={s.name} className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>{s.name}</p>
                <p className="text-xs" style={{ color: '#64748B' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 5. BEST TIME TO VISIT ════════ */}
      <section id="seasons" className="py-16" style={{ backgroundColor: `${C.secondary}08` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Each season offers a different Europe. Here is what to expect and when to go for the best experience.">
            Best Time to Visit Europe
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                season: 'Spring',
                months: 'April - May',
                emoji: '🌷',
                color: '#EC4899',
                highlights: [
                  'Tulip season in the Netherlands (mid-April peak at Keukenhof)',
                  'Pleasant temperatures across the continent (15-22 C)',
                  'Shoulder season pricing — 20-40% cheaper than summer',
                  'Fewer crowds at major attractions',
                  'Paris, Rome, and Barcelona at their most beautiful',
                ],
                best: 'Best overall value-to-experience ratio.',
              },
              {
                season: 'Summer',
                months: 'June - August',
                emoji: '☀️',
                color: '#F59E0B',
                highlights: [
                  'Music festivals, cultural events, and outdoor dining everywhere',
                  'Greek islands, Croatian coast, and Mediterranean beaches in full swing',
                  'Longest days (light until 10pm in northern Europe)',
                  'Peak tourist season — highest prices and biggest crowds',
                  'Temperatures: 25-35 C (hotter in southern Europe)',
                ],
                best: 'Best for beach holidays and festivals, but book everything early.',
              },
              {
                season: 'Autumn',
                months: 'September - October',
                emoji: '🍂',
                color: '#D97706',
                highlights: [
                  'Wine harvest season in France, Italy, Spain, and Germany',
                  'Stunning fall foliage in the Alps and Central Europe',
                  'Perfect temperatures (15-25 C) for city walking',
                  'Oktoberfest in Munich (mid-Sept to early Oct)',
                  'Crowds thin out significantly after mid-September',
                ],
                best: 'Sweet spot: great weather + fewer tourists + lower prices.',
              },
              {
                season: 'Winter',
                months: 'November - March',
                emoji: '❄️',
                color: '#3B82F6',
                highlights: [
                  'Magical Christmas markets in Germany, Austria, and Czech Republic (Nov-Dec)',
                  'World-class skiing in the Alps (France, Switzerland, Austria, Italy)',
                  'Cheapest flights and accommodation (except Christmas/New Year)',
                  'Northern Lights visible in Scandinavia and Iceland',
                  'Some attractions and restaurants may close (especially in smaller towns)',
                ],
                best: 'Best for budget travel and winter sports. Pack warm layers.',
              },
            ].map((s) => (
              <Card key={s.season}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>{s.season}</h3>
                    <p className="text-sm" style={{ color: s.color }}>{s.months}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {s.highlights.map((h) => (
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

      {/* ════════ 6. MONEY IN EUROPE ════════ */}
      <section id="money" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Currencies, exchange rates, tipping customs, and daily budgets across the continent.">
          Money in Europe
        </SectionTitle>

        {/* Euro vs non-Euro */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Euro Zone (20 countries)</h3>
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>These countries use the Euro (€). One currency, no exchange needed between them.</p>
            <div className="flex flex-wrap gap-2">
              {['Austria', 'Belgium', 'Croatia', 'Cyprus', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Portugal', 'Slovakia', 'Slovenia', 'Spain'].map((c) => (
                <span key={c} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${C.primary}10`, color: C.primary }}>{c}</span>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Non-Euro Currencies</h3>
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>These countries have their own currency. You will need to exchange or use your card.</p>
            <div className="space-y-2">
              {[
                { country: 'United Kingdom', currency: 'British Pound (GBP)' },
                { country: 'Switzerland', currency: 'Swiss Franc (CHF)' },
                { country: 'Czech Republic', currency: 'Czech Koruna (CZK)' },
                { country: 'Hungary', currency: 'Hungarian Forint (HUF)' },
                { country: 'Poland', currency: 'Polish Zloty (PLN)' },
                { country: 'Sweden', currency: 'Swedish Krona (SEK)' },
                { country: 'Denmark', currency: 'Danish Krone (DKK)' },
                { country: 'Norway', currency: 'Norwegian Krone (NOK)' },
                { country: 'Iceland', currency: 'Icelandic Krona (ISK)' },
                { country: 'Turkey', currency: 'Turkish Lira (TRY)' },
                { country: 'Romania', currency: 'Romanian Leu (RON)' },
              ].map((c) => (
                <div key={c.country} className="flex justify-between text-sm px-2 py-1 rounded" style={{ backgroundColor: C.bg }}>
                  <span style={{ color: C.dark }}>{c.country}</span>
                  <span style={{ color: '#64748B' }}>{c.currency}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Exchange tips */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Best Exchange &amp; Payment Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold mb-1" style={{ color: C.primary }}>Use Revolut or Wise Card</p>
                <p>These fintech cards offer real mid-market exchange rates with zero or minimal forex fees. Get one before your trip. Works in ATMs and shops worldwide.</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#FEF2F210' }}>
                <p className="font-bold mb-1" style={{ color: '#DC2626' }}>Avoid airport exchange counters</p>
                <p>They charge 5-15% above the real rate. Worst place to exchange money. If desperate, use an ATM at the airport instead.</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold mb-1" style={{ color: C.dark }}>ATM tips</p>
                <p>Use ATMs from major local banks (not independent ATMs). Always choose &quot;charge in local currency&quot; (decline dynamic currency conversion). Withdraw larger amounts less often to minimize per-transaction fees.</p>
              </div>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold mb-1" style={{ color: C.dark }}>Cards vs Cash</p>
                <p>Western/Northern Europe is nearly cashless — cards accepted everywhere including street vendors. Eastern and Southern Europe are more cash-dependent. Always carry some cash as backup.</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold mb-1" style={{ color: C.dark }}>Contactless payments</p>
                <p>Apple Pay, Google Pay, and contactless cards work widely. Tap-to-pay limits vary by country (usually €25-50 without PIN).</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tipping guide */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Tipping Guide by Country</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { country: 'France', tip: 'Not expected (service included). Round up for great service.' },
              { country: 'Germany', tip: 'Round up to nearest euro or 5-10% at restaurants.' },
              { country: 'Italy', tip: 'Not expected. Check if "coperto" (cover charge) is included.' },
              { country: 'Spain', tip: 'Not expected. Leave small change for excellent service.' },
              { country: 'UK', tip: '10-15% at sit-down restaurants. Check if service charge is added.' },
              { country: 'Netherlands', tip: 'Round up or 5-10%. Service is included in prices.' },
              { country: 'Czech Republic', tip: '10% is standard at restaurants.' },
              { country: 'Hungary', tip: '10% at restaurants. Cash preferred for tips.' },
              { country: 'Greece', tip: '5-10% or round up. Not obligatory but appreciated.' },
              { country: 'Switzerland', tip: 'Service included. Rounding up is polite.' },
              { country: 'Scandinavia', tip: 'Not expected. Tipping is uncommon. Round up if you wish.' },
              { country: 'Poland', tip: '10% at restaurants if service charge not included.' },
            ].map((t) => (
              <div key={t.country} className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.dark }}>{t.country}</p>
                <p className="text-xs" style={{ color: '#64748B' }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily costs */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Average Daily Costs (Budget Traveler)</h3>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>Approximate daily cost for a budget-conscious traveler (hostel + street food + public transport + 1-2 attractions).</p>
          <div className="space-y-2">
            {[
              { country: 'Turkey', cost: '€20-35', bar: 15 },
              { country: 'Romania / Bulgaria', cost: '€25-40', bar: 20 },
              { country: 'Hungary / Poland', cost: '€30-45', bar: 25 },
              { country: 'Czech Republic / Croatia', cost: '€35-55', bar: 30 },
              { country: 'Portugal / Greece / Spain', cost: '€40-60', bar: 35 },
              { country: 'Germany / Italy', cost: '€50-75', bar: 45 },
              { country: 'France / Netherlands', cost: '€55-85', bar: 50 },
              { country: 'UK', cost: '€65-100', bar: 60 },
              { country: 'Scandinavia', cost: '€70-110', bar: 65 },
              { country: 'Switzerland / Iceland', cost: '€80-130', bar: 75 },
            ].map((c) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-sm w-48 flex-shrink-0" style={{ color: C.dark }}>{c.country}</span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                  <div
                    className="h-full rounded-full flex items-center px-3"
                    style={{
                      width: `${c.bar + 25}%`,
                      background: `linear-gradient(90deg, ${C.primary}, ${C.primary}90)`,
                    }}
                  >
                    <span className="text-xs text-white font-medium">{c.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 7. TOUR OPERATORS & BOOKING ════════ */}
      <section id="operators" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Reputable tour operators and booking platforms to help plan your trip. These are informational resources, not affiliate links.">
            Tour Operators &amp; Booking Resources
          </SectionTitle>

          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Group Tour Operators</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Booking &amp; Planning Platforms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingResources.map((r) => (
              <Card key={r.name} className="text-center">
                <h4 className="font-bold mb-1" style={{ color: C.dark }}>{r.name}</h4>
                <p className="text-xs mb-2" style={{ color: '#64748B' }}>{r.desc}</p>
                <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>For: {r.who}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${C.secondary}15`, color: C.secondary }}>{r.price}</span>
                  <span className="text-xs font-medium" style={{ color: C.primary }}>{r.url}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 8. PACKING LIST ════════ */}
      <section id="packing" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="A complete packing checklist so you do not forget anything important.">
          Europe Packing List
        </SectionTitle>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Documents */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">📄</span> Essential Documents
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                'Valid passport (6+ months validity)',
                'Visa / ETIAS confirmation',
                'Travel insurance card + policy number',
                'Photocopies of all documents (keep separate from originals)',
                'Digital copies in email/cloud',
                'Hotel booking confirmations',
                'Flight/train tickets (printed + digital)',
                'Emergency contact list',
                "Driver's license + International Driving Permit (if renting a car)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.primary }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Money */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">💳</span> Money &amp; Cards
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                '2 different debit cards (from different banks for backup)',
                '1 credit card (Visa or Mastercard widely accepted)',
                'Revolut or Wise card (no forex fees)',
                '€100 cash for emergencies',
                'Money belt or hidden pouch',
                'Notify your bank of travel dates',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.secondary }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Tech */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">🔌</span> Tech &amp; Gadgets
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                'Universal power adapter (Type C/F for continental Europe, Type G for UK)',
                'Portable charger / power bank (10,000+ mAh)',
                'Phone with offline maps (Google Maps or Maps.me)',
                'Earbuds / headphones for trains',
                'Camera + charger + extra memory card',
                'E-reader for long journeys',
                'European SIM card or eSIM (Airalo, Holafly) for data',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#10B981' }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Clothing Spring/Summer */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">👕</span> Clothing (Spring/Summer)
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                '4-5 t-shirts / tops (quick-dry material)',
                '2 pairs of pants (1 jeans, 1 lightweight)',
                '1-2 shorts',
                '1 light jacket or hoodie (evenings can be cool)',
                '1 rain jacket (compact, packable)',
                'Comfortable walking shoes (broken in!)',
                'Sandals or flip-flops',
                '1 smart outfit for nice restaurants',
                'Swimsuit',
                'Sun hat + sunglasses',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EC4899' }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Clothing Winter */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">🧥</span> Clothing (Autumn/Winter)
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                'Warm waterproof jacket',
                'Layers: thermal base + fleece mid-layer',
                '2-3 long-sleeve shirts',
                '2 pairs warm pants',
                'Warm waterproof boots',
                'Scarf, gloves, and warm hat',
                'Thick socks (wool blend)',
                'Umbrella (compact)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#3B82F6' }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Day bag */}
          <Card>
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.dark }}>
              <span className="text-xl">🎒</span> Day Bag Essentials
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              {[
                'Reusable water bottle',
                'Sunscreen (SPF 30+)',
                'Basic first aid kit',
                'Hand sanitizer',
                'Snacks for transit',
                'Notebook + pen',
                'Ziplock bags (for liquids and wet items)',
                'Padlock for hostel lockers',
                'Packing cubes (game changer for organization)',
                'Laundry bag',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#8B5CF6' }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ════════ 9. SAFETY ════════ */}
      <section id="safety" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Europe is one of the safest continents for travelers. A few precautions go a long way.">
            Safety in Europe
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            {/* General safety */}
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>General Safety</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <p>Europe is <strong>generally very safe</strong> for tourists. Violent crime against tourists is rare. The main concern is petty theft and scams in popular tourist areas.</p>
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
                  <p className="font-bold text-lg mb-1" style={{ color: C.primary }}>112</p>
                  <p className="text-sm">Emergency number that works in <strong>ALL EU countries</strong>. Save it in your phone. It connects you to police, fire, and ambulance services. Operators speak English.</p>
                </div>
              </div>
            </Card>

            {/* Pickpocket hotspots */}
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Pickpocket Hotspots</h3>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>These areas are famous for skilled pickpockets. Stay alert and keep valuables secure.</p>
              <div className="space-y-3">
                {[
                  { city: 'Barcelona', area: 'La Rambla, Metro, Sagrada Familia queues' },
                  { city: 'Paris', area: 'Metro lines 1 & 4, Eiffel Tower, Sacre-Coeur steps' },
                  { city: 'Rome', area: 'Colosseum area, Termini station, Bus 64 to Vatican' },
                  { city: 'Prague', area: 'Old Town Square, Charles Bridge, tram 22' },
                  { city: 'Athens', area: 'Monastiraki, Omonia Square, crowded buses' },
                ].map((h) => (
                  <div key={h.city} className="flex items-start gap-3 text-sm">
                    <span className="font-bold w-24 flex-shrink-0" style={{ color: '#DC2626' }}>{h.city}</span>
                    <span style={{ color: '#475569' }}>{h.area}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Train safety */}
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Train &amp; Transit Safety</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                {[
                  'Keep bags in sight or use luggage racks above your seat (not by the door)',
                  'On overnight trains, use a cable lock to secure bags to the luggage rack',
                  'Lock your compartment from inside on sleeper trains',
                  'Be wary of anyone offering unsolicited help with luggage at stations',
                  'Keep passport and phone in a front pocket or money belt, never in back pocket or backpack side pocket',
                  'Avoid empty train cars late at night — sit near other passengers',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.primary }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Common scams */}
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Common Scams to Avoid</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
                {[
                  'Friendship bracelet scam (Paris, Rome): Someone ties a bracelet on your wrist then demands payment. Keep hands in pockets when approached.',
                  'Petition scam: Someone asks you to sign a petition, then demands a donation or pickpockets you while distracted.',
                  'Fake police: Someone in plain clothes claims to be police and asks to see your wallet. Real police will have ID and will not ask for your wallet.',
                  'Taxi overcharging: Always use official taxi ranks or ride-hailing apps (Uber, Bolt, Free Now). Insist on the meter.',
                  'Restaurant tourist traps: Avoid restaurants with people aggressively inviting you in. Check Google reviews first.',
                  'Free rose/gift scam: Refuse anything handed to you "for free" — payment will be demanded immediately after.',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#DC2626' }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER-ISH ════════ */}
      <section className="text-center py-16 px-4">
        <p className="font-serif text-2xl font-bold mb-3" style={{ color: C.dark }}>Ready to Explore Europe?</p>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#64748B' }}>
          This guide covers the essentials for planning your European adventure. Bookmark this page and refer back as you plan. Safe travels!
        </p>
        <p className="text-xs mt-6" style={{ color: '#94A3B8' }}>
          Last updated: April 2026. Information is subject to change — always verify visa requirements with official embassy websites before applying.
        </p>
      </section>
    </main>
  );
}
