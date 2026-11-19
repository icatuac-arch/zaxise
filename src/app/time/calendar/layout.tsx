import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monthly Calendar with Moon Phases & Astronomical Events | DateAndTimezone',
  description:
    'Beautiful monthly calendar with moon phase icons, astronomical events, week numbers, and mini 3-month navigation. Track eclipses, meteor showers, and full moons.',
  keywords: [
    'monthly calendar',
    'moon phases',
    'astronomical events',
    'week numbers',
    'eclipse calendar',
    'meteor shower dates',
    'DateAndTimezone',
  ],
  openGraph: {
    title: 'Monthly Calendar — DateAndTimezone',
    description:
      'Monthly calendar with moon phases, astronomical events, week numbers, and mini 3-month view.',
    type: 'website',
  },
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
