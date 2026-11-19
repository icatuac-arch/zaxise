'use client'

import { useState, useEffect } from 'react'


import { Upload, Download, RefreshCw, X, Image as ImageIcon } from 'lucide-react'

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
  { value: 'image/avif', label: 'AVIF', ext: 'avif' },
]

interface ConvItem {
  id: string
  file: File
  url: string
  converted?: Blob
  convertedUrl?: string
  status: 'pending' | 'done' | 'error'
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function savingsPercent(original: number, converted: number) {
  if (original === 0) return '0'
  const pct = ((original - converted) / original) * 100
  return pct.toFixed(1)
}

function checkAvifSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    canvas.toBlob(
      (blob) => resolve(blob !== null && blob.size > 0),
      'image/avif',
      0.5
    )
  })
}

export default function ImageConvertPage() {
  const [items, setItems] = useState<ConvItem[]>([])
  const [targetFormat, setTargetFormat] = useState('image/webp')
  const [quality, setQuality] = useState(0.9)
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [avifSupported, setAvifSupported] = useState(true)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    checkAvifSupport().then(setAvifSupported)
  }, [])

  const availableFormats = FORMATS.filter(f => f.value !== 'image/avif' || avifSupported)

  const addFiles = (files: FileList | File[]) => {
    const newItems: ConvItem[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
        status: 'pending',
      })
    }
    setItems(prev => [...prev, ...newItems])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }

  const convert = async () => {
    setProcessing(true)
    for (const item of items) {
      if (item.status === 'done') continue
      try {
        const img = new Image()
        img.src = item.url
        await new Promise<void>(resolve => { img.onload = () => resolve() })
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        // White background for JPEG
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0)
        const blob: Blob = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b!), targetFormat, quality)
        )
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, converted: blob, convertedUrl: URL.createObjectURL(blob), status: 'done' } : p))
      } catch {
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'error' } : p))
      }
    }
    setProcessing(false)
  }

  const download = (item: ConvItem) => {
    if (!item.converted) return
    const ext = FORMATS.find(f => f.value === targetFormat)?.ext || 'png'
    const baseName = item.file.name.replace(/\.[^.]+$/, '')
    const url = URL.createObjectURL(item.converted)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseName}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    for (const item of items.filter(i => i.converted)) {
      download(item)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  const totalOriginal = items.reduce((s, i) => s + i.file.size, 0)
  const totalConverted = items.filter(i => i.converted).reduce((s, i) => s + (i.converted?.size || 0), 0)
  const doneCount = items.filter(i => i.status === 'done').length

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <RefreshCw size={28} /> Image Converter
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Convert images between PNG, JPG, WebP{avifSupported ? ', and AVIF' : ''} formats. Batch supported.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">JPG</div>
              <span className="text-[10px] text-gray-500">Input</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-purple-500/60 bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-bold">PNG</div>
              <span className="text-[10px] text-gray-500">Output</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">WebP</div>
              <span className="text-[10px] text-gray-500">Output</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Choose format</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Converts between JPG, PNG, WebP, and more.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`bg-[#0F0D1A] border-2 border-dashed rounded-xl p-8 mb-4 transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/5' : 'border-[#1A1726]'}`}
        >
          <label className="block text-center cursor-pointer">
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files) }} />
            <Upload size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-white font-medium">Drag and drop or click to add images</p>
            <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, WebP{avifSupported ? ', AVIF' : ''} and more</p>
          </label>
        </div>

        {items.length > 0 && (
          <>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Convert to</label>
                <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
                  {availableFormats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Quality: {Math.round(quality * 100)}%</label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-[#E8970A]" />
              </div>
            </div>

            {/* Size Summary */}
            {doneCount > 0 && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Original Total</div>
                  <div className="text-lg font-bold text-white mt-1">{formatBytes(totalOriginal)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Converted Total</div>
                  <div className="text-lg font-bold text-white mt-1">{formatBytes(totalConverted)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Savings</div>
                  <div className={`text-lg font-bold mt-1 ${totalConverted < totalOriginal ? 'text-green-400' : 'text-red-400'}`}>
                    {totalConverted < totalOriginal ? '-' : '+'}{Math.abs(parseFloat(savingsPercent(totalOriginal, totalConverted)))}%
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4 flex-wrap">
              <button onClick={convert} disabled={processing} className="px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                {processing ? 'Converting...' : `Convert ${items.length} image${items.length === 1 ? '' : 's'}`}
              </button>
              {items.some(i => i.converted) && (
                <button onClick={downloadAll} className="px-5 py-2 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30">
                  Download All
                </button>
              )}
              <label className="flex items-center gap-2 text-xs text-gray-400 ml-2">
                <input type="checkbox" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} className="accent-[#E8970A]" />
                Show previews
              </label>
              <button onClick={() => setItems([])} className="ml-auto px-5 py-2 rounded-lg text-gray-400 border border-[#1A1726]">Clear</button>
            </div>

            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <img src={item.url} alt="" className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{item.file.name}</div>
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-400">{item.file.type.split('/')[1]?.toUpperCase() || 'Image'}</span>
                        {' '}{formatBytes(item.file.size)}
                        {item.converted && (
                          <>
                            {' '}<span className="text-[#E8970A]">&rarr;</span>{' '}
                            <span className="text-gray-400">{FORMATS.find(f => f.value === targetFormat)?.label || ''}</span>
                            {' '}
                            <span className={item.converted.size < item.file.size ? 'text-green-400' : 'text-red-400'}>
                              {formatBytes(item.converted.size)}
                            </span>
                            {' '}
                            <span className={`text-xs ${item.converted.size < item.file.size ? 'text-green-500' : 'text-red-500'}`}>
                              ({item.converted.size < item.file.size ? '-' : '+'}{Math.abs(parseFloat(savingsPercent(item.file.size, item.converted.size)))}%)
                            </span>
                          </>
                        )}
                        {!item.converted && item.status === 'pending' && (
                          <>
                            {' '}<span className="text-gray-600">&rarr;</span>{' '}
                            <span className="text-gray-500 italic">~est. after conversion</span>
                          </>
                        )}
                      </div>
                    </div>
                    {item.status === 'error' && <span className="text-xs text-red-400">Error</span>}
                    {item.converted && (
                      <button onClick={() => download(item)} className="p-2 text-gray-400 hover:text-white"><Download size={16} /></button>
                    )}
                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-2 text-gray-400 hover:text-red-400"><X size={16} /></button>
                  </div>
                  {/* Preview thumbnails of converted images */}
                  {showPreview && item.convertedUrl && (
                    <div className="mt-3 flex gap-3 items-end">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Original</div>
                        <img src={item.url} alt="original" className="w-24 h-24 object-contain rounded border border-[#1A1726] bg-[#070510]" />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">Converted</div>
                        <img src={item.convertedUrl} alt="converted" className="w-24 h-24 object-contain rounded border border-[#1A1726] bg-[#070510]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
    </div>
  )
}
