'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Sparkles,
  Eclipse,
  Star,
  CircleDot,
  RotateCcw,
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Astronomical Events 2025-2027 ───────────────────────
interface AstroEvent {
  date: string
  title: string
  type: 'eclipse' | 'meteor' | 'fullmoon' | 'solstice'
}

const ASTRO_EVENTS: AstroEvent[] = [
  // 2025
  { date: '2025-01-13', title: 'Full Moon (Wolf Moon)', type: 'fullmoon' },
  { date: '2025-02-12', title: 'Full Moon (Snow Moon)', type: 'fullmoon' },
  { date: '2025-03-14', title: 'Full Moon (Worm Moon) — Total Lunar Eclipse', type: 'eclipse' },
  { date: '2025-03-29', title: 'Partial Solar Eclipse', type: 'eclipse' },
  { date: '2025-04-12', title: 'Full Moon (Pink Moon)', type: 'fullmoon' },
  { date: '2025-04-22', title: 'Lyrids Meteor Shower Peak', type: 'meteor' },
  { date: '2025-05-12', title: 'Full Moon (Flower Moon)', type: 'fullmoon' },
  { date: '2025-06-11', title: 'Full Moon (Strawberry Moon)', type: 'fullmoon' },
  { date: '2025-06-21', title: 'Summer Solstice', type: 'solstice' },
  { date: '2025-07-10', title: 'Full Moon (Buck Moon)', type: 'fullmoon' },
  { date: '2025-08-09', title: 'Full Moon (Sturgeon Moon)', type: 'fullmoon' },
  { date: '2025-08-12', title: 'Perseids Meteor Shower Peak', type: 'meteor' },
  { date: '2025-09-07', title: 'Full Moon (Harvest Moon) — Total Lunar Eclipse', type: 'eclipse' },
  { date: '2025-09-21', title: 'Partial Solar Eclipse', type: 'eclipse' },
  { date: '2025-09-22', title: 'Autumnal Equinox', type: 'solstice' },
  { date: '2025-10-07', title: 'Full Moon (Hunter\'s Moon)', type: 'fullmoon' },
  { date: '2025-10-21', title: 'Orionids Meteor Shower Peak', type: 'meteor' },
  { date: '2025-11-05', title: 'Full Moon (Beaver Moon)', type: 'fullmoon' },
  { date: '2025-12-04', title: 'Full Moon (Cold Moon)', type: 'fullmoon' },
  { date: '2025-12-14', title: 'Geminids Meteor Shower Peak', type: 'meteor' },
  { date: '2025-12-21', title: 'Winter Solstice', type: 'solstice' },
  // 2026
  { date: '2026-01-03', title: 'Full Moon (Wolf Moon)', type: 'fullmoon' },
  { date: '2026-01-03', title: 'Quadrantids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-02-01', title: 'Full Moon (Snow Moon)', type: 'fullmoon' },
  { date: '2026-02-17', title: 'Annular Solar Eclipse', type: 'eclipse' },
  { date: '2026-03-03', title: 'Full Moon (Worm Moon) — Total Lunar Eclipse', type: 'eclipse' },
  { date: '2026-03-20', title: 'March Equinox', type: 'solstice' },
  { date: '2026-04-01', title: 'Full Moon (Pink Moon)', type: 'fullmoon' },
  { date: '2026-04-22', title: 'Lyrids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-05-01', title: 'Full Moon (Flower Moon)', type: 'fullmoon' },
  { date: '2026-05-06', title: 'Eta Aquariids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-05-31', title: 'Full Moon (Strawberry Moon)', type: 'fullmoon' },
  { date: '2026-06-21', title: 'Summer Solstice', type: 'solstice' },
  { date: '2026-06-29', title: 'Full Moon (Buck Moon)', type: 'fullmoon' },
  { date: '2026-07-29', title: 'Full Moon (Sturgeon Moon)', type: 'fullmoon' },
  { date: '2026-08-12', title: 'Total Solar Eclipse', type: 'eclipse' },
  { date: '2026-08-12', title: 'Perseids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-08-28', title: 'Full Moon (Harvest Moon) — Partial Lunar Eclipse', type: 'eclipse' },
  { date: '2026-09-22', title: 'Autumnal Equinox', type: 'solstice' },
  { date: '2026-09-26', title: 'Full Moon (Hunter\'s Moon)', type: 'fullmoon' },
  { date: '2026-10-21', title: 'Orionids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-10-26', title: 'Full Moon (Beaver Moon)', type: 'fullmoon' },
  { date: '2026-11-24', title: 'Full Moon (Cold Moon)', type: 'fullmoon' },
  { date: '2026-12-14', title: 'Geminids Meteor Shower Peak', type: 'meteor' },
  { date: '2026-12-21', title: 'Winter Solstice', type: 'solstice' },
  { date: '2026-12-24', title: 'Full Moon (Cold Moon)', type: 'fullmoon' },
  // 2027
  { date: '2027-01-22', title: 'Full Moon (Wolf Moon)', type: 'fullmoon' },
  { date: '2027-02-06', title: 'Annular Solar Eclipse', type: 'eclipse' },
  { date: '2027-02-20', title: 'Full Moon (Snow Moon) — Penumbral Lunar Eclipse', type: 'eclipse' },
  { date: '2027-03-20', title: 'March Equinox', type: 'solstice' },
  { date: '2027-03-22', title: 'Full Moon (Worm Moon)', type: 'fullmoon' },
  { date: '2027-04-20', title: 'Full Moon (Pink Moon)', type: 'fullmoon' },
  { date: '2027-04-22', title: 'Lyrids Meteor Shower Peak', type: 'meteor' },
  { date: '2027-05-20', title: 'Full Moon (Flower Moon)', type: 'fullmoon' },
  { date: '2027-06-18', title: 'Full Moon (Strawberry Moon)', type: 'fullmoon' },
  { date: '2027-06-21', title: 'Summer Solstice', type: 'solstice' },
  { date: '2027-07-18', title: 'Full Moon (Buck Moon) — Penumbral Lunar Eclipse', type: 'eclipse' },
  { date: '2027-07-28', title: 'Delta Aquariids Meteor Shower Peak', type: 'meteor' },
  { date: '2027-08-02', title: 'Total Solar Eclipse', type: 'eclipse' },
  { date: '2027-08-12', title: 'Perseids Meteor Shower Peak', type: 'meteor' },
  { date: '2027-08-17', title: 'Full Moon (Sturgeon Moon)', type: 'fullmoon' },
  { date: '2027-09-15', title: 'Full Moon (Harvest Moon)', type: 'fullmoon' },
  { date: '2027-09-22', title: 'Autumnal Equinox', type: 'solstice' },
  { date: '2027-10-15', title: 'Full Moon (Hunter\'s Moon)', type: 'fullmoon' },
  { date: '2027-10-21', title: 'Orionids Meteor Shower Peak', type: 'meteor' },
  { date: '2027-11-13', title: 'Full Moon (Beaver Moon)', type: 'fullmoon' },
  { date: '2027-12-13', title: 'Full Moon (Cold Moon)', type: 'fullmoon' },
  { date: '2027-12-14', title: 'Geminids Meteor Shower Peak', type: 'meteor' },
  { date: '2027-12-21', title: 'Winter Solstice', type: 'solstice' },
]

// ─── Moon Phase Calculation (Synodic Month) ───────────────
// Known new moon: Jan 6, 2000 18:14 UTC (reference)
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime()
const SYNODIC_MONTH = 29.53058770576

function getMoonPhase(date: Date): { phase: number; name: string; emoji: string } {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24)
  const phase = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
  const normalized = phase / SYNODIC_MONTH

  if (normalized < 0.0625) return { phase: normalized, name: 'New Moon', emoji: '🌑' }
  if (normalized < 0.1875) return { phase: normalized, name: 'Waxing Crescent', emoji: '🌒' }
  if (normalized < 0.3125) return { phase: normalized, name: 'First Quarter', emoji: '🌓' }
  if (normalized < 0.4375) return { phase: normalized, name: 'Waxing Gibbous', emoji: '🌔' }
  if (normalized < 0.5625) return { phase: normalized, name: 'Full Moon', emoji: '🌕' }
  if (normalized < 0.6875) return { phase: normalized, name: 'Waning Gibbous', emoji: '🌖' }
  if (normalized < 0.8125) return { phase: normalized, name: 'Last Quarter', emoji: '🌗' }
  if (normalized < 0.9375) return { phase: normalized, name: 'Waning Crescent', emoji: '🌘' }
  return { phase: normalized, name: 'New Moon', emoji: '🌑' }
}

// ─── Calendar Helpers ─────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function dateToString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const EVENT_ICONS: Record<string, typeof Moon> = {
  eclipse: Eclipse,
  meteor: Sparkles,
  fullmoon: Moon,
  solstice: Sun,
}

const EVENT_COLORS: Record<string, string> = {
  eclipse: 'text-amber-400',
  meteor: 'text-cyan-400',
  fullmoon: 'text-slate-300',
  solstice: 'text-orange-400',
}

// ─── Mini Calendar Component ──────────────────────────────
function MiniCalendar({ year, month, label }: { year: number; month: number; label: string }) {
  const today = new Date()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  return (
    <div className="bg-[#030712] border border-[#1E293B] rounded-xl p-3">
      <p className="text-xs text-[#94A3B8] text-center mb-2 font-medium">{label}</p>
      <p className="text-sm font-heading font-bold text-center mb-2">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] text-[#94A3B8]">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
          return (
            <span
              key={day}
              className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${
                isToday ? 'bg-[#4F46E5] text-white font-bold' : 'text-[#E2E8F0]'
              }`}
            >
              {day}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Calendar Page ───────────────────────────────────
export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const goToToday = useCallback(() => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }, [today])

  const prevMonth = useCallback(() => {
    if (month === 0) {
      setMonth(11)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }, [month])

  const nextMonth = useCallback(() => {
    if (month === 11) {
      setMonth(0)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }, [month])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Events map for quick lookup
  const eventsMap = useMemo(() => {
    const map: Record<string, AstroEvent[]> = {}
    ASTRO_EVENTS.forEach((event) => {
      if (!map[event.date]) map[event.date] = []
      map[event.date].push(event)
    })
    return map
  }, [])

  // Calendar grid rows
  const calendarRows = useMemo(() => {
    const rows: { day: number | null; dateStr: string; weekNum: number | null }[][] = []
    let currentRow: typeof rows[0] = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      currentRow.push({ day: null, dateStr: '', weekNum: null })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = dateToString(year, month, day)
      const weekNum = currentRow.length === 0 || day === 1 ? getWeekNumber(new Date(year, month, day)) : null
      currentRow.push({ day, dateStr, weekNum })

      if (currentRow.length === 7) {
        rows.push(currentRow)
        currentRow = []
      }
    }

    // Fill remaining cells
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push({ day: null, dateStr: '', weekNum: null })
      }
      rows.push(currentRow)
    }

    return rows
  }, [year, month, daysInMonth, firstDay])

  // Previous and next month for mini calendars
  const prevMonthDate = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
  const nextMonthDate = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-4">
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            Monthly Calendar
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Navigate months, view moon phases, and track astronomical events like eclipses and meteor showers.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg border border-[#1E293B] hover:border-[#4F46E5] hover:bg-[#4F46E5]/10 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-[#0F172A] border border-[#1E293B] rounded-lg px-3 py-2 text-sm font-heading font-bold focus:outline-none focus:border-[#4F46E5] appearance-none cursor-pointer"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-[#0F172A] border border-[#1E293B] rounded-lg px-3 py-2 text-sm font-heading font-bold focus:outline-none focus:border-[#4F46E5] appearance-none cursor-pointer"
              >
                {Array.from({ length: 21 }, (_, i) => 2020 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 rounded-lg border border-[#1E293B] hover:border-[#4F46E5] hover:bg-[#4F46E5]/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Go to Today
          </button>
        </div>

        {/* Main Calendar Grid */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden mb-8">
          {/* Day headers */}
          <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-[#1E293B]">
            <div className="p-2 text-center text-xs text-[#94A3B8] font-medium">Wk</div>
            {DAY_NAMES.map((day) => (
              <div key={day} className="p-2 text-center text-xs text-[#94A3B8] font-medium border-l border-[#1E293B]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          {calendarRows.map((row, rowIdx) => {
            const weekNum = row.find(c => c.weekNum !== null)?.weekNum
            return (
              <div key={rowIdx} className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-[#1E293B] last:border-b-0">
                <div className="p-2 flex items-start justify-center text-xs text-[#94A3B8] font-mono">
                  {weekNum ?? ''}
                </div>
                {row.map((cell, cellIdx) => {
                  if (cell.day === null) {
                    return <div key={cellIdx} className="min-h-[80px] sm:min-h-[100px] border-l border-[#1E293B] bg-[#030712]/30" />
                  }

                  const isToday =
                    today.getFullYear() === year &&
                    today.getMonth() === month &&
                    today.getDate() === cell.day
                  const moonPhase = getMoonPhase(new Date(year, month, cell.day))
                  const events = eventsMap[cell.dateStr] || []

                  return (
                    <div
                      key={cellIdx}
                      className={`min-h-[80px] sm:min-h-[100px] border-l border-[#1E293B] p-1.5 transition-colors ${
                        isToday ? 'bg-[#4F46E5]/10 ring-1 ring-inset ring-[#4F46E5]/30' : 'hover:bg-[#0F172A]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                            isToday ? 'bg-[#4F46E5] text-white font-bold' : ''
                          }`}
                        >
                          {cell.day}
                        </span>
                        <span className="text-[11px] opacity-60" title={moonPhase.name}>
                          {moonPhase.emoji}
                        </span>
                      </div>

                      {events.map((event, eIdx) => {
                        const Icon = EVENT_ICONS[event.type] || Star
                        const color = EVENT_COLORS[event.type] || 'text-[#94A3B8]'
                        return (
                          <div
                            key={eIdx}
                            className={`flex items-center gap-1 mt-0.5 group relative`}
                            title={event.title}
                          >
                            <Icon className={`w-3 h-3 shrink-0 ${color}`} />
                            <span className="text-[10px] sm:text-xs text-[#94A3B8] truncate leading-tight">
                              {event.title.length > 20 ? event.title.slice(0, 20) + '...' : event.title}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <AdBanner />

        {/* Mini 3-Month View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MiniCalendar
            year={prevMonthDate.year}
            month={prevMonthDate.month}
            label="Previous"
          />
          <MiniCalendar year={year} month={month} label="Current" />
          <MiniCalendar
            year={nextMonthDate.year}
            month={nextMonthDate.month}
            label="Next"
          />
        </div>

        {/* Events this month */}
        {(() => {
          const monthEvents = ASTRO_EVENTS.filter((e) => {
            const [ey, em] = e.date.split('-').map(Number)
            return ey === year && em === month + 1
          })
          if (monthEvents.length === 0) return null

          return (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-4">
                Events in {MONTH_NAMES[month]} {year}
              </h2>
              <div className="space-y-3">
                {monthEvents.map((event, i) => {
                  const Icon = EVENT_ICONS[event.type] || Star
                  const color = EVENT_COLORS[event.type] || 'text-[#94A3B8]'
                  const day = parseInt(event.date.split('-')[2], 10)
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#030712] border border-[#1E293B]">
                      <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {MONTH_NAMES[month]} {day}, {year}
                        </p>
                      </div>
                      <span className="text-xs text-[#94A3B8] capitalize px-2 py-1 rounded-md bg-[#0F172A] border border-[#1E293B]">
                        {event.type === 'fullmoon' ? 'Full Moon' : event.type}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5"><Eclipse className="w-3.5 h-3.5 text-amber-400" /> Eclipse</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Meteor Shower</span>
          <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-slate-300" /> Full Moon</span>
          <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-orange-400" /> Solstice / Equinox</span>
          <span className="flex items-center gap-1.5"><CircleDot className="w-3.5 h-3.5 text-[#4F46E5]" /> Today</span>
        </div>
      </div>
    </div>
  )
}
