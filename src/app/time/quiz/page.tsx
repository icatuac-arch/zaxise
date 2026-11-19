'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Brain, Globe, Rocket, Flag, Moon, Telescope, Trophy,
  ChevronRight, Star, Zap, BarChart3
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Quiz Definitions ─────────────────────────────────────
interface QuizInfo {
  slug: string
  title: string
  description: string
  icon: React.ElementType
  questions: number
  difficulty: string
  time: string
  color: string
  gradient: string
  storageKey: string
}

const QUIZZES: QuizInfo[] = [
  {
    slug: 'timezone',
    title: 'Timezone Challenge',
    description: 'Can you guess what time it is around the world?',
    icon: Globe,
    questions: 10,
    difficulty: '3 difficulties',
    time: '3-5 min',
    color: 'text-primary',
    gradient: 'from-primary to-indigo-400',
    storageKey: 'tz-quiz-best',
  },
  {
    slug: 'space',
    title: 'Space Trivia',
    description: 'How well do you know space?',
    icon: Rocket,
    questions: 15,
    difficulty: 'Medium',
    time: '3-5 min',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-amber-400',
    storageKey: 'space-quiz-best',
  },
  {
    slug: 'flags',
    title: 'Flags & Countries',
    description: 'Match flags to their countries',
    icon: Flag,
    questions: 10,
    difficulty: 'Easy-Medium',
    time: '2-4 min',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-400',
    storageKey: 'flags-quiz-best',
  },
  {
    slug: 'moon',
    title: 'Moon & Eclipse',
    description: 'Test your lunar knowledge',
    icon: Moon,
    questions: 10,
    difficulty: 'Medium',
    time: '3-5 min',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-300',
    storageKey: 'moon-quiz-best',
  },
  {
    slug: 'astronomy',
    title: 'Astronomy Basics',
    description: 'Stars, constellations, and the cosmos',
    icon: Telescope,
    questions: 10,
    difficulty: 'Medium-Hard',
    time: '3-5 min',
    color: 'text-secondary',
    gradient: 'from-secondary to-cyan-300',
    storageKey: 'astro-quiz-best',
  },
]

// ─── Main Page ────────────────────────────────────────────
export default function QuizHubPage() {
  const [bestScores, setBestScores] = useState<Record<string, number>>({})
  const [totalPlayed, setTotalPlayed] = useState(0)

  useEffect(() => {
    const scores: Record<string, number> = {}
    let played = 0
    QUIZZES.forEach(q => {
      const saved = localStorage.getItem(q.storageKey)
      if (saved) {
        scores[q.slug] = parseInt(saved)
        played++
      }
    })
    setBestScores(scores)
    setTotalPlayed(played)
  }, [])

  const totalBestScore = Object.values(bestScores).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-14 pb-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 mb-6">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Test Your Knowledge
          </h1>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Choose a quiz topic and challenge yourself. Track your best scores and improve over time!
          </p>
        </div>

        {/* Overall Stats */}
        {totalPlayed > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="font-heading font-bold text-2xl">{totalPlayed}</div>
              <div className="text-muted text-xs">Quizzes Played</div>
            </div>
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <div className="font-heading font-bold text-2xl">{totalBestScore}</div>
              <div className="text-muted text-xs">Total Best Score</div>
            </div>
            <div className="p-4 rounded-xl bg-card-bg border border-card-border text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-secondary" />
              <div className="font-heading font-bold text-2xl">{QUIZZES.length}</div>
              <div className="text-muted text-xs">Quizzes Available</div>
            </div>
          </div>
        )}

        <AdBanner />

        {/* Quiz Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {QUIZZES.map(quiz => {
            const Icon = quiz.icon
            const best = bestScores[quiz.slug]

            return (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group relative p-6 rounded-2xl bg-card-bg border border-card-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${quiz.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${quiz.gradient} shadow-lg flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-semibold mb-1">{quiz.title}</h3>
                    <p className="text-muted text-sm mb-3">{quiz.description}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card-border text-muted text-xs">
                        <Zap className="w-3 h-3" />
                        {quiz.questions} questions
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card-border text-muted text-xs">
                        <Star className="w-3 h-3" />
                        {quiz.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card-border text-muted text-xs">
                        ~{quiz.time}
                      </span>
                    </div>

                    {/* Best score + Play */}
                    <div className="flex items-center justify-between">
                      {best !== undefined ? (
                        <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
                          <Trophy className="w-4 h-4" />
                          Best: {best}
                        </div>
                      ) : (
                        <span className="text-muted text-sm">Not played yet</span>
                      )}
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-heading font-semibold transition-colors duration-200">
                        Play Now
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
