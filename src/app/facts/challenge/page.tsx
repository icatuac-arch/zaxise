'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Timer, Zap, Trophy, RotateCcw, Share2, ChevronLeft,
  Flame, Star, Target, CheckCircle, XCircle, Crown,
} from 'lucide-react'

/* ─── Types ─── */
interface Fact {
  id: string
  category: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ChallengeQuestion {
  factId: string
  category: string
  displayText: string   // text with blank inserted
  options: string[]
  correctIndex: number
  blankedWord: string
  difficulty: 'easy' | 'medium' | 'hard'
}

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Phase = 'setup' | 'countdown' | 'playing' | 'gameover'

const DIFFICULTY_TIMES: Record<Difficulty, number> = {
  Easy: 90,
  Medium: 60,
  Hard: 30,
}

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
}

const CATEGORIES = [
  'All', 'Space', 'Animals', 'Human Body', 'History', 'Geography',
  'Science', 'Technology', 'Food', 'Language', 'Ocean', 'Music',
  'Sports', 'Art', 'Nature', 'Math', 'Psychology', 'Culture',
]

const COMBO_THRESHOLDS = [3, 5, 8, 12]

/* ─── Question generation from fact text ─── */

// Words to skip when blanking (too generic or ambiguous)
const SKIP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'of', 'in', 'on', 'at',
  'to', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'through',
  'and', 'but', 'or', 'nor', 'so', 'yet', 'that', 'this', 'these',
  'those', 'it', 'its', 'they', 'their', 'there', 'than', 'then',
  'when', 'where', 'which', 'who', 'whom', 'what', 'how', 'why',
  'not', 'no', 'only', 'just', 'also', 'as', 'if', 'each', 'any',
  'all', 'most', 'more', 'less', 'some', 'such', 'over', 'after',
  'before', 'between', 'during', 'since', 'while', 'because', 'although',
  'though', 'however', 'therefore', 'thus', 'hence', 'even',
])

// Pools of plausible wrong answers by type
const NUMBER_ALTS = ['100', '50', '200', '1,000', '500', '10', '5', '1 million', '1 billion', '25', '75', '12', '24', '365', '3', '7', '9', '20', '1,500', '4,000']
const COUNTRY_ALTS = ['China', 'India', 'USA', 'Russia', 'Brazil', 'Japan', 'Germany', 'France', 'Australia', 'Canada', 'Egypt', 'Mexico', 'South Korea', 'Nigeria', 'Kenya', 'Iran', 'Peru', 'Ethiopia', 'Indonesia']
const ANIMAL_ALTS = ['elephant', 'shark', 'eagle', 'octopus', 'dolphin', 'lion', 'tiger', 'penguin', 'whale', 'gorilla', 'cheetah', 'crocodile', 'giraffe', 'koala', 'wolf']
const GENERIC_ALTS = ['zero', 'one', 'two', 'three', 'four', 'five', 'ten', 'twenty', 'thirty', 'fifty', 'hundred', 'thousand', 'million', 'billion']

function pickRandomFrom<T>(arr: T[], exclude: T[], count: number): T[] {
  const pool = arr.filter(x => !exclude.includes(x))
  const result: T[] = []
  const used = new Set<number>()
  while (result.length < count && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length)
    if (!used.has(idx)) {
      used.add(idx)
      result.push(pool[idx])
    }
  }
  return result
}

function isNumber(word: string): boolean {
  return /^[\d,]+(\.\d+)?$/.test(word.replace(/,/g, ''))
}

function isCountry(word: string): boolean {
  return COUNTRY_ALTS.includes(word)
}

function isAnimal(word: string): boolean {
  return ANIMAL_ALTS.includes(word.toLowerCase())
}

function generateQuestion(fact: Fact): ChallengeQuestion | null {
  // Tokenize: extract words while preserving positions
  const words = fact.text.match(/\b\w[\w'-]*\b/g)
  if (!words || words.length < 6) return null

  // Find candidate words to blank: meaningful words 4+ chars, not in skip list
  const candidates = words.filter(w =>
    w.length >= 4 &&
    !SKIP_WORDS.has(w.toLowerCase()) &&
    !/^(very|quite|rather|about|also|well|much|many|most|more|less|even|just|only|some|such|each|both|either|neither|every|other|another|same|different|new|old|big|small|large|great|long|high|low|good|bad|first|last|next|few|little)$/i.test(w)
  )

  if (candidates.length === 0) return null

  // Prefer numbers, countries, or animals since those have natural wrong answers
  let targetWord = ''
  let altPool: string[] = []

  const numWord = candidates.find(w => isNumber(w))
  const countryWord = candidates.find(w => isCountry(w))
  const animalWord = candidates.find(w => isAnimal(w))

  if (numWord) {
    targetWord = numWord
    altPool = NUMBER_ALTS
  } else if (countryWord) {
    targetWord = countryWord
    altPool = COUNTRY_ALTS
  } else if (animalWord) {
    targetWord = animalWord
    altPool = ANIMAL_ALTS
  } else {
    // Use a random candidate
    targetWord = candidates[Math.floor(Math.random() * candidates.length)]
    altPool = GENERIC_ALTS
  }

  // Generate 3 wrong options
  const wrongs = pickRandomFrom(altPool, [targetWord], 3)
  if (wrongs.length < 3) {
    // Pad with number alternatives if needed
    const extra = pickRandomFrom(NUMBER_ALTS, [targetWord, ...wrongs], 3 - wrongs.length)
    wrongs.push(...extra)
  }
  if (wrongs.length < 3) return null

  // Build display text with blank
  const displayText = fact.text.replace(
    new RegExp(`\\b${targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
    '_____'
  )

  // Shuffle options
  const correctIndex = Math.floor(Math.random() * 4)
  const options = [...wrongs]
  options.splice(correctIndex, 0, targetWord)

  return {
    factId: fact.id,
    category: fact.category,
    displayText,
    options,
    correctIndex,
    blankedWord: targetWord,
    difficulty: fact.difficulty,
  }
}

/* ─── LocalStorage helpers ─── */
function getPersonalBest(difficulty: Difficulty): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(`challenge-pb-${difficulty}`) || '0', 10)
}

function setPersonalBest(difficulty: Difficulty, score: number): void {
  if (typeof window === 'undefined') return
  const current = getPersonalBest(difficulty)
  if (score > current) localStorage.setItem(`challenge-pb-${difficulty}`, String(score))
}

/* ─── Component ─── */
export default function ChallengePage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [category, setCategory] = useState('All')

  const [questions, setQuestions] = useState<ChallengeQuestion[]>([])
  const [queuedFacts, setQueuedFacts] = useState<Fact[]>([])
  const [currentQ, setCurrentQ] = useState<ChallengeQuestion | null>(null)

  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [correct, setCorrect] = useState(0)

  const [picked, setPicked] = useState<number | null>(null)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [personalBest, setPersonalBestState] = useState(0)
  const [isNewPB, setIsNewPB] = useState(false)
  const [toast, setToast] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [loading, setLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const factIndexRef = useRef(0)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  /* ── Fetch a batch of facts ── */
  const fetchFacts = useCallback(async (catOverride?: string): Promise<Fact[]> => {
    const cat = catOverride ?? category
    const url = cat === 'All'
      ? `/api/facts?random=true`
      : `/api/facts?category=${encodeURIComponent(cat)}&limit=50`

    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    if (data.fact) return [data.fact]
    if (data.facts) return data.facts
    return []
  }, [category])

  /* ── Build question queue from facts ── */
  const buildQueue = useCallback((facts: Fact[]): ChallengeQuestion[] => {
    const qs: ChallengeQuestion[] = []
    for (const fact of facts) {
      const q = generateQuestion(fact)
      if (q) qs.push(q)
    }
    return qs
  }, [])

  /* ── Refill question queue ── */
  const refillQueue = useCallback(async () => {
    const facts = await fetchFacts()
    const newQs = buildQueue(facts)
    setQueuedFacts(facts)
    return newQs
  }, [fetchFacts, buildQueue])

  /* ── Advance to next question ── */
  const nextQuestion = useCallback(async (currentQueue: ChallengeQuestion[]) => {
    setPicked(null)
    setFlash(null)

    let queue = currentQueue
    if (queue.length === 0) {
      setLoading(true)
      queue = await refillQueue()
      setLoading(false)
    }

    if (queue.length === 0) {
      // No more questions available
      return
    }

    const [next, ...rest] = queue
    setCurrentQ(next)
    setQuestions(rest)
  }, [refillQueue])

  /* ── Start the game ── */
  const startGame = async () => {
    setLoading(true)
    const facts = await fetchFacts()
    const qs = buildQueue(facts)
    const pb = getPersonalBest(difficulty)
    setPersonalBestState(pb)
    setScore(0)
    setCombo(0)
    setBestCombo(0)
    setAnswered(0)
    setCorrect(0)
    setIsNewPB(false)
    setLoading(false)

    if (qs.length === 0) {
      showToast('Could not load facts. Please try again.')
      return
    }

    setQuestions(qs.slice(1))
    setCurrentQ(qs[0])
    setTimeLeft(DIFFICULTY_TIMES[difficulty])
    setPhase('countdown')
    setCountdown(3)
  }

  /* ── Countdown before game ── */
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  /* ── Game timer ── */
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase('gameover')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  /* ── Handle answer ── */
  const handlePick = (optionIndex: number) => {
    if (picked !== null || phase !== 'playing' || !currentQ) return
    setPicked(optionIndex)

    const isCorrect = optionIndex === currentQ.correctIndex
    setAnswered(a => a + 1)

    if (isCorrect) {
      const multiplier = combo >= 8 ? 4 : combo >= 5 ? 3 : combo >= 3 ? 2 : 1
      const pts = DIFFICULTY_POINTS[difficulty] * multiplier
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setCombo(c => {
        const nc = c + 1
        setBestCombo(b => Math.max(b, nc))
        return nc
      })
      setFlash('correct')
      setFeedbackText(combo >= 2 ? `+${pts} pts · ${combo + 1}x streak!` : `+${pts} pt${pts > 1 ? 's' : ''}`)
    } else {
      setCombo(0)
      setFlash('wrong')
      setFeedbackText(`Correct: ${currentQ.options[currentQ.correctIndex]}`)
    }

    // Auto-advance after short delay
    autoAdvanceRef.current = setTimeout(() => {
      nextQuestion(questions)
    }, isCorrect ? 600 : 1000)
  }

  /* ── Game over: save PB ── */
  useEffect(() => {
    if (phase !== 'gameover') return
    const pb = getPersonalBest(difficulty)
    if (score > pb) {
      setPersonalBestState(score)
      setIsNewPB(true)
      setPersonalBest(difficulty, score)
    }
  }, [phase, score, difficulty])

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [])

  const timerPct = (timeLeft / DIFFICULTY_TIMES[difficulty]) * 100
  const timerColor = timeLeft <= 10 ? 'var(--accent)' : timeLeft <= 20 ? 'var(--secondary)' : 'var(--text)'
  const comboLevel = COMBO_THRESHOLDS.filter(t => combo >= t).length

  const shareText = `I scored ${score} points in Did You Know Challenge Mode (${difficulty})! Can you beat me? 🧠`
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/challenge' : ''
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Did You Know Challenge', text: shareText, url: shareUrl })
    } else {
      navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`)
      showToast('Copied to clipboard!')
    }
  }

  /* ══════════════════ SETUP SCREEN ══════════════════ */
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Back
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[var(--text)] mb-6 rotate-3">
            <Zap size={28} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Challenge <span className="italic text-[var(--accent)]">Mode</span>
          </h1>
          <p className="font-display italic text-lg text-[var(--muted)]">
            How many facts can you identify before time runs out?
          </p>
        </div>

        {/* Difficulty */}
        <section className="mb-8">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] block mb-3">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="py-4 px-3 text-center transition-all duration-200"
                style={{
                  border: '1.5px solid var(--text)',
                  background: difficulty === d ? 'var(--text)' : 'transparent',
                  color: difficulty === d ? 'var(--bg)' : 'var(--text)',
                }}
              >
                <div className="font-mono text-xs uppercase tracking-widest mb-1">{d}</div>
                <div className="font-display text-2xl font-bold">{DIFFICULTY_TIMES[d]}s</div>
                <div className="font-mono text-[10px] text-[var(--muted)] mt-1" style={{ color: difficulty === d ? 'var(--bg)' : undefined }}>
                  {DIFFICULTY_POINTS[d]}× pts
                </div>
              </button>
            ))}
          </div>
        </section>

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

        {/* Personal best */}
        {getPersonalBest(difficulty) > 0 && (
          <div className="mb-8 p-4 flex items-center gap-3" style={{ border: '1.5px dashed var(--muted)' }}>
            <Crown size={18} className="text-[var(--secondary)]" />
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Your Best ({difficulty})</div>
              <div className="font-display text-xl font-bold">{getPersonalBest(difficulty)} pts</div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            className="btn btn-primary text-base px-10 py-4"
            onClick={startGame}
            disabled={loading}
          >
            {loading ? (
              <span className="font-mono text-xs animate-pulse">Loading facts…</span>
            ) : (
              <><Zap size={16} /> Start Challenge</>
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  /* ══════════════════ COUNTDOWN SCREEN ══════════════════ */
  if (phase === 'countdown') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            key={countdown}
            className="font-display font-bold leading-none mb-4"
            style={{
              fontSize: 'clamp(120px, 25vw, 200px)',
              color: 'var(--accent)',
              animation: 'countPop 900ms ease both',
            }}
          >
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Get ready…</div>
        </div>
        <style jsx>{`
          @keyframes countPop {
            0% { transform: scale(1.4); opacity: 0; }
            30% { opacity: 1; transform: scale(1); }
            80% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.85); opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  /* ══════════════════ GAME OVER SCREEN ══════════════════ */
  if (phase === 'gameover') {
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
    const grade = score >= 50 ? 'S' : score >= 30 ? 'A' : score >= 20 ? 'B' : score >= 10 ? 'C' : 'D'
    const gradeMsg: Record<string, string> = {
      S: 'Encyclopedic genius.',
      A: 'Impressively sharp.',
      B: 'Above average — well played.',
      C: 'A decent showing.',
      D: 'More trivia awaits you.',
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          {isNewPB && (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[var(--secondary)] text-[var(--bg)] font-mono text-xs uppercase tracking-widest">
              <Crown size={14} /> New Personal Best!
            </div>
          )}
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
            {difficulty} · {DIFFICULTY_TIMES[difficulty]}s
          </div>
          <div
            className="font-display font-bold leading-none mb-2"
            style={{ fontSize: 'clamp(80px, 18vw, 140px)', animation: 'scoreIn 600ms ease both' }}
          >
            {score}
          </div>
          <div className="font-display italic text-xl text-[var(--muted)] mb-1">points</div>
          <div className="font-mono text-sm text-[var(--muted)]">{gradeMsg[grade]}</div>
        </div>

        {/* Grade */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 flex items-center justify-center font-display font-bold text-4xl"
            style={{ border: '3px solid var(--text)' }}
          >
            {grade}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Target, label: 'Answered', value: answered },
            { icon: CheckCircle, label: 'Correct', value: correct },
            { icon: Star, label: 'Accuracy', value: `${accuracy}%` },
            { icon: Flame, label: 'Best Streak', value: bestCombo },
          ].map(s => (
            <div
              key={s.label}
              className="text-center p-4"
              style={{ border: '1.5px solid var(--text)' }}
            >
              <s.icon size={18} className="mx-auto mb-2 text-[var(--muted)]" />
              <div className="font-display text-2xl font-bold">{s.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Personal best */}
        <div
          className="flex items-center gap-3 p-4 mb-8"
          style={{ border: '1.5px dashed var(--muted)' }}
        >
          <Crown size={18} className="text-[var(--secondary)]" />
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Personal Best ({difficulty})</div>
            <div className="font-display text-xl font-bold">{Math.max(score, personalBest)} pts</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              setPhase('setup')
              setCurrentQ(null)
              setQuestions([])
            }}
          >
            <RotateCcw size={14} /> Play Again
          </button>
          <button className="btn" onClick={handleShare}>
            <Share2 size={14} /> Share Score
          </button>
          <Link href="/compare" className="btn">
            <Trophy size={14} /> Try Compare Game
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

  /* ══════════════════ PLAYING SCREEN ══════════════════ */
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        {/* Score */}
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Score</div>
          <div className="font-display text-3xl font-bold leading-none">{score}</div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="font-display font-bold leading-none transition-all duration-300"
            style={{
              fontSize: 'clamp(40px, 8vw, 60px)',
              color: timerColor,
              animation: timeLeft <= 10 ? 'timerPulse 1s ease infinite' : undefined,
            }}
          >
            {timeLeft}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">seconds</div>
        </div>

        {/* Combo */}
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Streak</div>
          <div className="font-display text-3xl font-bold leading-none flex items-end gap-1"
            style={{ color: combo >= 3 ? 'var(--accent)' : 'var(--text)' }}
          >
            {combo}
            {combo >= 3 && <Flame size={18} className="mb-0.5" style={{ color: 'var(--accent)' }} />}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 w-full mb-1 bg-[var(--surface)] overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{ width: `${timerPct}%`, background: timerColor }}
        />
      </div>

      {/* Combo multiplier badge */}
      {comboLevel > 0 && (
        <div
          className="text-center mb-3 font-mono text-xs uppercase tracking-widest py-1 transition-all"
          style={{
            background: comboLevel >= 3 ? 'var(--accent)' : comboLevel >= 2 ? 'var(--secondary)' : 'var(--text)',
            color: 'var(--bg)',
            animation: 'slideDown 300ms ease both',
          }}
        >
          {comboLevel >= 3 ? '🔥 INSANE' : comboLevel >= 2 ? 'ON FIRE' : 'COMBO'} ×{comboLevel + 1} MULTIPLIER!
        </div>
      )}

      {/* Category badge */}
      {currentQ && (
        <div className="flex items-center gap-2 mb-4">
          <span className="stamp" style={{ borderRadius: '999px' }}>{currentQ.category}</span>
          <span className="stamp" style={{
            borderRadius: '999px',
            background: currentQ.difficulty === 'hard' ? 'var(--accent)' : currentQ.difficulty === 'medium' ? 'var(--secondary)' : 'var(--text)',
            color: 'var(--bg)',
            borderColor: 'transparent',
          }}>{currentQ.difficulty}</span>
        </div>
      )}

      {/* Question */}
      <div
        className="min-h-[120px] flex items-center mb-6 p-5"
        style={{ border: '1.5px solid var(--text)', background: 'var(--surface)' }}
      >
        {loading || !currentQ ? (
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] animate-pulse w-full text-center">
            Loading next question…
          </div>
        ) : (
          <p className="font-display text-xl md:text-2xl leading-snug">
            {currentQ.displayText.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span
                    className="inline-block px-3 py-0.5 font-bold transition-all duration-200"
                    style={{
                      background: flash === 'correct' ? 'var(--text)' : flash === 'wrong' ? 'var(--accent)' : 'var(--text)',
                      color: 'var(--bg)',
                      minWidth: '80px',
                      textAlign: 'center',
                    }}
                  >
                    {flash ? currentQ.options[currentQ.correctIndex] : '?????'}
                  </span>
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Options */}
      {currentQ && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {currentQ.options.map((opt, i) => {
            const isCorrect = i === currentQ.correctIndex
            const isPicked = i === picked
            let bg = 'transparent'
            let fg = 'var(--text)'
            let borderColor = 'var(--text)'

            if (picked !== null) {
              if (isCorrect) { bg = 'var(--text)'; fg = 'var(--bg)' }
              else if (isPicked) { bg = 'var(--accent)'; fg = 'var(--bg)'; borderColor = 'var(--accent)' }
              else { fg = 'var(--muted)'; borderColor = 'var(--muted)' }
            }

            return (
              <button
                key={i}
                onClick={() => handlePick(i)}
                disabled={picked !== null}
                className="py-4 px-4 text-left font-display text-base md:text-lg transition-all duration-150"
                style={{
                  border: `1.5px solid ${borderColor}`,
                  background: bg,
                  color: fg,
                  cursor: picked !== null ? 'default' : 'pointer',
                  transform: isPicked && flash === 'wrong' ? 'scale(0.97)' : isCorrect && flash === 'correct' ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span className="font-mono text-xs opacity-50 mr-2">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {/* Feedback text */}
      {flash && feedbackText && (
        <div
          className="text-center py-2 font-mono text-sm uppercase tracking-widest"
          style={{
            color: flash === 'correct' ? 'var(--text)' : 'var(--accent)',
            animation: 'fadeUpIn 300ms ease both',
          }}
        >
          {feedbackText}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase z-50 bg-[var(--text)] text-[var(--bg)]">
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes timerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
