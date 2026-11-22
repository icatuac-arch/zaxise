'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useStreak } from '@/components/facts/StreakTracker'
import { getCategoryMeta } from '@/data/facts/categories'

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

interface CategoryCounts {
  categories: string[]
  counts: Record<string, number>
}

/* -------------------------------------------------------------------------- */
/*  Category gradients for cards                                              */
/* -------------------------------------------------------------------------- */

const CARD_GRADIENTS: string[] = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)',
  'linear-gradient(135deg, #667eea 0%, #4facfe 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
]

/* -------------------------------------------------------------------------- */
/*  Hero emojis                                                               */
/* -------------------------------------------------------------------------- */

const HERO_EMOJIS = ['🤯', '🌍', '🦁', '🚀', '🧠', '🌊', '🦕', '⚡', '🎭', '🔬']

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function DidYouKnowHome() {
  const { recordFactRead, recordCategoryExplored } = useStreak()

  /* ---- State ---- */
  const [mounted, setMounted] = useState(false)
  const [heroEmoji, setHeroEmoji] = useState('🤯')
  const [heroEmojiIdx, setHeroEmojiIdx] = useState(0)

  // Surprise Me
  const [surpriseFact, setSurpriseFact] = useState<Fact | null>(null)
  const [surpriseRevealed, setSurpriseRevealed] = useState(false)
  const [surpriseFlipping, setSurpriseFlipping] = useState(false)
  const [factsDiscovered, setFactsDiscovered] = useState(0)

  // Today's fact
  const [todayFact, setTodayFact] = useState<Fact | null>(null)
  const [knewIt, setKnewIt] = useState<boolean | null>(null)

  // Categories
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts | null>(null)
  const [categoryPreviewFacts, setCategoryPreviewFacts] = useState<Record<string, string>>({})

  // Quiz challenge
  const [quizFact, setQuizFact] = useState<Fact | null>(null)
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizBlank, setQuizBlank] = useState('')
  const [quizPicked, setQuizPicked] = useState<string | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Trending
  const [trendingFacts, setTrendingFacts] = useState<Fact[]>([])

  // Favorites
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const emojiInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ================================================================== */
  /*  Data fetching                                                      */
  /* ================================================================== */

  const fetchTodayFact = useCallback(async () => {
    try {
      const res = await fetch('/api/facts?today=true')
      const data = await res.json()
      setTodayFact(data.fact)
      if (data.fact) {
        recordFactRead()
        recordCategoryExplored(data.fact.category)
      }
    } catch { /* silent */ }
  }, [recordFactRead, recordCategoryExplored])

  const fetchRandomFact = useCallback(async () => {
    try {
      const res = await fetch('/api/facts?random=true')
      const data = await res.json()
      return data.fact as Fact
    } catch { return null }
  }, [])

  const fetchCategoryCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/facts?counts=true')
      const data: CategoryCounts = await res.json()
      setCategoryCounts(data)

      // Fetch a preview fact for each category (first 12)
      const previews: Record<string, string> = {}
      const cats = data.categories.slice(0, 16)
      await Promise.all(cats.map(async (cat) => {
        try {
          const r = await fetch(`/api/facts?category=${encodeURIComponent(cat)}&limit=1`)
          const d = await r.json()
          if (d.facts?.[0]) {
            previews[cat] = d.facts[0].text.slice(0, 80) + (d.facts[0].text.length > 80 ? '...' : '')
          }
        } catch { /* silent */ }
      }))
      setCategoryPreviewFacts(previews)
    } catch { /* silent */ }
  }, [])

  const fetchSurprise = useCallback(async () => {
    setSurpriseFlipping(true)
    setSurpriseRevealed(false)
    const fact = await fetchRandomFact()
    if (fact) {
      setSurpriseFact(fact)
      recordFactRead()
      recordCategoryExplored(fact.category)
      setFactsDiscovered(c => {
        const next = c + 1
        try { localStorage.setItem('dyk-discovered-today', String(next)) } catch {}
        return next
      })
    }
    setTimeout(() => {
      setSurpriseRevealed(true)
      setSurpriseFlipping(false)
    }, 600)
  }, [fetchRandomFact, recordFactRead, recordCategoryExplored])

  const fetchTrending = useCallback(async () => {
    try {
      const facts: Fact[] = []
      for (let i = 0; i < 4; i++) {
        const f = await fetchRandomFact()
        if (f) facts.push(f)
      }
      setTrendingFacts(facts)
    } catch { /* silent */ }
  }, [fetchRandomFact])

  const loadQuizChallenge = useCallback(async () => {
    const fact = await fetchRandomFact()
    if (!fact) return

    // Find a word to blank out (pick a significant word - 5+ chars)
    const words = fact.text.split(' ')
    const candidates = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length >= 5)
    if (candidates.length === 0) {
      setQuizFact(null)
      return
    }
    const target = candidates[Math.floor(Math.random() * candidates.length)]
    const cleanTarget = target.replace(/[^a-zA-Z]/g, '')

    setQuizFact(fact)
    setQuizAnswer(cleanTarget.toLowerCase())
    setQuizBlank(fact.text.replace(target, '_____'))
    setQuizPicked(null)

    // Generate 3 wrong options + 1 correct
    const wrongWords = ['Mercury', 'Saturn', 'Elephant', 'Diamond', 'Oxygen', 'Jupiter', 'Titanium', 'Lightning', 'Photon', 'Glacier', 'Volcano', 'Neptune', 'Quantum', 'Gravity', 'Helium']
    const wrongs = wrongWords.filter(w => w.toLowerCase() !== cleanTarget.toLowerCase()).sort(() => Math.random() - 0.5).slice(0, 3)
    const opts = [...wrongs, cleanTarget].sort(() => Math.random() - 0.5)
    setQuizOptions(opts)
  }, [fetchRandomFact])

  /* ================================================================== */
  /*  Init on mount                                                      */
  /* ================================================================== */

  useEffect(() => {
    setMounted(true)
    fetchTodayFact()
    fetchCategoryCounts()
    fetchSurprise()
    fetchTrending()
    loadQuizChallenge()

    // Load favorites
    try {
      const stored = localStorage.getItem('dyk-fav')
      if (stored) setFavorites(new Set(JSON.parse(stored)))
    } catch {}

    // Load today's discovered count
    try {
      const count = localStorage.getItem('dyk-discovered-today')
      if (count) setFactsDiscovered(parseInt(count) || 0)
    } catch {}

    // Rotate hero emoji
    emojiInterval.current = setInterval(() => {
      setHeroEmojiIdx(i => {
        const next = (i + 1) % HERO_EMOJIS.length
        setHeroEmoji(HERO_EMOJIS[next])
        return next
      })
    }, 2000)

    return () => {
      if (emojiInterval.current) clearInterval(emojiInterval.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ================================================================== */
  /*  Helpers                                                            */
  /* ================================================================== */

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem('dyk-fav', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const shareFact = (f: Fact) => {
    const text = `Did you know? ${f.text} (Source: ${f.source.name})`
    if (navigator.share) {
      navigator.share({ title: 'Did You Know?', text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
    }
  }

  const totalFactsCount = categoryCounts
    ? Object.values(categoryCounts.counts).reduce((a, b) => a + b, 0)
    : 40205

  const handleQuizPick = (option: string) => {
    setQuizPicked(option)
    if (option.toLowerCase() === quizAnswer.toLowerCase()) {
      setQuizScore(s => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div style={{ fontSize: '64px', animation: 'bounce 1s infinite' }}>🧠</div>
      </div>
    )
  }

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */

  return (
    <div className="min-w-0 overflow-x-hidden" style={{ color: 'var(--text)' }}>

      {/* ============================================================ */}
      {/*  HERO — "The WOW Zone"                                       */}
      {/* ============================================================ */}
      <section className="relative py-16 sm:py-24 text-center overflow-hidden">
        {/* Floating background emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {['🌟', '🦋', '🌈', '🔥', '💎', '🌸', '⚡', '🎯'].map((e, i) => (
            <span
              key={i}
              className="absolute text-3xl sm:text-4xl select-none"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
                opacity: 0.15,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>

        {/* Big animated emoji */}
        <div
          className="text-7xl sm:text-8xl mb-6 inline-block"
          style={{ animation: 'bounce 2s ease-in-out infinite' }}
          key={heroEmoji}
        >
          <span style={{ animation: 'pulse 0.5s ease-out' }}>{heroEmoji}</span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-[900] leading-[0.95] tracking-tight mb-4"
          style={{ fontSize: 'clamp(52px, 12vw, 120px)' }}
        >
          Did You{' '}
          <span style={{ color: '#FF6B6B' }}>K</span>
          <span style={{ color: '#4ECDC4' }}>n</span>
          <span style={{ color: '#FFE66D' }}>o</span>
          <span style={{ color: '#A78BFA' }}>w</span>
          <span
            className="inline-block"
            style={{ color: '#FF6B6B', animation: 'bounce 1.5s ease-in-out infinite' }}
          >
            ?
          </span>
        </h1>

        <p className="font-display text-xl sm:text-2xl max-w-xl mx-auto mb-3 px-4" style={{ color: 'var(--muted)' }}>
          <span style={{ fontWeight: 700, color: '#FF6B6B' }}>{totalFactsCount.toLocaleString()}+</span> Mind-Blowing Facts About <span style={{ fontStyle: 'italic' }}>EVERYTHING!</span>
        </p>

        {factsDiscovered > 0 && (
          <p className="font-mono text-sm mb-6 px-4" style={{ color: '#4ECDC4' }}>
            🏆 You&apos;ve discovered <strong>{factsDiscovered}</strong> facts today!
          </p>
        )}

        {/* Surprise Me Button */}
        <button
          onClick={fetchSurprise}
          className="relative inline-flex items-center gap-3 px-8 py-5 rounded-full font-display font-bold text-xl text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite',
            minHeight: '64px',
          }}
        >
          <span style={{ fontSize: '28px', animation: 'shake 2s ease-in-out infinite' }}>🎲</span>
          Surprise Me!
        </button>

        {/* Revealed Fact Card */}
        {surpriseFact && surpriseRevealed && (
          <div
            className="mt-10 mx-auto max-w-2xl px-4"
            style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div
              className="rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff',
              }}
            >
              {/* Category badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{getCategoryMeta(surpriseFact.category).emoji}</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
                >
                  {surpriseFact.category}
                </span>
              </div>

              {/* Fact text */}
              <p className="font-display text-xl sm:text-2xl leading-relaxed mb-5">
                {surpriseFact.text}
              </p>

              {/* Source */}
              <div className="text-sm opacity-60 mb-4">
                Source: {surpriseFact.source.name}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={fetchSurprise}
                  className="px-5 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#1a1a2e' }}
                >
                  🎲 Another one!
                </button>
                <button
                  onClick={() => toggleFav(surpriseFact.id)}
                  className="px-4 py-3 rounded-full text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  {favorites.has(surpriseFact.id) ? '❤️ Saved!' : '🤍 Save'}
                </button>
                <button
                  onClick={() => shareFact(surpriseFact)}
                  className="px-4 py-3 rounded-full text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flipping animation placeholder */}
        {surpriseFlipping && (
          <div className="mt-10 mx-auto max-w-2xl px-4">
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'flipCard 0.6s ease-out',
              }}
            >
              <span className="text-5xl" style={{ animation: 'spin 0.6s linear' }}>🎲</span>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/*  TODAY'S MIND-BLOWER                                          */}
      {/* ============================================================ */}
      {todayFact && (
        <section className="px-4 sm:px-6 mb-16">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC107 100%)',
              color: '#fff',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl" style={{ animation: 'pulse 2s infinite' }}>🤯</span>
                <span className="font-mono text-sm font-bold tracking-wider uppercase opacity-90">
                  Today&apos;s Mind-Blower
                </span>
              </div>

              <p className="font-display font-[600] leading-snug mb-6" style={{ fontSize: 'clamp(22px, 4vw, 38px)' }}>
                {todayFact.text}
              </p>

              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: 'rgba(255,255,255,0.25)' }}>
                  {getCategoryMeta(todayFact.category).emoji} {todayFact.category}
                </span>
                <span className="text-sm opacity-75">Source: {todayFact.source.name}</span>
              </div>

              {/* Interaction buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toggleFav(todayFact.id)}
                  className="px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  {favorites.has(todayFact.id) ? '❤️ Saved' : '🤍 Save'}
                </button>
                <button
                  onClick={() => shareFact(todayFact)}
                  className="px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  📤 Share
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm font-medium opacity-90">Did you know this?</span>
                  <button
                    onClick={() => setKnewIt(true)}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all hover:scale-110 ${knewIt === true ? 'ring-2 ring-white' : ''}`}
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    Yes!
                  </button>
                  <button
                    onClick={() => setKnewIt(false)}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all hover:scale-110 ${knewIt === false ? 'ring-2 ring-white' : ''}`}
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    No!
                  </button>
                </div>
              </div>

              {knewIt !== null && (
                <p className="mt-3 text-sm opacity-80" style={{ animation: 'slideUp 0.3s ease-out' }}>
                  {knewIt ? '🧠 Impressive! You already knew that!' : '🤯 Now you do! Share it with a friend!'}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  CATEGORY WONDERLAND — "Explore the World"                    */}
      {/* ============================================================ */}
      {categoryCounts && (
        <section className="px-4 sm:px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="font-display font-[800] leading-tight mb-2"
                style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
              >
                <span style={{ fontSize: '1.2em' }}>🌎</span> Explore {categoryCounts.categories.length} Worlds of Knowledge
              </h2>
              <p className="font-display text-lg" style={{ color: 'var(--muted)' }}>
                Each world has 1,000+ mind-blowing facts waiting for you!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {categoryCounts.categories.map((cat, idx) => {
                const meta = getCategoryMeta(cat)
                const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]
                const count = categoryCounts.counts[cat] || 0
                return (
                  <Link
                    href={`/browse?category=${encodeURIComponent(cat)}`}
                    key={cat}
                    className="group relative rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden"
                    style={{ background: gradient, minHeight: '180px' }}
                  >
                    {/* Hover shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(135deg, white 0%, transparent 50%)' }}
                    />

                    <div
                      className="text-5xl sm:text-6xl mb-3 transition-transform duration-300 group-hover:scale-110 inline-block"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                    >
                      {meta.emoji}
                    </div>
                    <div className="font-display font-bold text-base sm:text-lg leading-tight mb-1">
                      {cat}
                    </div>
                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2"
                      style={{ background: 'rgba(255,255,255,0.25)' }}
                    >
                      🔥 {count.toLocaleString()} facts!
                    </div>
                    {categoryPreviewFacts[cat] && (
                      <p className="text-xs opacity-75 leading-snug line-clamp-2">
                        {categoryPreviewFacts[cat]}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  QUICK CHALLENGE — "Test Your Brain!"                         */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 mb-16 relative">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  background: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#FF8E53', '#43e97b'][Math.floor(Math.random() * 6)],
                  animation: `confettiFall ${1.5 + Math.random() * 2}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div
          className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            color: '#fff',
          }}
        >
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold" style={{ background: 'rgba(78, 205, 196, 0.2)', color: '#4ECDC4' }}>
            Score: {quizScore}
          </div>

          <div className="flex items-center gap-2 mb-5">
            <span className="text-3xl">🧩</span>
            <h2 className="font-display font-bold text-2xl">Test Your Brain!</h2>
          </div>

          {quizFact ? (
            <>
              <p className="font-display text-lg sm:text-xl leading-relaxed mb-6" style={{ opacity: 0.9 }}>
                {quizBlank}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {quizOptions.map((opt) => {
                  const isCorrect = opt.toLowerCase() === quizAnswer.toLowerCase()
                  const isPicked = quizPicked === opt
                  let bg = 'rgba(255,255,255,0.1)'
                  if (quizPicked) {
                    if (isCorrect) bg = 'linear-gradient(135deg, #43e97b, #38f9d7)'
                    else if (isPicked) bg = 'linear-gradient(135deg, #f5576c, #ff6a88)'
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => !quizPicked && handleQuizPick(opt)}
                      disabled={!!quizPicked}
                      className="px-4 py-4 rounded-xl font-display font-bold text-base sm:text-lg transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: bg,
                        color: (quizPicked && (isCorrect || isPicked)) ? '#1a1a2e' : '#fff',
                        cursor: quizPicked ? 'default' : 'pointer',
                        minHeight: '56px',
                      }}
                    >
                      {opt}
                      {quizPicked && isCorrect && ' ✓'}
                      {quizPicked && isPicked && !isCorrect && ' ✗'}
                    </button>
                  )
                })}
              </div>

              {quizPicked && (
                <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                  <p className="text-sm opacity-70 mb-4">
                    {quizPicked.toLowerCase() === quizAnswer.toLowerCase()
                      ? '🎉 Correct! You\'re a genius!'
                      : `😅 Not quite! The answer was "${quizAnswer}"`}
                  </p>
                  <button
                    onClick={loadQuizChallenge}
                    className="px-5 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' }}
                  >
                    Next Question →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <button
                onClick={loadQuizChallenge}
                className="px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4ECDC4, #43e97b)', color: '#1a1a2e' }}
              >
                Load Challenge
              </button>
            </div>
          )}

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/facts/challenge" className="text-sm font-bold hover:underline" style={{ color: '#4ECDC4' }}>
              🎮 Play More Challenges →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FUN STATS STRIP                                              */}
      {/* ============================================================ */}
      <section className="mb-16 overflow-hidden">
        <div
          className="py-8 sm:py-10"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            color: '#fff',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div className="text-3xl mb-1">📚</div>
              <div className="font-display font-[900] text-3xl sm:text-4xl">{totalFactsCount.toLocaleString()}</div>
              <div className="font-mono text-xs uppercase tracking-wider opacity-80">Facts</div>
            </div>
            <div style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
              <div className="text-3xl mb-1">🌍</div>
              <div className="font-display font-[900] text-3xl sm:text-4xl">{categoryCounts?.categories.length ?? 40}</div>
              <div className="font-mono text-xs uppercase tracking-wider opacity-80">Categories</div>
            </div>
            <div style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
              <div className="text-3xl mb-1">🧩</div>
              <div className="font-display font-[900] text-3xl sm:text-4xl">1,000+</div>
              <div className="font-mono text-xs uppercase tracking-wider opacity-80">Quiz Questions</div>
            </div>
            <div style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
              <div className="text-3xl mb-1">🤩</div>
              <div className="font-display font-[900] text-3xl sm:text-4xl" style={{ fontFamily: 'serif' }}>∞</div>
              <div className="font-mono text-xs uppercase tracking-wider opacity-80">Fun</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRENDING — "Everyone's Loving These"                         */}
      {/* ============================================================ */}
      {trendingFacts.length > 0 && (
        <section className="px-4 sm:px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-[800] text-2xl sm:text-3xl mb-6 text-center">
              🔥 Everyone&apos;s Loving These
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {trendingFacts.map((fact, idx) => (
                <div
                  key={fact.id}
                  className="snap-start flex-shrink-0 w-72 sm:w-80 rounded-2xl p-5 text-white relative overflow-hidden"
                  style={{
                    background: CARD_GRADIENTS[(idx * 3) % CARD_GRADIENTS.length],
                    minHeight: '200px',
                  }}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.25)' }}>
                    🔥 Hot!
                  </div>
                  <span className="text-3xl mb-3 inline-block">{getCategoryMeta(fact.category).emoji}</span>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">{fact.category}</div>
                  <p className="font-display text-sm leading-relaxed line-clamp-4">{fact.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  CALL TO ACTION — "Start Your Adventure"                      */}
      {/* ============================================================ */}
      <section className="px-4 sm:px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="font-display font-[800] leading-tight mb-8"
            style={{ fontSize: 'clamp(28px, 5vw, 44px)' }}
          >
            🗺️ Start Your Adventure
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { emoji: '🎮', label: 'Play Quiz', href: '/quiz', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
              { emoji: '🗺️', label: 'Explore Map', href: '/map', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
              { emoji: '🏆', label: 'Challenge Mode', href: '/challenge', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
              { emoji: '📚', label: 'Browse All', href: '/browse', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
              { emoji: '🎓', label: 'Learn Something', href: '/learn', gradient: 'linear-gradient(135deg, #fccb90, #d57eeb)' },
            ].map(cta => (
              <Link
                key={cta.href}
                href={cta.href}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-display font-bold text-lg text-white transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                style={{ background: cta.gradient, minHeight: '56px' }}
              >
                <span className="text-2xl">{cta.emoji}</span>
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CSS Animations                                               */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes flipCard {
          0% { transform: rotateY(0deg) scale(0.8); opacity: 0.5; }
          50% { transform: rotateY(90deg) scale(0.9); opacity: 0.7; }
          100% { transform: rotateY(180deg) scale(1); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
