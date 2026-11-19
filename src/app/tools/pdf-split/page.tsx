'use client'

import { useState, useEffect } from 'react'


import { Upload, Download, Scissors, X, Clock, Keyboard, FileText, Zap } from 'lucide-react'

interface HistoryEntry {
  name: string
  pages: number
  ranges: string
  date: string
}

const HISTORY_KEY = 'pdf-split-history'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageRanges, setPageRanges] = useState('')
  const [splitting, setSplitting] = useState(false)
  const [splitProgress, setSplitProgress] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [extractIndividual, setExtractIndividual] = useState(false)

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const saveHistory = (entry: HistoryEntry) => {
    const updated = [entry, ...history].slice(0, 5)
    setHistory(updated)
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
  }

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please select a PDF file')
      return
    }
    setError('')
    setFile(f)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const count = pdf.getPageCount()
      setPageCount(count)
      setPageRanges(`1-${count}`)
      setExtractIndividual(false)
    } catch (err: any) {
      setError('Failed to read PDF: ' + err.message)
    }
  }

  // Parse "1-3, 5, 7-9" -> [[1,3],[5,5],[7,9]]
  const parseRanges = (input: string): number[][] => {
    const ranges: number[][] = []
    for (const part of input.split(',').map(s => s.trim()).filter(Boolean)) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(s => parseInt(s.trim()))
        if (!isNaN(a) && !isNaN(b)) ranges.push([a, b])
      } else {
        const n = parseInt(part)
        if (!isNaN(n)) ranges.push([n, n])
      }
    }
    return ranges
  }

  // Calculate which pages will be extracted
  const getPreviewPages = (): number[] => {
    if (extractIndividual) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }
    const ranges = parseRanges(pageRanges)
    const pages: number[] = []
    for (const [start, end] of ranges) {
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= pageCount && !pages.includes(p)) pages.push(p)
      }
    }
    return pages.sort((a, b) => a - b)
  }

  const handleExtractIndividual = () => {
    setExtractIndividual(true)
    setPageRanges(Array.from({ length: pageCount }, (_, i) => `${i + 1}`).join(', '))
  }

  const splitPdf = async () => {
    if (!file) return
    setSplitting(true)
    setError('')
    setSplitProgress('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(bytes)
      const ranges = parseRanges(pageRanges)
      if (ranges.length === 0) {
        setError('Please specify page ranges (e.g., "1-3, 5, 7-9")')
        setSplitting(false)
        return
      }

      let i = 0
      for (const [start, end] of ranges) {
        i++
        setSplitProgress(`Creating file ${i} of ${ranges.length} (pages ${start}-${end})...`)
        const newPdf = await PDFDocument.create()
        const indices: number[] = []
        for (let p = start; p <= end; p++) {
          if (p >= 1 && p <= pageCount) indices.push(p - 1)
        }
        if (indices.length === 0) continue
        const pages = await newPdf.copyPages(sourcePdf, indices)
        pages.forEach(p => newPdf.addPage(p))
        const newBytes = await newPdf.save()
        const blob = new Blob([new Uint8Array(newBytes)], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file.name.replace('.pdf', '')}-split-${i}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        await new Promise(r => setTimeout(r, 200))
      }

      saveHistory({
        name: file.name,
        pages: pageCount,
        ranges: pageRanges,
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      setError('Split failed: ' + err.message)
    }
    setSplitProgress('')
    setSplitting(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && file && !splitting) {
        e.preventDefault()
        splitPdf()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, splitting, pageRanges, pageCount])

  const previewPages = file ? getPreviewPages() : []

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Scissors size={28} /> PDF Split
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Split a PDF into individual files. Each range becomes a separate PDF.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-[#E8970A] text-xs font-bold">PDF</span>
                  <span className="text-[8px] text-gray-500">12 pages</span>
                </div>
              </div>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex gap-2">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-12 rounded-lg border-2 border-green-500/50 bg-green-500/5 flex items-center justify-center">
                    <span className="text-green-400 text-[10px] font-bold">P{n}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Select pages to extract</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download individual pages</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Extract specific pages or split into individual files.
          </p>
        </div>

        {!file ? (
          <div className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8">
            <label className="block text-center cursor-pointer">
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <Upload size={40} className="mx-auto text-gray-500 mb-3" />
              <p className="text-white font-medium">Upload a PDF</p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{file.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{pageCount} pages</span>
                  <span className="text-gray-700">|</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
              </div>
              <button onClick={() => { setFile(null); setPageCount(0); setPageRanges(''); setExtractIndividual(false) }} className="text-gray-400 hover:text-red-400"><X size={18} /></button>
            </div>

            {/* Page range input */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-300">Page ranges</label>
                <button
                  onClick={handleExtractIndividual}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    extractIndividual
                      ? 'bg-[#E8970A]/20 border-[#E8970A] text-[#E8970A]'
                      : 'border-[#1A1726] text-gray-400 hover:text-[#E8970A] hover:border-[#E8970A]/50'
                  }`}
                >
                  <Zap size={12} />
                  Extract all as individual pages
                </button>
              </div>
              <input
                type="text"
                value={pageRanges}
                onChange={(e) => { setPageRanges(e.target.value); setExtractIndividual(false) }}
                placeholder={`e.g., 1-3, 5, 7-${pageCount}`}
                className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">Each range becomes a separate PDF download. Use commas to separate.</p>
            </div>

            {/* Page preview */}
            {previewPages.length > 0 && pageCount > 0 && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Pages to extract ({previewPages.length} of {pageCount})</span>
                  <span className="text-xs text-gray-500">
                    {parseRanges(pageRanges).length} output file{parseRanges(pageRanges).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                    <div
                      key={p}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono ${
                        previewPages.includes(p)
                          ? 'bg-[#E8970A]/20 border border-[#E8970A]/50 text-[#E8970A]'
                          : 'bg-[#070510] border border-[#1A1726] text-gray-600'
                      }`}
                    >
                      {p}
                    </div>
                  ))}
                </div>
                {pageCount > 50 && (
                  <p className="text-xs text-gray-600 mt-2">Showing first 50 page indicators</p>
                )}
              </div>
            )}

            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">{error}</div>}

            {/* Split progress */}
            {splitting && splitProgress && (
              <div className="bg-[#0F0D1A] border border-[#E8970A]/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8970A] border-r-transparent flex-shrink-0" />
                  <span className="text-sm text-[#E8970A]">{splitProgress}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <button onClick={splitPdf} disabled={splitting} className="px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                <Download size={16} className="inline mr-1" />
                {splitting ? 'Splitting...' : 'Split & Download'}
              </button>
              <button onClick={() => setShowShortcuts(!showShortcuts)} className="ml-auto px-3 py-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                <Keyboard size={14} />
              </button>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Split &amp; Download</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing History */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-3"
            >
              <Clock size={14} />
              <span>Recent splits ({history.length})</span>
              <span className="text-xs">{showHistory ? '(hide)' : '(show)'}</span>
            </button>
            {showHistory && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl divide-y divide-[#1A1726]">
                {history.map((entry, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-300 truncate">{entry.name}</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500">{entry.pages} pages</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500 font-mono text-xs">{entry.ranges}</span>
                    </div>
                    <span className="text-xs text-gray-600">{entry.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
    </div>
  )
}
