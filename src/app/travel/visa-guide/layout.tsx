import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Requirements Guide — Zaxise',
  description:
    'Check visa requirements, costs, and durations for US, UK, and Indian passport holders across all Zaxise destinations.',
}

export default function VisaGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
