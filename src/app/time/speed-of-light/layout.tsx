import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Speed of Light Calculator — Travel Time Between Celestial Bodies | DateAndTimezone',
  description:
    'Calculate how long light takes to travel any distance. Preset distances between Earth, Moon, Sun, Mars, Jupiter, Pluto, Proxima Centauri, and Andromeda Galaxy.',
  keywords: [
    'speed of light calculator',
    'light travel time',
    'distance to moon',
    'distance to sun',
    'light year calculator',
    'celestial distance',
    'DateAndTimezone',
  ],
  openGraph: {
    title: 'Speed of Light Calculator — DateAndTimezone',
    description:
      'How long does light take to reach Mars? The Moon? Proxima Centauri? Calculate light travel time for any distance.',
    type: 'website',
  },
}

export default function SpeedOfLightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
