'use client'

import { useState, useMemo } from 'react'


import { GitCompareArrows, Trash2, ArrowLeftRight } from 'lucide-react'

interface DiffSegment {
  type: 'equal' | 'add' | 'remove'
  text: string
}

function lcs(a: string, b: string): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp
}

function computeDiff(a: string, b: string): DiffSegment[] {
  // For very long texts, chunk by lines first
  if (a.length > 5000 || b.length > 5000) {
    return computeLineDiff(a, b)
  }

  const dp = lcs(a, b)
  const segments: DiffSegment[] = []
  let i = a.length
  let j = b.length

  const raw: Array<{ type: 'equal' | 'add' | 'remove'; char: string }> = []

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      raw.push({ type: 'equal', char: a[i - 1] })
      i--
      j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      raw.push({ type: 'remove', char: a[i - 1] })
      i--
    } else {
      raw.push({ type: 'add', char: b[j - 1] })
      j--
    }
  }
  while (i > 0) {
    raw.push({ type: 'remove', char: a[i - 1] })
    i--
  }
  while (j > 0) {
    raw.push({ type: 'add', char: b[j - 1] })
    j--
  }

  raw.reverse()

  // Merge consecutive segments of the same type
  for (const r of raw) {
    if (segments.length > 0 && segments[segments.length - 1].type === r.type) {
      segments[segments.length - 1].text += r.char
    } else {
      segments.push({ type: r.type, text: r.char })
    }
  }

  return segments
}

function computeLineDiff(a: string, b: string): DiffSegment[] {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  const m = aLines.length
  const n = bLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  const segments: DiffSegment[] = []
  let i = m, j = n
  const raw: Array<{ type: 'equal' | 'add' | 'remove'; text: string }> = []
  while (i > 0 && j > 0) {
    if (aLines[i - 1] === bLines[j - 1]) {
      raw.push({ type: 'equal', text: aLines[i - 1] })
      i--; j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      raw.push({ type: 'remove', text: aLines[i - 1] })
      i--
    } else {
      raw.push({ type: 'add', text: bLines[j - 1] })
      j--
    }
  }
  while (i > 0) { raw.push({ type: 'remove', text: aLines[i - 1] }); i-- }
  while (j > 0) { raw.push({ type: 'add', text: bLines[j - 1] }); j-- }
  raw.reverse()
  for (const r of raw) {
    const line = r.text + '\n'
    if (segments.length > 0 && segments[segments.length - 1].type === r.type) {
      segments[segments.length - 1].text += line
    } else {
      segments.push({ type: r.type, text: line })
    }
  }
  return segments
}

export default function TextDiffPage() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diffLevel, setDiffLevel] = useState<'char' | 'line'>('char')

  const diff = useMemo(() => {
    if (diffLevel === 'line') return computeLineDiff(textA, textB)
    return computeDiff(textA, textB)
  }, [textA, textB, diffLevel])

  const swap = () => { const t = textA; setTextA(textB); setTextB(t) }

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0
    for (const seg of diff) {
      if (seg.type === 'add') added += seg.text.length
      else if (seg.type === 'remove') removed += seg.text.length
      else unchanged += seg.text.length
    }
    return { added, removed, unchanged }
  }, [diff])

  const hasDiff = textA || textB

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <GitCompareArrows size={28} /> Text Diff
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Compare two texts and see character-level differences.</p>
          </div>
          <div className="flex items-center gap-2">
            {hasDiff && (
              <button onClick={swap} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
                <ArrowLeftRight size={14} /> Swap
              </button>
            )}
            {hasDiff && (
              <button onClick={() => { setTextA(''); setTextB('') }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1 rounded border border-[#E8970A]/40 bg-[#E8970A]/10 text-[#E8970A] text-xs font-mono">The <span className="bg-red-500/30 text-red-400 px-0.5 rounded">cat</span> sat</div>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1 rounded border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-mono">The <span className="bg-green-500/30 px-0.5 rounded">dog</span> sat</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste text A</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Paste text B</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>See character differences</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Character-level diff, not just line-level.</p>
        </div>

        {/* Diff level toggle */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-500">Diff level:</span>
          <div className="flex bg-[#070510] rounded-lg p-0.5 border border-[#1A1726]">
            <button onClick={() => setDiffLevel('char')} className={`px-3 py-1 rounded text-xs ${diffLevel === 'char' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Character</button>
            <button onClick={() => setDiffLevel('line')} className={`px-3 py-1 rounded text-xs ${diffLevel === 'line' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Line</button>
          </div>
        </div>

        {/* Side by side inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Original Text</label>
            <textarea
              value={textA}
              onChange={e => setTextA(e.target.value)}
              placeholder="Paste original text..."
              className="w-full h-48 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Modified Text</label>
            <textarea
              value={textB}
              onChange={e => setTextB(e.target.value)}
              placeholder="Paste modified text..."
              className="w-full h-48 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none"
            />
          </div>
        </div>

        {/* Stats */}
        {hasDiff && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2 text-center">
              <div className="text-green-400 font-semibold text-lg">+{stats.added}</div>
              <div className="text-xs text-gray-400">Added</div>
            </div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2 text-center">
              <div className="text-red-400 font-semibold text-lg">-{stats.removed}</div>
              <div className="text-xs text-gray-400">Removed</div>
            </div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2 text-center">
              <div className="text-gray-300 font-semibold text-lg">{stats.unchanged}</div>
              <div className="text-xs text-gray-400">Unchanged</div>
            </div>
          </div>
        )}

        {/* Diff output */}
        {hasDiff && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Inline Diff</label>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 min-h-[120px] whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {diff.map((seg, i) => (
                <span
                  key={i}
                  className={
                    seg.type === 'add'
                      ? 'bg-green-500/20 text-green-300'
                      : seg.type === 'remove'
                      ? 'bg-red-500/20 text-red-300 line-through'
                      : 'text-gray-300'
                  }
                >
                  {seg.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
