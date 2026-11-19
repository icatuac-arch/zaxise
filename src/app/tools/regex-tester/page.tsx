'use client'

import { useState, useMemo, useCallback } from 'react'


import { Copy, Check, Regex, AlertCircle, Hash, List, Replace } from 'lucide-react'

const MATCH_COLORS = [
  'bg-[#E8970A]/30 text-[#E8970A]',
  'bg-blue-500/30 text-blue-400',
  'bg-green-500/30 text-green-400',
  'bg-purple-500/30 text-purple-400',
  'bg-pink-500/30 text-pink-400',
  'bg-cyan-500/30 text-cyan-400',
]

const COMMON_PATTERNS = [
  { name: 'Select a common pattern...', pattern: '', flags: '' },
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { name: 'Phone Number (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g' },
  { name: 'URL', pattern: 'https?://[\\w\\-.]+(:\\d+)?(/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]*)?', flags: 'gi' },
  { name: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', flags: 'g' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { name: 'Date (MM/DD/YYYY)', pattern: '(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])/\\d{4}', flags: 'g' },
  { name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi' },
  { name: 'HTML Tag', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)</\\1>', flags: 'gs' },
  { name: 'Integer', pattern: '-?\\d+', flags: 'g' },
  { name: 'Floating Point', pattern: '-?\\d+\\.\\d+', flags: 'g' },
  { name: 'Whitespace Lines', pattern: '^\\s*$', flags: 'gm' },
  { name: 'Username (3-16 chars)', pattern: '^[a-zA-Z0-9_-]{3,16}$', flags: 'g' },
  { name: 'Strong Password', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}', flags: 'g' },
  { name: 'CSS Class', pattern: '\\.[a-zA-Z_][a-zA-Z0-9_-]*', flags: 'g' },
  { name: 'JSON Key', pattern: '"([^"]+)"\\s*:', flags: 'g' },
]

// Regex explainer
function explainRegex(pattern: string): string[] {
  const explanations: string[] = []
  const tokens: [RegExp, string][] = [
    [/^\^/, 'Start of string/line'],
    [/^\$/, 'End of string/line'],
    [/^\\d/, 'Any digit (0-9)'],
    [/^\\D/, 'Any non-digit'],
    [/^\\w/, 'Any word character (a-z, A-Z, 0-9, _)'],
    [/^\\W/, 'Any non-word character'],
    [/^\\s/, 'Any whitespace'],
    [/^\\S/, 'Any non-whitespace'],
    [/^\\b/, 'Word boundary'],
    [/^\\B/, 'Non-word boundary'],
    [/^\./, 'Any character (except newline)'],
    [/^\*/, 'Zero or more of previous'],
    [/^\+/, 'One or more of previous'],
    [/^\?/, 'Zero or one of previous (optional)'],
    [/^\{(\d+)\}/, 'Exactly N of previous'],
    [/^\{(\d+),\}/, 'N or more of previous'],
    [/^\{(\d+),(\d+)\}/, 'Between N and M of previous'],
    [/^\|/, 'OR (alternation)'],
    [/^\(/, 'Start of group'],
    [/^\)/, 'End of group'],
    [/^\(\?:/, 'Non-capturing group'],
    [/^\(\?=/, 'Positive lookahead'],
    [/^\(\?!/, 'Negative lookahead'],
    [/^\(\?<=/, 'Positive lookbehind'],
    [/^\(\?<!/, 'Negative lookbehind'],
    [/^\[/, 'Start of character class'],
    [/^\]/, 'End of character class'],
    [/^\[\^/, 'Negated character class'],
  ]

  let remaining = pattern
  while (remaining.length > 0) {
    let matched = false
    for (const [regex, desc] of tokens) {
      const m = remaining.match(regex)
      if (m) {
        explanations.push(`${m[0]} - ${desc}`)
        remaining = remaining.slice(m[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      const ch = remaining[0]
      if (ch === '\\' && remaining.length > 1) {
        explanations.push(`${remaining.slice(0, 2)} - Escaped character "${remaining[1]}"`)
        remaining = remaining.slice(2)
      } else {
        explanations.push(`${ch} - Literal "${ch}"`)
        remaining = remaining.slice(1)
      }
    }
  }
  return explanations
}

interface MatchInfo {
  match: string
  index: number
  groups: string[]
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flagG, setFlagG] = useState(true)
  const [flagI, setFlagI] = useState(false)
  const [flagM, setFlagM] = useState(false)
  const [flagS, setFlagS] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [replaceText, setReplaceText] = useState('')
  const [showExplain, setShowExplain] = useState(false)

  const flags = useMemo(() => {
    let f = ''
    if (flagG) f += 'g'
    if (flagI) f += 'i'
    if (flagM) f += 'm'
    if (flagS) f += 's'
    return f
  }, [flagG, flagI, flagM, flagS])

  const { regex, error, matches, highlightedHtml } = useMemo(() => {
    if (!pattern) return { regex: null, error: '', matches: [] as MatchInfo[], highlightedHtml: '' }

    let re: RegExp
    try {
      re = new RegExp(pattern, flags)
    } catch (err: any) {
      return { regex: null, error: err.message, matches: [] as MatchInfo[], highlightedHtml: '' }
    }

    const matchList: MatchInfo[] = []
    if (testString) {
      if (flags.includes('g')) {
        let m: RegExpExecArray | null
        const seen = new Set<number>()
        while ((m = re.exec(testString)) !== null) {
          if (seen.has(m.index)) break
          seen.add(m.index)
          matchList.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
          if (m[0].length === 0) re.lastIndex++
        }
      } else {
        const m = re.exec(testString)
        if (m) {
          matchList.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
        }
      }

      // Build highlighted HTML with different colors per match
      let html = ''
      let lastIndex = 0
      const escapeHtml = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')

      for (let idx = 0; idx < matchList.length; idx++) {
        const match = matchList[idx]
        const colorClass = MATCH_COLORS[idx % MATCH_COLORS.length]
        html += escapeHtml(testString.slice(lastIndex, match.index))
        html += `<mark class="${colorClass} rounded px-0.5">${escapeHtml(match.match)}</mark>`
        lastIndex = match.index + match.match.length
      }
      html += escapeHtml(testString.slice(lastIndex))

      return { regex: re, error: '', matches: matchList, highlightedHtml: html }
    }

    return { regex: re, error: '', matches: matchList, highlightedHtml: '' }
  }, [pattern, testString, flags])

  // Replace preview
  const replacePreview = useMemo(() => {
    if (!showReplace || !pattern || !testString || error) return ''
    try {
      const re = new RegExp(pattern, flags)
      return testString.replace(re, replaceText)
    } catch { return '' }
  }, [showReplace, pattern, testString, flags, replaceText, error])

  // Explain regex
  const explanation = useMemo(() => {
    if (!showExplain || !pattern) return []
    return explainRegex(pattern)
  }, [showExplain, pattern])

  const applyPreset = useCallback((idx: number) => {
    const preset = COMMON_PATTERNS[idx]
    if (!preset || idx === 0) return
    setPattern(preset.pattern)
    setFlagG(preset.flags.includes('g'))
    setFlagI(preset.flags.includes('i'))
    setFlagM(preset.flags.includes('m'))
    setFlagS(preset.flags.includes('s'))
  }, [])

  const copyPattern = async () => {
    const full = `/${pattern}/${flags}`
    await navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <Regex className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Regex Tester
            </h1>
          </div>
          <p className="text-gray-400">Test and debug regular expressions with live highlighting</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-3 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">/\d+/g</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-3 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-sm font-mono">
              <span className="text-gray-400">abc </span><span className="bg-green-500/30 text-green-400 px-0.5 rounded">123</span><span className="text-gray-400"> def </span><span className="bg-green-500/30 text-green-400 px-0.5 rounded">456</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Enter pattern</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Paste test text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>See matches highlighted</span>
          </div>
          <p className="text-center text-xs text-gray-500">Now with replace mode, regex explainer, and color-coded groups.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - inputs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pattern input */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Regular Expression</label>
                <select
                  className="bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E8970A]"
                  onChange={(e) => applyPreset(parseInt(e.target.value))}
                  defaultValue={0}
                >
                  {COMMON_PATTERNS.map((p, i) => (
                    <option key={i} value={i}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#E8970A] text-lg font-mono">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#E8970A]"
                />
                <span className="text-[#E8970A] text-lg font-mono">/</span>
                <span className="text-gray-400 font-mono text-sm">{flags}</span>
                <button
                  onClick={copyPattern}
                  disabled={!pattern}
                  className="p-2 rounded-lg border border-[#1A1726] text-gray-400 hover:text-white hover:border-[#E8970A] transition-colors disabled:opacity-40"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Flags + extra toggles */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="text-xs text-gray-500">Flags:</span>
                {[
                  { key: 'g', label: 'Global', state: flagG, set: setFlagG },
                  { key: 'i', label: 'Case Insensitive', state: flagI, set: setFlagI },
                  { key: 'm', label: 'Multiline', state: flagM, set: setFlagM },
                  { key: 's', label: 'Dotall', state: flagS, set: setFlagS },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => f.set(!f.state)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      f.state
                        ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40'
                        : 'bg-[#070510] text-gray-500 border border-[#1A1726] hover:text-gray-300'
                    }`}
                    title={f.label}
                  >
                    {f.key}
                  </button>
                ))}
                <div className="h-4 w-px bg-[#1A1726] mx-1" />
                <button
                  onClick={() => setShowReplace(!showReplace)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${showReplace ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-[#070510] text-gray-500 border border-[#1A1726] hover:text-gray-300'}`}
                >
                  <Replace size={10} className="inline mr-1" />Replace
                </button>
                <button
                  onClick={() => setShowExplain(!showExplain)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${showExplain ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-[#070510] text-gray-500 border border-[#1A1726] hover:text-gray-300'}`}
                >
                  Explain
                </button>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Explain regex */}
            {showExplain && pattern && !error && (
              <div className="rounded-xl border border-purple-500/20 bg-[#0F0D1A] p-4">
                <label className="text-sm font-medium text-purple-400 mb-2 block">Regex Breakdown</label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {explanation.map((exp, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <code className="text-[#E8970A] font-mono w-20 shrink-0 text-right">{exp.split(' - ')[0]}</code>
                      <span className="text-gray-400">{exp.split(' - ').slice(1).join(' - ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Replace mode */}
            {showReplace && (
              <div className="rounded-xl border border-blue-500/20 bg-[#0F0D1A] p-4">
                <label className="text-sm font-medium text-blue-400 mb-2 block">Replace With</label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={e => setReplaceText(e.target.value)}
                  placeholder="Replacement text ($1, $2 for groups)..."
                  className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
                {replacePreview && (
                  <div className="mt-3">
                    <label className="text-xs text-gray-500 mb-1 block">Preview</label>
                    <pre className="bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-green-400 text-sm font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">{replacePreview}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Test string */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Test String</label>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter test string here..."
                className="w-full h-32 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white font-mono text-sm resize-y focus:outline-none focus:border-[#E8970A]"
              />
            </div>

            {/* Highlighted output */}
            {testString && pattern && !error && (
              <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Highlighted Matches</label>
                  <span className="text-xs text-[#E8970A]">
                    <Hash size={12} className="inline mr-1" />
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div
                  className="bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 font-mono text-sm text-white whitespace-pre-wrap break-all leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml || '<span class="text-gray-500">No matches</span>' }}
                />
              </div>
            )}
          </div>

          {/* Right column - matches */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <div className="flex items-center gap-2 mb-3">
                <List size={16} className="text-[#E8970A]" />
                <h3 className="text-sm font-medium text-gray-300">Match Details</h3>
              </div>
              {matches.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {!pattern ? 'Enter a pattern to start matching' : !testString ? 'Enter a test string' : error ? 'Fix the regex error' : 'No matches found'}
                </p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {matches.map((m, i) => (
                    <div key={i} className="bg-[#070510] border border-[#1A1726] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${MATCH_COLORS[i % MATCH_COLORS.length].split(' ')[1]}`}>Match {i + 1}</span>
                        <span className="text-xs text-gray-500">Index: {m.index}</span>
                      </div>
                      <p className="text-white font-mono text-sm break-all">&quot;{m.match}&quot;</p>
                      {m.groups.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-[#1A1726]">
                          <span className="text-xs text-gray-500 mb-1 block">Captured Groups:</span>
                          {m.groups.map((g, gi) => (
                            <div key={gi} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-500">Group {gi + 1}:</span>
                              <span className={`font-mono ${MATCH_COLORS[(gi + 1) % MATCH_COLORS.length].split(' ')[1]}`}>{g !== undefined ? `"${g}"` : 'undefined'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
