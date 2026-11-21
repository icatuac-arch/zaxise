import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cultural Etiquette Guide — Zaxise',
  description:
    'Country-specific etiquette tips for dress code, dining, tipping, religious sites, photography, and bargaining across Japan, Italy, Thailand, France, and India.',
}

export default function EtiquetteGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
