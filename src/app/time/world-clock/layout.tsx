import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Clock — DateAndTimezone',
  description:
    'Free world clock with live times for 30+ cities, timezone converter, meeting planner, calendar, countdown timers, date calculator, age calculator, sun & moon tracker, and more.',
  keywords: [
    'world clock',
    'timezone converter',
    'meeting planner',
    'date calculator',
    'age calculator',
    'countdown timer',
    'stopwatch',
    'unix timestamp',
    'sun and moon',
    'week number',
    'roman numerals',
    'international call planner',
    'DateAndTimezone',
  ],
  openGraph: {
    title: 'World Clock — DateAndTimezone',
    description:
      'The most comprehensive free time tools on the internet. World clock, timezone converter, calendars, calculators, and more.',
    type: 'website',
  },
}

export default function WorldClockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
