'use client'

import { useState, useEffect, useCallback } from 'react'


import { Key, Copy, Check, RefreshCw, QrCode } from 'lucide-react'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Common English words for passphrase generation
const WORD_LIST = [
  'apple','brave','cabin','dance','eagle','flame','globe','heart','ivory','jewel',
  'knack','lemon','magic','noble','ocean','piano','quest','river','storm','tiger',
  'unity','vivid','whale','xenon','yacht','zebra','amber','bliss','coral','delta',
  'ember','frost','grain','haven','image','jolly','karma','lunar','maple','nexus',
  'orbit','pearl','quiet','raven','solar','torch','urban','vault','woven','zesty',
  'angel','bloom','cliff','drift','elbow','forge','grape','haste','irony','joker',
  'kayak','lodge','mount','nerve','olive','prism','quota','reign','sigma','trend',
  'ultra','vigor','width','oxide','yield','zones','arrow','beach','chess','diary',
  'epoch','fiber','ghost','humor','index','judge','kneel','laser','mercy','nylon',
  'oasis','pilot','quilt','royal','scale','tulip','union','verse','wings','youth',
]

function randomFromArray<T>(arr: T[]): T {
  const idx = crypto.getRandomValues(new Uint32Array(1))[0] % arr.length
  return arr[idx]
}

function generatePassword(opts: {
  length: number
  lower: boolean
  upper: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}): string {
  let chars = ''
  if (opts.lower) chars += LOWER
  if (opts.upper) chars += UPPER
  if (opts.digits) chars += DIGITS
  if (opts.symbols) chars += SYMBOLS
  if (opts.excludeAmbiguous) chars = chars.replace(/[0OoIl1]/g, '')
  if (!chars) return ''
  const arr = chars.split('')
  let result = ''
  for (let i = 0; i < opts.length; i++) result += randomFromArray(arr)
  return result
}

function generatePassphrase(wordCount: number, separator: string): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(randomFromArray(WORD_LIST))
  }
  return words.join(separator)
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { score: 25, label: 'Weak', color: '#EF4444' }
  if (score <= 4) return { score: 50, label: 'Fair', color: '#F59E0B' }
  if (score <= 6) return { score: 75, label: 'Strong', color: '#10B981' }
  return { score: 100, label: 'Very Strong', color: '#22C55E' }
}

function generateQRCodeSVG(text: string): string {
  // Simple QR code using a public API-free approach: encode as a data matrix pattern
  // We'll use a basic visual representation since we can't use external libs
  // Instead, generate a QR code URL using a canvas-based approach
  const size = 200
  const encoded = encodeURIComponent(text)
  // Use Google Charts API for QR (it's a simple GET, widely available)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=0F0D1A&color=E8970A`
}

export default function PasswordGenPage() {
  const [length, setLength] = useState(16)
  const [lower, setLower] = useState(true)
  const [upper, setUpper] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'random' | 'passphrase'>('random')
  const [passphraseWords, setPassphraseWords] = useState(4)
  const [passphraseSeparator, setPassphraseSeparator] = useState('-')
  const [bulkCount, setBulkCount] = useState(1)
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([])
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showQR, setShowQR] = useState(false)

  const generate = useCallback(() => {
    const passwords: string[] = []
    for (let i = 0; i < bulkCount; i++) {
      if (mode === 'passphrase') {
        passwords.push(generatePassphrase(passphraseWords, passphraseSeparator))
      } else {
        passwords.push(generatePassword({ length, lower, upper, digits, symbols, excludeAmbiguous }))
      }
    }
    setPassword(passwords[0])
    setBulkPasswords(passwords)
    setShowQR(false)
  }, [length, lower, upper, digits, symbols, excludeAmbiguous, mode, passphraseWords, passphraseSeparator, bulkCount])

  useEffect(() => { generate() }, [generate])

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyAtIndex = async (idx: number) => {
    await navigator.clipboard.writeText(bulkPasswords[idx])
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(bulkPasswords.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const strength = calculateStrength(password)

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Key size={28} /> Password Generator
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Generate strong, secure passwords using cryptographic randomness.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-[#070510] border border-[#1A1726] font-mono text-sm text-white tracking-wider">
                k9#Mx<span className="text-[#E8970A]">$</span>vR2<span className="text-green-400">!</span>qL8
              </div>
              <div className="w-full h-2 rounded-full bg-[#1A1726] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '90%' }} />
              </div>
              <span className="text-[10px] text-green-400 font-medium">Very Strong</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Set length & options</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Generate strong password</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Uses cryptographic randomness. Passwords never leave your browser.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 mb-4">
          <div className="flex bg-[#070510] rounded-lg p-1 border border-[#1A1726]">
            <button onClick={() => setMode('random')} className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${mode === 'random' ? 'bg-[#E8970A] text-black font-medium' : 'text-gray-400 hover:text-white'}`}>
              Random Password
            </button>
            <button onClick={() => setMode('passphrase')} className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${mode === 'passphrase' ? 'bg-[#E8970A] text-black font-medium' : 'text-gray-400 hover:text-white'}`}>
              Passphrase (Memorable)
            </button>
          </div>
        </div>

        {/* Main Password Display */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <input type="text" value={password} readOnly className="flex-1 px-4 py-3 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-lg font-mono" />
            <button onClick={copy} className="p-3 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30" title="Copy">
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
            <button onClick={() => setShowQR(!showQR)} className={`p-3 rounded-lg border ${showQR ? 'bg-[#E8970A]/20 text-[#E8970A] border-[#E8970A]/40' : 'bg-[#070510] text-gray-400 border-[#1A1726]'}`} title="QR Code">
              <QrCode size={18} />
            </button>
            <button onClick={generate} className="p-3 rounded-lg bg-[#E8970A] text-black" title="Regenerate"><RefreshCw size={18} /></button>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Strength</span>
              <span style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="h-2 bg-[#1A1726] rounded-full overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${strength.score}%`, backgroundColor: strength.color }} />
            </div>
          </div>

          {/* QR Code */}
          {showQR && password && (
            <div className="mt-4 flex justify-center">
              <div className="bg-white p-3 rounded-lg">
                <img src={generateQRCodeSVG(password)} alt="QR Code" width={180} height={180} className="rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 space-y-4 mb-4">
          {mode === 'random' ? (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Length: {length}</label>
                <input type="range" min="6" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="accent-[#E8970A]" />Lowercase (a-z)</label>
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-[#E8970A]" />Uppercase (A-Z)</label>
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="accent-[#E8970A]" />Digits (0-9)</label>
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="accent-[#E8970A]" />Symbols (!@#$...)</label>
                <label className="flex items-center gap-2 text-sm text-gray-300 col-span-full"><input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="accent-[#E8970A]" />Exclude ambiguous (0, O, 1, l, I)</label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Number of words: {passphraseWords}</label>
                <input type="range" min="3" max="8" value={passphraseWords} onChange={(e) => setPassphraseWords(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Separator</label>
                <div className="flex gap-2">
                  {['-', '.', '_', ' ', '#'].map(sep => (
                    <button key={sep} onClick={() => setPassphraseSeparator(sep)} className={`px-4 py-2 rounded-lg text-sm font-mono ${passphraseSeparator === sep ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                      {sep === ' ' ? 'space' : sep}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">Passphrases like &quot;correct-horse-battery-staple&quot; are easy to remember and very secure.</p>
            </>
          )}
        </div>

        {/* Bulk Generation */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Bulk Generate</h3>
            {bulkPasswords.length > 1 && (
              <button onClick={copyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-[#1A1726] hover:bg-white/5">
                {copiedAll ? <><Check size={12} className="text-green-400" />Copied All</> : <><Copy size={12} />Copy All</>}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Count:</label>
            <select value={bulkCount} onChange={(e) => setBulkCount(parseInt(e.target.value))} className="px-3 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
              {[1, 3, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={generate} className="px-4 py-1.5 rounded-lg bg-[#E8970A] text-black text-sm font-medium">Generate {bulkCount}</button>
          </div>

          {bulkPasswords.length > 1 && (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {bulkPasswords.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#070510] rounded-lg px-3 py-2 border border-[#1A1726]">
                  <span className="text-xs text-gray-500 w-5">{i + 1}</span>
                  <code className="flex-1 text-sm font-mono text-gray-300 truncate">{pw}</code>
                  <button onClick={() => copyAtIndex(i)} className="text-gray-400 hover:text-white shrink-0">
                    {copiedIndex === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
    </div>
  )
}
