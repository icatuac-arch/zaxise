'use client'

import { useState } from 'react'


import { Upload, Download, FileText, X, GripVertical } from 'lucide-react'

interface ImgItem {
  id: string
  file: File
  url: string
}

const PAGE_SIZES: Record<string, { width: number; height: number; label: string }> = {
  A4: { width: 595, height: 842, label: 'A4 (210x297mm)' },
  Letter: { width: 612, height: 792, label: 'US Letter (8.5x11in)' },
  Legal: { width: 612, height: 1008, label: 'US Legal (8.5x14in)' },
  A3: { width: 842, height: 1191, label: 'A3 (297x420mm)' },
  A5: { width: 420, height: 595, label: 'A5 (148x210mm)' },
  Auto: { width: 0, height: 0, label: 'Fit to image' },
}

const MARGIN_PRESETS = [
  { label: 'None', value: 0 },
  { label: 'Small', value: 20 },
  { label: 'Medium', value: 40 },
  { label: 'Large', value: 72 },
]

export default function ImageToPdfPage() {
  const [items, setItems] = useState<ImgItem[]>([])
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [margin, setMargin] = useState(20)
  const [processing, setProcessing] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)

  const addFiles = (files: FileList | File[]) => {
    const newItems: ImgItem[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      newItems.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, url: URL.createObjectURL(file) })
    }
    setItems(prev => [...prev, ...newItems])
  }

  const move = (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return
    const next = [...items]
    if (dir === 'up' && idx > 0) [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
    if (dir === 'down' && idx < items.length - 1) [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setItems(next)
  }

  const generate = async () => {
    if (items.length === 0) return
    setProcessing(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const pdf = await PDFDocument.create()

      for (const item of items) {
        const bytes = await item.file.arrayBuffer()
        let img
        if (item.file.type === 'image/png') {
          img = await pdf.embedPng(bytes)
        } else if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          img = await pdf.embedJpg(bytes)
        } else {
          // Convert to PNG via canvas
          const blobUrl = URL.createObjectURL(item.file)
          const imgEl = new Image()
          await new Promise<void>(resolve => { imgEl.onload = () => resolve(); imgEl.src = blobUrl })
          const canvas = document.createElement('canvas')
          canvas.width = imgEl.width
          canvas.height = imgEl.height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(imgEl, 0, 0)
          const pngBlob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/png'))
          const pngBytes = await pngBlob.arrayBuffer()
          img = await pdf.embedPng(pngBytes)
          URL.revokeObjectURL(blobUrl)
        }

        let pageWidth, pageHeight
        if (pageSize === 'Auto') {
          pageWidth = img.width + margin * 2
          pageHeight = img.height + margin * 2
        } else {
          const size = PAGE_SIZES[pageSize]
          pageWidth = orientation === 'portrait' ? size.width : size.height
          pageHeight = orientation === 'portrait' ? size.height : size.width
        }

        const page = pdf.addPage([pageWidth, pageHeight])
        const availW = pageWidth - margin * 2
        const availH = pageHeight - margin * 2
        const ratio = Math.min(availW / img.width, availH / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        page.drawImage(img, {
          x: (pageWidth - w) / 2,
          y: (pageHeight - h) / 2,
          width: w,
          height: h,
        })
      }

      const bytes = await pdf.save()
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `images-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      alert('Failed: ' + err.message)
    }
    setProcessing(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FileText size={28} /> Image to PDF
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Combine multiple images into a single PDF document. Perfect for event flyers, programs, and brochures.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">&#128444;</div>
              <span className="text-[10px] text-gray-500">Image</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center text-red-400 text-xs font-bold">PDF</div>
              <span className="text-[10px] text-red-400">Output</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload images</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Arrange order</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download PDF</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Combine multiple images into one PDF.
          </p>
        </div>

        <div className="bg-[#0F0D1A] border-2 border-dashed border-[#1A1726] rounded-xl p-8 mb-4">
          <label className="block text-center cursor-pointer">
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files) }} />
            <Upload size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-white font-medium">Drop images or click to add</p>
            <p className="text-xs text-gray-500 mt-1">Multiple files · Reorder before generating</p>
          </label>
        </div>

        {items.length > 0 && (
          <>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Page size</label>
                <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
                  {Object.entries(PAGE_SIZES).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Orientation</label>
                <select value={orientation} onChange={(e) => setOrientation(e.target.value as any)} disabled={pageSize === 'Auto'} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm disabled:opacity-50">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Margin: {margin}px</label>
                <input type="range" min="0" max="100" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                <div className="flex gap-1.5 mt-2">
                  {MARGIN_PRESETS.map(m => (
                    <button
                      key={m.label}
                      onClick={() => setMargin(m.value)}
                      className={`flex-1 py-1 rounded text-xs ${margin === m.value ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-400'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={item.id} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex items-center gap-3">
                  <div className="flex flex-col">
                    <button onClick={() => move(item.id, 'up')} disabled={i === 0} className="text-gray-500 hover:text-white disabled:opacity-30">▲</button>
                    <button onClick={() => move(item.id, 'down')} disabled={i === items.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30">▼</button>
                  </div>
                  <GripVertical size={14} className="text-gray-600" />
                  <img src={item.url} alt="" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">Page {i + 1}: {item.file.name}</div>
                    <div className="text-xs text-gray-500">{(item.file.size / 1024).toFixed(0)} KB</div>
                  </div>
                  <button onClick={() => setItems(items.filter(x => x.id !== item.id))} className="p-2 text-gray-400 hover:text-red-400"><X size={16} /></button>
                </div>
              ))}
            </div>

            {/* Page Preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-white mb-3">Page Preview</h3>
              <div className="flex items-center gap-4">
                <div
                  className="relative bg-white rounded shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{
                    width: (() => {
                      if (pageSize === 'Auto') return 150
                      const size = PAGE_SIZES[pageSize]
                      const pw = orientation === 'portrait' ? size.width : size.height
                      const ph = orientation === 'portrait' ? size.height : size.width
                      const scale = 200 / Math.max(pw, ph)
                      return Math.round(pw * scale)
                    })(),
                    height: (() => {
                      if (pageSize === 'Auto') return 200
                      const size = PAGE_SIZES[pageSize]
                      const pw = orientation === 'portrait' ? size.width : size.height
                      const ph = orientation === 'portrait' ? size.height : size.width
                      const scale = 200 / Math.max(pw, ph)
                      return Math.round(ph * scale)
                    })(),
                  }}
                >
                  {items[previewIdx] && (
                    <img
                      src={items[previewIdx].url}
                      alt=""
                      className="object-contain"
                      style={{
                        maxWidth: `calc(100% - ${margin * 0.3}px)`,
                        maxHeight: `calc(100% - ${margin * 0.3}px)`,
                      }}
                    />
                  )}
                  {/* Margin indicator */}
                  <div className="absolute inset-0 border-2 border-dashed border-blue-300/30 pointer-events-none" style={{ margin: `${margin * 0.15}px` }} />
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Page {previewIdx + 1} of {items.length}</p>
                  <p>{pageSize === 'Auto' ? 'Fit to image' : `${PAGE_SIZES[pageSize].label}`}</p>
                  <p>{orientation === 'portrait' ? 'Portrait' : 'Landscape'}</p>
                  <p>Margin: {margin}px</p>
                  {items.length > 1 && (
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))}
                        disabled={previewIdx === 0}
                        className="px-2 py-1 rounded bg-[#070510] border border-[#1A1726] text-gray-400 disabled:opacity-30"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setPreviewIdx(Math.min(items.length - 1, previewIdx + 1))}
                        disabled={previewIdx >= items.length - 1}
                        className="px-2 py-1 rounded bg-[#070510] border border-[#1A1726] text-gray-400 disabled:opacity-30"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={generate} disabled={processing} className="px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                <Download size={16} className="inline mr-1" />
                {processing ? 'Generating PDF...' : `Create PDF (${items.length} page${items.length === 1 ? '' : 's'})`}
              </button>
              <button onClick={() => setItems([])} className="ml-auto px-5 py-2.5 rounded-lg text-gray-400 border border-[#1A1726]">Clear</button>
            </div>
          </>
        )}
      </main>
      
    </div>
  )
}
