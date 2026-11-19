import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Responsible & Volunteer Travel Guide — WorldTourly',
  description:
    'Ethical tourism principles, volunteer opportunities, wildlife ethics, and sustainable travel tips. Travel responsibly with WorldTourly.',
}

export default function ResponsibleTravelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
