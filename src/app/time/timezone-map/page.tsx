'use client'

import { useState, useEffect, useMemo } from 'react'
import { Globe, MapPin, ChevronRight, Search } from 'lucide-react'
import { MAP_PATH_DATA } from '../world-clock/map-data'
import AdBanner from '@/components/time/AdBanner';

// ─── Mercator Projection ──────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function latLngToSvg(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 1000
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = 500 / 2 - (500 * mercN) / (2 * Math.PI)
  return { x, y }
}

// ─── Timezone Band Colors ─────────────────────────────────
const BAND_COLORS = [
  'rgba(239,68,68,0.08)',   // red
  'rgba(249,115,22,0.08)',  // orange
  'rgba(234,179,8,0.08)',   // yellow
  'rgba(132,204,22,0.08)',  // lime
  'rgba(34,197,94,0.08)',   // green
  'rgba(20,184,166,0.08)',  // teal
  'rgba(6,182,212,0.08)',   // cyan
  'rgba(59,130,246,0.08)',  // blue
  'rgba(99,102,241,0.08)',  // indigo
  'rgba(168,85,247,0.08)',  // purple
  'rgba(236,72,153,0.08)',  // pink
  'rgba(244,63,94,0.08)',   // rose
]

// ─── Timezone Data ────────────────────────────────────────
interface TzInfo {
  offset: number
  label: string
  cities: { name: string; country: string; tz: string }[]
}

const TIMEZONE_DATA: TzInfo[] = [
  { offset: -12, label: 'UTC-12', cities: [{ name: 'Baker Island', country: 'US Minor', tz: 'Etc/GMT+12' }] },
  { offset: -11, label: 'UTC-11', cities: [{ name: 'Pago Pago', country: 'American Samoa', tz: 'Pacific/Pago_Pago' }, { name: 'Midway', country: 'US Minor', tz: 'Pacific/Midway' }] },
  { offset: -10, label: 'UTC-10', cities: [{ name: 'Honolulu', country: 'USA', tz: 'Pacific/Honolulu' }, { name: 'Tahiti', country: 'French Polynesia', tz: 'Pacific/Tahiti' }] },
  { offset: -9, label: 'UTC-9', cities: [{ name: 'Anchorage', country: 'USA', tz: 'America/Anchorage' }, { name: 'Juneau', country: 'USA', tz: 'America/Juneau' }] },
  { offset: -8, label: 'UTC-8', cities: [{ name: 'Los Angeles', country: 'USA', tz: 'America/Los_Angeles' }, { name: 'Vancouver', country: 'Canada', tz: 'America/Vancouver' }, { name: 'Seattle', country: 'USA', tz: 'America/Los_Angeles' }, { name: 'San Francisco', country: 'USA', tz: 'America/Los_Angeles' }] },
  { offset: -7, label: 'UTC-7', cities: [{ name: 'Denver', country: 'USA', tz: 'America/Denver' }, { name: 'Phoenix', country: 'USA', tz: 'America/Phoenix' }, { name: 'Edmonton', country: 'Canada', tz: 'America/Edmonton' }] },
  { offset: -6, label: 'UTC-6', cities: [{ name: 'Chicago', country: 'USA', tz: 'America/Chicago' }, { name: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City' }, { name: 'Dallas', country: 'USA', tz: 'America/Chicago' }, { name: 'Houston', country: 'USA', tz: 'America/Chicago' }] },
  { offset: -5, label: 'UTC-5', cities: [{ name: 'New York', country: 'USA', tz: 'America/New_York' }, { name: 'Toronto', country: 'Canada', tz: 'America/Toronto' }, { name: 'Miami', country: 'USA', tz: 'America/New_York' }, { name: 'Bogota', country: 'Colombia', tz: 'America/Bogota' }, { name: 'Lima', country: 'Peru', tz: 'America/Lima' }] },
  { offset: -4, label: 'UTC-4', cities: [{ name: 'Santiago', country: 'Chile', tz: 'America/Santiago' }, { name: 'Caracas', country: 'Venezuela', tz: 'America/Caracas' }, { name: 'Halifax', country: 'Canada', tz: 'America/Halifax' }, { name: 'La Paz', country: 'Bolivia', tz: 'America/La_Paz' }] },
  { offset: -3, label: 'UTC-3', cities: [{ name: 'Sao Paulo', country: 'Brazil', tz: 'America/Sao_Paulo' }, { name: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires' }, { name: 'Montevideo', country: 'Uruguay', tz: 'America/Montevideo' }] },
  { offset: -2, label: 'UTC-2', cities: [{ name: 'South Georgia', country: 'UK Territory', tz: 'Atlantic/South_Georgia' }] },
  { offset: -1, label: 'UTC-1', cities: [{ name: 'Azores', country: 'Portugal', tz: 'Atlantic/Azores' }, { name: 'Cape Verde', country: 'Cape Verde', tz: 'Atlantic/Cape_Verde' }] },
  { offset: 0, label: 'UTC+0', cities: [{ name: 'London', country: 'UK', tz: 'Europe/London' }, { name: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon' }, { name: 'Reykjavik', country: 'Iceland', tz: 'Atlantic/Reykjavik' }, { name: 'Accra', country: 'Ghana', tz: 'Africa/Accra' }] },
  { offset: 1, label: 'UTC+1', cities: [{ name: 'Paris', country: 'France', tz: 'Europe/Paris' }, { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin' }, { name: 'Rome', country: 'Italy', tz: 'Europe/Rome' }, { name: 'Madrid', country: 'Spain', tz: 'Europe/Madrid' }, { name: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos' }] },
  { offset: 2, label: 'UTC+2', cities: [{ name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo' }, { name: 'Athens', country: 'Greece', tz: 'Europe/Athens' }, { name: 'Helsinki', country: 'Finland', tz: 'Europe/Helsinki' }, { name: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg' }, { name: 'Bucharest', country: 'Romania', tz: 'Europe/Bucharest' }] },
  { offset: 3, label: 'UTC+3', cities: [{ name: 'Moscow', country: 'Russia', tz: 'Europe/Moscow' }, { name: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul' }, { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh' }, { name: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi' }] },
  { offset: 4, label: 'UTC+4', cities: [{ name: 'Dubai', country: 'UAE', tz: 'Asia/Dubai' }, { name: 'Baku', country: 'Azerbaijan', tz: 'Asia/Baku' }, { name: 'Tbilisi', country: 'Georgia', tz: 'Asia/Tbilisi' }] },
  { offset: 5, label: 'UTC+5', cities: [{ name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi' }, { name: 'Tashkent', country: 'Uzbekistan', tz: 'Asia/Tashkent' }, { name: 'Yekaterinburg', country: 'Russia', tz: 'Asia/Yekaterinburg' }] },
  { offset: 5.5, label: 'UTC+5:30', cities: [{ name: 'Mumbai', country: 'India', tz: 'Asia/Kolkata' }, { name: 'Delhi', country: 'India', tz: 'Asia/Kolkata' }, { name: 'Bangalore', country: 'India', tz: 'Asia/Kolkata' }, { name: 'Colombo', country: 'Sri Lanka', tz: 'Asia/Colombo' }] },
  { offset: 6, label: 'UTC+6', cities: [{ name: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka' }, { name: 'Almaty', country: 'Kazakhstan', tz: 'Asia/Almaty' }] },
  { offset: 7, label: 'UTC+7', cities: [{ name: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok' }, { name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' }, { name: 'Hanoi', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh' }] },
  { offset: 8, label: 'UTC+8', cities: [{ name: 'Shanghai', country: 'China', tz: 'Asia/Shanghai' }, { name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore' }, { name: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong' }, { name: 'Perth', country: 'Australia', tz: 'Australia/Perth' }, { name: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei' }] },
  { offset: 9, label: 'UTC+9', cities: [{ name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo' }, { name: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul' }] },
  { offset: 9.5, label: 'UTC+9:30', cities: [{ name: 'Adelaide', country: 'Australia', tz: 'Australia/Adelaide' }, { name: 'Darwin', country: 'Australia', tz: 'Australia/Darwin' }] },
  { offset: 10, label: 'UTC+10', cities: [{ name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' }, { name: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne' }, { name: 'Brisbane', country: 'Australia', tz: 'Australia/Brisbane' }] },
  { offset: 11, label: 'UTC+11', cities: [{ name: 'Noumea', country: 'New Caledonia', tz: 'Pacific/Noumea' }, { name: 'Solomon Islands', country: 'Solomon Islands', tz: 'Pacific/Guadalcanal' }] },
  { offset: 12, label: 'UTC+12', cities: [{ name: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland' }, { name: 'Fiji', country: 'Fiji', tz: 'Pacific/Fiji' }] },
  { offset: 13, label: 'UTC+13', cities: [{ name: 'Apia', country: 'Samoa', tz: 'Pacific/Apia' }, { name: "Nuku'alofa", country: 'Tonga', tz: 'Pacific/Tongatapu' }] },
  { offset: 14, label: 'UTC+14', cities: [{ name: 'Kiritimati', country: 'Kiribati', tz: 'Pacific/Kiritimati' }] },
]

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  const hours = Math.floor(abs)
  const minutes = (abs % 1) * 60
  return `UTC${sign}${hours}${minutes ? `:${minutes.toString().padStart(2, '0')}` : ''}`
}

function getTimeForOffset(offset: number): string {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const target = new Date(utc + offset * 3600000)
  return target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
}

function getUserOffset(): number {
  return -(new Date().getTimezoneOffset() / 60)
}

export default function TimezoneMapPage() {
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [now, setNow] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const userOffset = getUserOffset()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Integer offsets for the band drawing (UTC-12 to UTC+14)
  const integerOffsets = useMemo(() => {
    const offsets: number[] = []
    for (let i = -12; i <= 14; i++) offsets.push(i)
    return offsets
  }, [])

  const selectedZone = useMemo(() => {
    if (selectedOffset === null) return null
    return TIMEZONE_DATA.find(tz => tz.offset === selectedOffset) || null
  }, [selectedOffset])

  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return TIMEZONE_DATA
    const q = searchQuery.toLowerCase()
    return TIMEZONE_DATA.filter(
      tz =>
        tz.label.toLowerCase().includes(q) ||
        tz.cities.some(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    )
  }, [searchQuery])

  // Band drawing: each integer offset covers 15 degrees of longitude
  function offsetToSvgX(offset: number): number {
    const lng = offset * 15
    return ((lng + 180) / 360) * 1000
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Interactive Map
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            World Time Zone Map
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Click any timezone band to explore countries and cities. Your timezone ({formatOffset(userOffset)}) is highlighted.
          </p>
        </div>

        {/* SVG Map */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-6 mb-8 overflow-hidden">
          {/* UTC offset labels at top */}
          <div className="overflow-x-auto mb-2">
            <div className="min-w-[800px]">
              <svg viewBox="0 0 1000 30" className="w-full" aria-hidden="true">
                {integerOffsets.map((offset) => {
                  const x = offsetToSvgX(offset)
                  const bandWidth = 1000 / 27
                  const isUser = Math.round(userOffset) === offset
                  const isSelected = selectedOffset === offset
                  return (
                    <text
                      key={offset}
                      x={x + bandWidth / 2}
                      y={20}
                      textAnchor="middle"
                      className={`text-[7px] ${isSelected ? 'fill-[#4F46E5]' : isUser ? 'fill-[#06B6D4]' : 'fill-[#94A3B8]'}`}
                      fontWeight={isUser || isSelected ? 'bold' : 'normal'}
                    >
                      {offset >= 0 ? `+${offset}` : offset}
                    </text>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Main map with bands */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <svg viewBox="0 0 1000 500" className="w-full">
                {/* Timezone bands */}
                {integerOffsets.map((offset, i) => {
                  const x = offsetToSvgX(offset) - (1000 / 27 / 2)
                  const bandWidth = 1000 / 27
                  const isUser = Math.round(userOffset) === offset
                  const isSelected = selectedOffset === offset
                  const colorIdx = ((i % BAND_COLORS.length) + BAND_COLORS.length) % BAND_COLORS.length
                  let fillColor = BAND_COLORS[colorIdx]
                  if (isUser) fillColor = 'rgba(6,182,212,0.15)'
                  if (isSelected) fillColor = 'rgba(79,70,229,0.2)'

                  return (
                    <rect
                      key={offset}
                      x={x}
                      y={0}
                      width={bandWidth}
                      height={500}
                      fill={fillColor}
                      stroke={isSelected ? '#4F46E5' : isUser ? '#06B6D4' : '#1E293B'}
                      strokeWidth={isSelected ? 1.5 : isUser ? 1 : 0.3}
                      className="cursor-pointer transition-all hover:opacity-80"
                      onClick={() => setSelectedOffset(offset === selectedOffset ? null : offset)}
                    />
                  )
                })}

                {/* World map path */}
                <path
                  d={MAP_PATH_DATA}
                  fill="#334155"
                  stroke="#475569"
                  strokeWidth={0.3}
                  className="pointer-events-none"
                />

                {/* Timezone vertical lines */}
                {integerOffsets.map((offset) => {
                  const x = offsetToSvgX(offset)
                  return (
                    <line
                      key={`line-${offset}`}
                      x1={x}
                      y1={0}
                      x2={x}
                      y2={500}
                      stroke="#475569"
                      strokeWidth={0.5}
                      strokeDasharray="4 4"
                      className="pointer-events-none"
                      opacity={0.4}
                    />
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        <AdBanner />

        {/* Selected zone detail */}
        {selectedZone && (
          <div className="bg-[#0F172A] border border-[#4F46E5]/30 rounded-2xl p-6 mb-8 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#4F46E5]">
                  {selectedZone.label}
                </h2>
                <p className="text-[#06B6D4] text-lg font-mono mt-1">
                  {getTimeForOffset(selectedZone.offset)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOffset(null)}
                className="text-[#94A3B8] hover:text-white text-sm px-3 py-1 rounded-lg border border-[#1E293B] hover:border-[#4F46E5] transition-colors"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedZone.cities.map((city) => (
                <div
                  key={city.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#030712] border border-[#1E293B]"
                >
                  <MapPin className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{city.name}</p>
                    <p className="text-[#94A3B8] text-xs">{city.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + All Timezones */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-heading text-2xl font-bold">All Time Zones</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search city or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030712] border border-[#1E293B] text-sm text-[#E2E8F0] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZones.map((tz) => {
              const isUser = tz.offset === Math.round(userOffset * 2) / 2
              return (
                <button
                  key={tz.offset}
                  onClick={() => setSelectedOffset(tz.offset)}
                  className={`text-left p-4 rounded-xl border transition-all hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 ${
                    isUser
                      ? 'border-[#06B6D4]/40 bg-[#06B6D4]/5'
                      : selectedOffset === tz.offset
                      ? 'border-[#4F46E5]/40 bg-[#4F46E5]/5'
                      : 'border-[#1E293B] bg-[#030712]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-lg">
                      {tz.label}
                      {isUser && (
                        <span className="ml-2 text-xs text-[#06B6D4] font-normal">(You)</span>
                      )}
                    </span>
                    <span className="font-mono text-sm text-[#06B6D4]">
                      {getTimeForOffset(tz.offset)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tz.cities.slice(0, 4).map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F172A] text-xs text-[#94A3B8]"
                      >
                        <MapPin className="w-3 h-3" />
                        {c.name}
                      </span>
                    ))}
                    {tz.cities.length > 4 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-[#4F46E5]">
                        +{tz.cities.length - 4} more
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {filteredZones.length === 0 && (
            <div className="text-center py-12 text-[#94A3B8]">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No timezones match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
