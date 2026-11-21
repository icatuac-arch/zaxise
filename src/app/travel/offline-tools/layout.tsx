import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline Travel Tools — Zaxise',
  description:
    'Offline maps, translation apps, currency converters, emergency info cards, and packing checklists. Prepare for your trip with Zaxise.',
}

export default function OfflineToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
