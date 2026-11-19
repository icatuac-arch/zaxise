import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plan by How You Travel — WorldTourly',
  description:
    'Persona-based travel guides for solo travelers, couples, families, elderly travelers, budget backpackers, and luxury seekers across Japan, Italy, Thailand, France, and India.',
  openGraph: {
    title: 'Plan by How You Travel — WorldTourly',
    description:
      'Get travel advice tailored to YOUR travel style. Solo, couple, family, accessibility, budget, or luxury — we have you covered.',
  },
}

export default function TravelByTypeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
