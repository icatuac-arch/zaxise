'use client'

import { useState, useRef, useEffect, useCallback } from 'react'


import { Upload, Download, Droplets, Eye, Clock, Keyboard } from 'lucide-react'

type Position = 'center' | 'diagonal' | 'tiled'

interface HistoryEntry {
  name: string
  watermarkText: string
  position: string
  date: string
}

const HISTORY_KEY = 'pdf-watermark-history'

const PRESET_TEXTS = [
  { label: 'DRAFT', value: 'DRAFT' },
  { label: 'CONFIDENTIAL', value: 'CONFIDENTIAL' },
  { label: 'SAMPLE', value: 'SAMPLE' },
  { label: 'DO NOT COPY', value: 'DO NOT COPY' },
]

const COLOR_PRESETS = [
  { label: 'Red', value: '#DC2626' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Black', value: '#1F2937' },
  { label: 'Gold', value: '#E8970A' },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [text, setText] = useState('WATERMARK')
  const [fontSize, setFontSize] = useState(40)
  const [color, setColor] = useState('#E8970A')
  const [opacity, setOpacity] = useState(0.3)
  const [rotation, setRotation] = useState(-45)
  const [position, setPosition] = useState<Position>('diagonal')
  const [applyAll, setApplyAll] = useState(true)
  const [pageRange, setPageRange] = useState('1')
  const [processing, setProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') return
    setFile(f)
    const bytes = await f.arrayBuffer()
    setPdfBytes(bytes)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const pdf = await PDFDocument.load(bytes)
      setPageCount(pdf.getPageCount())
    } catch {}
  }

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return { r, g, b }
  }

  const parsePageRange = (range: string, total: number): number[] => {
    const pages = new Set<number>()
    const parts = range.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-')
        const start = Math.max(1, parseInt(startStr) || 1)
        const end = Math.min(total, parseInt(endStr) || total)
        for (let i = start; i <= end; i++) pages.add(i - 1)
      } else {
        const p = parseInt(trimmed)
        if (p >= 1 && p <= total) pages.add(p - 1)
      }
    }
    return Array.from(pages).sort((a, b) => a - b)
  }

  const applyWatermark = useCallback(async (forPreview = false) => {
    if (!pdfBytes) return null
    const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib')
    const doc = await PDFDocument.load(pdfBytes.slice(0))
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const pages = doc.getPages()
    const { r, g, b } = hexToRgb(color)
    const targetPages = applyAll
      ? pages.map((_, i) => i)
      : parsePageRange(pageRange, pages.length)

    for (const idx of targetPages) {
      const page = pages[idx]
      if (!page) continue
      const { width, height } = page.getSize()
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const textHeight = fontSize

      if (position === 'center') {
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(rotation),
        })
      } else if (position === 'diagonal') {
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(rotation),
        })
      } else if (position === 'tiled') {
        const spacingX = textWidth + 60
        const spacingY = textHeight + 80
        for (let tx = -width; tx < width * 2; tx += spacingX) {
          for (let ty = -height; ty < height * 2; ty += spacingY) {
            page.drawText(text, {
              x: tx,
              y: ty,
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity,
              rotate: degrees(rotation),
            })
          }
        }
      }
    }

    const savedBytes = await doc.save()
    return savedBytes
  }, [pdfBytes, text, fontSize, color, opacity, rotation, position, applyAll, pageRange])

  const generatePreview = useCallback(async () => {
    if (!pdfBytes || !text.trim()) return
    setPreviewLoading(true)
    try {
      const watermarkedBytes = await applyWatermark(true)
      if (!watermarkedBytes) return

      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: watermarkedBytes }).promise
      const page = await pdf.getPage(1)
      const scale = 1.5
      const viewport = page.getViewport({ scale })

      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      await page.render({ canvasContext: ctx, viewport }).promise
      setPreviewUrl(canvas.toDataURL())
    } catch {
      // preview failed silently
    }
    setPreviewLoading(false)
  }, [pdfBytes, applyWatermark, text])

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

  useEffect(() => {
    if (pdfBytes && text.trim()) {
      const timer = setTimeout(() => generatePreview(), 500)
      return () => clearTimeout(timer)
    }
  }, [pdfBytes, text, fontSize, color, opacity, rotation, position, generatePreview])

  const downloadWatermarked = async () => {
    if (!pdfBytes) return
    setProcessing(true)
    try {
      const watermarkedBytes = await applyWatermark()
      if (!watermarkedBytes) return
      const blob = new Blob([new Uint8Array(watermarkedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `watermarked-${file?.name || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      saveHistory({
        name: file?.name || 'document.pdf',
        watermarkText: text,
        position,
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Failed to apply watermark: ' + err.message)
    }
    setProcessing(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && pdfBytes && text.trim() && !processing) {
        e.preventDefault()
        downloadWatermarked()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBytes, text, processing])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Droplets size={28} /> PDF Watermark
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Add text watermarks to your PDF. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-xs font-bold">PDF</div>
              <span className="text-[10px] text-gray-500">Input</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">+</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-[#E8970A]/40 bg-[#E8970A]/5 flex items-center justify-center text-[#E8970A]/50 text-[9px] font-bold -rotate-45">DRAFT</div>
              <span className="text-[10px] text-gray-500">Stamp</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">PDF</div>
              <span className="text-[10px] text-green-400">Stamped</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Add watermark</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Control text, size, color, opacity, and position.
          </p>
        </div>

        {/* Upload */}
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

        {file && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Watermark Settings</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowShortcuts(!showShortcuts)} className="p-1.5 rounded text-gray-500 hover:text-gray-300" title="Keyboard shortcuts">
                    <Keyboard size={14} />
                  </button>
                  <button onClick={() => { setFile(null); setPdfBytes(null); setPreviewUrl(null); setPageCount(0) }} className="text-xs text-gray-400 hover:text-white">Change file</button>
                </div>
              </div>

              {/* File info */}
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="truncate">{file.name}</span>
                <span className="text-gray-700">|</span>
                <span>{formatBytes(file.size)}</span>
                {pageCount > 0 && (
                  <>
                    <span className="text-gray-700">|</span>
                    <span>{pageCount} pages</span>
                  </>
                )}
              </div>

              {showShortcuts && (
                <div className="bg-[#070510] border border-[#1A1726] rounded-lg p-3 text-xs space-y-1">
                  <p className="text-gray-400 font-medium mb-1">Keyboard Shortcuts</p>
                  <div className="flex justify-between text-gray-500">
                    <span>Download watermarked PDF</span>
                    <kbd className="bg-[#0F0D1A] px-1.5 py-0.5 rounded border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                  </div>
                </div>
              )}

              {/* Preset watermark texts */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEXTS.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => setText(preset.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        text === preset.value
                          ? 'bg-[#E8970A]/15 border-[#E8970A] text-[#E8970A]'
                          : 'border-[#1A1726] text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Watermark Text</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Font Size ({fontSize}px)</label>
                  <input type="range" min={10} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[#E8970A]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rotation ({rotation}&deg;)</label>
                  <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-[#E8970A]" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Color Presets</label>
                <div className="flex gap-2 mb-2">
                  {COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => setColor(preset.value)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                        color === preset.value
                          ? 'border-[#E8970A] bg-[#E8970A]/10'
                          : 'border-[#1A1726] hover:border-gray-500'
                      }`}
                      title={preset.label}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.value }} />
                      <span className="text-gray-400">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Custom Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
                    <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Position</label>
                <div className="flex gap-2">
                  {(['center', 'diagonal', 'tiled'] as Position[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${position === p ? 'bg-[#E8970A]/20 border-[#E8970A] text-[#E8970A]' : 'border-[#1A1726] text-gray-400 hover:text-white'}`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={applyAll} onChange={(e) => setApplyAll(e.target.checked)} className="accent-[#E8970A]" />
                  Apply to all pages
                </label>
                {!applyAll && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Page range (e.g. 1-3, 5)</label>
                    <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]" />
                  </div>
                )}
              </div>

              <button
                onClick={downloadWatermarked}
                disabled={processing || !text.trim()}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-sm bg-[#E8970A] text-black hover:bg-[#d18a09] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> {processing ? 'Processing...' : 'Download Watermarked PDF'}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                <Eye size={18} /> Preview (Page 1)
              </h2>

              {/* Mini preview of watermark settings */}
              <div className="bg-[#070510] border border-[#1A1726] rounded-lg p-3 mb-4 text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Text</span>
                  <span className="text-gray-300 font-mono">{text || '(empty)'}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Style</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: color }} />
                    <span className="text-gray-300">{fontSize}px, {Math.round(opacity * 100)}% opacity</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Layout</span>
                  <span className="text-gray-300 capitalize">{position}, {rotation}&deg;</span>
                </div>
              </div>

              <div className="flex items-center justify-center bg-[#070510] rounded-lg min-h-[400px] overflow-hidden relative">
                <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain" style={{ display: previewUrl ? 'block' : 'none' }} />
                {!previewUrl && !previewLoading && <p className="text-gray-500 text-sm">Generating preview...</p>}
                {previewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#070510]/80">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8970A] border-r-transparent" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">Preview updates automatically as you change settings</p>
            </div>
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
              <span>Recent watermarks ({history.length})</span>
              <span className="text-xs">{showHistory ? '(hide)' : '(show)'}</span>
            </button>
            {showHistory && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl divide-y divide-[#1A1726]">
                {history.map((entry, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-300 truncate">{entry.name}</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500">&quot;{entry.watermarkText}&quot;</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500 capitalize">{entry.position}</span>
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
