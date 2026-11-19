'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'

// ─── Clue Data ───────────────────────────────────────────────────────────────

interface Clue {
  category: string
  value: number
  clue: string
  answer: string
}

const ALL_CLUES: Clue[] = [
  // ── Space ──────────────────────────────────────────────
  { category: "Space", value: 200, clue: "This gas makes up about 78% of Earth's atmosphere", answer: "What is nitrogen?" },
  { category: "Space", value: 200, clue: "This planet has a day longer than its year", answer: "What is Venus?" },
  { category: "Space", value: 200, clue: "This planet is known as the Red Planet", answer: "What is Mars?" },
  { category: "Space", value: 400, clue: "Saturn is notable because this material would cause it to float", answer: "What is water?" },
  { category: "Space", value: 400, clue: "This many Earths could fit inside the Sun", answer: "What is one million?" },
  { category: "Space", value: 400, clue: "These astronaut marks on the Moon may last 100 million years due to no wind or water", answer: "What are footprints?" },
  { category: "Space", value: 600, clue: "This dwarf planet was reclassified from planet status in 2006", answer: "What is Pluto?" },
  { category: "Space", value: 600, clue: "Light from this star takes about 8 minutes to reach Earth", answer: "What is the Sun?" },
  { category: "Space", value: 600, clue: "This galaxy is on a collision course with the Milky Way in about 4.5 billion years", answer: "What is Andromeda?" },
  { category: "Space", value: 800, clue: "A teaspoon of this ultra-dense stellar remnant would weigh about 6 billion tons", answer: "What is a neutron star?" },
  { category: "Space", value: 800, clue: "This is the largest planet in our solar system", answer: "What is Jupiter?" },
  { category: "Space", value: 1000, clue: "This theoretical boundary marks the edge of a black hole, beyond which nothing can escape", answer: "What is the event horizon?" },
  { category: "Space", value: 1000, clue: "This radiation, discovered in 1965, is the afterglow of the Big Bang", answer: "What is cosmic microwave background radiation?" },

  // ── History ────────────────────────────────────────────
  { category: "History", value: 200, clue: "This ancient queen lived closer in time to the Moon landing than to the Great Pyramid's construction", answer: "Who is Cleopatra?" },
  { category: "History", value: 200, clue: "This English university, founded around 1096, is older than the Aztec Empire", answer: "What is Oxford?" },
  { category: "History", value: 200, clue: "This 1896 conflict holds the record as the shortest war, lasting under 45 minutes", answer: "What is the Anglo-Zanzibar War?" },
  { category: "History", value: 400, clue: "This French emperor was once attacked by a horde of rabbits during a hunt", answer: "Who is Napoleon?" },
  { category: "History", value: 400, clue: "This massive wall is actually NOT visible from space with the naked eye, despite popular myth", answer: "What is the Great Wall of China?" },
  { category: "History", value: 400, clue: "This ship, which sank in 1912, had a swimming pool, gym, and Turkish bath on board", answer: "What is the Titanic?" },
  { category: "History", value: 600, clue: "Vikings used the skulls of their enemies as drinking vessels — but this common myth confuses the Old Norse word 'skalli' meaning this", answer: "What is bowl/shell?" },
  { category: "History", value: 600, clue: "This ancient city was buried by the eruption of Mount Vesuvius in 79 AD", answer: "What is Pompeii?" },
  { category: "History", value: 800, clue: "The Rosetta Stone was key to deciphering this ancient writing system", answer: "What are Egyptian hieroglyphics?" },
  { category: "History", value: 800, clue: "This medieval pandemic killed an estimated one-third of Europe's population in the 14th century", answer: "What is the Black Death (bubonic plague)?" },
  { category: "History", value: 1000, clue: "This Mongol emperor created the largest contiguous land empire in history", answer: "Who is Genghis Khan?" },
  { category: "History", value: 1000, clue: "This 1215 English document is considered a cornerstone of constitutional law", answer: "What is the Magna Carta?" },

  // ── Animals ────────────────────────────────────────────
  { category: "Animals", value: 200, clue: "This eight-armed sea creature has three hearts and blue blood", answer: "What is an octopus?" },
  { category: "Animals", value: 200, clue: "This Australian marsupial is the only animal known to produce cube-shaped droppings", answer: "What is a wombat?" },
  { category: "Animals", value: 200, clue: "These sea predators are older than trees, existing for around 400 million years", answer: "What are sharks?" },
  { category: "Animals", value: 400, clue: "A group of flamingos is called this fabulously fitting word", answer: "What is a flamboyance?" },
  { category: "Animals", value: 400, clue: "These farm animals have best friends and become stressed when separated", answer: "What are cows?" },
  { category: "Animals", value: 400, clue: "This bird can fly backwards and is the only bird that can hover in place", answer: "What is a hummingbird?" },
  { category: "Animals", value: 600, clue: "This animal's fingerprints are virtually indistinguishable from human fingerprints", answer: "What is a koala?" },
  { category: "Animals", value: 600, clue: "This marine mammal sleeps with one eye open, literally — half its brain stays awake", answer: "What is a dolphin?" },
  { category: "Animals", value: 800, clue: "This crustacean's punch is so fast it can boil water through cavitation", answer: "What is a mantis shrimp?" },
  { category: "Animals", value: 800, clue: "This animal can survive in the vacuum of space and withstand extreme radiation", answer: "What is a tardigrade (water bear)?" },
  { category: "Animals", value: 1000, clue: "This 'immortal' jellyfish can revert to its juvenile polyp stage after reaching maturity", answer: "What is Turritopsis dohrnii?" },
  { category: "Animals", value: 1000, clue: "This African mammal has a tongue long enough to clean its own ears — up to 18 inches", answer: "What is a giraffe?" },

  // ── Science ────────────────────────────────────────────
  { category: "Science", value: 200, clue: "This sweet substance never spoils — edible samples have been found in 3,000-year-old Egyptian tombs", answer: "What is honey?" },
  { category: "Science", value: 200, clue: "Bananas are slightly radioactive because they contain this element", answer: "What is potassium?" },
  { category: "Science", value: 200, clue: "Lightning is roughly five times hotter than the surface of this star", answer: "What is the Sun?" },
  { category: "Science", value: 400, clue: "Water can exist as solid, liquid, and gas simultaneously at a specific temperature and pressure called this", answer: "What is the triple point?" },
  { category: "Science", value: 400, clue: "This element, number 79 on the periodic table, is one of the few metals that is naturally yellow", answer: "What is gold?" },
  { category: "Science", value: 400, clue: "This physicist's famous equation relates energy to mass and the speed of light squared", answer: "Who is Einstein?" },
  { category: "Science", value: 600, clue: "Humans share about 60% of their DNA with this common yellow fruit", answer: "What is a banana?" },
  { category: "Science", value: 600, clue: "This subatomic particle was theorized in 1964 and finally confirmed at CERN in 2012", answer: "What is the Higgs boson?" },
  { category: "Science", value: 800, clue: "Glass is technically not a solid but this state of matter — an amorphous solid with liquid-like molecular structure", answer: "What is a liquid (amorphous solid)?" },
  { category: "Science", value: 800, clue: "This element is the most abundant in the universe, making up about 75% of all normal matter", answer: "What is hydrogen?" },
  { category: "Science", value: 1000, clue: "This phenomenon causes particles to exist in multiple states simultaneously until observed", answer: "What is quantum superposition?" },
  { category: "Science", value: 1000, clue: "This force is the weakest of the four fundamental forces yet shapes the large-scale structure of the universe", answer: "What is gravity?" },

  // ── Geography ──────────────────────────────────────────
  { category: "Geography", value: 200, clue: "This country spans 11 time zones, more than any other", answer: "What is Russia?" },
  { category: "Geography", value: 200, clue: "This continent is wider than the Moon", answer: "What is Australia?" },
  { category: "Geography", value: 200, clue: "This continent lies in all four hemispheres", answer: "What is Africa?" },
  { category: "Geography", value: 400, clue: "This mountain grows about 4 millimeters taller each year due to tectonic plate collision", answer: "What is Mount Everest?" },
  { category: "Geography", value: 400, clue: "This Scandinavian country's town of Rjukan uses mirrors to reflect sunlight into its dark valley", answer: "What is Norway?" },
  { category: "Geography", value: 400, clue: "This South American country contains more than half of the Amazon rainforest", answer: "What is Brazil?" },
  { category: "Geography", value: 600, clue: "This sea, bordered by Jordan and Israel, is the lowest point on Earth's surface", answer: "What is the Dead Sea?" },
  { category: "Geography", value: 600, clue: "This tiny European country is the only one entirely above 1,000 meters in elevation", answer: "What is Andorra?" },
  { category: "Geography", value: 800, clue: "This African lake is the second-largest freshwater lake by surface area in the world", answer: "What is Lake Victoria?" },
  { category: "Geography", value: 800, clue: "This deepest point in the ocean sits nearly 36,000 feet below sea level in the Pacific", answer: "What is the Mariana Trench (Challenger Deep)?" },
  { category: "Geography", value: 1000, clue: "This Central Asian country is the largest landlocked country in the world", answer: "What is Kazakhstan?" },
  { category: "Geography", value: 1000, clue: "This island nation is both a country and a continent, and has over 750 species of reptile", answer: "What is Australia?" },

  // ── Language ───────────────────────────────────────────
  { category: "Language", value: 200, clue: "The dot over a lowercase 'i' or 'j' is called this", answer: "What is a tittle?" },
  { category: "Language", value: 200, clue: "This English word has more definitions than any other — over 400 in the OED", answer: "What is 'set'?" },
  { category: "Language", value: 200, clue: "This playwright invented over 1,700 English words including 'eyeball' and 'lonely'", answer: "Who is Shakespeare?" },
  { category: "Language", value: 400, clue: "This is the most commonly used letter in the English language", answer: "What is E?" },
  { category: "Language", value: 400, clue: "This constructed international language was created by L.L. Zamenhof in 1887", answer: "What is Esperanto?" },
  { category: "Language", value: 400, clue: "The word for this Japanese art of paper-folding literally means 'folding paper'", answer: "What is origami?" },
  { category: "Language", value: 600, clue: "This is the only English word that ends in the letters '-mt'", answer: "What is 'dreamt'?" },
  { category: "Language", value: 600, clue: "This ancient language, used in the Roman Empire, is considered the ancestor of the Romance languages", answer: "What is Latin?" },
  { category: "Language", value: 800, clue: "A word that reads the same forwards and backwards is called this", answer: "What is a palindrome?" },
  { category: "Language", value: 800, clue: "This language has the most native speakers in the world", answer: "What is Mandarin Chinese?" },
  { category: "Language", value: 1000, clue: "This 45-letter English word for a lung disease caused by volcanic dust is one of the longest in the dictionary", answer: "What is pneumonoultramicroscopicsilicovolcanoconiosis?" },
  { category: "Language", value: 1000, clue: "This punctuation mark was proposed in 1962 to end sentences that are both questions and exclamations", answer: "What is the interrobang?" },
]

const CATEGORIES = ["Space", "History", "Animals", "Science", "Geography", "Language"]
const VALUES = [200, 400, 600, 800, 1000]

const FINAL_JEOPARDY_POOL: Clue[] = [
  { category: "Final Jeopardy", value: 0, clue: "This is the only letter that does not appear in any U.S. state name", answer: "What is Q?" },
  { category: "Final Jeopardy", value: 0, clue: "In 1977, NASA launched these twin spacecraft, now the farthest human-made objects from Earth", answer: "What are Voyager 1 and Voyager 2?" },
  { category: "Final Jeopardy", value: 0, clue: "This country has the most UNESCO World Heritage Sites as of 2024", answer: "What is Italy?" },
  { category: "Final Jeopardy", value: 0, clue: "This mathematical constant, approximately 2.718, is the base of the natural logarithm", answer: "What is e (Euler's number)?" },
  { category: "Final Jeopardy", value: 0, clue: "This woman, born in 1867, was the first person to win Nobel Prizes in two different sciences", answer: "Who is Marie Curie?" },
]

// ─── Utility ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickCluesForBoard(): Clue[] {
  const board: Clue[] = []
  for (const cat of CATEGORIES) {
    const catClues = ALL_CLUES.filter((c) => c.category === cat)
    for (const val of VALUES) {
      const pool = catClues.filter((c) => c.value === val)
      const pick = pool[Math.floor(Math.random() * pool.length)]
      board.push(pick)
    }
  }
  return board
}

function placeDailyDoubles(): Set<string> {
  const count = Math.random() < 0.5 ? 1 : 2
  const positions = new Set<string>()
  while (positions.size < count) {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    const val = VALUES[Math.floor(Math.random() * VALUES.length)]
    // Avoid $200 for daily doubles (traditionally rare)
    if (val === 200) continue
    positions.add(`${cat}-${val}`)
  }
  return positions
}

// ─── Game States ─────────────────────────────────────────────────────────────

type GamePhase = 'board' | 'clue' | 'answer' | 'dailyDouble' | 'finalWager' | 'finalClue' | 'finalAnswer' | 'gameOver'

export default function JeopardyPage() {
  const [board, setBoard] = useState<Clue[]>([])
  const [dailyDoubles, setDailyDoubles] = useState<Set<string>>(new Set())
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<GamePhase>('board')
  const [activeClue, setActiveClue] = useState<Clue | null>(null)
  const [activeKey, setActiveKey] = useState('')
  const [isDailyDouble, setIsDailyDouble] = useState(false)
  const [wager, setWager] = useState('')
  const [finalClue, setFinalClue] = useState<Clue | null>(null)
  const [finalWager, setFinalWager] = useState('')
  const [hostMode, setHostMode] = useState(false)
  const [animateReveal, setAnimateReveal] = useState(false)
  const [dailyDoubleFlash, setDailyDoubleFlash] = useState(false)

  // Initialize board
  const initGame = useCallback(() => {
    setBoard(pickCluesForBoard())
    setDailyDoubles(placeDailyDoubles())
    setRevealed(new Set())
    setScore(0)
    setPhase('board')
    setActiveClue(null)
    setActiveKey('')
    setIsDailyDouble(false)
    setWager('')
    setFinalClue(FINAL_JEOPARDY_POOL[Math.floor(Math.random() * FINAL_JEOPARDY_POOL.length)])
    setFinalWager('')
    setAnimateReveal(false)
    setDailyDoubleFlash(false)
  }, [])

  useEffect(() => { initGame() }, [initGame])

  const cluesRemaining = useMemo(() => {
    return CATEGORIES.length * VALUES.length - revealed.size
  }, [revealed])

  const getClue = useCallback((cat: string, val: number): Clue | undefined => {
    return board.find((c) => c.category === cat && c.value === val)
  }, [board])

  // ─── Handlers ──────────────────────────────────────────

  const handleCellClick = (cat: string, val: number) => {
    const key = `${cat}-${val}`
    if (revealed.has(key)) return
    const clue = getClue(cat, val)
    if (!clue) return

    setActiveClue(clue)
    setActiveKey(key)

    if (dailyDoubles.has(key)) {
      setIsDailyDouble(true)
      setDailyDoubleFlash(true)
      setPhase('dailyDouble')
      setTimeout(() => setDailyDoubleFlash(false), 1500)
    } else {
      setIsDailyDouble(false)
      setAnimateReveal(true)
      setPhase('clue')
      setTimeout(() => setAnimateReveal(false), 600)
    }
  }

  const handleDailyDoubleWager = () => {
    const w = parseInt(wager)
    if (isNaN(w) || w < 0) return
    setAnimateReveal(true)
    setPhase('clue')
    setTimeout(() => setAnimateReveal(false), 600)
  }

  const handleShowAnswer = () => {
    setPhase('answer')
  }

  const handleJudge = (correct: boolean) => {
    const pointVal = isDailyDouble ? (parseInt(wager) || 0) : (activeClue?.value || 0)
    setScore((s) => correct ? s + pointVal : s - pointVal)
    const newRevealed = new Set(revealed)
    newRevealed.add(activeKey)
    setRevealed(newRevealed)

    // Check if board is cleared
    if (newRevealed.size >= CATEGORIES.length * VALUES.length) {
      setPhase('finalWager')
    } else {
      setPhase('board')
      setActiveClue(null)
      setActiveKey('')
      setIsDailyDouble(false)
      setWager('')
    }
  }

  const handleFinalWager = () => {
    const w = parseInt(finalWager)
    if (isNaN(w) || w < 0 || w > Math.max(score, 0)) return
    setAnimateReveal(true)
    setPhase('finalClue')
    setTimeout(() => setAnimateReveal(false), 600)
  }

  const handleFinalAnswer = () => {
    setPhase('finalAnswer')
  }

  const handleFinalJudge = (correct: boolean) => {
    const w = parseInt(finalWager) || 0
    setScore((s) => correct ? s + w : s - w)
    setPhase('gameOver')
  }

  // ─── Keyboard Shortcuts ────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === 'clue' && e.key === ' ') {
        e.preventDefault()
        handleShowAnswer()
      }
      if (phase === 'answer') {
        if (e.key === 'ArrowRight' || e.key === 'y') handleJudge(true)
        if (e.key === 'ArrowLeft' || e.key === 'n') handleJudge(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  // ─── Render ────────────────────────────────────────────

  if (board.length === 0) return null

  const containerClass = hostMode
    ? 'fixed inset-0 z-50 bg-[#060CE9] flex flex-col'
    : 'max-w-6xl mx-auto px-4 py-8'

  return (
    <div className={containerClass}>
      {/* ── Top Bar ── */}
      {!hostMode && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Jeopardy!</h1>
            <p className="font-mono text-xs text-ink-soft mt-1 uppercase tracking-wide">
              A Did You Know? Game
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm px-4 py-2 border border-ink/20 rounded bg-cream-2">
              Score: <span className={`font-bold ${score >= 0 ? 'text-green-700' : 'text-tomato'}`}>${score.toLocaleString()}</span>
            </div>
            <button onClick={() => setHostMode(true)} className="pill">Host Mode</button>
            <button onClick={initGame} className="pill">New Game</button>
          </div>
        </div>
      )}

      {/* Host mode top bar */}
      {hostMode && phase === 'board' && (
        <div className="flex items-center justify-between px-6 py-3">
          <div className="text-white font-display text-2xl font-bold">Jeopardy!</div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-lg text-white">
              Score: <span className={`font-bold ${score >= 0 ? 'text-yellow-300' : 'text-red-400'}`}>${score.toLocaleString()}</span>
            </div>
            <button onClick={() => setHostMode(false)} className="font-mono text-xs text-white/70 border border-white/30 px-3 py-1 rounded hover:bg-white/10">Exit Host</button>
            <button onClick={initGame} className="font-mono text-xs text-white/70 border border-white/30 px-3 py-1 rounded hover:bg-white/10">New Game</button>
          </div>
        </div>
      )}

      {/* ── Board Phase ── */}
      {phase === 'board' && (
        <div className={`grid grid-cols-6 gap-1 ${hostMode ? 'flex-1 px-4 pb-4' : ''}`}
             style={hostMode ? { gridAutoRows: '1fr' } : {}}>
          {/* Category Headers */}
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="text-center font-display font-bold text-white py-3 rounded-t"
              style={{
                backgroundColor: '#060CE9',
                fontSize: hostMode ? '1.5rem' : '0.95rem',
                textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
                borderBottom: '3px solid #0400A0',
              }}
            >
              {cat}
            </div>
          ))}

          {/* Clue Cells */}
          {VALUES.map((val) =>
            CATEGORIES.map((cat) => {
              const key = `${cat}-${val}`
              const isRevealed = revealed.has(key)
              return (
                <button
                  key={key}
                  onClick={() => handleCellClick(cat, val)}
                  disabled={isRevealed}
                  className="relative flex items-center justify-center rounded transition-all duration-200"
                  style={{
                    backgroundColor: isRevealed ? '#03006B' : '#060CE9',
                    minHeight: hostMode ? undefined : '70px',
                    cursor: isRevealed ? 'default' : 'pointer',
                    border: '1px solid #0400A0',
                    opacity: isRevealed ? 0.35 : 1,
                  }}
                >
                  {!isRevealed && (
                    <span
                      className="font-display font-bold"
                      style={{
                        color: '#FFCC00',
                        fontSize: hostMode ? '2.5rem' : '1.4rem',
                        textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      ${val}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}

      {/* ── Daily Double Flash ── */}
      {phase === 'dailyDouble' && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1' : 'py-20'}`}>
          <div className={`transition-all duration-500 ${dailyDoubleFlash ? 'scale-125' : 'scale-100'}`}>
            <div
              className="font-display font-bold text-center mb-8"
              style={{
                fontSize: hostMode ? '5rem' : '3rem',
                color: hostMode ? '#FFCC00' : 'var(--tomato)',
                textShadow: hostMode ? '2px 4px 8px rgba(0,0,0,0.5)' : 'none',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            >
              DAILY DOUBLE!
            </div>
          </div>
          <p className={`font-mono mb-6 ${hostMode ? 'text-white text-xl' : 'text-ink-soft text-sm'}`}>
            Current Score: <span className="font-bold">${score.toLocaleString()}</span>
          </p>
          <p className={`font-mono mb-4 ${hostMode ? 'text-white/80 text-lg' : 'text-ink-soft text-sm'}`}>
            Enter your wager (up to ${Math.max(score, 1000).toLocaleString()}):
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={Math.max(score, 1000)}
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDailyDoubleWager()}
              className="font-mono text-center border-2 rounded px-4 py-2 bg-white text-ink"
              style={{
                fontSize: hostMode ? '2rem' : '1.1rem',
                width: hostMode ? '200px' : '140px',
                borderColor: '#060CE9',
              }}
              autoFocus
              placeholder="$0"
            />
            <button
              onClick={handleDailyDoubleWager}
              className={hostMode
                ? 'font-mono text-lg bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-300'
                : 'btn btn-primary'}
            >
              Wager
            </button>
          </div>
        </div>
      )}

      {/* ── Clue Phase ── */}
      {phase === 'clue' && activeClue && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1 px-8' : 'py-16'}`}>
          <div className={`w-full max-w-3xl rounded-lg p-8 text-center ${animateReveal ? 'animate-fadeIn' : ''}`}
               style={{ backgroundColor: '#060CE9' }}>
            {isDailyDouble && (
              <div className="font-mono text-yellow-400 text-sm mb-2 uppercase tracking-wider">
                Daily Double &mdash; ${parseInt(wager || '0').toLocaleString()} wagered
              </div>
            )}
            <div className="font-mono text-white/60 text-xs mb-2 uppercase tracking-wider">
              {activeClue.category} &mdash; ${activeClue.value}
            </div>
            <p
              className="font-display text-white leading-relaxed my-6"
              style={{
                fontSize: hostMode ? '2.5rem' : '1.5rem',
                textShadow: '1px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {activeClue.clue}
            </p>
            <button
              onClick={handleShowAnswer}
              className="font-mono text-sm uppercase tracking-wider mt-4 px-6 py-2 rounded border border-white/40 text-white/80 hover:bg-white/10 transition-colors"
            >
              Show Answer (Space)
            </button>
          </div>
        </div>
      )}

      {/* ── Answer Phase ── */}
      {phase === 'answer' && activeClue && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1 px-8' : 'py-16'}`}>
          <div className="w-full max-w-3xl rounded-lg p-8 text-center"
               style={{ backgroundColor: '#060CE9' }}>
            {isDailyDouble && (
              <div className="font-mono text-yellow-400 text-sm mb-2 uppercase tracking-wider">
                Daily Double &mdash; ${parseInt(wager || '0').toLocaleString()} wagered
              </div>
            )}
            <div className="font-mono text-white/60 text-xs mb-2 uppercase tracking-wider">
              {activeClue.category} &mdash; ${activeClue.value}
            </div>
            <p className="font-display text-white/70 leading-relaxed my-4" style={{ fontSize: hostMode ? '1.5rem' : '1.1rem' }}>
              {activeClue.clue}
            </p>
            <div className="my-6 border-t border-white/20 pt-6">
              <p
                className="font-display font-bold text-yellow-300 animate-fadeIn"
                style={{
                  fontSize: hostMode ? '3rem' : '1.8rem',
                  textShadow: '1px 2px 6px rgba(0,0,0,0.4)',
                }}
              >
                {activeClue.answer}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => handleJudge(true)}
                className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 rounded bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                <span className="text-lg">&#10003;</span> Correct (Y / &rarr;)
              </button>
              <button
                onClick={() => handleJudge(false)}
                className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                <span className="text-lg">&#10007;</span> Incorrect (N / &larr;)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Final Jeopardy Wager ── */}
      {phase === 'finalWager' && finalClue && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1' : 'py-20'}`}>
          <div
            className="font-display font-bold text-center mb-2"
            style={{
              fontSize: hostMode ? '4rem' : '2.5rem',
              color: hostMode ? '#FFCC00' : 'var(--tomato)',
              textShadow: hostMode ? '2px 4px 8px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            FINAL JEOPARDY
          </div>
          <p className={`font-mono mb-4 ${hostMode ? 'text-white text-lg' : 'text-ink-soft text-sm'}`}>
            Category: <span className="font-bold">{finalClue.category}</span>
          </p>
          <p className={`font-mono mb-6 ${hostMode ? 'text-white/80 text-lg' : 'text-ink-soft text-sm'}`}>
            Your score: <span className="font-bold">${score.toLocaleString()}</span> &mdash; Wager up to that amount:
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={Math.max(score, 0)}
              value={finalWager}
              onChange={(e) => setFinalWager(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFinalWager()}
              className="font-mono text-center border-2 rounded px-4 py-2 bg-white text-ink"
              style={{
                fontSize: hostMode ? '2rem' : '1.1rem',
                width: hostMode ? '200px' : '140px',
                borderColor: '#060CE9',
              }}
              autoFocus
              placeholder="$0"
            />
            <button
              onClick={handleFinalWager}
              className={hostMode
                ? 'font-mono text-lg bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-300'
                : 'btn btn-primary'}
            >
              Wager
            </button>
          </div>
        </div>
      )}

      {/* ── Final Jeopardy Clue ── */}
      {phase === 'finalClue' && finalClue && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1 px-8' : 'py-16'}`}>
          <div className={`w-full max-w-3xl rounded-lg p-10 text-center ${animateReveal ? 'animate-fadeIn' : ''}`}
               style={{ backgroundColor: '#060CE9' }}>
            <div className="font-mono text-yellow-400 text-sm mb-2 uppercase tracking-wider">
              Final Jeopardy &mdash; ${parseInt(finalWager || '0').toLocaleString()} wagered
            </div>
            <p
              className="font-display text-white leading-relaxed my-8"
              style={{
                fontSize: hostMode ? '2.5rem' : '1.6rem',
                textShadow: '1px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {finalClue.clue}
            </p>
            <button
              onClick={handleFinalAnswer}
              className="font-mono text-sm uppercase tracking-wider mt-4 px-6 py-2 rounded border border-white/40 text-white/80 hover:bg-white/10 transition-colors"
            >
              Reveal Answer
            </button>
          </div>
        </div>
      )}

      {/* ── Final Jeopardy Answer ── */}
      {phase === 'finalAnswer' && finalClue && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1 px-8' : 'py-16'}`}>
          <div className="w-full max-w-3xl rounded-lg p-10 text-center"
               style={{ backgroundColor: '#060CE9' }}>
            <div className="font-mono text-yellow-400 text-sm mb-2 uppercase tracking-wider">
              Final Jeopardy &mdash; ${parseInt(finalWager || '0').toLocaleString()} wagered
            </div>
            <p className="font-display text-white/70 leading-relaxed my-4" style={{ fontSize: hostMode ? '1.4rem' : '1.1rem' }}>
              {finalClue.clue}
            </p>
            <div className="my-6 border-t border-white/20 pt-6">
              <p
                className="font-display font-bold text-yellow-300 animate-fadeIn"
                style={{
                  fontSize: hostMode ? '3rem' : '2rem',
                  textShadow: '1px 2px 6px rgba(0,0,0,0.4)',
                }}
              >
                {finalClue.answer}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => handleFinalJudge(true)}
                className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 rounded bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                <span className="text-lg">&#10003;</span> Correct
              </button>
              <button
                onClick={() => handleFinalJudge(false)}
                className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                <span className="text-lg">&#10007;</span> Incorrect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Game Over ── */}
      {phase === 'gameOver' && (
        <div className={`flex flex-col items-center justify-center ${hostMode ? 'flex-1' : 'py-20'}`}>
          <div
            className="font-display font-bold text-center mb-4"
            style={{
              fontSize: hostMode ? '4rem' : '2.5rem',
              color: hostMode ? '#FFCC00' : 'var(--ink)',
            }}
          >
            Game Over!
          </div>
          <div
            className="font-display font-bold text-center mb-8"
            style={{
              fontSize: hostMode ? '5rem' : '3.5rem',
              color: score >= 0
                ? (hostMode ? '#4ade80' : '#16a34a')
                : (hostMode ? '#f87171' : 'var(--tomato)'),
            }}
          >
            ${score.toLocaleString()}
          </div>
          <p className={`font-mono text-center mb-8 ${hostMode ? 'text-white/70 text-xl' : 'text-ink-soft text-sm'}`}>
            {score >= 10000 ? 'Outstanding! You crushed it!' :
             score >= 5000 ? 'Great game! Well played!' :
             score >= 0 ? 'Not bad! Try again for a higher score.' :
             'Tough round! Give it another shot.'}
          </p>
          <button
            onClick={initGame}
            className={hostMode
              ? 'font-mono text-xl bg-yellow-400 text-black px-8 py-3 rounded font-bold hover:bg-yellow-300'
              : 'btn btn-primary text-lg'}
          >
            Play Again
          </button>
        </div>
      )}

      {/* ── Bottom Score Bar (Host Mode, during clue/answer) ── */}
      {hostMode && (phase === 'clue' || phase === 'answer' || phase === 'finalClue' || phase === 'finalAnswer') && (
        <div className="flex items-center justify-between px-6 py-3 bg-black/30">
          <button onClick={() => {
            if (phase === 'clue') {
              // Go back to board
              setPhase('board')
              setActiveClue(null)
            }
          }} className="font-mono text-xs text-white/50 border border-white/20 px-3 py-1 rounded hover:bg-white/10">
            Back
          </button>
          <div className="font-mono text-lg text-white">
            Score: <span className={`font-bold ${score >= 0 ? 'text-yellow-300' : 'text-red-400'}`}>${score.toLocaleString()}</span>
          </div>
          <div className="font-mono text-xs text-white/40">
            {cluesRemaining} clues remaining
          </div>
        </div>
      )}

      {/* ── Animations ── */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
