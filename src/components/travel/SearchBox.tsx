'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, MapPin, Globe, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { COUNTRIES } from '@/data/travel/destinations'

interface SearchResult {
  type: 'country' | 'city'
  name: string
  subtitle: string
  flag: string
  href: string
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []
  for (const country of COUNTRIES) {
    results.push({
      type: 'country',
      name: country.name,
      subtitle: `${country.continent} · ${country.states.reduce((a, s) => a + s.cities.length, 0)} cities`,
      flag: country.flag,
      href: `/travel/country/${country.slug}`,
    })
    for (const state of country.states) {
      for (const city of state.cities) {
        results.push({
          type: 'city',
          name: city.name,
          subtitle: `${country.name} · ${country.flag}`,
          flag: country.flag,
          href: `/travel/country/${country.slug}/${state.id}/${city.id}`,
        })
      }
    }
  }
  return results
}

interface SearchBoxProps {
  placeholder?: string
  className?: string
  inputClassName?: string
  showButton?: boolean
  onSearch?: (query: string) => void
}

export default function SearchBox({
  placeholder = 'Search destinations...',
  className = '',
  inputClassName = '',
  showButton = false,
}: SearchBoxProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return index
      .filter((r) => r.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, index])

  useEffect(() => {
    setSelectedIdx(-1)
    setOpen(results.length > 0)
  }, [results])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigate = (href: string) => {
    setQuery('')
    setOpen(false)
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIdx >= 0 && results[selectedIdx]) {
        navigate(results[selectedIdx].href)
      } else if (results.length > 0) {
        navigate(results[0].href)
      } else if (query.length >= 2) {
        router.push(`/travel/destinations?q=${encodeURIComponent(query)}`)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleButtonClick = () => {
    if (results.length > 0) {
      navigate(results[0].href)
    } else if (query.length >= 2) {
      router.push(`/travel/destinations?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`pl-9 pr-4 py-2 w-full text-sm rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all ${inputClassName}`}
      />
      {showButton && (
        <button
          onClick={handleButtonClick}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
        >
          Search
        </button>
      )}

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((r, i) => (
            <button
              key={r.href}
              onClick={() => navigate(r.href)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                i === selectedIdx ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-lg flex-shrink-0">{r.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{r.name}</p>
                <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>
              </div>
              <div className="flex-shrink-0">
                {r.type === 'country' ? (
                  <Globe className="w-3.5 h-3.5 text-slate-300" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
            </button>
          ))}
          {query.length >= 2 && (
            <button
              onClick={() => router.push(`/travel/destinations?q=${encodeURIComponent(query)}`)}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs text-sky-600 font-medium hover:bg-sky-50 border-t border-slate-100 transition-colors"
            >
              View all results for &quot;{query}&quot; <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
