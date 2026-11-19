'use client'

import { useState, useMemo } from 'react'


import { ArrowLeftRight, Trash2, GitCompare, Check, Plus, Minus, Equal } from 'lucide-react'

type DiffType = 'added' | 'removed' | 'unchanged'

interface DiffLine {
  type: DiffType
  text: string
  leftLine?: number
  rightLine?: number
}

function computeDiff(original: string, modified: string, ignoreWhitespace: boolean): DiffLine[] {
  const prep = (s: string) => ignoreWhitespace ? s.replace(/\s+/g, ' ').trim() : s
  const origLines = original.split('\n')
  const modLines = modified.split('\n')

  const n = origLines.length
  const m = modLines.length

  // LCS DP
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (prep(origLines[i - 1]) === prep(modLines[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack
  const result: DiffLine[] = []
  let i = n, j = m
  const stack: DiffLine[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && prep(origLines[i - 1]) === prep(modLines[j - 1])) {
      stack.push({ type: 'unchanged', text: origLines[i - 1], leftLine: i, rightLine: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', text: modLines[j - 1], rightLine: j })
      j--
    } else {
      stack.push({ type: 'removed', text: origLines[i - 1], leftLine: i })
      i--
    }
  }

  stack.reverse()
  return stack
}

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [showDiff, setShowDiff] = useState(false)
  const [viewStyle, setViewStyle] = useState<'unified' | 'side-by-side'>('unified')

  const diff = useMemo(() => {
    if (!showDiff) return []
    return computeDiff(original, modified, ignoreWhitespace)
  }, [original, modified, ignoreWhitespace, showDiff])

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length
    const removed = diff.filter(d => d.type === 'removed').length
    const unchanged = diff.filter(d => d.type === 'unchanged').length
    return { added, removed, unchanged }
  }, [diff])

  const swap = () => {
    const tmp = original
    setOriginal(modified)
    setModified(tmp)
    setShowDiff(false)
  }

  const clearBoth = () => {
    setOriginal('')
    setModified('')
    setShowDiff(false)
  }

  const compare = () => {
    setShowDiff(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Diff Checker
            </h1>
          </div>
          <p className="text-gray-400">Compare two texts and highlight the differences</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1 rounded border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-mono line-through">old text</div>
              <div className="px-3 py-1 rounded border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-mono">new text</div>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1 rounded bg-red-500/10 text-red-400 text-xs font-mono"><span className="bg-red-500/30 px-0.5">old</span> text</div>
              <div className="px-3 py-1 rounded bg-green-500/10 text-green-400 text-xs font-mono"><span className="bg-green-500/30 px-0.5">new</span> text</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste original</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Paste modified</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>See differences</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Highlights additions, deletions, and changes line by line.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <button
            onClick={compare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#E8970A] text-black hover:bg-[#E8970A]/90 transition-colors"
          >
            <GitCompare size={16} />
            Compare
          </button>
          <button
            onClick={swap}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-[#0F0D1A] text-gray-300 border border-[#1A1726] hover:border-[#E8970A] transition-colors"
          >
            <ArrowLeftRight size={16} />
            Swap
          </button>
          <button
            onClick={clearBoth}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-[#0F0D1A] text-gray-300 border border-[#1A1726] hover:border-red-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
            Clear Both
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => { setIgnoreWhitespace(e.target.checked); setShowDiff(false) }}
              className="accent-[#E8970A]"
            />
            Ignore whitespace
          </label>
          <div className="flex bg-[#070510] rounded-lg p-0.5 border border-[#1A1726]">
            <button onClick={() => setViewStyle('unified')} className={`px-3 py-1 rounded text-xs ${viewStyle === 'unified' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Unified</button>
            <button onClick={() => setViewStyle('side-by-side')} className={`px-3 py-1 rounded text-xs ${viewStyle === 'side-by-side' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Side by Side</button>
          </div>
        </div>

        {/* Textareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Original</label>
            <textarea
              value={original}
              onChange={(e) => { setOriginal(e.target.value); setShowDiff(false) }}
              placeholder="Paste original text here..."
              className="w-full h-48 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white font-mono text-sm resize-y focus:outline-none focus:border-[#E8970A]"
            />
          </div>
          <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Modified</label>
            <textarea
              value={modified}
              onChange={(e) => { setModified(e.target.value); setShowDiff(false) }}
              placeholder="Paste modified text here..."
              className="w-full h-48 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white font-mono text-sm resize-y focus:outline-none focus:border-[#E8970A]"
            />
          </div>
        </div>

        {/* Diff output */}
        {showDiff && (
          <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-sm text-gray-400">Results:</span>
              <span className="flex items-center gap-1 text-sm text-green-400">
                <Plus size={14} /> {stats.added} added
              </span>
              <span className="flex items-center gap-1 text-sm text-red-400">
                <Minus size={14} /> {stats.removed} removed
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Equal size={14} /> {stats.unchanged} unchanged
              </span>
            </div>

            {diff.length === 0 && (original || modified) ? (
              <p className="text-gray-500 text-sm">No differences found (or both inputs are empty).</p>
            ) : viewStyle === 'unified' ? (
              <div className="font-mono text-sm max-h-[500px] overflow-y-auto">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`flex items-start px-3 py-0.5 ${
                      line.type === 'added'
                        ? 'bg-green-500/10 text-green-400'
                        : line.type === 'removed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    <span className="w-10 text-right text-gray-600 mr-2 select-none shrink-0">
                      {line.leftLine ?? ''}
                    </span>
                    <span className="w-10 text-right text-gray-600 mr-2 select-none shrink-0">
                      {line.rightLine ?? ''}
                    </span>
                    <span className="w-4 text-center shrink-0 select-none">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{line.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-0 font-mono text-sm max-h-[500px] overflow-y-auto">
                <div className="border-r border-[#1A1726]">
                  {diff.filter(d => d.type !== 'added').map((line, i) => (
                    <div key={i} className={`px-3 py-0.5 ${line.type === 'removed' ? 'bg-red-500/10 text-red-400' : 'text-gray-400'}`}>
                      <span className="w-6 text-right text-gray-600 mr-2 select-none inline-block">{line.leftLine ?? ''}</span>
                      <span className="whitespace-pre-wrap break-all">{line.text}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {diff.filter(d => d.type !== 'removed').map((line, i) => (
                    <div key={i} className={`px-3 py-0.5 ${line.type === 'added' ? 'bg-green-500/10 text-green-400' : 'text-gray-400'}`}>
                      <span className="w-6 text-right text-gray-600 mr-2 select-none inline-block">{line.rightLine ?? ''}</span>
                      <span className="whitespace-pre-wrap break-all">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
    </div>
  )
}
