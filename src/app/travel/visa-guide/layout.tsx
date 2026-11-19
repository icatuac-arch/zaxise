import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Requirements Guide — WorldTourly',
  description:
    'Check visa requirements, costs, and durations for US, UK, and Indian passport holders across all WorldTourly destinations.',
}

export default function VisaGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
