'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronDown, ChevronUp, Heart, Share2,
  Loader2, Plus, X, BookOpen, Sparkles, Shuffle,
} from 'lucide-react'
import { ShareCard } from '@/components/facts/ShareCard'

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Fact {
  id: string
  category: string
  text: string
  source: { name: string; url: string }
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  publishedAt: string
}

interface CuratedCollection {
  id: string
  title: string
  description: string
  emoji: string
  /** API query params to fetch facts for this collection */
  category?: string
  searchQuery?: string
  /** Estimated / display fact count */
  factCount: number
}

interface CustomCollection {
  id: string
  title: string
  description: string
  emoji: string
  factIds: string[]
  createdAt: string
}

/* -------------------------------------------------------------------------- */
/*  20 curated collections                                                     */
/* -------------------------------------------------------------------------- */

const CURATED: CuratedCollection[] = [
  {
    id: 'space',
    title: 'Mind-Blowing Space Facts',
    description: 'The cosmos is stranger than fiction — neutron stars, black holes, and interstellar beer clouds.',
    emoji: '🚀',
    category: 'Space',
    factCount: 40,
  },
  {
    id: 'animals',
    title: 'Weird Animal Behavior',
    description: 'Creatures of Earth are stranger, smarter, and more surprising than you ever imagined.',
    emoji: '🐾',
    category: 'Animals',
    factCount: 35,
  },
  {
    id: 'ancient',
    title: 'Ancient Civilizations',
    description: 'Empires that shaped the modern world — from Indus Valley flush toilets to Mali gold crashes.',
    emoji: '🏛️',
    category: 'History',
    factCount: 30,
  },
  {
    id: 'food',
    title: 'Food Origins',
    description: 'Where your favorite foods really come from — purple carrots, prison lobster, and 5,000 years of spice.',
    emoji: '🍳',
    category: 'Food',
    factCount: 28,
  },
  {
    id: 'medicine',
    title: 'Medical Breakthroughs',
    description: 'Discoveries that changed what it means to be human — from penicillin to CRISPR.',
    emoji: '⚕️',
    category: 'Medicine',
    factCount: 25,
  },
  {
    id: 'math',
    title: 'Math is Beautiful',
    description: 'Prime cicadas, birthday paradoxes, infinite shuffles — numbers are weirder than you think.',
    emoji: '🔢',
    category: 'Math',
    factCount: 22,
  },
  {
    id: 'ocean',
    title: 'Ocean Mysteries',
    description: 'We know more about Mars than the deep sea. Hydrothermal vents, lost artifacts, and the abyss.',
    emoji: '🌊',
    category: 'Ocean',
    factCount: 30,
  },
  {
    id: 'inventions',
    title: 'Inventions That Changed the World',
    description: 'From the wheel to the internet — the stories behind the ideas that remade civilization.',
    emoji: '💡',
    category: 'Inventions',
    factCount: 32,
  },
  {
    id: 'mythology',
    title: 'Mythology & Legends',
    description: 'Stories that defined cultures across millennia — gods, heroes, monsters, and creation myths.',
    emoji: '🐉',
    category: 'Mythology',
    factCount: 20,
  },
  {
    id: 'climate',
    title: 'Climate Science',
    description: 'The science of a warming planet — feedback loops, tipping points, and unexpected consequences.',
    emoji: '🌦️',
    category: 'Climate & Weather',
    factCount: 24,
  },
  {
    id: 'records',
    title: 'World Records',
    description: 'The extremes of human and natural achievement — tallest, fastest, oldest, strangest.',
    emoji: '🏅',
    category: 'World Records',
    factCount: 26,
  },
  {
    id: 'psychology',
    title: 'Psychology Tricks',
    description: 'How your brain deceives you — cognitive biases, optical illusions, and the mysteries of consciousness.',
    emoji: '🧠',
    category: 'Psychology',
    factCount: 28,
  },
  {
    id: 'music',
    title: 'Music History',
    description: 'From ancient bone flutes to synthesizers — the evolution of humanity\'s universal language.',
    emoji: '🎵',
    category: 'Music',
    factCount: 22,
  },
  {
    id: 'engineering',
    title: 'Engineering Marvels',
    description: 'Structures that defied their eras — Roman concrete, Gothic cathedrals, deep-sea tunnels.',
    emoji: '⚙️',
    category: 'Engineering',
    factCount: 25,
  },
  {
    id: 'language',
    title: 'Language Quirks',
    description: 'Tittles, click consonants, whistled languages, and why grammar is gloriously strange.',
    emoji: '🗣️',
    category: 'Language',
    factCount: 24,
  },
  {
    id: 'art',
    title: 'Art Secrets',
    description: 'Hidden symbols, stolen masterpieces, coded messages, and pigments that changed painting.',
    emoji: '🎨',
    category: 'Art',
    factCount: 20,
  },
  {
    id: 'sports',
    title: 'Sports Records',
    description: 'Athletic achievements that seem impossible — from ancient Olympics to modern extremes.',
    emoji: '🏆',
    category: 'Sports',
    factCount: 22,
  },
  {
    id: 'philosophy',
    title: 'Philosophy Questions',
    description: 'The questions that have haunted brilliant minds for millennia — and still have no answers.',
    emoji: '🤔',
    category: 'Philosophy',
    factCount: 18,
  },
  {
    id: 'archaeology',
    title: 'Archaeological Discoveries',
    description: 'Civilizations buried under sand and soil — and the finds that rewrote human history.',
    emoji: '🏺',
    category: 'Archaeology',
    factCount: 20,
  },
  {
    id: 'energy',
    title: 'Energy Future',
    description: 'From coal\'s dominance to fusion dreams — the science and stakes of powering civilization.',
    emoji: '⚡',
    category: 'Energy',
    factCount: 18,
  },
]

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  easy:   { bg: 'rgba(34,197,94,0.12)',  text: '#16a34a' },
  medium: { bg: 'rgba(234,179,8,0.12)',  text: '#ca8a04' },
  hard:   { bg: 'rgba(239,68,68,0.12)',  text: '#dc2626' },
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function CollectionsPage() {
  /* ---- curated state ---- */
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [factsMap, setFactsMap] = useState<Record<string, Fact[]>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [favCollections, setFavCollections] = useState<Set<string>>(new Set())

  /* ---- custom collections ---- */
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newEmoji, setNewEmoji] = useState('📌')

  /* ---- share modal ---- */
  const [shareFactModal, setShareFactModal] = useState<Fact | null>(null)

  /* ---- toast ---- */
  const [toast, setToast] = useState('')

  /* ---- tabs ---- */
  const [tab, setTab] = useState<'curated' | 'custom'>('curated')

  /* ================================================================== */
  /*  Persistence                                                         */
  /* ================================================================== */

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dyk-col-fav')
      if (stored) setFavCollections(new Set(JSON.parse(stored)))
      const custom = localStorage.getItem('dyk-custom-collections')
      if (custom) setCustomCollections(JSON.parse(custom))
    } catch { /* silent */ }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const toggleFav = (id: string) => {
    setFavCollections(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Removed from favorites') }
      else { next.add(id); showToast('Collection saved!') }
      localStorage.setItem('dyk-col-fav', JSON.stringify([...next]))
      return next
    })
  }

  /* ================================================================== */
  /*  Fetch facts for a curated collection                               */
  /* ================================================================== */

  const fetchCollectionFacts = useCallback(async (col: CuratedCollection) => {
    if (factsMap[col.id]) return // already loaded
    setLoadingId(col.id)
    try {
      const params = new URLSearchParams()
      params.set('limit', '30')
      if (col.category) params.set('category', col.category)
      if (col.searchQuery) params.set('q', col.searchQuery)
      const res = await fetch(`/api/facts?${params}`)
      const data = await res.json()
      setFactsMap(prev => ({ ...prev, [col.id]: data.facts || [] }))
    } catch {
      setFactsMap(prev => ({ ...prev, [col.id]: [] }))
    }
    setLoadingId(null)
  }, [factsMap])

  const handleExpandCurated = (col: CuratedCollection) => {
    if (expandedId === col.id) {
      setExpandedId(null)
    } else {
      setExpandedId(col.id)
      fetchCollectionFacts(col)
    }
  }

  /* ================================================================== */
  /*  Custom collections                                                  */
  /* ================================================================== */

  const saveCustom = () => {
    if (!newTitle.trim()) return
    const nc: CustomCollection = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'My custom collection',
      emoji: newEmoji || '📌',
      factIds: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [...customCollections, nc]
    setCustomCollections(updated)
    localStorage.setItem('dyk-custom-collections', JSON.stringify(updated))
    setNewTitle('')
    setNewDesc('')
    setNewEmoji('📌')
    setShowCreateModal(false)
    showToast('Collection created!')
  }

  const deleteCustom = (id: string) => {
    const updated = customCollections.filter(c => c.id !== id)
    setCustomCollections(updated)
    localStorage.setItem('dyk-custom-collections', JSON.stringify(updated))
    showToast('Collection deleted')
  }

  /* ================================================================== */
  /*  Share a fact                                                        */
  /* ================================================================== */

  const handleShareFact = (fact: Fact) => {
    const text = `Did You Know?\n\n"${fact.text}"\n\n— Source: ${fact.source.name}\n\n🔗 didyouknow.vercel.app/share/${fact.id}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Did You Know?', text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => showToast('Copied!'))
    }
  }

  /* ================================================================== */
  /*  Render                                                              */
  /* ================================================================== */

  return (
    <div className="max-w-4xl mx-auto px-6 py-12" style={{ color: 'var(--text)' }}>

      {/* Back nav */}
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-wide inline-flex items-center gap-1 hover:opacity-60 transition-opacity mb-8"
        style={{ color: 'var(--muted)' }}
      >
        <ChevronLeft size={14} /> Back
      </Link>

      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="font-display font-[800] leading-tight tracking-tight mb-3"
          style={{ fontSize: 'clamp(36px, 7vw, 64px)' }}
        >
          Curated{' '}
          <span className="italic" style={{ color: 'var(--accent)' }}>Collections</span>
        </h1>
        <p className="font-display italic text-lg" style={{ color: 'var(--muted)' }}>
          {CURATED.length} themed collections — plus build your own
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'curated' as const, label: 'Curated', icon: BookOpen },
          { id: 'custom' as const, label: `My Collections (${customCollections.length})`, icon: Sparkles },
        ].map(t => (
          <button
            key={t.id}
            className={`pill ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <t.icon size={13} className="mr-1.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/*  CURATED TAB                                                     */}
      {/* ============================================================== */}
      {tab === 'curated' && (
        <div className="space-y-3">
          {CURATED.map(col => {
            const isOpen = expandedId === col.id
            const isFav = favCollections.has(col.id)
            const facts = factsMap[col.id] || []
            const isLoading = loadingId === col.id

            return (
              <div
                key={col.id}
                style={{ border: '1.5px solid var(--text)' }}
              >
                {/* Collection header */}
                <button
                  className="w-full text-left p-5 flex items-center gap-4 transition-colors hover:bg-[var(--surface)] group"
                  onClick={() => handleExpandCurated(col)}
                >
                  {/* Emoji square */}
                  <div
                    className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'var(--surface)', border: '1px solid var(--muted)' }}
                  >
                    {col.emoji}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg font-bold leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {col.title}
                    </h2>
                    <p
                      className="font-display italic text-sm mt-0.5 line-clamp-1"
                      style={{ color: 'var(--muted)' }}
                    >
                      {col.description}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="font-mono text-[10px] tracking-[0.12em] uppercase hidden sm:block"
                      style={{ color: 'var(--muted)' }}
                    >
                      ~{col.factCount} facts
                    </span>
                    <button
                      className="p-1.5 hover:opacity-60 transition-opacity"
                      onClick={e => { e.stopPropagation(); toggleFav(col.id) }}
                      aria-label="Favorite"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? 'currentColor' : 'none'}
                        style={{ color: isFav ? 'var(--accent)' : 'var(--muted)' }}
                      />
                    </button>
                    {isOpen ? (
                      <ChevronUp size={18} style={{ color: 'var(--muted)' }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: 'var(--muted)' }} />
                    )}
                  </div>
                </button>

                {/* Expanded facts */}
                {isOpen && (
                  <div style={{ borderTop: '1.5px solid var(--text)' }}>
                    {/* Description banner */}
                    <div
                      className="px-5 py-3 font-display italic text-sm"
                      style={{ background: 'var(--surface)', color: 'var(--muted)', borderBottom: '1px dashed var(--muted)' }}
                    >
                      {col.description}
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin" size={24} style={{ color: 'var(--muted)' }} />
                      </div>
                    ) : facts.length === 0 ? (
                      <div className="py-10 text-center font-display italic" style={{ color: 'var(--muted)' }}>
                        No facts found for this collection yet.
                      </div>
                    ) : (
                      facts.map((fact, i) => (
                        <div
                          key={fact.id}
                          className="px-5 py-5 flex gap-4"
                          style={{
                            borderBottom: i < facts.length - 1 ? '1px dashed var(--muted)' : 'none',
                          }}
                        >
                          {/* Index */}
                          <span
                            className="font-mono text-xs flex-shrink-0 mt-1"
                            style={{ color: 'var(--muted)', width: '24px' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5"
                                style={{
                                  border: '1px solid var(--muted)',
                                  color: 'var(--muted)',
                                  borderRadius: '999px',
                                }}
                              >
                                {fact.category}
                              </span>
                              {fact.difficulty && (
                                <span
                                  className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5"
                                  style={{
                                    background: DIFFICULTY_COLORS[fact.difficulty]?.bg || 'transparent',
                                    color: DIFFICULTY_COLORS[fact.difficulty]?.text || 'var(--muted)',
                                    borderRadius: '999px',
                                  }}
                                >
                                  {fact.difficulty}
                                </span>
                              )}
                            </div>

                            <p className="font-display text-base leading-relaxed">{fact.text}</p>

                            <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                              <a
                                href={fact.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] tracking-[0.12em] uppercase hover:underline"
                                style={{ color: 'var(--muted)' }}
                              >
                                {fact.source.name}
                              </a>
                              <div className="flex items-center gap-1">
                                <button
                                  className="p-1.5 hover:opacity-60 transition-opacity"
                                  onClick={() => setShareFactModal(fact)}
                                  title="Share this fact"
                                >
                                  <Share2 size={14} style={{ color: 'var(--muted)' }} />
                                </button>
                                <a
                                  href={`/share/${fact.id}`}
                                  className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 hover:opacity-60 transition-opacity"
                                  style={{ border: '1px solid var(--muted)', color: 'var(--muted)' }}
                                >
                                  Share link
                                </a>
                              </div>
                            </div>

                            {fact.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {fact.tags.slice(0, 4).map(tag => (
                                  <span
                                    key={tag}
                                    className="font-mono text-[9px] px-1.5 py-0.5"
                                    style={{
                                      background: 'var(--surface)',
                                      color: 'var(--muted)',
                                      borderRadius: '999px',
                                    }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    {/* Footer: load more link */}
                    {!isLoading && facts.length > 0 && (
                      <div
                        className="px-5 py-3 flex items-center justify-between"
                        style={{ borderTop: '1px dashed var(--muted)', background: 'var(--surface)' }}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--muted)' }}>
                          {facts.length} facts shown
                        </span>
                        <Link
                          href={col.category ? `/browse?category=${encodeURIComponent(col.category)}` : '/browse'}
                          className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline flex items-center gap-1"
                          style={{ color: 'var(--accent)' }}
                        >
                          View all in {col.category || 'Browse'} <ChevronDown size={11} className="rotate-[-90deg]" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/*  CUSTOM COLLECTIONS TAB                                          */}
      {/* ============================================================== */}
      {tab === 'custom' && (
        <div>
          {/* Create button */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-display italic" style={{ color: 'var(--muted)' }}>
              Build and save your own themed collections.
            </p>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={14} /> New Collection
            </button>
          </div>

          {customCollections.length === 0 ? (
            <div
              className="text-center py-20 flex flex-col items-center gap-4"
              style={{ border: '1.5px dashed var(--muted)' }}
            >
              <span className="text-5xl">📚</span>
              <p className="font-display italic text-xl" style={{ color: 'var(--muted)' }}>
                No custom collections yet.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={14} /> Create your first collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customCollections.map(col => (
                <div
                  key={col.id}
                  className="p-5 flex flex-col gap-3"
                  style={{ border: '1.5px solid var(--text)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{col.emoji}</span>
                      <div>
                        <h3 className="font-display font-bold text-lg leading-tight">{col.title}</h3>
                        <p className="font-display italic text-sm" style={{ color: 'var(--muted)' }}>
                          {col.description}
                        </p>
                      </div>
                    </div>
                    <button
                      className="p-1 hover:opacity-60 transition-opacity flex-shrink-0"
                      onClick={() => deleteCustom(col.id)}
                      aria-label="Delete collection"
                    >
                      <X size={16} style={{ color: 'var(--muted)' }} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: 'var(--muted)' }}
                    >
                      {col.factIds.length} facts · created {new Date(col.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/browse`}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] hover:underline flex items-center gap-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      Browse facts <Shuffle size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/*  Create Collection Modal                                         */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false) }}
        >
          <div
            className="w-full max-w-md p-6"
            style={{ background: 'var(--bg)', border: '2px solid var(--text)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">New Collection</h2>
              <button
                className="p-1 hover:opacity-60 transition-opacity"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Emoji */}
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.12em] block mb-1.5" style={{ color: 'var(--muted)' }}>
                  Emoji
                </label>
                <input
                  type="text"
                  value={newEmoji}
                  onChange={e => setNewEmoji(e.target.value)}
                  maxLength={2}
                  className="w-16 text-2xl text-center bg-transparent outline-none p-2"
                  style={{ border: '1.5px solid var(--text)' }}
                />
              </div>

              {/* Title */}
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.12em] block mb-1.5" style={{ color: 'var(--muted)' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="My Favourite Space Facts"
                  className="w-full bg-transparent outline-none font-display text-lg p-3"
                  style={{ border: '1.5px solid var(--text)', color: 'var(--text)' }}
                  onKeyDown={e => e.key === 'Enter' && saveCustom()}
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.12em] block mb-1.5" style={{ color: 'var(--muted)' }}>
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="What's this collection about?"
                  rows={2}
                  className="w-full bg-transparent outline-none font-display text-base p-3 resize-none"
                  style={{ border: '1.5px solid var(--text)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="btn flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={saveCustom}
                disabled={!newTitle.trim()}
                style={{ opacity: newTitle.trim() ? 1 : 0.4 }}
              >
                <Plus size={14} /> Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/*  Share Fact Modal                                                */}
      {/* ============================================================== */}
      {shareFactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShareFactModal(null) }}
        >
          <div
            className="w-full max-w-lg"
            style={{ background: 'var(--bg)', border: '2px solid var(--text)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1.5px solid var(--text)' }}>
              <h2 className="font-display font-bold text-xl">Share Fact</h2>
              <button className="p-1 hover:opacity-60 transition-opacity" onClick={() => setShareFactModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <ShareCard fact={shareFactModal} />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/*  Toast                                                           */}
      {/* ============================================================== */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
