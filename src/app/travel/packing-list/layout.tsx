import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Packing List Generator — WorldTourly',
  description:
    'Generate a customized packing list based on your destination, season, trip type, and travel companions. Check items off, save progress, and print or share your list.',
}

export default function PackingListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
