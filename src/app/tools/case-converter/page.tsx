'use client'

import { useState, useMemo } from 'react'


import { CaseSensitive, Copy, Trash2, Check } from 'lucide-react'

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'dot' | 'alternate' | 'inverse'

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

function toSentenceCase(s: string): string {
  return s.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase())
    .replace(/^[a-z]/, c => c.toUpperCase())
}

function splitWords(s: string): string[] {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function toCamelCase(s: string): string {
  const words = splitWords(s)
  if (words.length === 0) return ''
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
}

function toPascalCase(s: string): string {
  return splitWords(s).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
}

function toSnakeCase(s: string): string {
  return splitWords(s).map(w => w.toLowerCase()).join('_')
}

function toKebabCase(s: string): string {
  return splitWords(s).map(w => w.toLowerCase()).join('-')
}

function toConstantCase(s: string): string {
  return splitWords(s).map(w => w.toUpperCase()).join('_')
}

function toDotCase(s: string): string {
  return splitWords(s).map(w => w.toLowerCase()).join('.')
}

function toAlternateCase(s: string): string {
  return s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
}

function toInverseCase(s: string): string {
  return s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
}

function convert(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'upper': return text.toUpperCase()
    case 'lower': return text.toLowerCase()
    case 'title': return toTitleCase(text)
    case 'sentence': return toSentenceCase(text)
    case 'camel': return toCamelCase(text)
    case 'pascal': return toPascalCase(text)
    case 'snake': return toSnakeCase(text)
    case 'kebab': return toKebabCase(text)
    case 'constant': return toConstantCase(text)
    case 'dot': return toDotCase(text)
    case 'alternate': return toAlternateCase(text)
    case 'inverse': return toInverseCase(text)
  }
}

const CASES: { label: string; value: CaseType }[] = [
  { label: 'UPPERCASE', value: 'upper' },
  { label: 'lowercase', value: 'lower' },
  { label: 'Title Case', value: 'title' },
  { label: 'Sentence case', value: 'sentence' },
  { label: 'camelCase', value: 'camel' },
  { label: 'PascalCase', value: 'pascal' },
  { label: 'snake_case', value: 'snake' },
  { label: 'kebab-case', value: 'kebab' },
  { label: 'CONSTANT_CASE', value: 'constant' },
  { label: 'dot.case', value: 'dot' },
  { label: 'aLtErNaTe', value: 'alternate' },
  { label: 'iNVERSE', value: 'inverse' },
]

export default function CaseConverterPage() {
  const [text, setText] = useState('')
  const [selectedCase, setSelectedCase] = useState<CaseType>('upper')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => (text ? convert(text, selectedCase) : ''), [text, selectedCase])

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

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
              <CaseSensitive size={28} /> Case Converter
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Convert text between different cases instantly.</p>
          </div>
          {text && (
            <button onClick={() => setText('')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">hello world</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col gap-1">
              <span className="text-green-400 text-xs font-mono font-bold">HELLO WORLD</span>
              <span className="text-green-400 text-xs font-mono font-bold">Hello World</span>
              <span className="text-green-400 text-xs font-mono font-bold">helloWorld</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Choose case</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy result</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Supports 10 case types including camelCase and snake_case.</p>
        </div>

        {/* Input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-40 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none mb-4"
        />

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-sm text-gray-400">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
        </div>

        {/* Case buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CASES.map(c => (
            <button
              key={c.value}
              onClick={() => setSelectedCase(c.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedCase === c.value
                  ? 'bg-[#E8970A] text-black border-[#E8970A]'
                  : 'border-[#1A1726] text-gray-300 hover:bg-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="relative">
          <textarea
            readOnly
            value={result}
            className="w-full h-40 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white resize-none"
            placeholder="Result will appear here..."
          />
          {result && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </main>
      
    </div>
  )
}
