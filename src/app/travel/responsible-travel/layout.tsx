import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Responsible & Volunteer Travel Guide — Zaxise',
  description:
    'Ethical tourism principles, volunteer opportunities, wildlife ethics, and sustainable travel tips. Travel responsibly with Zaxise.',
}

export default function ResponsibleTravelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
