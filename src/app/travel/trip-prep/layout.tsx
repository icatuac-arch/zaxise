import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trip Preparation Masterclass — Zaxise',
  description:
    'The ultimate pre-trip preparation guide. Phone & connectivity, food prep for vegetarian/vegan/halal travelers, traveling with kids, offline downloads, money & cards, health, and airport tips.',
}

export default function TripPrepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
