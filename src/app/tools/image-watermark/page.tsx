'use client'

import { useState, useRef, useCallback, useEffect } from 'react'


import { Upload, Download, Type, RotateCw, Image as ImageIcon, Layers } from 'lucide-react'

type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type WatermarkMode = 'text' | 'image'

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'top-left', label: 'TL' },
  { value: 'top-center', label: 'TC' },
  { value: 'top-right', label: 'TR' },
  { value: 'middle-left', label: 'ML' },
  { value: 'middle-center', label: 'MC' },
  { value: 'middle-right', label: 'MR' },
  { value: 'bottom-left', label: 'BL' },
  { value: 'bottom-center', label: 'BC' },
  { value: 'bottom-right', label: 'BR' },
]

const POSITION_PRESETS: { value: Position; label: string }[] = [
  { value: 'bottom-right', label: 'Bottom Right (default)' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'middle-center', label: 'Center' },
  { value: 'top-right', label: 'Top Right' },
]

interface BatchImage {
  id: string
  file: File
  url: string
  img: HTMLImageElement
}

export default function ImageWatermarkPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  // Watermark mode: text or image
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>('text')

  // Text watermark settings
  const [text, setText] = useState('Watermark')
  const [fontSize, setFontSize] = useState(48)
  const [color, setColor] = useState('#ffffff')

  // Image/logo watermark settings
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [logoScale, setLogoScale] = useState(20) // percent of image width

  // Shared settings
  const [opacity, setOpacity] = useState(0.5)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState<Position>('bottom-right')
  const [tile, setTile] = useState(false)

  // Batch watermarking
  const [batchMode, setBatchMode] = useState(false)
  const [batchImages, setBatchImages] = useState<BatchImage[]>([])
  const [batchProcessing, setBatchProcessing] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      setImageUrl(url)
    }
    img.src = url
  }

  const loadLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setLogoImg(img)
      setLogoUrl(url)
    }
    img.src = url
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadImage(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadImage(file)
  }

  const addBatchFiles = (files: FileList | File[]) => {
    const newItems: Promise<BatchImage>[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      newItems.push(new Promise<BatchImage>((resolve) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => resolve({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, url, img })
        img.src = url
      }))
    }
    Promise.all(newItems).then(items => setBatchImages(prev => [...prev, ...items]))
  }

  const getTextPosition = useCallback((canvasW: number, canvasH: number, textW: number, textH: number): { x: number; y: number } => {
    const pad = 20
    const positions: Record<Position, { x: number; y: number }> = {
      'top-left': { x: pad + textW / 2, y: pad + textH / 2 },
      'top-center': { x: canvasW / 2, y: pad + textH / 2 },
      'top-right': { x: canvasW - pad - textW / 2, y: pad + textH / 2 },
      'middle-left': { x: pad + textW / 2, y: canvasH / 2 },
      'middle-center': { x: canvasW / 2, y: canvasH / 2 },
      'middle-right': { x: canvasW - pad - textW / 2, y: canvasH / 2 },
      'bottom-left': { x: pad + textW / 2, y: canvasH - pad - textH / 2 },
      'bottom-center': { x: canvasW / 2, y: canvasH - pad - textH / 2 },
      'bottom-right': { x: canvasW - pad - textW / 2, y: canvasH - pad - textH / 2 },
    }
    return positions[position]
  }, [position])

  const drawWatermark = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save()
    ctx.globalAlpha = opacity

    if (watermarkMode === 'text') {
      ctx.font = `${fontSize}px "DM Sans", sans-serif`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const metrics = ctx.measureText(text)
      const textW = metrics.width
      const textH = fontSize

      if (tile) {
        const spacingX = textW + 80
        const spacingY = textH + 80
        for (let y = -h; y < h * 2; y += spacingY) {
          for (let x = -w; x < w * 2; x += spacingX) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.fillText(text, 0, 0)
            ctx.restore()
          }
        }
      } else {
        const pos = getTextPosition(w, h, textW, textH)
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.fillText(text, 0, 0)
        ctx.restore()
      }
    } else if (watermarkMode === 'image' && logoImg) {
      const logoW = w * (logoScale / 100)
      const logoH = (logoImg.height / logoImg.width) * logoW

      if (tile) {
        const spacingX = logoW + 60
        const spacingY = logoH + 60
        for (let y = -h; y < h * 2; y += spacingY) {
          for (let x = -w; x < w * 2; x += spacingX) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.drawImage(logoImg, -logoW / 2, -logoH / 2, logoW, logoH)
            ctx.restore()
          }
        }
      } else {
        const pos = getTextPosition(w, h, logoW, logoH)
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.drawImage(logoImg, -logoW / 2, -logoH / 2, logoW, logoH)
        ctx.restore()
      }
    }

    ctx.restore()
  }, [watermarkMode, text, fontSize, color, opacity, rotation, tile, getTextPosition, logoImg, logoScale])

  const renderCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0)
    drawWatermark(ctx, canvas.width, canvas.height)
  }, [image, drawWatermark])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'watermarked-image.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const handleBatchWatermark = async () => {
    if (batchImages.length === 0) return
    setBatchProcessing(true)

    for (const item of batchImages) {
      const canvas = document.createElement('canvas')
      canvas.width = item.img.naturalWidth
      canvas.height = item.img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) continue

      ctx.drawImage(item.img, 0, 0)
      drawWatermark(ctx, canvas.width, canvas.height)

      const blob: Blob = await new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png'))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `watermarked-${item.file.name}`
      a.click()
      URL.revokeObjectURL(url)
      await new Promise(r => setTimeout(r, 200))
    }

    setBatchProcessing(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Image Watermark
        </h1>
        <p className="text-gray-400 mb-4">Add text or logo watermarks to your images. Supports batch watermarking. All processing happens in your browser.</p>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">&#128444;</div>
              <span className="text-[10px] text-gray-500">Image</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">+</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-[10px] font-bold italic opacity-60">LOGO</div>
              <span className="text-[10px] text-gray-500">Watermark</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Add text or logo watermark</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Control position, opacity, rotation, and tiling. Use text or your own logo image.
          </p>
        </div>

        {!image ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
            style={{ background: '#0F0D1A' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4 text-[#E8970A]" size={48} />
            <p className="text-white text-lg mb-1">Drop an image here or click to upload</p>
            <p className="text-gray-500 text-sm">Supports JPG, PNG, WebP</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-5 rounded-2xl p-6 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <Type size={18} className="text-[#E8970A]" /> Watermark Settings
              </h2>

              {/* Watermark mode toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setWatermarkMode('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${watermarkMode === 'text' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                >
                  <Type size={14} /> Text
                </button>
                <button
                  onClick={() => setWatermarkMode('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${watermarkMode === 'image' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                >
                  <ImageIcon size={14} /> Logo/Image
                </button>
              </div>

              {watermarkMode === 'text' ? (
                <>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Text</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E8970A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Font Size: {fontSize}px</label>
                    <input
                      type="range" min={12} max={200} value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-[#E8970A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Color</label>
                    <input
                      type="color" value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-8 rounded cursor-pointer border border-[#1A1726] bg-transparent"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Upload Logo / Watermark Image</label>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadLogo(f) }} />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-lg p-4 text-center cursor-pointer"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-12 mx-auto object-contain" />
                    ) : (
                      <>
                        <Upload size={20} className="mx-auto text-gray-500 mb-1" />
                        <span className="text-xs text-gray-400">Upload logo (PNG with transparency recommended)</span>
                      </>
                    )}
                  </button>
                  {logoImg && (
                    <div className="mt-3">
                      <label className="text-gray-400 text-sm block mb-1">Logo Size: {logoScale}% of image width</label>
                      <input
                        type="range" min={5} max={80} value={logoScale}
                        onChange={(e) => setLogoScale(Number(e.target.value))}
                        className="w-full accent-[#E8970A]"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm block mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                <input
                  type="range" min={0} max={1} step={0.01} value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-[#E8970A]"
                />
                {/* Opacity preview bar */}
                <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 8px 8px' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: '100%', backgroundColor: watermarkMode === 'text' ? color : '#E8970A', opacity }}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1 flex items-center gap-1">
                  <RotateCw size={14} /> Rotation: {rotation}&deg;
                </label>
                <input
                  type="range" min={-180} max={180} value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-[#E8970A]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Position</label>
                {/* Quick presets */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {POSITION_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={`px-2 py-1 rounded text-[10px] ${position === p.value ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/30' : 'bg-[#070510] text-gray-500 border border-[#1A1726]'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={`py-1.5 rounded text-xs font-medium transition-colors ${position === p.value ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={tile}
                  onChange={(e) => setTile(e.target.checked)}
                  className="accent-[#E8970A] w-4 h-4"
                />
                <span className="text-gray-300 text-sm">Tile / Repeat across image</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] text-black font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={() => { setImage(null); setImageUrl('') }}
                  className="px-4 py-2.5 rounded-lg border border-[#1A1726] text-gray-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Preview + Batch */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl p-4 border border-[#1A1726] flex items-center justify-center" style={{ background: '#0F0D1A' }}>
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[600px] rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Batch watermarking */}
              <div className="rounded-2xl p-4 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
                <button
                  onClick={() => setBatchMode(!batchMode)}
                  className="flex items-center gap-2 text-sm font-medium text-white mb-3"
                >
                  <Layers size={16} className="text-[#E8970A]" />
                  Batch Watermark ({batchImages.length} images)
                  <span className="text-xs text-gray-500 ml-1">{batchMode ? '(collapse)' : '(expand)'}</span>
                </button>

                {batchMode && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">Apply the same watermark settings to multiple images at once.</p>
                    <label className="block">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addBatchFiles(e.target.files); e.target.value = '' }} />
                      <div className="border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-lg p-4 text-center cursor-pointer">
                        <Upload size={20} className="mx-auto text-gray-500 mb-1" />
                        <span className="text-xs text-gray-400">Add images for batch watermarking</span>
                      </div>
                    </label>

                    {batchImages.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {batchImages.map(item => (
                            <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#1A1726]">
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setBatchImages(prev => prev.filter(i => i.id !== item.id))}
                                className="absolute top-0 right-0 bg-black/70 rounded-bl p-0.5 text-white hover:text-red-400 text-xs"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleBatchWatermark}
                          disabled={batchProcessing}
                          className="w-full flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] disabled:opacity-50 text-black font-semibold py-2 rounded-lg"
                        >
                          <Download size={14} />
                          {batchProcessing ? 'Processing...' : `Watermark & Download ${batchImages.length} images`}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
