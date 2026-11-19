'use client'

import { useState, useRef, useCallback, useEffect } from 'react'


import { Upload, Download, Monitor, Smartphone, Tablet } from 'lucide-react'

type DeviceType = 'iphone' | 'android' | 'samsung' | 'macbook' | 'ipad' | 'browser'

interface DeviceConfig {
  value: DeviceType
  label: string
  icon: typeof Smartphone
  width: number
  height: number
  screenX: number
  screenY: number
  screenW: number
  screenH: number
  radius: number
}

const DEVICES: DeviceConfig[] = [
  { value: 'iphone', label: 'iPhone 15', icon: Smartphone, width: 430, height: 880, screenX: 20, screenY: 70, screenW: 390, screenH: 760, radius: 50 },
  { value: 'android', label: 'Pixel / Android', icon: Smartphone, width: 420, height: 860, screenX: 18, screenY: 60, screenW: 384, screenH: 750, radius: 30 },
  { value: 'samsung', label: 'Samsung Galaxy', icon: Smartphone, width: 415, height: 870, screenX: 15, screenY: 55, screenW: 385, screenH: 770, radius: 35 },
  { value: 'macbook', label: 'MacBook Pro', icon: Monitor, width: 1200, height: 780, screenX: 100, screenY: 40, screenW: 1000, screenH: 625, radius: 12 },
  { value: 'ipad', label: 'iPad Pro', icon: Tablet, width: 700, height: 940, screenX: 30, screenY: 50, screenW: 640, screenH: 850, radius: 24 },
  { value: 'browser', label: 'Browser Window', icon: Monitor, width: 1100, height: 750, screenX: 4, screenY: 44, screenW: 1092, screenH: 702, radius: 12 },
]

const BG_OPTIONS = [
  { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Purple' },
  { value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Pink' },
  { value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Blue' },
  { value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Green' },
  { value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', label: 'Sunset' },
  { value: '#1a1a2e', label: 'Dark' },
  { value: '#ffffff', label: 'White' },
  { value: 'transparent', label: 'None' },
]

function parseGradient(css: string): { type: 'solid'; color: string } | { type: 'gradient'; stops: { color: string; pos: number }[]; angle: number } {
  if (css === 'transparent') return { type: 'solid', color: 'transparent' }
  const gradMatch = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)/)
  if (!gradMatch) return { type: 'solid', color: css }
  const angle = parseInt(gradMatch[1])
  const stopsStr = gradMatch[2]
  const stops = stopsStr.split(',').map(s => {
    const parts = s.trim().split(/\s+/)
    return { color: parts[0], pos: parseInt(parts[1]) / 100 }
  })
  return { type: 'gradient', stops, angle }
}

export default function ScreenshotMockupPage() {
  const [screenshot, setScreenshot] = useState<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [device, setDevice] = useState<DeviceType>('iphone')
  const [bg, setBg] = useState(BG_OPTIONS[0].value)
  const [customBgColor, setCustomBgColor] = useState('#667eea')
  const [showShadow, setShowShadow] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => setScreenshot(img)
    img.src = url
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadImage(file)
  }

  const drawDevice = useCallback((ctx: CanvasRenderingContext2D, cfg: DeviceConfig, img: HTMLImageElement) => {
    const padding = 80
    const totalW = cfg.width + padding * 2
    const totalH = cfg.height + padding * 2
    const canvas = ctx.canvas
    canvas.width = totalW
    canvas.height = totalH

    // Background
    const parsed = parseGradient(bg)
    if (parsed.type === 'solid') {
      if (parsed.color === 'transparent') {
        ctx.clearRect(0, 0, totalW, totalH)
      } else {
        ctx.fillStyle = parsed.color
        ctx.fillRect(0, 0, totalW, totalH)
      }
    } else {
      const rad = (parsed.angle - 90) * Math.PI / 180
      const grad = ctx.createLinearGradient(
        totalW / 2 - Math.cos(rad) * totalW / 2,
        totalH / 2 - Math.sin(rad) * totalH / 2,
        totalW / 2 + Math.cos(rad) * totalW / 2,
        totalH / 2 + Math.sin(rad) * totalH / 2
      )
      parsed.stops.forEach(s => grad.addColorStop(s.pos, s.color))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, totalW, totalH)
    }

    const ox = padding
    const oy = padding

    // Shadow behind device
    if (showShadow) {
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 10
      ctx.beginPath()
      ctx.roundRect(ox, oy, cfg.width, cfg.height, cfg.radius)
      ctx.fillStyle = '#1a1a1a'
      ctx.fill()
      ctx.restore()
    }

    // Device body
    ctx.save()
    ctx.beginPath()
    const r = cfg.radius
    ctx.roundRect(ox, oy, cfg.width, cfg.height, r)
    ctx.fillStyle = '#1a1a1a'
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.stroke()

    // Device-specific details
    if (cfg.value === 'iphone') {
      // Notch
      const notchW = 120, notchH = 28
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.roundRect(ox + cfg.width / 2 - notchW / 2, oy, notchW, notchH, [0, 0, 12, 12])
      ctx.fill()
      // Home indicator
      ctx.fillStyle = '#555'
      ctx.beginPath()
      ctx.roundRect(ox + cfg.width / 2 - 50, oy + cfg.height - 24, 100, 4, 2)
      ctx.fill()
    } else if (cfg.value === 'android') {
      // Camera dot
      ctx.fillStyle = '#333'
      ctx.beginPath()
      ctx.arc(ox + cfg.width / 2, oy + 30, 8, 0, Math.PI * 2)
      ctx.fill()
    } else if (cfg.value === 'samsung') {
      // Camera punch hole
      ctx.fillStyle = '#333'
      ctx.beginPath()
      ctx.arc(ox + cfg.width / 2, oy + 28, 7, 0, Math.PI * 2)
      ctx.fill()
      // Bottom nav bar hint
      ctx.fillStyle = '#555'
      ctx.beginPath()
      ctx.roundRect(ox + cfg.width / 2 - 40, oy + cfg.height - 20, 80, 4, 2)
      ctx.fill()
    } else if (cfg.value === 'macbook') {
      // Bottom bezel / base
      ctx.fillStyle = '#2a2a2a'
      ctx.beginPath()
      ctx.roundRect(ox - 40, oy + cfg.height - 10, cfg.width + 80, 30, [0, 0, 8, 8])
      ctx.fill()
      ctx.strokeStyle = '#333'
      ctx.stroke()
      // Camera
      ctx.fillStyle = '#333'
      ctx.beginPath()
      ctx.arc(ox + cfg.width / 2, oy + 20, 4, 0, Math.PI * 2)
      ctx.fill()
    } else if (cfg.value === 'ipad') {
      // Camera
      ctx.fillStyle = '#333'
      ctx.beginPath()
      ctx.arc(ox + cfg.width / 2, oy + 25, 5, 0, Math.PI * 2)
      ctx.fill()
    } else if (cfg.value === 'browser') {
      // Toolbar
      ctx.fillStyle = '#2a2a2a'
      ctx.beginPath()
      ctx.roundRect(ox, oy, cfg.width, 40, [r, r, 0, 0])
      ctx.fill()
      // Traffic lights
      const dots = ['#ff5f57', '#ffbd2e', '#28c840']
      dots.forEach((c, i) => {
        ctx.fillStyle = c
        ctx.beginPath()
        ctx.arc(ox + 20 + i * 22, oy + 20, 6, 0, Math.PI * 2)
        ctx.fill()
      })
      // URL bar
      ctx.fillStyle = '#444'
      ctx.beginPath()
      ctx.roundRect(ox + 100, oy + 10, cfg.width - 140, 20, 6)
      ctx.fill()
    }

    // Screen area - clip and draw screenshot
    ctx.beginPath()
    ctx.rect(ox + cfg.screenX, oy + cfg.screenY, cfg.screenW, cfg.screenH)
    ctx.clip()

    // Draw image cover-fit
    const imgRatio = img.naturalWidth / img.naturalHeight
    const screenRatio = cfg.screenW / cfg.screenH
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
    if (imgRatio > screenRatio) {
      sw = img.naturalHeight * screenRatio
      sx = (img.naturalWidth - sw) / 2
    } else {
      sh = img.naturalWidth / screenRatio
      sy = (img.naturalHeight - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, ox + cfg.screenX, oy + cfg.screenY, cfg.screenW, cfg.screenH)
    ctx.restore()
  }, [bg, showShadow])

  const renderMockup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !screenshot) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cfg = DEVICES.find(d => d.value === device) || DEVICES[0]
    drawDevice(ctx, cfg, screenshot)
  }, [screenshot, device, drawDevice])

  useEffect(() => {
    renderMockup()
  }, [renderMockup])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `mockup-${device}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Screenshot Mockup
        </h1>
        <p className="text-gray-400 mb-4">Place your screenshot in a device frame. All processing happens in your browser.</p>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">&#128247;</div>
              <span className="text-[10px] text-gray-500">Screenshot</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center">
                <div className="w-8 h-10 rounded border border-green-400/60 bg-green-500/20 flex items-center justify-center text-green-400 text-[8px]">&#128241;</div>
              </div>
              <span className="text-[10px] text-green-400">Mockup</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload screenshot</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Choose device</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download mockup</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> iPhone, MacBook, iPad, and browser frames available.
          </p>
        </div>

        {!screenshot ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
            style={{ background: '#0F0D1A' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4 text-[#E8970A]" size={48} />
            <p className="text-white text-lg mb-1">Drop a screenshot here or click to upload</p>
            <p className="text-gray-500 text-sm">Supports JPG, PNG, WebP</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f) }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-5 rounded-2xl p-6 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <Monitor size={18} className="text-[#E8970A]" /> Device Frame
              </h2>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Device</label>
                <div className="space-y-1.5">
                  {DEVICES.map((d) => {
                    const Icon = d.icon
                    return (
                      <button
                        key={d.value}
                        onClick={() => setDevice(d.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${device === d.value ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                      >
                        <Icon size={16} /> {d.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Background</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {BG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBg(opt.value)}
                      className={`h-10 rounded-lg border-2 transition-colors ${bg === opt.value ? 'border-[#E8970A]' : 'border-[#1A1726]'}`}
                      style={{ background: opt.value === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px' : opt.value }}
                      title={opt.label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs text-gray-400">Custom color:</label>
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => { setCustomBgColor(e.target.value); setBg(e.target.value) }}
                    className="w-8 h-8 rounded cursor-pointer border border-[#1A1726] bg-transparent"
                  />
                  <button
                    onClick={() => setBg(customBgColor)}
                    className="text-xs text-[#E8970A] hover:underline"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={showShadow}
                  onChange={(e) => setShowShadow(e.target.checked)}
                  className="accent-[#E8970A] w-4 h-4"
                />
                <span className="text-gray-300 text-sm">Drop shadow on device frame</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] text-black font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={() => setScreenshot(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#1A1726] text-gray-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 rounded-2xl p-4 border border-[#1A1726] flex items-center justify-center" style={{ background: '#0F0D1A' }}>
              <canvas ref={canvasRef} className="max-w-full max-h-[650px] rounded-lg" />
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
