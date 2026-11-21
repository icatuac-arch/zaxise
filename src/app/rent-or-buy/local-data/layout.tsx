import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local Housing Market Data by State | RentOrBuy',
  description:
    'Compare home prices, property tax rates, and affordability across all 50 US states. Find the best markets for first-time home buyers.',
  keywords:
    'housing market data, home prices by state, property tax rates by state, best states to buy a home',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
