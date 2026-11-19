'use client'

import { useState, useRef, useCallback, useEffect } from 'react'


import { Upload, Download, Minimize2, Image as ImageIcon, X, FileArchive, RefreshCw, Target } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

interface BatchItem {
  id: string
  file: File
  originalUrl: string
  compressedBlob: Blob | null
  compressedUrl: string
  status: 'pending' | 'compressing' | 'done' | 'error'
  error?: string
}

export default function ImageCompressPage() {
  const [items, setItems] = useState<BatchItem[]>([])
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState<number | ''>('')
  const [maxHeight, setMaxHeight] = useState<number | ''>('')
  const [useResize, setUseResize] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New: target file size mode
  const [useTargetSize, setUseTargetSize] = useState(false)
  const [targetSizeKB, setTargetSizeKB] = useState<number | ''>(200)

  const addFiles = (files: FileList | File[]) => {
    const newItems: BatchItem[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      newItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        originalUrl: URL.createObjectURL(file),
        compressedBlob: null,
        compressedUrl: '',
        status: 'pending',
      })
    }
    setItems(prev => [...prev, ...newItems])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) {
        URL.revokeObjectURL(item.originalUrl)
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const compressAll = async () => {
    setIsCompressing(true)
    setError('')

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.status === 'done') continue

      setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'compressing' } : p))

      try {
        const options: Parameters<typeof imageCompression>[1] = {
          maxSizeMB: useTargetSize && targetSizeKB ? Number(targetSizeKB) / 1024 : 50,
          initialQuality: quality / 100,
          useWebWorker: true,
          fileType: item.file.type as string,
        }

        if (useResize) {
          if (maxWidth) options.maxWidthOrHeight = Math.max(Number(maxWidth), Number(maxHeight) || 0)
          else if (maxHeight) options.maxWidthOrHeight = Number(maxHeight)
        }

        const compressed = await imageCompression(item.file, options)

        setItems(prev => prev.map(p => p.id === item.id ? {
          ...p,
          compressedBlob: compressed,
          compressedUrl: URL.createObjectURL(compressed),
          status: 'done',
        } : p))
      } catch (err: any) {
        setItems(prev => prev.map(p => p.id === item.id ? {
          ...p,
          status: 'error',
          error: err.message || 'Compression failed',
        } : p))
      }
    }

    setIsCompressing(false)
  }

  // Auto-compress first item on quality change (for preview)
  useEffect(() => {
    if (items.length !== 1 || items[0].status !== 'pending') return
    const timeout = setTimeout(() => { compressAll() }, 500)
    return () => clearTimeout(timeout)
  }, [quality, items.length])

  const downloadOne = (item: BatchItem) => {
    if (!item.compressedBlob) return
    const ext = item.file.name.split('.').pop() || 'jpg'
    const baseName = item.file.name.replace(/\.[^.]+$/, '')
    const url = URL.createObjectURL(item.compressedBlob)
    const a = document.createElement('a')
    a.download = `${baseName}-compressed.${ext}`
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    for (const item of items.filter(i => i.compressedBlob)) {
      downloadOne(item)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  const clearAll = () => {
    items.forEach(i => {
      URL.revokeObjectURL(i.originalUrl)
      if (i.compressedUrl) URL.revokeObjectURL(i.compressedUrl)
    })
    setItems([])
  }

  const totalOriginal = items.reduce((s, i) => s + i.file.size, 0)
  const totalCompressed = items.filter(i => i.compressedBlob).reduce((s, i) => s + (i.compressedBlob?.size || 0), 0)
  const totalSaved = totalOriginal - totalCompressed
  const doneCount = items.filter(i => i.status === 'done').length
  const singleItem = items.length === 1 ? items[0] : null

  // For single item, compute savings
  const singleSavings = singleItem && singleItem.compressedBlob
    ? ((1 - singleItem.compressedBlob.size / singleItem.file.size) * 100).toFixed(1)
    : null

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Image Compressor
        </h1>
        <p className="text-gray-400 mb-8">Compress images while maintaining quality. Supports batch compression. All processing in your browser.</p>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-14 rounded-lg border-2 border-red-400/40 bg-red-400/5 flex items-center justify-center">
                <span className="text-sm font-bold text-red-400">5.2 MB</span>
              </div>
              <span className="text-[10px] text-gray-500">Original</span>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-14 rounded-lg border-2 border-green-500/40 bg-green-500/5 flex items-center justify-center">
                <span className="text-sm font-bold text-green-400">820 KB</span>
              </div>
              <span className="text-[10px] text-green-400">84% smaller</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Adjust quality slider</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download compressed</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Reduce file size without visible quality loss. Great for web and email. Batch supported.
          </p>
        </div>

        {/* Upload area (always visible for batch) */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
          style={{ background: '#0F0D1A' }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto mb-4 text-[#E8970A]" size={40} />
          <p className="text-white text-lg mb-1">Drop images here or click to upload</p>
          <p className="text-gray-500 text-sm">Multiple files supported. Supports JPG, PNG, WebP</p>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-5 rounded-2xl p-6 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <Minimize2 size={18} className="text-[#E8970A]" /> Compression Settings
              </h2>

              <div>
                <label className="text-gray-400 text-sm block mb-1">Quality: {quality}%</label>
                <input
                  type="range" min={1} max={100} value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#E8970A]"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              {/* Target file size */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={useTargetSize}
                    onChange={(e) => setUseTargetSize(e.target.checked)}
                    className="accent-[#E8970A] w-4 h-4"
                  />
                  <span className="text-gray-300 text-sm flex items-center gap-1">
                    <Target size={14} className="text-[#E8970A]" />
                    Compress to target size
                  </span>
                </label>
                {useTargetSize && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Under</span>
                    <input
                      type="number" min={10} placeholder="200"
                      value={targetSizeKB}
                      onChange={(e) => setTargetSizeKB(e.target.value ? Number(e.target.value) : '')}
                      className="w-24 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]"
                    />
                    <span className="text-xs text-gray-500">KB</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={useResize}
                    onChange={(e) => setUseResize(e.target.checked)}
                    className="accent-[#E8970A] w-4 h-4"
                  />
                  <span className="text-gray-300 text-sm">Resize while compressing</span>
                </label>
                {useResize && (
                  <div className="flex gap-2">
                    <input
                      type="number" min={1} placeholder="Max width"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(e.target.value ? Number(e.target.value) : '')}
                      className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]"
                    />
                    <input
                      type="number" min={1} placeholder="Max height"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(e.target.value ? Number(e.target.value) : '')}
                      className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]"
                    />
                  </div>
                )}
              </div>

              {/* Compression ratio visual */}
              {totalCompressed > 0 && (
                <div className="rounded-xl p-4 border border-[#1A1726] bg-[#070510]">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Original total</span>
                    <span className="text-white font-medium">{formatBytes(totalOriginal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Compressed total</span>
                    <span className="text-white font-medium">{formatBytes(totalCompressed)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Saved</span>
                    <span className={`font-semibold ${totalSaved > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalSaved > 0 ? `${formatBytes(totalSaved)} (${Math.round((totalSaved / totalOriginal) * 100)}%)` : 'None'}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-3 rounded-full bg-[#1A1726] overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(5, (totalCompressed / totalOriginal) * 100)}%`,
                        background: totalSaved > 0 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : '#ef4444',
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      {Math.round((totalCompressed / totalOriginal) * 100)}% of original
                    </span>
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={compressAll}
                  disabled={isCompressing || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <Minimize2 size={16} />
                  {isCompressing ? `Compressing... (${doneCount}/${items.length})` : `Compress ${items.length} image${items.length === 1 ? '' : 's'}`}
                </button>
                {doneCount > 0 && (
                  <button onClick={downloadAll} className="w-full flex items-center justify-center gap-2 bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 py-2.5 rounded-lg">
                    <FileArchive size={16} />
                    Download All
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#1A1726] text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={14} /> Clear All
                </button>
              </div>
            </div>

            {/* Preview area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Side by side for single image */}
              {singleItem && (
                <div className="rounded-2xl p-4 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">Original ({formatBytes(singleItem.file.size)})</p>
                      <div className="rounded-lg overflow-hidden border border-[#1A1726] flex items-center justify-center min-h-[200px] bg-[#070510]">
                        <img src={singleItem.originalUrl} alt="Original" className="max-w-full max-h-[400px] object-contain" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">
                        Compressed {singleItem.compressedBlob ? `(${formatBytes(singleItem.compressedBlob.size)})` : ''}
                        {singleSavings && Number(singleSavings) > 0 && (
                          <span className="text-green-400 ml-1">-{singleSavings}%</span>
                        )}
                      </p>
                      <div className="rounded-lg overflow-hidden border border-[#1A1726] flex items-center justify-center min-h-[200px] bg-[#070510]">
                        {singleItem.compressedUrl ? (
                          <img src={singleItem.compressedUrl} alt="Compressed" className="max-w-full max-h-[400px] object-contain" />
                        ) : singleItem.status === 'compressing' ? (
                          <div className="text-[#E8970A] animate-pulse">
                            <Minimize2 size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Compressing...</p>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Preview will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Batch file list */}
              {items.length > 1 && (
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex items-center gap-3">
                      <img src={item.originalUrl} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{item.file.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-3">
                          <span>{formatBytes(item.file.size)}</span>
                          {item.status === 'done' && item.compressedBlob && (
                            <>
                              <span className="text-green-400">&rarr; {formatBytes(item.compressedBlob.size)}</span>
                              <span className="text-green-400">-{Math.round((1 - item.compressedBlob.size / item.file.size) * 100)}%</span>
                            </>
                          )}
                          {item.status === 'compressing' && <span className="text-[#E8970A]">compressing...</span>}
                          {item.status === 'error' && <span className="text-red-400">{item.error}</span>}
                        </div>
                        {/* Per-item compression bar */}
                        {item.status === 'done' && item.compressedBlob && (
                          <div className="mt-1 h-1.5 rounded-full bg-[#1A1726] overflow-hidden w-full max-w-[200px]">
                            <div
                              className="h-full rounded-full bg-green-500 transition-all"
                              style={{ width: `${Math.max(3, (item.compressedBlob.size / item.file.size) * 100)}%` }}
                            />
                          </div>
                        )}
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
              )}
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
