'use client';

import { useState, useMemo } from 'react';
import { COUNTRIES } from '@/data/travel/destinations';
import type { City } from '@/data/travel/destinations';

/* ───────── helpers ───────── */
function getAllCities(): (City & { countryName: string; countryFlag: string; countryId: string })[] {
  const list: (City & { countryName: string; countryFlag: string; countryId: string })[] = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        list.push({ ...city, countryName: country.name, countryFlag: country.flag, countryId: country.id });
      }
    }
  }
  return list;
}

const ALL_CITIES = getAllCities();

const CURRENT_MONTH_INDEX = new Date().getMonth(); // 0-based
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthWeather(city: City) {
  if (!city.weather || city.weather.length === 0) return null;
  return city.weather[CURRENT_MONTH_INDEX] || city.weather[0];
}

function parseBudgetNumber(budgetStr: string): number {
  const match = budgetStr.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(',', ''), 10) : 0;
}

function countFamilyFriendly(city: City): number {
  return city.attractions.filter((a) => a.familyFriendly).length;
}

function countTop10(city: City): number {
  return city.attractions.filter((a) => a.cityRank && a.cityRank <= 10).length;
}

function getVegetarianScore(city: City): string {
  const vegCount = city.restaurants.filter((r) => r.vegetarianFriendly).length;
  const total = city.restaurants.length;
  if (total === 0) return 'N/A';
  const pct = (vegCount / total) * 100;
  if (pct >= 70) return 'Excellent';
  if (pct >= 50) return 'Good';
  if (pct >= 30) return 'Fair';
  return 'Limited';
}

function getTransportQuality(city: City): string {
  const types = city.transport.length;
  if (types >= 5) return 'Excellent';
  if (types >= 3) return 'Good';
  if (types >= 2) return 'Fair';
  return 'Basic';
}

const LANGUAGE_DIFFICULTY: Record<string, string> = {
  French: 'Moderate',
  Italian: 'Moderate',
  Japanese: 'Hard',
  Thai: 'Hard',
  Hindi: 'Moderate',
  Bengali: 'Hard',
  Marathi: 'Hard',
  English: 'Easy',
  Rajasthani: 'Hard',
};

function getLanguageDifficulty(city: City): string {
  const primary = city.language[0];
  if (primary === 'English') return 'Easy';
  return LANGUAGE_DIFFICULTY[primary] || 'Moderate';
}

function getCurrencyIndicator(city: City): string {
  const cur = city.currency;
  const indicators: Record<string, string> = {
    JPY: '1 USD ~ 150 JPY',
    EUR: '1 USD ~ 0.92 EUR',
    THB: '1 USD ~ 35 THB',
    INR: '1 USD ~ 83 INR',
  };
  return indicators[cur] || cur;
}

/* ── verdict logic ── */
function generateVerdict(cities: typeof ALL_CITIES) {
  if (cities.length < 2) return [];
  const verdicts: string[] = [];

  // adventure = most nature/park attractions
  const adventureCity = [...cities].sort(
    (a, b) =>
      b.attractions.filter((x) => ['nature', 'park', 'beach'].includes(x.category)).length -
      a.attractions.filter((x) => ['nature', 'park', 'beach'].includes(x.category)).length
  )[0];
  verdicts.push(`If you want adventure, go to ${adventureCity.name} ${adventureCity.countryFlag}`);

  // food = most restaurants
  const foodCity = [...cities].sort((a, b) => b.restaurants.length - a.restaurants.length)[0];
  verdicts.push(`If you want food, go to ${foodCity.name} ${foodCity.countryFlag}`);

  // culture = most museum/temple/historic
  const cultureCity = [...cities].sort(
    (a, b) =>
      b.attractions.filter((x) => ['museum', 'temple', 'historic'].includes(x.category)).length -
      a.attractions.filter((x) => ['museum', 'temple', 'historic'].includes(x.category)).length
  )[0];
  verdicts.push(`If you want culture, go to ${cultureCity.name} ${cultureCity.countryFlag}`);

  // budget
  const budgetCity = [...cities].sort(
    (a, b) => parseBudgetNumber(a.avgBudgetPerDay.backpacker) - parseBudgetNumber(b.avgBudgetPerDay.backpacker)
  )[0];
  verdicts.push(`If you want value for money, go to ${budgetCity.name} ${budgetCity.countryFlag}`);

  // family
  const familyCity = [...cities].sort((a, b) => countFamilyFriendly(b) - countFamilyFriendly(a))[0];
  verdicts.push(`If you\'re traveling with family, go to ${familyCity.name} ${familyCity.countryFlag}`);

  return verdicts;
}

/* ── popular comparisons ── */
const POPULAR_COMPARISONS = [
  { label: 'Tokyo vs Seoul', ids: ['tokyo-city', 'seoul'] },
  { label: 'Paris vs Rome', ids: ['paris', 'rome'] },
  { label: 'Bangkok vs Phuket', ids: ['bangkok-city', 'phuket'] },
  { label: 'Florence vs Venice', ids: ['florence', 'venice'] },
];

/* ───────── component ───────── */
export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedCities = useMemo(
    () => selectedIds.map((id) => ALL_CITIES.find((c) => c.id === id)).filter(Boolean) as typeof ALL_CITIES,
    [selectedIds]
  );

  function handleSelectCity(index: number, cityId: string) {
    const next = [...selectedIds];
    next[index] = cityId;
    setSelectedIds(next.filter(Boolean));
  }

  function handleAddSlot() {
    if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, '']);
    }
  }

  function handleRemoveSlot(index: number) {
    setSelectedIds(selectedIds.filter((_, i) => i !== index));
  }

  function handlePopular(ids: string[]) {
    setSelectedIds(ids);
  }

  const verdicts = selectedCities.length >= 2 ? generateVerdict(selectedCities) : [];

  /* ── comparison row component ── */
  function Row({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
    return (
      <tr className={highlight ? 'bg-sky-50/50' : ''}>
        <td className="py-3 px-4 text-sm font-semibold whitespace-nowrap" style={{ color: '#0F172A' }}>
          {label}
        </td>
        {values.map((v, i) => (
          <td key={i} className="py-3 px-4 text-sm text-center" style={{ color: '#475569' }}>
            {v}
          </td>
        ))}
      </tr>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0F172A' }}>
            Compare Destinations Side by Side
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Can&apos;t decide? Pick 2 or 3 cities and compare everything that matters — budget, weather, safety, food, and more.
          </p>
        </div>

        {/* popular comparisons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {POPULAR_COMPARISONS.map((pc) => (
            <button
              key={pc.label}
              onClick={() => handlePopular(pc.ids)}
              className="rounded-full px-5 py-2 text-sm font-semibold border-2 transition-all hover:shadow-md"
              style={{ borderColor: '#0EA5E9', color: '#0EA5E9', background: '#fff' }}
            >
              {pc.label}
            </button>
          ))}
        </div>

        {/* city selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((idx) => {
            if (idx >= Math.max(selectedIds.length, 2) && idx > 1 && selectedIds.length < 3) return null;
            return (
              <div key={idx} className="relative">
                <select
                  value={selectedIds[idx] || ''}
                  onChange={(e) => handleSelectCity(idx, e.target.value)}
                  className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium appearance-none"
                  style={{ borderColor: '#E2E8F0', color: '#0F172A', background: '#fff' }}
                >
                  <option value="">Select a city...</option>
                  {COUNTRIES.map((country) => (
                    <optgroup key={country.id} label={`${country.flag} ${country.name}`}>
                      {country.states.flatMap((s) =>
                        s.cities.map((c) => (
                          <option key={c.id} value={c.id} disabled={selectedIds.includes(c.id) && selectedIds[idx] !== c.id}>
                            {c.name}
                          </option>
                        ))
                      )}
                    </optgroup>
                  ))}
                </select>
                {idx >= 2 && (
                  <button
                    onClick={() => handleRemoveSlot(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ background: '#EF4444' }}
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedIds.length < 3 && (
          <div className="text-center mb-10">
            <button
              onClick={handleAddSlot}
              className="text-sm font-semibold underline"
              style={{ color: '#0EA5E9' }}
            >
              + Add a third city
            </button>
          </div>
        )}

        {/* comparison table */}
        {selectedCities.length >= 2 && (
          <div className="rounded-2xl border overflow-hidden mb-10" style={{ borderColor: '#E2E8F0', background: '#fff' }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-white">Category</th>
                    {selectedCities.map((c) => (
                      <th key={c.id} className="py-4 px-4 text-center">
                        <span className="text-2xl block">{c.countryFlag}</span>
                        <span className="text-white font-serif font-bold text-lg">{c.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  <Row
                    label={`Weather (${MONTH_NAMES[CURRENT_MONTH_INDEX]})`}
                    values={selectedCities.map((c) => {
                      const w = getMonthWeather(c);
                      return w ? `${w.tempHigh}/${w.tempLow}°C — ${w.description}` : 'N/A';
                    })}
                  />
                  <Row
                    label="Safety Rating"
                    values={selectedCities.map((c) => {
                      const map = { high: 'High', moderate: 'Moderate', low: 'Low' } as const;
                      return `${map[c.safetyRating] || c.safetyRating}`;
                    })}
                    highlight
                  />
                  <Row
                    label="Budget / Day (Backpacker)"
                    values={selectedCities.map((c) => c.avgBudgetPerDay.backpacker)}
                  />
                  <Row
                    label="Budget / Day (Mid-Range)"
                    values={selectedCities.map((c) => c.avgBudgetPerDay.midRange)}
                    highlight
                  />
                  <Row
                    label="Budget / Day (Comfort)"
                    values={selectedCities.map((c) => c.avgBudgetPerDay.comfort)}
                  />
                  <Row
                    label="Top 10 Attractions"
                    values={selectedCities.map((c) => `${countTop10(c)} attractions`)}
                    highlight
                  />
                  <Row
                    label="Best Season"
                    values={selectedCities.map((c) => c.bestSeason)}
                  />
                  <Row
                    label="Currency"
                    values={selectedCities.map((c) => getCurrencyIndicator(c))}
                    highlight
                  />
                  <Row
                    label="Language Difficulty"
                    values={selectedCities.map((c) => getLanguageDifficulty(c))}
                  />
                  <Row
                    label="Vegetarian Friendly"
                    values={selectedCities.map((c) => getVegetarianScore(c))}
                    highlight
                  />
                  <Row
                    label="Family Friendly"
                    values={selectedCities.map((c) => `${countFamilyFriendly(c)} of ${c.attractions.length} attractions`)}
                  />
                  <Row
                    label="Public Transport"
                    values={selectedCities.map((c) => getTransportQuality(c))}
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* verdict */}
        {verdicts.length > 0 && (
          <div className="rounded-2xl p-8 border" style={{ background: '#fff', borderColor: '#E2E8F0' }}>
            <h2 className="font-serif text-2xl font-bold mb-6 text-center" style={{ color: '#0F172A' }}>
              The Verdict
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verdicts.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: i % 2 === 0 ? '#F0F9FF' : '#FFFBEB' }}
                >
                  <span className="text-xl">{['⛰️', '🍜', '🏛️', '💰', '👨‍👩‍👧'][i]}</span>
                  <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* empty state */}
        {selectedCities.length < 2 && (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed" style={{ borderColor: '#CBD5E1' }}>
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-lg font-medium" style={{ color: '#64748B' }}>
              Select at least 2 cities above to start comparing
            </p>
            <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>
              Or try one of the popular comparisons
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
