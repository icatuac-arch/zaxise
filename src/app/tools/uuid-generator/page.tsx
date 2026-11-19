'use client'

import { useState, useEffect, useCallback } from 'react'


import { Copy, Check, Fingerprint, RefreshCw, Clipboard } from 'lucide-react'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback using getRandomValues
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant 1
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

type FormatOption = 'standard' | 'no-hyphens' | 'uppercase' | 'lowercase'

function formatUUID(uuid: string, format: FormatOption): string {
  switch (format) {
    case 'no-hyphens':
      return uuid.replace(/-/g, '')
    case 'uppercase':
      return uuid.toUpperCase()
    case 'lowercase':
      return uuid.toLowerCase()
    default:
      return uuid
  }
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [format, setFormat] = useState<FormatOption>('standard')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [validateInput, setValidateInput] = useState('')

  const validateUUID = (s: string): { valid: boolean; version: string } => {
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const uuidV1 = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const uuidGeneric = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const noHyphens = /^[0-9a-f]{32}$/i
    if (uuidV4.test(s)) return { valid: true, version: 'v4 (Random)' }
    if (uuidV1.test(s)) return { valid: true, version: 'v1 (Timestamp)' }
    if (uuidGeneric.test(s)) return { valid: true, version: 'Valid UUID' }
    if (noHyphens.test(s)) return { valid: true, version: 'Valid (no hyphens)' }
    return { valid: false, version: 'Invalid UUID' }
  }

  const validationResult = validateInput.trim() ? validateUUID(validateInput.trim()) : null

  const generate = useCallback(() => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID())
    }
    setUuids(newUuids)
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [count])

  useEffect(() => {
    generate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formattedUuids = uuids.map(u => formatUUID(u, format))

  const copyOne = async (index: number) => {
    await navigator.clipboard.writeText(formattedUuids[index])
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(formattedUuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              UUID Generator
            </h1>
          </div>
          <p className="text-gray-400">Generate random UUID v4 identifiers</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">550e8400-e29b-41d4-a716-446655440000</div>
            <div className="w-8 h-8 rounded-full bg-green-500/10 border-2 border-green-500/60 flex items-center justify-center text-green-400 text-lg">&#x21bb;</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Set options</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Generate UUIDs</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Uses crypto.randomUUID for true randomness.</p>
        </div>

        {/* Controls */}
        <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Count */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                <span>Count</span>
                <span className="text-[#E8970A]">{count}</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-[#E8970A]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as FormatOption)}
                className="w-full bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#E8970A]"
              >
                <option value="standard">Standard (with hyphens)</option>
                <option value="no-hyphens">No hyphens</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={generate}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#E8970A] text-black hover:bg-[#E8970A]/90 transition-colors"
              >
                <RefreshCw size={16} />
                Generate
              </button>
              <button
                onClick={copyAll}
                disabled={uuids.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-[#0F0D1A] text-gray-300 border border-[#1A1726] hover:border-[#E8970A] transition-colors disabled:opacity-40"
              >
                {copiedAll ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} />}
                {copiedAll ? 'Copied All!' : 'Copy All'}
              </button>
            </div>
          </div>
        </div>

        {/* UUID Validator */}
        <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Validate UUID</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={validateInput}
              onChange={e => setValidateInput(e.target.value)}
              placeholder="Paste a UUID to validate..."
              className="flex-1 bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:border-[#E8970A]"
            />
            {validationResult && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${validationResult.valid ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                {validationResult.valid ? <Check size={16} /> : <span>&#10005;</span>}
                {validationResult.version}
              </div>
            )}
          </div>
        </div>

        {/* UUID list */}
        <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              Generated UUIDs ({formattedUuids.length})
            </span>
          </div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {formattedUuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#070510] group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-6 text-right">{i + 1}</span>
                  <span className="font-mono text-sm text-white select-all">{uuid}</span>
                </div>
                <button
                  onClick={() => copyOne(i)}
                  className="p-1.5 rounded text-gray-600 hover:text-[#E8970A] opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy"
                >
                  {copiedIndex === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      
    </div>
  )
}
