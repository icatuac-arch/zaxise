import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atomic Clock — Exact Current Time with Milliseconds | DateAndTimezone',
  description:
    'See the exact current time with milliseconds. Learn how atomic clocks work, the history of timekeeping, and the difference between UTC, TAI, and GPS time.',
  keywords: [
    'atomic clock',
    'exact time',
    'current time milliseconds',
    'UTC time',
    'NTP',
    'cesium clock',
    'timekeeping history',
    'DateAndTimezone',
  ],
  openGraph: {
    title: 'Atomic Clock — Exact Time | DateAndTimezone',
    description:
      'Exact current time with milliseconds, atomic clock explainer, history of timekeeping, and UTC vs TAI vs GPS time.',
    type: 'website',
  },
}

export default function AtomicClockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
