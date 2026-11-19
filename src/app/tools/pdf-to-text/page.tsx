'use client'

import { useState, useEffect, useRef } from 'react'


import { Upload, Download, Copy, FileText, Check, AlertTriangle, Clock, Keyboard, Search, X } from 'lucide-react'

interface PageText {
  pageNum: number
  text: string
  wordCount: number
}

interface HistoryEntry {
  name: string
  pages: number
  wordCount: number
  date: string
}

const HISTORY_KEY = 'pdf-to-text-history'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [pageTexts, setPageTexts] = useState<PageText[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedPage, setCopiedPage] = useState<number | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const textRef = useRef<HTMLPreElement>(null)

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

  const loadPdfJs = async () => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib
    return new Promise<any>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload = () => {
        const lib = (window as any).pdfjsLib
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve(lib)
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') return
    setFile(f)
    setLoading(true)
    setExtractedText('')
    setPageTexts([])
    setSearchQuery('')
    try {
      const pdfjsLib = await loadPdfJs()
      const bytes = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const total = pdf.numPages
      setPageCount(total)

      const textParts: string[] = []
      const pageData: PageText[] = []
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
        const wordCount = pageText.trim().split(/\s+/).filter((w: string) => w.length > 0).length
        textParts.push(`--- Page ${i} of ${total} ---\n\n${pageText}`)
        pageData.push({ pageNum: i, text: pageText, wordCount })
      }

      setExtractedText(textParts.join('\n\n'))
      setPageTexts(pageData)

      const totalWords = pageData.reduce((sum, p) => sum + p.wordCount, 0)
      saveHistory({
        name: f.name,
        pages: total,
        wordCount: totalWords,
        date: new Date().toLocaleString(),
      })

      pdf.destroy()
    } catch (err: any) {
      alert('Failed to extract text: ' + err.message)
    }
    setLoading(false)
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = extractedText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyPage = async (pageNum: number) => {
    const pageData = pageTexts.find(p => p.pageNum === pageNum)
    if (!pageData) return
    try {
      await navigator.clipboard.writeText(pageData.text)
      setCopiedPage(pageNum)
      setTimeout(() => setCopiedPage(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = pageData.text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedPage(pageNum)
      setTimeout(() => setCopiedPage(null), 2000)
    }
  }

  const downloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'extracted'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim() || !extractedText) {
      setSearchResults(0)
      return
    }
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = extractedText.match(regex)
    setSearchResults(matches ? matches.length : 0)
  }, [searchQuery, extractedText])

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-[#E8970A]/30 text-[#E8970A] rounded px-0.5">$1</mark>')
  }

  const totalWordCount = pageTexts.reduce((sum, p) => sum + p.wordCount, 0)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey) && extractedText) {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [extractedText])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FileText size={28} /> PDF to Text
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Extract text content from your PDF. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center text-red-400 text-xs font-bold">PDF</div>
              <span className="text-[10px] text-gray-500">Input</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex flex-col items-center justify-center text-green-400 gap-0.5 p-1">
                <div className="w-8 h-[2px] bg-green-400/40 rounded"></div>
                <div className="w-8 h-[2px] bg-green-400/40 rounded"></div>
                <div className="w-6 h-[2px] bg-green-400/40 rounded"></div>
                <div className="w-8 h-[2px] bg-green-400/40 rounded"></div>
              </div>
              <span className="text-[10px] text-green-400">Text</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Extract text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy or download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Works best with text-based PDFs, not scanned images.
          </p>
        </div>

        {!file && (
          <div
            className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8 mb-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
          >
            <label className="block text-center cursor-pointer">
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
              <Upload size={40} className="mx-auto text-gray-500 mb-3" />
              <p className="text-white font-medium">Drop a PDF here or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">Your file never leaves your device</p>
            </label>
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#E8970A] border-r-transparent" />
            <p className="text-gray-400 mt-3">Extracting text...</p>
          </div>
        )}

        {file && !loading && extractedText && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">File: {file.name}</span>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-400">{pageCount} pages</span>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-400">{formatBytes(file.size)}</span>
                <button onClick={() => { setFile(null); setExtractedText(''); setPageTexts([]); setSearchQuery('') }} className="text-xs text-gray-500 hover:text-white ml-2">Change file</button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A] text-sm text-gray-400 hover:text-[#E8970A] transition-colors"
                >
                  <Search size={14} /> Search
                </button>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A] text-sm text-gray-400 hover:text-[#E8970A] transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
                <button
                  onClick={downloadTxt}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8970A] text-black text-sm font-semibold hover:bg-[#d18a09] transition-colors"
                >
                  <Download size={14} /> Download .txt
                </button>
                <button onClick={() => setShowShortcuts(!showShortcuts)} className="px-3 py-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                  <Keyboard size={14} />
                </button>
              </div>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1 mb-4">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Search in text</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + F</kbd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Close search</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Escape</kbd>
                </div>
              </div>
            )}

            {/* Search bar */}
            {showSearch && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 mb-4 flex items-center gap-3">
                <Search size={16} className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search extracted text..."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-600"
                  autoFocus
                />
                {searchQuery && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {searchResults} match{searchResults !== 1 ? 'es' : ''}
                  </span>
                )}
                <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Word count summary */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 mb-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="text-gray-400">
                Total: {totalWordCount.toLocaleString()} words
              </div>
              <div className="text-gray-600">|</div>
              <div className="text-gray-400">
                {extractedText.length.toLocaleString()} characters
              </div>
            </div>

            {/* Per-page text with copy buttons */}
            <div className="space-y-3 mb-4">
              {pageTexts.map(pt => (
                <div key={pt.pageNum} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1726] bg-[#070510]/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-300">Page {pt.pageNum}</span>
                      <span className="text-xs text-gray-600">{pt.wordCount} words</span>
                    </div>
                    <button
                      onClick={() => copyPage(pt.pageNum)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-[#E8970A] transition-colors"
                    >
                      {copiedPage === pt.pageNum ? <Check size={12} /> : <Copy size={12} />}
                      {copiedPage === pt.pageNum ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 max-h-[200px] overflow-y-auto">
                    {searchQuery.trim() ? (
                      <p
                        className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightText(pt.text) }}
                      />
                    ) : (
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {pt.text || <span className="text-gray-600 italic">No text on this page</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <AlertTriangle size={16} className="text-[#E8970A] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">
                This tool works best with text-based PDFs. Scanned images or PDFs containing only images will not yield text.
                For scanned documents, consider using an OCR (Optical Character Recognition) tool.
              </p>
            </div>
          </>
        )}

        {file && !loading && !extractedText && (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-8 text-center">
            <AlertTriangle size={32} className="mx-auto text-[#E8970A] mb-3" />
            <p className="text-gray-400">No text could be extracted from this PDF.</p>
            <p className="text-xs text-gray-500 mt-1">This PDF may contain only images or scanned content.</p>
            <button onClick={() => { setFile(null); setExtractedText(''); setPageTexts([]) }} className="mt-4 text-sm text-[#E8970A] hover:underline">Try another file</button>
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
              <span>Recent extractions ({history.length})</span>
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
                      <span className="text-gray-500">{entry.wordCount.toLocaleString()} words</span>
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
