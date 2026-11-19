'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Must match navGroups in Navbar.tsx exactly
const GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Clocks & Timers",
    links: [
      { href: "/world-clock", label: "World Clock" },
      { href: "/alarm", label: "Alarm" },
      { href: "/timer", label: "Timer" },
      { href: "/stopwatch", label: "Stopwatch" },
      { href: "/pomodoro", label: "Pomodoro" },
      { href: "/countdown", label: "Countdown" },
      { href: "/atomic-clock", label: "Exact Time" },
    ],
  },
  {
    label: "Time Zones",
    links: [
      { href: "/timezone-map", label: "TZ Map" },
      { href: "/timezone-compare", label: "TZ Compare" },
      { href: "/meeting-planner", label: "Meeting Planner" },
      { href: "/call-planner", label: "Call Planner" },
      { href: "/day-night-map", label: "Day / Night" },
      { href: "/sunrise-sunset", label: "Sunrise & Sunset" },
      { href: "/daylight-hours", label: "Daylight Hours" },
      { href: "/weather", label: "Weather" },
      { href: "/continents", label: "Countries" },
      { href: "/flight-time", label: "Flight Time" },
    ],
  },
  {
    label: "Dates & Calculators",
    links: [
      { href: "/calendar", label: "Calendar" },
      { href: "/date-difference", label: "Date Difference" },
      { href: "/age-calculator", label: "Age Calculator" },
      { href: "/week-number", label: "Week Number" },
      { href: "/leap-year", label: "Leap Year" },
      { href: "/unix-timestamp", label: "Unix Timestamp" },
      { href: "/julian-date", label: "Julian Date" },
      { href: "/roman-numerals", label: "Roman Numerals" },
      { href: "/population-clock", label: "Population Clock" },
    ],
  },
  {
    label: "Astronomy",
    links: [
      { href: "/astronomy", label: "Astronomy" },
      { href: "/astro-calendar", label: "Sky Calendar" },
      { href: "/solar-system", label: "Solar System" },
      { href: "/full-moon", label: "Full Moon" },
      { href: "/eclipses", label: "Eclipses" },
      { href: "/meteor-showers", label: "Meteor Showers" },
      { href: "/constellations", label: "Constellations" },
      { href: "/dark-sky", label: "Dark Sky" },
      { href: "/solar-weather", label: "Aurora & Solar" },
      { href: "/planetary-hours", label: "Planetary Hours" },
      { href: "/zodiac", label: "Zodiac" },
    ],
  },
  {
    label: "Space",
    links: [
      { href: "/news", label: "Space News" },
      { href: "/launches", label: "Launches" },
      { href: "/iss-tracker", label: "ISS Tracker" },
      { href: "/iss-passes", label: "See ISS" },
      { href: "/space-missions", label: "Missions" },
      { href: "/space-timeline", label: "Timeline" },
      { href: "/satellites", label: "Satellites" },
      { href: "/voyager-tracker", label: "Voyager" },
      { href: "/space-gallery", label: "Gallery" },
      { href: "/space-sounds", label: "Sounds" },
      { href: "/space-units", label: "Units" },
    ],
  },
  {
    label: "Fun & Quizzes",
    links: [
      { href: "/quiz", label: "Quizzes" },
      { href: "/timezone-quiz", label: "TZ Quiz" },
      { href: "/planet-age", label: "Planet Age" },
      { href: "/speed-of-light", label: "Light Speed" },
      { href: "/doomsday-clock", label: "Doomsday Clock" },
      { href: "/this-day-in-space", label: "Today in Space" },
      { href: "/space-industry", label: "Careers" },
      { href: "/time-capsule", label: "Time Capsule" },
      { href: "/share-time", label: "Share Time" },
      { href: "/embed", label: "Embed Widget" },
    ],
  },
]

/** Find which group the current path belongs to */
function findGroup(pathname: string) {
  return GROUPS.find((g) => g.links.some((l) => l.href === pathname)) ?? null
}

export default function ToolTabs() {
  const pathname = usePathname()
  const group = findGroup(pathname)

  if (!group) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {group.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-dark-bg/80 border border-card-border/40">
        {group.links.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-muted hover:bg-card-bg/80 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
