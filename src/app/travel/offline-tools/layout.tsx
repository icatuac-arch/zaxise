import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline Travel Tools — WorldTourly',
  description:
    'Offline maps, translation apps, currency converters, emergency info cards, and packing checklists. Prepare for your trip with WorldTourly.',
}

export default function OfflineToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
