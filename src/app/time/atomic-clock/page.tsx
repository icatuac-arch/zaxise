'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Cpu,
  History,
  Wifi,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Atom,
  Satellite,
  Globe,
  Timer,
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Timeline of Timekeeping ──────────────────────────────
interface TimelineEntry {
  year: string
  title: string
  description: string
  accuracy: string
}

const TIMELINE: TimelineEntry[] = [
  {
    year: '~3500 BC',
    title: 'Sundials',
    description: 'Ancient Egyptians and Babylonians used shadow-casting obelisks and sundials to track the movement of the sun across the sky.',
    accuracy: '~15 minutes',
  },
  {
    year: '~1300s',
    title: 'Mechanical Clocks',
    description: 'Weight-driven clocks appeared in European church towers, using escapement mechanisms to regulate timekeeping.',
    accuracy: '~15 minutes/day',
  },
  {
    year: '1656',
    title: 'Pendulum Clock',
    description: 'Christiaan Huygens built the first pendulum clock, vastly improving accuracy by using the regular swing of a pendulum.',
    accuracy: '~15 seconds/day',
  },
  {
    year: '1927',
    title: 'Quartz Clock',
    description: 'Warren Marrison and J.W. Horton built the first quartz clock at Bell Labs, using the piezoelectric vibration of quartz crystals.',
    accuracy: '~1 second/year',
  },
  {
    year: '1955',
    title: 'Atomic Clock (Cesium)',
    description: 'Louis Essen and Jack Parry built the first practical cesium atomic clock at the National Physical Laboratory, UK.',
    accuracy: '1 second in 300 million years',
  },
  {
    year: '2015',
    title: 'Optical Lattice Clock',
    description: 'JILA/NIST developed optical lattice clocks using strontium atoms trapped in laser light, achieving unprecedented accuracy.',
    accuracy: '1 second in 15 billion years',
  },
]

// ─── Time Standard Explanations ───────────────────────────
interface TimeStandard {
  name: string
  fullName: string
  description: string
}

const TIME_STANDARDS: TimeStandard[] = [
  {
    name: 'UTC',
    fullName: 'Coordinated Universal Time',
    description: 'The primary time standard worldwide. UTC is based on TAI but includes leap seconds to stay within 0.9 seconds of Earth\'s rotation (UT1). Used for civil timekeeping, aviation, and the internet.',
  },
  {
    name: 'TAI',
    fullName: 'International Atomic Time',
    description: 'A weighted average of over 450 atomic clocks worldwide. TAI runs continuously without leap seconds, making it currently 37 seconds ahead of UTC. Used as the basis for UTC.',
  },
  {
    name: 'GPS Time',
    fullName: 'GPS Time',
    description: 'Used by the Global Positioning System. GPS time was synchronized with UTC on January 6, 1980 and does not include leap seconds. It is currently 18 seconds ahead of UTC.',
  },
]

function formatMs(ms: number): string {
  return ms.toString().padStart(3, '0')
}

export default function AtomicClockPage() {
  const [time, setTime] = useState<Date | null>(null)
  const [ms, setMs] = useState(0)
  const [pageLoadTime] = useState(() => Date.now())
  const [performanceOffset, setPerformanceOffset] = useState<number | null>(null)
  const animRef = useRef<number | undefined>(undefined)

  // High-precision time update using requestAnimationFrame
  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(now)
      setMs(now.getMilliseconds())
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    // Calculate performance timing offset
    const perfNow = performance.now()
    const dateNow = Date.now()
    const perfOrigin = performance.timeOrigin
    const diff = dateNow - (perfOrigin + perfNow)
    setPerformanceOffset(diff)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  if (!time) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-pulse text-[#94A3B8]">Loading clock...</div>
      </div>
    )
  }

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const timeStr = time.toLocaleTimeString('en-US', { hour12: false })
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone
  const tzOffset = -time.getTimezoneOffset()
  const tzSign = tzOffset >= 0 ? '+' : '-'
  const tzHours = Math.floor(Math.abs(tzOffset) / 60)
  const tzMins = Math.abs(tzOffset) % 60

  // UTC time
  const utcStr = time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-4">
            <Atom className="w-4 h-4" />
            Precision Time
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            Atomic Clock &mdash; Exact Time
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Displaying your device&apos;s time synced via NTP. Learn how atomic clocks define the second.
          </p>
        </div>

        {/* Main Clock Display */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 mb-8 text-center">
          <div className="mb-4">
            <p className="font-mono text-6xl sm:text-8xl font-bold tracking-wider text-[#E2E8F0]">
              {timeStr}
              <span className="text-3xl sm:text-4xl text-[#06B6D4]">.{formatMs(ms)}</span>
            </p>
          </div>
          <p className="text-lg text-[#94A3B8] mb-2">{dateStr}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#4F46E5]" />
              {tzName}
            </span>
            <span className="font-mono">UTC{tzSign}{tzHours.toString().padStart(2, '0')}:{tzMins.toString().padStart(2, '0')}</span>
          </div>

          {/* UTC row */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#030712] border border-[#1E293B]">
            <span className="text-xs text-[#94A3B8]">UTC:</span>
            <span className="font-mono text-lg text-[#06B6D4]">{utcStr}.{formatMs(ms)}</span>
          </div>

          {/* Analog-style progress bars */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
            <div>
              <div className="h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4F46E5] transition-all duration-1000"
                  style={{ width: `${(hours / 24) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Hours ({hours}/24)</p>
            </div>
            <div>
              <div className="h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#06B6D4] transition-all duration-1000"
                  style={{ width: `${(minutes / 60) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Minutes ({minutes}/60)</p>
            </div>
            <div>
              <div className="h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-100"
                  style={{ width: `${(seconds / 60) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Seconds ({seconds}/60)</p>
            </div>
          </div>
        </div>

        {/* Is My Clock Accurate? */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 mb-8">
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Is My Clock Accurate?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#030712] border border-[#1E293B]">
              <p className="text-xs text-[#94A3B8] mb-1">Date.now() vs performance.timeOrigin</p>
              <p className="font-mono text-lg">
                {performanceOffset !== null ? (
                  <span className={Math.abs(performanceOffset) < 5 ? 'text-emerald-400' : 'text-amber-400'}>
                    {performanceOffset > 0 ? '+' : ''}{performanceOffset.toFixed(1)} ms
                  </span>
                ) : (
                  <span className="text-[#94A3B8]">Measuring...</span>
                )}
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">
                {performanceOffset !== null && Math.abs(performanceOffset) < 5 ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Your browser timing APIs are consistent
                  </span>
                ) : performanceOffset !== null ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    Minor discrepancy detected
                  </span>
                ) : null}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#030712] border border-[#1E293B]">
              <p className="text-xs text-[#94A3B8] mb-1">Page open duration</p>
              <p className="font-mono text-lg text-[#06B6D4]">
                {((Date.now() - pageLoadTime) / 1000).toFixed(1)}s
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">
                Your device clock is synced via your OS, which uses NTP to stay accurate within ~10-100ms of atomic time.
              </p>
            </div>
          </div>
        </div>

        <AdBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How Atomic Clocks Work */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#4F46E5]" />
              How Atomic Clocks Work
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#4F46E5]/20">
                <p className="font-mono text-center text-2xl font-bold text-[#E2E8F0] mb-1">
                  9,192,631,770
                </p>
                <p className="text-center text-sm text-[#94A3B8]">
                  vibrations of a Cesium-133 atom = 1 second
                </p>
              </div>

              <div className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
                <div className="flex gap-3 p-3 rounded-lg bg-[#030712] border border-[#1E293B]">
                  <Atom className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <p>
                    Cesium atomic clocks work by exposing cesium-133 atoms to microwave radiation at
                    exactly 9,192,631,770 Hz. When the frequency is right, the atoms change energy
                    states, providing an incredibly precise frequency standard.
                  </p>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-[#030712] border border-[#1E293B]">
                  <Timer className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
                  <p>
                    Since 1967, the SI second has been defined as exactly 9,192,631,770 periods of
                    radiation from the cesium-133 atom. Modern cesium clocks are accurate to about
                    <strong className="text-[#E2E8F0]"> 1 second in 300 million years</strong>.
                  </p>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-[#030712] border border-[#1E293B]">
                  <Satellite className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    Every GPS satellite carries multiple atomic clocks. GPS relies on precise timing
                    to calculate your position &mdash; a clock error of just 1 microsecond would cause
                    a position error of about 300 meters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NTP Explainer */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-[#06B6D4]" />
              NTP &mdash; Network Time Protocol
            </h2>

            <div className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
              <p>
                NTP is the protocol that keeps your computer, phone, and every server on the internet
                synchronized to within milliseconds of atomic time.
              </p>
              <div className="p-4 rounded-xl bg-[#030712] border border-[#1E293B]">
                <p className="font-heading font-bold text-[#E2E8F0] mb-2">How NTP works:</p>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Your device sends a timestamp to an NTP server</li>
                  <li>The server responds with its own atomic-referenced time</li>
                  <li>Your device calculates the network delay round-trip</li>
                  <li>It adjusts your clock to compensate for the delay</li>
                  <li>This process repeats periodically to stay accurate</li>
                </ol>
              </div>
              <p>
                NTP uses a hierarchical system of &ldquo;strata.&rdquo; Stratum 0 are atomic clocks and GPS
                receivers. Stratum 1 servers connect directly to these. Most devices use
                Stratum 2 or 3 servers, achieving accuracy within <strong className="text-[#E2E8F0]">10-100 milliseconds</strong>.
              </p>
            </div>

            {/* UTC vs TAI vs GPS */}
            <h3 className="font-heading text-lg font-bold mt-6 mb-3">UTC vs TAI vs GPS Time</h3>
            <div className="space-y-3">
              {TIME_STANDARDS.map((std) => (
                <div key={std.name} className="p-4 rounded-xl bg-[#030712] border border-[#1E293B]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[#4F46E5]">{std.name}</span>
                    <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-xs text-[#94A3B8]">{std.fullName}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{std.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline of Timekeeping */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 mt-8">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-[#4F46E5]" />
            Timeline of Timekeeping
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5] via-[#06B6D4] to-[#4F46E5] opacity-30" />

            <div className="space-y-6">
              {TIMELINE.map((entry, i) => (
                <div key={i} className="relative pl-16">
                  {/* Dot */}
                  <div className="absolute left-4 top-3 w-5 h-5 rounded-full bg-[#0F172A] border-2 border-[#4F46E5] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#030712] border border-[#1E293B] hover:border-[#4F46E5]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <span className="font-mono text-sm text-[#06B6D4] mr-3">{entry.year}</span>
                        <span className="font-heading font-bold text-lg">{entry.title}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8] bg-[#0F172A] px-2 py-1 rounded-md border border-[#1E293B] whitespace-nowrap">
                        Accuracy: {entry.accuracy}
                      </span>
                    </div>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
