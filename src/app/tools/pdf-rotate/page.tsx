'use client'

import { useState, useEffect, useCallback } from 'react'


import { Upload, Download, RotateCw, RotateCcw, FlipVertical, Clock, Keyboard, RotateCcwSquare, Undo2 } from 'lucide-react'

interface PageInfo {
  index: number
  rotation: number
  thumbnail: string | null
}

interface HistoryEntry {
  name: string
  pages: number
  rotatedCount: number
  date: string
}

const HISTORY_KEY = 'pdf-rotate-history'

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())

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

  const renderThumbnail = async (pdfjsLib: any, data: ArrayBuffer, pageNum: number, rot: number): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise
    const page = await pdf.getPage(pageNum)
    const scale = 0.5
    const viewport = page.getViewport({ scale, rotation: rot })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    const url = canvas.toDataURL()
    pdf.destroy()
    return url
  }

  const handleFile = async (f: File) => {
    if (f.type !== 'application/pdf') return
    setFile(f)
    setLoading(true)
    setSelectedPages(new Set())
    try {
      const bytes = await f.arrayBuffer()
      setPdfBytes(bytes)
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise
      const total = pdf.numPages
      pdf.destroy()

      const infos: PageInfo[] = []
      for (let i = 0; i < total; i++) {
        const thumb = await renderThumbnail(pdfjsLib, bytes, i + 1, 0)
        infos.push({ index: i, rotation: 0, thumbnail: thumb })
      }
      setPages(infos)
    } catch (err: any) {
      alert('Failed to load PDF: ' + err.message)
    }
    setLoading(false)
  }

  const rotatePage = useCallback(async (idx: number, angle: number) => {
    if (!pdfBytes) return
    setPages(prev => {
      const next = [...prev]
      const p = next[idx]
      const newRot = ((p.rotation + angle) % 360 + 360) % 360
      next[idx] = { ...p, rotation: newRot }
      return next
    })
  }, [pdfBytes])

  // regenerate thumbnails when rotation changes
  useEffect(() => {
    if (!pdfBytes) return
    let cancelled = false
    const regen = async () => {
      const pdfjsLib = await loadPdfJs()
      for (let i = 0; i < pages.length; i++) {
        if (cancelled) return
        const p = pages[i]
        const thumb = await renderThumbnail(pdfjsLib, pdfBytes, p.index + 1, p.rotation)
        if (cancelled) return
        setPages(prev => {
          const next = [...prev]
          if (next[i] && next[i].rotation === p.rotation) {
            next[i] = { ...next[i], thumbnail: thumb }
          }
          return next
        })
      }
    }
    regen()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBytes, pages.map(p => p.rotation).join(',')])

  const rotateAll = (angle: number) => {
    setPages(prev => prev.map(p => ({
      ...p,
      rotation: ((p.rotation + angle) % 360 + 360) % 360,
      thumbnail: null,
    })))
  }

  const resetAll = () => {
    setPages(prev => prev.map(p => ({
      ...p,
      rotation: 0,
      thumbnail: null,
    })))
  }

  const rotatedPageCount = pages.filter(p => p.rotation !== 0).length

  const getRotationBadgeColor = (rotation: number) => {
    if (rotation === 0) return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    if (rotation === 90) return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    if (rotation === 180) return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    if (rotation === 270) return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    return 'text-[#E8970A] bg-[#E8970A]/10 border-[#E8970A]/30'
  }

  const downloadRotated = async () => {
    if (!pdfBytes) return
    setProcessing(true)
    try {
      const { PDFDocument, degrees } = await import('pdf-lib')
      const doc = await PDFDocument.load(pdfBytes)
      const pdfPages = doc.getPages()
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].rotation !== 0) {
          const page = pdfPages[pages[i].index]
          const current = page.getRotation().angle
          page.setRotation(degrees(current + pages[i].rotation))
        }
      }
      const savedBytes = await doc.save()
      const blob = new Blob([new Uint8Array(savedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rotated-${file?.name || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      saveHistory({
        name: file?.name || 'document.pdf',
        pages: pages.length,
        rotatedCount: rotatedPageCount,
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Failed to rotate PDF: ' + err.message)
    }
    setProcessing(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && pages.length > 0 && !processing) {
        e.preventDefault()
        downloadRotated()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, processing, pdfBytes, file])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <RotateCw size={28} /> PDF Page Rotate
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Rotate individual or all pages in your PDF. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-xs font-bold">PDF</div>
              <span className="text-[10px] text-gray-500">Page</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&#8635;</span>
              <span className="text-[10px] text-gray-500">90&deg;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-12 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">PDF</div>
              <span className="text-[10px] text-green-400">Rotated</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Select pages to rotate</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Rotate individual pages or all at once.
          </p>
        </div>

        {!file && (
          <div
            className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8"
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
            <p className="text-gray-400 mt-3">Loading pages...</p>
          </div>
        )}

        {file && !loading && pages.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">File: {file.name} ({pages.length} pages)</span>
                {rotatedPageCount > 0 && (
                  <span className="text-xs bg-[#E8970A]/15 text-[#E8970A] px-2 py-0.5 rounded-full">
                    {rotatedPageCount} page{rotatedPageCount !== 1 ? 's' : ''} rotated
                  </span>
                )}
                <button onClick={() => { setFile(null); setPdfBytes(null); setPages([]) }} className="text-xs text-gray-500 hover:text-white ml-2">Change</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-1">Rotate All:</span>
                <button onClick={() => rotateAll(-90)} className="p-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="Rotate all 90 CCW">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => rotateAll(90)} className="p-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="Rotate all 90 CW">
                  <RotateCw size={16} />
                </button>
                <button onClick={() => rotateAll(180)} className="p-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="Rotate all 180">
                  <FlipVertical size={16} />
                </button>
                <div className="w-px h-6 bg-[#1A1726] mx-1" />
                <button onClick={resetAll} className="p-2 rounded-lg border border-[#1A1726] hover:border-orange-500 text-gray-400 hover:text-orange-400 transition-colors" title="Reset all rotations">
                  <Undo2 size={16} />
                </button>
                <button onClick={() => setShowShortcuts(!showShortcuts)} className="p-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                  <Keyboard size={14} />
                </button>
              </div>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1 mb-4">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Download rotated PDF</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {pages.map((p, i) => (
                <div key={i} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex flex-col items-center">
                  <div className="bg-[#070510] rounded-lg w-full aspect-[3/4] flex items-center justify-center overflow-hidden mb-2">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={`Page ${i + 1}`} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#E8970A] border-r-transparent" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Page {i + 1}</p>
                  {/* Rotation badge */}
                  <span className={`text-xs px-2 py-0.5 rounded-full border mb-2 ${getRotationBadgeColor(p.rotation)}`}>
                    {p.rotation === 0 ? 'No rotation' : `${p.rotation}\u00B0`}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => rotatePage(i, -90)} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="90 CCW">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => rotatePage(i, 90)} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="90 CW">
                      <RotateCw size={14} />
                    </button>
                    <button onClick={() => rotatePage(i, 180)} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] transition-colors" title="180">
                      <FlipVertical size={14} />
                    </button>
                    {p.rotation !== 0 && (
                      <button
                        onClick={() => setPages(prev => {
                          const next = [...prev]
                          next[i] = { ...next[i], rotation: 0, thumbnail: null }
                          return next
                        })}
                        className="p-1.5 rounded border border-[#1A1726] hover:border-orange-500 text-gray-400 hover:text-orange-400 transition-colors"
                        title="Reset rotation"
                      >
                        <Undo2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={downloadRotated}
              disabled={processing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#E8970A] text-black hover:bg-[#d18a09] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} /> {processing ? 'Processing...' : 'Download Rotated PDF'}
            </button>
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
              <span>Recent rotations ({history.length})</span>
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
                      <span className="text-gray-500">{entry.rotatedCount} rotated</span>
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
