import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Time Zone Map — Interactive UTC Offset Explorer | DateAndTimezone',
  description:
    'Interactive world time zone map showing all UTC offsets from UTC-12 to UTC+14. Click any timezone band to see countries and cities. Live clocks for every offset.',
  keywords: [
    'timezone map',
    'world time zones',
    'UTC offset map',
    'interactive timezone',
    'time zone countries',
    'DateAndTimezone',
  ],
  openGraph: {
    title: 'World Time Zone Map — DateAndTimezone',
    description:
      'Interactive world time zone map with live clocks for every UTC offset. Explore countries and cities across all time zones.',
    type: 'website',
  },
}

export default function TimezoneMapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
