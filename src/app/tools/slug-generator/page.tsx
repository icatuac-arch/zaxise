'use client'

import { useState, useMemo } from 'react'


import { Link2, Copy, Check, Trash2 } from 'lucide-react'

const TRANSLITERATE_MAP: Record<string, string> = {
  '\u00e0': 'a', '\u00e1': 'a', '\u00e2': 'a', '\u00e3': 'a', '\u00e4': 'a', '\u00e5': 'a',
  '\u00e8': 'e', '\u00e9': 'e', '\u00ea': 'e', '\u00eb': 'e',
  '\u00ec': 'i', '\u00ed': 'i', '\u00ee': 'i', '\u00ef': 'i',
  '\u00f2': 'o', '\u00f3': 'o', '\u00f4': 'o', '\u00f5': 'o', '\u00f6': 'o',
  '\u00f9': 'u', '\u00fa': 'u', '\u00fb': 'u', '\u00fc': 'u',
  '\u00f1': 'n', '\u00e7': 'c', '\u00df': 'ss', '\u00f8': 'o', '\u00e6': 'ae',
  '\u00c0': 'A', '\u00c1': 'A', '\u00c2': 'A', '\u00c3': 'A', '\u00c4': 'A', '\u00c5': 'A',
  '\u00c8': 'E', '\u00c9': 'E', '\u00ca': 'E', '\u00cb': 'E',
  '\u00cc': 'I', '\u00cd': 'I', '\u00ce': 'I', '\u00cf': 'I',
  '\u00d2': 'O', '\u00d3': 'O', '\u00d4': 'O', '\u00d5': 'O', '\u00d6': 'O',
  '\u00d9': 'U', '\u00da': 'U', '\u00db': 'U', '\u00dc': 'U',
  '\u00d1': 'N', '\u00c7': 'C', '\u00d8': 'O', '\u00c6': 'AE',
}

function transliterate(s: string): string {
  return s.split('').map(c => TRANSLITERATE_MAP[c] || c).join('')
}

function generateSlug(input: string, separator: string, lower: boolean, maxLen: number, doTransliterate: boolean): string {
  let s = input.trim()
  if (doTransliterate) s = transliterate(s)
  if (lower) s = s.toLowerCase()
  // Replace non-alphanumeric chars with separator
  s = s.replace(/[^a-zA-Z0-9]+/g, separator)
  // Remove leading/trailing separator
  s = s.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '')
  // Collapse multiple separators
  s = s.replace(new RegExp(`\\${separator}{2,}`, 'g'), separator)
  if (maxLen > 0 && s.length > maxLen) {
    s = s.substring(0, maxLen)
    // Don't end with separator
    s = s.replace(new RegExp(`\\${separator}+$`), '')
  }
  return s
}

export default function SlugGeneratorPage() {
  const [input, setInput] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [separator, setSeparator] = useState('-')
  const [lowercase, setLowercase] = useState(true)
  const [maxLength, setMaxLength] = useState(0)
  const [doTransliterate, setDoTransliterate] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return ''
    if (bulkMode) {
      return input.split('\n').filter(l => l.trim()).map(l => generateSlug(l, separator, lowercase, maxLength, doTransliterate)).join('\n')
    }
    return generateSlug(input, separator, lowercase, maxLength, doTransliterate)
  }, [input, separator, lowercase, maxLength, doTransliterate, bulkMode])

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Link2 size={28} /> Slug Generator
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Generate URL-friendly slugs from any text.</p>
          </div>
          {input && (
            <button onClick={() => setInput('')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">My Blog Post Title!</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-sm font-mono font-bold">my-blog-post-title</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Type text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Choose separator</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy slug</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Handles accented characters and special symbols.</p>
        </div>

        {/* Options */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-center text-sm">
          <label className="flex items-center gap-2">
            <span className="text-gray-400">Separator:</span>
            <select value={separator} onChange={e => setSeparator(e.target.value)} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white">
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Lowercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={doTransliterate} onChange={e => setDoTransliterate(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Transliterate accents</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-gray-400">Max length:</span>
            <input type="number" min={0} max={500} value={maxLength} onChange={e => setMaxLength(parseInt(e.target.value) || 0)} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white w-20" placeholder="0 = no limit" />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={bulkMode} onChange={e => setBulkMode(e.target.checked)} className="accent-[#E8970A]" />
            <span className="text-gray-400">Bulk mode</span>
          </label>
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={bulkMode ? 'Paste multiple lines, one per slug...' : 'Type or paste your text here...'}
          className="w-full h-32 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none mb-4"
        />

        {/* Output */}
        {result && (
          <div className="text-xs text-gray-500 mb-1">{result.length} characters</div>
        )}
        <div className="relative">
          <textarea
            readOnly
            value={result}
            className="w-full h-32 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white font-mono resize-none"
            placeholder="Slug will appear here..."
          />
          {result && (
            <button onClick={handleCopy} className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </main>
      
    </div>
  )
}
