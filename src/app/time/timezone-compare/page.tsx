'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Clock, Plus, X, Users, Zap, CalendarClock, ChevronDown } from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── City Data ─────────────────────────────────────────────
interface City {
  name: string
  country: string
  timezone: string
}

const CITIES: City[] = [
  { name: 'New York', country: 'US', timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'US', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'US', timezone: 'America/Chicago' },
  { name: 'Houston', country: 'US', timezone: 'America/Chicago' },
  { name: 'Dallas', country: 'US', timezone: 'America/Chicago' },
  { name: 'San Francisco', country: 'US', timezone: 'America/Los_Angeles' },
  { name: 'Seattle', country: 'US', timezone: 'America/Los_Angeles' },
  { name: 'Boston', country: 'US', timezone: 'America/New_York' },
  { name: 'Washington DC', country: 'US', timezone: 'America/New_York' },
  { name: 'Miami', country: 'US', timezone: 'America/New_York' },
  { name: 'Denver', country: 'US', timezone: 'America/Denver' },
  { name: 'Phoenix', country: 'US', timezone: 'America/Phoenix' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'S. Korea', timezone: 'Asia/Seoul' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { name: 'Johannesburg', country: 'S. Africa', timezone: 'Africa/Johannesburg' },
]

function getHourInTimezone(baseHour: number, timezone: string, referenceDate: Date): number {
  // Create a date at the baseHour in UTC, then convert
  const d = new Date(referenceDate)
  d.setUTCHours(baseHour, 0, 0, 0)
  const timeStr = d.toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', hour12: false })
  const h = parseInt(timeStr, 10)
  return h === 24 ? 0 : h
}

function getCurrentHourInTimezone(timezone: string): number {
  const now = new Date()
  const timeStr = now.toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', hour12: false })
  const h = parseInt(timeStr, 10)
  return h === 24 ? 0 : h
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

function isWorkingHour(hour: number): boolean {
  return hour >= 9 && hour < 18
}

function isSleepingHour(hour: number): boolean {
  return hour >= 23 || hour < 6
}

function getRowColor(hours: number[]): string {
  const allWorking = hours.every(isWorkingHour)
  const someWorking = hours.some(isWorkingHour)
  const anySleeping = hours.some(isSleepingHour)

  if (allWorking) return 'bg-emerald-500/10 border-emerald-500/20'
  if (someWorking && !anySleeping) return 'bg-yellow-500/8 border-yellow-500/15'
  if (anySleeping) return 'bg-red-500/8 border-red-500/15'
  return 'bg-slate-500/5 border-slate-500/10'
}

function getHourTextColor(hour: number): string {
  if (isWorkingHour(hour)) return 'text-emerald-400'
  if (isSleepingHour(hour)) return 'text-red-400/70'
  return 'text-muted'
}

// ─── City Picker Component ─────────────────────────────────
function CityPicker({
  label,
  selectedCity,
  onSelect,
  onRemove,
  showRemove,
}: {
  label: string
  selectedCity: City
  onSelect: (city: City) => void
  onRemove?: () => void
  showRemove?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <label className="block text-xs text-muted uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-card-bg border border-card-border text-slate-200 text-sm hover:border-primary/40 transition-colors"
        >
          <span>
            {selectedCity.name}, {selectedCity.country}
          </span>
          <ChevronDown className="w-4 h-4 text-muted" />
        </button>
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="p-2.5 rounded-lg bg-card-bg border border-card-border text-muted hover:text-red-400 hover:border-red-500/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-[#0F172A] border border-card-border shadow-2xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-card-border">
            <input
              type="text"
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-dark-bg border border-card-border text-slate-200 text-sm placeholder:text-muted focus:outline-none focus:border-primary/40"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.map((city) => (
              <button
                key={`${city.name}-${city.country}`}
                onClick={() => {
                  onSelect(city)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors ${
                  city.name === selectedCity.name
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-300'
                }`}
              >
                {city.name},{' '}
                <span className="text-muted">{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TimezoneComparePage() {
  const [now, setNow] = useState(new Date())
  const [selectedCities, setSelectedCities] = useState<City[]>([
    CITIES[0], // New York
    CITIES[14], // London
  ])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const updateCity = useCallback(
    (index: number, city: City) => {
      setSelectedCities((prev) => {
        const next = [...prev]
        next[index] = city
        return next
      })
    },
    []
  )

  const addCity = useCallback(() => {
    if (selectedCities.length < 4) {
      // Pick first city not already selected
      const available = CITIES.find(
        (c) => !selectedCities.some((s) => s.name === c.name)
      )
      if (available) {
        setSelectedCities((prev) => [...prev, available])
      }
    }
  }, [selectedCities])

  const removeCity = useCallback((index: number) => {
    setSelectedCities((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // ─── Compute 24-hour grid ───────────────────────────────
  const grid = useMemo(() => {
    const rows: { baseHour: number; hours: number[]; isCurrentHour: boolean }[] = []
    const currentHourFirst = getCurrentHourInTimezone(selectedCities[0].timezone)

    for (let h = 0; h < 24; h++) {
      const hours = selectedCities.map((city) => {
        // Calculate offset from first city
        const refDate = new Date(now)
        refDate.setUTCHours(0, 0, 0, 0)

        const hour0 = getHourInTimezone(0, selectedCities[0].timezone, refDate)
        const hourCity = getHourInTimezone(0, city.timezone, refDate)
        const offset = hourCity - hour0
        return ((h + offset) % 24 + 24) % 24
      })

      rows.push({
        baseHour: h,
        hours,
        isCurrentHour: h === currentHourFirst,
      })
    }
    return rows
  }, [selectedCities, now])

  // ─── Overlap & Best Meeting Times ───────────────────────
  const overlapInfo = useMemo(() => {
    let overlapCount = 0
    const bestSlots: { hour: number; hours: number[] }[] = []

    for (const row of grid) {
      const allWorking = row.hours.every(isWorkingHour)
      if (allWorking) {
        overlapCount++
        bestSlots.push({ hour: row.baseHour, hours: row.hours })
      }
    }

    return { overlapCount, bestSlots: bestSlots.slice(0, 3) }
  }, [grid])

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <CalendarClock className="w-4 h-4" />
            Schedule Planner
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-3">
            Time Zone Comparison
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Compare schedules across time zones. Find overlapping working hours and the best times to meet.
          </p>
        </div>

        {/* City Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {selectedCities.map((city, i) => (
            <CityPicker
              key={i}
              label={i === 0 ? 'Your City' : i === 1 ? 'Their City' : `City ${i + 1}`}
              selectedCity={city}
              onSelect={(c) => updateCity(i, c)}
              onRemove={() => removeCity(i)}
              showRemove={i >= 2}
            />
          ))}
          {selectedCities.length < 4 && (
            <div className="flex items-end">
              <button
                onClick={addCity}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-card-border text-muted hover:text-primary hover:border-primary/40 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add City
              </button>
            </div>
          )}
        </div>

        {/* Overlap Summary */}
        <div className="rounded-xl border border-card-border bg-gradient-to-r from-emerald-500/5 to-primary/5 p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-100 text-lg font-semibold">
                  {overlapInfo.overlapCount > 0 ? (
                    <>
                      You have{' '}
                      <span className="text-emerald-400">
                        {overlapInfo.overlapCount} overlapping working{' '}
                        {overlapInfo.overlapCount === 1 ? 'hour' : 'hours'}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-400">
                      No overlapping working hours found
                    </span>
                  )}
                </p>
                <p className="text-muted text-sm">
                  Working hours: 9 AM - 6 PM in each city
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Meeting Times */}
        {overlapInfo.bestSlots.length > 0 && (
          <div className="mb-6">
            <h2 className="font-heading text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Best Meeting Times
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {overlapInfo.bestSlots.map((slot, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">
                      Option {i + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {selectedCities.map((city, ci) => (
                      <div
                        key={ci}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted">{city.name}</span>
                        <span className="text-slate-200 font-mono">
                          {formatHour(slot.hours[ci])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdBanner />

        {/* 24-Hour Comparison Grid */}
        <div className="rounded-xl border border-card-border bg-card-bg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  {selectedCities.map((city, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {city.name}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted font-medium w-24">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {grid.map((row) => {
                  const rowClass = getRowColor(row.hours)
                  const allWorking = row.hours.every(isWorkingHour)
                  const someWorking = row.hours.some(isWorkingHour)
                  const anySleeping = row.hours.some(isSleepingHour)

                  return (
                    <tr
                      key={row.baseHour}
                      className={`border-b border-card-border transition-colors ${rowClass} ${
                        row.isCurrentHour
                          ? 'ring-2 ring-inset ring-primary/50 bg-primary/10'
                          : ''
                      }`}
                    >
                      {row.hours.map((hour, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-2.5 font-mono text-sm ${getHourTextColor(
                            hour
                          )} ${ci === 0 ? 'font-medium' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            {formatHour(hour)}
                            {row.isCurrentHour && ci === 0 && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-2.5">
                        {allWorking ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            Overlap
                          </span>
                        ) : anySleeping ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400/70">
                            Sleep
                          </span>
                        ) : someWorking ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400/70">
                            Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-500/10 text-muted">
                            Off
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <h3 className="font-heading text-sm font-semibold text-slate-100 mb-3">
            Color Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/30" />
              <span className="text-xs text-muted">
                Both working (9 AM - 6 PM)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-yellow-500/30" />
              <span className="text-xs text-muted">
                One city working
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-500/20" />
              <span className="text-xs text-muted">
                Sleeping hours (11 PM - 6 AM)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-500/20" />
              <span className="text-xs text-muted">
                Both outside working hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted">Current hour</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
