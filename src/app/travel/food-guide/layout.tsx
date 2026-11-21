import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Food Guide — Zaxise',
  description:
    'Discover local dishes, restaurant recommendations, vegetarian and vegan options, halal dining, food etiquette, and street food safety tips worldwide.',
}

export default function FoodGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
