import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Did You Know — Facts, Quizzes & Trivia | ZAXISE',
  description:
    'Explore 40,000+ fascinating facts across 40 categories. Daily trivia, interactive quizzes, fact chains, and surprise-me cards — learn something new every day.',
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
      <div className="facts-section">
        {children}
      </div>
    </Suspense>
  )
}
