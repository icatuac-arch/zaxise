import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DateZonely — World Clock, Astronomy & Space | ZAXISE',
  description:
    'World clocks, timezone converter, ISS tracker, eclipse calendar, sunrise/sunset times, astronomy tools, and live space data — all in one place.',
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
      <div className="time-section">
        {children}
      </div>
    </Suspense>
  )
}
