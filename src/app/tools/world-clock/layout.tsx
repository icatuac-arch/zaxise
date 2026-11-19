import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Clock & Time Zone Converter',
  description: 'Live world clocks, timezone converter, and meeting planner. Compare times across cities instantly in your browser.',
  keywords: ['world clock', 'time zone converter', 'meeting planner', 'timezone comparison', 'live clock', 'India time', 'IST to EST'],
  openGraph: {
    title: 'World Clock & Time Zone Converter',
    description: 'Live world clocks, timezone converter, and meeting planner. Compare times across cities instantly in your browser.',
    url: 'https://indianprograms.com/tools/world-clock',
    siteName: 'IndianPrograms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Clock & Time Zone Converter',
    description: 'Live world clocks, timezone converter, and meeting planner. Compare times across cities instantly in your browser.',
  },
}

export default function WorldClockLayout({ children }: { children: React.ReactNode }) {
  return children
}
