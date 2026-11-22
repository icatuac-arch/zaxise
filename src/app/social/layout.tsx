import { Suspense } from 'react'

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="social-section">
      <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
