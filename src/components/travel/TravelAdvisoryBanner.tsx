'use client'

import { useState, useEffect } from 'react'
import type { TravelAdvisory } from '@/data/travel/advisories'

interface TravelAdvisoryBannerProps {
  advisory: TravelAdvisory | undefined
  countryName: string
}

const LEVEL_CONFIG = {
  1: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: '\u2705',
    accent: 'bg-green-100',
  },
  2: {
    bg: 'bg-yellow-50 border-yellow-300',
    text: 'text-yellow-900',
    icon: '\u26A0\uFE0F',
    accent: 'bg-yellow-100',
  },
  3: {
    bg: 'bg-orange-50 border-orange-300',
    text: 'text-orange-900',
    icon: '\uD83D\uDFE0',
    accent: 'bg-orange-100',
  },
  4: {
    bg: 'bg-red-50 border-red-400',
    text: 'text-red-900',
    icon: '\uD83D\uDD34',
    accent: 'bg-red-100',
  },
} as const

export default function TravelAdvisoryBanner({ advisory, countryName }: TravelAdvisoryBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    if (advisory) {
      const key = `advisory-dismissed-${advisory.country}`
      if (sessionStorage.getItem(key) === 'true') {
        setDismissed(true)
      }
    }
  }, [advisory])

  if (!advisory || !hydrated || dismissed) return null

  const config = LEVEL_CONFIG[advisory.level]

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem(`advisory-dismissed-${advisory.country}`, 'true')
  }

  return (
    <div className={`relative border-b ${config.bg} ${config.text}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
            {config.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${advisory.level >= 3 ? 'text-base' : ''}`}>
              Level {advisory.level}: {advisory.label}
              {advisory.level >= 3 && ` \u2014 ${countryName}`}
            </p>
            {advisory.level >= 2 && (
              <p className="text-sm mt-0.5 opacity-90">{advisory.summary}</p>
            )}
            <p className="text-xs mt-1 opacity-70">
              Source:{' '}
              <a
                href={advisory.source}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100"
              >
                US State Department
              </a>
              {' \u00B7 '}
              Last updated {advisory.lastUpdated}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 p-1 rounded-full hover:${config.accent} transition-colors`}
            aria-label="Dismiss travel advisory"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
