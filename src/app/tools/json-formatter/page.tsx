'use client'

import { useState, useCallback, useMemo } from 'react'


import { Braces, Copy, Check, Wand2, Minus, ChevronRight, ChevronDown, FileJson, MousePointer, Download, Table, Sun, Moon } from 'lucide-react'

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62704"
  },
  "hobbies": ["reading", "hiking", "coding"],
  "isActive": true,
  "scores": [95, 87, 92, 78],
  "metadata": null
}`

// Tree view component
function JsonTreeNode({ data, path, onPathClick }: { data: any; path: string; onPathClick: (path: string) => void }) {
  const [expanded, setExpanded] = useState(true)

  if (data === null) return <span className="text-gray-500 cursor-pointer hover:underline" onClick={() => onPathClick(path)}>null</span>
  if (typeof data === 'boolean') return <span className="text-purple-400 cursor-pointer hover:underline" onClick={() => onPathClick(path)}>{data.toString()}</span>
  if (typeof data === 'number') return <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => onPathClick(path)}>{data}</span>
  if (typeof data === 'string') return <span className="text-green-400 cursor-pointer hover:underline" onClick={() => onPathClick(path)}>&quot;{data}&quot;</span>

  const isArray = Array.isArray(data)
  const entries = isArray ? data.map((v: any, i: number) => [i, v]) : Object.entries(data)
  const bracketOpen = isArray ? '[' : '{'
  const bracketClose = isArray ? ']' : '}'

  return (
    <span>
      <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center text-gray-500 hover:text-white">
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      <span className="text-gray-500">{bracketOpen}</span>
      {!expanded ? (
        <span className="text-gray-500 cursor-pointer" onClick={() => setExpanded(true)}> ... {entries.length} items {bracketClose}</span>
      ) : (
        <>
          <div className="ml-4 border-l border-[#1A1726] pl-2">
            {entries.map((entry: any, i: number) => {
              const [key, value] = entry
              const childPath = isArray ? `${path}[${key}]` : `${path}${path ? '.' : ''}${key}`
              return (
                <div key={i} className="leading-6">
                  {!isArray && <span className="text-[#E8970A] cursor-pointer hover:underline" onClick={() => onPathClick(childPath)}>&quot;{key}&quot;</span>}
                  {isArray && <span className="text-gray-500 cursor-pointer hover:underline" onClick={() => onPathClick(childPath)}>{key}</span>}
                  <span className="text-gray-500">: </span>
                  <JsonTreeNode data={value} path={childPath} onPathClick={onPathClick} />
                  {i < entries.length - 1 && <span className="text-gray-500">,</span>}
                </div>
              )
            })}
          </div>
          <span className="text-gray-500">{bracketClose}</span>
        </>
      )}
    </span>
  )
}

// JSON to CSV converter
function jsonToCsv(data: any): string {
  if (!Array.isArray(data)) {
    if (typeof data === 'object' && data !== null) data = [data]
    else return ''
  }
  if (data.length === 0) return ''
  const headers = new Set<string>()
  data.forEach((row: any) => {
    if (typeof row === 'object' && row !== null) Object.keys(row).forEach(k => headers.add(k))
  })
  const headerArr = Array.from(headers)
  const escape = (v: any) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headerArr.map(escape).join(',')]
  data.forEach((row: any) => {
    lines.push(headerArr.map(h => escape(row?.[h] ?? '')).join(','))
  })
  return lines.join('\n')
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [errorPosition, setErrorPosition] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedMinified, setCopiedMinified] = useState(false)
  const [copiedFormatted, setCopiedFormatted] = useState(false)
  const [indent, setIndent] = useState(2)
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [selectedPath, setSelectedPath] = useState('')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [darkTheme, setDarkTheme] = useState(true)

  const parseError = (message: string): number | null => {
    const match = message.match(/position\s+(\d+)/i)
    if (match) return parseInt(match[1])
    return null
  }

  const format = () => {
    setError('')
    setErrorPosition(null)
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setParsedJson(parsed)
    } catch (err: any) {
      setError(err.message)
      setErrorPosition(parseError(err.message))
      setOutput('')
      setParsedJson(null)
    }
  }

  const minify = () => {
    setError('')
    setErrorPosition(null)
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setParsedJson(parsed)
    } catch (err: any) {
      setError(err.message)
      setErrorPosition(parseError(err.message))
      setOutput('')
      setParsedJson(null)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyFormatted = async () => {
    try {
      const parsed = JSON.parse(input || output)
      await navigator.clipboard.writeText(JSON.stringify(parsed, null, indent))
      setCopiedFormatted(true)
      setTimeout(() => setCopiedFormatted(false), 1500)
    } catch { /* ignore */ }
  }

  const copyMinified = async () => {
    try {
      const parsed = JSON.parse(input || output)
      await navigator.clipboard.writeText(JSON.stringify(parsed))
      setCopiedMinified(true)
      setTimeout(() => setCopiedMinified(false), 1500)
    } catch { /* ignore */ }
  }

  const loadSample = () => {
    setInput(SAMPLE_JSON)
    setError('')
    setErrorPosition(null)
    try {
      const parsed = JSON.parse(SAMPLE_JSON)
      setOutput(JSON.stringify(parsed, null, indent))
      setParsedJson(parsed)
    } catch { /* ignore */ }
  }

  const handlePathClick = useCallback((path: string) => {
    setSelectedPath(path)
  }, [])

  const convertToCsv = () => {
    if (!parsedJson) return
    const csv = jsonToCsv(parsedJson)
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const downloadJson = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Line-numbered output
  const outputWithLines = useMemo(() => {
    if (!output) return ''
    return output.split('\n').map((line, i) => `${String(i + 1).padStart(4)} | ${line}`).join('\n')
  }, [output])

  // Highlight error position in input
  const renderInputWithError = () => {
    if (errorPosition === null || !input) return null
    const before = input.substring(0, errorPosition)
    const lineNum = (before.match(/\n/g) || []).length + 1
    const colNum = errorPosition - before.lastIndexOf('\n')
    return (
      <div className="text-xs text-red-400 mt-1">
        Error at line {lineNum}, column {colNum}
      </div>
    )
  }

  const themeClasses = darkTheme
    ? 'bg-[#070510] border-[#1A1726] text-white'
    : 'bg-[#f8f9fa] border-gray-300 text-gray-900'

  const editorBg = darkTheme ? 'bg-[#070510]' : 'bg-white'
  const editorText = darkTheme ? 'text-white' : 'text-gray-900'
  const editorBorder = darkTheme ? 'border-[#1A1726]' : 'border-gray-300'

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Braces size={28} /> JSON Formatter
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Format, validate, minify, and convert JSON.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-28 rounded-lg border border-red-400/30 bg-[#070510] p-2 font-mono text-[9px] text-red-300 leading-tight">
                {`{"name":"John","age":30,"active":true}`}
              </div>
              <span className="text-[10px] text-gray-500">Messy</span>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col items-center gap-1">
              <div className="w-28 rounded-lg border border-green-500/30 bg-[#070510] p-2 font-mono text-[9px] leading-tight">
                <span className="text-gray-500">{'{'}</span><br/>
                <span className="text-[#E8970A]">&nbsp;&nbsp;&quot;name&quot;</span><span className="text-gray-500">:</span> <span className="text-green-400">&quot;John&quot;</span><br/>
                <span className="text-[#E8970A]">&nbsp;&nbsp;&quot;age&quot;</span><span className="text-gray-500">:</span> <span className="text-blue-400">30</span><br/>
                <span className="text-gray-500">{'}'}</span>
              </div>
              <span className="text-[10px] text-green-400">Formatted</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste JSON</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Instantly formatted with syntax highlighting</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Also validates your JSON and shows errors with line numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${darkTheme ? 'bg-[#0F0D1A] border-[#1A1726]' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Input</label>
              <span className="text-xs text-gray-500">{input.length} chars</span>
            </div>
            <div className="relative">
              {showLineNumbers && input && (
                <div className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none text-right pr-1 pt-2 font-mono text-[10px] text-gray-600 leading-[1.35rem] overflow-hidden select-none">
                  {input.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key":"value"}'
                rows={20}
                className={`w-full px-3 py-2 rounded-lg ${editorBg} border ${editorBorder} ${editorText} text-sm font-mono ${errorPosition !== null ? 'border-red-500/50' : ''}`}
                style={showLineNumbers && input ? { paddingLeft: '3rem' } : {}}
              />
            </div>
            {renderInputWithError()}
          </div>
          <div className={`${darkTheme ? 'bg-[#0F0D1A] border-[#1A1726]' : 'bg-white border-gray-200'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Output</label>
                {parsedJson !== null && (
                  <div className="flex bg-[#070510] rounded-lg p-0.5 border border-[#1A1726]">
                    <button onClick={() => setViewMode('text')} className={`px-2 py-0.5 rounded text-xs ${viewMode === 'text' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Text</button>
                    <button onClick={() => setViewMode('tree')} className={`px-2 py-0.5 rounded text-xs ${viewMode === 'tree' ? 'bg-[#E8970A] text-black' : 'text-gray-400'}`}>Tree</button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {output && <span className="text-xs text-gray-500">{output.length} chars</span>}
                {output && <button onClick={copy} className="text-gray-400 hover:text-white">{copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
            </div>
            {viewMode === 'text' ? (
              <textarea value={showLineNumbers ? outputWithLines : output} readOnly rows={20} className={`w-full px-3 py-2 rounded-lg ${editorBg} border ${editorBorder} ${editorText} text-sm font-mono`} />
            ) : (
              <div className={`w-full px-3 py-2 rounded-lg ${editorBg} border ${editorBorder} text-sm font-mono overflow-auto`} style={{ height: '480px' }}>
                {parsedJson !== null ? (
                  <JsonTreeNode data={parsedJson} path="" onPathClick={handlePathClick} />
                ) : (
                  <span className="text-gray-500">Format or minify JSON to see tree view</span>
                )}
              </div>
            )}
            {/* Selected Path Display */}
            {selectedPath && viewMode === 'tree' && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <MousePointer size={12} className="text-gray-500" />
                <code className="bg-[#070510] border border-[#1A1726] px-2 py-1 rounded text-[#E8970A] font-mono flex-1 truncate">{selectedPath || '(root)'}</code>
                <button onClick={async () => { await navigator.clipboard.writeText(selectedPath); }} className="text-gray-400 hover:text-white"><Copy size={12} /></button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300 mt-3">{error}</div>}

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button onClick={format} className="px-4 py-2 rounded-lg bg-[#E8970A] text-black font-medium text-sm"><Wand2 size={14} className="inline mr-1" />Format</button>
          <button onClick={minify} className="px-4 py-2 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-sm"><Minus size={14} className="inline mr-1" />Minify</button>

          <div className="h-6 w-px bg-[#1A1726] mx-1" />

          <button onClick={copyFormatted} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
            {copiedFormatted ? <><Check size={14} className="inline mr-1 text-green-400" />Copied</> : <><Copy size={14} className="inline mr-1" />Copy Formatted</>}
          </button>
          <button onClick={copyMinified} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
            {copiedMinified ? <><Check size={14} className="inline mr-1 text-green-400" />Copied</> : <><Copy size={14} className="inline mr-1" />Copy Minified</>}
          </button>
          <button onClick={loadSample} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
            <FileJson size={14} className="inline mr-1" />Sample JSON
          </button>

          {parsedJson !== null && (
            <>
              <button onClick={convertToCsv} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
                <Table size={14} className="inline mr-1" />JSON to CSV
              </button>
              <button onClick={downloadJson} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
                <Download size={14} className="inline mr-1" />Download JSON
              </button>
            </>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setShowLineNumbers(!showLineNumbers)} className={`px-2 py-1 rounded text-xs border ${showLineNumbers ? 'border-[#E8970A]/40 text-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] text-gray-400'}`}>
              Line #
            </button>
            <button onClick={() => setDarkTheme(!darkTheme)} className="px-2 py-1 rounded text-xs border border-[#1A1726] text-gray-400 hover:text-white">
              {darkTheme ? <Sun size={12} className="inline" /> : <Moon size={12} className="inline" />}
            </button>
            <span className="text-xs text-gray-400">Indent:</span>
            <select value={indent} onChange={(e) => setIndent(parseInt(e.target.value))} className="px-2 py-1 rounded bg-[#070510] border border-[#1A1726] text-white text-xs">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="0">Tab</option>
            </select>
          </div>
        </div>
      </main>
      
    </div>
  )
}
