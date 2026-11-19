import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Travel Tips & Recommendations — WorldTourly',
  description:
    'Expert travel tips: best times to visit, budget hacks, first-timer essentials, and insider recommendations for Japan, Italy, Thailand, France, and India.',
  openGraph: {
    title: 'Smart Travel Tips & Recommendations — WorldTourly',
    description:
      'Expert travel tips: best times to visit, budget hacks, first-timer essentials, and insider recommendations.',
  },
}

export default function SmartTipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
