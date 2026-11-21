import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Download Maps for Offline Use — Zaxise',
  description:
    'Step-by-step guide to downloading offline maps for Google Maps, Apple Maps, Maps.me, and OsmAnd. City-by-city download planner, storage calculator, and printable emergency cards.',
}

export default function DownloadMapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
