'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Zap,
  Clock,
  Ruler,
  Orbit,
  Star,
  ChevronRight,
  Info,
  Play,
  RotateCcw,
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Constants ────────────────────────────────────────────
const SPEED_OF_LIGHT_KMS = 299792.458 // km/s
const KM_PER_MILE = 1.609344
const KM_PER_AU = 149597870.7
const KM_PER_LIGHT_YEAR = 9.461e12

// ─── Unit Conversions ─────────────────────────────────────
type DistanceUnit = 'km' | 'miles' | 'au' | 'light-years'

function toKm(value: number, unit: DistanceUnit): number {
  switch (unit) {
    case 'km': return value
    case 'miles': return value * KM_PER_MILE
    case 'au': return value * KM_PER_AU
    case 'light-years': return value * KM_PER_LIGHT_YEAR
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 0.001) {
    return `${(seconds * 1e6).toFixed(2)} microseconds`
  }
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(2)} milliseconds`
  }
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs.toFixed(1)} seconds`
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`
  }
  if (seconds < 86400 * 365.25) {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`
  }
  const years = seconds / (86400 * 365.25)
  if (years >= 1e6) {
    return `${(years / 1e6).toFixed(3)} million years`
  }
  if (years >= 1000) {
    return `${years.toLocaleString('en-US', { maximumFractionDigits: 0 })} years`
  }
  return `${years.toFixed(2)} years`
}

function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trillion`
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// ─── Preset Distances ─────────────────────────────────────
interface PresetDistance {
  label: string
  from: string
  to: string
  distanceKm: number
  description: string
}

const PRESET_DISTANCES: PresetDistance[] = [
  { label: 'Earth to Moon', from: 'Earth', to: 'Moon', distanceKm: 384400, description: 'Average distance' },
  { label: 'Earth to Sun', from: 'Earth', to: 'Sun', distanceKm: 149597870, description: '1 Astronomical Unit (AU)' },
  { label: 'Earth to Mars (closest)', from: 'Earth', to: 'Mars', distanceKm: 55000000, description: 'At closest approach' },
  { label: 'Earth to Mars (farthest)', from: 'Earth', to: 'Mars', distanceKm: 401000000, description: 'At farthest point' },
  { label: 'Earth to Jupiter', from: 'Earth', to: 'Jupiter', distanceKm: 588000000, description: 'Average distance' },
  { label: 'Sun to Pluto', from: 'Sun', to: 'Pluto', distanceKm: 5906000000, description: 'Average distance' },
  { label: 'Earth to Proxima Centauri', from: 'Earth', to: 'Proxima Centauri', distanceKm: 4.24 * KM_PER_LIGHT_YEAR, description: 'Nearest star — 4.24 light-years' },
  { label: 'Earth to Andromeda Galaxy', from: 'Earth', to: 'Andromeda', distanceKm: 2.537e6 * KM_PER_LIGHT_YEAR, description: '2.537 million light-years' },
  { label: 'Across the Milky Way', from: 'Edge', to: 'Edge', distanceKm: 100000 * KM_PER_LIGHT_YEAR, description: '100,000 light-years diameter' },
]

// ─── Facts ────────────────────────────────────────────────
const LIGHT_FACTS = [
  'The speed of light in a vacuum is exactly 299,792.458 km/s (about 186,282 miles/s).',
  'Nothing with mass can travel at the speed of light — it would require infinite energy.',
  "Einstein's special relativity (1905) established that the speed of light is the same for all observers.",
  'Light takes about 8 minutes and 20 seconds to travel from the Sun to Earth.',
  'A light-year is about 9.461 trillion kilometers (5.879 trillion miles).',
  'In fiber optic cables, light travels at about 2/3 the speed of light in vacuum.',
  'The speed of light defines the meter: it is the distance light travels in 1/299,792,458 of a second.',
  'When you look at the Andromeda Galaxy, you see it as it was 2.5 million years ago.',
]

export default function SpeedOfLightPage() {
  const [distance, setDistance] = useState('')
  const [unit, setUnit] = useState<DistanceUnit>('km')
  const [tickerKm, setTickerKm] = useState(0)
  const [tickerRunning, setTickerRunning] = useState(true)
  const startTimeRef = useRef<number>(Date.now())
  const animFrameRef = useRef<number | undefined>(undefined)

  // Live ticker
  useEffect(() => {
    if (!tickerRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    function tick() {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setTickerKm(elapsed * SPEED_OF_LIGHT_KMS)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [tickerRunning])

  const resetTicker = () => {
    startTimeRef.current = Date.now()
    setTickerKm(0)
  }

  // Calculation result
  const result = useMemo(() => {
    const val = parseFloat(distance)
    if (isNaN(val) || val <= 0) return null
    const km = toKm(val, unit)
    const seconds = km / SPEED_OF_LIGHT_KMS
    return { km, seconds, formatted: formatDuration(seconds) }
  }, [distance, unit])

  const selectPreset = (preset: PresetDistance) => {
    setDistance(preset.distanceKm.toString())
    setUnit('km')
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Calculator
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            Speed of Light Calculator
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            How long does light take to travel any distance? Explore the cosmic speed limit at 299,792.458 km/s.
          </p>
        </div>

        {/* Live Ticker */}
        <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#4F46E5]/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Light has traveled since you opened this page:</p>
              <p className="font-mono text-2xl sm:text-3xl font-bold text-[#06B6D4]">
                {formatLargeNumber(tickerKm)} km
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                ({formatLargeNumber(tickerKm / KM_PER_MILE)} miles)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTickerRunning(!tickerRunning)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1E293B] hover:border-[#4F46E5] text-sm transition-colors"
              >
                <Play className={`w-4 h-4 ${tickerRunning ? 'text-green-400' : 'text-[#94A3B8]'}`} />
                {tickerRunning ? 'Running' : 'Paused'}
              </button>
              <button
                onClick={resetTicker}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1E293B] hover:border-[#4F46E5] text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Calculator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#4F46E5]" />
                Calculate Travel Time
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-[#94A3B8] mb-1 block">Distance</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Enter distance..."
                    className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-[#1E293B] text-lg font-mono focus:outline-none focus:border-[#4F46E5] transition-colors placeholder:text-[#94A3B8]/50"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <label className="text-xs text-[#94A3B8] mb-1 block">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as DistanceUnit)}
                    className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-[#1E293B] text-lg focus:outline-none focus:border-[#4F46E5] appearance-none cursor-pointer"
                  >
                    <option value="km">Kilometers</option>
                    <option value="miles">Miles</option>
                    <option value="au">AU</option>
                    <option value="light-years">Light-years</option>
                  </select>
                </div>
              </div>

              {result && (
                <div className="bg-[#030712] border border-[#4F46E5]/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#06B6D4]" />
                    <span className="text-sm text-[#94A3B8]">Light travel time:</span>
                  </div>
                  <p className="font-heading text-3xl font-bold text-[#06B6D4] mb-2">
                    {result.formatted}
                  </p>
                  <p className="text-sm text-[#94A3B8]">
                    Distance: {formatLargeNumber(result.km)} km ({result.seconds.toExponential(4)} seconds)
                  </p>
                </div>
              )}
            </div>

            {/* Preset Distances */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Orbit className="w-5 h-5 text-[#4F46E5]" />
                Cosmic Distances
              </h2>

              <div className="space-y-3">
                {PRESET_DISTANCES.map((preset, i) => {
                  const seconds = preset.distanceKm / SPEED_OF_LIGHT_KMS
                  return (
                    <button
                      key={i}
                      onClick={() => selectPreset(preset)}
                      className="w-full text-left p-4 rounded-xl bg-[#030712] border border-[#1E293B] hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm flex items-center gap-2">
                          {preset.label}
                          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#4F46E5] transition-colors" />
                        </span>
                        <span className="font-mono text-sm text-[#06B6D4]">
                          {formatDuration(seconds)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8]">{preset.description}</span>
                        <span className="text-xs text-[#94A3B8]">
                          {formatLargeNumber(preset.distanceKm)} km
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <AdBanner />

          {/* Right: Facts */}
          <div className="space-y-8">
            {/* Speed of Light Facts */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#4F46E5]" />
                Speed of Light
              </h2>

              <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#4F46E5]/20 rounded-xl p-5 mb-5">
                <p className="font-mono text-3xl font-bold text-center text-[#E2E8F0] mb-1">
                  299,792.458
                </p>
                <p className="text-center text-sm text-[#94A3B8]">kilometers per second</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center">
                    <p className="font-mono text-lg font-bold text-[#06B6D4]">186,282</p>
                    <p className="text-xs text-[#94A3B8]">miles/s</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-lg font-bold text-[#06B6D4]">670.6M</p>
                    <p className="text-xs text-[#94A3B8]">mph</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {LIGHT_FACTS.map((fact, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-[#030712] border border-[#1E293B]">
                    <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Einstein's Special Relativity */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
              <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Special Relativity
              </h2>
              <div className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  In 1905, Albert Einstein published his theory of special relativity, establishing
                  that the speed of light in a vacuum (denoted <em className="text-[#E2E8F0] font-mono">c</em>) is
                  the universal speed limit.
                </p>
                <p>
                  The famous equation <span className="text-[#E2E8F0] font-mono font-bold">E = mc&sup2;</span> shows
                  that energy and mass are interchangeable, and that accelerating an object with mass
                  to the speed of light would require infinite energy.
                </p>
                <p>
                  As an object approaches the speed of light, time dilation occurs: time passes
                  slower for the moving object relative to a stationary observer. At light speed,
                  time would stop entirely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
