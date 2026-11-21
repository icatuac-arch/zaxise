import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adventure & Activities Guide — Zaxise',
  description:
    'Hiking, diving, surfing, climbing, cycling, skiing, and more — difficulty ratings, best seasons, costs, and safety tips for adventure travelers.',
}

export default function AdventureGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
