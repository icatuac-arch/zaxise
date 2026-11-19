import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Time to Visit — WorldTourly',
  description:
    'Monthly weather charts, best seasons, packing suggestions, and travel warnings for every WorldTourly destination.',
}

export default function WeatherGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
