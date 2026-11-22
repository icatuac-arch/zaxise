import { Suspense } from 'react'

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
      <div className="time-section">
        {children}
      </div>
    </Suspense>
  )
}
