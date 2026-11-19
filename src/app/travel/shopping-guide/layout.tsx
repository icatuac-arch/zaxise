import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Guide — WorldTourly',
  description:
    'Discover the best shopping destinations, local specialties, bargaining tips, tax refund info, and authenticity advice for travelers worldwide.',
}

export default function ShoppingGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
