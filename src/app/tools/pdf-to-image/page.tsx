'use client'

import { useState, useEffect } from 'react'


import { Upload, Download, Image as ImageIcon, Loader2, Clock, Keyboard, FileText, Settings } from 'lucide-react'

interface PageImage {
  pageNum: number
  dataUrl: string
  blob: Blob
}

declare global {
  interface Window {
    pdfjsLib?: any
  }
}

interface HistoryEntry {
  name: string
  pages: number
  format: string
  dpi: string
  date: string
}

const HISTORY_KEY = 'pdf-to-image-history'

const DPI_OPTIONS = [
  { value: 1, label: '72 DPI', description: 'Screen quality, smallest files' },
  { value: 2, label: '150 DPI', description: 'Good for most uses' },
  { value: 4, label: '300 DPI', description: 'Print quality, largest files' },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageImage[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressPercent, setProgressPercent] = useState(0)
  const [scale, setScale] = useState(2)
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const [libReady, setLibReady] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

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

  // Load pdf.js from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.pdfjsLib) {
      setLibReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs'
    script.type = 'module'

    const loader = document.createElement('script')
    loader.type = 'module'
    loader.textContent = `
      import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs'
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs'
      window.pdfjsLib = pdfjsLib
      window.dispatchEvent(new CustomEvent('pdfjs-loaded'))
    `
    document.head.appendChild(loader)

    const handler = () => setLibReady(true)
    window.addEventListener('pdfjs-loaded', handler)
    return () => window.removeEventListener('pdfjs-loaded', handler)
  }, [])

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }
    setFile(f)
    setPages([])
    setPageCount(0)
    // Get page count
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      setPageCount(pdf.getPageCount())
    } catch {}
  }

  const getDpiLabel = () => {
    const match = DPI_OPTIONS.find(d => d.value === scale)
    return match ? match.label : `${Math.round(scale * 72)} DPI`
  }

  const convert = async () => {
    if (!file || !window.pdfjsLib) return
    setProcessing(true)
    setPages([])
    setProgressPercent(0)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const newPages: PageImage[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Rendering page ${i} of ${pdf.numPages}...`)
        setProgressPercent(Math.round((i / pdf.numPages) * 100))
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!

        if (format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        await page.render({ canvasContext: ctx, viewport }).promise

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
        const blob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), mimeType, 0.92))
        const dataUrl = URL.createObjectURL(blob)
        newPages.push({ pageNum: i, dataUrl, blob })
      }
      setPages(newPages)

      saveHistory({
        name: file.name,
        pages: pdf.numPages,
        format: format.toUpperCase(),
        dpi: getDpiLabel(),
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Failed: ' + err.message)
    }
    setProgress('')
    setProgressPercent(0)
    setProcessing(false)
  }

  const downloadOne = (p: PageImage) => {
    const url = URL.createObjectURL(p.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name?.replace(/\.pdf$/, '')}-page-${p.pageNum}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    for (const p of pages) {
      downloadOne(p)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && file && !processing) {
        e.preventDefault()
        convert()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, processing, format, scale])

  const totalImageSize = pages.reduce((sum, p) => sum + p.blob.size, 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <ImageIcon size={28} /> PDF to Image
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Convert PDF pages to PNG or JPEG images. Useful for extracting event flyer pages.</p>
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
            <div className="flex gap-1">
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[8px] font-bold">P1</div>
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[8px] font-bold">P2</div>
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[8px] font-bold">P3</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Convert pages</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download images</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Each page becomes a separate image file.
          </p>
        </div>

        {!file ? (
          <div className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8">
            <label className="block text-center cursor-pointer">
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <Upload size={40} className="mx-auto text-gray-500 mb-3" />
              <p className="text-white font-medium">Upload a PDF</p>
              <p className="text-xs text-gray-500 mt-1">All processing happens in your browser</p>
            </label>
            {!libReady && (
              <div className="mt-4 text-center text-xs text-[#E8970A]">Loading PDF library...</div>
            )}
          </div>
        ) : (
          <>
            {/* File info */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-white font-medium">{file.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{formatBytes(file.size)}</span>
                  {pageCount > 0 && (
                    <>
                      <span className="text-gray-700">|</span>
                      <span>{pageCount} pages</span>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => { setFile(null); setPages([]); setPageCount(0) }} className="text-gray-400 hover:text-white text-sm">Change</button>
            </div>

            {/* Settings */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings size={14} className="text-gray-500" />
                <span className="text-sm text-gray-300 font-medium">Output Settings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFormat('png')}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        format === 'png'
                          ? 'bg-[#E8970A]/15 border-[#E8970A] text-[#E8970A]'
                          : 'border-[#1A1726] text-gray-400 hover:text-white'
                      }`}
                    >
                      PNG (lossless)
                    </button>
                    <button
                      onClick={() => setFormat('jpeg')}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        format === 'jpeg'
                          ? 'bg-[#E8970A]/15 border-[#E8970A] text-[#E8970A]'
                          : 'border-[#1A1726] text-gray-400 hover:text-white'
                      }`}
                    >
                      JPG (smaller)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Quality / DPI</label>
                  <div className="grid grid-cols-3 gap-1">
                    {DPI_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setScale(opt.value)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                          scale === opt.value
                            ? 'bg-[#E8970A]/15 border-[#E8970A] text-[#E8970A]'
                            : 'border-[#1A1726] text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{DPI_OPTIONS.find(d => d.value === scale)?.description}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            {processing && (
              <div className="bg-[#0F0D1A] border border-[#E8970A]/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 size={16} className="animate-spin text-[#E8970A]" />
                  <span className="text-sm text-[#E8970A]">{progress}</span>
                </div>
                <div className="w-full bg-[#070510] rounded-full h-2">
                  <div
                    className="bg-[#E8970A] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">{progressPercent}%</div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <button onClick={convert} disabled={processing || !libReady} className="px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                {processing ? <><Loader2 size={14} className="inline mr-1 animate-spin" />{progress}</> : 'Convert to Images'}
              </button>
              {pages.length > 0 && (
                <button onClick={downloadAll} className="px-5 py-2 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30">
                  <Download size={14} className="inline mr-1" />Download All ({pages.length})
                </button>
              )}
              <button onClick={() => setShowShortcuts(!showShortcuts)} className="ml-auto px-3 py-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                <Keyboard size={14} />
              </button>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1 mb-4">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Convert to images</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                </div>
              </div>
            )}

            {/* Results summary */}
            {pages.length > 0 && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 mb-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="text-gray-400">
                  {pages.length} image{pages.length !== 1 ? 's' : ''} generated
                </div>
                <div className="text-gray-600">|</div>
                <div className="text-gray-400">{format.toUpperCase()} format</div>
                <div className="text-gray-600">|</div>
                <div className="text-gray-400">{getDpiLabel()}</div>
                <div className="text-gray-600">|</div>
                <div className="text-gray-400">Total size: {formatBytes(totalImageSize)}</div>
              </div>
            )}

            {pages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {pages.map(p => (
                  <div key={p.pageNum} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-2 group">
                    <img src={p.dataUrl} alt={`Page ${p.pageNum}`} className="w-full h-auto rounded" />
                    <div className="flex items-center justify-between mt-2 text-xs px-1">
                      <div>
                        <span className="text-gray-500">Page {p.pageNum}</span>
                        <span className="text-gray-600 ml-1">({formatBytes(p.blob.size)})</span>
                      </div>
                      <button onClick={() => downloadOne(p)} className="text-[#E8970A] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={12} className="inline mr-1" />Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Processing History */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-3"
            >
              <Clock size={14} />
              <span>Recent conversions ({history.length})</span>
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
                      <span className="text-gray-500">{entry.format}</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500">{entry.dpi}</span>
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
