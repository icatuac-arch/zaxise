'use client'

import { useState, useCallback, useRef, useEffect } from 'react'


import { Upload, Download, Minimize2, RefreshCw, X, FileArchive, Check, Lock, Unlock } from 'lucide-react'

interface ImageItem {
  id: string
  file: File
  originalUrl: string
  originalSize: number
  originalWidth: number
  originalHeight: number
  resized?: Blob
  resizedUrl?: string
  resizedSize?: number
  resizedWidth?: number
  resizedHeight?: number
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const SOCIAL_PRESETS = [
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Facebook Cover', w: 820, h: 312 },
  { label: 'Facebook Post', w: 1200, h: 630 },
  { label: 'Twitter Header', w: 1500, h: 500 },
  { label: 'Twitter Post', w: 1200, h: 675 },
  { label: 'YouTube Thumbnail', w: 1280, h: 720 },
  { label: 'LinkedIn Banner', w: 1584, h: 396 },
  { label: 'LinkedIn Post', w: 1200, h: 627 },
  { label: 'Pinterest Pin', w: 1000, h: 1500 },
  { label: 'TikTok Video', w: 1080, h: 1920 },
]

const PERCENTAGE_PRESETS = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
  { label: '150%', value: 150 },
  { label: '200%', value: 200 },
]

const OUTPUT_FORMATS = [
  { value: 'auto', label: 'Keep original format' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
]

export default function ImageResizePage() {
  const [items, setItems] = useState<ImageItem[]>([])
  const [resizeMode, setResizeMode] = useState<'custom' | 'preset' | 'percent'>('custom')
  const [targetWidth, setTargetWidth] = useState<number | ''>('')
  const [targetHeight, setTargetHeight] = useState<number | ''>('')
  const [percentage, setPercentage] = useState(50)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [outputFormat, setOutputFormat] = useState('auto')
  const [quality, setQuality] = useState(90)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Track original aspect ratio from first image
  const firstItem = items[0]
  const aspectRatio = firstItem ? firstItem.originalWidth / firstItem.originalHeight : 1

  const addFiles = useCallback((files: FileList | File[]) => {
    const toAdd = Array.from(files).filter(f => f.type.startsWith('image/'))

    Promise.all(toAdd.map(file => new Promise<ImageItem>((resolve) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        resolve({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          originalUrl: url,
          originalSize: file.size,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          status: 'pending',
        })
      }
      img.src = url
    }))).then(newItems => {
      setItems(prev => [...prev, ...newItems])
    })
  }, [])

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) {
        URL.revokeObjectURL(item.originalUrl)
        if (item.resizedUrl) URL.revokeObjectURL(item.resizedUrl)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  // Calculate output dimensions for a given item
  const getOutputDims = (item: ImageItem): { w: number; h: number } => {
    if (resizeMode === 'percent') {
      return {
        w: Math.round(item.originalWidth * percentage / 100),
        h: Math.round(item.originalHeight * percentage / 100),
      }
    }
    if (resizeMode === 'preset' || resizeMode === 'custom') {
      const tw = Number(targetWidth) || item.originalWidth
      const th = Number(targetHeight) || item.originalHeight
      if (maintainAspect && targetWidth && !targetHeight) {
        return { w: tw, h: Math.round(tw / (item.originalWidth / item.originalHeight)) }
      }
      if (maintainAspect && targetHeight && !targetWidth) {
        return { w: Math.round(th * (item.originalWidth / item.originalHeight)), h: th }
      }
      return { w: tw, h: th }
    }
    return { w: item.originalWidth, h: item.originalHeight }
  }

  const resizeAll = async () => {
    setProcessing(true)
    for (const item of items) {
      if (item.status === 'done') continue

      setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'processing' } : p))

      try {
        const { w, h } = getOutputDims(item)

        const img = new Image()
        img.src = item.originalUrl
        await new Promise<void>((resolve) => { img.onload = () => resolve() })

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!

        // White bg for JPEG
        const fmt = outputFormat === 'auto' ? item.file.type : outputFormat
        if (fmt === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, w, h)
        }

        ctx.drawImage(img, 0, 0, w, h)

        const blob: Blob = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b!), fmt || 'image/png', quality / 100)
        )

        setItems(prev => prev.map(p => p.id === item.id ? {
          ...p,
          resized: blob,
          resizedUrl: URL.createObjectURL(blob),
          resizedSize: blob.size,
          resizedWidth: w,
          resizedHeight: h,
          status: 'done',
        } : p))
      } catch (err: any) {
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'error', error: err.message } : p))
      }
    }
    setProcessing(false)
  }

  const downloadOne = (item: ImageItem) => {
    if (!item.resized) return
    const fmtExt = outputFormat === 'auto'
      ? item.file.name.split('.').pop() || 'png'
      : outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png'
    const url = URL.createObjectURL(item.resized)
    const a = document.createElement('a')
    a.href = url
    a.download = `resized-${item.file.name.replace(/\.[^.]+$/, '')}.${fmtExt}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    for (const item of items.filter(i => i.resized)) {
      downloadOne(item)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  const clearAll = () => {
    items.forEach(i => {
      URL.revokeObjectURL(i.originalUrl)
      if (i.resizedUrl) URL.revokeObjectURL(i.resizedUrl)
    })
    setItems([])
  }

  const applyPreset = (w: number, h: number) => {
    setResizeMode('preset')
    setTargetWidth(w)
    setTargetHeight(h)
    setMaintainAspect(false)
  }

  const handleWidthChange = (w: number | '') => {
    setTargetWidth(w)
    if (maintainAspect && w && firstItem) {
      setTargetHeight(Math.round(Number(w) / (firstItem.originalWidth / firstItem.originalHeight)))
    }
  }

  const handleHeightChange = (h: number | '') => {
    setTargetHeight(h)
    if (maintainAspect && h && firstItem) {
      setTargetWidth(Math.round(Number(h) * (firstItem.originalWidth / firstItem.originalHeight)))
    }
  }

  const totalOriginal = items.reduce((s, i) => s + i.originalSize, 0)
  const totalResized = items.filter(i => i.resizedSize).reduce((s, i) => s + (i.resizedSize || 0), 0)
  const completedCount = items.filter(i => i.status === 'done').length

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Minimize2 size={28} />
            Image Resizer & Optimizer
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Resize images to exact dimensions, social media presets, or by percentage. Batch supported.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-16 rounded-lg border-2 border-[#E8970A]/40 bg-[#E8970A]/5 flex items-center justify-center">
                <div className="w-14 h-10 rounded bg-gradient-to-br from-purple-400/40 to-blue-400/40 flex items-center justify-center">
                  <span className="text-[10px] text-gray-300">3000x2000</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500">Original</span>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-16 rounded-lg border-2 border-green-500/40 bg-green-500/5 flex items-center justify-center">
                <div className="w-8 h-6 rounded bg-gradient-to-br from-purple-400/40 to-blue-400/40 flex items-center justify-center">
                  <span className="text-[8px] text-gray-300">800x600</span>
                </div>
              </div>
              <span className="text-[10px] text-green-400">Resized</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Set dimensions</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download resized image</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Supports JPG, PNG, WebP. Includes social media presets and percentage scaling.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
          }}
          className={`bg-[#0F0D1A] border-2 border-dashed rounded-xl p-8 mb-6 transition-colors ${dragOver ? 'border-[#E8970A] bg-[#E8970A]/5' : 'border-[#1A1726]'}`}
        >
          <label className="block cursor-pointer text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
            />
            <Upload size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-white font-medium mb-1">Drop images here or click to select</p>
            <p className="text-xs text-gray-500">Multiple files supported -- JPG, PNG, WebP, GIF, BMP, TIFF</p>
          </label>
        </div>

        {items.length > 0 && (
          <>
            {/* Settings */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-6 space-y-4">
              {/* Resize mode tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'custom' as const, label: 'Custom Size' },
                  { key: 'preset' as const, label: 'Social Media Presets' },
                  { key: 'percent' as const, label: 'Resize by %' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setResizeMode(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${resizeMode === tab.key ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Custom dimensions */}
              {(resizeMode === 'custom' || resizeMode === 'preset') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Width (px)</label>
                    <input
                      type="number" value={targetWidth}
                      onChange={(e) => handleWidthChange(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder={firstItem ? `${firstItem.originalWidth}` : 'Width'}
                      className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Height (px)</label>
                    <input
                      type="number" value={targetHeight}
                      onChange={(e) => handleHeightChange(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder={firstItem ? `${firstItem.originalHeight}` : 'Height'}
                      className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setMaintainAspect(!maintainAspect)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        maintainAspect
                          ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/30'
                          : 'bg-[#070510] text-gray-400 border-[#1A1726]'
                      }`}
                    >
                      {maintainAspect ? <Lock size={14} /> : <Unlock size={14} />}
                      {maintainAspect ? 'Aspect Locked' : 'Aspect Free'}
                    </button>
                  </div>
                </div>
              )}

              {/* Social media presets dropdown */}
              {resizeMode === 'preset' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Social Media Presets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {SOCIAL_PRESETS.map(p => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p.w, p.h)}
                        className={`px-3 py-2 rounded-lg text-xs text-left border transition-colors ${
                          targetWidth === p.w && targetHeight === p.h
                            ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/30'
                            : 'bg-[#070510] text-gray-300 border-[#1A1726] hover:bg-white/5'
                        }`}
                      >
                        <div className="font-medium">{p.label}</div>
                        <div className="text-gray-500 text-[10px]">{p.w}x{p.h}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Percentage mode */}
              {resizeMode === 'percent' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Scale: {percentage}%</label>
                  <input
                    type="range" min={10} max={300} value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value))}
                    className="w-full accent-[#E8970A] mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {PERCENTAGE_PRESETS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setPercentage(p.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs ${percentage === p.value ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Output format and quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Output format</label>
                  <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
                    {OUTPUT_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Quality: {quality}%</label>
                  <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                </div>
              </div>

              {/* Before/After dimensions preview */}
              {firstItem && (
                <div className="bg-[#070510] border border-[#1A1726] rounded-lg p-3 flex items-center gap-4 flex-wrap">
                  <div className="text-xs">
                    <span className="text-gray-500">Original: </span>
                    <span className="text-white font-mono">{firstItem.originalWidth} x {firstItem.originalHeight}</span>
                  </div>
                  <span className="text-[#E8970A]">&rarr;</span>
                  <div className="text-xs">
                    <span className="text-gray-500">Output: </span>
                    <span className="text-[#E8970A] font-mono font-bold">
                      {(() => {
                        const dims = getOutputDims(firstItem)
                        return `${dims.w} x ${dims.h}`
                      })()}
                    </span>
                  </div>
                  {maintainAspect && (resizeMode === 'custom' || resizeMode === 'preset') && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Lock size={10} /> Aspect ratio preserved
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={resizeAll}
                disabled={processing || items.length === 0}
                className="px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50"
              >
                {processing ? `Resizing... (${completedCount}/${items.length})` : `Resize ${items.length} image${items.length === 1 ? '' : 's'}`}
              </button>
              {completedCount > 0 && (
                <button onClick={downloadAll} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25">
                  <FileArchive size={14} />
                  Download All
                </button>
              )}
              <button onClick={clearAll} className="ml-auto flex items-center gap-2 px-5 py-2 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5">
                <RefreshCw size={14} />
                Clear All
              </button>
            </div>

            {/* Stats */}
            {totalResized > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Original total</div>
                    <div className="text-white font-semibold">{formatBytes(totalOriginal)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Resized total</div>
                    <div className="text-white font-semibold">{formatBytes(totalResized)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Change</div>
                    <div className={`font-semibold ${totalResized < totalOriginal ? 'text-green-400' : 'text-yellow-400'}`}>
                      {totalResized < totalOriginal
                        ? `-${formatBytes(totalOriginal - totalResized)} (${Math.round(((totalOriginal - totalResized) / totalOriginal) * 100)}%)`
                        : `+${formatBytes(totalResized - totalOriginal)}`
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image list */}
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex items-center gap-3">
                  <img src={item.originalUrl} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{item.file.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>{item.originalWidth}x{item.originalHeight} ({formatBytes(item.originalSize)})</span>
                      {item.status === 'done' && item.resizedWidth && item.resizedHeight && item.resizedSize !== undefined && (
                        <>
                          <span className="text-[#E8970A]">&rarr;</span>
                          <span className="text-green-400">{item.resizedWidth}x{item.resizedHeight} ({formatBytes(item.resizedSize)})</span>
                        </>
                      )}
                      {item.status === 'processing' && <span className="text-[#E8970A]">resizing...</span>}
                      {item.status === 'error' && <span className="text-red-400">{item.error}</span>}
                    </div>
                  </div>
                  {item.status === 'done' && (
                    <button onClick={() => downloadOne(item)} className="p-2 rounded text-gray-400 hover:text-white hover:bg-white/5">
                      <Download size={16} />
                    </button>
                  )}
                  <button onClick={() => removeItem(item.id)} className="p-2 rounded text-gray-400 hover:text-red-400 hover:bg-white/5">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      
    </div>
  )
}
