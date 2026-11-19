'use client'

import { useState, useMemo } from 'react'


import { Hash, Trash2 } from 'lucide-react'

function calculateFleschKincaid(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  if (wordCount === 0) return { gradeLevel: 0, readingEase: 0 }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1

  // Count syllables (approximation)
  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '')
    if (word.length <= 3) return 1
    let count = 0
    const vowels = 'aeiouy'
    let prevVowel = false
    for (const ch of word) {
      const isVowel = vowels.includes(ch)
      if (isVowel && !prevVowel) count++
      prevVowel = isVowel
    }
    if (word.endsWith('e') && count > 1) count--
    return Math.max(1, count)
  }

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const avgWordsPerSentence = wordCount / sentences
  const avgSyllablesPerWord = totalSyllables / wordCount

  const readingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59

  return {
    readingEase: Math.max(0, Math.min(100, parseFloat(readingEase.toFixed(1)))),
    gradeLevel: Math.max(0, parseFloat(gradeLevel.toFixed(1))),
  }
}

function getReadingEaseLabel(score: number): string {
  if (score >= 90) return 'Very Easy'
  if (score >= 80) return 'Easy'
  if (score >= 70) return 'Fairly Easy'
  if (score >= 60) return 'Standard'
  if (score >= 50) return 'Fairly Difficult'
  if (score >= 30) return 'Difficult'
  return 'Very Difficult'
}

export default function TextCounterPage() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const charCount = text.length
    const charNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim().split(/\s+/).filter(Boolean)
    const wordCount = text.trim() ? words.length : 0
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
    const lines = text.split('\n').length
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200)) // 200 wpm
    const speakingMinutes = Math.max(1, Math.ceil(wordCount / 130)) // 130 wpm

    // Average word length
    const avgWordLength = wordCount > 0 ? (words.reduce((s, w) => s + w.replace(/[^a-zA-Z0-9]/g, '').length, 0) / wordCount).toFixed(1) : '0'

    // Top 10 most frequent words
    const wordFreq: Record<string, number> = {}
    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-z0-9'-]/g, '')
      if (lower.length > 0) wordFreq[lower] = (wordFreq[lower] || 0) + 1
    }
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Readability
    const readability = calculateFleschKincaid(text)

    return {
      charCount,
      charNoSpaces,
      wordCount,
      sentences,
      paragraphs,
      lines,
      readingMinutes,
      speakingMinutes,
      avgWordLength,
      topWords,
      readability,
    }
  }, [text])

  const socialLimits = [
    { platform: 'Twitter / X', current: text.length, limit: 280, color: text.length > 280 ? 'text-red-400' : 'text-green-400' },
    { platform: 'Instagram', current: text.length, limit: 2200, color: text.length > 2200 ? 'text-red-400' : 'text-green-400' },
    { platform: 'LinkedIn', current: text.length, limit: 3000, color: text.length > 3000 ? 'text-red-400' : 'text-green-400' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Hash size={28} /> Text Counter
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Count characters, words, sentences, paragraphs and reading time.</p>
          </div>
          {text && (
            <button onClick={() => setText('')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-auto px-3 h-10 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-xs font-bold">142 words &middot; 823 chars</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste or type text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>See live counts</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy stats</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Counts words, characters, sentences, and paragraphs.
          </p>
        </div>

        {/* Basic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Characters', value: stats.charCount },
            { label: 'No spaces', value: stats.charNoSpaces },
            { label: 'Words', value: stats.wordCount },
            { label: 'Sentences', value: stats.sentences },
            { label: 'Paragraphs', value: stats.paragraphs },
            { label: 'Lines', value: stats.lines },
            { label: 'Reading time', value: `${stats.readingMinutes} min` },
            { label: 'Avg word length', value: stats.avgWordLength },
          ].map(s => (
            <div key={s.label} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
              <div className="text-2xl font-bold text-[#E8970A] mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Social Media Limits */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Social Media Limits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socialLimits.map(s => (
              <div key={s.platform} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{s.platform}</span>
                <span className={`text-sm font-mono ${s.color}`}>{s.current}/{s.limit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Readability + Top Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Readability */}
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Readability</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Flesch Reading Ease</span>
                  <span className="text-[#E8970A] font-mono">{stats.readability.readingEase}</span>
                </div>
                <div className="h-2 bg-[#1A1726] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8970A] transition-all" style={{ width: `${stats.readability.readingEase}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{getReadingEaseLabel(stats.readability.readingEase)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Flesch-Kincaid Grade Level</span>
                <span className="text-[#E8970A] font-mono">{stats.readability.gradeLevel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Speaking time</span>
                <span className="text-[#E8970A] font-mono">{stats.speakingMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Top Words */}
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Top 10 Words</h3>
            {stats.topWords.length === 0 ? (
              <p className="text-xs text-gray-500">Start typing to see word frequency...</p>
            ) : (
              <div className="space-y-1.5">
                {stats.topWords.map(([word, count], i) => {
                  const maxCount = stats.topWords[0][1] as number
                  const pct = ((count as number) / (maxCount as number)) * 100
                  return (
                    <div key={word} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-4 text-right">{i + 1}</span>
                      <div className="flex-1 relative h-6 bg-[#070510] rounded overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-[#E8970A]/15 rounded" style={{ width: `${pct}%` }} />
                        <div className="relative flex items-center justify-between px-2 h-full">
                          <span className="text-xs text-gray-300 font-mono">{word}</span>
                          <span className="text-xs text-[#E8970A]">{count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={15}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0D1A] border border-[#1A1726] text-white text-sm"
        />
      </main>
      
    </div>
  )
}
