'use client'

import { useState, useRef, useEffect } from 'react'


import { Upload, Download, Star, Type } from 'lucide-react'

const SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 512]

export default function FaviconPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'image' | 'text'>('image')
  const [imageSrc, setImageSrc] = useState('')
  const [text, setText] = useState('IP')
  const [bgColor, setBgColor] = useState('#E8970A')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [shape, setShape] = useState<'square' | 'rounded' | 'circle'>('rounded')
  const [generated, setGenerated] = useState<{ size: number; dataUrl: string }[]>([])

  // Render preview when settings change
  useEffect(() => {
    if (!canvasRef.current) return
    drawCanvas(canvasRef.current, 256)
  }, [mode, imageSrc, text, bgColor, textColor, shape])

  const drawCanvas = async (canvas: HTMLCanvasElement, size: number) => {
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, size, size)

    // Shape mask
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
    } else if (shape === 'rounded') {
      const r = size * 0.2
      ctx.beginPath()
      ctx.moveTo(r, 0)
      ctx.lineTo(size - r, 0)
      ctx.quadraticCurveTo(size, 0, size, r)
      ctx.lineTo(size, size - r)
      ctx.quadraticCurveTo(size, size, size - r, size)
      ctx.lineTo(r, size)
      ctx.quadraticCurveTo(0, size, 0, size - r)
      ctx.lineTo(0, r)
      ctx.quadraticCurveTo(0, 0, r, 0)
      ctx.closePath()
      ctx.clip()
    }

    if (mode === 'image' && imageSrc) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>(resolve => { img.onload = () => resolve(); img.src = imageSrc })
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      const ratio = Math.min(size / img.width, size / img.height) * 0.85
      const w = img.width * ratio
      const h = img.height * ratio
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = textColor
      const fontSize = text.length === 1 ? size * 0.6 : text.length === 2 ? size * 0.5 : size * 0.35
      ctx.font = `bold ${fontSize}px "Playfair Display", serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.substring(0, 4), size / 2, size / 2 + fontSize * 0.05)
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generateAll = async () => {
    const results: { size: number; dataUrl: string }[] = []
    for (const size of SIZES) {
      const canvas = document.createElement('canvas')
      await drawCanvas(canvas, size)
      results.push({ size, dataUrl: canvas.toDataURL('image/png') })
    }
    setGenerated(results)
  }

  const downloadOne = (g: { size: number; dataUrl: string }) => {
    const a = document.createElement('a')
    a.href = g.dataUrl
    a.download = `favicon-${g.size}x${g.size}.png`
    a.click()
  }

  const downloadAll = async () => {
    for (const g of generated) {
      downloadOne(g)
      await new Promise(r => setTimeout(r, 150))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Star size={28} /> Favicon Generator
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Create favicons in all standard sizes from an image or text. Useful for event microsites and landing pages.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-lg border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">&#128444;</div>
              <span className="text-[10px] text-gray-500">Image</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[8px] font-bold">32</div>
              <span className="text-[10px] text-green-400">.ico</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload image</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Preview favicon</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download .ico</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Creates multiple sizes for different devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setMode('image')} className={`flex-1 px-4 py-2 rounded-lg text-sm ${mode === 'image' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                <Upload size={14} className="inline mr-1" />From Image
              </button>
              <button onClick={() => setMode('text')} className={`flex-1 px-4 py-2 rounded-lg text-sm ${mode === 'text' ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                <Type size={14} className="inline mr-1" />From Text
              </button>
            </div>

            {mode === 'image' ? (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <label className="block">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                  <div className="border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-lg p-6 text-center cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-500 mb-2" />
                    <div className="text-sm text-gray-400">{imageSrc ? 'Change image' : 'Upload an image (square recommended)'}</div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <label className="block text-xs text-gray-400 mb-2">Letters (max 4)</label>
                <input type="text" value={text} maxLength={4} onChange={(e) => setText(e.target.value.toUpperCase())} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-2xl text-center font-bold" />
              </div>
            )}

            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Background color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                  <code className="text-xs text-gray-300 font-mono">{bgColor}</code>
                </div>
              </div>
              {mode === 'text' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                    <code className="text-xs text-gray-300 font-mono">{textColor}</code>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shape</label>
                <div className="flex gap-2">
                  {(['square', 'rounded', 'circle'] as const).map(s => (
                    <button key={s} onClick={() => setShape(s)} className={`flex-1 px-3 py-1.5 rounded text-xs ${shape === s ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={generateAll} className="w-full py-3 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90">
              Generate All Sizes ({SIZES.length})
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 flex items-center justify-center">
              <canvas ref={canvasRef} className="rounded-lg" style={{ width: '256px', height: '256px' }} />
            </div>

            {/* Browser tab preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-3">Browser tab preview:</div>
              <div className="bg-[#1a1a2e] rounded-t-xl p-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-[#070510] border-b border-[#1A1726] max-w-[200px]">
                  <canvas ref={(c) => { if (c) drawCanvas(c, 16) }} className="flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                  <span className="text-xs text-gray-300 truncate">yoursite.com</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#070510]/50 mt-1">
                  <span className="text-[10px] text-gray-500">https://yoursite.com</span>
                </div>
              </div>
            </div>

            {/* Multi-size preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-3">Preview at different sizes:</div>
              <div className="flex items-end gap-4 flex-wrap">
                {[16, 32, 48, 64, 128].map(size => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <canvas
                      ref={(c) => { if (c) drawCanvas(c, size) }}
                      style={{ width: `${Math.min(size, 64)}px`, height: `${Math.min(size, 64)}px` }}
                      className="rounded"
                    />
                    <span className="text-[10px] text-gray-500">{size}px</span>
                  </div>
                ))}
              </div>
            </div>

            {generated.length > 0 && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Generated Sizes</h3>
                  <button onClick={downloadAll} className="text-xs text-[#E8970A] hover:underline">
                    <Download size={11} className="inline mr-1" />Download All
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {generated.map(g => (
                    <button key={g.size} onClick={() => downloadOne(g)} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5">
                      <img src={g.dataUrl} alt={`${g.size}px`} className="w-12 h-12" />
                      <span className="text-xs text-gray-500">{g.size}px</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
