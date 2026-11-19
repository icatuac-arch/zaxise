'use client'

import { useState, useEffect } from 'react'
import { Cloud, Droplets, Wind, Thermometer, MapPin, Search, Sun, CloudRain, Snowflake, CloudLightning, Eye } from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

interface WeatherData {
  location: string
  country: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  visibility: number
  pressure: number
}

function getWeatherIcon(desc: string) {
  const d = desc.toLowerCase()
  if (d.includes('thunder')) return <CloudLightning className="w-10 h-10 text-yellow-400" />
  if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className="w-10 h-10 text-blue-400" />
  if (d.includes('snow')) return <Snowflake className="w-10 h-10 text-sky-200" />
  if (d.includes('clear') || d.includes('sunny')) return <Sun className="w-10 h-10 text-amber-400" />
  return <Cloud className="w-10 h-10 text-slate-300" />
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [error, setError] = useState('')

  const fetchWeather = async (query: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(query)}?format=j1`)
      if (!res.ok) throw new Error('City not found')
      const data = await res.json()
      const current = data.current_condition[0]
      const area = data.nearest_area[0]
      setWeather({
        location: area.areaName[0].value,
        country: area.country[0].value,
        temp: parseInt(current.temp_C),
        feelsLike: parseInt(current.FeelsLikeC),
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedKmph),
        description: current.weatherDesc[0].value,
        icon: current.weatherCode,
        visibility: parseInt(current.visibility),
        pressure: parseInt(current.pressure),
      })
    } catch {
      setError('Could not find weather for that location. Try a different city name.')
    }
    setLoading(false)
  }

  useEffect(() => {
    // Get user's city from timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const city = tz.split('/').pop()?.replace(/_/g, ' ') || 'London'
    fetchWeather(city)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCity.trim()) fetchWeather(searchCity.trim())
  }

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Weather</h1>
        <p className="text-muted mb-8">Current conditions for any city worldwide</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              placeholder="Search any city (e.g. Paris, Tokyo, Mumbai)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card-bg border border-card-border text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            Search
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {loading && <div className="text-center py-12 text-muted">Loading weather...</div>}

        {weather && !loading && (
          <div className="space-y-6">
            {/* Main card */}
            <div className="rounded-2xl border border-card-border bg-gradient-to-br from-card-bg/80 to-card-bg/40 p-8">
              <div className="flex items-center gap-2 text-muted mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{weather.location}, {weather.country}</span>
              </div>

            <AdBanner />

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold text-white">{weather.temp}°</span>
                    <span className="text-2xl text-muted">C</span>
                  </div>
                  <p className="text-lg text-muted mt-1 capitalize">{weather.description}</p>
                  <p className="text-sm text-muted-dark mt-1">Feels like {weather.feelsLike}°C</p>
                </div>
                <div>{getWeatherIcon(weather.description)}</div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
                <Droplets className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs text-muted">Humidity</p>
                <p className="text-lg font-bold text-white">{weather.humidity}%</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
                <Wind className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-xs text-muted">Wind Speed</p>
                <p className="text-lg font-bold text-white">{weather.windSpeed} km/h</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
                <Eye className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-xs text-muted">Visibility</p>
                <p className="text-lg font-bold text-white">{weather.visibility} km</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
                <Thermometer className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-xs text-muted">Pressure</p>
                <p className="text-lg font-bold text-white">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
