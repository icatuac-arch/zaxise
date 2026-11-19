import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Festivals & Events Calendar — WorldTourly',
  description:
    'Discover major festivals and events across Japan, Italy, Thailand, France, and India. Plan your trip around cherry blossoms, Carnival of Venice, Songkran, and more.',
}

export default function FestivalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
