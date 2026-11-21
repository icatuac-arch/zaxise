import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local Deals & Money-Saving Secrets — Zaxise',
  description:
    'Insider money-saving tips, scam alerts, price comparisons, tipping guides, and haggling advice for Japan, Italy, Thailand, France, and India.',
  openGraph: {
    title: 'Local Deals & Money-Saving Secrets — Zaxise',
    description:
      'The stuff guidebooks never tell you. Real money-saving secrets from locals in every destination.',
  },
}

export default function LocalDealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
