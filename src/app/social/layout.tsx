import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SocialMarketly — Free Social Media Management | ZAXISE',
  description:
    'Schedule posts, track analytics, and grow your audience across every platform — completely free. No credit card, no trial period.',
}

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="social-section">
      <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
