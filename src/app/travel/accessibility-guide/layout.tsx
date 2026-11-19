import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessible Travel Guide — WorldTourly',
  description:
    'Wheelchair accessibility, family-friendly travel, elderly traveler tips, sensory-friendly guidance, and accessible transport options worldwide.',
}

export default function AccessibilityGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
