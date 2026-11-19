'use client';

import { useState, useMemo } from 'react';
import { COUNTRIES } from '@/data/travel/destinations';
import type { City } from '@/data/travel/destinations';

/* ───────── types ───────── */
type TravelStyle = 'backpacker' | 'midRange' | 'comfort' | 'luxury';

interface CityMeta extends City {
  countryName: string;
  countryFlag: string;
  currencySymbol: string;
  currencyCode: string;
}

/* ───────── data helpers ───────── */
function getAllCities(): CityMeta[] {
  const list: CityMeta[] = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        list.push({
          ...city,
          countryName: country.name,
          countryFlag: country.flag,
          currencySymbol: country.currency.symbol,
          currencyCode: country.currency.code,
        });
      }
    }
  }
  return list;
}

const ALL_CITIES = getAllCities();

const STYLE_LABELS: Record<TravelStyle, string> = {
  backpacker: 'Backpacker',
  midRange: 'Mid-Range',
  comfort: 'Comfort',
  luxury: 'Luxury',
};

const STYLE_EMOJIS: Record<TravelStyle, string> = {
  backpacker: '🎒',
  midRange: '🧳',
  comfort: '🛋️',
  luxury: '👑',
};

/* parse budget strings like "¥6,000–8,000 ($40–55)" to get a midpoint numeric */
function parseBudgetMid(raw: string): number {
  const nums = raw.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const parsed = nums.map((n) => parseInt(n.replace(/,/g, ''), 10));
  if (parsed.length >= 2) return Math.round((parsed[0] + parsed[1]) / 2);
  return parsed[0];
}

/* extract the USD portion if present, else use local */
function parseBudgetUSD(raw: string): number {
  const usdMatch = raw.match(/\$[\d,]+/g);
  if (usdMatch && usdMatch.length >= 1) {
    const nums = usdMatch.map((s) => parseInt(s.replace(/[$,]/g, ''), 10));
    if (nums.length >= 2) return Math.round((nums[0] + nums[1]) / 2);
    return nums[0];
  }
  return parseBudgetMid(raw);
}

function getStayPrice(city: City, style: TravelStyle): string {
  const tierMap: Record<TravelStyle, string> = {
    backpacker: 'Budget',
    midRange: 'Mid-Range',
    comfort: 'Comfort',
    luxury: 'Luxury',
  };
  const stay = city.stays.find((s) => s.tier.toLowerCase().includes(tierMap[style].toLowerCase()));
  return stay ? stay.priceRange : city.stays[0]?.priceRange || 'N/A';
}

function getTransportCost(city: City): string {
  const bus = city.transport.find((t) => t.type.toLowerCase().includes('day') || t.type.toLowerCase().includes('pass'));
  if (bus) return bus.cost;
  return city.transport[0]?.cost || 'N/A';
}

function sumAttractionFees(city: City): { total: string; count: number } {
  let sum = 0;
  let symbol = '';
  let count = 0;
  const top = city.attractions.filter((a) => a.cityRank && a.cityRank <= 10);
  for (const a of top) {
    if (a.entryFee.toLowerCase() === 'free') continue;
    const match = a.entryFee.match(/([$€¥฿₹])[\s]*([\d,]+)/);
    if (match) {
      if (!symbol) symbol = match[1];
      sum += parseInt(match[2].replace(',', ''), 10);
      count++;
    }
  }
  return { total: sum > 0 ? `${symbol}${sum.toLocaleString()}` : 'Mostly free', count };
}

/* ── "your $X gets you" data ── */
const VALUE_EXAMPLES: Record<string, { budget: string; items: string[] }[]> = {
  'tokyo-city': [
    { budget: '$50/day', items: ['Budget capsule hotel', '2 ramen meals + convenience store dinner', 'JR day pass', '2 free temple visits'] },
    { budget: '$150/day', items: ['Business hotel in Shinjuku', '3 sit-down meals including sushi', 'Suica card all-day transit', 'Teamlab + Skytree tickets'] },
  ],
  'bangkok-city': [
    { budget: '$25/day', items: ['Guesthouse on Khao San Rd', '5 street food meals', 'BTS/MRT day pass', '3 temple visits'] },
    { budget: '$100/day', items: ['Boutique hotel on Sukhumvit', '3 restaurant meals + rooftop drink', 'Private tuk-tuk', 'Grand Palace + 4 temples'] },
  ],
  paris: [
    { budget: '$70/day', items: ['Hostel in Montmartre', '2 bakery breakfasts + 2 cafe lunches', 'Metro day pass', '1 museum (free first Sundays)'] },
    { budget: '$250/day', items: ['Hotel near Marais', '3 bistro meals + wine', 'Unlimited metro', 'Louvre + Orsay + Eiffel Tower'] },
  ],
  rome: [
    { budget: '$55/day', items: ['Hostel near Termini', '2 pizza al taglio + trattoria dinner', 'Roma Pass transit', 'Pantheon (free) + Colosseum'] },
    { budget: '$180/day', items: ['Hotel near Piazza Navona', '3 restaurant meals + gelato', 'Taxi + walking', 'Vatican + Colosseum + Borghese'] },
  ],
  'delhi-city': [
    { budget: '$18/day', items: ['Budget guesthouse in Paharganj', '3 street food meals', 'Metro day pass', '4 monument visits'] },
    { budget: '$80/day', items: ['Heritage hotel in Old Delhi', '3 restaurant meals', 'Private car + driver', 'Red Fort + Qutub Minar + Humayun\'s Tomb'] },
  ],
};

/* ───────── component ───────── */
export default function TravelCostPage() {
  const [cityId, setCityId] = useState('');
  const [style, setStyle] = useState<TravelStyle>('midRange');
  const [days, setDays] = useState(5);

  const city = useMemo(() => ALL_CITIES.find((c) => c.id === cityId) || null, [cityId]);

  /* ── cost breakdown ── */
  const breakdown = useMemo(() => {
    if (!city) return null;

    const budgetKey = style === 'luxury' ? 'comfort' : style;
    const dailyBudgetUSD = parseBudgetUSD(city.avgBudgetPerDay[budgetKey]);
    const luxuryMultiplier = style === 'luxury' ? 1.8 : 1;
    const adjustedDaily = Math.round(dailyBudgetUSD * luxuryMultiplier);

    const accomPct = 0.35;
    const foodPct = 0.30;
    const transportPct = 0.10;
    const attractionPct = 0.15;
    const miscPct = 0.10;

    const totalBudget = adjustedDaily * days;
    const accom = Math.round(totalBudget * accomPct);
    const food = Math.round(totalBudget * foodPct);
    const transport = Math.round(totalBudget * transportPct);
    const attractions = Math.round(totalBudget * attractionPct);
    const misc = Math.round(totalBudget * miscPct);

    return {
      dailyBudget: adjustedDaily,
      total: totalBudget,
      accom,
      food,
      transport,
      attractions,
      misc,
      stayExample: getStayPrice(city, style),
      transportExample: getTransportCost(city),
      attractionFees: sumAttractionFees(city),
    };
  }, [city, style, days]);

  const valueExamples = city ? VALUE_EXAMPLES[city.id] : null;

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0F172A' }}>
            How Much Does It Cost?
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Travel Budget Calculator — select a city, pick your style, and see a detailed cost breakdown.
          </p>
        </div>

        {/* controls */}
        <div className="rounded-2xl border p-6 mb-8" style={{ background: '#fff', borderColor: '#E2E8F0' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* city select */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
                Destination
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium appearance-none"
                style={{ borderColor: '#E2E8F0', color: '#0F172A', background: '#FAFBFC' }}
              >
                <option value="">Choose a city...</option>
                {COUNTRIES.map((country) => (
                  <optgroup key={country.id} label={`${country.flag} ${country.name}`}>
                    {country.states.flatMap((s) =>
                      s.cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* style select */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
                Travel Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(STYLE_LABELS) as [TravelStyle, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key)}
                    className="rounded-xl px-3 py-2.5 text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: style === key ? '#0EA5E9' : '#E2E8F0',
                      background: style === key ? '#F0F9FF' : '#fff',
                      color: style === key ? '#0369A1' : '#64748B',
                    }}
                  >
                    {STYLE_EMOJIS[key]} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* days */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
                Number of Days
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-10 h-10 rounded-full border-2 text-lg font-bold transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                >
                  -
                </button>
                <span className="text-3xl font-bold tabular-nums" style={{ color: '#0EA5E9' }}>
                  {days}
                </span>
                <button
                  onClick={() => setDays(Math.min(30, days + 1))}
                  className="w-10 h-10 rounded-full border-2 text-lg font-bold transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                >
                  +
                </button>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="w-full mt-3 accent-sky-500"
              />
            </div>
          </div>
        </div>

        {/* results */}
        {city && breakdown && (
          <>
            {/* total hero */}
            <div
              className="rounded-2xl p-8 text-center mb-8"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' }}
            >
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">
                Estimated Total for {days} Days in {city.name}
              </p>
              <p className="text-white text-5xl md:text-6xl font-bold font-serif">
                ${breakdown.total.toLocaleString()}
              </p>
              <p className="text-white/80 text-lg mt-2">
                ~${breakdown.dailyBudget}/day as a {STYLE_LABELS[style]}
              </p>
            </div>

            {/* breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Accommodation', value: breakdown.accom, emoji: '🏨', detail: breakdown.stayExample, sub: `${days} nights` },
                { label: 'Food', value: breakdown.food, emoji: '🍽️', detail: `3 meals/day x ${days} days`, sub: `${days * 3} meals` },
                { label: 'Transport', value: breakdown.transport, emoji: '🚆', detail: breakdown.transportExample, sub: `${days} days` },
                { label: 'Attractions', value: breakdown.attractions, emoji: '🎟️', detail: `${breakdown.attractionFees.total} in entry fees`, sub: `${breakdown.attractionFees.count} paid attractions` },
                { label: 'Misc', value: breakdown.misc, emoji: '🛍️', detail: 'SIM, tips, souvenirs', sub: 'Estimated' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border p-5 transition-shadow hover:shadow-md"
                  style={{ background: '#fff', borderColor: '#E2E8F0' }}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-3 mb-1" style={{ color: '#94A3B8' }}>
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>
                    ${item.value.toLocaleString()}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#64748B' }}>{item.detail}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{item.sub}</p>
                </div>
              ))}
            </div>

            {/* budget bar visualization */}
            <div className="rounded-2xl border p-6 mb-8" style={{ background: '#fff', borderColor: '#E2E8F0' }}>
              <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#0F172A' }}>
                Where Your Money Goes
              </h3>
              <div className="flex rounded-full overflow-hidden h-8 mb-4">
                {[
                  { pct: 35, color: '#0EA5E9', label: 'Stay' },
                  { pct: 30, color: '#F59E0B', label: 'Food' },
                  { pct: 10, color: '#10B981', label: 'Transport' },
                  { pct: 15, color: '#8B5CF6', label: 'Attractions' },
                  { pct: 10, color: '#EF4444', label: 'Misc' },
                ].map((seg) => (
                  <div
                    key={seg.label}
                    className="flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${seg.pct}%`, background: seg.color }}
                    title={`${seg.label}: ${seg.pct}%`}
                  >
                    {seg.pct >= 15 ? seg.label : ''}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                {[
                  { color: '#0EA5E9', label: 'Accommodation 35%' },
                  { color: '#F59E0B', label: 'Food 30%' },
                  { color: '#10B981', label: 'Transport 10%' },
                  { color: '#8B5CF6', label: 'Attractions 15%' },
                  { color: '#EF4444', label: 'Misc 10%' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 font-medium" style={{ color: '#475569' }}>
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* "your $X gets you" */}
            {valueExamples && (
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-bold mb-4 text-center" style={{ color: '#0F172A' }}>
                  Your Money in {city.name} {city.countryFlag}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {valueExamples.map((ex) => (
                    <div
                      key={ex.budget}
                      className="rounded-2xl border p-6 transition-shadow hover:shadow-md"
                      style={{ background: '#fff', borderColor: '#E2E8F0' }}
                    >
                      <p className="font-bold text-lg mb-3" style={{ color: '#0EA5E9' }}>
                        {ex.budget} gets you...
                      </p>
                      <ul className="space-y-2">
                        {ex.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                            <span style={{ color: '#F59E0B' }}>&#10003;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* local prices context */}
            <div className="rounded-2xl border p-6" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#92400E' }}>
                    Local Context
                  </p>
                  <p className="text-sm" style={{ color: '#78350F' }}>
                    Prices are estimates in USD based on real traveler data. Local currency is {city.currencyCode} ({city.currencySymbol}).
                    Budget per day from our data: Backpacker {city.avgBudgetPerDay.backpacker} | Mid-Range {city.avgBudgetPerDay.midRange} | Comfort {city.avgBudgetPerDay.comfort}.
                    Actual costs vary by season, booking lead time, and personal spending habits.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* empty state */}
        {!city && (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed" style={{ borderColor: '#CBD5E1' }}>
            <span className="text-5xl block mb-4">💰</span>
            <p className="text-lg font-medium" style={{ color: '#64748B' }}>
              Select a city above to calculate your travel budget
            </p>
            <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>
              We&apos;ll show accommodation, food, transport, attractions, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
