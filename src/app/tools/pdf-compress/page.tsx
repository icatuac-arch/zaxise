'use client'

import { useState, useEffect } from 'react'


import { Upload, Download, FileText, Loader2, Clock, Keyboard, Zap } from 'lucide-react'

declare global {
  interface Window {
    pdfjsLib?: any
  }
}

interface HistoryEntry {
  name: string
  originalSize: number
  compressedSize: number
  savedPercent: number
  level: string
  date: string
}

const HISTORY_KEY = 'pdf-compress-history'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

type CompressionLevel = 'light' | 'medium' | 'heavy'

const COMPRESSION_PRESETS: Record<CompressionLevel, { quality: number; scale: number; label: string; description: string }> = {
  light: { quality: 0.85, scale: 2, label: 'Light', description: 'Minor size reduction, best quality' },
  medium: { quality: 0.7, scale: 1.5, label: 'Medium', description: 'Good balance of size and quality' },
  heavy: { quality: 0.45, scale: 1, label: 'Heavy', description: 'Maximum compression, lower quality' },
}

export default function PdfCompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [compressed, setCompressed] = useState<Blob | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressPercent, setProgressPercent] = useState(0)
  const [quality, setQuality] = useState(0.7)
  const [scale, setScale] = useState(1.5)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium')
  const [usePreset, setUsePreset] = useState(true)
  const [pageCount, setPageCount] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const [libReady, setLibReady] = useState(false)

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.pdfjsLib) { setLibReady(true); return }

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
    setCompressed(null)
    setPageCount(0)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      setPageCount(pdf.getPageCount())
    } catch {}
  }

  const applyPreset = (level: CompressionLevel) => {
    setCompressionLevel(level)
    setUsePreset(true)
    const preset = COMPRESSION_PRESETS[level]
    setQuality(preset.quality)
    setScale(preset.scale)
  }

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    setCompressed(null)
    setProgressPercent(0)
    try {
      if (!window.pdfjsLib) { alert('PDF library still loading'); setProcessing(false); return }
      const { PDFDocument } = await import('pdf-lib')

      const effectiveQuality = usePreset ? COMPRESSION_PRESETS[compressionLevel].quality : quality
      const effectiveScale = usePreset ? COMPRESSION_PRESETS[compressionLevel].scale : scale

      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const newPdf = await PDFDocument.create()

      for (let i = 1; i <= sourcePdf.numPages; i++) {
        setProgress(`Compressing page ${i} of ${sourcePdf.numPages}...`)
        setProgressPercent(Math.round((i / sourcePdf.numPages) * 100))
        const page = await sourcePdf.getPage(i)
        const viewport = page.getViewport({ scale: effectiveScale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise

        const jpegBlob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', effectiveQuality))
        const jpegBytes = await jpegBlob.arrayBuffer()
        const img = await newPdf.embedJpg(jpegBytes)

        const newPage = newPdf.addPage([viewport.width / effectiveScale, viewport.height / effectiveScale])
        newPage.drawImage(img, {
          x: 0,
          y: 0,
          width: newPage.getWidth(),
          height: newPage.getHeight(),
        })
      }

      const bytes = await newPdf.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      setCompressed(blob)

      const savedPercent = Math.round((1 - blob.size / file.size) * 100)
      saveHistory({
        name: file.name,
        originalSize: file.size,
        compressedSize: blob.size,
        savedPercent,
        level: usePreset ? compressionLevel : 'custom',
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Failed: ' + err.message)
    }
    setProgress('')
    setProgressPercent(0)
    setProcessing(false)
  }

  const download = () => {
    if (!compressed || !file) return
    const url = URL.createObjectURL(compressed)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed-${file.name}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && file && !processing) {
        e.preventDefault()
        compress()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, processing, compressionLevel, quality, scale, usePreset])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FileText size={28} /> PDF Compress
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Reduce PDF file size by re-rendering pages as compressed images. Great for sharing event programs and brochures.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center text-red-400 text-xs font-bold">PDF<br/><span className="text-[8px]">5 MB</span></div>
              <span className="text-[10px] text-gray-500">Large</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-11 h-13 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">PDF<br/><span className="text-[8px]">1 MB</span></div>
              <span className="text-[10px] text-green-400">Smaller</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Compress</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download smaller file</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Reduces file size while maintaining readability.
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
                  <span>Original: {formatBytes(file.size)}</span>
                  {pageCount > 0 && (
                    <>
                      <span className="text-gray-700">|</span>
                      <span>{pageCount} pages</span>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => { setFile(null); setCompressed(null); setPageCount(0) }} className="text-gray-400 hover:text-white text-sm">Change</button>
            </div>

            {/* Compression Level Presets */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-300 font-medium">Compression Level</label>
                <button
                  onClick={() => setUsePreset(!usePreset)}
                  className="text-xs text-gray-500 hover:text-[#E8970A]"
                >
                  {usePreset ? 'Show advanced settings' : 'Use presets'}
                </button>
              </div>

              {usePreset ? (
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(COMPRESSION_PRESETS) as [CompressionLevel, typeof COMPRESSION_PRESETS[CompressionLevel]][]).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        compressionLevel === key
                          ? 'bg-[#E8970A]/15 border-[#E8970A] text-[#E8970A]'
                          : 'border-[#1A1726] text-gray-400 hover:border-[#E8970A]/50 hover:text-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">{preset.label}</div>
                      <div className="text-xs mt-1 opacity-70">{preset.description}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">JPEG quality: {Math.round(quality * 100)}%</label>
                    <input type="range" min="0.3" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-[#E8970A]" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>30% (smallest)</span>
                      <span>70% (recommended)</span>
                      <span>100% (largest)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Render scale: {scale}x</label>
                    <input type="range" min="1" max="3" step="0.25" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-[#E8970A]" />
                    <div className="text-xs text-gray-600 mt-1">Higher = sharper but larger</div>
                  </div>
                </div>
              )}
            </div>

            {/* Compression progress */}
            {processing && (
              <div className="bg-[#0F0D1A] border border-[#E8970A]/30 rounded-xl p-4">
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

            {/* Results */}
            {compressed && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Original</div>
                    <div className="text-white font-semibold">{formatBytes(file.size)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Compressed</div>
                    <div className="text-white font-semibold">{formatBytes(compressed.size)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Saved</div>
                    <div className={`font-semibold ${compressed.size < file.size ? 'text-green-400' : 'text-red-400'}`}>
                      {compressed.size < file.size
                        ? `${Math.round((1 - compressed.size / file.size) * 100)}%`
                        : `+${Math.round((compressed.size / file.size - 1) * 100)}%`
                      }
                    </div>
                  </div>
                </div>

                {/* Visual size comparison bar */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Size comparison</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">Original</span>
                      <div className="flex-1 bg-[#070510] rounded-full h-3">
                        <div className="bg-red-500/40 h-3 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">Compressed</span>
                      <div className="flex-1 bg-[#070510] rounded-full h-3">
                        <div
                          className="bg-green-500/60 h-3 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.round((compressed.size / file.size) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {compressed.size >= file.size && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
                    The compressed file is larger than the original. Try using a heavier compression level or lower quality settings.
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <button onClick={compress} disabled={processing || !libReady} className="px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                {processing ? <><Loader2 size={14} className="inline mr-1 animate-spin" />{progress}</> : 'Compress PDF'}
              </button>
              {compressed && (
                <button onClick={download} className="px-5 py-2.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30">
                  <Download size={14} className="inline mr-1" />Download
                </button>
              )}
              <button onClick={() => setShowShortcuts(!showShortcuts)} className="ml-auto px-3 py-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                <Keyboard size={14} />
              </button>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Compress PDF</span>
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
              <span>Recent compressions ({history.length})</span>
              <span className="text-xs">{showHistory ? '(hide)' : '(show)'}</span>
            </button>
            {showHistory && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl divide-y divide-[#1A1726]">
                {history.map((entry, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-300 truncate max-w-[150px]">{entry.name}</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-500">{formatBytes(entry.originalSize)} &rarr; {formatBytes(entry.compressedSize)}</span>
                      <span className="text-gray-600">|</span>
                      <span className={`font-medium ${entry.savedPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>{entry.savedPercent}% saved</span>
                      <span className="text-xs text-gray-600 capitalize">({entry.level})</span>
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap ml-2">{entry.date}</span>
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
