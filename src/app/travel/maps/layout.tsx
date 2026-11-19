import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Maps — WorldTourly',
  description:
    'Explore destinations on interactive maps with color-coded attraction markers, city zoom, and category filters. Plan visually with WorldTourly.',
}

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
