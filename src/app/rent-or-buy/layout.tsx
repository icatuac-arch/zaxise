import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rent or Buy Calculator — Housing Decision Tool | ZAXISE',
  description:
    'Compare the true cost of renting vs. buying a home. Includes tax benefits, wealth building, opportunity cost, break-even analysis, and affordability checks.',
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rob-section">
      <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
