'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, X, Download, ExternalLink, Calendar, Camera,
  ChevronRight, Loader2, ImageIcon
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Types ─────────────────────────────────────────────────
interface NasaImage {
  nasa_id: string
  title: string
  description: string
  date_created: string
  thumbnail: string
  href: string
}

interface ApodData {
  title: string
  explanation: string
  url: string
  hdurl?: string
  date: string
  media_type: string
  copyright?: string
}

// ─── Categories ────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Nebulae', query: 'nebula' },
  { label: 'Galaxies', query: 'galaxy' },
  { label: 'Earth from Space', query: 'earth+from+space' },
  { label: 'Planets', query: 'planets+solar+system' },
  { label: 'Moon', query: 'moon+surface' },
  { label: 'Mars', query: 'mars+surface' },
  { label: 'Space Station', query: 'international+space+station' },
  { label: 'Astronauts', query: 'astronaut+space' },
]

// ─── Helpers ───────────────────────────────────────────────
function parseNasaImages(data: unknown): NasaImage[] {
  try {
    const collection = (data as { collection?: { items?: unknown[] } })?.collection
    if (!collection?.items) return []
    return (collection.items as Array<{
      data?: Array<{ nasa_id?: string; title?: string; description?: string; date_created?: string }>
      links?: Array<{ href?: string }>
    }>)
      .filter((item) => item.links?.[0]?.href && item.data?.[0])
      .map((item) => {
        const d = item.data![0]
        return {
          nasa_id: d.nasa_id || '',
          title: d.title || 'Untitled',
          description: (d.description || '').slice(0, 300),
          date_created: d.date_created || '',
          thumbnail: item.links![0].href!,
          href: item.links![0].href!.replace('~thumb', '~medium'),
        }
      })
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ─── Image Modal ───────────────────────────────────────────
function ImageModal({
  image,
  onClose,
}: {
  image: NasaImage | null
  onClose: () => void
}) {
  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-card-bg border border-card-border rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-dark-bg/80 border border-card-border flex items-center justify-center text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="flex-1 min-h-0 bg-black flex items-center justify-center">
          <img
            src={image.href}
            alt={image.title}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>

        {/* Info */}
        <div className="p-6 border-t border-card-border">
          <h3 className="font-heading text-xl font-bold mb-2">{image.title}</h3>
          {image.description && (
            <p className="text-muted text-sm mb-3 line-clamp-3">{image.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(image.date_created)}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={image.href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-3 py-1.5 rounded-lg bg-card-border text-sm text-muted hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <a
                href={`https://images.nasa.gov/details/${image.nasa_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-primary text-sm text-white flex items-center gap-1.5 transition-colors hover:bg-primary-hover"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                NASA Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── APOD Card ─────────────────────────────────────────────
function ApodSection({ apod }: { apod: ApodData | null }) {
  if (!apod) return null

  return (
    <div className="relative rounded-2xl overflow-hidden border border-card-border group">
      {apod.media_type === 'image' ? (
        <div className="relative aspect-[21/9] overflow-hidden">
          <img
            src={apod.url}
            alt={apod.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
        </div>
      ) : (
        <div className="relative aspect-video">
          <iframe
            src={apod.url}
            title={apod.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold">
            Astronomy Picture of the Day
          </span>
          <span className="text-muted text-sm">{formatDate(apod.date)}</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">{apod.title}</h2>
        <p className="text-muted text-sm md:text-base line-clamp-2 max-w-3xl">
          {apod.explanation}
        </p>
        {apod.copyright && (
          <p className="text-muted/60 text-xs mt-2">Credit: {apod.copyright}</p>
        )}
        {apod.hdurl && (
          <a
            href={apod.hdurl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-secondary text-sm hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            View HD Image
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function SpaceGalleryPage() {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [images, setImages] = useState<NasaImage[]>([])
  const [loading, setLoading] = useState(false)
  const [apodLoading, setApodLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<NasaImage | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch APOD
  useEffect(() => {
    setApodLoading(true)
    fetch('/api/apod')
      .then(r => r.json())
      .then(data => {
        if (!data.error) setApod(data)
      })
      .catch(() => {})
      .finally(() => setApodLoading(false))
  }, [])

  // Fetch images for category/search
  const fetchImages = useCallback(async (query: string, pageNum: number, append = false) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/nasa-images?q=${encodeURIComponent(query)}&page=${pageNum}`)
      const data = await res.json()
      const parsed = parseNasaImages(data)
      setImages(prev => append ? [...prev, ...parsed] : parsed)
      setHasMore(parsed.length >= 20)
    } catch {
      if (!append) setImages([])
      setHasMore(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const q = searchQuery || activeCategory.query
    setPage(1)
    fetchImages(q, 1)
  }, [activeCategory, searchQuery, fetchImages])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    const q = searchQuery || activeCategory.query
    fetchImages(q, nextPage, true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchInput('')
  }

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* Hero / APOD */}
      <section className="max-w-7xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Space Photo Gallery
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Explore the cosmos through NASA&apos;s public domain imagery. From distant nebulae to astronauts in orbit.
          </p>
        </div>

        {/* APOD */}
        {apodLoading ? (
          <div className="aspect-[21/9] rounded-2xl bg-card-bg border border-card-border flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-muted animate-spin" />
          </div>
        ) : (
          <ApodSection apod={apod} />
        )}
      </section>

      {/* Search + Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-4" ref={scrollRef}>
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search NASA's image library..."
              className="w-full pl-12 pr-20 py-3 rounded-xl bg-card-bg border border-card-border focus:border-primary/50 focus:outline-none text-[#E2E8F0] placeholder:text-muted-dark transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Go
            </button>
          </div>
        </form>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.query}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory.query === cat.query
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-card-bg border border-card-border text-muted hover:text-[#E2E8F0] hover:border-primary/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {searchQuery && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-muted text-sm">Results for:</span>
            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium flex items-center gap-1">
              &ldquo;{searchQuery}&rdquo;
              <button onClick={clearSearch}>
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </section>

      <AdBanner />

      {/* Image Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading && images.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-muted animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-lg">No images found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <>
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {images.map((img) => (
                <div
                  key={img.nasa_id}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="relative rounded-xl overflow-hidden border border-card-border bg-card-bg transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <img
                      src={img.thumbnail}
                      alt={img.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h4 className="font-heading font-semibold text-sm line-clamp-2 mb-1">{img.title}</h4>
                      <div className="flex items-center gap-1 text-muted text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(img.date_created)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-card-bg border border-card-border hover:border-primary/50 text-muted hover:text-white font-heading font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
