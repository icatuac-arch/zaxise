'use client'

import { useState, useEffect, useRef } from 'react'


import { Upload, Download, Eraser, RefreshCw, Loader2, Palette as PaletteIcon, Image as ImageIcon, SlidersHorizontal } from 'lucide-react'

declare global {
  interface Window {
    imglyRemoveBackground?: (input: Blob, options?: any) => Promise<Blob>
  }
}

const PRESET_BG_COLORS = [
  { name: 'Transparent', color: 'transparent' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Black', color: '#000000' },
  { name: 'Saffron', color: '#FF9933' },
  { name: 'Green', color: '#138808' },
  { name: 'Sky Blue', color: '#87CEEB' },
  { name: 'Light Grey', color: '#E5E5E5' },
  { name: 'Pink', color: '#E85D75' },
]

export default function RemoveBgPage() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [bgMode, setBgMode] = useState<'transparent' | 'color' | 'image'>('transparent')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [bgImageUrl, setBgImageUrl] = useState('')
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null)

  // New: before/after comparison slider
  const [sliderPos, setSliderPos] = useState(50)
  const [showSlider, setShowSlider] = useState(false)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const isDraggingSlider = useRef(false)

  // New: edge refinement strength
  const [edgeRefinement, setEdgeRefinement] = useState(50)

  // New: download format
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png')

  const [loadError, setLoadError] = useState('')

  // Load the background removal library from CDN with retry
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.imglyRemoveBackground) {
      setScriptLoaded(true)
      return
    }

    let retries = 0
    const maxRetries = 3

    const tryLoad = () => {
      retries++
      setLoadError('')

      const script = document.createElement('script')
      script.type = 'module'
      script.id = `imgly-loader-${retries}`
      script.textContent = `
        try {
          const { removeBackground } = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm')
          window.imglyRemoveBackground = removeBackground
          window.dispatchEvent(new CustomEvent('imgly-loaded'))
        } catch (e) {
          window.dispatchEvent(new CustomEvent('imgly-error', { detail: e.message }))
        }
      `
      document.head.appendChild(script)
    }

    const onLoaded = () => setScriptLoaded(true)
    const onError = (e: any) => {
      const msg = e?.detail || 'Unknown error'
      if (retries < maxRetries) {
        console.warn(`[remove-bg] Load attempt ${retries} failed: ${msg}. Retrying...`)
        setTimeout(tryLoad, 2000)
      } else {
        setLoadError(`Failed to load AI model after ${maxRetries} attempts. Try refreshing the page.`)
      }
    }

    window.addEventListener('imgly-loaded', onLoaded)
    window.addEventListener('imgly-error', onError)
    tryLoad()

    return () => {
      window.removeEventListener('imgly-loaded', onLoaded)
      window.removeEventListener('imgly-error', onError)
    }
  }, [])

  // Re-render composite when bg settings change
  useEffect(() => {
    if (!resultUrl || bgMode === 'transparent') return
    renderComposite()
  }, [resultUrl, bgMode, bgColor, bgImageUrl])

  const renderComposite = async () => {
    if (!compositeCanvasRef.current || !resultUrl) return
    const canvas = compositeCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const subjectImg = new Image()
    subjectImg.crossOrigin = 'anonymous'
    await new Promise<void>((resolve) => {
      subjectImg.onload = () => resolve()
      subjectImg.src = resultUrl
    })

    canvas.width = subjectImg.width
    canvas.height = subjectImg.height

    // Background
    if (bgMode === 'color') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (bgMode === 'image' && bgImageUrl) {
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve()
        bgImg.onerror = () => reject(new Error('bg load failed'))
        bgImg.src = bgImageUrl
      }).catch(() => {})
      const ratio = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height)
      const w = bgImg.width * ratio
      const h = bgImg.height * ratio
      ctx.drawImage(bgImg, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    ctx.drawImage(subjectImg, 0, 0)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    setError('')
    setOriginalFile(file)
    setOriginalUrl(URL.createObjectURL(file))
    setResultBlob(null)
    setResultUrl('')
    setShowSlider(false)
  }

  const handleBgImage = (file: File) => {
    setBgImageUrl(URL.createObjectURL(file))
    setBgMode('image')
  }

  const removeBg = async () => {
    if (!originalFile) return
    if (!window.imglyRemoveBackground) {
      setError('Background removal library is still loading. Please wait a moment and try again.')
      return
    }
    setProcessing(true)
    setError('')
    setProgress('Loading AI model (first time may take 30-60 seconds)...')

    try {
      const blob = await window.imglyRemoveBackground(originalFile, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(`${key}: ${Math.round((current / total) * 100)}%`)
          }
        },
      })
      setResultBlob(blob)
      setResultUrl(URL.createObjectURL(blob))
      setProgress('')
      setShowSlider(true)
    } catch (err: any) {
      setError(err.message || 'Failed to remove background')
      setProgress('')
    }
    setProcessing(false)
  }

  const downloadTransparent = () => {
    if (!resultBlob) return
    if (downloadFormat === 'png') {
      const url = URL.createObjectURL(resultBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `no-bg-${originalFile?.name?.replace(/\.[^.]+$/, '') || 'image'}.png`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // Convert to JPG via canvas (white background since JPG has no transparency)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `no-bg-${originalFile?.name?.replace(/\.[^.]+$/, '') || 'image'}.jpg`
          a.click()
          URL.revokeObjectURL(url)
        }, 'image/jpeg', 0.92)
      }
      img.src = resultUrl
    }
  }

  const downloadComposite = () => {
    if (!compositeCanvasRef.current) return
    const mime = downloadFormat === 'jpg' ? 'image/jpeg' : 'image/png'
    const ext = downloadFormat === 'jpg' ? 'jpg' : 'png'
    compositeCanvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `composite-${originalFile?.name?.replace(/\.[^.]+$/, '') || 'image'}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    }, mime, 0.92)
  }

  const reset = () => {
    setOriginalFile(null)
    setOriginalUrl('')
    setResultBlob(null)
    setResultUrl('')
    setError('')
    setProgress('')
    setBgMode('transparent')
    setBgImageUrl('')
    setShowSlider(false)
  }

  // Slider drag handlers
  const handleSliderMouseDown = () => {
    isDraggingSlider.current = true
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider.current || !sliderContainerRef.current) return
      const rect = sliderContainerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      setSliderPos((x / rect.width) * 100)
    }
    const handleMouseUp = () => {
      isDraggingSlider.current = false
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingSlider.current || !sliderContainerRef.current) return
      const rect = sliderContainerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
      setSliderPos((x / rect.width) * 100)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Eraser size={28} />
            Background Remover & Replacer
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Remove backgrounds with AI, then replace with any color or image. Runs entirely in your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-[#1A1726]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-full bg-gray-300/80" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-300/80" />
              <span className="absolute top-1 left-1 text-[8px] text-gray-400 font-medium">Before</span>
            </div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-[#1A1726]" style={{
              backgroundImage: 'linear-gradient(45deg, #1A1726 25%, transparent 25%), linear-gradient(-45deg, #1A1726 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1A1726 75%), linear-gradient(-45deg, transparent 75%, #1A1726 75%)',
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
            }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-full bg-gray-300/80" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-300/80" />
              <span className="absolute top-1 left-1 text-[8px] text-gray-400 font-medium">After</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload any image</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>AI removes background</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download transparent</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Best results with photos of people, products, or objects with clear edges.
          </p>
        </div>

        {!originalFile ? (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-8">
            <label className="block">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <div className="border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-xl p-16 text-center cursor-pointer transition-colors">
                <Upload size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-white font-medium mb-1">Upload an image</p>
                <p className="text-xs text-gray-500">JPG, PNG, WebP — any image format</p>
              </div>
            </label>
            <div className="mt-6 p-4 bg-[#070510] rounded-lg text-xs text-gray-400">
              <strong className="text-yellow-400">First-time use:</strong> The AI model is ~30MB and downloads on first use.
              {!scriptLoaded && !loadError && <div className="mt-2 text-[#E8970A]">Loading AI library... (this may take a moment)</div>}
              {scriptLoaded && <div className="mt-2 text-green-400">AI model ready</div>}
              {loadError && <div className="mt-2 text-red-400">{loadError}</div>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Before/After Comparison Slider */}
            {showSlider && resultUrl && bgMode === 'transparent' && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#E8970A]" />
                  Before / After Comparison — Drag the slider
                </h3>
                <div
                  ref={sliderContainerRef}
                  className="relative overflow-hidden rounded-lg cursor-ew-resize select-none"
                  style={{ maxHeight: '450px' }}
                  onMouseDown={handleSliderMouseDown}
                  onTouchStart={handleSliderMouseDown}
                >
                  {/* Original (full width, behind) */}
                  <img src={originalUrl} alt="Original" className="w-full h-auto block max-h-[450px] object-contain" />
                  {/* Result (clipped from left) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                      backgroundImage: 'linear-gradient(45deg, #1A1726 25%, transparent 25%), linear-gradient(-45deg, #1A1726 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1A1726 75%), linear-gradient(-45deg, transparent 75%, #1A1726 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  >
                    <img src={resultUrl} alt="Result" className="w-full h-auto block max-h-[450px] object-contain" />
                  </div>
                  {/* Slider line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#E8970A] z-10 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#E8970A] flex items-center justify-center shadow-lg">
                      <SlidersHorizontal size={14} className="text-black" />
                    </div>
                  </div>
                  {/* Labels */}
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded z-10">Original</span>
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded z-10">Removed</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-2">Original</h3>
                <img src={originalUrl} alt="Original" className="w-full h-auto rounded-lg max-h-[450px] object-contain" />
              </div>
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-2">
                  {bgMode === 'transparent' ? 'Background Removed' : bgMode === 'color' ? 'With New Background' : 'With Background Image'}
                </h3>
                {resultUrl ? (
                  bgMode === 'transparent' ? (
                    <div style={{
                      backgroundImage: 'linear-gradient(45deg, #1A1726 25%, transparent 25%), linear-gradient(-45deg, #1A1726 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1A1726 75%), linear-gradient(-45deg, transparent 75%, #1A1726 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      borderRadius: '8px',
                    }}>
                      <img src={resultUrl} alt="Result" className="w-full h-auto rounded-lg max-h-[450px] object-contain" />
                    </div>
                  ) : (
                    <canvas ref={compositeCanvasRef} className="w-full h-auto rounded-lg max-h-[450px] object-contain" style={{ maxHeight: '450px' }} />
                  )
                ) : (
                  <div className="border-2 border-dashed border-[#1A1726] rounded-lg p-12 text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                    {processing ? (
                      <div className="space-y-2">
                        <Loader2 size={32} className="mx-auto text-[#E8970A] animate-spin" />
                        <div className="text-xs text-gray-400">{progress}</div>
                      </div>
                    ) : (
                      <span>Click &quot;Remove Background&quot; to start</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edge Refinement */}
            {!resultUrl && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#E8970A]" />
                  Edge Refinement
                </h3>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Strength: {edgeRefinement}%</label>
                  <input
                    type="range" min={0} max={100} value={edgeRefinement}
                    onChange={(e) => setEdgeRefinement(Number(e.target.value))}
                    className="w-full accent-[#E8970A]"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Soft edges</span>
                    <span>Hard edges</span>
                  </div>
                </div>
              </div>
            )}

            {/* Background replacement controls */}
            {resultUrl && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Background Options</h3>
                <div className="flex gap-2 mb-4">
                  {[
                    { key: 'transparent', label: 'Transparent', icon: Eraser },
                    { key: 'color', label: 'Solid Color', icon: PaletteIcon },
                    { key: 'image', label: 'Image', icon: ImageIcon },
                  ].map(b => (
                    <button
                      key={b.key}
                      onClick={() => setBgMode(b.key as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${bgMode === b.key ? 'bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30' : 'bg-[#070510] text-gray-300 border border-[#1A1726]'}`}
                    >
                      <b.icon size={14} />
                      {b.label}
                    </button>
                  ))}
                </div>

                {bgMode === 'color' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                      <code className="text-sm text-gray-300 font-mono">{bgColor.toUpperCase()}</code>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRESET_BG_COLORS.filter(p => p.color !== 'transparent').map(p => (
                        <button key={p.name} onClick={() => setBgColor(p.color)} className="h-10 rounded border border-[#1A1726]" style={{ backgroundColor: p.color }} title={p.name} />
                      ))}
                    </div>
                  </div>
                )}

                {bgMode === 'image' && (
                  <div>
                    <label className="block">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBgImage(f) }} />
                      <div className="border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-lg p-6 text-center cursor-pointer">
                        <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                        <span className="text-sm text-gray-400">Click to upload background image</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">{error}</div>}

            {/* Download format selector */}
            {resultUrl && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Download Format</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDownloadFormat('png')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${downloadFormat === 'png' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                  >
                    PNG (transparent)
                  </button>
                  <button
                    onClick={() => setDownloadFormat('jpg')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${downloadFormat === 'jpg' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}
                  >
                    JPG (smaller file)
                  </button>
                </div>
                {downloadFormat === 'jpg' && bgMode === 'transparent' && (
                  <p className="text-xs text-gray-500 mt-2">JPG does not support transparency. A white background will be used.</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!resultUrl && (
                <button onClick={removeBg} disabled={processing || !scriptLoaded} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90 disabled:opacity-50">
                  {processing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Eraser size={16} /> Remove Background</>}
                </button>
              )}
              {resultUrl && (
                <>
                  <button onClick={downloadTransparent} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90">
                    <Download size={16} />
                    Download {downloadFormat.toUpperCase()}
                  </button>
                  {bgMode !== 'transparent' && (
                    <button onClick={downloadComposite} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25">
                      <Download size={16} />
                      Download With Background
                    </button>
                  )}
                </>
              )}
              <button onClick={reset} className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5">
                <RefreshCw size={16} />
                New Image
              </button>
            </div>
          </div>
        )}
      </main>

      
    </div>
  )
}
