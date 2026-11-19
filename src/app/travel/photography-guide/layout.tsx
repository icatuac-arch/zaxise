import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Photography Guide — WorldTourly',
  description:
    'Photo spots, golden hour tips, drone regulations, ethical photography guidelines, and gear advice for every destination.',
}

export default function PhotographyGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
