import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Language & Communication Toolkit — Zaxise',
  description:
    'Your complete travel communication survival guide. Essential phrases in 15 languages, translation tools, emergency communication, restaurant survival tips, and more. Never be lost for words abroad.',
  keywords: [
    'travel phrases',
    'language toolkit',
    'translation apps',
    'travel communication',
    'essential phrases',
    'emergency phrases',
    'restaurant ordering abroad',
    'travel translator',
  ],
}

export default function LanguageToolkitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
