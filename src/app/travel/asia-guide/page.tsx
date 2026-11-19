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

const southeastAsiaCountries = [
  { name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}' },
  { name: 'Cambodia', flag: '\u{1F1F0}\u{1F1ED}' },
  { name: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}' },
  { name: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}' },
  { name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
  { name: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}' },
  { name: 'Laos', flag: '\u{1F1F1}\u{1F1E6}' },
  { name: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}' },
];

const eastAsiaCountries = [
  { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}' },
  { name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
];

const southAsiaCountries = [
  { name: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}' },
  { name: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}' },
  { name: 'Maldives', flag: '\u{1F1F2}\u{1F1FB}' },
];

const middleEastCountries = [
  { name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { name: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}' },
  { name: 'Israel', flag: '\u{1F1EE}\u{1F1F1}' },
  { name: 'Oman', flag: '\u{1F1F4}\u{1F1F2}' },
  { name: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}' },
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
    id: 'sea-backpacker',
    title: 'Southeast Asia Backpacker Trail',
    days: 21,
    tag: 'Most Popular',
    tagColor: C.primary,
    overview: 'The classic Southeast Asia circuit covering temples, street food, beaches, and bustling cities across four countries at rock-bottom prices.',
    cities: [
      { name: 'Bangkok', country: 'Thailand', stay: 'Days 1-3', highlights: ['Grand Palace & Wat Phra Kaew', 'Chatuchak Weekend Market', 'Khao San Road nightlife', 'Street food at Chinatown (Yaowarat)'] },
      { name: 'Chiang Mai', country: 'Thailand', stay: 'Days 4-6', highlights: ['Doi Suthep temple', 'Old City temples', 'Night Bazaar', 'Thai cooking class', 'Elephant Nature Park'], transport: 'Overnight sleeper train or flight', transportTime: '12h train / 1h 15m flight', transportCost: '$15-30 train / $30-60 flight' },
      { name: 'Luang Prabang', country: 'Laos', stay: 'Days 7-8', highlights: ['Alms giving ceremony at dawn', 'Kuang Si Waterfall', 'Night market', 'Mekong River slow boat'], transport: 'Slow boat (2 days) or flight', transportTime: '2 days boat / 1h flight', transportCost: '$30-40 boat / $60-100 flight' },
      { name: 'Hanoi', country: 'Vietnam', stay: 'Days 9-10', highlights: ['Old Quarter walking tour', 'Hoan Kiem Lake', 'Bun cha & pho street food', 'Water puppet show'], transport: 'Flight via Bangkok or direct', transportTime: '1h 30m', transportCost: '$50-90' },
      { name: 'Halong Bay', country: 'Vietnam', stay: 'Day 11-12', highlights: ['Overnight junk boat cruise', 'Kayaking through limestone karsts', 'Titop Island viewpoint', 'Sung Sot Cave'], transport: 'Bus or shuttle from Hanoi', transportTime: '3h 30m', transportCost: '$10-15' },
      { name: 'Hoi An', country: 'Vietnam', stay: 'Days 13-14', highlights: ['Ancient Town lantern-lit streets', 'Custom tailoring (24-hour suits!)', 'Banh mi (best in Vietnam)', 'An Bang Beach', 'Basket boat ride'], transport: 'Train to Da Nang + taxi', transportTime: '16h train + 30m taxi', transportCost: '$25-40' },
      { name: 'Ho Chi Minh City', country: 'Vietnam', stay: 'Days 15-16', highlights: ['Cu Chi Tunnels day trip', 'War Remnants Museum', 'Ben Thanh Market', 'Mekong Delta tour', 'Rooftop bars'], transport: 'Flight from Da Nang', transportTime: '1h 20m', transportCost: '$30-60' },
      { name: 'Siem Reap', country: 'Cambodia', stay: 'Days 17-19', highlights: ['Angkor Wat sunrise', 'Bayon Temple faces', 'Ta Prohm (Tomb Raider temple)', 'Pub Street nightlife', 'Floating villages on Tonle Sap'], transport: 'Flight', transportTime: '1h 45m', transportCost: '$50-80' },
      { name: 'Phnom Penh', country: 'Cambodia', stay: 'Days 20-21', highlights: ['Royal Palace & Silver Pagoda', 'Tuol Sleng Genocide Museum', 'Killing Fields', 'Riverside promenade', 'Russian Market shopping'], transport: 'Bus or shared taxi', transportTime: '6h bus / 5h taxi', transportCost: '$8-15' },
    ],
    budget: { backpacker: '$20-35/day', midrange: '$50-80/day', comfort: '$120+/day' },
  },
  {
    id: 'japan-golden',
    title: 'Japan Golden Route',
    days: 10,
    tag: 'Cultural',
    tagColor: '#EF4444',
    overview: 'Japan\'s most iconic cities and cultural landmarks connected by the legendary Shinkansen bullet train.',
    cities: [
      { name: 'Tokyo', country: 'Japan', stay: 'Days 1-3', highlights: ['Shibuya Crossing', 'Meiji Shrine', 'Tsukiji Outer Market sushi', 'Akihabara electronics', 'Shinjuku nightlife', 'TeamLab Borderless'] },
      { name: 'Hakone', country: 'Japan', stay: 'Day 4', highlights: ['Mt. Fuji views (clear days)', 'Open-air hot spring (onsen)', 'Lake Ashi pirate ship cruise', 'Hakone Open Air Museum'], transport: 'Romancecar express', transportTime: '1h 25m', transportCost: '$25-35 (Hakone Free Pass recommended)' },
      { name: 'Kyoto', country: 'Japan', stay: 'Days 5-7', highlights: ['Fushimi Inari thousand torii gates', 'Kinkaku-ji Golden Pavilion', 'Arashiyama Bamboo Grove', 'Geisha district (Gion)', 'Tea ceremony experience', 'Nishiki Market'], transport: 'Shinkansen bullet train', transportTime: '2h', transportCost: '$100 (covered by JR Pass)' },
      { name: 'Nara', country: 'Japan', stay: 'Day 8', highlights: ['Nara Park friendly deer', 'Todai-ji Great Buddha', 'Kasuga-taisha shrine', 'Naramachi old merchant district'], transport: 'JR Nara Line', transportTime: '45m', transportCost: '$5 (covered by JR Pass)' },
      { name: 'Osaka', country: 'Japan', stay: 'Day 9', highlights: ['Dotonbori neon street food paradise', 'Osaka Castle', 'Takoyaki (octopus balls)', 'Shinsekai retro district', 'Kuromon Market'], transport: 'JR train', transportTime: '50m', transportCost: '$5 (covered by JR Pass)' },
      { name: 'Hiroshima', country: 'Japan', stay: 'Day 10', highlights: ['Peace Memorial Park & Museum', 'Atomic Bomb Dome', 'Miyajima Island floating torii gate', 'Hiroshima-style okonomiyaki'], transport: 'Shinkansen', transportTime: '1h 30m', transportCost: '$75 (covered by JR Pass)' },
    ],
    budget: { backpacker: '$60-90/day', midrange: '$120-180/day', comfort: '$250+/day' },
  },
  {
    id: 'india-golden',
    title: 'India Golden Triangle + Goa',
    days: 14,
    tag: 'Adventure',
    tagColor: '#F59E0B',
    overview: 'India\'s most iconic monuments, vibrant cities, royal palaces, and tropical beaches in a single unforgettable trip.',
    cities: [
      { name: 'Delhi', country: 'India', stay: 'Days 1-3', highlights: ['Red Fort', 'Qutub Minar', 'Humayun\'s Tomb', 'Chandni Chowk street food tour', 'India Gate', 'Jama Masjid'] },
      { name: 'Agra', country: 'India', stay: 'Days 4-5', highlights: ['Taj Mahal sunrise visit', 'Agra Fort', 'Mehtab Bagh (Taj sunset view)', 'Baby Taj (Itimad-ud-Daulah)'], transport: 'Gatimaan Express train', transportTime: '1h 40m', transportCost: '$8-15' },
      { name: 'Jaipur', country: 'India', stay: 'Days 6-8', highlights: ['Amber Fort & elephant ride area', 'Hawa Mahal (Palace of Winds)', 'City Palace', 'Jantar Mantar observatory', 'Bazaar shopping for textiles & gems'], transport: 'Train or bus', transportTime: '4h 30m', transportCost: '$5-12' },
      { name: 'Udaipur', country: 'India', stay: 'Days 9-10', highlights: ['Lake Palace hotel views', 'City Palace complex', 'Boat ride on Lake Pichola', 'Jagdish Temple', 'Rooftop dining with lake views'], transport: 'Overnight train or bus', transportTime: '7h train / 6h bus', transportCost: '$8-20' },
      { name: 'Mumbai', country: 'India', stay: 'Days 11-12', highlights: ['Gateway of India', 'Elephanta Caves boat trip', 'Dhobi Ghat (open-air laundry)', 'Marine Drive sunset walk', 'Street food: vada pav & pav bhaji', 'Bollywood tour'], transport: 'Flight', transportTime: '1h 15m', transportCost: '$40-80' },
      { name: 'Goa', country: 'India', stay: 'Days 13-14', highlights: ['Beach time at Palolem or Anjuna', 'Old Goa churches (UNESCO)', 'Saturday Night Market (Arpora)', 'Seafood shacks on the beach', 'Sunset at Vagator Beach'], transport: 'Flight', transportTime: '1h', transportCost: '$30-60' },
    ],
    budget: { backpacker: '$15-25/day', midrange: '$40-70/day', comfort: '$100+/day' },
  },
  {
    id: 'china-highlights',
    title: 'China Highlights',
    days: 12,
    tag: 'Epic Journey',
    tagColor: '#8B5CF6',
    overview: 'From the Great Wall to futuristic Shanghai, experience five thousand years of civilization connected by the world\'s most advanced high-speed rail network.',
    cities: [
      { name: 'Beijing', country: 'China', stay: 'Days 1-3', highlights: ['Great Wall at Mutianyu (less crowded)', 'Forbidden City & Tiananmen Square', 'Temple of Heaven', 'Hutong neighborhood rickshaw tour', 'Peking duck dinner', 'Summer Palace'] },
      { name: 'Xi\'an', country: 'China', stay: 'Days 4-5', highlights: ['Terracotta Warriors army', 'Ancient City Wall cycling', 'Muslim Quarter street food', 'Big Wild Goose Pagoda', 'Tang Dynasty dinner show'], transport: 'High-speed rail (G-train)', transportTime: '4h 30m', transportCost: '$50-80' },
      { name: 'Chengdu', country: 'China', stay: 'Days 6-7', highlights: ['Giant Panda Breeding Center', 'Sichuan hot pot experience', 'Jinli Ancient Street', 'Leshan Giant Buddha day trip', 'Sichuan opera face-changing show'], transport: 'High-speed rail', transportTime: '3h 30m', transportCost: '$40-60' },
      { name: 'Guilin & Yangshuo', country: 'China', stay: 'Days 8-9', highlights: ['Li River bamboo raft cruise', 'Karst mountain scenery', 'Yangshuo cycling through rice paddies', 'Reed Flute Cave', 'Cormorant fishing show', 'West Street nightlife'], transport: 'Flight or high-speed rail', transportTime: '2h flight / 8h train', transportCost: '$50-100 flight / $40-60 train' },
      { name: 'Shanghai', country: 'China', stay: 'Days 10-12', highlights: ['The Bund waterfront promenade', 'Yu Garden & Old City', 'French Concession tree-lined streets', 'Shanghai Tower observation deck', 'Nanjing Road shopping', 'Xiaolongbao (soup dumplings)', 'Zhujiajiao water town day trip'], transport: 'High-speed rail', transportTime: '8h (or 2h flight)', transportCost: '$60-90 train / $50-100 flight' },
    ],
    budget: { backpacker: '$30-50/day', midrange: '$70-120/day', comfort: '$180+/day' },
  },
];

const tourOperators = [
  { name: 'Intrepid Travel', url: 'intrepidtravel.com', desc: 'Sustainable small group tours across Asia', who: 'Responsible travelers', price: '$$-$$$' },
  { name: 'G Adventures', url: 'gadventures.com', desc: 'Adventure and cultural tours with local leaders', who: 'Adventure seekers', price: '$$' },
  { name: 'Geckos Adventures', url: 'geckosadventures.com', desc: 'Budget-friendly group trips for 18-39 year olds', who: 'Young travelers', price: '$-$$' },
  { name: 'Inside Asia Tours', url: 'insideasiatours.com', desc: 'Japan and Southeast Asia specialists', who: 'Japan enthusiasts', price: '$$$' },
  { name: 'Cox & Kings', url: 'coxandkings.com', desc: 'Luxury and heritage tours, India specialists', who: 'Luxury travelers', price: '$$$-$$$$' },
  { name: 'MakeMyTrip', url: 'makemytrip.com', desc: 'India\'s largest travel platform for flights, hotels, tours', who: 'India travelers', price: '$-$$$' },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function AsiaGuidePage() {
  const [activeRoute, setActiveRoute] = useState('sea-backpacker');

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
            The Ultimate Asia<br />Travel Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-4">
            Asia: The World&apos;s Most Diverse Continent
          </p>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto mb-10">
            From ancient temples and futuristic cities to pristine beaches and towering peaks &mdash; everything you need to explore the world&apos;s largest continent.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { n: '15+', l: 'Countries' },
              { n: '40+', l: 'Cities Covered' },
              { n: '4', l: 'Curated Routes' },
              { n: '4', l: 'Regions' },
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
            ['#visa', 'Visa Overview'],
            ['#routes', 'Tour Routes'],
            ['#transport', 'Getting Around'],
            ['#seasons', 'Best Time to Visit'],
            ['#money', 'Money Guide'],
            ['#operators', 'Tour Operators'],
            ['#health', 'Health & Safety'],
            ['#packing', 'Packing List'],
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

      {/* ════════ 2. VISA OVERVIEW BY REGION ════════ */}
      <section id="visa" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Asia spans dozens of countries with wildly different entry requirements. Here is a region-by-region breakdown.">
          Visa Overview by Region
        </SectionTitle>

        {/* Southeast Asia */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>Southeast Asia</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            Southeast Asia is one of the easiest regions in the world for visa-free travel. Most countries offer <strong>visa-free entry or visa-on-arrival</strong> for US, UK, EU, Australian, and Canadian passport holders.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {southeastAsiaCountries.map((c) => (
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
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <p className="font-bold mb-2" style={{ color: C.dark }}>Country-by-Country Details:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Thailand:</strong> Visa-free 30 days for US/UK/EU (extendable 30 days at immigration for 1,900 THB). Visa-on-arrival for Indian passport holders (15 days, 2,000 THB).</li>
                <li><strong>Vietnam:</strong> E-visa required for most nationalities ($25, 30 days single entry). UK citizens get 45 days visa-free. US citizens need e-visa.</li>
                <li><strong>Cambodia:</strong> Visa-on-arrival at airports and land borders ($30, 30 days). E-visa also available ($36). Bring passport photo.</li>
                <li><strong>Indonesia:</strong> Visa-on-arrival at major airports ($35, 30 days, extendable once). Visa-free for some ASEAN countries.</li>
                <li><strong>Malaysia:</strong> Visa-free 90 days for US/UK/EU/Australia. India needs visa or can use eNTRI (electronic travel registration, 15 days).</li>
                <li><strong>Singapore:</strong> Visa-free 30-90 days for US/UK/EU/Australia/Japan. India requires visa (apply at VFS Global).</li>
                <li><strong>Philippines:</strong> Visa-free 30 days for US/UK/EU/Australia. India requires visa.</li>
                <li><strong>Laos:</strong> Visa-on-arrival at airports and major border crossings ($30-42 depending on nationality, 30 days).</li>
                <li><strong>Myanmar:</strong> E-visa required for most nationalities ($50, 28 days). Tourism has reopened but check current conditions.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* East Asia */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>East Asia</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            East Asia&apos;s highly developed nations have straightforward but distinct visa policies. Japan and South Korea are very traveler-friendly; China requires more planning.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {eastAsiaCountries.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: `${C.primary}08`, border: `1px solid ${C.primary}15` }}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium" style={{ color: C.dark }}>{c.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Japan:</strong> Visa-free 90 days for US/UK/EU/Australia/Canada. No visa needed &mdash; just show up with a valid passport and return ticket. India requires visa (apply at embassy, $25 single entry).</li>
                <li><strong>South Korea:</strong> Visa-free 90 days for US/UK/EU/Australia/Canada. K-ETA (Korean Electronic Travel Authorization) required &mdash; apply online ($10, approved within 72 hours). India requires visa.</li>
                <li><strong>China:</strong> Visa required for most nationalities. Apply at Chinese embassy/consulate ($140 US citizens, $80 most others). Processing: 4-5 business days. <strong>144-hour transit visa-free</strong> policy available in Beijing, Shanghai, Guangzhou, Chengdu, and other major cities &mdash; you can stay up to 6 days without a visa if transiting through China to a third country. This is the best loophole for short visits.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.secondary}10` }}>
              <p className="font-bold mb-2" style={{ color: C.secondary }}>Pro Tip: China 144-Hour Transit Visa</p>
              <p>If you are flying from one country (e.g., Japan) through China to another (e.g., Thailand), you can stop in Shanghai, Beijing, or other qualifying cities for up to 6 days visa-free. Perfect for a quick Great Wall visit or Shanghai exploration. You must have a confirmed onward ticket to a third country (not your origin).</p>
            </div>
          </div>
        </Card>

        {/* South Asia */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>South Asia</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            South Asia offers incredible value for travelers. Most countries have easy visa processes, with e-visas and visas-on-arrival widely available.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {southAsiaCountries.map((c) => (
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
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>India:</strong> E-Visa required for US/UK/EU/Australia ($10-80 depending on duration: 30-day, 1-year, or 5-year e-visa). Apply online at indianvisaonline.gov.in. Processing: 3-5 business days. Valid at 28 designated airports and 5 seaports. Bring a printout of the e-visa.</li>
                <li><strong>Nepal:</strong> Visa-on-arrival at Tribhuvan International Airport and land borders. Cost: $30 (15 days), $50 (30 days), $125 (90 days). Bring passport photos and USD cash. Indian nationals do not need a visa.</li>
                <li><strong>Sri Lanka:</strong> Electronic Travel Authorization (ETA) required. Apply online at eta.gov.lk. Cost: $50 (30 days, extendable to 90). Free for children under 12. Processing: usually 24-48 hours.</li>
                <li><strong>Maldives:</strong> Visa-free 30 days for ALL nationalities. Just show up with a valid passport, return ticket, and hotel booking. One of the simplest entry requirements in the world.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Middle East */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>Middle East</h3>
          <p className="leading-relaxed mb-4" style={{ color: '#475569' }}>
            The Middle East has become increasingly tourist-friendly, with several countries offering visa-free access or easy e-visa processes.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {middleEastCountries.map((c) => (
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
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>UAE (Dubai/Abu Dhabi):</strong> Visa-free 30 days for US/UK/EU/Australia. India passport holders can get visa-on-arrival if they hold a valid US visa or green card; otherwise, apply for a tourist visa ($80-100, 30 days) through an airline or hotel sponsor.</li>
                <li><strong>Jordan:</strong> Visa-on-arrival at Queen Alia International Airport ($56 JOD / ~$40 single entry, 30 days). Consider the <strong>Jordan Pass</strong> ($70-80) which includes visa fee + Petra entry + 40 attractions &mdash; saves money if visiting Petra.</li>
                <li><strong>Israel:</strong> Visa-free 90 days for US/UK/EU/Australia. No stamp in passport (they use entry cards now). India requires visa (apply at embassy). Note: An Israeli stamp/entry card may complicate travel to some other Middle Eastern countries.</li>
                <li><strong>Oman:</strong> E-visa for most nationalities. US/UK/EU get 10-day or 30-day tourist visa ($13-52). Apply at evisa.rop.gov.om. Indian nationals can get e-visa ($52, 30 days).</li>
                <li><strong>Turkey:</strong> E-Visa for US ($50, 90 days), UK ($40, 90 days), Australia ($60, 90 days). Apply at evisa.gov.tr &mdash; instant approval. EU citizens (most) are visa-free 90 days. India requires e-visa ($60, 30 days).</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Asia Visa Pro Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Carry passport photos', text: 'Many Asian visa-on-arrival counters require 2 passport-sized photos. Carry 6-8 printed copies. Getting photos at land borders is expensive and stressful.' },
              { title: 'USD cash is king', text: 'Visa-on-arrival fees in Southeast Asia and South Asia are often payable only in crisp, undamaged US dollar bills. ATMs at borders are unreliable.' },
              { title: 'Proof of onward travel', text: 'Many Asian countries require proof of a return or onward ticket. Airlines may deny boarding without it. Book a refundable flight or use onwardticket.com ($12).' },
              { title: 'Check passport validity', text: 'Most Asian countries require at least 6 months passport validity remaining from date of entry. Some require 2+ blank pages. Renew early if needed.' },
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
          <SectionTitle sub="Four expertly crafted multi-country itineraries spanning the breadth of Asia for every travel style.">
            Asia Tour Packages &amp; Suggested Routes
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
                    { label: 'Backpacker', value: route.budget.backpacker, icon: '\u{1F392}' },
                    { label: 'Mid-range', value: route.budget.midrange, icon: '\u{1F3E8}' },
                    { label: 'Comfort', value: route.budget.comfort, icon: '\u2728' },
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
        <SectionTitle sub="Bullet trains, budget airlines, tuk-tuks, and ride apps — how to navigate the world's biggest continent.">
          Getting Around Asia
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trains */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                <span className="text-xl">{'\u{1F684}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Asia&apos;s Best Trains</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Japan Shinkansen (Bullet Train):</strong> The gold standard. 320 km/h, always on time (average delay: 36 seconds/year). Get the <strong>JR Pass</strong>: 7-day ($280), 14-day ($450), 21-day ($575). Covers most Shinkansen lines, JR local trains, and some ferries. Book at japanrailpass.net before you leave home.</p>
              <p><strong>China High-Speed Rail:</strong> The world&apos;s largest high-speed network (40,000+ km). G-trains reach 350 km/h. Book on Trip.com or 12306.cn (Chinese app). Prices are very reasonable: Beijing to Shanghai (4h 30m) costs ~$80. Second class is comfortable; first class is spacious.</p>
              <p><strong>Indian Railways:</strong> The world&apos;s fourth-largest rail network. Book on irctc.co.in (requires Indian phone number &mdash; use Cleartrip or ixigo apps as alternatives). Classes: AC First ($$$), AC 2-Tier ($$), AC 3-Tier ($), Sleeper (cheapest). Book 2-3 months ahead for popular routes. The new Vande Bharat Express trains are modern and fast.</p>
              <p><strong>Thailand &amp; Vietnam:</strong> Overnight sleeper trains are an adventure and save a hotel night. Thailand: book at 12go.asia. Vietnam: Reunification Express runs Hanoi to Ho Chi Minh (30h, $35-60).</p>
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
                {['AirAsia', 'VietJet Air', 'IndiGo', 'Lion Air', 'Scoot', 'Cebu Pacific'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>AirAsia:</strong> The king of Asian budget travel. Hub in Kuala Lumpur. Flights from $15-50 across Southeast Asia. Book at airasia.com &mdash; prices rise closer to departure.</p>
              <p><strong>VietJet Air:</strong> Vietnam&apos;s budget carrier with expanding regional routes. Domestic flights from $20. International from $30-60.</p>
              <p><strong>IndiGo:</strong> India&apos;s largest airline. Reliable, affordable, covers all major Indian cities. Domestic from $20-50. Also flies to Southeast Asia and Middle East.</p>
              <p><strong>Lion Air:</strong> Indonesia&apos;s largest carrier. Essential for island-hopping in the archipelago. Bali to Jakarta from $25.</p>
              <p><strong>Hidden fees:</strong> All budget carriers charge for checked bags ($10-25), meals, and seat selection. Carry-on limits are strict (7kg). Weigh your bags before arriving at the airport.</p>
            </div>
          </Card>

          {/* Local Transport */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#10B98115' }}>
                <span className="text-xl">{'\u{1F6FA}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Tuk-Tuks &amp; Motorbike Taxis</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Tuk-tuks:</strong> Iconic three-wheeled vehicles found across Thailand, Cambodia, India (auto-rickshaws), and Sri Lanka. Always agree on the price BEFORE getting in. In Bangkok, expect 50-150 THB ($1.50-4.50) for short trips. In India, insist on the meter or negotiate firmly.</p>
              <p><strong>Motorbike taxis:</strong> The fastest way through traffic in Bangkok (look for orange vests), Ho Chi Minh City, and Jakarta. Cheap (50-100 THB / $1.50-3 in Bangkok) but hold on tight. Not recommended with large luggage.</p>
              <p><strong>Songthaews (Thailand):</strong> Red trucks with benches in the back. Shared ride, fixed routes in Chiang Mai. 30 THB (~$1) per person. Wave them down, tell the driver your destination.</p>
              <p><strong>Cyclos (Vietnam):</strong> Pedal-powered rickshaws, mostly tourist attractions now in Hanoi and Hoi An. Negotiate price first &mdash; expect 50,000-100,000 VND ($2-4) for a 20-minute ride.</p>
            </div>
          </Card>

          {/* Ride Apps */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
                <span className="text-xl">{'\u{1F4F1}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Ride-Hailing Apps</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Grab:</strong> The Uber of Southeast Asia. Works in Thailand, Vietnam, Cambodia, Malaysia, Singapore, Philippines, Indonesia, and Myanmar. Download before you arrive. Accepts cash and cards. Also does food delivery (GrabFood). Prices are fixed &mdash; no haggling needed.</p>
              <p><strong>Gojek:</strong> Indonesia&apos;s super-app. Ride-hailing, food delivery, payments, massages, and more. Essential in Jakarta, Bali, and across Indonesia. Motorbike rides from $0.50.</p>
              <p><strong>Ola:</strong> India&apos;s largest ride-hailing app. Works in all major Indian cities. Auto-rickshaw, car, and bike options. Cheaper than international alternatives.</p>
              <p><strong>DiDi:</strong> China&apos;s dominant ride-hailing app. Has an English-language version. Essential since Uber exited China. Accepts international credit cards.</p>
              <p><strong>Tip:</strong> Get a local SIM card at the airport (usually $5-10 for a tourist SIM with data). You need mobile data for all ride-hailing apps. Airport SIM counters are the easiest option.</p>
            </div>
          </Card>
        </div>

        {/* Booking sites */}
        <Card className="mt-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Booking &amp; Comparison Sites</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: '12go.asia', desc: 'Best platform for booking trains, buses, and ferries across Southeast Asia.' },
              { name: 'Trip.com', desc: 'Essential for booking China trains, flights, and hotels. English-friendly interface.' },
              { name: 'irctc.co.in', desc: 'Official Indian Railways booking. Use Cleartrip or ixigo as easier alternatives.' },
              { name: 'japanrailpass.net', desc: 'Order your Japan Rail Pass before departure. Huge savings on Shinkansen travel.' },
              { name: 'skyscanner.com', desc: 'Best for finding cheapest flights. Search "Everywhere" for inspiration.' },
              { name: 'agoda.com', desc: 'Best hotel deals in Asia. Often cheaper than Booking.com for Asian properties.' },
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
          <SectionTitle sub="Asia's weather varies dramatically by region. Monsoons, dry seasons, and festivals shape the ideal travel windows.">
            Best Time to Visit Asia
          </SectionTitle>

          {/* Monsoon overview */}
          <Card className="mb-8">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Understanding the Asian Monsoon</h3>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
              <p>The <strong>monsoon</strong> is the single most important weather factor in Asia. It brings heavy rainfall that can flood cities, wash out roads, and close beaches &mdash; but also makes landscapes lush and green, drops prices dramatically, and means fewer tourists.</p>
              <p>The monsoon moves in two directions: the <strong>Southwest Monsoon</strong> (June-September) brings rain to India, Southeast Asia, and southern China. The <strong>Northeast Monsoon</strong> (October-February) brings rain to eastern coasts of Thailand, Vietnam, and Malaysia&apos;s east coast.</p>
              <p>Some travelers prefer monsoon season for lower prices and fewer crowds. Rain often comes in intense afternoon bursts rather than all-day drizzle. Carry a rain jacket and embrace it.</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                season: 'Southeast Asia Dry Season',
                months: 'November - March',
                emoji: '\u2600\uFE0F',
                color: '#F59E0B',
                highlights: [
                  'Best weather for Thailand, Cambodia, Laos, Vietnam (south), Myanmar',
                  'Peak tourist season - highest prices but best conditions',
                  'Temperatures: 25-33 C with low humidity',
                  'Perfect for beach holidays in Thai islands and Cambodia coast',
                  'Chinese New Year (Jan/Feb) brings crowds and higher prices in Chinese-influenced areas',
                ],
                best: 'The golden window for most of Southeast Asia.',
              },
              {
                season: 'Japan Cherry Blossom & Autumn',
                months: 'Late March - April / October - November',
                emoji: '\u{1F338}',
                color: '#EC4899',
                highlights: [
                  'Cherry blossom (sakura) season: late March to mid-April, moving north to south',
                  'Autumn foliage (koyo): late October to early December, spectacular colors',
                  'Most popular and most expensive times to visit Japan',
                  'Book hotels and JR Pass 3+ months ahead for cherry blossom season',
                  'Summer (June-August) is hot, humid, and has typhoon risk but is cheaper',
                ],
                best: 'Cherry blossom season is a once-in-a-lifetime experience. Book very early.',
              },
              {
                season: 'India Winter (Best Season)',
                months: 'October - March',
                emoji: '\u{1F3D4}\uFE0F',
                color: '#3B82F6',
                highlights: [
                  'Cool, dry weather across most of India (15-28 C in the north)',
                  'Best time for the Golden Triangle (Delhi, Agra, Jaipur)',
                  'Goa beach season peaks December-February',
                  'Festival season: Diwali (Oct/Nov), Christmas in Goa, Holi (March)',
                  'Rajasthan and Kerala are at their best. Avoid far north (Himalayas are freezing)',
                ],
                best: 'The undisputed best season for India. October-December is the sweet spot.',
              },
              {
                season: 'China Shoulder Seasons',
                months: 'April - May / September - October',
                emoji: '\u{1F341}',
                color: '#D97706',
                highlights: [
                  'Avoid Golden Week (first week of October) - 300 million Chinese tourists travel domestically',
                  'Spring (April-May): pleasant temperatures, fewer crowds than autumn',
                  'Autumn (September-October): beautiful foliage, comfortable weather nationwide',
                  'Summer (June-August): hot and humid south, pleasant in Yunnan and Tibet',
                  'Winter (December-February): cold in north, mild in south. Great Wall in snow is stunning but freezing',
                ],
                best: 'April-May and September (before Golden Week) offer the best balance.',
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

          {/* Festival timing */}
          <Card className="mt-8">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Major Festival Calendar</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Chinese New Year', when: 'Jan/Feb', where: 'China, Singapore, Malaysia, Vietnam (Tet)', note: 'Incredible celebrations but extreme crowds and prices' },
                { name: 'Holi', when: 'March', where: 'India, Nepal', note: 'Festival of colors. Joyful chaos. Wear white clothes you can throw away' },
                { name: 'Songkran', when: 'April 13-15', where: 'Thailand', note: 'Thai New Year water fight. Entire country joins in. Pack a water gun' },
                { name: 'Diwali', when: 'Oct/Nov', where: 'India, Nepal, Singapore, Malaysia', note: 'Festival of lights. Fireworks, sweets, illuminated cities' },
                { name: 'Lantern Festival', when: 'November', where: 'Chiang Mai, Thailand', note: 'Yi Peng: thousands of sky lanterns released. Magical' },
                { name: 'Cherry Blossom', when: 'Late March-April', where: 'Japan', note: 'Hanami parties under cherry trees. Book accommodation months ahead' },
              ].map((f) => (
                <div key={f.name} className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm" style={{ color: C.dark }}>{f.name}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: C.primary }}>{f.when} &mdash; {f.where}</p>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>{f.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 6. MONEY IN ASIA ════════ */}
      <section id="money" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="From ultra-cheap backpacking to luxury splurges — how money works across the continent.">
          Money in Asia
        </SectionTitle>

        {/* Cost ranking */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Cheapest to Most Expensive Countries</h3>
          <div className="space-y-3">
            {[
              { tier: 'Ultra-Budget', cost: '$15-25/day', countries: 'India, Nepal, Cambodia, Laos, Myanmar', color: '#10B981' },
              { tier: 'Budget', cost: '$25-40/day', countries: 'Vietnam, Indonesia, Philippines, Sri Lanka', color: '#22D3EE' },
              { tier: 'Mid-Range', cost: '$40-80/day', countries: 'Thailand, Malaysia, China, Turkey, Jordan', color: C.primary },
              { tier: 'Moderate', cost: '$80-150/day', countries: 'South Korea, Taiwan, Oman, Israel', color: C.secondary },
              { tier: 'Expensive', cost: '$150-250+/day', countries: 'Japan, Singapore, UAE, Maldives', color: '#EF4444' },
            ].map((t) => (
              <div key={t.tier} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: `${t.color}08`, border: `1px solid ${t.color}20` }}>
                <div className="flex items-center gap-3 sm:w-48">
                  <Badge color={t.color}>{t.tier}</Badge>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.cost}</span>
                </div>
                <p className="text-sm" style={{ color: '#475569' }}>{t.countries}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Haggling & Payment */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Haggling Culture Map</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#10B98110' }}>
                <p className="font-bold text-xs mb-1" style={{ color: '#10B981' }}>Haggling Expected</p>
                <p>India, Vietnam, Cambodia, Indonesia (markets), China (markets), Turkey (Grand Bazaar), Morocco</p>
                <p className="mt-1 text-xs">Start at 30-50% of the asking price. Walk away if the price does not come down &mdash; vendors often call you back with a lower offer.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.secondary}10` }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.secondary }}>Some Haggling OK</p>
                <p>Thailand (markets/tuk-tuks), Philippines, Nepal, Sri Lanka, Laos</p>
                <p className="mt-1 text-xs">Prices in shops are usually fixed. Markets and transport are negotiable. A gentle ask for a discount is acceptable.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.primary}10` }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>No Haggling</p>
                <p>Japan, South Korea, Singapore, UAE (malls), Malaysia (shops)</p>
                <p className="mt-1 text-xs">Prices are fixed. Attempting to haggle is considered rude. Exception: electronics markets in some areas.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Cash vs Card by Country</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: '#10B981' }}>Card-Friendly (Tap & Pay Everywhere)</p>
                <p>Japan (IC cards like Suica/Pasmo), South Korea, Singapore, UAE, Israel</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.secondary }}>Cards Accepted in Cities, Cash Elsewhere</p>
                <p>Thailand, Malaysia, Indonesia (Bali), India (UPI/cards in cities), China (WeChat/Alipay dominates &mdash; foreign cards problematic), Turkey</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: '#EF4444' }}>Cash Is King</p>
                <p>Vietnam, Cambodia (USD + Riel), Laos, Nepal, Myanmar, Philippines (outside Manila)</p>
                <p className="mt-1 text-xs">Withdraw cash from ATMs in cities. ATMs can be scarce in rural areas. Carry enough cash for 2-3 days of travel.</p>
              </div>
              <div className="p-4 rounded-xl mt-3" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>Pro Tip: Best Travel Cards</p>
                <p className="text-xs">Use a no-foreign-transaction-fee card like Wise (formerly TransferWise), Revolut, or Charles Schwab debit card. They offer near-perfect exchange rates and refund ATM fees worldwide.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Currencies */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Key Currencies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { country: 'Japan', currency: 'JPY', rate: '~150/$1' },
              { country: 'Thailand', currency: 'THB', rate: '~35/$1' },
              { country: 'India', currency: 'INR', rate: '~83/$1' },
              { country: 'Vietnam', currency: 'VND', rate: '~24,500/$1' },
              { country: 'China', currency: 'CNY', rate: '~7.2/$1' },
              { country: 'Indonesia', currency: 'IDR', rate: '~15,500/$1' },
              { country: 'Cambodia', currency: 'USD+KHR', rate: 'USD widely used' },
              { country: 'South Korea', currency: 'KRW', rate: '~1,300/$1' },
              { country: 'Malaysia', currency: 'MYR', rate: '~4.7/$1' },
              { country: 'Singapore', currency: 'SGD', rate: '~1.35/$1' },
              { country: 'Nepal', currency: 'NPR', rate: '~133/$1' },
              { country: 'UAE', currency: 'AED', rate: '~3.67/$1' },
            ].map((c) => (
              <div key={c.country} className="p-2 rounded-lg text-center" style={{ backgroundColor: C.bg }}>
                <p className="text-xs font-medium" style={{ color: C.dark }}>{c.country}</p>
                <p className="text-xs font-bold mt-1" style={{ color: C.primary }}>{c.currency}</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{c.rate}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 7. TOUR OPERATORS ════════ */}
      <section id="operators" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Reputable tour companies specializing in Asia travel for every budget and style.">
            Recommended Tour Operators
          </SectionTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourOperators.map((op) => (
              <Card key={op.name}>
                <h4 className="font-serif text-lg font-bold mb-1" style={{ color: C.dark }}>{op.name}</h4>
                <p className="text-xs font-medium mb-2" style={{ color: C.primary }}>{op.url}</p>
                <p className="text-sm mb-3" style={{ color: '#475569' }}>{op.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge color={C.primary}>{op.who}</Badge>
                  <span className="text-sm font-bold" style={{ color: C.secondary }}>{op.price}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Booking resources */}
          <Card className="mt-8">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Essential Booking Resources</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Agoda', desc: 'Best hotel deals in Asia. Often cheaper than Booking.com for Asian hotels.' },
                { name: 'Hostelworld', desc: 'Hostels and budget stays. Essential for Southeast Asia backpacking.' },
                { name: 'Klook', desc: 'Activities, day tours, transport passes, SIM cards, and attraction tickets.' },
                { name: 'GetYourGuide', desc: 'Guided tours, cooking classes, temple visits, and unique experiences.' },
                { name: 'Viator', desc: 'Large selection of tours and activities in major Asian cities.' },
                { name: 'Skyscanner', desc: 'Compare flight prices across all airlines. Use flexible dates for best deals.' },
                { name: 'Rome2Rio', desc: 'How to get from A to B anywhere in Asia. Shows all transport options.' },
                { name: '12go.asia', desc: 'Book trains, buses, and ferries across Southeast Asia. Reviews included.' },
              ].map((r) => (
                <div key={r.name} className="p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>{r.name}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 8. HEALTH & SAFETY ════════ */}
      <section id="health" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="Stay healthy and safe across Asia with these essential health precautions and safety tips.">
          Health &amp; Safety
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Vaccinations */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Recommended Vaccinations</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p>Visit a travel clinic <strong>6-8 weeks before departure</strong>. Many vaccines require multiple doses over weeks.</p>
              <div className="space-y-2 mt-3">
                {[
                  { vaccine: 'Hepatitis A', detail: 'Recommended for ALL Asian destinations. Transmitted through contaminated food/water. 2 doses for lifetime protection.' },
                  { vaccine: 'Hepatitis B', detail: 'Recommended for long stays or if you might need medical treatment. 3-dose series.' },
                  { vaccine: 'Typhoid', detail: 'Essential for India, Nepal, Bangladesh, Pakistan. Available as injection (2 years) or oral capsules (5 years).' },
                  { vaccine: 'Japanese Encephalitis', detail: 'Recommended for rural areas in Southeast Asia, India, China, Japan. 2-dose series. Spread by mosquitoes.' },
                  { vaccine: 'Rabies', detail: 'Consider for India, Southeast Asia if you plan rural travel, caving, or are around animals. Pre-exposure series is 3 doses.' },
                  { vaccine: 'Yellow Fever', detail: 'Not needed IN Asia, but some Asian countries require proof if arriving FROM a yellow fever country (Africa/South America).' },
                ].map((v) => (
                  <div key={v.vaccine} className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                    <p className="font-bold text-sm" style={{ color: C.dark }}>{v.vaccine}</p>
                    <p className="text-xs mt-1">{v.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Malaria & Mosquitoes */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Malaria &amp; Dengue Zones</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                <p className="font-bold text-sm mb-1" style={{ color: '#DC2626' }}>Malaria Risk Areas</p>
                <p>Rural areas of India (especially northeast and central), Cambodia, Laos, Myanmar, Indonesia (outside Bali/Java), and Vietnam (central highlands). Consult your doctor about antimalarial medication (Malarone, Doxycycline, or Mefloquine).</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.secondary}10` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.secondary }}>Dengue Fever Risk</p>
                <p>Present in most tropical Asian countries, including urban areas. No vaccine widely available. Prevention: use DEET-based insect repellent, wear long sleeves at dawn/dusk, sleep under mosquito nets in budget accommodation.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>No Malaria Risk</p>
                <p>Japan, South Korea, Singapore, Hong Kong, Macau, Taiwan, most Chinese cities, UAE, Israel, urban areas of Thailand (Bangkok, Chiang Mai, Phuket town), urban India (Delhi, Mumbai), and Bali.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Water & Food Safety */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Water &amp; Food Safety</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Water:</strong> Do NOT drink tap water anywhere in Asia except Japan, South Korea, and Singapore. In all other countries, drink bottled water or use a SteriPen/LifeStraw. Check that bottle seals are intact (some vendors refill bottles with tap water).</p>
              <p><strong>Ice:</strong> In tourist areas of Thailand, Vietnam, and Cambodia, ice in drinks is generally safe (made from purified water in tube or crescent shapes). Crushed or irregular ice may be suspect.</p>
              <p><strong>Street food:</strong> Paradoxically, busy street food stalls are often SAFER than empty restaurants. High turnover means fresh ingredients. Look for stalls with long queues of locals. Watch the cooking &mdash; high heat kills bacteria.</p>
              <p><strong>Delhi Belly:</strong> Stomach issues are common in India and South Asia. Carry Imodium, oral rehydration salts, and activated charcoal. Avoid raw salads, peeled fruit from vendors, and any food that has been sitting out. Eat at busy places.</p>
              <p><strong>Tip:</strong> Carry a small bottle of hand sanitizer and use it before eating. Your stomach needs 1-2 days to adjust to new bacteria &mdash; start with cooked food and gradually try street food.</p>
            </div>
          </Card>

          {/* Scams */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Common Scams by Country</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              {[
                { country: 'Thailand', scams: 'Tuk-tuk gem shop scam (driver takes you to "special sale"), jet ski damage scam (Phuket), Grand Palace "closed today" redirect, ping pong show overcharging.' },
                { country: 'India', scams: 'Taxi/auto-rickshaw meter refusal, "my uncle has a shop" tours, train station fake tourist offices, free bracelet then demand payment, chai shop credit card skimming.' },
                { country: 'Vietnam', scams: 'Motorbike grab-and-run (bag snatching), shoe shine scam, cyclo overcharging, fake Halong Bay tour operators, currency confusion (1,000 vs 100,000 VND notes look similar).' },
                { country: 'Cambodia', scams: 'Orphanage tourism (do NOT visit), tuk-tuk commission stops, fake floating village overcharges, "donations" at temples from unofficial collectors.' },
                { country: 'China', scams: 'Tea house scam (friendly students invite you, bill is $100+), art student exhibition scam, black taxi overcharging at airports, fake monks asking for donations.' },
              ].map((s) => (
                <div key={s.country} className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm" style={{ color: C.dark }}>{s.country}</p>
                  <p className="text-xs mt-1">{s.scams}</p>
                </div>
              ))}
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>Golden Rule</p>
                <p>If a stranger approaches you with an unsolicited offer (tour, shop, restaurant, taxi), politely decline. Legitimate businesses do not need to solicit tourists on the street. Use Grab/Gojek instead of street taxis.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ 9. PACKING LIST ════════ */}
      <section id="packing" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="Pack light, pack smart. Here is what you actually need for Asia travel.">
            Asia Packing Checklist
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Clothing',
                icon: '\u{1F455}',
                items: [
                  'Lightweight, quick-dry clothing (cotton is too slow to dry in humidity)',
                  'Modest wear for temples: cover shoulders and knees (sarong/scarf works for both genders)',
                  'Comfortable walking sandals (Tevas or Chacos)',
                  'Lightweight rain jacket or poncho (essential during monsoon)',
                  'Swimwear (one-piece recommended for conservative areas)',
                  'Long sleeves for mosquito protection in evenings',
                  'Warm layer for overnight trains, buses, and air-conditioned spaces (they blast AC in Southeast Asia)',
                ],
              },
              {
                category: 'Health & Hygiene',
                icon: '\u{1FA7A}',
                items: [
                  'DEET-based mosquito repellent (30-50% DEET or Picaridin)',
                  'Sunscreen SPF 50+ (expensive to buy in Asia)',
                  'Basic first aid kit: bandaids, antiseptic, painkillers',
                  'Anti-diarrheal medication (Imodium/Loperamide)',
                  'Oral rehydration salts (Pedialyte packets)',
                  'Hand sanitizer (carry at all times)',
                  'Prescription medications in original packaging with doctor note',
                  'SteriPen or LifeStraw for water purification',
                ],
              },
              {
                category: 'Tech & Documents',
                icon: '\u{1F50C}',
                items: [
                  'Universal travel adapter (Asia uses various plug types: A, B, C, G, I, O)',
                  'Portable power bank (10,000+ mAh — long bus rides drain phones)',
                  'Unlocked phone for local SIM cards',
                  'Photocopies of passport, visa, insurance (keep separate from originals)',
                  'Digital copies in email/cloud storage',
                  'VPN app (essential for China: access Google, WhatsApp, Instagram)',
                  'Offline maps downloaded (Maps.me or Google Maps offline)',
                  'Translation app (Google Translate with offline language packs)',
                ],
              },
              {
                category: 'Bags & Security',
                icon: '\u{1F392}',
                items: [
                  '40-50L backpack (max) or carry-on sized rolling bag',
                  'Daypack for daily excursions (foldable is best)',
                  'Packing cubes (game-changer for organization)',
                  'Padlock for hostel lockers',
                  'Money belt or hidden neck pouch for passport and cash',
                  'Dry bag for boat trips and monsoon rain',
                  'Ziplock bags for electronics in rain/boat trips',
                ],
              },
              {
                category: 'Temple Essentials',
                icon: '\u{26E9}\uFE0F',
                items: [
                  'Sarong or large scarf (multi-purpose: temple cover, beach towel, blanket)',
                  'Slip-on shoes (you remove shoes constantly at temples)',
                  'Socks (some temples require socks on hot stone floors)',
                  'Small bag for shoes while inside temples',
                  'No shorts, no tank tops, no revealing clothing at religious sites',
                ],
              },
              {
                category: 'Nice to Have',
                icon: '\u{2728}',
                items: [
                  'Earplugs + eye mask (essential for overnight transport and noisy hostels)',
                  'Microfiber towel (quick-dry, compact)',
                  'Reusable water bottle with filter',
                  'Headlamp or small flashlight (for temple dawn visits and power outages)',
                  'Playing cards or kindle for long journeys',
                  'Snacks from home for long bus rides',
                ],
              },
            ].map((cat) => (
              <Card key={cat.category}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-serif text-lg font-bold" style={{ color: C.dark }}>{cat.category}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: C.primary }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Final tips */}
          <Card className="mt-8">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Final Asia Travel Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Learn basic phrases', text: 'Hello, thank you, how much, and sorry in the local language goes an incredibly long way. Locals genuinely appreciate the effort.' },
                { title: 'Respect local customs', text: 'Remove shoes before entering homes and temples. Do not touch anyone\'s head (sacred in Buddhist cultures). Do not point feet at Buddha statues. Use your right hand for eating and giving in South Asia.' },
                { title: 'Slow down', text: 'Asia rewards slow travel. Instead of rushing through 5 countries in 2 weeks, spend quality time in fewer places. You will have deeper experiences and save money on transport.' },
                { title: 'Travel insurance is non-negotiable', text: 'Get comprehensive travel insurance that covers medical evacuation ($100,000+ coverage). Medical facilities vary widely. A medevac flight can cost $50,000-100,000 without insurance.' },
              ].map((tip) => (
                <div key={tip.title} className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>{tip.title}</p>
                  <p className="text-sm" style={{ color: '#475569' }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ════════ FOOTER CTA ════════ */}
      <section className="py-20 text-center" style={{ background: `linear-gradient(135deg, ${C.dark} 0%, #1E293B 100%)` }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Asia?
          </h2>
          <p className="text-lg opacity-80 text-white mb-8">
            From the neon streets of Tokyo to the backwaters of Kerala, Asia is waiting. Start planning your adventure today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/travel/europe-guide"
              className="px-6 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ backgroundColor: C.primary, color: '#fff' }}
            >
              Europe Guide
            </a>
            <a
              href="/travel/americas-guide"
              className="px-6 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ backgroundColor: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              Americas Guide
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
