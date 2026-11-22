import { Suspense } from 'react'

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="calc-section">
      <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading calculator...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
