'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COUNTRIES } from '@/data/travel/destinations';

const CHECKLIST_KEY = 'zaxise-pretip-checklist';

const checklistItems = [
  'Passport valid for 6+ months',
  'Visa arranged',
  'Travel insurance purchased',
  'Flights booked',
  'Accommodation booked',
  'Local currency obtained',
  'Offline maps downloaded',
  'Emergency contacts saved',
  'Copies of documents made',
  'Phone charger adapter packed',
];

function parseUsdRange(budgetStr: string): { low: number; high: number } | null {
  // Try to extract USD amounts like "$40–55" or "$40-55" or "$270+"
  const usdMatch = budgetStr.match(/\$(\d+)[–\-](\d+)/);
  if (usdMatch) {
    return { low: parseInt(usdMatch[1], 10), high: parseInt(usdMatch[2], 10) };
  }
  // Handle "$270+" style
  const plusMatch = budgetStr.match(/\$(\d+)\+/);
  if (plusMatch) {
    const val = parseInt(plusMatch[1], 10);
    return { low: val, high: Math.round(val * 1.3) };
  }
  // Try euro amounts: "€50–70"
  const euroMatch = budgetStr.match(/€(\d+)[–\-](\d+)/);
  if (euroMatch) {
    // Rough EUR to USD
    const low = Math.round(parseInt(euroMatch[1], 10) * 1.1);
    const high = Math.round(parseInt(euroMatch[2], 10) * 1.1);
    return { low, high };
  }
  const euroPlusMatch = budgetStr.match(/€(\d+)\+/);
  if (euroPlusMatch) {
    const val = Math.round(parseInt(euroPlusMatch[1], 10) * 1.1);
    return { low: val, high: Math.round(val * 1.3) };
  }
  return null;
}

function PreTripChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = useCallback((item: string) => {
    setChecked((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const completedCount = checklistItems.filter((item) => checked[item]).length;

  return (
    <div className="rounded-2xl bg-card-bg border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-dark">
            Pre-Trip Checklist
          </h2>
          <p className="text-dark/60 text-sm mt-1">
            Track your preparation progress. Your checklist is saved automatically.
          </p>
        </div>
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          {completedCount}/{checklistItems.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-border mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent-gradient transition-all duration-500"
          style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-2">
        {checklistItems.map((item) => (
          <li key={item}>
            <button
              onClick={() => toggle(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                checked[item]
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-page-bg hover:border-primary/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked[item]
                    ? 'border-primary bg-primary'
                    : 'border-dark/20'
                }`}
              >
                {checked[item] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  checked[item] ? 'text-dark/40 line-through' : 'text-dark/80'
                }`}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlanPage() {
  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [days, setDays] = useState<number>(0);
  const [budgetDays, setBudgetDays] = useState<number>(3);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.id === countryId),
    [countryId]
  );

  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    return selectedCountry.states.flatMap((s) => s.cities);
  }, [selectedCountry]);

  const selectedCity = useMemo(
    () => cities.find((c) => c.id === cityId),
    [cities, cityId]
  );

  const itinerary = useMemo(() => {
    if (!selectedCity || !days) return null;
    return selectedCity.itineraries.find((it) => it.days === days) || null;
  }, [selectedCity, days]);

  const handleCountryChange = (value: string) => {
    setCountryId(value);
    setCityId('');
    setDays(0);
  };

  const handleCityChange = (value: string) => {
    setCityId(value);
    setDays(0);
  };

  // Find the state for building the destination link
  const cityState = useMemo(() => {
    if (!selectedCountry || !cityId) return null;
    for (const state of selectedCountry.states) {
      if (state.cities.some((c) => c.id === cityId)) {
        return state;
      }
    }
    return null;
  }, [selectedCountry, cityId]);

  const stepComplete = (step: number) => {
    if (step === 1) return !!countryId;
    if (step === 2) return !!cityId;
    if (step === 3) return !!days;
    return false;
  };

  return (
    <div className="bg-page-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-page-bg to-secondary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            Trip Planner
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark">
            Plan a Trip
          </h1>
          <p className="mt-4 text-dark/70 text-lg max-w-xl mx-auto">
            Pick your destination and get a ready-made itinerary in three simple steps.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    stepComplete(step)
                      ? 'bg-primary text-white'
                      : 'bg-card-bg border-2 border-border text-dark/40'
                  }`}
                >
                  {stepComplete(step) ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 transition-colors ${
                      stepComplete(step) ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Country */}
          <div className="rounded-xl bg-card-bg border border-border p-6 sm:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                1
              </div>
              <h2 className="font-heading text-xl font-bold text-dark">
                Pick a Country
              </h2>
            </div>
            <select
              value={countryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-page-bg px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            >
              <option value="">Select a country...</option>
              {COUNTRIES.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: City */}
          <div
            className={`rounded-xl bg-card-bg border border-border p-6 sm:p-8 shadow-sm mb-6 transition-opacity ${
              !countryId ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                2
              </div>
              <h2 className="font-heading text-xl font-bold text-dark">
                Pick a City
              </h2>
            </div>
            <select
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!countryId}
              className="w-full rounded-lg border border-border bg-page-bg px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:cursor-not-allowed"
            >
              <option value="">Select a city...</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Days */}
          <div
            className={`rounded-xl bg-card-bg border border-border p-6 sm:p-8 shadow-sm mb-6 transition-opacity ${
              !cityId ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                3
              </div>
              <h2 className="font-heading text-xl font-bold text-dark">
                How Many Days?
              </h2>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  disabled={!cityId}
                  className={`flex-1 rounded-lg border-2 py-3 text-center font-semibold transition-all ${
                    days === d
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-page-bg text-dark/60 hover:border-primary/40'
                  } disabled:cursor-not-allowed`}
                >
                  {d} {d === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Itinerary Result */}
          {itinerary && selectedCity && (
            <div className="rounded-2xl bg-card-bg border border-border p-6 sm:p-8 shadow-md mt-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-dark">
                    {itinerary.title}
                  </h2>
                  <p className="text-dark/60 mt-1">
                    {selectedCity.name}, {selectedCountry?.name}
                  </p>
                </div>
                <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary">
                  {itinerary.days} {itinerary.days === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <div className="space-y-6">
                {itinerary.dayPlans.map((plan) => (
                  <div
                    key={plan.day}
                    className="rounded-xl border border-border p-5"
                  >
                    <h3 className="font-heading text-lg font-semibold text-dark mb-4">
                      Day {plan.day}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-primary/5 p-3">
                        <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                          Morning
                        </span>
                        <p className="text-sm text-dark/70">{plan.morning}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/5 p-3">
                        <span className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                          Afternoon
                        </span>
                        <p className="text-sm text-dark/70">{plan.afternoon}</p>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-3">
                        <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                          Evening
                        </span>
                        <p className="text-sm text-dark/70">{plan.evening}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Link to full destination page */}
              {cityState && selectedCountry && (
                <div className="mt-8 text-center">
                  <Link
                    href={`/travel/country/${selectedCountry.slug}/${cityState.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
                  >
                    View Full Destination Page
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!itinerary && countryId && cityId && days > 0 && (
            <div className="rounded-xl bg-card-bg border border-border p-8 text-center mt-10">
              <p className="text-dark/60">
                No {days}-day itinerary available for this destination yet. Try a different duration.
              </p>
            </div>
          )}

          {/* Travel Budget Calculator */}
          {selectedCity && (
            <div className="rounded-2xl bg-card-bg border border-border p-6 sm:p-8 shadow-sm mt-10">
              <h2 className="font-heading text-2xl font-bold text-dark mb-2">
                Travel Budget Calculator
              </h2>
              <p className="text-dark/60 text-sm mb-6">
                Estimated daily costs for {selectedCity.name}. Adjust the number of days to see your total.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark/70 mb-2">
                  Number of days
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={budgetDays}
                  onChange={(e) => setBudgetDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 rounded-lg border border-border bg-page-bg px-4 py-3 text-dark font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {([
                  { tier: 'Backpacker', key: 'backpacker' as const, color: 'bg-emerald-500', bgLight: 'bg-emerald-50', textColor: 'text-emerald-700' },
                  { tier: 'Mid-Range', key: 'midRange' as const, color: 'bg-blue-500', bgLight: 'bg-blue-50', textColor: 'text-blue-700' },
                  { tier: 'Comfort', key: 'comfort' as const, color: 'bg-purple-500', bgLight: 'bg-purple-50', textColor: 'text-purple-700' },
                ]).map(({ tier, key, color, bgLight, textColor }) => {
                  const raw = selectedCity.avgBudgetPerDay[key];
                  const parsed = parseUsdRange(raw);
                  return (
                    <div key={key} className={`rounded-xl border border-border p-5 ${bgLight}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className={`text-sm font-bold ${textColor}`}>{tier}</span>
                      </div>
                      <p className="text-xs text-dark/50 mb-1">Per day</p>
                      <p className="text-sm font-semibold text-dark mb-3">{raw}</p>
                      {parsed && (
                        <>
                          <p className="text-xs text-dark/50 mb-1">Estimated {budgetDays}-day total</p>
                          <p className={`text-lg font-bold ${textColor}`}>
                            ${(parsed.low * budgetDays).toLocaleString()} &ndash; ${(parsed.high * budgetDays).toLocaleString()}
                          </p>
                          <div className="mt-3 pt-3 border-t border-dark/10 space-y-1 text-xs text-dark/50">
                            <p>Accommodation: ~{Math.round(40)}%</p>
                            <p>Food: ~{Math.round(25)}%</p>
                            <p>Transport: ~{Math.round(15)}%</p>
                            <p>Attractions: ~{Math.round(20)}%</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-dark/40 mt-4">
                * Estimates are approximate and based on average traveler spending. Actual costs may vary by season and personal preferences.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pre-Trip Checklist */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          <PreTripChecklist />
        </div>
      </section>
    </div>
  );
}
