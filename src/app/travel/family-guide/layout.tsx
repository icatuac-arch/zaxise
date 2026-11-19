import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Family Travel Guide — WorldTourly',
  description:
    'Family-friendly attractions, kid activities, age suitability tips, baby facilities, budget guidance, and packing lists for traveling with children.',
}

export default function FamilyGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
