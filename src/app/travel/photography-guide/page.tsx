'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'
import type { Country } from '@/data/travel/destinations'

const DRONE_REGULATIONS: Record<string, { status: string; color: string; details: string[] }> = {
  japan: {
    status: 'Restricted',
    color: 'bg-amber-100 text-amber-800',
    details: [
      'Drones over 100g require registration with the Ministry of Land, Infrastructure, Transport and Tourism (MLIT).',
      'Flying is prohibited in DID (Densely Inhabited Districts), near airports, and above 150m without permission.',
      'Most tourist areas (temples, parks, urban centers) are no-fly zones.',
      'Permits take 10+ business days to process — plan well ahead.',
      'Night flying requires special approval.',
    ],
  },
  italy: {
    status: 'Restricted in Cities',
    color: 'bg-amber-100 text-amber-800',
    details: [
      'ENAC (Italian Civil Aviation Authority) regulates all drone flights.',
      'Registration and insurance are mandatory for all drones.',
      'Flying is banned over city centers, historical sites, crowds, and near airports.',
      'Rural and coastal areas offer more freedom but still require compliance.',
      'The D-Flight platform is required for online registration and flight authorization.',
    ],
  },
  thailand: {
    status: 'Permit Required',
    color: 'bg-orange-100 text-orange-800',
    details: [
      'All drones over 2kg must be registered with the CAAT (Civil Aviation Authority of Thailand) and NBTC.',
      'Drones under 2kg still require NBTC registration.',
      'Flying over people, government buildings, and national parks is prohibited.',
      'Maximum altitude is 90 meters (300 feet).',
      'Penalties for unregistered drone use can include fines up to 40,000 baht or imprisonment.',
    ],
  },
  france: {
    status: 'Strict',
    color: 'bg-red-100 text-red-800',
    details: [
      'All drones must be registered on the AlphaTango platform and operators must pass an online exam.',
      'Flying over Paris and most city centers is completely prohibited.',
      'National parks, beaches (during summer), and near airports are no-fly zones.',
      'Maximum altitude is 120 meters; visual line of sight required at all times.',
      'Geoportail map shows all restricted zones — check before every flight.',
    ],
  },
  india: {
    status: 'Mostly Banned for Foreigners',
    color: 'bg-red-100 text-red-800',
    details: [
      'Foreign nationals are currently prohibited from flying drones in India without special government permission.',
      'Indian citizens must register drones on the Digital Sky platform and obtain a Unique Identification Number (UIN).',
      'Flying near borders, military installations, and strategic locations is strictly prohibited.',
      'No-Permission-No-Takeoff (NPNT) compliance is mandatory for all registered drones.',
      'Penalties for unauthorized drone use include confiscation, fines, and potential criminal charges.',
    ],
  },
}

const GOLDEN_HOUR_TIPS: Record<string, { location: string; sunrise: string; sunset: string; bestSpot: string }[]> = {
  japan: [
    { location: 'Tokyo', sunrise: '5:30-6:30 AM (varies by season)', sunset: '4:30-7:00 PM', bestSpot: 'Tokyo Tower or Shibuya Sky for golden skyline views' },
    { location: 'Kyoto', sunrise: '5:45-6:45 AM', sunset: '5:00-7:15 PM', bestSpot: 'Fushimi Inari Shrine — the torii gates glow orange in sunset light' },
    { location: 'Mount Fuji', sunrise: '4:30-5:30 AM (summer)', sunset: '6:00-7:00 PM', bestSpot: 'Lake Kawaguchi for mirror reflections at dawn' },
  ],
  italy: [
    { location: 'Rome', sunrise: '5:30-7:30 AM', sunset: '4:45-8:45 PM', bestSpot: 'Pincian Hill for golden light over Piazza del Popolo' },
    { location: 'Venice', sunrise: '5:45-7:30 AM', sunset: '4:30-8:50 PM', bestSpot: 'San Giorgio Maggiore island facing back toward St. Mark\'s' },
    { location: 'Tuscany', sunrise: '5:30-7:30 AM', sunset: '4:30-8:45 PM', bestSpot: 'Val d\'Orcia rolling hills — iconic cypress tree-lined roads' },
  ],
  thailand: [
    { location: 'Bangkok', sunrise: '5:45-6:30 AM', sunset: '5:45-6:45 PM', bestSpot: 'Wat Arun from across the river — the temple sparkles at sunset' },
    { location: 'Chiang Mai', sunrise: '5:45-6:30 AM', sunset: '5:45-6:45 PM', bestSpot: 'Doi Suthep temple overlook for misty mountain sunrise' },
    { location: 'Krabi/Railay', sunrise: '6:00-6:30 AM', sunset: '6:00-6:30 PM', bestSpot: 'Railay Beach East for dramatic limestone cliff silhouettes' },
  ],
  france: [
    { location: 'Paris', sunrise: '5:45-8:45 AM', sunset: '4:50-9:50 PM', bestSpot: 'Trocadero facing the Eiffel Tower — classic golden hour shot' },
    { location: 'Provence', sunrise: '5:30-8:00 AM', sunset: '5:00-9:15 PM', bestSpot: 'Lavender fields near Valensole plateau in June-July' },
    { location: 'Mont Saint-Michel', sunrise: '6:00-8:30 AM', sunset: '5:00-9:45 PM', bestSpot: 'From the mainland causeways during low tide at sunset' },
  ],
  india: [
    { location: 'Agra', sunrise: '5:15-6:30 AM', sunset: '5:15-7:00 PM', bestSpot: 'Mehtab Bagh for Taj Mahal reflected in the Yamuna River at sunrise' },
    { location: 'Varanasi', sunrise: '5:00-6:30 AM', sunset: '5:15-6:45 PM', bestSpot: 'Boat ride on the Ganges during sunrise — ghats bathed in gold' },
    { location: 'Jaipur', sunrise: '5:30-6:45 AM', sunset: '5:30-7:15 PM', bestSpot: 'Nahargarh Fort for sunset over the Pink City' },
  ],
}

const ETHICAL_GUIDELINES = [
  'Always ask permission before photographing people, especially in rural communities and indigenous areas.',
  'Do not photograph children without their parents\' explicit consent.',
  'Respect "no photography" signs in temples, museums, and sacred sites.',
  'Avoid photographing military installations, government buildings, and border areas.',
  'Do not use flash photography in places where it could damage artifacts or disturb wildlife.',
  'Be mindful of poverty tourism — do not treat people\'s hardship as photo opportunities.',
  'In some cultures, photographing someone is believed to capture their soul — be respectful of these beliefs.',
  'If you promise to send someone their photo, follow through.',
  'Credit local guides or fixers who help you access photo locations.',
  'Consider how your photos will be used — avoid reinforcing stereotypes.',
]

const GEAR_TIPS = [
  { category: 'Essential Kit', items: [
    'Camera body with a versatile zoom lens (24-70mm or 24-105mm covers most travel situations)',
    'A fast prime lens (35mm or 50mm f/1.8) for low-light and portrait shots',
    'Extra batteries (at least 2-3) and a universal charger',
    'Multiple memory cards — never rely on a single card',
    'Microfiber cleaning cloth and lens pen',
    'Rain cover or large zip-lock bag for weather protection',
  ]},
  { category: 'Recommended Extras', items: [
    'Lightweight travel tripod or GorillaPod for long exposures and night shots',
    'Polarizing filter to cut glare and enhance skies',
    'ND filter for long exposures (waterfalls, rivers, clouds)',
    'Wide-angle lens (16-35mm) for landscapes and architecture',
    'Telephoto lens (70-200mm) for wildlife and distant subjects',
    'External hard drive or laptop for daily backup',
  ]},
  { category: 'Packing Tips', items: [
    'Always carry camera gear as carry-on luggage — never check it',
    'Use a padded camera insert in a regular backpack to avoid looking like an obvious target',
    'Distribute weight evenly to avoid back strain on long walking days',
    'Keep a small pouch with cleaning supplies, spare batteries, and cards easily accessible',
    'Use silica gel packets in your camera bag in humid destinations',
    'Register expensive equipment with customs before departure to avoid issues on return',
  ]},
]

const PHONE_VS_CAMERA = [
  { aspect: 'Portability', phone: 'Always in your pocket, zero extra weight', camera: 'Extra weight and bag space needed' },
  { aspect: 'Image Quality', phone: 'Excellent in daylight, struggles in low light', camera: 'Superior in all conditions, especially low light' },
  { aspect: 'Versatility', phone: 'Fixed lens options (ultra-wide, standard, telephoto)', camera: 'Interchangeable lenses for any situation' },
  { aspect: 'Editing', phone: 'Edit and share instantly with mobile apps', camera: 'Requires transfer to device, but RAW files offer more editing power' },
  { aspect: 'Video', phone: 'Great for social media content and casual video', camera: 'Better stabilization, depth of field, and cinema quality' },
  { aspect: 'Discretion', phone: 'Blends in — less likely to attract attention or theft', camera: 'Obvious and can make you a target in some areas' },
  { aspect: 'Cost of Loss', phone: 'Losing your phone means losing everything', camera: 'Dedicated device — losing it is bad but not as catastrophic' },
]

const GENERAL_PHOTO_TIPS = [
  { title: 'Rule of Thirds', description: 'Place key subjects along the grid lines or at intersection points. Enable the grid overlay on your camera or phone for guidance.' },
  { title: 'Leading Lines', description: 'Use roads, rivers, fences, or architecture to draw the viewer\'s eye into the frame and toward your subject.' },
  { title: 'Golden Hour', description: 'The hour after sunrise and before sunset provides the warmest, most flattering light. Wake up early — it is worth it.' },
  { title: 'Blue Hour', description: 'The 20-30 minutes before sunrise and after sunset create a cool, moody blue tone — perfect for cityscapes and monuments with lights.' },
  { title: 'Foreground Interest', description: 'Include an interesting element in the foreground (flowers, rocks, reflections) to add depth and scale to landscape shots.' },
  { title: 'Framing', description: 'Use doorways, arches, windows, and tree branches to create a natural frame around your subject.' },
  { title: 'Patience', description: 'Wait for the right moment — the crowd to clear, the light to shift, or the bird to land. Great travel photos require patience.' },
  { title: 'Shoot RAW', description: 'If your camera supports it, shoot in RAW format for maximum flexibility in post-processing. Keep JPEGs as backup.' },
]

function getPhotoSpots(country: Country): { name: string; city: string; category: string; photoTip: string; bestTime: string }[] {
  const spots: { name: string; city: string; category: string; photoTip: string; bestTime: string }[] = []
  for (const state of country.states) {
    for (const city of state.cities) {
      for (const attr of city.attractions) {
        if (attr.photoTip) {
          spots.push({
            name: attr.name,
            city: city.name,
            category: attr.category,
            photoTip: attr.photoTip,
            bestTime: attr.bestTimeToVisit,
          })
        }
      }
    }
  }
  return spots
}

export default function PhotographyGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const countriesToShow = useMemo(() => {
    if (selectedCountry) {
      const c = COUNTRIES.find((c) => c.id === selectedCountry)
      return c ? [c] : []
    }
    return COUNTRIES
  }, [selectedCountry])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Travel Photography Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Best photo spots, golden hour timing, drone rules, gear tips, and techniques to capture unforgettable travel memories.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Country Filter */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Per-Country: Photo Spots */}
        {countriesToShow.map((country) => {
          const spots = getPhotoSpots(country)
          const goldenHour = GOLDEN_HOUR_TIPS[country.id] || []
          const drone = DRONE_REGULATIONS[country.id]

          return (
            <section key={country.id} className="space-y-8">
              <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
                <span className="mr-2">{country.flag}</span>{country.name}
              </h2>

              {/* Best Photo Spots */}
              {spots.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Best Photo Spots</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {spots.map((spot) => (
                      <div key={`${spot.name}-${spot.city}`} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-heading font-semibold text-[#0F172A]">{spot.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium shrink-0 ml-2">
                            {spot.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#0F172A]/50 mb-2">{spot.city} &middot; Best time: {spot.bestTime}</p>
                        <p className="text-sm text-[#0F172A]/80 leading-relaxed">{spot.photoTip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Golden Hour */}
              {goldenHour.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Golden Hour Timing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden text-sm">
                      <thead>
                        <tr className="bg-[#F59E0B]/5 border-b border-[#E2E8F0]">
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Location</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Sunrise</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Sunset</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Best Spot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {goldenHour.map((gh, i) => (
                          <tr key={gh.location} className={i % 2 === 1 ? 'bg-[#FAFBFC]' : ''}>
                            <td className="px-4 py-3 font-medium text-[#0F172A]">{gh.location}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{gh.sunrise}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{gh.sunset}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{gh.bestSpot}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Drone Regulations */}
              {drone && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Drone Regulations</h3>
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${drone.color}`}>
                        {drone.status}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {drone.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                          <span className="text-[#0F172A]/40 font-bold mt-0.5 shrink-0">&bull;</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          )
        })}

        {/* Ethical Photography */}
        <section className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Ethical Photography Guidelines</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-3">
              {ETHICAL_GUIDELINES.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                  <span className="text-[#0EA5E9] font-bold mt-0.5 shrink-0">&bull;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Camera Gear Packing */}
        <section className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Camera Gear Packing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GEAR_TIPS.map((section) => (
              <div key={section.category} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-[#0F172A] mb-3">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/70">
                      <span className="text-[#0EA5E9] mt-0.5 shrink-0">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Phone vs Camera */}
        <section className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Phone vs Camera</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#0EA5E9]/5 border-b border-[#E2E8F0]">
                  <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Aspect</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Smartphone</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Dedicated Camera</th>
                </tr>
              </thead>
              <tbody>
                {PHONE_VS_CAMERA.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 1 ? 'bg-[#FAFBFC]' : ''}>
                    <td className="px-4 py-3 font-medium text-[#0F172A]">{row.aspect}</td>
                    <td className="px-4 py-3 text-[#0F172A]/70">{row.phone}</td>
                    <td className="px-4 py-3 text-[#0F172A]/70">{row.camera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* General Tips */}
        <section className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Photography Techniques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GENERAL_PHOTO_TIPS.map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-[#0F172A] mb-2">{tip.title}</h3>
                <p className="text-sm text-[#0F172A]/70 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
