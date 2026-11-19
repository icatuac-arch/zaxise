import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolPageWrapper from '@/components/tools/ToolPageWrapper'

export const metadata: Metadata = {
  title: {
    default: 'Free Online Tools',
    template: '%s | Zaxise Tools',
  },
  description: 'Free browser-based tools for images, PDFs, text, and developers. No uploads, no signups, 100% private.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper p-8 text-center text-muted">Loading tool...</div>}>
      <ToolPageWrapper>{children}</ToolPageWrapper>
    </Suspense>
  )
}
