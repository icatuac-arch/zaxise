'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

const PACKING_SUGGESTIONS: Record<string, string[]> = {
  Spring: [
    'Light layers — mornings can be cool, afternoons warm',
    'A compact umbrella or rain jacket',
    'Comfortable walking shoes',
    'Sunglasses and sunscreen',
    'Light scarf for temples or breezy days',
  ],
  Summer: [
    'Breathable, moisture-wicking clothing',
    'Wide-brimmed hat and strong sunscreen (SPF 50+)',
    'Refillable water bottle to stay hydrated',
    'Light sandals and comfortable walking shoes',
    'Insect repellent for tropical destinations',
  ],
  Autumn: [
    'Medium layers — a fleece or light jacket',
    'Waterproof outer layer',
    'Sturdy walking shoes or boots',
    'Warm scarf and light gloves for late autumn',
    'Camera for the spectacular foliage',
  ],
  Winter: [
    'Thermal base layers and insulated jacket',
    'Warm waterproof boots with good grip',
    'Gloves, beanie, and warm scarf',
    'Hand warmers for extremely cold destinations',
    'Lip balm and moisturizer for dry air',
  ],
}

const AVOID_WARNINGS: Record<string, { period: string; warning: string; severity: 'high' | 'moderate' }[]> = {
  japan: [
    { period: 'June - mid July', warning: 'Rainy season (tsuyu) — heavy, persistent rain across most of the country.', severity: 'moderate' },
    { period: 'August - September', warning: 'Typhoon season — powerful storms can disrupt travel and cause flooding.', severity: 'high' },
    { period: 'Late July - August', warning: 'Extreme heat and humidity in Tokyo and Osaka (35C+ with high humidity).', severity: 'moderate' },
  ],
  italy: [
    { period: 'July - August', warning: 'Peak heat in southern Italy and Rome (38C+). Many local shops close for Ferragosto in mid-August.', severity: 'moderate' },
    { period: 'November - December', warning: 'Venice acqua alta (high water flooding) season.', severity: 'moderate' },
  ],
  thailand: [
    { period: 'May - October', warning: 'Monsoon season — heavy downpours, especially in the afternoons. Flooding possible in low-lying areas.', severity: 'high' },
    { period: 'March - May', warning: 'Extreme heat (40C+) and poor air quality from agricultural burning in the north.', severity: 'high' },
  ],
  france: [
    { period: 'July - August', warning: 'Intense heat waves becoming more common (40C+). Paris can be stifling.', severity: 'moderate' },
    { period: 'August', warning: 'Many Parisians leave — some restaurants and shops close for annual vacation.', severity: 'moderate' },
  ],
  india: [
    { period: 'June - September', warning: 'Southwest monsoon — extreme rainfall, flooding, and disrupted transport across most of India.', severity: 'high' },
    { period: 'April - June', warning: 'Scorching heat (45C+) across northern plains. Heatstroke risk is very real.', severity: 'high' },
    { period: 'October - November', warning: 'Post-monsoon cyclones along eastern coast.', severity: 'moderate' },
  ],
}

function getCapitalCity(countryId: string) {
  const country = COUNTRIES.find((c) => c.id === countryId)
  if (!country) return null
  for (const state of country.states) {
    for (const city of state.cities) {
      if (city.name === country.capital) return city
    }
  }
  // Fallback to first city
  return country.states[0]?.cities[0] || null
}

function WeatherChart({ countryId }: { countryId: string }) {
  const city = getCapitalCity(countryId)
  if (!city || !city.weather || city.weather.length === 0) {
    return <p className="text-sm text-[#0F172A]/50 italic">Weather data not available for the capital city.</p>
  }

  const weather = city.weather
  const maxTemp = Math.max(...weather.map((w) => w.tempHigh))
  const maxRainfall = Math.max(...weather.map((w) => w.rainfall))
  const chartH = 200
  const barW = 28
  const gap = 8
  const totalW = weather.length * (barW * 2 + gap * 3)

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm overflow-x-auto">
      <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-1">
        Monthly Weather — {city.name}
      </h3>
      <p className="text-sm text-[#0F172A]/50 mb-4">Temperature (C) and Rainfall (mm)</p>

      <div className="flex items-center gap-4 text-xs text-[#0F172A]/60 mb-3">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#0EA5E9]" /> High Temp
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#0EA5E9]/40" /> Low Temp
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> Rainfall
        </span>
      </div>

      <svg
        viewBox={`0 0 ${totalW + 40} ${chartH + 50}`}
        className="w-full"
        style={{ minWidth: `${totalW + 40}px` }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={30}
            y1={chartH * (1 - frac) + 10}
            x2={totalW + 30}
            y2={chartH * (1 - frac) + 10}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}

        {weather.map((w, i) => {
          const x = 30 + i * (barW * 2 + gap * 3)
          const highH = maxTemp > 0 ? (w.tempHigh / maxTemp) * chartH : 0
          const lowH = maxTemp > 0 ? (w.tempLow / maxTemp) * chartH : 0
          const rainH = maxRainfall > 0 ? (w.rainfall / maxRainfall) * chartH : 0

          return (
            <g key={w.month}>
              {/* High temp bar */}
              <rect
                x={x}
                y={chartH - highH + 10}
                width={barW}
                height={highH}
                rx={3}
                fill="#0EA5E9"
              />
              <text x={x + barW / 2} y={chartH - highH + 6} textAnchor="middle" className="text-[9px] fill-[#0F172A]/70">
                {w.tempHigh}°
              </text>

              {/* Low temp bar */}
              <rect
                x={x}
                y={chartH - lowH + 10}
                width={barW}
                height={lowH}
                rx={3}
                fill="#0EA5E9"
                opacity={0.35}
              />

              {/* Rainfall bar */}
              <rect
                x={x + barW + gap}
                y={chartH - rainH + 10}
                width={barW}
                height={rainH}
                rx={3}
                fill="#F59E0B"
              />
              <text x={x + barW + gap + barW / 2} y={chartH - rainH + 6} textAnchor="middle" className="text-[9px] fill-[#0F172A]/70">
                {w.rainfall}
              </text>

              {/* Month label */}
              <text
                x={x + barW + gap / 2}
                y={chartH + 28}
                textAnchor="middle"
                className="text-[10px] fill-[#0F172A]/60 font-medium"
              >
                {w.month.slice(0, 3)}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Weather descriptions */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {weather.map((w) => (
          <div key={w.month} className="text-xs text-[#0F172A]/60">
            <span className="font-medium text-[#0F172A]">{w.month}:</span> {w.description}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WeatherGuidePage() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [selectedSeason, setSelectedSeason] = useState<string>('Summer')

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.id === selectedCountryId),
    [selectedCountryId]
  )

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#10B981] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Best Time to Visit</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Monthly weather charts, best seasons, packing suggestions, and travel warnings for every destination.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Best Season Overview */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Best Season by Country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTRIES.map((country) => (
              <div
                key={country.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCountryId(country.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[#0F172A]">{country.name}</h3>
                    <p className="text-xs text-[#0F172A]/50">{country.continent}</p>
                  </div>
                </div>
                <div className="bg-[#0EA5E9]/10 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium text-[#0EA5E9] block">Best Time to Visit</span>
                  <span className="text-sm text-[#0F172A] font-medium">{country.bestTimeToVisit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Country Selector */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Detailed Weather</h2>
          <select
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">-- Choose a country --</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </section>

        {/* Weather Chart */}
        {selectedCountry && (
          <section className="space-y-6">
            <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
              <span className="mr-2">{selectedCountry.flag}</span>
              {selectedCountry.name} Weather
            </h2>

            <WeatherChart countryId={selectedCountry.id} />

            {/* Avoid Warnings */}
            {AVOID_WARNINGS[selectedCountry.id] && AVOID_WARNINGS[selectedCountry.id].length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-xl font-semibold text-[#0F172A]">Travel Warnings</h3>
                {AVOID_WARNINGS[selectedCountry.id].map((w, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${
                      w.severity === 'high'
                        ? 'border-red-200 bg-red-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          w.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.severity === 'high' ? 'Avoid' : 'Caution'}
                      </span>
                      <span className="font-semibold text-[#0F172A] text-sm">{w.period}</span>
                    </div>
                    <p className="text-sm text-[#0F172A]/80">{w.warning}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Packing Suggestions */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Packing Suggestions</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(PACKING_SUGGESTIONS).map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSeason === season
                    ? 'bg-[#0EA5E9] text-white shadow-md'
                    : 'bg-white text-[#0F172A]/70 border border-[#E2E8F0] hover:border-[#0EA5E9]'
                }`}
              >
                {season}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">{selectedSeason} Packing List</h3>
            <ul className="space-y-2">
              {PACKING_SUGGESTIONS[selectedSeason]?.map((item, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 mt-1 w-5 h-5 rounded border-2 border-[#E2E8F0]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* All Warnings Overview */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">All Travel Warnings at a Glance</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#0EA5E9]/10">
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Country</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Period</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Severity</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Warning</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.flatMap((country) =>
                    (AVOID_WARNINGS[country.id] || []).map((w, i) => (
                      <tr key={`${country.id}-${i}`} className="border-t border-[#E2E8F0] hover:bg-[#FAFBFC]">
                        {i === 0 ? (
                          <td
                            className="px-5 py-3 font-medium text-[#0F172A]"
                            rowSpan={(AVOID_WARNINGS[country.id] || []).length}
                          >
                            <span className="mr-1">{country.flag}</span> {country.name}
                          </td>
                        ) : null}
                        <td className="px-5 py-3 text-[#0F172A]/80 whitespace-nowrap">{w.period}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              w.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {w.severity === 'high' ? 'Avoid' : 'Caution'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#0F172A]/80">{w.warning}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
