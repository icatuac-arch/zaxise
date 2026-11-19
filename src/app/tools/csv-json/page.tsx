'use client'

import { useState, useMemo } from 'react'


import { FileJson, Copy, Check, Trash2, Download, ArrowRightLeft } from 'lucide-react'

function parseCSV(csv: string, delimiter: string, hasHeader: boolean): { data: Record<string, string>[]; headers: string[] } | string {
  try {
    const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) return 'No data found'

    const parseLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (ch === delimiter && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
      result.push(current.trim())
      return result
    }

    const rows = lines.map(parseLine)
    let headers: string[]
    let dataRows: string[][]

    if (hasHeader) {
      headers = rows[0]
      dataRows = rows.slice(1)
    } else {
      headers = rows[0].map((_, i) => `column${i + 1}`)
      dataRows = rows
    }

    const data = dataRows.map(row => {
      const obj: Record<string, string> = {}
      headers.forEach((h, i) => {
        obj[h] = row[i] ?? ''
      })
      return obj
    })

    return { data, headers }
  } catch {
    return 'Invalid CSV format'
  }
}

function jsonToCSV(jsonStr: string, delimiter: string): string {
  try {
    const data = JSON.parse(jsonStr)
    if (!Array.isArray(data) || data.length === 0) return 'JSON must be an array of objects'

    const headers = Object.keys(data[0])
    const escapeField = (field: string) => {
      const s = String(field ?? '')
      if (s.includes(delimiter) || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const lines = [
      headers.map(escapeField).join(delimiter),
      ...data.map((row: Record<string, unknown>) =>
        headers.map(h => escapeField(String(row[h] ?? ''))).join(delimiter)
      )
    ]
    return lines.join('\n')
  } catch {
    return 'Invalid JSON format'
  }
}

export default function CsvJsonPage() {
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json')
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [prettyPrint, setPrettyPrint] = useState(true)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    if (mode === 'csv2json') {
      const result = parseCSV(input, delimiter, hasHeader)
      if (typeof result === 'string') return result
      return prettyPrint ? JSON.stringify(result.data, null, 2) : JSON.stringify(result.data)
    } else {
      return jsonToCSV(input, delimiter)
    }
  }, [input, mode, delimiter, hasHeader, prettyPrint])

  const isError = output && (output.startsWith('Invalid') || output.startsWith('No data') || output.startsWith('JSON must'))

  // Auto-detect delimiter
  const detectedDelimiter = useMemo(() => {
    if (mode !== 'csv2json' || !input.trim()) return null
    const firstLine = input.trim().split('\n')[0]
    const commas = (firstLine.match(/,/g) || []).length
    const semicolons = (firstLine.match(/;/g) || []).length
    const tabs = (firstLine.match(/\t/g) || []).length
    if (tabs > commas && tabs > semicolons) return '\t'
    if (semicolons > commas) return ';'
    return ','
  }, [input, mode])

  // Preview first 5 rows
  const previewData = useMemo(() => {
    if (mode !== 'csv2json' || !input.trim()) return null
    const result = parseCSV(input, delimiter, hasHeader)
    if (typeof result === 'string') return null
    return { headers: result.headers, rows: result.data.slice(0, 5), totalRows: result.data.length, columnCount: result.headers.length }
  }, [input, mode, delimiter, hasHeader])

  const handleCopy = async () => {
    if (!output || isError) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!output || isError) return
    const ext = mode === 'csv2json' ? 'json' : 'csv'
    const mime = mode === 'csv2json' ? 'application/json' : 'text/csv'
    const blob = new Blob([output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const delimiterLabel = delimiter === ',' ? 'Comma' : delimiter === ';' ? 'Semicolon' : 'Tab'

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <FileJson size={28} /> CSV &harr; JSON Converter
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Convert between CSV and JSON formats.</p>
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
            <div className="px-3 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-xs font-mono font-bold leading-relaxed">name,age<br/>Alice,30</div>
            <span className="text-[#E8970A] text-2xl">&#8596;</span>
            <div className="px-3 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-xs font-mono font-bold leading-relaxed">{`[{"name":"Alice"}]`}</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste CSV or JSON</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Convert</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy or download</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Handles custom delimiters (comma, semicolon, tab).</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode('csv2json'); setInput('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === 'csv2json' ? 'bg-[#E8970A] text-black border-[#E8970A]' : 'border-[#1A1726] text-gray-300 hover:bg-white/5'}`}
          >
            CSV to JSON
          </button>
          <button
            onClick={() => { setMode('json2csv'); setInput('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${mode === 'json2csv' ? 'bg-[#E8970A] text-black border-[#E8970A]' : 'border-[#1A1726] text-gray-300 hover:bg-white/5'}`}
          >
            <ArrowRightLeft size={14} /> JSON to CSV
          </button>
        </div>

        {/* Options */}
        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-center text-sm">
          <label className="flex items-center gap-2">
            <span className="text-gray-400">Delimiter:</span>
            <select value={delimiter} onChange={e => setDelimiter(e.target.value)} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white">
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value={'\t'}>Tab</option>
            </select>
          </label>
          {mode === 'csv2json' && (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="accent-[#E8970A]" />
                <span className="text-gray-400">Has header row</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={prettyPrint} onChange={e => setPrettyPrint(e.target.checked)} className="accent-[#E8970A]" />
                <span className="text-gray-400">Pretty print</span>
              </label>
            </>
          )}
        </div>

        {/* Auto-detected delimiter hint */}
        {mode === 'csv2json' && detectedDelimiter && detectedDelimiter !== delimiter && input.trim() && (
          <div className="bg-[#E8970A]/10 border border-[#E8970A]/30 rounded-xl p-3 text-sm text-[#E8970A] mb-4 flex items-center justify-between">
            <span>Detected delimiter: {detectedDelimiter === '\t' ? 'Tab' : detectedDelimiter === ';' ? 'Semicolon' : 'Comma'}</span>
            <button onClick={() => setDelimiter(detectedDelimiter)} className="px-3 py-1 rounded-lg bg-[#E8970A] text-black text-xs font-medium">Use it</button>
          </div>
        )}

        {/* Preview table */}
        {previewData && (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Preview (first 5 of {previewData.totalRows} rows, {previewData.columnCount} columns)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="text-xs text-gray-300 w-full">
                <thead>
                  <tr>
                    {previewData.headers.map((h, i) => (
                      <th key={i} className="px-3 py-1.5 text-left text-[#E8970A] bg-[#070510] border border-[#1A1726] font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, i) => (
                    <tr key={i}>
                      {previewData.headers.map((h, j) => (
                        <td key={j} className="px-3 py-1.5 border border-[#1A1726]">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Input / Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">{mode === 'csv2json' ? 'CSV Input' : 'JSON Input'}</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'csv2json' ? 'name,age,city\nJohn,30,NYC\nJane,25,LA' : '[{"name":"John","age":30},{"name":"Jane","age":25}]'}
              className="w-full h-72 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none font-mono text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">{mode === 'csv2json' ? 'JSON Output' : 'CSV Output'}</label>
            <textarea
              readOnly
              value={output}
              className={`w-full h-72 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white resize-none font-mono text-sm ${isError ? 'text-red-400' : ''}`}
              placeholder="Output will appear here..."
            />
            {output && !isError && (
              <div className="absolute top-8 right-3 flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
                  <Download size={14} /> .{mode === 'csv2json' ? 'json' : 'csv'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
