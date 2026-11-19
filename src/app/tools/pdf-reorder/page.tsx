'use client'

import { useState, useEffect } from 'react'


import { Upload, Download, ArrowUp, ArrowDown, Trash2, GripVertical, ListOrdered, Clock, Keyboard, ArrowUpToLine, ArrowDownToLine, RotateCcw } from 'lucide-react'

interface PageInfo {
  originalIndex: number
  thumbnail: string | null
}

interface HistoryEntry {
  name: string
  pages: number
  reorderedPages: number
  date: string
}

const HISTORY_KEY = 'pdf-reorder-history'

export default function PdfReorderPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [originalOrder, setOriginalOrder] = useState<PageInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
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

  const renderThumbnail = async (pdfjsLib: any, data: ArrayBuffer, pageNum: number): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise
    const page = await pdf.getPage(pageNum)
    const scale = 0.4
    const viewport = page.getViewport({ scale })
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
    try {
      const bytes = await f.arrayBuffer()
      setPdfBytes(bytes)
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise
      const total = pdf.numPages
      pdf.destroy()

      const infos: PageInfo[] = []
      for (let i = 0; i < total; i++) {
        const thumb = await renderThumbnail(pdfjsLib, bytes, i + 1)
        infos.push({ originalIndex: i, thumbnail: thumb })
      }
      setPages(infos)
      setOriginalOrder([...infos])
    } catch (err: any) {
      alert('Failed to load PDF: ' + err.message)
    }
    setLoading(false)
  }

  const moveUp = (idx: number) => {
    if (idx <= 0) return
    setPages(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  const moveDown = (idx: number) => {
    setPages(prev => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  const moveToStart = (idx: number) => {
    if (idx === 0) return
    setPages(prev => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.unshift(item)
      return next
    })
  }

  const moveToEnd = (idx: number) => {
    setPages(prev => {
      if (idx === prev.length - 1) return prev
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.push(item)
      return next
    })
  }

  const reverseOrder = () => {
    setPages(prev => [...prev].reverse())
  }

  const resetOrder = () => {
    if (originalOrder.length > 0) {
      setPages([...originalOrder])
    }
  }

  const deletePage = (idx: number) => {
    setPages(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== idx)
    })
  }

  // HTML5 drag and drop
  const onDragStartHTML = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOverHTML = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  const onDropHTML = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null) return
    if (dragIdx === idx) { setDragIdx(null); setOverIdx(null); return }
    setPages(prev => {
      const next = [...prev]
      const [dragged] = next.splice(dragIdx, 1)
      next.splice(idx, 0, dragged)
      return next
    })
    setDragIdx(null)
    setOverIdx(null)
  }

  const onDragEndHTML = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  // Count how many pages have moved from original position
  const movedCount = pages.filter((p, i) => p.originalIndex !== i).length

  const downloadReordered = async () => {
    if (!pdfBytes || pages.length === 0) return
    setProcessing(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(pdfBytes)
      const newDoc = await PDFDocument.create()
      const indices = pages.map(p => p.originalIndex)
      const copiedPages = await newDoc.copyPages(src, indices)
      copiedPages.forEach(p => newDoc.addPage(p))
      const savedBytes = await newDoc.save()
      const blob = new Blob([new Uint8Array(savedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reordered-${file?.name || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      saveHistory({
        name: file?.name || 'document.pdf',
        pages: pages.length,
        reorderedPages: movedCount,
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Failed to reorder PDF: ' + err.message)
    }
    setProcessing(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && pages.length > 0 && !processing) {
        e.preventDefault()
        downloadReordered()
      }
      if (e.key === 'r' && (e.metaKey || e.ctrlKey) && e.shiftKey && pages.length > 0) {
        e.preventDefault()
        reverseOrder()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, processing, pdfBytes, file])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <ListOrdered size={28} /> PDF Page Reorder
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Drag and drop to reorder pages, or delete unwanted pages. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex gap-1">
              <div className="w-8 h-10 rounded border border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-[10px] font-bold">1</div>
              <div className="w-8 h-10 rounded border border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-[10px] font-bold">2</div>
              <div className="w-8 h-10 rounded border border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-[10px] font-bold">3</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">2</div>
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">3</div>
              <div className="w-8 h-10 rounded border border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">1</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDF</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Drag to reorder</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Also allows deleting individual pages.
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">File: {file.name} ({pages.length} pages)</span>
                {movedCount > 0 && (
                  <span className="text-xs bg-[#E8970A]/15 text-[#E8970A] px-2 py-0.5 rounded-full">
                    {movedCount} page{movedCount !== 1 ? 's' : ''} moved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setFile(null); setPdfBytes(null); setPages([]) }} className="text-xs text-gray-500 hover:text-white">Change file</button>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={reverseOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1A1726] text-gray-400 hover:text-[#E8970A] hover:border-[#E8970A]/50 transition-colors"
              >
                <RotateCcw size={12} /> Reverse Order
              </button>
              <button
                onClick={resetOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1A1726] text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
              >
                <RotateCcw size={12} /> Reset Order
              </button>
              <button onClick={() => setShowShortcuts(!showShortcuts)} className="ml-auto px-3 py-1.5 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                <Keyboard size={12} />
              </button>
            </div>

            {showShortcuts && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1 mb-4">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Download reordered PDF</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Reverse page order</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Shift + R</kbd>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {pages.map((p, i) => (
                <div
                  key={`${p.originalIndex}-${i}`}
                  data-page-idx={i}
                  draggable
                  onDragStart={(e) => onDragStartHTML(e, i)}
                  onDragOver={(e) => onDragOverHTML(e, i)}
                  onDrop={(e) => onDropHTML(e, i)}
                  onDragEnd={onDragEndHTML}
                  className={`flex items-center gap-3 bg-[#0F0D1A] border rounded-xl p-3 transition-all cursor-grab active:cursor-grabbing ${
                    overIdx === i && dragIdx !== null && dragIdx !== i
                      ? 'border-[#E8970A] bg-[#E8970A]/5'
                      : dragIdx === i
                      ? 'border-[#E8970A]/50 opacity-50'
                      : 'border-[#1A1726]'
                  }`}
                >
                  <GripVertical size={18} className="text-gray-600 flex-shrink-0" />
                  {/* Page number badge */}
                  <div className="w-8 h-8 rounded-lg bg-[#E8970A]/10 border border-[#E8970A]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E8970A] text-sm font-bold">{i + 1}</span>
                  </div>
                  <div className="w-12 h-16 bg-[#070510] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={`Page ${i + 1}`} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8970A] border-r-transparent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Page {i + 1}</p>
                    <p className="text-xs text-gray-500">
                      Original page {p.originalIndex + 1}
                      {p.originalIndex !== i && (
                        <span className="text-[#E8970A] ml-1">(moved)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveToStart(i)} disabled={i === 0} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move to start">
                      <ArrowUpToLine size={14} />
                    </button>
                    <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move up">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveDown(i)} disabled={i === pages.length - 1} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move down">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => moveToEnd(i)} disabled={i === pages.length - 1} className="p-1.5 rounded border border-[#1A1726] hover:border-[#E8970A] text-gray-400 hover:text-[#E8970A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move to end">
                      <ArrowDownToLine size={14} />
                    </button>
                    <div className="w-px h-6 bg-[#1A1726] mx-0.5" />
                    <button onClick={() => deletePage(i)} disabled={pages.length <= 1} className="p-1.5 rounded border border-[#1A1726] hover:border-red-500 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Delete page">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={downloadReordered}
              disabled={processing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#E8970A] text-black hover:bg-[#d18a09] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} /> {processing ? 'Processing...' : 'Download Reordered PDF'}
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
              <span>Recent reorders ({history.length})</span>
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
                      <span className="text-gray-500">{entry.reorderedPages} moved</span>
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
