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
    id: 'west-coast',
    title: 'US West Coast Road Trip',
    days: 14,
    tag: 'Most Popular',
    tagColor: C.primary,
    overview: 'The quintessential American road trip along the Pacific Coast Highway through stunning national parks, iconic cities, and desert landscapes.',
    cities: [
      { name: 'San Francisco', country: 'USA', stay: 'Days 1-2', highlights: ['Golden Gate Bridge walk', 'Alcatraz Island tour (book weeks ahead)', 'Fisherman\'s Wharf & clam chowder', 'Cable car ride', 'Chinatown (oldest in North America)', 'Mission District murals'] },
      { name: 'Big Sur', country: 'USA', stay: 'Day 3', highlights: ['Pacific Coast Highway scenic drive', 'Bixby Bridge viewpoint', 'McWay Falls', 'Julia Pfeiffer Burns State Park', 'Pfeiffer Beach purple sand'], transport: 'Drive PCH (Highway 1)', transportTime: '3h (with stops)', transportCost: '$30-40 gas' },
      { name: 'Los Angeles', country: 'USA', stay: 'Days 4-6', highlights: ['Hollywood Sign hike (Griffith Observatory trail)', 'Venice Beach boardwalk', 'Santa Monica Pier', 'Getty Center (free)', 'Universal Studios', 'Korean BBQ in Koreatown', 'Griffith Observatory sunset'], transport: 'Drive', transportTime: '5h', transportCost: '$40-50 gas' },
      { name: 'Las Vegas', country: 'USA', stay: 'Days 7-8', highlights: ['The Strip at night', 'Fremont Street Experience', 'Bellagio fountains', 'Buffet dining', 'Valley of Fire State Park day trip', 'Shows & entertainment'], transport: 'Drive through Mojave Desert', transportTime: '4h 30m', transportCost: '$35-45 gas' },
      { name: 'Grand Canyon', country: 'USA', stay: 'Day 9-10', highlights: ['South Rim sunrise', 'Bright Angel Trail hike', 'Mather Point viewpoint', 'Desert View Watchtower', 'Helicopter tour option ($200-300)'], transport: 'Drive', transportTime: '4h 30m', transportCost: '$35-45 gas + $35 park entry per vehicle' },
      { name: 'Sedona', country: 'USA', stay: 'Day 11-12', highlights: ['Cathedral Rock hike', 'Red rock jeep tour', 'Devil\'s Bridge trail', 'Vortex energy sites', 'Tlaquepaque Arts Village', 'Sunset at Airport Mesa'], transport: 'Drive', transportTime: '2h', transportCost: '$15-20 gas' },
      { name: 'Joshua Tree', country: 'USA', stay: 'Days 13-14', highlights: ['Joshua Tree National Park', 'Skull Rock', 'Keys View sunset', 'Cholla Cactus Garden', 'Stargazing (International Dark Sky Park)', 'Rock climbing'], transport: 'Drive', transportTime: '4h 30m', transportCost: '$35-45 gas + $30 park entry' },
    ],
    budget: { backpacker: '$80-120/day', midrange: '$150-250/day', comfort: '$350+/day' },
  },
  {
    id: 'east-coast',
    title: 'US East Coast',
    days: 10,
    tag: 'Cultural',
    tagColor: '#EF4444',
    overview: 'History, culture, food, and beaches from the skyscrapers of Manhattan to the art deco of Miami Beach.',
    cities: [
      { name: 'New York City', country: 'USA', stay: 'Days 1-3', highlights: ['Statue of Liberty & Ellis Island', 'Central Park', 'Times Square', 'Brooklyn Bridge walk', '9/11 Memorial', 'Metropolitan Museum of Art', 'Broadway show', 'Pizza slice in Little Italy'] },
      { name: 'Washington DC', country: 'USA', stay: 'Days 4-5', highlights: ['National Mall (Lincoln Memorial, Washington Monument)', 'Smithsonian Museums (ALL free)', 'Capitol Building tour', 'Georgetown neighborhood', 'Arlington National Cemetery', 'Library of Congress'], transport: 'Amtrak Acela or bus', transportTime: '3h Amtrak / 4h 30m bus', transportCost: '$30-80 Amtrak / $15-25 bus' },
      { name: 'Charleston', country: 'USA', stay: 'Day 6-7', highlights: ['Rainbow Row colorful houses', 'Historic district walking tour', 'Fort Sumter boat tour', 'Southern cuisine (shrimp & grits)', 'Waterfront Park pineapple fountain', 'Angel Oak Tree'], transport: 'Flight or drive', transportTime: '1h 30m flight / 8h drive', transportCost: '$60-120 flight / $60 gas' },
      { name: 'Savannah', country: 'USA', stay: 'Day 8', highlights: ['Forsyth Park fountain', '22 historic squares walk', 'River Street dining', 'Bonaventure Cemetery', 'Paula Deen\'s Lady & Sons restaurant', 'Ghost tour'], transport: 'Drive', transportTime: '2h', transportCost: '$15-20 gas' },
      { name: 'Miami', country: 'USA', stay: 'Days 9-10', highlights: ['South Beach art deco district', 'Little Havana Calle Ocho', 'Wynwood Walls street art', 'Everglades airboat tour', 'Key Biscayne beach', 'Cuban coffee at Versailles', 'Ocean Drive nightlife'], transport: 'Flight', transportTime: '2h', transportCost: '$60-120' },
    ],
    budget: { backpacker: '$80-120/day', midrange: '$150-250/day', comfort: '$350+/day' },
  },
  {
    id: 'central-america',
    title: 'Central America Adventure',
    days: 14,
    tag: 'Adventure',
    tagColor: '#10B981',
    overview: 'Ancient ruins, tropical rainforests, Caribbean coastlines, and volcanic landscapes across five countries at incredible value.',
    cities: [
      { name: 'Mexico City', country: 'Mexico', stay: 'Days 1-3', highlights: ['Teotihuacan pyramids day trip', 'Zocalo & National Palace murals', 'Chapultepec Castle & Park', 'Street tacos at every corner', 'Frida Kahlo Museum (Blue House)', 'Coyoacan neighborhood', 'Lucha libre wrestling'] },
      { name: 'Oaxaca', country: 'Mexico', stay: 'Days 4-5', highlights: ['Monte Alban ruins', 'Mezcal tasting tour', 'Oaxacan mole cooking class', 'Hierve el Agua petrified waterfalls', 'Indigenous markets', 'Street food: tlayudas & chapulines'], transport: 'Flight or overnight bus', transportTime: '1h flight / 6h bus', transportCost: '$40-80 flight / $20-30 bus' },
      { name: 'Antigua Guatemala', country: 'Guatemala', stay: 'Days 6-7', highlights: ['Volcan Acatenango overnight hike', 'Cobblestone colonial streets', 'Jade Museum', 'Coffee plantation tour', 'Lake Atitlan day trip', 'Semuc Champey natural pools'], transport: 'Flight to Guatemala City + shuttle', transportTime: '2h flight + 1h shuttle', transportCost: '$80-150 flight + $10 shuttle' },
      { name: 'Caye Caulker', country: 'Belize', stay: 'Day 8-9', highlights: ['Snorkeling the Belize Barrier Reef (2nd largest in world)', 'The Split (swimming/bar area)', '"Go Slow" island vibes', 'Blue Hole day trip (world famous dive site)', 'Lobster burritos', 'Manatee watching'], transport: 'Bus + water taxi', transportTime: '8h total', transportCost: '$30-40' },
      { name: 'Arenal & Monteverde', country: 'Costa Rica', stay: 'Days 10-11', highlights: ['Arenal Volcano hikes', 'Hot springs (Tabacon or Baldi)', 'Monteverde Cloud Forest reserve', 'Hanging bridges walk', 'Zip-lining through rainforest canopy', 'Wildlife: toucans, sloths, monkeys'], transport: 'Flight to San Jose + shuttle', transportTime: '3h flight + 3h shuttle', transportCost: '$100-180 flight + $30 shuttle' },
      { name: 'Panama City & San Blas', country: 'Panama', stay: 'Days 12-14', highlights: ['Panama Canal Miraflores Locks', 'Casco Viejo old town', 'San Blas Islands (pristine Caribbean islands)', 'Biomuseo (Frank Gehry designed)', 'Ceviche at Mercado de Mariscos', 'Panama hat shopping (yes, they are from Ecuador)'], transport: 'Flight', transportTime: '1h 30m', transportCost: '$80-150' },
    ],
    budget: { backpacker: '$30-50/day', midrange: '$60-120/day', comfort: '$180+/day' },
  },
  {
    id: 'south-america',
    title: 'South America Epic',
    days: 21,
    tag: 'Epic Journey',
    tagColor: '#8B5CF6',
    overview: 'From the Inca citadel of Machu Picchu to the thundering Iguazu Falls and the beaches of Rio &mdash; South America\'s greatest hits in three weeks.',
    cities: [
      { name: 'Lima', country: 'Peru', stay: 'Days 1-2', highlights: ['Miraflores clifftop walk', 'Ceviche at La Mar or Central', 'Barranco bohemian neighborhood', 'Huaca Pucllana ruins', 'Peruvian food tour (one of the world\'s best cuisines)'] },
      { name: 'Cusco & Machu Picchu', country: 'Peru', stay: 'Days 3-6', highlights: ['Machu Picchu (book months ahead)', 'Sacred Valley tour', 'Rainbow Mountain hike', 'San Pedro Market', 'Inca Trail (4-day trek, book 6 months ahead) or train to Aguas Calientes', 'Altitude: 3,400m - take it slow, drink coca tea'], transport: 'Flight', transportTime: '1h 20m', transportCost: '$60-120' },
      { name: 'La Paz', country: 'Bolivia', stay: 'Days 7-8', highlights: ['Witches\' Market', 'Mi Teleferico cable car system (public transport)', 'Death Road mountain biking', 'Moon Valley', 'Cholita wrestling', 'Altitude: 3,640m - acclimatize!'], transport: 'Flight or bus via Puno', transportTime: '1h flight / 10h bus', transportCost: '$80-150 flight / $15-25 bus' },
      { name: 'Uyuni Salt Flats', country: 'Bolivia', stay: 'Days 9-10', highlights: ['Salar de Uyuni perspective photos', '3-day jeep tour across salt flats', 'Isla Incahuasi (cactus island)', 'Laguna Colorada (red lake with flamingos)', 'Train cemetery', 'Star photography at night'], transport: 'Overnight bus or flight to Uyuni', transportTime: '10h bus / 45m flight', transportCost: '$10-15 bus / $60-100 flight' },
      { name: 'Buenos Aires', country: 'Argentina', stay: 'Days 11-14', highlights: ['La Boca colorful neighborhood', 'San Telmo Sunday antique market', 'Tango show in Palermo', 'Recoleta Cemetery (Evita\'s tomb)', 'World-class steak (parrilla) dinner', 'Malbec wine tasting', 'Cafe Tortoni (historic coffee house)'], transport: 'Flight via La Paz or Lima', transportTime: '3-5h', transportCost: '$100-200' },
      { name: 'Iguazu Falls', country: 'Argentina/Brazil', stay: 'Days 15-16', highlights: ['Argentine side: Devil\'s Throat walkway', 'Brazilian side: panoramic views', 'Boat ride under the falls (get soaked)', 'Tropical bird park', '275 individual falls in total', 'More impressive than Niagara Falls'], transport: 'Flight from Buenos Aires', transportTime: '1h 45m', transportCost: '$60-120' },
      { name: 'Rio de Janeiro', country: 'Brazil', stay: 'Days 17-21', highlights: ['Christ the Redeemer (Corcovado)', 'Sugarloaf Mountain cable car', 'Copacabana & Ipanema beaches', 'Santa Teresa bohemian neighborhood', 'Lapa Steps (Selaron)', 'Feijoada (traditional black bean stew)', 'Samba at Pedra do Sal', 'Sunset at Arpoador rock'], transport: 'Flight', transportTime: '2h', transportCost: '$80-150' },
    ],
    budget: { backpacker: '$30-50/day', midrange: '$60-120/day', comfort: '$180+/day' },
  },
  {
    id: 'canada',
    title: 'Canada Coast to Coast',
    days: 12,
    tag: 'Nature',
    tagColor: '#F59E0B',
    overview: 'French-speaking Quebec, multicultural Toronto, and the stunning Pacific coast &mdash; Canada offers European charm with North American scale.',
    cities: [
      { name: 'Montreal', country: 'Canada', stay: 'Days 1-2', highlights: ['Old Montreal cobblestone streets', 'Notre-Dame Basilica', 'Schwartz\'s smoked meat sandwich', 'Mont Royal park viewpoint', 'Mile End neighborhood bagels', 'Plateau-Mont-Royal street art'] },
      { name: 'Quebec City', country: 'Canada', stay: 'Days 3-4', highlights: ['Chateau Frontenac (most photographed hotel in the world)', 'Old Quebec (UNESCO)', 'Plains of Abraham', 'Petit Champlain (oldest commercial district in North America)', 'Poutine at Chez Ashton', 'Winter: Ice Hotel & Carnival'], transport: 'VIA Rail or drive', transportTime: '3h train / 2h 45m drive', transportCost: '$30-60 train / $25 gas' },
      { name: 'Toronto', country: 'Canada', stay: 'Days 5-7', highlights: ['CN Tower EdgeWalk', 'Royal Ontario Museum', 'St. Lawrence Market', 'Distillery District', 'Kensington Market', 'Toronto Islands ferry', 'Ripley\'s Aquarium', 'Drake Hotel & Queen West nightlife'], transport: 'VIA Rail or flight', transportTime: '5h train / 1h 15m flight', transportCost: '$40-100 train / $80-150 flight' },
      { name: 'Niagara Falls', country: 'Canada', stay: 'Day 8', highlights: ['Horseshoe Falls viewing platform', 'Journey Behind the Falls tunnel', 'Hornblower Niagara Cruise', 'Niagara-on-the-Lake wine country', 'Clifton Hill tourist strip'], transport: 'GO Transit bus or drive', transportTime: '2h', transportCost: '$15 bus / $15 gas' },
      { name: 'Vancouver', country: 'Canada', stay: 'Days 9-10', highlights: ['Stanley Park seawall bike ride', 'Granville Island market', 'Gastown steam clock', 'Capilano Suspension Bridge', 'Grouse Mountain (Grouse Grind hike)', 'Sushi on Robson Street (best sushi outside Japan)'], transport: 'Flight', transportTime: '4h 30m', transportCost: '$100-250' },
      { name: 'Whistler', country: 'Canada', stay: 'Days 11-12', highlights: ['Peak 2 Peak Gondola', 'Winter: world-class skiing & snowboarding', 'Summer: mountain biking, hiking, zip-lining', 'Whistler Village stroll', 'Scandinave Spa outdoor hot/cold pools', 'Bear watching tours (summer)'], transport: 'Sea-to-Sky Highway drive', transportTime: '2h (stunning coastal drive)', transportCost: '$20 gas' },
    ],
    budget: { backpacker: '$60-90/day', midrange: '$120-200/day', comfort: '$300+/day' },
  },
];

const tourOperators = [
  { name: 'Contiki', url: 'contiki.com', desc: 'Group tours for 18-35 year olds across the Americas', who: '18-35 age group', price: '$$-$$$' },
  { name: 'G Adventures', url: 'gadventures.com', desc: 'Small group adventure and cultural tours across Latin America', who: 'Adventure seekers', price: '$$' },
  { name: 'Intrepid Travel', url: 'intrepidtravel.com', desc: 'Sustainable small group tours with local leaders', who: 'Responsible travelers', price: '$$-$$$' },
  { name: 'Exodus Travels', url: 'exodus.co.uk', desc: 'Trekking and adventure holidays in South America', who: 'Active travelers', price: '$$-$$$' },
  { name: 'Road Scholar', url: 'roadscholar.org', desc: 'Educational travel programs, formerly Elderhostel', who: 'Lifelong learners 50+', price: '$$$' },
  { name: 'Abercrombie & Kent', url: 'abercrombiekent.com', desc: 'Luxury travel and private guided tours', who: 'Luxury travelers', price: '$$$$' },
];

/* ───────────────────── COMPONENT ───────────────────── */

export default function AmericasGuidePage() {
  const [activeRoute, setActiveRoute] = useState('west-coast');

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
            The Ultimate Americas<br />Travel Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-4">
            The Americas: From Arctic to Patagonia
          </p>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto mb-10">
            North, Central, South America &amp; the Caribbean &mdash; road trips, ancient ruins, tropical beaches, and wild nature across two continents.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { n: '20+', l: 'Countries' },
              { n: '35+', l: 'Cities Covered' },
              { n: '5', l: 'Curated Routes' },
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

      {/* ════════ 2. VISA OVERVIEW ════════ */}
      <section id="visa" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="The Americas range from the strict US visa process to relaxed Caribbean visa-free entry. Here is what you need to know.">
          Visa Overview
        </SectionTitle>

        {/* USA */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.primary}20` }}>
              {'\u{1F1FA}\u{1F1F8}'}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: C.dark }}>United States</h3>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#10B98110' }}>
                  <p className="font-bold mb-2" style={{ color: '#10B981' }}>ESTA (Visa Waiver Program) &mdash; 40 Countries</p>
                  <p>Citizens of UK, EU countries, Japan, Australia, South Korea, Singapore, Taiwan, and other visa waiver countries can enter the US without a visa using ESTA.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Cost:</strong> $21</li>
                    <li><strong>Validity:</strong> 2 years or until passport expires</li>
                    <li><strong>Max stay:</strong> 90 days per visit</li>
                    <li><strong>Apply at:</strong> esta.cbp.dhs.gov (ONLY official site &mdash; beware third-party scam sites charging $50-100)</li>
                    <li><strong>Processing:</strong> Usually approved within minutes to 72 hours</li>
                    <li><strong>Cannot work or study:</strong> Tourism and business meetings only</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.secondary}10` }}>
                  <p className="font-bold mb-2" style={{ color: C.secondary }}>B1/B2 Visa &mdash; India, China, Brazil, and Others</p>
                  <p>Citizens of India, China, Russia, Brazil, and most countries not on the visa waiver list need a B1/B2 tourist/business visa.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Cost:</strong> $185 application fee (non-refundable, even if denied)</li>
                    <li><strong>Process:</strong> Fill DS-160 online, pay fee, schedule interview at US embassy/consulate</li>
                    <li><strong>Interview:</strong> In person at the embassy. Dress professionally. Be clear about your travel purpose, ties to home country, and financial situation</li>
                    <li><strong>Processing:</strong> 2 weeks to 6+ months depending on country. India wait times can be 6-12 months. Apply very early</li>
                    <li><strong>Validity:</strong> 10 years for Indian and Chinese nationals (multiple entry). Duration of stay determined at entry (typically 6 months max)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="font-bold mb-2" style={{ color: '#DC2626' }}>Common B1/B2 Rejection Reasons</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Insufficient proof of ties to home country (no property, no job, no family)</li>
                    <li>Inadequate financial documentation</li>
                    <li>Unclear travel purpose or itinerary</li>
                    <li>Previous overstays or immigration violations</li>
                    <li>Young, single applicants with no travel history are flagged more often</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Canada */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.primary}20` }}>
              {'\u{1F1E8}\u{1F1E6}'}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: C.dark }}>Canada</h3>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#10B98110' }}>
                  <p className="font-bold mb-2" style={{ color: '#10B981' }}>eTA (Electronic Travel Authorization)</p>
                  <p>For visa-exempt countries including UK, EU, Australia, Japan, South Korea, and Mexico.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Cost:</strong> CAD $7 (~$5 USD)</li>
                    <li><strong>Validity:</strong> 5 years or until passport expires</li>
                    <li><strong>Max stay:</strong> 6 months per visit</li>
                    <li><strong>Apply at:</strong> canada.ca/eta</li>
                    <li><strong>Processing:</strong> Usually approved within minutes</li>
                  </ul>
                  <p className="mt-2"><strong>Note:</strong> US citizens do NOT need an eTA or visa. Just a valid passport (or enhanced driver&apos;s license at land borders).</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.secondary}10` }}>
                  <p className="font-bold mb-2" style={{ color: C.secondary }}>Visitor Visa (India, China, others)</p>
                  <p>Cost: CAD $100 (~$75 USD). Apply online through IRCC. Processing: 2-8 weeks depending on country. Biometrics required ($85). Can be valid for up to 10 years.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mexico */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: `${C.secondary}20` }}>
              {'\u{1F1F2}\u{1F1FD}'}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: C.dark }}>Mexico</h3>
              <div className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                <p><strong>Visa-free</strong> for US, UK, EU, Canada, Japan, Australia, and Indian passport holders (up to <strong>180 days</strong>). One of the most generous visa policies in the world.</p>
                <p className="mt-2">You will receive a tourist card (FMM) on arrival &mdash; keep this safe, you need it to leave. If you lose it, you will pay a fine at the airport (~$30). Some airlines include the FMM digitally now.</p>
                <p className="mt-2"><strong>Note for India:</strong> Indian nationals can enter Mexico visa-free if they hold a valid US, Canada, Japan, UK, or Schengen visa.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Central America */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>Central America</h3>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Costa Rica:</strong> Visa-free 90 days for US/UK/EU/Canada/Australia. India requires visa. Proof of onward ticket strictly enforced.</li>
                <li><strong>Panama:</strong> Visa-free 90-180 days for US/UK/EU/Canada/Australia. Tourist card ($5) at entry. India needs visa.</li>
                <li><strong>Guatemala:</strong> Visa-free 90 days for US/UK/EU/Canada. Part of the CA-4 agreement (Guatemala, Honduras, El Salvador, Nicaragua share a 90-day visa).</li>
                <li><strong>Belize:</strong> Visa-free 30 days for US/UK/EU/Canada. Can extend at immigration office. India requires visa.</li>
                <li><strong>Nicaragua:</strong> Visa-free 90 days for most Western passports. Tourist card $10 at entry.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* South America */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>South America</h3>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Brazil:</strong> E-Visa required for US citizens ($44.50, valid 2 years, 90 days per visit). Apply at vfrg.com.br. UK/EU/Australia/Japan/Canada are visa-free 90 days. India needs visa ($40, apply at embassy).</li>
                <li><strong>Argentina:</strong> Visa-free 90 days for US/UK/EU/Canada/Australia/Japan. India requires visa. US citizens previously paid a reciprocity fee &mdash; this has been eliminated.</li>
                <li><strong>Chile:</strong> Visa-free 90 days for US/UK/EU/Canada/Australia. India requires visa.</li>
                <li><strong>Peru:</strong> Visa-free 90 days for US/UK/EU/Canada/Australia/Japan. India requires visa. At immigration, request 90 days (they sometimes stamp 30 by default).</li>
                <li><strong>Colombia:</strong> Visa-free 90 days for US/UK/EU/Canada/Australia. Extendable once. India needs visa.</li>
                <li><strong>Bolivia:</strong> US citizens need a visa ($160, can get at border but slow). UK/EU/Australia visa-free 90 days. India needs visa.</li>
                <li><strong>Ecuador:</strong> Visa-free 90 days for most Western passports. India requires visa.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Caribbean */}
        <Card className="mb-8">
          <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: C.dark }}>Caribbean</h3>
          <div className="text-sm leading-relaxed" style={{ color: '#475569' }}>
            <p className="mb-3">The Caribbean is generally very welcoming to tourists. Most islands offer visa-free or visa-on-arrival entry for US, UK, EU, and Canadian passport holders.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { island: 'Jamaica', policy: 'Visa-free 90 days for US/UK/EU. India requires visa.' },
                { island: 'Dominican Republic', policy: 'Tourist card $10 at arrival for all nationalities.' },
                { island: 'Bahamas', policy: 'Visa-free 90 days for US/UK/EU/Canada.' },
                { island: 'Cuba', policy: 'Tourist card required ($50-100). US citizens can visit under specific travel categories (support for Cuban people). Direct flights available.' },
                { island: 'Barbados', policy: 'Visa-free 6 months for US/UK/EU/Canada. Digital nomad visa available (12 months).' },
                { island: 'Trinidad & Tobago', policy: 'Visa-free 90 days for US/UK/EU. India requires visa.' },
              ].map((c) => (
                <div key={c.island} className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                  <p className="font-bold text-sm" style={{ color: C.dark }}>{c.island}</p>
                  <p className="text-xs mt-1">{c.policy}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Americas Visa Pro Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'US ESTA: apply early', text: 'Even though ESTA is usually instant, apply at least 72 hours before travel. Denials happen and you need time to apply for a B1/B2 visa instead.' },
              { title: 'Proof of onward travel', text: 'Central and South American countries often require proof of departure. Airlines enforce this. Book a refundable bus/flight ticket or use onwardticket.com.' },
              { title: 'Yellow fever certificate', text: 'If arriving in certain South American countries (Brazil, Bolivia, Ecuador, Colombia) from a yellow fever zone, you may need to show your vaccination certificate.' },
              { title: 'Border crossings in Central America', text: 'Land borders can be chaotic. Have exact change in USD for visa fees. Ignore "helpers" at borders who charge commissions. Go directly to the immigration window.' },
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
          <SectionTitle sub="Five expertly crafted itineraries spanning the entire Western Hemisphere for every travel style.">
            Americas Tour Packages &amp; Suggested Routes
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
        <SectionTitle sub="From coast-to-coast road trips to chicken buses in Guatemala — how to navigate the Americas.">
          Getting Around the Americas
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Domestic Flights */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                <span className="text-xl">&#9992;</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>US &amp; Canada Domestic Flights</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['Southwest', 'JetBlue', 'Spirit', 'Frontier', 'WestJet', 'Flair'].map((a) => (
                  <div key={a} className="px-3 py-2 rounded-lg text-center font-medium text-xs" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>{a}</div>
                ))}
              </div>
              <p><strong>Southwest Airlines:</strong> No change fees, 2 free checked bags. Best for domestic US. Book at southwest.com (not on Google Flights).</p>
              <p><strong>JetBlue:</strong> Excellent legroom, free Wi-Fi, snacks included. Good East Coast coverage plus Caribbean routes.</p>
              <p><strong>Spirit &amp; Frontier:</strong> Ultra-low base fares from $20-50 but charge for everything (carry-on bags, water, seat selection). Total cost often matches other airlines. Fine for short flights with no luggage.</p>
              <p><strong>Booking tip:</strong> Use Google Flights for price comparison. Book 1-3 months ahead for domestic. Tuesday/Wednesday flights are cheapest. Clear your browser cookies before booking.</p>
            </div>
          </Card>

          {/* Car Rentals */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}15` }}>
                <span className="text-xl">{'\u{1F697}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Car Rentals (Essential in USA)</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>The USA is built for driving.</strong> Outside major cities (NYC, Chicago, SF, Boston), a car is practically essential. Public transport is limited or nonexistent in most American cities and suburbs.</p>
              <p><strong>Rental companies:</strong> Enterprise, Hertz, Avis, Budget, National, Sixt. Also check <strong>Turo</strong> (peer-to-peer car rental, like Airbnb for cars).</p>
              <p><strong>Costs:</strong> $30-60/day for economy car. Gas: $3.50-5.00/gallon. Tolls vary by state (E-ZPass electronic toll pass saves money in the Northeast).</p>
              <p><strong>International license:</strong> Most US rental companies accept foreign licenses with an International Driving Permit (IDP). Get the IDP in your home country before traveling ($15-20).</p>
              <p><strong>Insurance:</strong> Your credit card may cover rental car insurance (check before declining the rental company&apos;s CDW/LDW). Otherwise, add $15-25/day for insurance.</p>
              <p><strong>Age surcharge:</strong> Drivers under 25 pay an extra $15-30/day. Some companies require minimum age 21.</p>
            </div>
          </Card>

          {/* Amtrak & Buses */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#10B98115' }}>
                <span className="text-xl">{'\u{1F684}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>Amtrak &amp; Greyhound</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Amtrak trains:</strong> Covers the US but is slower and often more expensive than flying. The Northeast Corridor (Boston-NYC-DC) is the exception &mdash; fast, frequent, and useful. Acela express: NYC to DC in 2h 50m ($50-150).</p>
              <p><strong>Scenic routes worth the ride:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>California Zephyr: Chicago to San Francisco (51h, stunning Rocky Mountain scenery)</li>
                <li>Coast Starlight: Seattle to LA (35h, Pacific coastline)</li>
                <li>Empire Builder: Chicago to Seattle/Portland (46h, Great Plains and Glacier National Park)</li>
              </ul>
              <p><strong>USA Rail Pass:</strong> 10 rides in 30 days ($499). Good value if you do multiple long-distance segments.</p>
              <p><strong>Greyhound &amp; FlixBus:</strong> Budget bus travel. Greyhound: $10-50 for most US routes. FlixBus expanding across the US with $5+ fares. Megabus: $1-20 fares on popular routes (NYC to DC, etc.).</p>
            </div>
          </Card>

          {/* South America Transport */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
                <span className="text-xl">{'\u{1F68C}'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold" style={{ color: C.dark }}>South &amp; Central America Transport</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <p><strong>Long-distance buses:</strong> The backbone of South American travel. Companies like <strong>Cruz del Sur</strong> (Peru), <strong>Pullman</strong> (Chile), and <strong>Pluma</strong> (Brazil) offer luxury overnight buses with fully reclining seats (cama or leito class), meals, and entertainment. Often cheaper and more comfortable than flying.</p>
              <p><strong>Budget airlines:</strong> LATAM, Avianca, Gol (Brazil), SKY (Chile), Viva Air (Colombia). Book early for $30-80 domestic flights. JetSmart expanding across South America with ultra-low fares.</p>
              <p><strong>Chicken buses (Central America):</strong> Retired US school buses repainted in wild colors. Cheap ($1-3 per ride), slow, crowded, and an authentic cultural experience. Watch your belongings.</p>
              <p><strong>Colectivos (shared taxis):</strong> Common in Peru, Bolivia, and Central America. Shared minivans that leave when full. Cheaper than buses, faster, less comfortable.</p>
              <p><strong>Uber &amp; ride apps:</strong> Uber works in most major Latin American cities (Mexico City, Lima, Bogota, Buenos Aires, Sao Paulo, Rio). Safer than street taxis. DiDi is growing across Latin America.</p>
            </div>
          </Card>
        </div>

        {/* Booking sites */}
        <Card className="mt-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Booking &amp; Comparison Sites</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Google Flights', desc: 'Best overall flight search. Use "Explore" map to find cheapest destinations from your city.' },
              { name: 'rome2rio.com', desc: 'How to get from A to B anywhere in the Americas. Shows flights, buses, trains, ferries.' },
              { name: 'busbud.com', desc: 'Book long-distance buses across North and South America. Greyhound, Cruz del Sur, etc.' },
              { name: 'amtrak.com', desc: 'US train bookings. Check for flash sales and USA Rail Pass deals.' },
              { name: 'rentalcars.com', desc: 'Compare car rental prices across all major companies. Best price guarantee.' },
              { name: 'hostelworld.com', desc: 'Budget accommodation across the Americas. Essential for backpacking Latin America.' },
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
          <SectionTitle sub="The Americas span from the Arctic to Antarctica. Weather varies dramatically — here is when to go where.">
            Best Time to Visit the Americas
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                season: 'US & Canada Summer',
                months: 'June - September',
                emoji: '\u2600\uFE0F',
                color: '#F59E0B',
                highlights: [
                  'Best weather across the US and Canada (warm, long days)',
                  'National parks are fully open (some roads close in winter)',
                  'Peak season: highest prices for hotels and flights',
                  'July 4th celebrations, music festivals, state fairs',
                  'Canada Day (July 1) festivities across Canada',
                  'Alaska midnight sun in June/July',
                ],
                best: 'Best for road trips, national parks, and outdoor activities.',
              },
              {
                season: 'US & Canada Fall',
                months: 'September - November',
                emoji: '\u{1F341}',
                color: '#D97706',
                highlights: [
                  'Stunning fall foliage in New England, Appalachia, and eastern Canada',
                  'Peak foliage: late September (Vermont/New Hampshire) to late October (Virginia)',
                  'Comfortable temperatures nationwide',
                  'Lower prices after Labor Day (first Monday of September)',
                  'Wine harvest season in Napa Valley, Willamette Valley, Niagara',
                  'Halloween and Thanksgiving (uniquely American experiences)',
                ],
                best: 'Sweet spot: beautiful weather, lower prices, stunning colors.',
              },
              {
                season: 'Caribbean & Mexico Winter',
                months: 'December - April',
                emoji: '\u{1F3D6}\uFE0F',
                color: '#3B82F6',
                highlights: [
                  'Dry season in the Caribbean and Mexico (perfect beach weather)',
                  'Peak tourist season: Christmas through Easter',
                  'Whale watching in Baja California (January-March)',
                  'Carnival in Rio (February/March) and Trinidad (February)',
                  'Spring break in Cancun and Cabo (March)',
                  'Hurricane season is OVER (ended November)',
                ],
                best: 'Escape winter at home with guaranteed sunshine and warmth.',
              },
              {
                season: 'South America Dry Season',
                months: 'May - September',
                emoji: '\u{1F3D4}\uFE0F',
                color: '#10B981',
                highlights: [
                  'Best time for Peru (Machu Picchu), Bolivia (Uyuni Salt Flats), and Patagonia',
                  'Inca Trail to Machu Picchu is driest June-August (closed February for maintenance)',
                  'Uyuni Salt Flats are dry and cracked (best for mirror effect: Jan-March wet season)',
                  'Patagonia trekking season: November-March (Southern Hemisphere summer)',
                  'Rio and Buenos Aires: mild winter (June-August), fewer tourists, lower prices',
                  'Amazon: May-September is drier but still humid; good for wildlife spotting',
                ],
                best: 'June-August is ideal for Peru and Bolivia. Patagonia peaks November-March.',
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

          {/* Hurricane & Ski seasons */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: '#DC2626' }}>Hurricane Season Warning</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <p><strong>When:</strong> June 1 to November 30. Peak: August to October.</p>
                <p><strong>Where:</strong> Caribbean islands, Gulf Coast (Florida, Texas, Louisiana), Mexico&apos;s Caribbean coast (Cancun, Riviera Maya), Central America&apos;s Caribbean coast.</p>
                <p><strong>Should you avoid it?</strong> Not necessarily. Hurricane season means lower prices (30-50% off) and fewer tourists. Most days are sunny. Storms typically give 3-5 days warning. Get travel insurance with hurricane coverage.</p>
                <p><strong>Pacific hurricanes:</strong> Affect Mexico&apos;s Pacific coast (June-November) but are less common and usually less intense.</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.primary }}>Ski Season</h3>
              <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                <p><strong>Western US:</strong> December to April. Top resorts: Park City (Utah), Vail/Aspen (Colorado), Jackson Hole (Wyoming), Mammoth (California), Big Sky (Montana).</p>
                <p><strong>Eastern US:</strong> December to March. Killington (Vermont), Stowe (Vermont), Sunday River (Maine). Shorter season, lower prices.</p>
                <p><strong>Canada:</strong> November to May. Whistler Blackcomb (BC), Lake Louise/Banff (Alberta), Tremblant (Quebec). Some of the longest seasons in North America.</p>
                <p><strong>South America:</strong> June to September. Portillo and Valle Nevado (Chile), Las Lenas and Cerro Catedral (Argentina). Ski during Northern Hemisphere summer!</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ════════ 6. MONEY IN THE AMERICAS ════════ */}
      <section id="money" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle sub="From the almighty US dollar to the volatile Argentine peso — a complete money guide for the Americas.">
          Money in the Americas
        </SectionTitle>

        {/* USD Dominance */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>The US Dollar&apos;s Dominance</h3>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#475569' }}>
            <p>The <strong>US dollar (USD)</strong> is not just the currency of the United States &mdash; it is accepted or used as the primary currency in several other countries:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Ecuador (official currency)', 'Panama (alongside Balboa)', 'El Salvador', 'Puerto Rico (US territory)', 'US Virgin Islands', 'Cambodia-like acceptance in Belize'].map((c) => (
                <span key={c} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${C.primary}10`, color: C.primary }}>{c}</span>
              ))}
            </div>
            <p className="mt-3">Even where USD is not official, US dollars are widely accepted in tourist areas across Mexico, Central America, and the Caribbean. However, you will get better exchange rates using local currency.</p>
          </div>
        </Card>

        {/* Tipping */}
        <Card className="mb-8">
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Tipping Culture (Very Important!)</h3>
          <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
              <p className="font-bold mb-2" style={{ color: '#DC2626' }}>USA: 18-20% is MANDATORY (not optional)</p>
              <p>In the US, servers earn $2-5/hour in base wages. Tips make up the majority of their income. Not tipping is considered extremely rude and harmful.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Restaurants:</strong> 18-20% of pre-tax bill. 15% for mediocre service. 25% for exceptional service.</li>
                <li><strong>Bars:</strong> $1-2 per drink or 15-20% of tab</li>
                <li><strong>Taxis/Uber:</strong> 15-20%</li>
                <li><strong>Hotels:</strong> $2-5/night for housekeeping, $1-2 per bag for bellhop</li>
                <li><strong>Coffee shops:</strong> $1 or round up (not mandatory but appreciated)</li>
                <li><strong>Hair/beauty:</strong> 18-25%</li>
              </ul>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>Canada: 15-20%</p>
                <p className="text-xs">Same tipping culture as the US. 15% is acceptable, 18-20% is standard in cities.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>Mexico: 10-15%</p>
                <p className="text-xs">Tip 10-15% at restaurants. Propina is appreciated. Some tourist restaurants add it automatically (check bill).</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>Latin America: 10%</p>
                <p className="text-xs">10% is standard in Peru, Colombia, Argentina, Brazil. Some restaurants include &quot;servicio&quot; on the bill. Check before adding more.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>Caribbean: 15-18%</p>
                <p className="text-xs">Many resorts include gratuity. Check your bill. At local restaurants, 10-15% is appreciated.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cost comparison & bargaining */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Daily Budget by Region</h3>
            <div className="space-y-3">
              {[
                { region: 'USA & Canada', budget: '$80-250+/day', color: '#EF4444', detail: 'Expensive. Hotels from $100+, meals $15-30, transport adds up.' },
                { region: 'Mexico', budget: '$30-80/day', color: C.secondary, detail: 'Great value. Street food $1-3, nice hotels $30-60, transport cheap.' },
                { region: 'Central America', budget: '$25-60/day', color: '#10B981', detail: 'Budget paradise. Dorms $8-15, meals $3-8, chicken bus $1-3.' },
                { region: 'South America', budget: '$25-80/day', color: C.primary, detail: 'Varies widely. Bolivia ultra-cheap ($15/day). Brazil/Chile/Argentina more expensive.' },
                { region: 'Caribbean', budget: '$60-200+/day', color: '#8B5CF6', detail: 'Island premiums apply. Everything is imported. All-inclusives offer value.' },
              ].map((r) => (
                <div key={r.region} className="p-3 rounded-xl" style={{ backgroundColor: `${r.color}08`, border: `1px solid ${r.color}20` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm" style={{ color: C.dark }}>{r.region}</span>
                    <Badge color={r.color}>{r.budget}</Badge>
                  </div>
                  <p className="text-xs" style={{ color: '#64748B' }}>{r.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Bargaining &amp; Exchange Tips</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.primary }}>USA &amp; Canada: Fixed Prices Everywhere</p>
                <p className="text-xs">No bargaining. Prices are what they say. Only exception: flea markets, Craigslist/Facebook Marketplace, and car dealerships.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.secondary}10` }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.secondary }}>Latin America: Markets Are Negotiable</p>
                <p className="text-xs">Street markets, souvenirs, and taxis are negotiable. Start at 60-70% of the asking price. Shops, restaurants, and malls are fixed price.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.dark }}>Argentina Blue Dollar</p>
                <p className="text-xs">Argentina often has a parallel &quot;blue dollar&quot; exchange rate significantly better than the official rate. Use Western Union or exchange at &quot;cuevas&quot; (informal exchange houses) for rates 30-50% better than banks and ATMs. This is widely practiced and openly discussed.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-xs mb-1" style={{ color: C.dark }}>Best Travel Cards</p>
                <p className="text-xs">Wise, Revolut, or Charles Schwab debit card for ATM withdrawals without fees. In the US, credit cards are preferred everywhere &mdash; Visa and Mastercard have near-universal acceptance. Amex is accepted at most places but not everywhere.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Currencies */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Key Currencies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { country: 'USA', currency: 'USD', rate: 'Base currency' },
              { country: 'Canada', currency: 'CAD', rate: '~1.37/$1 USD' },
              { country: 'Mexico', currency: 'MXN', rate: '~17/$1 USD' },
              { country: 'Brazil', currency: 'BRL', rate: '~5/$1 USD' },
              { country: 'Argentina', currency: 'ARS', rate: 'Volatile (check blue rate)' },
              { country: 'Colombia', currency: 'COP', rate: '~4,000/$1 USD' },
              { country: 'Peru', currency: 'PEN', rate: '~3.7/$1 USD' },
              { country: 'Chile', currency: 'CLP', rate: '~900/$1 USD' },
              { country: 'Costa Rica', currency: 'CRC', rate: '~520/$1 USD' },
              { country: 'Guatemala', currency: 'GTQ', rate: '~7.8/$1 USD' },
              { country: 'Bolivia', currency: 'BOB', rate: '~6.9/$1 USD' },
              { country: 'Jamaica', currency: 'JMD', rate: '~155/$1 USD' },
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
          <SectionTitle sub="Reputable tour companies specializing in Americas travel for every budget and style.">
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
                { name: 'Booking.com', desc: 'Hotels and accommodations across the Americas.' },
                { name: 'Hostelworld', desc: 'Essential for backpacking Latin America. Dorms from $5/night.' },
                { name: 'Airbnb', desc: 'Best for USA road trips, group travel, and longer stays.' },
                { name: 'GetYourGuide', desc: 'Activities, day tours, and experiences.' },
                { name: 'Viator', desc: 'Large selection of tours across the Americas.' },
                { name: 'AllTrails', desc: 'Hiking trail maps and reviews. Essential for national parks.' },
                { name: 'Recreation.gov', desc: 'Book US national park campsites and permits (book months ahead).' },
                { name: 'iOverlander', desc: 'Community-sourced camping and accommodation spots for overland travelers.' },
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
        <SectionTitle sub="Safety levels vary dramatically across the Americas. Here is what you need to know.">
          Health &amp; Safety
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Safety Overview */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Safety Overview by Region</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#10B98110' }}>
                <p className="font-bold text-sm mb-1" style={{ color: '#10B981' }}>Very Safe</p>
                <p><strong>USA &amp; Canada:</strong> Generally very safe for tourists. Standard precautions in big cities (avoid walking alone at night in unfamiliar areas, watch for pickpockets in tourist zones). Emergency: 911.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.secondary}10` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.secondary }}>Mostly Safe (with precautions)</p>
                <p><strong>Mexico:</strong> Tourist areas (Cancun, Cabo, Mexico City, Oaxaca, San Miguel de Allende) are safe. Avoid certain northern border areas and some Pacific coast regions. Travel during daylight between cities.</p>
                <p className="mt-1"><strong>Colombia:</strong> Major cities (Bogota, Medellin, Cartagena) are safe for tourists. The country has transformed dramatically. Use common sense.</p>
                <p className="mt-1"><strong>Costa Rica &amp; Panama:</strong> Among the safest in Central America. Standard precautions apply.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>Exercise Caution</p>
                <p><strong>Peru &amp; Bolivia:</strong> Tourist areas safe. Watch for petty theft in Lima and La Paz. Fake taxis are a concern &mdash; use apps.</p>
                <p className="mt-1"><strong>Brazil:</strong> Major tourist areas are generally safe with precautions. Avoid favelas, deserted beaches at night, and displaying expensive items. Use Uber everywhere.</p>
                <p className="mt-1"><strong>Guatemala, Honduras, El Salvador:</strong> Tourist routes are manageable. Avoid traveling at night. Use organized transport. Guatemala&apos;s Lake Atitlan and Antigua are safe and popular.</p>
              </div>
            </div>
          </Card>

          {/* Health */}
          <Card>
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Health Concerns</h3>
            <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                <p className="font-bold text-sm mb-1" style={{ color: '#DC2626' }}>Yellow Fever Zones</p>
                <p>Vaccination recommended or required for parts of <strong>Brazil</strong> (Amazon, rural areas outside Rio/Sao Paulo), <strong>Bolivia</strong> (lowlands), <strong>Colombia</strong> (Amazon/rural), <strong>Ecuador</strong> (Amazon/lowlands), and <strong>Peru</strong> (Amazon). Get vaccinated at least 10 days before travel. The certificate is valid for life.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.secondary}10` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.secondary }}>Altitude Sickness</p>
                <p>A serious concern in <strong>Cusco</strong> (3,400m), <strong>La Paz</strong> (3,640m), <strong>Quito</strong> (2,850m), and <strong>Bogota</strong> (2,640m). Symptoms: headache, nausea, shortness of breath. Prevention: acclimatize for 1-2 days before exertion, drink coca tea, stay hydrated, avoid alcohol on arrival. Carry Diamox (acetazolamide) &mdash; get a prescription from your doctor.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>Other Considerations</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>US healthcare:</strong> Extremely expensive without insurance. A simple ER visit can cost $2,000-5,000. Travel insurance is essential.</li>
                  <li><strong>Dengue &amp; Zika:</strong> Present in tropical Central/South America and Caribbean. Use mosquito repellent.</li>
                  <li><strong>Water safety:</strong> Tap water is safe in USA, Canada, Chile, and most Caribbean resorts. Avoid tap water in Mexico, Central America, Bolivia, Peru, and rural areas.</li>
                  <li><strong>Traveler&apos;s diarrhea:</strong> Common in Mexico and Central/South America. Carry Imodium, rehydration salts, and antibiotics (ciprofloxacin &mdash; get a prescription).</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Safety tips */}
        <Card>
          <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Universal Safety Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Use ride-hailing apps', text: 'Uber, Lyft (US/Canada), DiDi, or local apps are always safer than hailing random taxis. You have a digital record of the trip and driver.' },
              { title: 'Avoid flashy displays', text: 'Do not walk around with expensive cameras dangling, phones out in hand, or wearing expensive jewelry in Latin America. Be discreet.' },
              { title: 'Photocopy documents', text: 'Keep photocopies of your passport, visa, and insurance in a separate bag from the originals. Store digital copies in cloud storage.' },
              { title: 'Register with your embassy', text: 'Register your trip with your country\'s embassy/consulate (US: STEP program, UK: FCDO). They can assist in emergencies.' },
              { title: 'Travel insurance', text: 'Non-negotiable for the Americas. US healthcare costs alone justify insurance. Ensure coverage for adventure activities (hiking, diving) if applicable.' },
              { title: 'Stay connected', text: 'Get a local SIM card or international eSIM (Airalo is excellent). Share your itinerary with someone at home. Check in regularly.' },
            ].map((tip) => (
              <div key={tip.title} className="p-4 rounded-xl" style={{ backgroundColor: C.bg }}>
                <p className="font-bold text-sm mb-1" style={{ color: C.primary }}>{tip.title}</p>
                <p className="text-sm" style={{ color: '#475569' }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ════════ 9. PACKING LIST ════════ */}
      <section id="packing" className="py-16" style={{ backgroundColor: `${C.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle sub="The Americas span every climate from Arctic tundra to tropical beach. Here is how to pack smart.">
            Americas Packing Checklist
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Clothing (USA)',
                icon: '\u{1F455}',
                items: [
                  'Layers, layers, layers (US weather varies dramatically even within a single day)',
                  'Comfortable walking shoes (cities involve miles of walking)',
                  'Light jacket or hoodie (AC is extreme everywhere in the US)',
                  'Swimwear for hotel pools, beaches, or lake stops',
                  'One nice outfit for upscale restaurants (smart casual minimum)',
                  'Activewear if planning national park hikes',
                  'Winter: heavy coat, scarf, gloves for Northeast/Midwest (December-March)',
                ],
              },
              {
                category: 'Clothing (Latin America)',
                icon: '\u{1F3D6}\uFE0F',
                items: [
                  'Lightweight, breathable clothing for tropical heat',
                  'Rain jacket or poncho (afternoon showers are common)',
                  'Warm layers for altitude (Cusco, La Paz, Bogota can be cold)',
                  'Hiking boots for Machu Picchu, Patagonia, and volcano treks',
                  'Modest clothing for churches in Mexico and Central America',
                  'Quick-dry swimwear for Caribbean and beach stops',
                  'Flip-flops for hostels and beach towns',
                ],
              },
              {
                category: 'Sun Protection',
                icon: '\u2600\uFE0F',
                items: [
                  'Sunscreen SPF 50+ (essential at altitude and beaches)',
                  'Reef-safe sunscreen for Caribbean and cenote swimming',
                  'Wide-brim hat or baseball cap',
                  'Polarized sunglasses',
                  'Aloe vera gel for inevitable sunburn',
                  'Lip balm with SPF',
                  'UPF clothing for extended outdoor activities',
                ],
              },
              {
                category: 'Tech & Documents',
                icon: '\u{1F50C}',
                items: [
                  'US/Canada plug adapter (Type A/B) &mdash; same as Japan and most of Latin America',
                  'Portable power bank (10,000+ mAh)',
                  'International driving permit (IDP) for car rentals',
                  'Photocopies of passport, visa, insurance',
                  'Download offline maps (Google Maps or Maps.me)',
                  'eSIM or SIM card plan (T-Mobile has free international roaming for US customers)',
                  'Noise-canceling headphones for long flights and buses',
                ],
              },
              {
                category: 'Health & Safety',
                icon: '\u{1FA7A}',
                items: [
                  'Travel insurance documents (print and digital)',
                  'Prescription medications in original packaging',
                  'Anti-diarrheal medication (Imodium)',
                  'Oral rehydration salts',
                  'DEET mosquito repellent (for tropical regions)',
                  'Band-aids, antiseptic, painkillers',
                  'Altitude medication (Diamox) if visiting Cusco/La Paz',
                  'Hand sanitizer',
                ],
              },
              {
                category: 'Nice to Have',
                icon: '\u{2728}',
                items: [
                  'Reusable water bottle (US has water fountains everywhere)',
                  'Packing cubes for organization',
                  'Dry bag for boat trips and water activities',
                  'Headlamp for camping and early-morning hikes',
                  'Playing cards and travel games for long bus rides',
                  'Spanish phrasebook or offline translator (essential outside tourist zones)',
                  'Earplugs + eye mask for hostels and overnight buses',
                  'Snack supply for long road trips (US has great gas station snacks)',
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
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: C.dark }}>Final Americas Travel Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Learn basic Spanish', text: 'Outside of Brazil (Portuguese) and the US/Canada, Spanish is spoken across Latin America. Even basic Spanish (hola, gracias, cuanto cuesta, donde esta) transforms your experience.' },
                { title: 'Embrace the diversity', text: 'The Americas encompass wildly different cultures, cuisines, and landscapes. Do not compare countries to each other. Each place has its own rhythm.' },
                { title: 'Book US accommodations early', text: 'US hotels are expensive and sell out during peak season, holidays, and events. Book 2-3 months ahead for summer road trips and popular national parks. Camping is a great budget alternative.' },
                { title: 'Take your time in South America', text: 'Distances are enormous. Do not try to see everything in one trip. Focus on one region (Andean: Peru/Bolivia, Southern Cone: Argentina/Chile, or Northern: Colombia/Ecuador) rather than rushing across the continent.' },
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
            Ready to Explore the Americas?
          </h2>
          <p className="text-lg opacity-80 text-white mb-8">
            From the Grand Canyon to Machu Picchu, from the glaciers of Patagonia to the beaches of the Caribbean &mdash; your adventure starts now.
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
              href="/travel/asia-guide"
              className="px-6 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ backgroundColor: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              Asia Guide
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
