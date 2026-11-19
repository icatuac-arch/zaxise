'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { COUNTRIES } from '@/data/travel/destinations'
import type { Attraction, City, Country } from '@/data/travel/destinations'

// Leaflet CSS and icon fix applied client-side only

const MapContainer = dynamic(() => import('react-leaflet').then(m => ({ default: m.MapContainer })), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => ({ default: m.TileLayer })), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => ({ default: m.Marker })), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => ({ default: m.Popup })), { ssr: false })

// Color-coded marker icons
const CATEGORY_COLORS: Record<string, { color: string; label: string; hex: string }> = {
  sightseeing: { color: 'blue', label: 'Sightseeing', hex: '#3B82F6' },
  food: { color: 'orange', label: 'Food & Markets', hex: '#F59E0B' },
  nature: { color: 'green', label: 'Nature', hex: '#22C55E' },
  temples: { color: 'violet', label: 'Temples & Shrines', hex: '#8B5CF6' },
}

function getMarkerCategory(attraction: Attraction): string {
  const cat = attraction.category
  const tags = attraction.tags.join(' ').toLowerCase()
  if (cat === 'temple' || tags.includes('shrine') || tags.includes('temple') || tags.includes('religious')) return 'temples'
  if (cat === 'nature' || cat === 'beach' || cat === 'park' || tags.includes('nature') || tags.includes('hiking') || tags.includes('waterfall')) return 'nature'
  if (cat === 'market' || tags.includes('food') || tags.includes('street-food') || tags.includes('seafood')) return 'food'
  return 'sightseeing'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createColoredIcon(hex: string): any {
  if (typeof window === 'undefined') return undefined
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px; height: 24px; border-radius: 50% 50% 50% 0;
      background: ${hex}; border: 2px solid white;
      transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

function getRankBadge(rank: number | null, label: string) {
  if (!rank) return null
  const colors: Record<number, string> = { 1: 'bg-yellow-400 text-yellow-900', 2: 'bg-gray-300 text-gray-800', 3: 'bg-amber-600 text-white' }
  const style = colors[rank] || 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${style}`}>
      #{rank} {label}
    </span>
  )
}

// Dynamic import for MapUpdater that uses useMap
const DynamicMapUpdater = dynamic(
  () => Promise.resolve(({ center, zoom }: { center: [number, number]; zoom: number }) => {
    return <MapUpdaterInnerWrapper center={center} zoom={zoom} />
  }),
  { ssr: false }
)

function MapUpdaterInnerWrapper({ center, zoom }: { center: [number, number]; zoom: number }) {
  const [MapComp, setMapComp] = useState<React.ComponentType<{ center: [number, number]; zoom: number }> | null>(null)

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      // Create a component that uses useMap
      const Updater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
        const map = mod.useMap()
        useEffect(() => {
          map.flyTo(center, zoom, { duration: 1.2 })
        }, [map, center, zoom])
        return null
      }
      setMapComp(() => Updater)
    })
  }, [])

  if (!MapComp) return null
  return <MapComp center={center} zoom={zoom} />
}

// Flatten all cities and attractions from data
interface MarkerData {
  attraction: Attraction
  city: City
  country: Country
  category: string
}

function getAllMarkers(): MarkerData[] {
  const markers: MarkerData[] = []
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        for (const attraction of city.attractions) {
          markers.push({
            attraction,
            city,
            country,
            category: getMarkerCategory(attraction),
          })
        }
      }
    }
  }
  return markers
}

interface CityOption {
  city: City
  country: Country
}

function getAllCities(): CityOption[] {
  const cities: CityOption[] = []
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        cities.push({ city, country })
      }
    }
  }
  return cities
}

const DEFAULT_CENTER: [number, number] = [48.5, 15]
const DEFAULT_ZOOM = 3

export default function MapsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [activeCategories, setActiveCategories] = useState<Record<string, boolean>>({
    sightseeing: true,
    food: true,
    nature: true,
    temples: true,
  })
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Fix Leaflet marker icons client-side
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    })
    // Leaflet CSS loaded via link tag below
    setMounted(true)
  }, [])

  const allMarkers = useMemo(() => getAllMarkers(), [])
  const allCities = useMemo(() => getAllCities(), [])

  const filteredCities = useMemo(() => {
    if (!selectedCountry) return allCities
    return allCities.filter(c => c.country.id === selectedCountry)
  }, [selectedCountry, allCities])

  const filteredMarkers = useMemo(() => {
    let markers = allMarkers
    if (selectedCountry) {
      markers = markers.filter(m => m.country.id === selectedCountry)
    }
    if (selectedCity) {
      markers = markers.filter(m => m.city.id === selectedCity)
    }
    return markers.filter(m => activeCategories[m.category])
  }, [allMarkers, selectedCountry, selectedCity, activeCategories])

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId)
    setSelectedCity('')
    if (countryId) {
      const country = COUNTRIES.find(c => c.id === countryId)
      if (country) {
        // Zoom to first city of that country
        const firstCity = country.states[0]?.cities[0]
        if (firstCity) {
          setMapCenter([firstCity.lat, firstCity.lng])
          setMapZoom(6)
        }
      }
    } else {
      setMapCenter(DEFAULT_CENTER)
      setMapZoom(DEFAULT_ZOOM)
    }
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    if (cityId) {
      const cityOption = allCities.find(c => c.city.id === cityId)
      if (cityOption) {
        setMapCenter([cityOption.city.lat, cityOption.city.lng])
        setMapZoom(13)
      }
    } else if (selectedCountry) {
      const country = COUNTRIES.find(c => c.id === selectedCountry)
      if (country) {
        const firstCity = country.states[0]?.cities[0]
        if (firstCity) {
          setMapCenter([firstCity.lat, firstCity.lng])
          setMapZoom(6)
        }
      }
    }
  }

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { sightseeing: 0, food: 0, nature: 0, temples: 0 }
    let markers = allMarkers
    if (selectedCountry) markers = markers.filter(m => m.country.id === selectedCountry)
    if (selectedCity) markers = markers.filter(m => m.city.id === selectedCity)
    for (const m of markers) {
      counts[m.category] = (counts[m.category] || 0) + 1
    }
    return counts
  }, [allMarkers, selectedCountry, selectedCity])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Interactive Maps</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Explore every destination on the map. Filter by category, zoom into cities, and discover attractions visually.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Country Selector */}
            <div className="flex-1">
              <label htmlFor="country-select" className="block text-sm font-semibold text-[#0F172A] mb-1">Country</label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(c => (
                  <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div className="flex-1">
              <label htmlFor="city-select" className="block text-sm font-semibold text-[#0F172A] mb-1">City</label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
              >
                <option value="">All Cities</option>
                {filteredCities.map(c => (
                  <option key={c.city.id} value={c.city.id}>{c.country.flag} {c.city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([key, { label, hex }]) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategories[key]
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-[#E2E8F0] text-[#0F172A]/50 bg-white'
                }`}
                style={activeCategories[key] ? { backgroundColor: hex } : {}}
              >
                <span
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: hex }}
                />
                {label} ({categoryCounts[key]})
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet CSS */}
        {mounted && <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />}
        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm" style={{ height: '600px' }}>
          {mounted && (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <DynamicMapUpdater center={mapCenter} zoom={mapZoom} />
              {filteredMarkers.map((m) => {
                const catInfo = CATEGORY_COLORS[m.category]
                const icon = createColoredIcon(catInfo.hex)
                return (
                  <Marker
                    key={m.attraction.id}
                    position={[m.attraction.lat, m.attraction.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="min-w-[200px] max-w-[280px]">
                        <h3 className="font-bold text-[#0F172A] text-base mb-1">{m.attraction.name}</h3>
                        <p className="text-xs text-[#0F172A]/60 mb-2">{m.city.name}, {m.country.name}</p>
                        <p className="text-sm text-[#0F172A]/80 mb-2">{m.attraction.description.slice(0, 150)}{m.attraction.description.length > 150 ? '...' : ''}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: catInfo.hex }}
                          >
                            {catInfo.label}
                          </span>
                          {getRankBadge(m.attraction.cityRank, 'City')}
                          {getRankBadge(m.attraction.stateRank, 'State')}
                          {getRankBadge(m.attraction.countryRank, 'Country')}
                        </div>
                        <div className="text-xs text-[#0F172A]/60 space-y-0.5">
                          <p><span className="font-semibold">Entry:</span> {m.attraction.entryFee}</p>
                          <p><span className="font-semibold">Duration:</span> {m.attraction.visitDuration.noRush}</p>
                          <p><span className="font-semibold">Best time:</span> {m.attraction.bestTimeToVisit}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <h3 className="font-serif text-lg font-semibold text-[#0F172A] mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(CATEGORY_COLORS).map(([key, { label, hex }]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-sm text-[#0F172A]">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#0F172A]/50 mt-3">
            Showing {filteredMarkers.length} attraction{filteredMarkers.length !== 1 ? 's' : ''} on the map.
            Click any marker to see details, rank badges, and visitor info.
          </p>
        </div>
      </div>
    </div>
  )
}
