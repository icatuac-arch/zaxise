import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Buying Checklist — Step-by-Step Guide | RentOrBuy',
  description:
    'Interactive home buying checklist with 37 steps across 8 phases. Track your progress from saving for a down payment to getting your keys.',
  keywords:
    'home buying checklist, first time home buyer checklist, house buying steps, home purchase checklist',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
