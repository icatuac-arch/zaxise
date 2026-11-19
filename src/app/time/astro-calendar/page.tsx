'use client'

import { useState, useMemo } from 'react'
import {
  Sun,
  Moon,
  Star,
  Sparkles,
  Eye,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eclipse,
  Orbit,
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Event Types ───────────────────────────────────────────
type EventType = 'eclipse' | 'meteor' | 'fullmoon' | 'planet' | 'solstice'

interface AstroEvent {
  date: string // YYYY-MM-DD
  endDate?: string // for multi-day events
  title: string
  description: string
  type: EventType
  meta?: string
}

const TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Sun }
> = {
  eclipse: {
    label: 'Eclipse',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    icon: Eclipse,
  },
  meteor: {
    label: 'Meteor Shower',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    icon: Sparkles,
  },
  fullmoon: {
    label: 'Full Moon',
    color: 'text-slate-300',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20',
    icon: Moon,
  },
  planet: {
    label: 'Planet Event',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: Orbit,
  },
  solstice: {
    label: 'Equinox / Solstice',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    icon: Sun,
  },
}

// ─── All 2026 Events ──────────────────────────────────────
const EVENTS: AstroEvent[] = [
  // Equinoxes & Solstices
  { date: '2026-03-20', title: 'Vernal Equinox', description: 'Spring begins in Northern Hemisphere. Day and night are nearly equal in length worldwide.', type: 'solstice' },
  { date: '2026-06-21', title: 'Summer Solstice', description: 'Longest day in Northern Hemisphere. The Sun reaches its highest point in the sky.', type: 'solstice' },
  { date: '2026-09-22', title: 'Autumnal Equinox', description: 'Fall begins in Northern Hemisphere. Day and night are again nearly equal.', type: 'solstice' },
  { date: '2026-12-21', title: 'Winter Solstice', description: 'Shortest day in Northern Hemisphere. Marks the start of astronomical winter.', type: 'solstice' },

  // Eclipses
  { date: '2026-02-17', title: 'Annular Solar Eclipse', description: 'A "ring of fire" eclipse visible from southern South America, western and southern Africa, and Antarctica.', type: 'eclipse' },
  { date: '2026-03-03', title: 'Total Lunar Eclipse', description: 'The entire Moon passes through Earth\'s shadow. Visible from the Americas, Europe, and Africa.', type: 'eclipse' },
  { date: '2026-08-12', title: 'Total Solar Eclipse', description: 'The Moon completely covers the Sun. Path of totality crosses Arctic Russia, Greenland, Iceland, and Spain.', type: 'eclipse' },
  { date: '2026-08-28', title: 'Partial Lunar Eclipse', description: 'A portion of the Moon enters Earth\'s shadow. Visible from eastern Asia, Australia, and the Pacific.', type: 'eclipse' },

  // Meteor Showers
  { date: '2026-01-03', endDate: '2026-01-04', title: 'Quadrantids', description: 'One of the best annual meteor showers. Up to 120 meteors per hour at peak.', type: 'meteor', meta: 'ZHR 120' },
  { date: '2026-04-22', endDate: '2026-04-23', title: 'Lyrids', description: 'Medium-strength shower producing bright dust trails. Active since antiquity.', type: 'meteor', meta: 'ZHR 18' },
  { date: '2026-05-05', endDate: '2026-05-06', title: 'Eta Aquariids', description: 'Debris from Halley\'s Comet. Best viewed from southern latitudes near dawn.', type: 'meteor', meta: 'ZHR 50' },
  { date: '2026-07-30', endDate: '2026-07-31', title: 'Delta Aquariids', description: 'A moderate shower best seen from southern latitudes. Flat peak lasting several days.', type: 'meteor', meta: 'ZHR 20' },
  { date: '2026-08-12', endDate: '2026-08-13', title: 'Perseids', description: 'The most popular meteor shower. Bright, fast meteors with persistent trains.', type: 'meteor', meta: 'ZHR 100' },
  { date: '2026-10-08', endDate: '2026-10-09', title: 'Draconids', description: 'Usually modest but can produce occasional outbursts. Best viewed in the evening.', type: 'meteor', meta: 'ZHR 10' },
  { date: '2026-10-21', endDate: '2026-10-22', title: 'Orionids', description: 'Another shower from Halley\'s Comet debris. Fast meteors with fine trains.', type: 'meteor', meta: 'ZHR 20' },
  { date: '2026-11-05', endDate: '2026-11-12', title: 'Taurids', description: 'A long-lasting shower known for producing bright fireballs. Slow-moving meteors.', type: 'meteor', meta: 'ZHR 5' },
  { date: '2026-11-17', endDate: '2026-11-18', title: 'Leonids', description: 'Can produce spectacular meteor storms every 33 years. Fast, bright meteors.', type: 'meteor', meta: 'ZHR 15' },
  { date: '2026-12-13', endDate: '2026-12-14', title: 'Geminids', description: 'The king of meteor showers. Bright, intense, and reliable every December.', type: 'meteor', meta: 'ZHR 150' },
  { date: '2026-12-22', endDate: '2026-12-23', title: 'Ursids', description: 'A modest shower coinciding with the winter solstice. Occasional surprise outbursts.', type: 'meteor', meta: 'ZHR 10' },

  // Full Moons
  { date: '2026-01-03', title: 'Wolf Moon', description: 'January\'s full moon, named for howling wolves of midwinter.', type: 'fullmoon' },
  { date: '2026-02-01', title: 'Snow Moon', description: 'February\'s full moon, named for heavy snowfall typical of this month.', type: 'fullmoon' },
  { date: '2026-03-03', title: 'Worm Moon', description: 'March\'s full moon, heralding the thawing of ground and return of earthworms.', type: 'fullmoon' },
  { date: '2026-04-01', title: 'Pink Moon', description: 'April\'s full moon, named for the pink phlox wildflowers of early spring.', type: 'fullmoon' },
  { date: '2026-05-01', title: 'Flower Moon', description: 'May\'s full moon, celebrating the abundance of spring flowers.', type: 'fullmoon' },
  { date: '2026-05-31', title: 'Blue Moon', description: 'The rare second full moon in a calendar month. A "once in a Blue Moon" event.', type: 'fullmoon' },
  { date: '2026-06-29', title: 'Strawberry Moon', description: 'June\'s full moon, coinciding with the strawberry harvest season.', type: 'fullmoon' },
  { date: '2026-07-29', title: 'Buck Moon', description: 'July\'s full moon, when male deer begin to grow new antlers.', type: 'fullmoon' },
  { date: '2026-08-28', title: 'Sturgeon Moon', description: 'August\'s full moon, named for the abundant sturgeon in the Great Lakes.', type: 'fullmoon' },
  { date: '2026-09-26', title: 'Harvest Moon', description: 'The full moon closest to the autumnal equinox. Extra bright moonlight for farmers.', type: 'fullmoon' },
  { date: '2026-10-26', title: 'Hunter\'s Moon', description: 'October\'s full moon, traditionally a time for hunting before winter.', type: 'fullmoon' },
  { date: '2026-11-24', title: 'Beaver Moon', description: 'November\'s full moon, when beavers prepare their lodges for winter.', type: 'fullmoon' },
  { date: '2026-12-24', title: 'Cold Moon', description: 'December\'s full moon, coinciding with Christmas Eve this year.', type: 'fullmoon' },

  // Planet Events
  { date: '2026-01-15', title: 'Venus as Evening Star', description: 'Venus shines brilliantly in the western sky after sunset. Look for the brightest "star" in the evening.', type: 'planet' },
  { date: '2026-03-15', title: 'Jupiter Conjunction with Sun', description: 'Jupiter passes behind the Sun and becomes temporarily unobservable.', type: 'planet' },
  { date: '2026-05-15', title: 'Saturn Visible Before Dawn', description: 'Saturn rises in the pre-dawn sky, offering excellent viewing through telescopes.', type: 'planet' },
  { date: '2026-07-15', title: 'Mars Opposition', description: 'Mars is closest to Earth and at its brightest. The best time to observe the Red Planet all year.', type: 'planet' },
  { date: '2026-08-15', title: 'Venus as Morning Star', description: 'Venus transitions to the morning sky, rising before the Sun as the "morning star."', type: 'planet' },
  { date: '2026-10-15', title: 'Jupiter Opposition', description: 'Jupiter is closest to Earth and shines at its brightest. Visible all night long.', type: 'planet' },
  { date: '2026-12-15', title: 'Saturn in Evening Sky', description: 'Saturn is well-placed for evening observation with its beautiful ring system on display.', type: 'planet' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDate(start)
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end + 'T12:00:00')
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('en-US', { month: 'short' })} ${s.getDate()}-${e.getDate()}`
  }
  return `${formatDate(start)} - ${formatDate(end)}`
}

function generateICS(event: AstroEvent): string {
  const startDate = event.date.replace(/-/g, '')
  const endDateStr = event.endDate || event.date
  const endD = new Date(endDateStr + 'T12:00:00')
  endD.setDate(endD.getDate() + 1)
  const endDate = endD.toISOString().slice(0, 10).replace(/-/g, '')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DateAndTimezone//Astro Calendar//EN',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function downloadICS(event: AstroEvent) {
  const ics = generateICS(event)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AstroCalendarPage() {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all')
  const [showTimeline, setShowTimeline] = useState(false)

  const eventsForMonth = useMemo(() => {
    return EVENTS.filter((e) => {
      const month = new Date(e.date + 'T12:00:00').getMonth()
      const matchMonth = month === activeMonth
      const matchFilter = activeFilter === 'all' || e.type === activeFilter
      return matchMonth && matchFilter
    }).sort((a, b) => a.date.localeCompare(b.date))
  }, [activeMonth, activeFilter])

  const allFilteredEvents = useMemo(() => {
    if (activeFilter === 'all') return EVENTS
    return EVENTS.filter((e) => e.type === activeFilter)
  }, [activeFilter])

  // Count events by type per month for the month tabs
  const monthCounts = useMemo(() => {
    return MONTHS.map((_, i) => {
      return EVENTS.filter((e) => {
        const month = new Date(e.date + 'T12:00:00').getMonth()
        return month === i
      }).length
    })
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Celestial Events
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-3">
            2026 Astronomical Calendar
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Every eclipse, meteor shower, full moon, solstice, and planet event of 2026 in one page. Your complete stargazing guide.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(
            ([key, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={key}
                  onClick={() =>
                    setActiveFilter(activeFilter === key ? 'all' : key)
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeFilter === key || activeFilter === 'all'
                      ? `${config.bgColor} ${config.borderColor} ${config.color}`
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                  } hover:scale-105`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              )
            }
          )}
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="text-xs text-muted hover:text-slate-200 underline transition-colors"
            >
              Show all
            </button>
          )}
        </div>

        {/* Timeline Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
              showTimeline
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-card-bg border-card-border text-muted hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            {showTimeline ? 'Hide Timeline' : 'Show Year Timeline'}
          </button>
        </div>

        {/* Timeline View */}
        {showTimeline && (
          <div className="rounded-xl border border-card-border bg-card-bg p-5 mb-8 overflow-x-auto">
            <h3 className="font-heading text-sm font-semibold text-slate-100 mb-4">
              2026 at a Glance
            </h3>
            <div className="min-w-[800px]">
              {/* Month labels */}
              <div className="flex mb-2">
                {MONTH_ABBR.map((m, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs text-muted"
                  >
                    {m}
                  </div>
                ))}
              </div>
              {/* Timeline bar */}
              <div className="relative h-8 bg-slate-800/50 rounded-lg border border-card-border mb-1">
                {/* Month dividers */}
                {Array.from({ length: 11 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-card-border"
                    style={{ left: `${((i + 1) / 12) * 100}%` }}
                  />
                ))}
                {/* Event dots */}
                {allFilteredEvents.map((event, i) => {
                  const d = new Date(event.date + 'T12:00:00')
                  const dayOfYear =
                    Math.floor(
                      (d.getTime() -
                        new Date(2026, 0, 1).getTime()) /
                        86400000
                    ) + 1
                  const pct = (dayOfYear / 365) * 100
                  const config = TYPE_CONFIG[event.type]
                  return (
                    <div
                      key={i}
                      className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${config.bgColor} border ${config.borderColor} cursor-pointer hover:scale-150 transition-transform`}
                      style={{ left: `${pct}%` }}
                      title={`${event.title} — ${formatDate(event.date)}`}
                    />
                  )
                })}
              </div>
              {/* Type legend below timeline */}
              <div className="flex gap-4 mt-2 justify-center">
                {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(
                  ([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${config.bgColor} border ${config.borderColor}`}
                      />
                      <span className="text-xs text-muted">
                        {config.label}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Month Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() =>
                setActiveMonth((prev) => (prev === 0 ? 11 : prev - 1))
              }
              className="p-2 rounded-lg bg-card-bg border border-card-border text-muted hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-heading text-2xl font-bold text-slate-100">
              {MONTHS[activeMonth]} 2026
            </h2>
            <button
              onClick={() =>
                setActiveMonth((prev) => (prev === 11 ? 0 : prev + 1))
              }
              className="p-2 rounded-lg bg-card-bg border border-card-border text-muted hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {/* Month tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {MONTHS.map((month, i) => (
              <button
                key={month}
                onClick={() => setActiveMonth(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeMonth === i
                    ? 'bg-primary text-white'
                    : 'bg-card-bg border border-card-border text-muted hover:text-slate-200 hover:border-primary/30'
                }`}
              >
                <span>{MONTH_ABBR[i]}</span>
                {monthCounts[i] > 0 && (
                  <span
                    className={`ml-1.5 text-xs ${
                      activeMonth === i ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    ({monthCounts[i]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <AdBanner />

        {/* Events Grid */}
        {eventsForMonth.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {eventsForMonth.map((event, i) => {
              const config = TYPE_CONFIG[event.type]
              const Icon = config.icon
              return (
                <div
                  key={i}
                  className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-5 hover:scale-[1.01] transition-transform`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-slate-100">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-muted text-sm font-mono">
                            {formatDateRange(event.date, event.endDate)}
                          </span>
                          {event.meta && (
                            <span
                              className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.color}`}
                            >
                              {event.meta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.bgColor} border ${config.borderColor} ${config.color} flex-shrink-0`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                    {event.description}
                  </p>
                  <button
                    onClick={() => downloadICS(event)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-bg/50 border border-card-border text-muted hover:text-slate-200 text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Add to Calendar
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-card-border bg-card-bg p-12 text-center mb-8">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted text-lg">
              No{' '}
              {activeFilter !== 'all'
                ? TYPE_CONFIG[activeFilter].label.toLowerCase() + ' '
                : ''}
              events in {MONTHS[activeMonth]}
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-2 text-primary text-sm hover:underline"
              >
                Show all event types
              </button>
            )}
          </div>
        )}

        {/* Year Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(
            ([key, config]) => {
              const Icon = config.icon
              const count = EVENTS.filter((e) => e.type === key).length
              return (
                <button
                  key={key}
                  onClick={() =>
                    setActiveFilter(activeFilter === key ? 'all' : key)
                  }
                  className={`rounded-xl border p-4 text-center transition-all hover:scale-105 ${
                    activeFilter === key
                      ? `${config.borderColor} ${config.bgColor}`
                      : 'border-card-border bg-card-bg'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${config.color}`}
                  />
                  <p className="text-2xl font-bold text-slate-100 font-mono">
                    {count}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {config.label}s
                  </p>
                </button>
              )
            }
          )}
        </div>

        {/* Highlights */}
        <div className="rounded-xl border border-card-border bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
          <h2 className="font-heading text-xl font-semibold text-slate-100 mb-4">
            2026 Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Eclipse className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Total Solar Eclipse
                </h4>
                <p className="text-muted text-xs leading-relaxed">
                  August 12 brings a total solar eclipse visible from
                  Arctic Russia, Greenland, Iceland, and Spain. Mark your
                  calendar for one of the rarest astronomical sights.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Geminids Peak
                </h4>
                <p className="text-muted text-xs leading-relaxed">
                  December 13-14 brings the Geminids, the year&apos;s best
                  meteor shower with up to 150 meteors per hour under
                  dark skies. A perfect holiday light show.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-400/10 flex items-center justify-center flex-shrink-0">
                <Moon className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Blue Moon in May
                </h4>
                <p className="text-muted text-xs leading-relaxed">
                  May 31 features a Blue Moon, the second full moon in a
                  single month. A relatively rare event that won&apos;t
                  happen again for another 2-3 years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
