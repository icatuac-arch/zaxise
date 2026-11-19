"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, PartyPopper } from "lucide-react";
import { PATHS, loadPathProgress, savePathProgress, type PathProgress, type AllPathProgress } from "../page";
import { useBadges } from "@/components/facts/BadgeDisplay";
import { useStreak } from "@/components/facts/StreakTracker";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  publishedAt: string;
}

type LearningMode = "knew" | "learned" | null;

/* ------------------------------------------------------------------ */
/*  Mini-quiz question builder                                          */
/* ------------------------------------------------------------------ */

function buildQuizQuestion(facts: Fact[]): {
  statement: string;
  isTrue: boolean;
  factId: string;
} | null {
  if (facts.length === 0) return null;
  const fact = facts[Math.floor(Math.random() * facts.length)];
  // 50/50: show as true or slightly tweak as a false statement
  const isTrue = Math.random() > 0.5;
  let statement = fact.text;

  if (!isTrue) {
    // Simple tweak: replace a number/keyword at the end with a plausible distractor
    // We prepend a common false qualifier
    const twisters = [
      (t: string) => "MYTH: " + t,
      (t: string) => t.replace(/\d+/, (n) => String(parseInt(n) * 2)),
      (t: string) => t.replace(/first|only|largest|smallest/i, (m) =>
        m.toLowerCase() === "first" ? "last" :
        m.toLowerCase() === "only" ? "one of many" :
        m.toLowerCase() === "largest" ? "smallest" : "largest"
      ),
    ];
    // Pick a twister that actually changed the string
    for (const fn of twisters) {
      const twisted = fn(fact.text);
      if (twisted !== fact.text) {
        statement = twisted;
        break;
      }
    }
    // If none changed it, just negate
    if (statement === fact.text) {
      statement = "FALSE: " + fact.text;
    }
  }

  return { statement, isTrue, factId: fact.id };
}

/* ------------------------------------------------------------------ */
/*  Confetti burst (CSS-only with emoji)                               */
/* ------------------------------------------------------------------ */

function Confetti() {
  const pieces = ["🎉", "⭐", "✨", "🎊", "🏆", "🎯", "💫", "🌟"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {pieces[Math.floor(Math.random() * pieces.length)]}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function PathPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = params.pathId;

  const path = PATHS.find((p) => p.id === pathId);
  const { checkAndAwardBadges, awardBadge } = useBadges();
  const { streak, recordFactRead, recordCategoryExplored } = useStreak();

  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<PathProgress>({
    factsCompleted: 0,
    completed: false,
    startedAt: new Date().toISOString(),
  });

  // UI state
  const [mode, setMode] = useState<LearningMode>(null); // null = not yet responded
  const [showCelebration, setShowCelebration] = useState(false);

  // Mini-quiz state (appears after every 10 facts)
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState<{ statement: string; isTrue: boolean; factId: string } | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null);
  const [quizStreak, setQuizStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load path progress from storage
  useEffect(() => {
    if (!path) return;
    const all = loadPathProgress();
    if (all[path.id]) {
      const p = all[path.id];
      setProgress(p);
      setCurrentIndex(Math.min(p.factsCompleted, 29)); // clamp
    }
  }, [path]);

  // Fetch facts
  useEffect(() => {
    if (!path) return;
    const url = `/api/facts?category=${encodeURIComponent(path.category)}&limit=30&page=1`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        const fetched: Fact[] = data.facts ?? data ?? [];
        setFacts(fetched.slice(0, 30));
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load facts. Please try again.");
        setLoading(false);
      });
  }, [path]);

  const saveProgress = useCallback((p: PathProgress) => {
    if (!path) return;
    const all = loadPathProgress();
    all[path.id] = p;
    savePathProgress(all);
  }, [path]);

  // Check badges whenever progress changes
  const checkBadges = useCallback((p: PathProgress, allProgress: AllPathProgress) => {
    const completedPaths = Object.values(allProgress).filter((x) => x.completed).length;
    const totalFactsRead = streak.totalFactsRead;
    const streakDays = streak.currentStreak;
    const categoriesExplored = Object.keys(loadPathProgress()).length;

    checkAndAwardBadges({
      totalFactsRead,
      completedPaths,
      streakDays,
      categoriesExplored,
    });
  }, [checkAndAwardBadges, streak]);

  const handleAdvance = useCallback((learningMode: LearningMode) => {
    if (!path || mode !== null) return;
    setMode(learningMode);

    const newCompleted = Math.max(progress.factsCompleted, currentIndex + 1);
    const isPathDone = newCompleted >= path.totalFacts || (currentIndex + 1 >= facts.length && facts.length > 0);

    const newProgress: PathProgress = {
      ...progress,
      factsCompleted: newCompleted,
      completed: isPathDone ? true : progress.completed,
    };

    setProgress(newProgress);
    saveProgress(newProgress);
    recordFactRead();
    recordCategoryExplored(path.category);

    // Load updated all progress for badge checking
    const all = loadPathProgress();
    checkBadges(newProgress, all);

    if (isPathDone && !progress.completed) {
      setShowCelebration(true);
      awardBadge("first-path");
      const completedPaths = Object.values(all).filter((x) => x.completed).length;
      if (completedPaths >= 3) awardBadge("3-paths");
      if (completedPaths >= 10) awardBadge("all-paths");
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [path, mode, progress, currentIndex, facts.length, saveProgress, recordFactRead, recordCategoryExplored, checkBadges, awardBadge]);

  const handleNext = useCallback(() => {
    if (!path) return;

    // Check if we should show mini-quiz (after every 10 facts, if not at end)
    const nextIndex = currentIndex + 1;
    const isAfterTen = (currentIndex + 1) % 10 === 0 && nextIndex < facts.length && !progress.completed;

    if (isAfterTen) {
      // Build quiz from last 10 facts
      const last10 = facts.slice(Math.max(0, currentIndex - 9), currentIndex + 1);
      setQuizQuestion(buildQuizQuestion(last10));
      setQuizAnswer(null);
      setShowQuiz(true);
      return;
    }

    // Move to next fact
    setCurrentIndex(nextIndex);
    setMode(null);
  }, [currentIndex, facts, progress.completed, path]);

  const handleQuizAnswer = useCallback((answer: boolean) => {
    if (!quizQuestion || quizAnswer !== null) return;
    const correct = answer === quizQuestion.isTrue;
    setQuizAnswer(answer);
    if (correct) {
      setQuizStreak((s) => s + 1);
      if (quizStreak + 1 >= 3) {
        awardBadge("quiz-perfect");
      }
    } else {
      setQuizStreak(0);
    }
  }, [quizQuestion, quizAnswer, quizStreak, awardBadge]);

  const handleQuizContinue = useCallback(() => {
    setShowQuiz(false);
    setCurrentIndex((i) => i + 1);
    setMode(null);
  }, []);

  // ── Guards ──
  if (!mounted) return null;

  if (!path) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-display text-2xl text-[var(--muted)]">Path not found.</p>
        <Link href="/learn" className="btn mt-6 inline-flex">← Back to Paths</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="font-mono text-sm text-[var(--muted)] animate-pulse">Loading facts…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-display text-lg text-[var(--muted)]">{error}</p>
        <Link href="/learn" className="btn mt-6 inline-flex">← Back to Paths</Link>
      </div>
    );
  }

  // No facts from API for this category — show fallback message
  if (facts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">{path.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-2">{path.title}</h2>
        <p className="font-mono text-sm text-[var(--muted)] mb-6">
          We&apos;re adding more {path.category} facts soon. Check back shortly!
        </p>
        <Link href="/learn" className="btn btn-primary inline-flex">← Back to Paths</Link>
      </div>
    );
  }

  const totalFacts = Math.min(path.totalFacts, facts.length);
  const safeIndex = Math.min(currentIndex, totalFacts - 1);
  const currentFact = facts[safeIndex];
  const pct = Math.min(100, Math.round((progress.factsCompleted / totalFacts) * 100));
  const isCompleted = progress.completed || progress.factsCompleted >= totalFacts;

  // ── Mini-quiz screen ──
  if (showQuiz && quizQuestion) {
    const answered = quizAnswer !== null;
    const correct = answered ? quizAnswer === quizQuestion.isTrue : null;

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/learn" className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] flex items-center gap-1">
            <ChevronLeft size={14} /> Paths
          </Link>
          <span className="text-[var(--muted)]/40">›</span>
          <span className="font-mono text-xs text-[var(--text)]">{path.title}</span>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent)]/40 bg-[var(--accent)]/5 font-mono text-xs text-[var(--accent)] uppercase tracking-wider mb-6">
            ✨ Mini Quiz — Checkpoint
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-2">
            True or False?
          </h2>
          <p className="font-mono text-xs text-[var(--muted)]">
            Based on the last 10 facts you learned
          </p>
        </div>

        {/* Statement card */}
        <div className="border border-[var(--muted)]/30 bg-[var(--surface)] p-6 mb-6">
          <p className="font-display text-xl text-[var(--text)] leading-relaxed">
            &ldquo;{quizQuestion.statement}&rdquo;
          </p>
        </div>

        {/* Buttons */}
        {!answered ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleQuizAnswer(true)}
              className="btn py-4 flex-col items-center justify-center gap-2 text-base font-display"
            >
              <span className="text-2xl">✓</span>
              True
            </button>
            <button
              onClick={() => handleQuizAnswer(false)}
              className="btn py-4 flex-col items-center justify-center gap-2 text-base font-display"
            >
              <span className="text-2xl">✗</span>
              False
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 text-center border ${
              correct
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--muted)]/40 bg-[var(--surface)]"
            }`}>
              <div className="text-3xl mb-2">{correct ? "✅" : "❌"}</div>
              <p className="font-display text-lg font-bold text-[var(--text)]">
                {correct ? "Correct!" : "Not quite"}
              </p>
              <p className="font-mono text-xs text-[var(--muted)] mt-1">
                That statement was <strong>{quizQuestion.isTrue ? "True" : "False"}</strong>.
              </p>
              {quizStreak > 1 && (
                <p className="font-mono text-xs text-[var(--accent)] mt-2">
                  🔥 {quizStreak} correct in a row!
                </p>
              )}
            </div>
            <button onClick={handleQuizContinue} className="btn btn-primary w-full justify-center">
              Continue Learning <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Completion screen ──
  if (isCompleted && safeIndex >= totalFacts - 1 && mode !== null) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {showCelebration && <Confetti />}

        <div className="text-6xl mb-4">{path.emoji}</div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--accent)] font-mono text-xs text-[var(--accent)] uppercase tracking-wider mb-6">
          <PartyPopper size={12} /> Path Complete!
        </div>
        <h1 className="font-display text-4xl font-bold text-[var(--text)] mb-3">
          You finished {path.title}!
        </h1>
        <p className="font-mono text-sm text-[var(--muted)] mb-8">
          You&apos;ve learned all {totalFacts} facts in this path. Keep going!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/learn" className="btn btn-primary inline-flex justify-center">
            Back to Paths →
          </Link>
          <Link href="/stats" className="btn inline-flex justify-center">
            View Your Stats
          </Link>
        </div>
      </div>
    );
  }

  // ── Main fact view ──
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {showCelebration && <Confetti />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/learn" className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] flex items-center gap-1">
          <ChevronLeft size={14} /> Paths
        </Link>
        <span className="text-[var(--muted)]/40">›</span>
        <span className="font-mono text-xs text-[var(--text)]">{path.title}</span>
      </div>

      {/* Path header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl leading-none">{path.emoji}</span>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">{path.title}</h1>
          <p className="font-mono text-xs text-[var(--muted)]">{path.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-[var(--muted)]">
            Fact {safeIndex + 1} of {totalFacts}
          </span>
          <span className="font-mono text-xs font-bold text-[var(--accent)]">
            {progress.factsCompleted}/{totalFacts} completed · {pct}%
          </span>
        </div>
        <div className="h-2 bg-[var(--muted)]/15 w-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Milestone markers */}
        <div className="flex mt-1">
          {[10, 20, 30].map((n) => (
            <div
              key={n}
              className="font-mono text-[9px] text-[var(--muted)]/50"
              style={{ marginLeft: `${((n / totalFacts) * 100) - 3}%` }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Fact card */}
      <div
        key={safeIndex}
        className="border border-[var(--muted)]/30 bg-[var(--surface)] p-6 sm:p-8 mb-5"
        style={{ animation: "fadeUp 350ms ease both" }}
      >
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--muted)]/30 text-[var(--muted)]">
            {currentFact.category}
          </span>
          {currentFact.difficulty && (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--muted)]/20 text-[var(--muted)]/60">
              {currentFact.difficulty}
            </span>
          )}
          <span className="ml-auto font-mono text-[10px] text-[var(--muted)]/50">
            #{safeIndex + 1}
          </span>
        </div>

        {/* Fact text */}
        <p className="font-display text-xl sm:text-2xl leading-relaxed text-[var(--text)] mb-5">
          {currentFact.text}
        </p>

        {/* Source */}
        {currentFact.source?.name && (
          <p className="font-mono text-[10px] text-[var(--muted)]/60 border-t border-[var(--muted)]/15 pt-3">
            Source:{" "}
            {currentFact.source.url ? (
              <a
                href={currentFact.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] underline underline-offset-2"
              >
                {currentFact.source.name}
              </a>
            ) : (
              currentFact.source.name
            )}
          </p>
        )}
      </div>

      {/* Action buttons */}
      {mode === null ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAdvance("knew")}
            className="flex flex-col items-center gap-2 p-4 border border-[var(--muted)]/30 bg-[var(--surface)] hover:border-[var(--muted)]/60 transition-all font-mono text-xs text-[var(--text)] uppercase tracking-wider"
          >
            <span className="text-xl">💡</span>
            I knew this!
          </button>
          <button
            onClick={() => handleAdvance("learned")}
            className="flex flex-col items-center gap-2 p-4 border border-[var(--accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-all font-mono text-xs text-[var(--accent)] uppercase tracking-wider"
          >
            <Sparkles size={18} />
            Learned something new!
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Feedback */}
          <div className="flex items-center gap-2 px-4 py-3 border border-[var(--muted)]/20 bg-[var(--surface)] font-mono text-xs text-[var(--muted)]">
            <CheckCircle size={14} className="text-[var(--accent)] shrink-0" />
            <span>
              {mode === "knew"
                ? "Great — that's in your arsenal! Keep going."
                : "New knowledge added to your brain. Excellent!"}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {safeIndex > 0 && (
              <button
                onClick={() => { setCurrentIndex((i) => i - 1); setMode(null); }}
                className="btn flex-shrink-0"
              >
                <ChevronLeft size={14} />
              </button>
            )}
            {!isCompleted || safeIndex < totalFacts - 1 ? (
              <button onClick={handleNext} className="btn btn-primary flex-1 justify-center">
                {safeIndex + 1 >= totalFacts
                  ? "Finish Path 🎉"
                  : `Next Fact (${safeIndex + 2}/${totalFacts})`}
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowCelebration(true);
                  setTimeout(() => setShowCelebration(false), 4000);
                }}
                className="btn btn-primary flex-1 justify-center"
              >
                <PartyPopper size={14} />
                Path Complete!
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mini-quiz hint after every 10 */}
      {(safeIndex + 1) % 10 === 0 && mode !== null && !showQuiz && (
        <p className="mt-3 font-mono text-[10px] text-[var(--muted)] text-center">
          ✨ A mini-quiz checkpoint is coming up next!
        </p>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
