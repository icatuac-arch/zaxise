import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Safety Guide — WorldTourly',
  description:
    'Safety ratings, solo travel tips, common scams, and emergency numbers for every destination. Stay safe on your next trip with WorldTourly.',
}

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
