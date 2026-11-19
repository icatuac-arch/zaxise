'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, Clock, Globe, RefreshCw, MapPin, Users } from 'lucide-react'
import { MAP_PATH_DATA } from '../world-clock/map-data'
import AdBanner from '@/components/time/AdBanner';

// ─── Projection ────────────────────────────────────────────
function latLngToSvg(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 1000
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = 500 / 2 - (500 * mercN) / (2 * Math.PI)
  return { x, y }
}

// ─── Example Cities ────────────────────────────────────────
const SAMPLE_CITIES = [
  { name: 'New York', lat: 40.71, lng: -74.01, pop: 8.3 },
  { name: 'London', lat: 51.51, lng: -0.13, pop: 9.0 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, pop: 13.96 },
  { name: 'Sydney', lat: -33.87, lng: 151.21, pop: 5.3 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, pop: 20.7 },
  { name: 'Dubai', lat: 25.2, lng: 55.27, pop: 3.5 },
  { name: 'Los Angeles', lat: 34.05, lng: -118.24, pop: 3.9 },
  { name: 'Singapore', lat: 1.35, lng: 103.82, pop: 5.9 },
  { name: 'Paris', lat: 48.86, lng: 2.35, pop: 2.2 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47, pop: 24.9 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63, pop: 12.3 },
  { name: 'Cairo', lat: 30.04, lng: 31.24, pop: 10.1 },
]

// Rough estimate: ~4.2B in daylight on average
function estimateDaylightPopulation(subsolarLng: number, declination: number): { daylight: number; darkness: number } {
  const totalPop = 8.1
  // Simplified: count sample cities in daylight, weight by approximate hemisphere populations
  let dayPop = 0
  let nightPop = 0
  const decRad = (declination * Math.PI) / 180

  // Check a grid of population centers
  const popCenters = [
    { lat: 35, lng: 105, pop: 2.5 },   // China region
    { lat: 25, lng: 80, pop: 1.8 },    // India region
    { lat: 5, lng: 30, pop: 1.2 },     // Africa
    { lat: 50, lng: 15, pop: 0.7 },    // Europe
    { lat: 35, lng: -100, pop: 0.4 },  // North America
    { lat: -15, lng: -50, pop: 0.3 },  // South America
    { lat: 30, lng: 50, pop: 0.4 },    // Middle East
    { lat: 5, lng: 115, pop: 0.4 },    // SE Asia
    { lat: -30, lng: 140, pop: 0.03 }, // Australia
    { lat: 55, lng: 80, pop: 0.2 },    // Russia/Central Asia
  ]

  for (const center of popCenters) {
    const lngRad = (center.lng * Math.PI) / 180
    const subsolarLngRad = (subsolarLng * Math.PI) / 180
    const hourAngle = Math.abs(lngRad - subsolarLngRad)
    const latRad = (center.lat * Math.PI) / 180
    const cosZenith = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngle)
    if (cosZenith > 0) {
      dayPop += center.pop
    } else {
      nightPop += center.pop
    }
  }

  const ratio = dayPop / (dayPop + nightPop)
  return {
    daylight: Math.round(totalPop * ratio * 10) / 10,
    darkness: Math.round(totalPop * (1 - ratio) * 10) / 10,
  }
}

function isCityInDaylight(lat: number, lng: number, subsolarLng: number, declination: number): boolean {
  const decRad = (declination * Math.PI) / 180
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const subsolarLngRad = (subsolarLng * Math.PI) / 180
  const hourAngle = lngRad - subsolarLngRad
  const cosZenith = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngle)
  return cosZenith > 0
}

export default function DayNightMapPage() {
  const [now, setNow] = useState(new Date())

  const updateTime = useCallback(() => {
    setNow(new Date())
  }, [])

  useEffect(() => {
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [updateTime])

  // ─── Solar Calculations ────────────────────────────────
  const utcHours = now.getUTCHours()
  const utcMinutes = now.getUTCMinutes()
  const utcSeconds = now.getUTCSeconds()
  const hourDecimal = utcHours + utcMinutes / 60 + utcSeconds / 3600

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const declination =
    -23.44 * Math.cos(((360 / 365) * (dayOfYear + 10) * Math.PI) / 180)
  const subsolarLng = -(hourDecimal * 15) + 180
  const normalizedSubsolarLng =
    ((subsolarLng + 540) % 360) - 180
  const subsolarLat = declination

  const decRad = (declination * Math.PI) / 180

  // ─── Generate Terminator Path ──────────────────────────
  const terminatorPoints: { x: number; y: number }[] = []
  for (let lng = -180; lng <= 180; lng += 2) {
    const lngRad = (lng * Math.PI) / 180
    const subsolarLngRad = (normalizedSubsolarLng * Math.PI) / 180
    const lat =
      Math.atan(
        -Math.cos(lngRad + subsolarLngRad) / Math.tan(decRad)
      ) *
      (180 / Math.PI)
    const pt = latLngToSvg(lat, lng)
    terminatorPoints.push(pt)
  }

  // Build night overlay polygon — fill below or above terminator based on hemisphere
  const nightPath = (() => {
    const pts = terminatorPoints.map((p) => `${p.x},${p.y}`).join(' L')
    // If declination > 0, night is at south pole side (bottom of map)
    // If declination < 0, night is at north pole side (top of map)
    // We always close the path to cover the dark side
    if (declination >= 0) {
      // Summer in N hemisphere: night wraps around bottom
      return `M${terminatorPoints[0].x},${terminatorPoints[0].y} L${pts} L1000,${terminatorPoints[terminatorPoints.length - 1].y} L1000,500 L0,500 L0,${terminatorPoints[0].y} Z`
    } else {
      // Winter in N hemisphere: night wraps around top
      return `M${terminatorPoints[0].x},${terminatorPoints[0].y} L${pts} L1000,${terminatorPoints[terminatorPoints.length - 1].y} L1000,0 L0,0 L0,${terminatorPoints[0].y} Z`
    }
  })()

  // ─── City Day/Night Status ─────────────────────────────
  const citiesWithStatus = SAMPLE_CITIES.map((city) => ({
    ...city,
    isDaylight: isCityInDaylight(
      city.lat,
      city.lng,
      normalizedSubsolarLng,
      declination
    ),
  }))

  const daylightCities = citiesWithStatus.filter((c) => c.isDaylight)
  const darknessCities = citiesWithStatus.filter((c) => !c.isDaylight)

  // ─── Population Estimate ───────────────────────────────
  const popEstimate = estimateDaylightPopulation(normalizedSubsolarLng, declination)

  const subsolarPoint = latLngToSvg(subsolarLat, normalizedSubsolarLng)

  const utcString = now.toUTCString().replace('GMT', 'UTC')

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Real-Time Visualization
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-3">
            Live Day & Night Map
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            See where the Sun is shining and where darkness falls across our planet, updated every minute.
          </p>
        </div>

        {/* UTC Clock */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-secondary" />
          <span className="text-slate-200 font-mono text-lg">{utcString}</span>
          <button
            onClick={updateTime}
            className="p-1.5 rounded-lg hover:bg-card-bg transition-colors text-muted hover:text-slate-200"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* SVG Map */}
        <div className="rounded-2xl border border-card-border bg-[#0a1628] overflow-hidden mb-8">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect width="1000" height="500" fill="#0a1628" />

            {/* Grid lines */}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const pt = latLngToSvg(lat, 0)
              return (
                <line
                  key={`lat-${lat}`}
                  x1="0"
                  y1={pt.y}
                  x2="1000"
                  y2={pt.y}
                  stroke="#1e293b"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              )
            })}
            {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(
              (lng) => {
                const pt = latLngToSvg(0, lng)
                return (
                  <line
                    key={`lng-${lng}`}
                    x1={pt.x}
                    y1="0"
                    x2={pt.x}
                    y2="500"
                    stroke="#1e293b"
                    strokeWidth="0.5"
                    strokeDasharray="4,4"
                  />
                )
              }
            )}

            {/* Continents */}
            <path
              d={MAP_PATH_DATA}
              fill="#1a2d4a"
              stroke="#1e3a5f"
              strokeWidth="0.5"
            />

            {/* Night overlay */}
            <path d={nightPath} fill="#030712" fillOpacity="0.6" />

            {/* Terminator line */}
            <polyline
              points={terminatorPoints
                .map((p) => `${p.x},${p.y}`)
                .join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />

            {/* Subsolar point */}
            <circle
              cx={subsolarPoint.x}
              cy={subsolarPoint.y}
              r="6"
              fill="#f59e0b"
              fillOpacity="0.9"
            />
            <circle
              cx={subsolarPoint.x}
              cy={subsolarPoint.y}
              r="12"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <circle
              cx={subsolarPoint.x}
              cy={subsolarPoint.y}
              r="18"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />

            {/* City markers */}
            {citiesWithStatus.map((city) => {
              const pt = latLngToSvg(city.lat, city.lng)
              return (
                <g key={city.name}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    fill={city.isDaylight ? '#facc15' : '#6366f1'}
                    stroke={city.isDaylight ? '#fef08a' : '#818cf8'}
                    strokeWidth="1"
                  />
                  <text
                    x={pt.x + 5}
                    y={pt.y + 3}
                    fill={city.isDaylight ? '#fde68a' : '#a5b4fc'}
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    {city.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <AdBanner />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Subsolar Point */}
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-yellow-400" />
              <h3 className="font-heading text-lg font-semibold text-slate-100">
                Subsolar Point
              </h3>
            </div>
            <p className="text-muted text-sm mb-2">
              Where the Sun is directly overhead right now
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted text-sm">Latitude</span>
                <span className="text-slate-200 font-mono text-sm">
                  {Math.abs(subsolarLat).toFixed(2)}°{' '}
                  {subsolarLat >= 0 ? 'N' : 'S'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Longitude</span>
                <span className="text-slate-200 font-mono text-sm">
                  {Math.abs(normalizedSubsolarLng).toFixed(2)}°{' '}
                  {normalizedSubsolarLng >= 0 ? 'E' : 'W'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Declination</span>
                <span className="text-slate-200 font-mono text-sm">
                  {declination.toFixed(2)}°
                </span>
              </div>
            </div>
          </div>

          {/* Daylight Cities */}
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-yellow-400" />
              <h3 className="font-heading text-lg font-semibold text-slate-100">
                In Daylight
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {daylightCities.map((city) => (
                <span
                  key={city.name}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs"
                >
                  <Sun className="w-3 h-3" />
                  {city.name}
                </span>
              ))}
              {daylightCities.length === 0 && (
                <span className="text-muted text-sm">
                  Calculating...
                </span>
              )}
            </div>
          </div>

          {/* Darkness Cities */}
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <h3 className="font-heading text-lg font-semibold text-slate-100">
                In Darkness
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {darknessCities.map((city) => (
                <span
                  key={city.name}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                >
                  <Moon className="w-3 h-3" />
                  {city.name}
                </span>
              ))}
              {darknessCities.length === 0 && (
                <span className="text-muted text-sm">
                  Calculating...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="rounded-xl border border-card-border bg-gradient-to-r from-primary/5 to-secondary/5 p-6 mb-8">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-slate-100 mb-1">
                Right Now on Earth
              </h3>
              <p className="text-slate-300 text-base">
                Approximately{' '}
                <span className="text-yellow-400 font-semibold">
                  {popEstimate.daylight} billion people
                </span>{' '}
                are in daylight and{' '}
                <span className="text-indigo-400 font-semibold">
                  {popEstimate.darkness} billion people
                </span>{' '}
                are in darkness.
              </p>
            </div>
          </div>
        </div>

        {/* Solar Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
            <p className="text-muted text-xs uppercase tracking-wider mb-1">
              Day of Year
            </p>
            <p className="text-2xl font-bold text-slate-100 font-mono">
              {dayOfYear}
            </p>
            <p className="text-muted text-xs">of 365</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
            <p className="text-muted text-xs uppercase tracking-wider mb-1">
              Solar Declination
            </p>
            <p className="text-2xl font-bold text-slate-100 font-mono">
              {declination.toFixed(1)}°
            </p>
            <p className="text-muted text-xs">
              {declination > 0
                ? 'Sun north of equator'
                : 'Sun south of equator'}
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
            <p className="text-muted text-xs uppercase tracking-wider mb-1">
              UTC Time
            </p>
            <p className="text-2xl font-bold text-slate-100 font-mono">
              {String(utcHours).padStart(2, '0')}:
              {String(utcMinutes).padStart(2, '0')}
            </p>
            <p className="text-muted text-xs">
              {String(utcSeconds).padStart(2, '0')}s
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
            <p className="text-muted text-xs uppercase tracking-wider mb-1">
              Map Updates
            </p>
            <p className="text-2xl font-bold text-secondary font-mono">
              60s
            </p>
            <p className="text-muted text-xs">auto-refresh interval</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6">
          <h2 className="font-heading text-xl font-semibold text-slate-100 mb-4">
            How This Map Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-200 mb-1">
                  Solar Terminator
                </h4>
                <p className="text-muted text-xs">
                  The gold line shows the boundary between day and
                  night, calculated from the Sun&apos;s current position
                  using solar declination and hour angle.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-200 mb-1">
                  City Markers
                </h4>
                <p className="text-muted text-xs">
                  Yellow dots mark cities in daylight; purple dots show
                  cities in darkness. The status updates every minute.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-200 mb-1">
                  Subsolar Point
                </h4>
                <p className="text-muted text-xs">
                  The pulsing gold circle shows where the Sun is directly
                  overhead. It moves westward at roughly 1,600 km/h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
