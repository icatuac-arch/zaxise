'use client'

import { useState, useMemo, useCallback } from 'react'


import { Search, Copy, Check, Trash2, Replace } from 'lucide-react'

export default function FindReplacePage() {
  const [text, setText] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const buildRegex = useCallback((): RegExp | null => {
    if (!find) return null
    try {
      let pattern = find
      if (!useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      }
      if (wholeWord) {
        pattern = `\\b${pattern}\\b`
      }
      const flags = caseSensitive ? 'g' : 'gi'
      return new RegExp(pattern, flags)
    } catch {
      return null
    }
  }, [find, caseSensitive, wholeWord, useRegex])

  const matches = useMemo(() => {
    const regex = buildRegex()
    if (!regex || !text) return []
    const found: { start: number; end: number }[] = []
    let match
    while ((match = regex.exec(text)) !== null) {
      found.push({ start: match.index, end: match.index + match[0].length })
      if (match[0].length === 0) regex.lastIndex++ // prevent infinite loop on zero-length match
    }
    return found
  }, [text, buildRegex])

  const matchCount = matches.length

  const replaceOne = () => {
    const regex = buildRegex()
    if (!regex || !text) return
    // Replace only the first match
    const onceRegex = new RegExp(regex.source, regex.flags.replace('g', ''))
    setResult(text.replace(onceRegex, replace))
  }

  const replaceAll = () => {
    const regex = buildRegex()
    if (!regex || !text) return
    setResult(text.replace(regex, replace))
  }

  const handleCopy = async () => {
    const output = result || text
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Highlighted text
  const highlightedParts = useMemo(() => {
    if (!find || matches.length === 0) return [{ text, highlight: false }]
    const parts: { text: string; highlight: boolean }[] = []
    let lastEnd = 0
    for (const m of matches) {
      if (m.start > lastEnd) {
        parts.push({ text: text.slice(lastEnd, m.start), highlight: false })
      }
      parts.push({ text: text.slice(m.start, m.end), highlight: true })
      lastEnd = m.end
    }
    if (lastEnd < text.length) {
      parts.push({ text: text.slice(lastEnd), highlight: false })
    }
    return parts
  }, [text, find, matches])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Search size={28} /> Find & Replace
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Find and replace text with regex support.</p>
          </div>
          {text && (
            <button onClick={() => { setText(''); setResult(''); setFind(''); setReplace('') }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-3 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-sm font-mono">
              <span className="text-gray-400">The </span><span className="bg-red-500/30 text-red-400 px-0.5 rounded">cat</span><span className="text-gray-400"> sat on the mat</span>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-3 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-sm font-mono">
              <span className="text-gray-400">The </span><span className="bg-green-500/30 text-green-400 px-0.5 rounded">dog</span><span className="text-gray-400"> sat on the mat</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Enter find/replace</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Apply changes</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Supports regex and case-sensitive search.</p>
        </div>

        {/* Source text */}
        <label className="block text-sm text-gray-400 mb-1">Source Text</label>
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setResult('') }}
            placeholder="Paste your text here..."
            className="w-full h-40 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none"
          />
        </div>

        {/* Highlighted preview */}
        {find && text && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Preview ({matchCount} match{matchCount !== 1 ? 'es' : ''})</label>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 min-h-[60px] max-h-48 overflow-auto whitespace-pre-wrap break-words text-sm font-mono">
              {highlightedParts.map((part, i) => (
                <span key={i} className={part.highlight ? 'bg-[#E8970A]/30 text-[#E8970A] rounded px-0.5' : 'text-gray-300'}>
                  {part.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Find/Replace fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Find</label>
            <input
              value={find}
              onChange={e => setFind(e.target.value)}
              placeholder="Search term..."
              className="w-full bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Replace with</label>
            <input
              value={replace}
              onChange={e => setReplace(e.target.value)}
              placeholder="Replacement..."
              className="w-full bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
            />
          </div>
        </div>

        {/* Options + actions */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Case sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={wholeWord} onChange={e => setWholeWord(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Whole word</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Use regex</span>
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-[#E8970A] font-mono">{matchCount}</span> match{matchCount !== 1 ? 'es' : ''}
          </div>
          <div className="flex-1" />
          <button
            onClick={replaceOne}
            disabled={!find || !text}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-[#1A1726] text-gray-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Replace size={14} /> Replace First
          </button>
          <button
            onClick={replaceAll}
            disabled={!find || !text}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#E8970A] text-black hover:bg-[#E8970A]/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Replace size={14} /> Replace All
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Result</label>
            <textarea
              readOnly
              value={result}
              className="w-full h-40 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white resize-none"
            />
            <button onClick={handleCopy} className="absolute top-8 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </main>
      
    </div>
  )
}
