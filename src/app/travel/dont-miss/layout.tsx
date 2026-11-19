import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Don't Miss — Experiences You'll Regret Skipping — WorldTourly",
  description:
    'Not just attractions — unforgettable EXPERIENCES unique to Japan, Italy, Thailand, France, and India. Advice from a well-traveled friend.',
  openGraph: {
    title: "Don't Miss — Experiences You'll Regret Skipping",
    description:
      'The experiences that make a trip unforgettable. Insider tips on timing, cost, and how to make each one even better.',
  },
}

export default function DontMissLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
