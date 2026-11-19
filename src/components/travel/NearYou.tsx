'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin, Compass, Sun, Cloud, Umbrella, Snowflake,
  TreePine, Plane, Car,
  Flame, Wind, TrendingUp, ChevronRight, Locate,
  Star
} from 'lucide-react'
import { COUNTRIES, type City, type Country, type State, type Attraction } from '@/data/travel/destinations'

// ─── Types ────────────────────────────────────────────────

type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'

interface FlatCity {
  city: City
  state: State
  country: Country
}

interface CityWithDistance extends FlatCity {
  distance: number
}

interface WeatherNow {
  tempHigh: number
  tempLow: number
  rainfall: number
  description: string
  month: string
}

type DestinationTag = 'Great weather right now' | 'Festival season' | 'Off-peak deals' | 'Perfect hiking weather' | 'Beach paradise' | 'Cultural immersion' | 'Winter wonderland'

interface SeasonPick extends CityWithDistance {
  tag: DestinationTag
  weather: WeatherNow
}

// ─── Utilities ────────────────────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getSeason(month: number, latitude: number): Season {
  const northern: Season[] = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter']
  const southern: Season[] = ['Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter', 'Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer']
  return latitude >= 0 ? northern[month] : southern[month]
}

function getMonthIndex(): number {
  return new Date().getMonth()
}

function getMonthName(): string {
  return new Date().toLocaleString('en-US', { month: 'long' })
}

function getCityWeather(city: City, monthIndex: number): WeatherNow {
  const w = city.weather?.[monthIndex]
  if (w) return { tempHigh: w.tempHigh, tempLow: w.tempLow, rainfall: w.rainfall, description: w.description, month: w.month }
  return { tempHigh: 22, tempLow: 14, rainfall: 50, description: 'Pleasant', month: getMonthName() }
}

function flattenCities(): FlatCity[] {
  const result: FlatCity[] = []
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        result.push({ city, state, country })
      }
    }
  }
  return result
}

function distanceLabel(km: number): string {
  if (km < 50) return 'In your area'
  if (km < 200) return `${Math.round(km)} km · ~${Math.round(km / 80)} hr drive`
  if (km < 500) return `${Math.round(km)} km · Short flight`
  if (km < 1000) return `${Math.round(km)} km · ~2 hr flight`
  if (km < 3000) return `${(km / 1000).toFixed(1)}k km · ~${Math.round(km / 800)} hr flight`
  if (km < 5000) return `${(km / 1000).toFixed(1)}k km · ~${Math.round(km / 800)} hr flight`
  return `${(km / 1000).toFixed(1)}k km · Long-haul flight`
}

function getWeatherIcon(desc: string, size = 'w-4 h-4') {
  const d = desc.toLowerCase()
  if (d.includes('rain') || d.includes('monsoon') || d.includes('wet')) return <Umbrella className={`${size} text-blue-500`} />
  if (d.includes('snow') || d.includes('frost')) return <Snowflake className={`${size} text-sky-400`} />
  if (d.includes('cloud') || d.includes('overcast') || d.includes('fog')) return <Cloud className={`${size} text-gray-400`} />
  if (d.includes('hot') || d.includes('scorching')) return <Flame className={`${size} text-orange-500`} />
  return <Sun className={`${size} text-amber-500`} />
}

function getSeasonIcon(season: Season, size = 'w-4 h-4') {
  switch (season) {
    case 'Spring': return <TreePine className={`${size} text-emerald-500`} />
    case 'Summer': return <Sun className={`${size} text-amber-500`} />
    case 'Fall': return <Wind className={`${size} text-orange-500`} />
    case 'Winter': return <Snowflake className={`${size} text-sky-400`} />
  }
}

function vibeGradient(city: City, country: Country): string {
  const cats = city.attractions.map(a => a.category)
  const desc = (city.description + ' ' + country.description).toLowerCase()
  if (cats.includes('beach') || desc.includes('beach') || desc.includes('coastal') || desc.includes('island'))
    return 'from-sky-50 to-blue-50 border-sky-200/60'
  if (cats.includes('nature') || desc.includes('mountain') || desc.includes('hiking') || desc.includes('forest') || desc.includes('alpine'))
    return 'from-emerald-50 to-green-50 border-emerald-200/60'
  if (cats.includes('temple') || desc.includes('temple') || desc.includes('ancient') || desc.includes('heritage'))
    return 'from-amber-50 to-orange-50 border-amber-200/60'
  return 'from-rose-50 to-pink-50 border-rose-200/60'
}

function isWeatherIdeal(w: WeatherNow): boolean {
  return w.tempHigh >= 15 && w.tempHigh <= 28 && w.rainfall < 100
}

function isWeatherBad(w: WeatherNow): 'cold' | 'hot' | 'rainy' | null {
  if (w.tempHigh < 10) return 'cold'
  if (w.tempHigh > 35) return 'hot'
  if (w.rainfall > 150 || w.description.toLowerCase().includes('monsoon') || w.description.toLowerCase().includes('heavy rain')) return 'rainy'
  return null
}

function seasonMatchesMonth(bestSeason: string, monthIndex: number): boolean {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const bs = bestSeason.toLowerCase()
  const currentFull = monthNames[monthIndex].toLowerCase()
  const currentAbbr = monthAbbr[monthIndex].toLowerCase()

  if (bs.includes(currentFull) || bs.includes(currentAbbr)) return true

  // Parse ranges like "March-May" or "October-February"
  const rangePattern = /(january|february|march|april|may|june|july|august|september|october|november|december)[–\-\s]+(january|february|march|april|may|june|july|august|september|october|november|december)/gi
  let match: RegExpExecArray | null
  while ((match = rangePattern.exec(bs)) !== null) {
    const startIdx = monthNames.findIndex(m => m.toLowerCase() === match![1].toLowerCase())
    const endIdx = monthNames.findIndex(m => m.toLowerCase() === match![2].toLowerCase())
    if (startIdx === -1 || endIdx === -1) continue
    if (startIdx <= endIdx) {
      if (monthIndex >= startIdx && monthIndex <= endIdx) return true
    } else {
      // Wraps around year (e.g., October–February)
      if (monthIndex >= startIdx || monthIndex <= endIdx) return true
    }
  }

  return false
}

function pickTag(w: WeatherNow, city: City, country: Country): DestinationTag {
  const cats = city.attractions.map(a => a.category)
  const desc = (city.description + ' ' + country.description).toLowerCase()
  const weatherDesc = w.description.toLowerCase()

  if (weatherDesc.includes('festival') || weatherDesc.includes('carnival') || weatherDesc.includes('celebration'))
    return 'Festival season'
  if (cats.includes('beach') || desc.includes('beach'))
    return 'Beach paradise'
  if (desc.includes('hiking') || desc.includes('trek') || cats.includes('nature'))
    return 'Perfect hiking weather'
  if (w.tempHigh < 5 || weatherDesc.includes('snow'))
    return 'Winter wonderland'
  if (w.tempHigh >= 15 && w.tempHigh <= 28 && w.rainfall < 80)
    return 'Great weather right now'
  if (cats.includes('temple') || cats.includes('museum') || cats.includes('historic'))
    return 'Cultural immersion'
  return 'Off-peak deals'
}

function getIndoorAttractions(attractions: Attraction[]): Attraction[] {
  const indoor = ['museum', 'entertainment', 'market', 'temple']
  return attractions
    .filter(a => indoor.includes(a.category))
    .sort((a, b) => a.cityRank - b.cityRank)
}

function getOutdoorAttractions(attractions: Attraction[]): Attraction[] {
  const outdoor = ['nature', 'park', 'beach', 'viewpoint', 'landmark']
  return attractions
    .filter(a => outdoor.includes(a.category))
    .sort((a, b) => a.cityRank - b.cityRank)
}

function shouldShowIndoor(w: WeatherNow): boolean {
  return w.tempHigh < 10 || w.rainfall > 120 || w.description.toLowerCase().includes('rain') || w.description.toLowerCase().includes('monsoon')
}

// ─── Skeleton Components ──────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-50 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-50 rounded mb-2" />
      <div className="h-3 w-3/4 bg-gray-50 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-50 rounded-full" />
        <div className="h-6 w-20 bg-gray-50 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonSection() {
  return (
    <div className="mb-12">
      <div className="h-6 w-48 bg-gray-100 rounded mb-2 animate-pulse" />
      <div className="h-4 w-64 bg-gray-50 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
          <Compass className="w-5 h-5 text-sky-500 animate-spin" />
        </div>
        <div>
          <div className="h-5 w-52 bg-gray-100 rounded animate-pulse mb-1" />
          <div className="h-3 w-36 bg-gray-50 rounded animate-pulse" />
        </div>
      </div>
      <SkeletonSection />
      <SkeletonSection />
    </section>
  )
}

// ─── Section Header ───────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-1">
        {icon}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E293B]">{title}</h3>
      </div>
      <p className="text-sm text-slate-500 ml-[30px]">{subtitle}</p>
    </div>
  )
}

// ─── Tag Badge ────────────────────────────────────────────

function TagBadge({ tag }: { tag: DestinationTag | string }) {
  const colorMap: Record<string, string> = {
    'Great weather right now': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Festival season': 'bg-purple-50 text-purple-700 border-purple-200',
    'Off-peak deals': 'bg-amber-50 text-amber-700 border-amber-200',
    'Perfect hiking weather': 'bg-green-50 text-green-700 border-green-200',
    'Beach paradise': 'bg-sky-50 text-sky-700 border-sky-200',
    'Cultural immersion': 'bg-rose-50 text-rose-700 border-rose-200',
    'Winter wonderland': 'bg-blue-50 text-blue-700 border-blue-200',
    'Indoor picks': 'bg-violet-50 text-violet-700 border-violet-200',
    'Outdoor picks': 'bg-lime-50 text-lime-700 border-lime-200',
    'Nearby': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Weekend trip': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Warm escape': 'bg-orange-50 text-orange-700 border-orange-200',
    'Cool retreat': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Dry weather': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Trending': 'bg-pink-50 text-pink-700 border-pink-200',
  }
  const cls = colorMap[tag] || 'bg-gray-50 text-gray-700 border-gray-200'
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
      {tag}
    </span>
  )
}

// ─── City Card ────────────────────────────────────────────

function CityCard({
  flatCity,
  distance,
  weather,
  tags,
  attractions,
  showWeather = true,
}: {
  flatCity: FlatCity
  distance: number
  weather: WeatherNow
  tags: string[]
  attractions?: Attraction[]
  showWeather?: boolean
}) {
  const { city, state, country } = flatCity
  const gradient = vibeGradient(city, country)

  return (
    <Link
      href={`/travel/country/${country.slug}/${state.id}/${city.id}`}
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${gradient} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5 overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <span className="font-serif text-lg font-bold text-[#1E293B] group-hover:text-sky-600 transition-colors">
              {city.name}
            </span>
            <p className="text-xs text-slate-500">{country.name}</p>
          </div>
        </div>
      </div>

      {/* Distance */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        {distance < 500 ? <Car className="w-3.5 h-3.5" /> : <Plane className="w-3.5 h-3.5" />}
        <span>{distanceLabel(distance)}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((t) => <TagBadge key={t} tag={t} />)}
      </div>

      {/* Weather */}
      {showWeather && (
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl p-3 mb-3">
          {getWeatherIcon(weather.description)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1E293B]">
                {weather.tempHigh}° / {weather.tempLow}°C
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{weather.rainfall}mm rain</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{weather.description}</p>
          </div>
        </div>
      )}

      {/* Attractions preview */}
      {attractions && attractions.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {attractions.slice(0, 3).map((a) => (
            <div key={a.id} className="flex items-center gap-2 text-xs text-slate-600">
              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="truncate">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2 flex items-center text-xs font-semibold text-sky-600 group-hover:text-sky-700">
        <span>Explore {city.name}</span>
        <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────

export default function NearYou() {
  const [loading, setLoading] = useState(true)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [locationDenied, setLocationDenied] = useState(false)

  const monthIndex = getMonthIndex()
  const monthName = getMonthName()

  // Flatten all cities once
  const allCities = useMemo(() => flattenCities(), [])

  useEffect(() => {
    // Check for explicit location override (from LocationBar component)
    try {
      const raw = localStorage.getItem('worldtourly_location')
      if (raw) {
        const override = JSON.parse(raw)
        if (typeof override.lat === 'number' && typeof override.lng === 'number') {
          setUserLat(override.lat)
          setUserLng(override.lng)
          setLoading(false)
          return
        }
      }
    } catch {}

    // No override — use real geolocation
    if (!navigator.geolocation) {
      setLocationDenied(true)
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude)
        setUserLng(pos.coords.longitude)
        setLoading(false)
      },
      () => {
        setLocationDenied(true)
        setLoading(false)
      },
      { timeout: 8000, enableHighAccuracy: false }
    )
  }, [])

  // Compute all derived data
  const computed = useMemo(() => {
    if (userLat === null || userLng === null) return null

    const season = getSeason(monthIndex, userLat)

    // Add distance to every city
    const withDistance: CityWithDistance[] = allCities.map((fc) => ({
      ...fc,
      distance: haversine(userLat, userLng, fc.city.lat, fc.city.lng),
    }))
    withDistance.sort((a, b) => a.distance - b.distance)

    // Deduplicate by country+city id
    const seen = new Set<string>()
    const unique = withDistance.filter((c) => {
      const key = `${c.country.id}/${c.city.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // ─── DEDUPLICATION: track used cities so no city appears in multiple sections ───
    const usedCityIds = new Set<string>()
    const markUsed = (cities: { city: { id: string } }[]) => {
      cities.forEach(c => usedCityIds.add(c.city.id))
    }
    const isUsed = (c: { city: { id: string } }) => usedCityIds.has(c.city.id)

    // Section 1: In Your City / Near You
    const inCity = unique[0]?.distance < 50 ? unique[0] : null
    if (inCity) usedCityIds.add(inCity.city.id)
    const nearest5 = unique.filter(c => !isUsed(c)).slice(0, 5)
    markUsed(nearest5)

    // Within 2000km (for later filtering)
    const within2000 = unique.filter((c) => c.distance <= 2000)

    // Section 2: Perfect for season — best visited now (EXCLUDE already shown cities)
    const seasonPicks: SeasonPick[] = []
    for (const c of unique) {
      if (seasonPicks.length >= 3) break
      if (isUsed(c)) continue
      const w = getCityWeather(c.city, monthIndex)
      const matchesSeason = seasonMatchesMonth(c.city.bestSeason, monthIndex)
      const idealWeather = isWeatherIdeal(w)
      if (matchesSeason || idealWeather) {
        seasonPicks.push({
          ...c,
          tag: pickTag(w, c.city, c.country),
          weather: w,
        })
      }
    }
    // If not enough from nearby, search broader
    if (seasonPicks.length < 3) {
      for (const c of unique) {
        if (seasonPicks.length >= 3) break
        if (isUsed(c)) continue
        if (seasonPicks.find(p => p.city.id === c.city.id)) continue
        const w = getCityWeather(c.city, monthIndex)
        const matchesSeason = seasonMatchesMonth(c.city.bestSeason, monthIndex)
        const idealWeather = isWeatherIdeal(w)
        if (matchesSeason || idealWeather) {
          seasonPicks.push({ ...c, tag: pickTag(w, c.city, c.country), weather: w })
        }
      }
    }
    markUsed(seasonPicks)

    // Section 3: Weekend Getaway (within 500km, EXCLUDE already shown)
    const weekendGetaways = within2000
      .filter((c) => c.distance > 50 && c.distance <= 500)
      .filter((c) => !isUsed(c))
      .slice(0, 3)
    markUsed(weekendGetaways)

    // Section 4: Escape the weather (EXCLUDE already shown)
    const userWeather = inCity
      ? getCityWeather(inCity.city, monthIndex)
      : nearest5[0]
        ? getCityWeather(nearest5[0].city, monthIndex)
        : null
    const badWeather = userWeather ? isWeatherBad(userWeather) : null

    let escapeDestinations: CityWithDistance[] = []
    if (badWeather) {
      const candidates = unique.filter((c) => {
        if (isUsed(c)) return false
        const w = getCityWeather(c.city, monthIndex)
        if (badWeather === 'cold') return w.tempHigh >= 25 && w.tempHigh <= 35
        if (badWeather === 'hot') return w.tempHigh >= 10 && w.tempHigh <= 24
        if (badWeather === 'rainy') return w.rainfall < 50
        return false
      })
      escapeDestinations = candidates.slice(0, 3)
      markUsed(escapeDestinations)
    }

    // Section 5: Trending this month — cities with festival mentions or seasonal highlights
    const trending: CityWithDistance[] = []
    for (const c of unique) {
      if (trending.length >= 3) break
      if (isUsed(c)) continue
      const w = getCityWeather(c.city, monthIndex)
      const hasFestival =
        w.description.toLowerCase().includes('festival') ||
        w.description.toLowerCase().includes('carnival') ||
        w.description.toLowerCase().includes('celebration') ||
        w.description.toLowerCase().includes('cherry blossom') ||
        w.description.toLowerCase().includes('new year') ||
        w.description.toLowerCase().includes('matsuri')
      const hasSeasonalAttraction = c.city.attractions.some(a =>
        a.seasonalNote?.toLowerCase().includes(monthName.toLowerCase())
      )
      if (hasFestival || hasSeasonalAttraction) {
        trending.push(c)
      }
    }
    // Fill with ideal-weather cities if we didn't find enough festival ones
    if (trending.length < 3) {
      for (const c of unique) {
        if (trending.length >= 3) break
        if (trending.find(t => t.city.id === c.city.id)) continue
        if (inCity && c.city.id === inCity.city.id) continue
        if (seasonPicks.find(p => p.city.id === c.city.id)) continue
        const w = getCityWeather(c.city, monthIndex)
        if (isWeatherIdeal(w) && seasonMatchesMonth(c.city.bestSeason, monthIndex)) {
          trending.push(c)
        }
      }
    }

    return {
      season,
      inCity,
      nearest5,
      within2000,
      seasonPicks: seasonPicks.slice(0, 3),
      weekendGetaways,
      badWeather,
      userWeather,
      escapeDestinations,
      trending,
    }
  }, [userLat, userLng, allCities, monthIndex, monthName])

  // Fallback data for when location is denied
  const fallbackPicks = useMemo(() => {
    const picks: SeasonPick[] = []
    for (const fc of allCities) {
      const w = getCityWeather(fc.city, monthIndex)
      const matchesSeason = seasonMatchesMonth(fc.city.bestSeason, monthIndex)
      if ((matchesSeason || isWeatherIdeal(w)) && picks.length < 6) {
        picks.push({
          ...fc,
          distance: 0,
          tag: pickTag(w, fc.city, fc.country),
          weather: w,
        })
      }
    }
    return picks
  }, [allCities, monthIndex])

  // ─── Loading State ────────────────────────────────────────

  if (loading) return <LoadingState />

  // ─── Location Denied Fallback ─────────────────────────────

  if (locationDenied || !computed) {
    const season = getSeason(monthIndex, 40) // default to northern hemisphere
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
                Popular Right Now
              </h2>
              <p className="text-sm text-slate-500">
                Top picks for {season} {getMonthName()} travel
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 ml-[52px] inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <Locate className="w-3.5 h-3.5" />
            Enable location for personalized picks
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fallbackPicks.slice(0, 6).map((pick) => (
            <CityCard
              key={`${pick.country.id}-${pick.city.id}`}
              flatCity={pick}
              distance={0}
              weather={pick.weather}
              tags={[pick.tag]}
              showWeather={true}
            />
          ))}
        </div>
      </section>
    )
  }

  // ─── Main Personalized View ───────────────────────────────

  const {
    season,
    inCity,
    nearest5,
    seasonPicks,
    weekendGetaways,
    badWeather,
    userWeather,
    escapeDestinations,
    trending,
  } = computed

  const locationStr = `${Math.abs(userLat!).toFixed(1)}°${userLat! >= 0 ? 'N' : 'S'}, ${Math.abs(userLng!).toFixed(1)}°${userLng! >= 0 ? 'E' : 'W'}`

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Main Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
            <Compass className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B]">
              Your Travel Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              {locationStr} &middot; {monthName} &middot; {season}
            </p>
          </div>
        </div>
        <div className="ml-[52px] flex items-center gap-2 mt-1">
          {getSeasonIcon(season, 'w-3.5 h-3.5')}
          <span className="text-xs text-slate-500">
            Personalized for your location and the current season
          </span>
        </div>
      </div>

      {/* ─── Section 1: In Your City / Near You ──────────────── */}
      {inCity ? (
        <div className="mb-12">
          <SectionHeader
            icon={<MapPin className="w-5 h-5 text-rose-500" />}
            title="In Your City"
            subtitle={`You're in ${inCity.city.name} — here's what's happening`}
          />
          {(() => {
            const w = getCityWeather(inCity.city, monthIndex)
            const indoor = shouldShowIndoor(w)
            const picks = indoor
              ? getIndoorAttractions(inCity.city.attractions)
              : getOutdoorAttractions(inCity.city.attractions)
            const fallbackPicks = indoor
              ? getOutdoorAttractions(inCity.city.attractions)
              : getIndoorAttractions(inCity.city.attractions)
            const displayAttractions = picks.length >= 3 ? picks : [...picks, ...fallbackPicks]

            return (
              <Link
                href={`/travel/country/${inCity.country.slug}/${inCity.state.id}/${inCity.city.id}`}
                className="block group"
              >
                <div className={`rounded-2xl border bg-gradient-to-br ${vibeGradient(inCity.city, inCity.country)} shadow-sm hover:shadow-lg transition-all duration-300 p-6 sm:p-8`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    {/* Left: City Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{inCity.country.flag}</span>
                        <div>
                          <h4 className="font-serif text-2xl font-bold text-[#1E293B] group-hover:text-sky-600 transition-colors">
                            {inCity.city.name}
                          </h4>
                          <p className="text-sm text-slate-500">{inCity.country.name} &middot; {distanceLabel(inCity.distance)}</p>
                        </div>
                      </div>

                      {/* Weather card */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 inline-flex items-center gap-4">
                        {getWeatherIcon(w.description, 'w-6 h-6')}
                        <div>
                          <div className="text-lg font-bold text-[#1E293B]">
                            {w.tempHigh}° / {w.tempLow}°C
                          </div>
                          <div className="text-xs text-slate-500">{w.description} &middot; {w.rainfall}mm rainfall</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                        <span>View full city guide</span>
                        <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Right: Attractions */}
                    <div className="sm:w-80 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-3">
                        <TagBadge tag={indoor ? 'Indoor picks' : 'Outdoor picks'} />
                        <span className="text-xs text-slate-400">
                          {indoor ? 'Best for today\'s weather' : 'Great weather to be outside'}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {displayAttractions.slice(0, 3).map((a) => (
                          <div key={a.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Star className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#1E293B] truncate">{a.name}</p>
                              <p className="text-xs text-slate-500 truncate">{a.bestTimeToVisit}</p>
                              {a.seasonalNote && (
                                <p className="text-xs text-amber-600 mt-0.5 truncate">{a.seasonalNote}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })()}
        </div>
      ) : nearest5.length > 0 ? (
        <div className="mb-12">
          <SectionHeader
            icon={<MapPin className="w-5 h-5 text-rose-500" />}
            title="Near You"
            subtitle={`Closest destinations to your location`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nearest5.slice(0, 3).map((c) => {
              const w = getCityWeather(c.city, monthIndex)
              return (
                <CityCard
                  key={`${c.country.id}-${c.city.id}`}
                  flatCity={c}
                  distance={c.distance}
                  weather={w}
                  tags={[c.distance < 2000 ? 'Nearby' : distanceLabel(c.distance)]}
                  attractions={c.city.attractions.slice(0, 3)}
                />
              )
            })}
          </div>
        </div>
      ) : null}

      {/* ─── Section 2: Perfect for [Season] ─────────────────── */}
      {seasonPicks.length > 0 && (
        <div className="mb-12">
          <SectionHeader
            icon={getSeasonIcon(season, 'w-5 h-5')}
            title={`Perfect for ${season}`}
            subtitle={`These destinations are at their best right now`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {seasonPicks.map((pick) => (
              <CityCard
                key={`season-${pick.country.id}-${pick.city.id}`}
                flatCity={pick}
                distance={pick.distance}
                weather={pick.weather}
                tags={[pick.tag]}
                attractions={pick.city.attractions.slice(0, 3)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Section 3: Weekend Getaway ──────────────────────── */}
      {weekendGetaways.length > 0 && (
        <div className="mb-12">
          <SectionHeader
            icon={<Car className="w-5 h-5 text-indigo-500" />}
            title="Weekend Getaway"
            subtitle="Close enough for a quick escape"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {weekendGetaways.map((c) => {
              const w = getCityWeather(c.city, monthIndex)
              return (
                <CityCard
                  key={`weekend-${c.country.id}-${c.city.id}`}
                  flatCity={c}
                  distance={c.distance}
                  weather={w}
                  tags={['Weekend trip']}
                  attractions={c.city.attractions.slice(0, 2)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Section 4: Escape the Weather ───────────────────── */}
      {badWeather && escapeDestinations.length > 0 && userWeather && (
        <div className="mb-12">
          <SectionHeader
            icon={
              badWeather === 'cold'
                ? <Snowflake className="w-5 h-5 text-sky-400" />
                : badWeather === 'hot'
                  ? <Flame className="w-5 h-5 text-orange-500" />
                  : <Umbrella className="w-5 h-5 text-blue-500" />
            }
            title={`Escape the ${badWeather === 'cold' ? 'Cold' : badWeather === 'hot' ? 'Heat' : 'Rain'}`}
            subtitle={
              badWeather === 'cold'
                ? `It's ${userWeather.tempHigh}°C where you are — find some sunshine`
                : badWeather === 'hot'
                  ? `${userWeather.tempHigh}°C is brutal — cool off somewhere`
                  : `${userWeather.rainfall}mm of rain? Time for clear skies`
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {escapeDestinations.map((c) => {
              const w = getCityWeather(c.city, monthIndex)
              const escapeTag = badWeather === 'cold' ? 'Warm escape' : badWeather === 'hot' ? 'Cool retreat' : 'Dry weather'
              return (
                <CityCard
                  key={`escape-${c.country.id}-${c.city.id}`}
                  flatCity={c}
                  distance={c.distance}
                  weather={w}
                  tags={[escapeTag]}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Section 5: Trending This Month ──────────────────── */}
      {trending.length > 0 && (
        <div className="mb-12">
          <SectionHeader
            icon={<TrendingUp className="w-5 h-5 text-pink-500" />}
            title={`Trending in ${monthName}`}
            subtitle="Seasonal highlights and events happening now"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.map((c) => {
              const w = getCityWeather(c.city, monthIndex)
              const desc = w.description
              const hasFestival =
                desc.toLowerCase().includes('festival') ||
                desc.toLowerCase().includes('carnival') ||
                desc.toLowerCase().includes('cherry blossom') ||
                desc.toLowerCase().includes('matsuri')
              return (
                <CityCard
                  key={`trend-${c.country.id}-${c.city.id}`}
                  flatCity={c}
                  distance={c.distance}
                  weather={w}
                  tags={[hasFestival ? 'Festival season' : 'Trending']}
                  attractions={c.city.attractions.filter(a => a.seasonalNote).slice(0, 2)}
                />
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
