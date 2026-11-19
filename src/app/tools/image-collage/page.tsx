'use client'

import { useState, useRef, useCallback, useEffect } from 'react'


import { Upload, Download, Grid, X, Plus } from 'lucide-react'

interface CollageImage {
  id: string
  file: File
  url: string
  img: HTMLImageElement
}

const LAYOUTS = [
  { value: '2x1', label: '2x1', cols: 2, rows: 1 },
  { value: '1x2', label: '1x2', cols: 1, rows: 2 },
  { value: '2x2', label: '2x2', cols: 2, rows: 2 },
  { value: '3x1', label: '3x1', cols: 3, rows: 1 },
  { value: '1x3', label: '1x3', cols: 1, rows: 3 },
  { value: '2x3', label: '2x3', cols: 2, rows: 3 },
  { value: '3x3', label: '3x3', cols: 3, rows: 3 },
]

export default function ImageCollagePage() {
  const [images, setImages] = useState<CollageImage[]>([])
  const [layout, setLayout] = useState('2x2')
  const [gap, setGap] = useState(4)
  const [bgColor, setBgColor] = useState('#000000')
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const [borderRadius, setBorderRadius] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentLayout = LAYOUTS.find(l => l.value === layout) || LAYOUTS[3]
  const maxImages = currentLayout.cols * currentLayout.rows

  const addFiles = (files: FileList | File[]) => {
    const remaining = 9 - images.length
    const toAdd = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remaining)

    Promise.all(
      toAdd.map(
        (file) =>
          new Promise<CollageImage>((resolve) => {
            const url = URL.createObjectURL(file)
            const img = new Image()
            img.onload = () =>
              resolve({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, url, img })
            img.src = url
          })
      )
    ).then((newImages) => {
      setImages((prev) => [...prev, ...newImages])
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((i) => i.id !== id)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const renderCollage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { cols, rows } = currentLayout
    const cellSize = 400
    const totalW = cols * cellSize + (cols + 1) * gap
    const totalH = rows * cellSize + (rows + 1) * gap

    canvas.width = totalW
    canvas.height = totalH

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, totalW, totalH)

    for (let i = 0; i < Math.min(images.length, maxImages); i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = gap + col * (cellSize + gap)
      const y = gap + row * (cellSize + gap)
      const img = images[i].img

      // Cover-fit the image into the cell
      const imgRatio = img.naturalWidth / img.naturalHeight
      const cellRatio = 1
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
      if (imgRatio > cellRatio) {
        sw = img.naturalHeight
        sx = (img.naturalWidth - sw) / 2
      } else {
        sh = img.naturalWidth
        sy = (img.naturalHeight - sh) / 2
      }

      // Apply border radius via clipping
      if (borderRadius > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, cellSize, cellSize, borderRadius)
        ctx.clip()
        ctx.drawImage(img, sx, sy, sw, sh, x, y, cellSize, cellSize)
        ctx.restore()
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, x, y, cellSize, cellSize)
      }
    }
  }, [images, currentLayout, gap, bgColor, borderRadius, maxImages])

  useEffect(() => {
    renderCollage()
  }, [renderCollage])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const ext = format === 'jpeg' ? 'jpg' : 'png'
    const link = document.createElement('a')
    link.download = `collage.${ext}`
    link.href = canvasRef.current.toDataURL(mime, 0.92)
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Image Collage Maker
        </h1>
        <p className="text-gray-400 mb-4">Combine up to 9 images into a collage. All processing happens in your browser.</p>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-6 h-6 rounded border border-blue-500/60 bg-blue-500/10"></div>
              <div className="w-6 h-6 rounded border border-purple-500/60 bg-purple-500/10"></div>
              <div className="w-6 h-6 rounded border border-green-500/60 bg-green-500/10"></div>
              <div className="w-6 h-6 rounded border border-[#E8970A]/60 bg-[#E8970A]/10"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-green-500/60 bg-green-500/10 grid grid-cols-2 gap-0.5 p-1">
                <div className="bg-blue-500/30 rounded-sm"></div>
                <div className="bg-purple-500/30 rounded-sm"></div>
                <div className="bg-green-500/30 rounded-sm"></div>
                <div className="bg-[#E8970A]/30 rounded-sm"></div>
              </div>
              <span className="text-[10px] text-green-400">Collage</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload images</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Choose layout</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download collage</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Supports 2x1, 2x2, 3x3 and more layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-5 rounded-2xl p-6 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <Grid size={18} className="text-[#E8970A]" /> Collage Settings
            </h2>

            {/* Upload area */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="mx-auto mb-2 text-[#E8970A]" size={28} />
              <p className="text-gray-400 text-sm">Add images ({images.length}/9)</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }} />
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((item) => (
                  <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#1A1726]">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(item.id)}
                      className="absolute top-0 right-0 bg-black/70 rounded-bl p-0.5 text-white hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm block mb-2">Layout</label>
              <div className="grid grid-cols-4 gap-1.5">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLayout(l.value)}
                    className={`py-1.5 rounded text-xs font-medium transition-colors ${layout === l.value ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Gap: {gap}px</label>
              <input
                type="range" min={0} max={20} value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-[#E8970A]"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Border Radius: {borderRadius}px</label>
              <input
                type="range" min={0} max={50} value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-[#E8970A]"
              />
              <div className="flex gap-1.5 mt-1">
                {[0, 8, 16, 24, 40].map(r => (
                  <button
                    key={r}
                    onClick={() => setBorderRadius(r)}
                    className={`flex-1 py-1 rounded text-[10px] ${borderRadius === r ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-400'}`}
                  >
                    {r === 0 ? 'None' : `${r}px`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color" value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer border border-[#1A1726] bg-transparent"
                />
                <code className="text-xs text-gray-400 font-mono">{bgColor}</code>
              </div>
              <div className="flex gap-1 mt-2">
                {['#000000', '#FFFFFF', '#1a1a2e', '#2d3436', '#E8970A'].map(c => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className={`w-8 h-6 rounded border ${bgColor === c ? 'border-[#E8970A]' : 'border-[#1A1726]'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Output dimensions */}
            {images.length > 0 && (
              <div className="bg-[#070510] border border-[#1A1726] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Output Dimensions</div>
                <div className="text-sm font-mono text-[#E8970A]">
                  {currentLayout.cols * 400 + (currentLayout.cols + 1) * gap} x {currentLayout.rows * 400 + (currentLayout.rows + 1) * gap} px
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentLayout.cols}x{currentLayout.rows} grid, {gap}px gap, 400px cells
                </div>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm block mb-1">Format</label>
              <div className="flex gap-2">
                {(['png', 'jpeg'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${format === f ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={images.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Download size={16} /> Download Collage
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 rounded-2xl p-4 border border-[#1A1726] flex items-center justify-center min-h-[400px]" style={{ background: '#0F0D1A' }}>
            {images.length === 0 ? (
              <div className="text-center text-gray-500">
                <Upload size={48} className="mx-auto mb-3 opacity-40" />
                <p>Upload images to see your collage</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className="max-w-full max-h-[600px] rounded-lg" />
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
