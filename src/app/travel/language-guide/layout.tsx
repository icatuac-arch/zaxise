import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Language & Communication Guide — Zaxise',
  description:
    'Essential phrases, translation apps, SIM card tips, and communication guidance for traveling in Japan, Italy, Thailand, France, and India.',
}

export default function LanguageGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
