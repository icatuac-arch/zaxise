/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Star,
  Brain,
  ArrowRight,
  Timer,
} from 'lucide-react';

// ─── QUIZ DATA ─────────────────────────────────────────────

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  difficulty: Difficulty;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Which country is home to the Taj Mahal?',
    options: ['Pakistan', 'India', 'Bangladesh', 'Nepal'],
    correctIndex: 1,
    funFact: 'The Taj Mahal took 22 years to build (1632-1653) and involved over 20,000 artisans. It changes color throughout the day — pinkish in the morning, white in the afternoon, and golden at night.',
    difficulty: 'Easy',
  },
  {
    id: 2,
    question: 'In which city is the Colosseum located?',
    options: ['Athens', 'Rome', 'Istanbul', 'Barcelona'],
    correctIndex: 1,
    funFact: 'The Colosseum could hold 50,000-80,000 spectators and had a retractable canvas roof (velarium) operated by sailors. It could even be flooded for mock naval battles!',
    difficulty: 'Easy',
  },
  {
    id: 3,
    question: 'What currency does Japan use?',
    options: ['Won', 'Yuan', 'Yen', 'Ringgit'],
    correctIndex: 2,
    funFact: 'Japan is still heavily cash-based. Many restaurants and small shops do not accept credit cards, so always carry yen notes and coins when traveling there.',
    difficulty: 'Medium',
  },
  {
    id: 4,
    question: 'In which of these countries is tipping considered rude?',
    options: ['United States', 'Japan', 'France', 'Mexico'],
    correctIndex: 1,
    funFact: 'In Japan, tipping can imply that the worker is not paid enough by their employer, which is seen as an insult. The same applies in South Korea and China.',
    difficulty: 'Medium',
  },
  {
    id: 5,
    question: 'What is the best time of year to visit Thailand?',
    options: ['June - August', 'November - February', 'March - May', 'September - October'],
    correctIndex: 1,
    funFact: 'November to February is Thailand\'s cool and dry season — perfect weather with temperatures around 25-30 degrees C. The rainy season (June-October) brings daily downpours but also fewer tourists and lower prices.',
    difficulty: 'Medium',
  },
  {
    id: 6,
    question: 'Which country has more time zones: Russia or China?',
    options: ['China (5 zones)', 'Russia (11 zones)', 'They have the same', 'China (8 zones)'],
    correctIndex: 1,
    funFact: 'Despite spanning 5 time zones geographically, China uses just ONE official time zone (Beijing Time / UTC+8). Russia, on the other hand, uses all 11 of its time zones.',
    difficulty: 'Hard',
  },
  {
    id: 7,
    question: 'In which country is Machu Picchu located?',
    options: ['Bolivia', 'Colombia', 'Peru', 'Ecuador'],
    correctIndex: 2,
    funFact: 'Machu Picchu sits at 2,430 meters (7,970 ft) above sea level. The Spanish conquistadors never found it, and it remained unknown to the outside world until American historian Hiram Bingham rediscovered it in 1911.',
    difficulty: 'Easy',
  },
  {
    id: 8,
    question: 'What is the capital of Turkey?',
    options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
    correctIndex: 1,
    funFact: 'Istanbul is Turkey\'s largest city and economic capital, but Ankara has been the political capital since 1923 when Ataturk moved it there to establish the new Republic of Turkey.',
    difficulty: 'Hard',
  },
  {
    id: 9,
    question: 'In which country is it considered rude to eat with your left hand?',
    options: ['Japan', 'France', 'India', 'Brazil'],
    correctIndex: 2,
    funFact: 'In India and many Middle Eastern countries, the left hand is considered unclean because it is traditionally used for personal hygiene. Always use your right hand when eating, giving, or receiving items.',
    difficulty: 'Medium',
  },
  {
    id: 10,
    question: 'Which city is home to the Sagrada Familia?',
    options: ['Madrid', 'Lisbon', 'Barcelona', 'Seville'],
    correctIndex: 2,
    funFact: 'Antoni Gaudi\'s Sagrada Familia has been under construction since 1882 and is expected to be completed around 2026 — over 140 years in the making. It is the world\'s longest-running construction project.',
    difficulty: 'Easy',
  },
  {
    id: 11,
    question: 'What side of the road does Japan drive on?',
    options: ['Right side', 'Left side', 'Depends on the region', 'Center lane'],
    correctIndex: 1,
    funFact: 'Japan drives on the left, which dates back to samurai traditions — samurai wore their swords on the left hip and walked on the left side of the road to avoid bumping swords with oncoming travelers.',
    difficulty: 'Medium',
  },
  {
    id: 12,
    question: 'Which country has the most UNESCO World Heritage Sites?',
    options: ['China', 'Spain', 'Italy', 'France'],
    correctIndex: 2,
    funFact: 'Italy leads the world with 58 UNESCO World Heritage Sites, followed closely by China (57) and Germany (52). These include the Colosseum, Venice, Pompeii, the Amalfi Coast, and many more.',
    difficulty: 'Hard',
  },
  {
    id: 13,
    question: 'What is a tuk-tuk?',
    options: ['A traditional dance', 'A three-wheeled taxi', 'A type of curry', 'A greeting'],
    correctIndex: 1,
    funFact: 'Tuk-tuks are three-wheeled motorized taxis popular in Thailand, India, Sri Lanka, and other Asian countries. The name comes from the sound of their small engines. Always negotiate the price before getting in!',
    difficulty: 'Easy',
  },
  {
    id: 14,
    question: 'What language is spoken in Brazil?',
    options: ['Spanish', 'Portuguese', 'Brazilian', 'English'],
    correctIndex: 1,
    funFact: 'Brazil is the only Portuguese-speaking country in the Americas. It was colonized by Portugal (not Spain), which is why it speaks Portuguese while all its neighbors speak Spanish.',
    difficulty: 'Medium',
  },
  {
    id: 15,
    question: 'Where are the Pyramids of Giza located?',
    options: ['Sudan', 'Morocco', 'Egypt, near Cairo', 'Libya'],
    correctIndex: 2,
    funFact: 'The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World and the only one still standing. It is located on the outskirts of Cairo — you can actually see them from a nearby Pizza Hut!',
    difficulty: 'Easy',
  },
  {
    id: 16,
    question: 'Which European city is famously built on canals?',
    options: ['Paris', 'Venice', 'Prague', 'Vienna'],
    correctIndex: 1,
    funFact: 'Venice has 177 canals and over 400 bridges connecting 118 small islands. Fun fact: Amsterdam also has more canals than Venice (165 vs 150+ named canals) and more bridges (1,753 vs 400)!',
    difficulty: 'Easy',
  },
  {
    id: 17,
    question: 'What is the famous cherry blossom called in Japanese?',
    options: ['Hanami', 'Sakura', 'Ikebana', 'Bonsai'],
    correctIndex: 1,
    funFact: 'Sakura season typically lasts just 1-2 weeks in late March to mid-April. "Hanami" is the tradition of cherry blossom viewing — millions of Japanese people picnic under the trees during this brief, beautiful period.',
    difficulty: 'Medium',
  },
  {
    id: 18,
    question: 'Which country is famous for its fjords?',
    options: ['Sweden', 'Denmark', 'Norway', 'Finland'],
    correctIndex: 2,
    funFact: 'Norway\'s Sognefjorden is the longest fjord in Norway at 204 km and the deepest at 1,308 meters. Fjords were carved by glaciers during the Ice Age and create some of the most dramatic landscapes on Earth.',
    difficulty: 'Medium',
  },
  {
    id: 19,
    question: 'What is the traditional greeting in Thailand?',
    options: ['Bow', 'Handshake', 'Wai (palms pressed together)', 'Hug'],
    correctIndex: 2,
    funFact: 'The "wai" greeting involves pressing your palms together at chest level and bowing slightly. The higher you place your hands, the more respect you show. It is used for greetings, thank-yous, and apologies.',
    difficulty: 'Hard',
  },
  {
    id: 20,
    question: 'Where is the Dead Sea located?',
    options: ['Egypt and Libya', 'Turkey and Greece', 'Israel and Jordan', 'Iraq and Iran'],
    correctIndex: 2,
    funFact: 'The Dead Sea is 430 meters below sea level — the lowest point on Earth\'s surface. Its water is 9.6 times saltier than the ocean, making it impossible to sink. However, it is shrinking by about 1 meter per year.',
    difficulty: 'Hard',
  },
];

const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; text: string }> = {
  Easy: { bg: 'bg-green-50', text: 'text-green-700' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Hard: { bg: 'bg-red-50', text: 'text-red-700' },
};

// ─── COMPONENT ─────────────────────────────────────────────

type QuizState = 'start' | 'playing' | 'answered' | 'results';

export default function TravelQuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [copied, setCopied] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load best score
  useEffect(() => {
    const stored = localStorage.getItem('wt-quiz-best');
    if (stored) setBestScore(parseInt(stored, 10));
  }, []);

  const startQuiz = useCallback(() => {
    // Shuffle questions
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setQuizState('playing');
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setTimeLeft(15);
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];

  // Timer
  useEffect(() => {
    if (quizState !== 'playing') return;
    if (timeLeft <= 0) {
      // Time's up — mark as unanswered
      handleAnswer(-1);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState, timeLeft]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (quizState !== 'playing') return;
      if (timerRef.current) clearTimeout(timerRef.current);

      setSelectedOption(optionIndex);
      setQuizState('answered');

      const isCorrect = optionIndex === currentQuestion.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      setAnswers((a) => [...a, optionIndex]);
    },
    [quizState, currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= shuffledQuestions.length) {
      // Quiz complete
      setQuizState('results');
      const finalScore = score;
      if (bestScore === null || finalScore > bestScore) {
        setBestScore(finalScore);
        localStorage.setItem('wt-quiz-best', String(finalScore));
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setTimeLeft(15);
      setQuizState('playing');
    }
  }, [currentIndex, shuffledQuestions.length, score, bestScore]);

  const shareScore = useCallback(async () => {
    const text = `I scored ${score}/${shuffledQuestions.length} on Zaxise's Travel Quiz! How well do you know the world?\n\nTake the quiz: zaxise.com/travel-quiz`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [score, shuffledQuestions.length]);

  const getScoreMessage = useCallback(() => {
    const pct = (score / shuffledQuestions.length) * 100;
    if (pct === 100) return { emoji: '\u{1F3C6}', title: 'Perfect Score!', subtitle: 'You are a true world traveler!' };
    if (pct >= 80) return { emoji: '\u{1F31F}', title: 'Excellent!', subtitle: 'You really know your stuff!' };
    if (pct >= 60) return { emoji: '\u{1F44F}', title: 'Great Job!', subtitle: 'You know more than most people!' };
    if (pct >= 40) return { emoji: '\u{1F30D}', title: 'Not Bad!', subtitle: 'Time to explore more of the world!' };
    return { emoji: '\u{2708}\u{FE0F}', title: 'Keep Exploring!', subtitle: 'Every journey starts with a single step!' };
  }, [score, shuffledQuestions.length]);

  const timerColor = timeLeft > 10 ? 'text-green-600' : timeLeft > 5 ? 'text-amber-500' : 'text-red-500';
  const timerBg = timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Travel Quiz</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#F59E0B] rounded-xl">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
              Travel Quiz
            </h1>
          </div>
          <p className="text-xl text-white/80 mt-2 max-w-2xl">
            How well do you know the world? Test your travel knowledge with 20 fun questions, then challenge your friends!
          </p>
          {bestScore !== null && (
            <div className="flex items-center gap-2 mt-5 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 w-fit text-sm">
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              <span>Your best score: {bestScore}/{QUESTIONS.length}</span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Start Screen */}
        {quizState === 'start' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0EA5E9]/10 rounded-full mb-6">
              <Brain className="w-10 h-10 text-[#0EA5E9]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#0F172A] mb-3">
              How Well Do You Know the World?
            </h2>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              20 questions about landmarks, cultures, currencies, and travel trivia. You have 15 seconds per question. Ready?
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-green-700">Easy</span>
                <p className="text-xs text-green-600 mt-0.5">Famous landmarks</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <Star className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-amber-700">Medium</span>
                <p className="text-xs text-amber-600 mt-0.5">Currencies & etiquette</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-red-700">Hard</span>
                <p className="text-xs text-red-600 mt-0.5">Capitals & obscure</p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/25 text-lg"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Playing / Answered */}
        {(quizState === 'playing' || quizState === 'answered') && currentQuestion && (
          <div>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-[#0F172A]">
                {currentIndex + 1}/{shuffledQuestions.length}
              </span>
              <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-[#0EA5E9] rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + (quizState === 'answered' ? 1 : 0)) / shuffledQuestions.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#0F172A]">{score}</span>
              </div>
            </div>

            {/* Timer */}
            {quizState === 'playing' && (
              <div className="flex items-center gap-3 mb-6">
                <Timer className={`w-5 h-5 ${timerColor}`} />
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${timerBg}`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-bold tabular-nums ${timerColor}`}>{timeLeft}s</span>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[currentQuestion.difficulty].bg} ${DIFFICULTY_COLORS[currentQuestion.difficulty].text}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">Question {currentIndex + 1}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F172A] mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    let style = 'bg-white border-slate-200 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/5 text-[#0F172A]';
                    if (quizState === 'answered') {
                      if (idx === currentQuestion.correctIndex) {
                        style = 'bg-green-50 border-green-400 text-green-800';
                      } else if (idx === selectedOption && idx !== currentQuestion.correctIndex) {
                        style = 'bg-red-50 border-red-400 text-red-800';
                      } else {
                        style = 'bg-slate-50 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => quizState === 'playing' && handleAnswer(idx)}
                        disabled={quizState === 'answered'}
                        className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 font-medium transition-all ${style}`}
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {quizState === 'answered' && idx === currentQuestion.correctIndex && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                        {quizState === 'answered' && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fun fact after answering */}
              {quizState === 'answered' && (
                <div className="border-t border-slate-200 bg-[#0EA5E9]/5 p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0EA5E9] mb-1">Fun Fact</p>
                      <p className="text-sm text-[#0F172A] leading-relaxed">{currentQuestion.funFact}</p>
                    </div>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="mt-5 flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    {currentIndex + 1 >= shuffledQuestions.length ? 'See Results' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {quizState === 'results' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
            <h2 className="text-3xl font-serif font-bold text-[#0F172A] mb-2">
              {getScoreMessage().title}
            </h2>
            <p className="text-lg text-slate-600 mb-6">{getScoreMessage().subtitle}</p>

            {/* Score display */}
            <div className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-8 py-5 mb-8 shadow-sm">
              <div className="text-center">
                <p className="text-5xl font-bold text-[#0EA5E9]">{score}</p>
                <p className="text-sm text-slate-500 mt-1">out of {shuffledQuestions.length}</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <p className="text-5xl font-bold text-[#F59E0B]">{Math.round((score / shuffledQuestions.length) * 100)}%</p>
                <p className="text-sm text-slate-500 mt-1">accuracy</p>
              </div>
              {bestScore !== null && (
                <>
                  <div className="w-px h-12 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-5xl font-bold text-slate-300">{bestScore}</p>
                    <p className="text-sm text-slate-500 mt-1">best score</p>
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <button
                onClick={shareScore}
                className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/25"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Score Copied!' : 'Share Your Score'}
              </button>
              <button
                onClick={startQuiz}
                className="flex items-center gap-2 bg-white border border-slate-200 text-[#0F172A] font-semibold px-6 py-3 rounded-xl hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>

            {/* Answer Review */}
            <div className="text-left">
              <h3 className="text-lg font-serif font-bold text-[#0F172A] mb-4">Answer Review</h3>
              <div className="space-y-3">
                {shuffledQuestions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correctIndex;
                  const isUnanswered = userAnswer === -1 || userAnswer === null;
                  return (
                    <div
                      key={q.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {idx + 1}. {q.question}
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Correct: {q.options[q.correctIndex]}
                        </p>
                        {!isCorrect && !isUnanswered && userAnswer !== undefined && userAnswer >= 0 && (
                          <p className="text-sm text-red-600">
                            Your answer: {q.options[userAnswer]}
                          </p>
                        )}
                        {isUnanswered && (
                          <p className="text-sm text-red-600">Time ran out</p>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${DIFFICULTY_COLORS[q.difficulty].bg} ${DIFFICULTY_COLORS[q.difficulty].text}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
