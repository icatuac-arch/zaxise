'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown, X, Search } from 'lucide-react'

const PRESET_LOCATIONS = [
  { label: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
  { label: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { label: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { label: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { label: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { label: 'Mumbai, India', lat: 19.076, lng: 72.8777 },
  { label: 'Delhi, India', lat: 28.6139, lng: 77.209 },
  { label: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { label: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { label: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { label: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { label: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { label: 'Barcelona, Spain', lat: 41.3874, lng: 2.1686 },
  { label: 'Berlin, Germany', lat: 52.52, lng: 13.405 },
  { label: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { label: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { label: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
  { label: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
  { label: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
  { label: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  { label: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { label: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633 },
  { label: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
  { label: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
]

const STORAGE_KEY = 'zaxise_location'

export interface LocationOverride {
  lat: number
  lng: number
  label: string
}

export function getLocationOverride(): LocationOverride | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setLocationOverride(loc: LocationOverride | null) {
  if (typeof window === 'undefined') return
  if (loc) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export default function LocationBar() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<LocationOverride | null>(null)
  const [search, setSearch] = useState('')
  const [detecting, setDetecting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrent(getLocationOverride())
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectLocation = (loc: LocationOverride) => {
    setLocationOverride(loc)
    setCurrent(loc)
    setOpen(false)
    setSearch('')
    window.location.reload()
  }

  const useMyLocation = () => {
    setDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: LocationOverride = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: `${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`,
          }
          // Find closest preset for a nice label
          let closest = PRESET_LOCATIONS[0]
          let minDist = Infinity
          for (const p of PRESET_LOCATIONS) {
            const d = Math.sqrt((p.lat - loc.lat) ** 2 + (p.lng - loc.lng) ** 2)
            if (d < minDist) { minDist = d; closest = p }
          }
          if (minDist < 2) loc.label = closest.label
          setLocationOverride(loc)
          setCurrent(loc)
          setDetecting(false)
          setOpen(false)
          window.location.reload()
        },
        () => {
          setDetecting(false)
          alert('Could not detect your location. Please select a city from the list.')
        },
        { timeout: 8000 }
      )
    }
  }

  const resetLocation = () => {
    setLocationOverride(null)
    setCurrent(null)
    setOpen(false)
    window.location.reload()
  }

  const filtered = PRESET_LOCATIONS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 border-b border-slate-200" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1.5">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-600 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {current ? (
                <>Your location: <strong className="text-slate-800">{current.label}</strong></>
              ) : (
                <>Detecting your location...</>
              )}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {current && (
            <button
              onClick={resetLocation}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {open && (
          <div className="pb-3 border-t border-slate-200 pt-2">
            {/* Search */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                autoFocus
              />
            </div>

            {/* Use my location button */}
            <button
              onClick={useMyLocation}
              disabled={detecting}
              className="w-full mb-2 flex items-center justify-center gap-2 py-2 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <MapPin className="w-3.5 h-3.5" />
              {detecting ? 'Detecting...' : 'Use my actual location'}
            </button>

            {/* City grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
              {filtered.map((loc) => (
                <button
                  key={loc.label}
                  onClick={() => selectLocation(loc)}
                  className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                    current?.label === loc.label
                      ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
