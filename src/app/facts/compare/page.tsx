'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Trophy, RotateCcw, Share2, CheckCircle, XCircle,
  Crown, Star, Zap, BookOpen, Medal,
} from 'lucide-react'

/* ─── Types ─── */
interface Round {
  statements: [string, string]
  realIndex: 0 | 1
  realFact: {
    id: string
    category: string
    text: string
    difficulty: 'easy' | 'medium' | 'hard'
    source: { name: string; url: string }
  }
  changeDescription: string
}

interface CompletedRound extends Round {
  userPick: 0 | 1
  correct: boolean
  timeMs: number
}

type Phase = 'setup' | 'playing' | 'results'

const TOTAL_ROUNDS = 10
const CATEGORIES = [
  'All', 'Space', 'Animals', 'Human Body', 'History', 'Geography',
  'Science', 'Technology', 'Food', 'Language', 'Ocean', 'Music',
  'Sports', 'Art', 'Nature', 'Math', 'Psychology', 'Culture',
]

/* ─── Leaderboard (localStorage) ─── */
interface LeaderboardEntry {
  score: number
  total: number
  category: string
  date: string
}

function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('compare-leaderboard') || '[]')
  } catch { return [] }
}

function addLeaderboardEntry(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return
  const board = getLeaderboard()
  board.unshift(entry)
  // Keep top 10
  localStorage.setItem('compare-leaderboard', JSON.stringify(board.slice(0, 10)))
}

/* ─── Component ─── */
export default function ComparePage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [category, setCategory] = useState('All')

  const [currentRound, setCurrentRound] = useState(0)
  const [roundData, setRoundData] = useState<Round | null>(null)
  const [completed, setCompleted] = useState<CompletedRound[]>([])

  const [picked, setPicked] = useState<0 | 1 | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)

  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [toast, setToast] = useState('')
  const [cardAnim, setCardAnim] = useState<'enter' | 'exit' | null>('enter')

  const roundStartRef = useRef<number>(Date.now())

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  /* ── Fetch one round from API ── */
  const fetchRound = useCallback(async (cat: string): Promise<Round | null> => {
    setError('')
    const url = cat === 'All'
      ? '/api/compare'
      : `/api/compare?category=${encodeURIComponent(cat)}`
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      return data as Round
    } catch (e) {
      setError('Could not load question. Please try again.')
      return null
    }
  }, [])

  /* ── Start game ── */
  const startGame = async () => {
    setLoading(true)
    const round = await fetchRound(category)
    setLoading(false)
    if (!round) return

    setCurrentRound(1)
    setScore(0)
    setCompleted([])
    setPicked(null)
    setShowExplanation(false)
    setRoundData(round)
    setCardAnim('enter')
    roundStartRef.current = Date.now()
    setPhase('playing')
  }

  /* ── Handle pick ── */
  const handlePick = (choice: 0 | 1) => {
    if (picked !== null || !roundData) return
    const timeMs = Date.now() - roundStartRef.current
    setPicked(choice)

    const isCorrect = choice === roundData.realIndex
    if (isCorrect) setScore(s => s + 1)

    setCompleted(c => [...c, {
      ...roundData,
      userPick: choice,
      correct: isCorrect,
      timeMs,
    }])

    setShowExplanation(true)
  }

  /* ── Advance to next round ── */
  const nextRound = async () => {
    if (currentRound >= TOTAL_ROUNDS) {
      // Game over
      const entry: LeaderboardEntry = {
        score,
        total: TOTAL_ROUNDS,
        category,
        date: new Date().toLocaleDateString(),
      }
      addLeaderboardEntry(entry)
      setLeaderboard(getLeaderboard())
      setPhase('results')
      return
    }

    setCardAnim('exit')
    await new Promise(r => setTimeout(r, 250))

    setLoading(true)
    const round = await fetchRound(category)
    setLoading(false)
    if (!round) return

    setCurrentRound(r => r + 1)
    setRoundData(round)
    setPicked(null)
    setShowExplanation(false)
    setCardAnim('enter')
    roundStartRef.current = Date.now()
  }

  /* ── Load leaderboard on mount ── */
  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [])

  const shareText = `I scored ${score}/${TOTAL_ROUNDS} in "Which is True?" on Did You Know! Can you beat me? 🧠`
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/compare' : ''

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Did You Know — Which is True?', text: shareText, url: shareUrl })
    } else {
      navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`)
      showToast('Copied to clipboard!')
    }
  }

  const getScoreVerdict = (s: number) => {
    if (s >= 9) return { label: 'Fact Master', color: 'var(--secondary)' }
    if (s >= 7) return { label: 'Sharp Eye', color: 'var(--text)' }
    if (s >= 5) return { label: 'Decent Detector', color: 'var(--text)' }
    if (s >= 3) return { label: 'Keep Practicing', color: 'var(--muted)' }
    return { label: 'Easily Misled', color: 'var(--accent)' }
  }

  /* ══════════════════════════════════════════════════
     SETUP SCREEN
  ══════════════════════════════════════════════════ */
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Back
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[var(--text)] mb-6 -rotate-2">
            <Trophy size={28} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Which is <span className="italic text-[var(--accent)]">True?</span>
          </h1>
          <p className="font-display italic text-lg text-[var(--muted)]">
            Two statements — one real, one subtly false. Can you tell them apart?
          </p>
        </div>

        {/* How to play */}
        <div className="mb-8 p-5" style={{ border: '1.5px dashed var(--muted)' }}>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-3">How to Play</h2>
          <ul className="space-y-2">
            {[
              'You\'ll see two statements side by side',
              'One is a real verified fact from our database',
              'The other has a subtle change — a number, country, or word swapped',
              'Pick the real one before moving on',
              '10 rounds, then see your final score',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 font-display text-sm">
                <span className="font-mono text-[10px] font-bold mt-1" style={{ color: 'var(--accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Category */}
        <section className="mb-10">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] block mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`pill ${category === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-3 flex items-center gap-2">
              <Medal size={13} /> Your Recent Games
            </h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2 font-mono text-xs"
                  style={{ border: '1px solid var(--muted)', opacity: i === 0 ? 1 : 0.6 + i * 0.05 }}
                >
                  <span className="text-[var(--muted)]">#{i + 1}</span>
                  <span className="font-bold text-[var(--text)]">{entry.score}/{entry.total}</span>
                  <span className="text-[var(--muted)]">{entry.category}</span>
                  <span className="text-[var(--muted)]">{entry.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {error && (
          <p className="text-center font-mono text-xs text-[var(--accent)] mb-4">{error}</p>
        )}

        <div className="text-center">
          <button
            className="btn btn-primary text-base px-10 py-4"
            onClick={startGame}
            disabled={loading}
          >
            {loading
              ? <span className="font-mono text-xs animate-pulse">Loading…</span>
              : <><Trophy size={16} /> Start Game</>
            }
          </button>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════
     RESULTS SCREEN
  ══════════════════════════════════════════════════ */
  if (phase === 'results') {
    const verdict = getScoreVerdict(score)
    const pct = Math.round((score / TOTAL_ROUNDS) * 100)

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2">Game Complete</div>
          <div
            className="font-display font-bold leading-none mb-2"
            style={{ fontSize: 'clamp(80px, 18vw, 130px)', animation: 'scoreIn 500ms ease both' }}
          >
            {score}<span className="text-[var(--accent)]">/{TOTAL_ROUNDS}</span>
          </div>
          <div className="font-mono text-sm uppercase tracking-widest mb-1" style={{ color: verdict.color }}>
            {verdict.label}
          </div>
          <div className="font-mono text-xs text-[var(--muted)]">{pct}% correct</div>
        </div>

        {/* Breakdown */}
        <section className="mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Round Breakdown</h2>
          <div className="space-y-3">
            {completed.map((r, i) => (
              <div
                key={i}
                className="p-4 transition-all"
                style={{
                  border: '1.5px solid var(--text)',
                  borderLeftWidth: '4px',
                  borderLeftColor: r.correct ? 'var(--text)' : 'var(--accent)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {r.correct
                      ? <CheckCircle size={16} className="text-[var(--text)]" />
                      : <XCircle size={16} className="text-[var(--accent)]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="stamp" style={{ borderRadius: '999px', fontSize: '0.6rem' }}>{r.realFact.category}</span>
                      <span className="font-mono text-[10px] text-[var(--muted)]">
                        {(r.timeMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <p className="font-display text-sm leading-snug mb-1">
                      ✓ {r.realFact.text}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--muted)]">
                      The false statement had {r.changeDescription}.
                      {!r.correct && ' You picked the wrong one.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2">
              <Medal size={13} /> Recent Games
            </h2>
            <div className="space-y-1">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 font-mono text-xs"
                  style={{
                    border: '1px solid var(--muted)',
                    background: i === 0 ? 'var(--surface)' : 'transparent',
                  }}
                >
                  <span className="text-[var(--muted)]">#{i + 1}</span>
                  <span className="font-bold">{entry.score}/{entry.total}</span>
                  <span className="text-[var(--muted)]">{entry.category}</span>
                  <span className="text-[var(--muted)]">{entry.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              setPhase('setup')
              setRoundData(null)
              setCompleted([])
              setPicked(null)
            }}
          >
            <RotateCcw size={14} /> Play Again
          </button>
          <button className="btn" onClick={handleShare}>
            <Share2 size={14} /> Share Score
          </button>
          <Link href="/challenge" className="btn">
            <Zap size={14} /> Try Challenge Mode
          </Link>
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50 bg-[var(--text)] text-[var(--bg)]">
            {toast}
          </div>
        )}

        <style jsx>{`
          @keyframes scoreIn {
            from { opacity: 0; transform: scale(0.7) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════
     PLAYING SCREEN
  ══════════════════════════════════════════════════ */
  const isAnswered = picked !== null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
          Round {currentRound} of {TOTAL_ROUNDS}
        </div>
        <div className="flex items-center gap-2">
          <Star size={13} className="text-[var(--secondary)]" />
          <span className="font-mono text-xs font-bold">{score} correct</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full mb-6 bg-[var(--surface)]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((currentRound - 1) / TOTAL_ROUNDS) * 100}%`, background: 'var(--text)' }}
        />
      </div>

      {/* Prompt */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-light">
          Which statement is <span className="italic font-bold text-[var(--accent)]">true?</span>
        </h2>
        <p className="font-mono text-xs text-[var(--muted)] mt-1 uppercase tracking-widest">
          One is real · One has a subtle change
        </p>
      </div>

      {/* Cards */}
      {loading || !roundData ? (
        <div className="text-center py-16 font-mono text-xs uppercase tracking-widest text-[var(--muted)] animate-pulse">
          Loading next round…
        </div>
      ) : (
        <div
          className="grid md:grid-cols-2 gap-4 mb-6"
          style={{ animation: cardAnim === 'enter' ? 'cardsIn 300ms ease both' : 'cardsOut 250ms ease both' }}
        >
          {([0, 1] as const).map((idx) => {
            const text = roundData.statements[idx]
            const isReal = idx === roundData.realIndex
            const isPicked = picked === idx

            let borderColor = 'var(--text)'
            let bg = 'transparent'
            let fg = 'var(--text)'
            let badge: React.ReactNode = null

            if (isAnswered) {
              if (isReal) {
                borderColor = 'var(--text)'
                bg = 'var(--text)'
                fg = 'var(--bg)'
                badge = (
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: 'var(--bg)', opacity: 0.8 }}>
                    <CheckCircle size={12} /> True Fact
                  </span>
                )
              } else {
                borderColor = isPicked ? 'var(--accent)' : 'var(--muted)'
                bg = isPicked ? 'var(--accent)' : 'transparent'
                fg = isPicked ? 'var(--bg)' : 'var(--muted)'
                if (isPicked) {
                  badge = (
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: 'var(--bg)', opacity: 0.8 }}>
                      <XCircle size={12} /> Altered Fact
                    </span>
                  )
                }
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handlePick(idx)}
                disabled={isAnswered}
                className="group text-left p-6 flex flex-col gap-3 transition-all duration-200"
                style={{
                  border: `2px solid ${borderColor}`,
                  background: bg,
                  color: fg,
                  cursor: isAnswered ? 'default' : 'pointer',
                  transform: isAnswered
                    ? (isReal ? 'scale(1.01)' : isPicked ? 'scale(0.98)' : 'scale(1)')
                    : 'scale(1)',
                  minHeight: '160px',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="font-mono text-xs uppercase tracking-widest opacity-40 flex-shrink-0"
                  >
                    {idx === 0 ? 'Statement A' : 'Statement B'}
                  </span>
                  {badge}
                </div>
                <p className="font-display text-base md:text-lg leading-snug flex-1">
                  {text}
                </p>
                {!isAnswered && (
                  <div
                    className="font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--accent)' }}
                  >
                    → Pick this one
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* VS divider (only when not answered) */}
      {!isAnswered && !loading && roundData && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[var(--muted)] opacity-30" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">VS</span>
          <div className="flex-1 h-px bg-[var(--muted)] opacity-30" />
        </div>
      )}

      {/* Explanation after answer */}
      {isAnswered && showExplanation && roundData && (
        <div
          className="p-5 mb-6"
          style={{
            border: '1.5px solid var(--text)',
            background: 'var(--surface)',
            animation: 'explanationIn 350ms ease both',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              {picked === roundData.realIndex ? '✓ Correct!' : '✗ Not quite'}
            </span>
            {roundData.realFact.category && (
              <span className="stamp ml-auto" style={{ borderRadius: '999px', fontSize: '0.6rem' }}>
                {roundData.realFact.category}
              </span>
            )}
          </div>

          <p className="font-display text-sm leading-relaxed mb-2">
            <strong>The real fact:</strong> {roundData.realFact.text}
          </p>
          <p className="font-mono text-[11px] text-[var(--muted)]">
            The false statement had {roundData.changeDescription}. Source: {roundData.realFact.source.name}
          </p>

          {/* Next button */}
          <div className="mt-4 flex justify-end">
            <button
              className="btn btn-primary"
              onClick={nextRound}
            >
              {currentRound >= TOTAL_ROUNDS ? (
                <><Trophy size={14} /> See Results</>
              ) : (
                <>Next Round →</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-center font-mono text-xs text-[var(--accent)] mt-4">{error}</p>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50 bg-[var(--text)] text-[var(--bg)]">
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes cardsIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardsOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes explanationIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
