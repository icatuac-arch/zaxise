'use client'

import { useState, useEffect, useCallback } from 'react'


import { Upload, Download, FilePlus, X, GripVertical, Trash2, Clock, FileText, Keyboard } from 'lucide-react'

interface PDFItem {
  id: string
  file: File
  pageCount: number | null
}

interface HistoryEntry {
  name: string
  size: number
  fileCount: number
  totalPages: number
  date: string
}

const HISTORY_KEY = 'pdf-merge-history'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfMergePage() {
  const [items, setItems] = useState<PDFItem[]>([])
  const [merging, setMerging] = useState(false)
  const [mergeProgress, setMergeProgress] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [totalMergedPages, setTotalMergedPages] = useState<number | null>(null)

  // Load history from localStorage
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

  const addFiles = async (files: FileList | File[]) => {
    const { PDFDocument } = await import('pdf-lib')
    const newItems: PDFItem[] = []
    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') continue
      let pageCount: number | null = null
      try {
        const bytes = await file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        pageCount = pdf.getPageCount()
      } catch {}
      newItems.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, pageCount })
    }
    setItems(prev => [...prev, ...newItems])
    setTotalMergedPages(null)
  }

  const move = (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return
    const next = [...items]
    if (dir === 'up' && idx > 0) {
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
    } else if (dir === 'down' && idx < items.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    }
    setItems(next)
  }

  const merge = async () => {
    if (items.length < 2) return
    setMerging(true)
    setMergeProgress('')
    setTotalMergedPages(null)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx]
        setMergeProgress(`Processing file ${idx + 1} of ${items.length}: ${item.file.name}`)
        const bytes = await item.file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      setMergeProgress('Saving merged PDF...')
      const mergedBytes = await merged.save()
      const totalPages = merged.getPageCount()
      setTotalMergedPages(totalPages)
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `merged-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      // Save to history
      saveHistory({
        name: `merged-${items.length}-files.pdf`,
        size: blob.size,
        fileCount: items.length,
        totalPages,
        date: new Date().toLocaleString(),
      })
    } catch (err: any) {
      alert('Merge failed: ' + err.message)
    }
    setMergeProgress('')
    setMerging(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && e.shiftKey) {
        e.preventDefault()
        setItems([])
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && items.length >= 2 && !merging) {
        e.preventDefault()
        merge()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, merging])

  const totalFileSize = items.reduce((sum, i) => sum + i.file.size, 0)
  const totalPages = items.reduce((sum, i) => sum + (i.pageCount || 0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FilePlus size={28} /> PDF Merge
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Combine multiple PDFs into one file. Drag to reorder. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-xs font-bold">PDF</div>
              <span className="text-[10px] text-gray-500">File 1</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-xs font-bold">PDF</div>
              <span className="text-[10px] text-gray-500">File 2</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">PDF</div>
              <span className="text-[10px] text-green-400">Merged</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload PDFs</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Drag to reorder</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download merged file</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Works with any number of PDFs. No file size limit.
          </p>
        </div>

        <div className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8 mb-4">
          <label className="block text-center cursor-pointer">
            <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files) }} />
            <Upload size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-white font-medium">Drop PDFs here or click to add</p>
            <p className="text-xs text-gray-500 mt-1">Files will be merged in the order shown below</p>
          </label>
        </div>

        {items.length > 0 && (
          <>
            {/* Summary bar */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 mb-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <FileText size={14} className="text-gray-500" />
                <span className="text-gray-400">{items.length} file{items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="text-gray-600">|</div>
              <div className="text-gray-400">
                {totalPages > 0 ? `${totalPages} total pages` : 'Counting pages...'}
              </div>
              <div className="text-gray-600">|</div>
              <div className="text-gray-400">{formatBytes(totalFileSize)} total</div>
              {totalMergedPages !== null && (
                <>
                  <div className="text-gray-600">|</div>
                  <div className="text-green-400 font-medium">Merged: {totalMergedPages} pages</div>
                </>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={item.id} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => move(item.id, 'up')} disabled={i === 0} className="text-gray-500 hover:text-white disabled:opacity-30">&#9650;</button>
                    <button onClick={() => move(item.id, 'down')} disabled={i === items.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30">&#9660;</button>
                  </div>
                  <GripVertical size={16} className="text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{i + 1}. {item.file.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{formatBytes(item.file.size)}</span>
                      {item.pageCount !== null && (
                        <>
                          <span className="text-gray-700">|</span>
                          <span>{item.pageCount} page{item.pageCount !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setItems(items.filter(x => x.id !== item.id)); setTotalMergedPages(null) }} className="p-2 text-gray-400 hover:text-red-400"><X size={16} /></button>
                </div>
              ))}
            </div>

            {/* Merge progress */}
            {merging && mergeProgress && (
              <div className="mb-4 bg-[#0F0D1A] border border-[#E8970A]/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8970A] border-r-transparent flex-shrink-0" />
                  <span className="text-sm text-[#E8970A]">{mergeProgress}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button onClick={merge} disabled={items.length < 2 || merging} className="px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                {merging ? 'Merging...' : `Merge ${items.length} PDFs`}
              </button>
              <button onClick={() => { setItems([]); setTotalMergedPages(null) }} className="px-5 py-2 rounded-lg text-gray-400 border border-[#1A1726] hover:border-red-500/50 hover:text-red-400 flex items-center gap-1.5">
                <Trash2 size={14} /> Clear All
              </button>
              <button onClick={() => setShowShortcuts(!showShortcuts)} className="ml-auto px-3 py-2 rounded-lg text-gray-500 border border-[#1A1726] hover:text-gray-300" title="Keyboard shortcuts">
                <Keyboard size={14} />
              </button>
            </div>

            {showShortcuts && (
              <div className="mt-3 bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-sm space-y-1">
                <p className="text-gray-400 font-medium mb-2">Keyboard Shortcuts</p>
                <div className="flex justify-between text-gray-500">
                  <span>Merge files</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Ctrl/Cmd + Enter</kbd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Clear all files</span>
                  <kbd className="bg-[#070510] px-2 py-0.5 rounded text-xs border border-[#1A1726]">Shift + Delete</kbd>
                </div>
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
              <span>Recent merges ({history.length})</span>
              <span className="text-xs">{showHistory ? '(hide)' : '(show)'}</span>
            </button>
            {showHistory && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl divide-y divide-[#1A1726]">
                {history.map((entry, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-300">{entry.fileCount} files merged</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500">{entry.totalPages} pages</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-500">{formatBytes(entry.size)}</span>
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
