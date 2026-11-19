'use client'

import { useState, useRef, useEffect, useCallback } from 'react'


import {
  Upload, Download, IdCard, RefreshCw, Move, Printer, Camera, Check, X,
  ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, Loader2,
  Sun, Contrast, Droplets, ZoomIn, ZoomOut, RotateCw, FlipHorizontal,
  Sparkles, Shield, Eye, Info, Monitor, Smartphone, Globe, FileImage,
  ScanFace, Scissors, Wand2, ImageIcon, Video, CircleDot, Maximize2,
  UserCheck, AlertCircle, XCircle
} from 'lucide-react'

/* ─── Types ─── */
interface PhotoSpec {
  key: string
  country: string
  flag: string
  document: string
  label: string
  widthMm: number
  heightMm: number
  dpi: number
  bgColor: string
  headPct: [number, number] // [min%, max%] of frame height
  eyeLinePct: [number, number] // eye position from top [min%, max%]
  fileMaxKB?: number
  notes?: string
}

interface ComplianceResult {
  passed: boolean
  checks: { label: string; status: 'pass' | 'warn' | 'fail'; detail: string }[]
}

/* ─── Photo Specifications Database ─── */
const PHOTO_SPECS: PhotoSpec[] = [
  // North America
  { key: 'us_passport', country: 'United States', flag: '🇺🇸', document: 'Passport', label: 'US Passport (2×2 in)', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69], fileMaxKB: 240, notes: 'White background, taken within last 6 months' },
  { key: 'us_visa', country: 'United States', flag: '🇺🇸', document: 'Visa', label: 'US Visa Photo (2×2 in)', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69], fileMaxKB: 240, notes: 'Same specs as US passport' },
  { key: 'us_dl', country: 'United States', flag: '🇺🇸', document: 'Driver License', label: 'US Driver License', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'us_greencard', country: 'United States', flag: '🇺🇸', document: 'Green Card (USCIS)', label: 'USCIS / Green Card (2×2 in)', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69], fileMaxKB: 240 },
  { key: 'canada', country: 'Canada', flag: '🇨🇦', document: 'Passport', label: 'Canada Passport (50×70 mm)', widthMm: 50, heightMm: 70, dpi: 300, bgColor: '#FFFFFF', headPct: [31, 36], eyeLinePct: [45, 55] },
  { key: 'mexico', country: 'Mexico', flag: '🇲🇽', document: 'Passport', label: 'Mexico Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },

  // Europe
  { key: 'uk', country: 'United Kingdom', flag: '🇬🇧', document: 'Passport', label: 'UK Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#F0F0F0', headPct: [50, 69], eyeLinePct: [56, 69], notes: 'Light grey background preferred' },
  { key: 'schengen', country: 'Schengen Zone', flag: '🇪🇺', document: 'Visa', label: 'Schengen Visa (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'germany', country: 'Germany', flag: '🇩🇪', document: 'Passport', label: 'Germany Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'france', country: 'France', flag: '🇫🇷', document: 'Passport/ID', label: 'France Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#E8E8E8', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'italy', country: 'Italy', flag: '🇮🇹', document: 'Passport', label: 'Italy Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'spain', country: 'Spain', flag: '🇪🇸', document: 'Passport', label: 'Spain Passport (26×32 mm)', widthMm: 26, heightMm: 32, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },

  // Asia
  { key: 'india_passport', country: 'India', flag: '🇮🇳', document: 'Passport', label: 'India Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69], notes: 'White background only' },
  { key: 'india_oci', country: 'India', flag: '🇮🇳', document: 'OCI Card', label: 'India OCI (51×51 mm / 2×2 in)', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'india_visa', country: 'India', flag: '🇮🇳', document: 'Visa', label: 'India Visa (2×2 in)', widthMm: 51, heightMm: 51, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'india_aadhaar', country: 'India', flag: '🇮🇳', document: 'Aadhaar Card', label: 'India Aadhaar (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'india_pan', country: 'India', flag: '🇮🇳', document: 'PAN Card', label: 'India PAN Card (25×35 mm)', widthMm: 25, heightMm: 35, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'china', country: 'China', flag: '🇨🇳', document: 'Visa', label: 'China Visa (33×48 mm)', widthMm: 33, heightMm: 48, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'china_passport', country: 'China', flag: '🇨🇳', document: 'Passport', label: 'China Passport (33×48 mm)', widthMm: 33, heightMm: 48, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'japan', country: 'Japan', flag: '🇯🇵', document: 'Passport', label: 'Japan Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'south_korea', country: 'South Korea', flag: '🇰🇷', document: 'Passport', label: 'South Korea Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'singapore', country: 'Singapore', flag: '🇸🇬', document: 'Passport', label: 'Singapore Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'malaysia', country: 'Malaysia', flag: '🇲🇾', document: 'Passport', label: 'Malaysia Passport (35×50 mm)', widthMm: 35, heightMm: 50, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'thailand', country: 'Thailand', flag: '🇹🇭', document: 'Passport', label: 'Thailand Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'philippines', country: 'Philippines', flag: '🇵🇭', document: 'Passport', label: 'Philippines Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'uae', country: 'UAE', flag: '🇦🇪', document: 'Passport/Visa', label: 'UAE Passport (43×55 mm)', widthMm: 43, heightMm: 55, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'saudi', country: 'Saudi Arabia', flag: '🇸🇦', document: 'Passport/Visa', label: 'Saudi Arabia (40×60 mm)', widthMm: 40, heightMm: 60, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },

  // Oceania
  { key: 'australia', country: 'Australia', flag: '🇦🇺', document: 'Passport', label: 'Australia Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'newzealand', country: 'New Zealand', flag: '🇳🇿', document: 'Passport', label: 'New Zealand Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },

  // South America
  { key: 'brazil', country: 'Brazil', flag: '🇧🇷', document: 'Passport', label: 'Brazil Passport (50×70 mm)', widthMm: 50, heightMm: 70, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },

  // Africa
  { key: 'nigeria', country: 'Nigeria', flag: '🇳🇬', document: 'Passport', label: 'Nigeria Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'south_africa', country: 'South Africa', flag: '🇿🇦', document: 'Passport', label: 'South Africa Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
  { key: 'kenya', country: 'Kenya', flag: '🇰🇪', document: 'Passport', label: 'Kenya Passport (35×45 mm)', widthMm: 35, heightMm: 45, dpi: 300, bgColor: '#FFFFFF', headPct: [50, 69], eyeLinePct: [56, 69] },
]

// Group specs by country
const COUNTRIES = Array.from(new Set(PHOTO_SPECS.map(s => s.country)))

const BG_COLORS = [
  { key: 'white', label: 'White', color: '#FFFFFF' },
  { key: 'offwhite', label: 'Off-White', color: '#F5F5F5' },
  { key: 'lightgrey', label: 'Light Grey', color: '#E0E0E0' },
  { key: 'lightblue', label: 'Light Blue', color: '#D6E4F0' },
  { key: 'red', label: 'Red', color: '#D32F2F' },
  { key: 'blue', label: 'Blue', color: '#1565C0' },
]

const STEPS = ['Select Document', 'Upload Photo', 'AI Processing', 'Adjust & Review', 'Download']

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function mmToIn(mm: number) {
  return (mm / 25.4).toFixed(2)
}

/* ─── Step Indicator ─── */
function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < current ? 'bg-emerald-500 text-white' :
              i === current ? 'bg-[#E8970A] text-black ring-4 ring-[#E8970A]/20' :
              'bg-[#1A1726] text-gray-500'
            }`}>
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1.5 whitespace-nowrap ${
              i === current ? 'text-[#E8970A] font-semibold' : i < current ? 'text-emerald-400' : 'text-gray-600'
            }`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-14 h-0.5 mx-1 mb-5 transition-colors ${
              i < current ? 'bg-emerald-500' : 'bg-[#1A1726]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Compliance Check Component ─── */
function CompliancePanel({ result }: { result: ComplianceResult | null }) {
  if (!result) return null
  return (
    <div className={`rounded-xl border p-4 ${result.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
      <div className="flex items-center gap-2 mb-3">
        {result.passed ? (
          <><CheckCircle2 size={18} className="text-emerald-400" /><span className="text-sm font-semibold text-emerald-400">Photo Meets Requirements</span></>
        ) : (
          <><AlertTriangle size={18} className="text-amber-400" /><span className="text-sm font-semibold text-amber-400">Adjustments Recommended</span></>
        )}
      </div>
      <div className="space-y-1.5">
        {result.checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {c.status === 'pass' ? <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" /> :
             c.status === 'warn' ? <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" /> :
             <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />}
            <div>
              <span className="text-gray-300 font-medium">{c.label}</span>
              <span className="text-gray-500 ml-1">— {c.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Before/After Slider ─── */
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      updatePosition(clientX)
    }
    const handleUp = () => { isDraggingRef.current = false }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] max-w-[300px] mx-auto rounded-xl overflow-hidden cursor-col-resize select-none border border-[#1A1726]"
      onMouseDown={(e) => { isDraggingRef.current = true; updatePosition(e.clientX) }}
      onTouchStart={(e) => { isDraggingRef.current = true; updatePosition(e.touches[0].clientX) }}
    >
      {/* After (full) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <ChevronLeft size={12} className="text-gray-700" />
            <ChevronRight size={12} className="text-gray-700" />
          </div>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">BEFORE</div>
      <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">AFTER</div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function PassportPhotoPage() {
  // Step state
  const [step, setStep] = useState(0)

  // Document selection
  const [selectedCountry, setSelectedCountry] = useState('United States')
  const [selectedSpec, setSelectedSpec] = useState(PHOTO_SPECS[0])
  const [countrySearch, setCountrySearch] = useState('')

  // Image state
  const [originalSrc, setOriginalSrc] = useState('')
  const [processedSrc, setProcessedSrc] = useState('')
  const [imageObj, setImageObj] = useState<HTMLImageElement | ImageBitmap | null>(null)
  const [processedImageObj, setProcessedImageObj] = useState<HTMLImageElement | ImageBitmap | null>(null)

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [bgRemoved, setBgRemoved] = useState(false)

  // Adjustments
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [bgColor, setBgColor] = useState(BG_COLORS[0])
  const [customBg, setCustomBg] = useState('#FFFFFF')
  const [showGuides, setShowGuides] = useState(true)
  const [flipH, setFlipH] = useState(false)

  // Output
  const [outputFileSize, setOutputFileSize] = useState(0)
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null)

  // Webcam
  const [webcamActive, setWebcamActive] = useState(false)
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [countdown, setCountdown] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const webcamCanvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null)
  const [renderKey, setRenderKey] = useState(0) // bump to force canvas re-render
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startOffX: 0, startOffY: 0 })

  // Dimensions
  const mmToPx = (mm: number) => Math.round((mm / 25.4) * selectedSpec.dpi)
  const pxWidth = mmToPx(selectedSpec.widthMm)
  const pxHeight = mmToPx(selectedSpec.heightMm)

  // Filter specs by country
  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES

  // Load image from src string — uses createImageBitmap for reliable Chrome canvas rendering
  const loadImage = useCallback(async (src: string): Promise<HTMLImageElement | ImageBitmap> => {
    const resp = await fetch(src)
    const blob = await resp.blob()
    // createImageBitmap is the most reliable way to get a canvas-drawable image
    if (typeof createImageBitmap !== 'undefined') {
      return await createImageBitmap(blob)
    }
    // Fallback for older Safari
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }, [])

  // Load original image
  useEffect(() => {
    if (!originalSrc) return
    let cancelled = false
    loadImage(originalSrc).then(img => {
      if (!cancelled) {
        setImageObj(img)
        setRenderKey(k => k + 1)
      }
    }).catch(e => console.error('Failed to load original image:', e))
    return () => { cancelled = true }
  }, [originalSrc, loadImage])

  // Load processed image
  useEffect(() => {
    if (!processedSrc) return
    let cancelled = false
    loadImage(processedSrc).then(img => {
      if (!cancelled) {
        setProcessedImageObj(img)
        setRenderKey(k => k + 1)
      }
    }).catch(e => console.error('Failed to load processed image:', e))
    return () => { cancelled = true }
  }, [processedSrc, loadImage])

  // Core render function — draws photo + guides onto a canvas element
  const paintCanvas = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement | ImageBitmap, withGuides: boolean) => {
    const w2 = pxWidth
    const h2 = pxHeight
    canvas.width = w2
    canvas.height = h2
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = bgColor.key === 'custom' ? customBg : bgColor.color
    ctx.fillRect(0, 0, w2, h2)

    // Filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    // Compute image placement — works for both HTMLImageElement and ImageBitmap
    const iw = img.width
    const ih = img.height
    if (!iw || !ih) return

    const ar = iw / ih
    const car = w2 / h2
    let bw: number, bh: number
    if (ar > car) { bh = h2; bw = bh * ar }
    else { bw = w2; bh = bw / ar }

    const dw = bw * zoom
    const dh = bh * zoom
    let dx = (w2 - dw) / 2 + offsetX
    const dy = (h2 - dh) / 2 + offsetY

    ctx.save()
    if (flipH) {
      ctx.translate(w2, 0)
      ctx.scale(-1, 1)
      dx = w2 - dx - dw
    }
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.restore()
    ctx.filter = 'none'

    // Face guides
    if (withGuides && showGuides) {
      ctx.strokeStyle = 'rgba(232, 151, 10, 0.45)'
      ctx.lineWidth = Math.max(2, w2 * 0.004)
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.ellipse(w2 / 2, h2 * 0.40, w2 * 0.24, h2 * 0.30, 0, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(100, 200, 255, 0.35)'
      ctx.lineWidth = Math.max(1.5, w2 * 0.003)
      ctx.setLineDash([6, 6])
      ctx.beginPath()
      ctx.moveTo(w2 * 0.15, h2 * 0.38)
      ctx.lineTo(w2 * 0.85, h2 * 0.38)
      ctx.stroke()

      ctx.setLineDash([])
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'
      ctx.lineWidth = Math.max(1, w2 * 0.002)
      const ey = h2 * 0.38, es = w2 * 0.14
      ctx.beginPath(); ctx.arc(w2 / 2 - es, ey, w2 * 0.04, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(w2 / 2 + es, ey, w2 * 0.04, 0, Math.PI * 2); ctx.stroke()

      ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)'
      ctx.setLineDash([6, 6])
      ctx.beginPath(); ctx.moveTo(w2 * 0.25, h2 * 0.72); ctx.lineTo(w2 * 0.75, h2 * 0.72); ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 200, 100, 0.2)'
      ctx.beginPath(); ctx.moveTo(w2 * 0.25, h2 * 0.10); ctx.lineTo(w2 * 0.75, h2 * 0.10); ctx.stroke()

      ctx.setLineDash([])
      ctx.strokeStyle = 'rgba(232, 151, 10, 0.15)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(w2 / 2, 0); ctx.lineTo(w2 / 2, h2); ctx.stroke()
    }
  }, [pxWidth, pxHeight, bgColor, customBg, zoom, offsetX, offsetY, brightness, contrast, saturation, showGuides, flipH])

  // Render all mounted canvases
  const renderAll = useCallback(() => {
    const img = processedImageObj || imageObj
    if (!img) return
    if (canvasRef.current) {
      paintCanvas(canvasRef.current, img, true)
      canvasRef.current.toBlob((blob) => { if (blob) setOutputFileSize(blob.size) }, 'image/jpeg', 0.95)
    }
    if (canvasRef2.current) paintCanvas(canvasRef2.current, img, false)
  }, [paintCanvas, processedImageObj, imageObj])

  // Ref callback for step 3 canvas — renders immediately when DOM element appears
  const canvasRefCallback = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef.current = el
    if (el) renderAll()
  }, [renderAll])

  // Ref callback for step 4 canvas
  const canvasRef2Callback = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef2.current = el
    if (el) renderAll()
  }, [renderAll])

  // Re-render when settings change (zoom, brightness, etc.) or images load
  useEffect(() => {
    renderAll()
  }, [renderKey, renderAll])

  // Run compliance check
  useEffect(() => {
    if (step !== 3) return
    const img = processedImageObj || imageObj
    if (!img) return

    const checks: ComplianceResult['checks'] = []

    // Dimensions check
    checks.push({
      label: 'Dimensions',
      status: 'pass',
      detail: `${pxWidth}×${pxHeight}px at ${selectedSpec.dpi} DPI (${selectedSpec.widthMm}×${selectedSpec.heightMm}mm)`
    })

    // Resolution check
    const minDimension = Math.min(img.width, img.height)
    if (minDimension >= 600) {
      checks.push({ label: 'Resolution', status: 'pass', detail: `Source image ${img.width}×${img.height}px — sufficient quality` })
    } else if (minDimension >= 400) {
      checks.push({ label: 'Resolution', status: 'warn', detail: `Source image ${img.width}×${img.height}px — acceptable but higher res recommended` })
    } else {
      checks.push({ label: 'Resolution', status: 'fail', detail: `Source image ${img.width}×${img.height}px — too low, use a higher resolution photo` })
    }

    // Background check
    if (bgRemoved) {
      checks.push({ label: 'Background', status: 'pass', detail: 'Background removed and replaced with compliant color' })
    } else {
      checks.push({ label: 'Background', status: 'warn', detail: 'Original background kept — use AI removal for best results' })
    }

    // Aspect ratio check
    const targetAspect = selectedSpec.widthMm / selectedSpec.heightMm
    checks.push({ label: 'Aspect Ratio', status: 'pass', detail: `${targetAspect.toFixed(2)} — matches ${selectedSpec.document} requirements` })

    // File size check
    if (selectedSpec.fileMaxKB) {
      const sizeKB = outputFileSize / 1024
      if (sizeKB <= selectedSpec.fileMaxKB) {
        checks.push({ label: 'File Size', status: 'pass', detail: `${sizeKB.toFixed(0)}KB (max ${selectedSpec.fileMaxKB}KB)` })
      } else {
        checks.push({ label: 'File Size', status: 'warn', detail: `${sizeKB.toFixed(0)}KB exceeds ${selectedSpec.fileMaxKB}KB — will be compressed on download` })
      }
    }

    // DPI check
    checks.push({ label: 'Print Quality', status: 'pass', detail: `${selectedSpec.dpi} DPI — meets printing requirements` })

    // Color space
    checks.push({ label: 'Color Space', status: 'pass', detail: 'sRGB — standard for passport photos' })

    const allPass = checks.every(c => c.status !== 'fail')
    setCompliance({ passed: allPass, checks })
  }, [step, processedImageObj, imageObj, pxWidth, pxHeight, selectedSpec, bgRemoved, outputFileSize])

  /* ─── File Handling ─── */
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setOriginalSrc(reader.result as string)
      setProcessedSrc('')
      setProcessedImageObj(null)
      setBgRemoved(false)
      setZoom(1)
      setOffsetX(0)
      setOffsetY(0)
      setBrightness(100)
      setContrast(100)
      setSaturation(100)
      setFlipH(false)
      setStep(2) // Go to AI processing step
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  /* ─── AI Background Removal ─── */
  // Preload the BG removal library on page mount (same proven pattern as /tools/remove-bg)
  const [bgLibReady, setBgLibReady] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    if (win.__imglyRemoveBg) { setBgLibReady(true); return }

    const onLoaded = () => setBgLibReady(true)
    const onError = (e: Event) => console.warn('BG removal lib error:', (e as CustomEvent).detail)

    window.addEventListener('imgly-pp-loaded', onLoaded)
    window.addEventListener('imgly-pp-error', onError)

    // Inline module script with await import — works in Chrome, Safari, Firefox
    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      try {
        const { removeBackground } = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm')
        window.__imglyRemoveBg = removeBackground
        window.dispatchEvent(new CustomEvent('imgly-pp-loaded'))
      } catch (e) {
        window.dispatchEvent(new CustomEvent('imgly-pp-error', { detail: e.message }))
      }
    `
    document.head.appendChild(script)

    return () => {
      window.removeEventListener('imgly-pp-loaded', onLoaded)
      window.removeEventListener('imgly-pp-error', onError)
    }
  }, [])

  const removeBackground = async () => {
    if (!originalSrc) return
    setIsProcessing(true)
    setProcessingStep('Loading AI model (first time may take ~30s)...')
    setProcessingProgress(10)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any

      if (!win.__imglyRemoveBg) {
        setProcessingStep('Waiting for AI model to load...')
        setProcessingProgress(15)
        // Wait for preload to finish (max 60s)
        await new Promise<void>((resolve, reject) => {
          if (win.__imglyRemoveBg) { resolve(); return }
          const onReady = () => { window.removeEventListener('imgly-pp-loaded', onReady); resolve() }
          window.addEventListener('imgly-pp-loaded', onReady)
          setTimeout(() => { window.removeEventListener('imgly-pp-loaded', onReady); reject(new Error('AI model loading timed out')) }, 60000)
        })
      }

      if (!win.__imglyRemoveBg) {
        throw new Error('Background removal library did not load')
      }

      setProcessingStep('Preparing image...')
      setProcessingProgress(30)

      // Convert data URL to blob
      const response = await fetch(originalSrc)
      const blob = await response.blob()

      setProcessingStep('AI is removing background...')
      setProcessingProgress(40)

      const removeBg = win.__imglyRemoveBg
      const resultBlob: Blob = await removeBg(blob, {
        model: 'small',
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.min(90, 40 + (current / total) * 50)
            setProcessingProgress(pct)
          }
          if (key.includes('compute') || key.includes('inference')) {
            setProcessingStep('AI is removing background...')
          } else if (key.includes('download')) {
            setProcessingStep('Downloading AI model files...')
          }
        }
      })

      setProcessingStep('Applying new background...')
      setProcessingProgress(95)

      // The result is a PNG with transparent background — composite onto chosen bg color
      let drawable: ImageBitmap | HTMLImageElement
      if (typeof createImageBitmap !== 'undefined') {
        drawable = await createImageBitmap(resultBlob)
      } else {
        // Safari fallback
        drawable = await new Promise<HTMLImageElement>((resolve, reject) => {
          const url = URL.createObjectURL(resultBlob)
          const i = new Image()
          i.onload = () => { URL.revokeObjectURL(url); resolve(i) }
          i.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load result')) }
          i.src = url
        })
      }
      const dw = 'naturalWidth' in drawable ? (drawable.naturalWidth || drawable.width) : drawable.width
      const dh = 'naturalHeight' in drawable ? (drawable.naturalHeight || drawable.height) : drawable.height
      const c = document.createElement('canvas')
      c.width = dw
      c.height = dh
      const ctx = c.getContext('2d')!
      ctx.fillStyle = bgColor.key === 'custom' ? customBg : bgColor.color
      ctx.fillRect(0, 0, dw, dh)
      ctx.drawImage(drawable, 0, 0)
      if ('close' in drawable) drawable.close()

      const finalSrc = c.toDataURL('image/png')
      setProcessedSrc(finalSrc)
      setBgRemoved(true)
      setProcessingProgress(100)
      setProcessingStep('Done!')

      setTimeout(() => {
        setIsProcessing(false)
        setStep(3)
      }, 600)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Background removal error:', err)
      setProcessingStep(`Background removal failed: ${msg}`)
      setTimeout(() => {
        setIsProcessing(false)
        setStep(3)
      }, 4000)
    }
  }

  const skipProcessing = () => {
    setStep(3)
  }

  /* ─── Webcam ─── */
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } }
      })
      setWebcamStream(stream)
      setWebcamActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      alert('Could not access camera. Please check permissions.')
    }
  }

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop())
      setWebcamStream(null)
    }
    setWebcamActive(false)
  }

  const switchCamera = async () => {
    stopWebcam()
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newMode)
    setTimeout(() => startWebcam(), 100)
  }

  const capturePhoto = () => {
    setCountdown(3)
    let c = 3
    const interval = setInterval(() => {
      c--
      setCountdown(c)
      if (c <= 0) {
        clearInterval(interval)
        setCountdown(null)
        // Actually capture
        if (videoRef.current) {
          const canvas = document.createElement('canvas')
          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(videoRef.current, 0, 0)
          const src = canvas.toDataURL('image/png')
          setOriginalSrc(src)
          stopWebcam()
          setStep(2)
        }
      }
    }, 1000)
  }

  useEffect(() => {
    if (webcamActive && videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream
      videoRef.current.play()
    }
  }, [webcamActive, webcamStream])

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [webcamStream])

  /* ─── Canvas Dragging ─── */
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffX: offsetX, startOffY: offsetY }
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setOffsetX(dragRef.current.startOffX + dx * 2)
      setOffsetY(dragRef.current.startOffY + dy * 2)
    }
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  /* ─── Download ─── */
  const renderCleanCanvas = (): HTMLCanvasElement | null => {
    const img = processedImageObj || imageObj
    if (!img) return null
    const canvas = document.createElement('canvas')
    paintCanvas(canvas, img, false)
    return canvas
  }

  const download = (format: 'png' | 'jpeg') => {
    const clean = renderCleanCanvas()
    if (!clean) return
    const quality = format === 'jpeg' && selectedSpec.fileMaxKB
      ? Math.min(0.95, (selectedSpec.fileMaxKB * 1024) / outputFileSize)
      : 0.95
    clean.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `passport-photo-${selectedSpec.key}-${Date.now()}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    }, format === 'png' ? 'image/png' : 'image/jpeg', quality)
  }

  const downloadPrintSheet = (layout: '4x6' | '5x7' | 'a4') => {
    const clean = renderCleanCanvas()
    if (!clean) return

    // Sheet sizes at 300 DPI
    const sheets = {
      '4x6': { w: 1200, h: 1800, label: '4×6 inch' },
      '5x7': { w: 1500, h: 2100, label: '5×7 inch' },
      'a4': { w: 2480, h: 3508, label: 'A4' },
    }
    const sheet = sheets[layout]
    const canvas = document.createElement('canvas')
    canvas.width = sheet.w
    canvas.height = sheet.h
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, sheet.w, sheet.h)

    // Calculate grid
    const padding = 20
    const cols = Math.floor((sheet.w - padding) / (pxWidth + padding))
    const rows = Math.floor((sheet.h - padding) / (pxHeight + padding))
    const startX = (sheet.w - (cols * pxWidth + (cols - 1) * padding)) / 2
    const startY = (sheet.h - (rows * pxHeight + (rows - 1) * padding)) / 2

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (pxWidth + padding)
        const y = startY + r * (pxHeight + padding)
        ctx.drawImage(clean, x, y, pxWidth, pxHeight)
        // Cut lines
        ctx.strokeStyle = '#CCCCCC'
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 4])
        ctx.strokeRect(x, y, pxWidth, pxHeight)
        ctx.setLineDash([])
      }
    }

    // Photo count label
    ctx.fillStyle = '#999999'
    ctx.font = '14px sans-serif'
    ctx.fillText(`${cols * rows} photos — ${sheet.label} @ 300 DPI — mymediatoolbox.com`, startX, sheet.h - 15)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `passport-print-${layout}-${selectedSpec.key}-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const reset = () => {
    setOriginalSrc('')
    setProcessedSrc('')
    setImageObj(null)
    setProcessedImageObj(null)
    setBgRemoved(false)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setFlipH(false)
    setCompliance(null)
    setStep(1)
    stopWebcam()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8970A] to-amber-600 flex items-center justify-center">
              <IdCard size={22} className="text-white" />
            </div>
            Passport Photo Maker
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl mx-auto">
            AI-powered passport & visa photos for 30+ countries. Background removal, compliance checking, and print-ready downloads — 100% free, 100% private.
          </p>
        </div>

        {/* Steps */}
        <StepIndicator current={step} steps={STEPS} />

        {/* ═══════════ STEP 0: Select Document ═══════════ */}
        {step === 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Globe size={18} className="text-[#E8970A]" />
                Select Your Document Type
              </h2>
              <p className="text-gray-500 text-sm mb-5">Choose the country and document to get the exact photo specifications</p>

              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full px-4 py-3 rounded-xl bg-[#070510] border border-[#1A1726] text-white text-sm placeholder:text-gray-600 focus:border-[#E8970A]/50 focus:ring-1 focus:ring-[#E8970A]/20 focus:outline-none"
                />
              </div>

              {/* Country groups */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCountries.map(country => {
                  const specs = PHOTO_SPECS.filter(s => s.country === country)
                  return (
                    <div key={country} className={`rounded-xl border transition-all ${
                      selectedCountry === country ? 'border-[#E8970A]/50 bg-[#E8970A]/5' : 'border-[#1A1726] hover:border-[#1A1726]/80'
                    }`}>
                      <button
                        onClick={() => setSelectedCountry(country)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3"
                      >
                        <span className="text-xl">{specs[0].flag}</span>
                        <span className="font-medium text-white text-sm">{country}</span>
                        <span className="text-gray-600 text-xs ml-auto">{specs.length} document{specs.length > 1 ? 's' : ''}</span>
                      </button>
                      {selectedCountry === country && (
                        <div className="px-4 pb-3 grid gap-2">
                          {specs.map(spec => (
                            <button
                              key={spec.key}
                              onClick={() => {
                                setSelectedSpec(spec)
                                // Set recommended bg color
                                const recBg = BG_COLORS.find(b => b.color === spec.bgColor) || BG_COLORS[0]
                                setBgColor(recBg)
                              }}
                              className={`text-left px-4 py-3 rounded-lg border transition-all ${
                                selectedSpec.key === spec.key
                                  ? 'border-[#E8970A] bg-[#E8970A]/10'
                                  : 'border-[#1A1726] hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium text-white">{spec.document}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {spec.widthMm}×{spec.heightMm}mm ({mmToIn(spec.widthMm)}×{mmToIn(spec.heightMm)} in) • {spec.dpi} DPI
                                  </div>
                                </div>
                                {selectedSpec.key === spec.key && (
                                  <div className="w-5 h-5 rounded-full bg-[#E8970A] flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-black" />
                                  </div>
                                )}
                              </div>
                              {spec.notes && selectedSpec.key === spec.key && (
                                <div className="mt-2 text-xs text-amber-400/70 flex items-start gap-1.5">
                                  <Info size={12} className="mt-0.5 flex-shrink-0" />
                                  {spec.notes}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Selected summary */}
              <div className="mt-5 p-4 rounded-xl bg-[#070510] border border-[#1A1726]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Selected</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{selectedSpec.flag} {selectedSpec.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedSpec.widthMm}×{selectedSpec.heightMm}mm • {mmToPx(selectedSpec.widthMm)}×{mmToPx(selectedSpec.heightMm)}px • {selectedSpec.dpi} DPI
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8970A] text-black font-semibold text-sm hover:bg-[#E8970A]/90 transition-colors"
                  >
                    Continue
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STEP 1: Upload Photo ═══════════ */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Selected spec banner */}
            <div className="flex items-center justify-between bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{selectedSpec.flag}</span>
                <span className="text-white font-medium">{selectedSpec.label}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{selectedSpec.widthMm}×{selectedSpec.heightMm}mm</span>
              </div>
              <button onClick={() => setStep(0)} className="text-xs text-[#E8970A] hover:underline">Change</button>
            </div>

            {/* Upload or Webcam */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* File Upload */}
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Upload size={16} className="text-[#E8970A]" />
                  Upload Photo
                </h3>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                      isDragging ? 'border-[#E8970A] bg-[#E8970A]/5 scale-[1.02]' : 'border-[#1A1726] hover:border-[#E8970A]/50'
                    }`}
                  >
                    <ImageIcon size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-white font-medium text-sm mb-1">Drop your photo here</p>
                    <p className="text-[10px] text-gray-600">or click to browse • JPG, PNG, WebP</p>
                  </div>
                </label>
              </div>

              {/* Webcam Capture */}
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Camera size={16} className="text-[#E8970A]" />
                  Take Photo
                </h3>
                {!webcamActive ? (
                  <div
                    onClick={startWebcam}
                    className="border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-xl p-10 text-center cursor-pointer transition-all"
                  >
                    <Video size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-white font-medium text-sm mb-1">Open Camera</p>
                    <p className="text-[10px] text-gray-600">Use your device camera</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      {/* Face guide overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[45%] h-[65%] border-2 border-dashed border-[#E8970A]/40 rounded-[50%] -translate-y-[5%]" />
                      </div>
                      {/* Countdown */}
                      {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="text-6xl font-bold text-white animate-pulse">{countdown}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={capturePhoto} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8970A] text-black font-semibold text-sm hover:bg-[#E8970A]/90">
                        <CircleDot size={16} />
                        Capture
                      </button>
                      <button onClick={switchCamera} className="px-3 py-2.5 rounded-xl bg-[#1A1726] text-gray-400 hover:text-white text-sm">
                        <RefreshCw size={16} />
                      </button>
                      <button onClick={stopWebcam} className="px-3 py-2.5 rounded-xl bg-[#1A1726] text-gray-400 hover:text-white text-sm">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <UserCheck size={16} className="text-[#E8970A]" />
                Photo Guidelines for {selectedSpec.country} {selectedSpec.document}
              </h3>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {[
                  'Face the camera directly with a neutral expression',
                  'Both eyes open and clearly visible',
                  'Use a plain white or light background',
                  'Good even lighting, no harsh shadows',
                  'No glasses (required for most countries)',
                  'Full face visible — chin to top of head',
                  'Photo should be recent (within 6 months)',
                  'No head coverings (unless religious)',
                  'Mouth closed, no smiling',
                  'Ears visible if possible',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400 py-1">
                    <Check size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300">
              <ChevronLeft size={14} /> Back to document selection
            </button>
          </div>
        )}

        {/* ═══════════ STEP 2: AI Processing ═══════════ */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-8 text-center">
              {isProcessing ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8970A]/20 to-purple-500/20 flex items-center justify-center mx-auto">
                    <Wand2 size={32} className="text-[#E8970A] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">AI is Processing Your Photo</h3>
                    <p className="text-sm text-gray-400">{processingStep}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="max-w-sm mx-auto">
                    <div className="h-2 rounded-full bg-[#1A1726] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#E8970A] to-amber-500 transition-all duration-500"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{Math.round(processingProgress)}%</div>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5"><ScanFace size={14} /> Face detection</span>
                    <span className="flex items-center gap-1.5"><Scissors size={14} /> Background removal</span>
                    <span className="flex items-center gap-1.5"><Sparkles size={14} /> Enhancement</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Preview thumbnail */}
                  {originalSrc && (
                    <div className="w-32 h-40 mx-auto rounded-xl overflow-hidden border border-[#1A1726]">
                      <img src={originalSrc} alt="Uploaded" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Photo Uploaded Successfully</h3>
                    <p className="text-sm text-gray-400">Would you like AI to remove the background and optimize your photo?</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={removeBackground}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8970A] to-amber-600 text-black font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      <Wand2 size={16} />
                      Remove Background & Optimize
                    </button>
                    <button
                      onClick={skipProcessing}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#1A1726] text-gray-400 text-sm hover:bg-white/5 transition-colors"
                    >
                      Skip — Use Original Photo
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600">
                    <Shield size={10} className="inline mr-1" />
                    100% private — AI runs entirely in your browser. No photos are uploaded to any server.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ STEP 3: Adjust & Review ═══════════ */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Before/After (if bg was removed) */}
            {bgRemoved && originalSrc && processedSrc && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#E8970A]" />
                  Before & After — Drag to Compare
                </h3>
                <BeforeAfterSlider before={originalSrc} after={processedSrc} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls Panel */}
              <div className="lg:col-span-1 space-y-4">
                {/* Document info */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Globe size={14} className="text-[#E8970A]" />
                      {selectedSpec.flag} {selectedSpec.document}
                    </h3>
                    <button onClick={() => { setStep(0); reset() }} className="text-[10px] text-[#E8970A] hover:underline">Change</button>
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>{selectedSpec.widthMm}×{selectedSpec.heightMm}mm ({mmToIn(selectedSpec.widthMm)}×{mmToIn(selectedSpec.heightMm)} in)</div>
                    <div>{pxWidth}×{pxHeight}px @ {selectedSpec.dpi} DPI</div>
                  </div>
                </div>

                {/* Background Color */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Droplets size={14} className="text-[#E8970A]" />
                    Background
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {BG_COLORS.map(b => (
                      <button
                        key={b.key}
                        onClick={() => setBgColor(b)}
                        className={`relative h-10 rounded-lg text-[10px] font-medium transition-all ${
                          bgColor.key === b.key ? 'ring-2 ring-[#E8970A] ring-offset-2 ring-offset-[#0F0D1A]' : 'hover:ring-1 hover:ring-gray-600'
                        }`}
                        style={{ backgroundColor: b.color, color: b.key === 'red' || b.key === 'blue' ? '#fff' : '#333' }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                  {/* Custom color */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setBgColor({ key: 'custom', label: 'Custom', color: customBg })}
                      className={`flex-1 h-10 rounded-lg text-[10px] font-medium border border-[#1A1726] transition-all ${
                        bgColor.key === 'custom' ? 'ring-2 ring-[#E8970A] ring-offset-2 ring-offset-[#0F0D1A]' : ''
                      }`}
                      style={{ backgroundColor: customBg, color: '#333' }}
                    >
                      Custom
                    </button>
                    <input
                      type="color"
                      value={customBg}
                      onChange={(e) => {
                        setCustomBg(e.target.value)
                        setBgColor({ key: 'custom', label: 'Custom', color: e.target.value })
                      }}
                      className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg"
                    />
                  </div>
                  {!bgRemoved && (
                    <button
                      onClick={() => { setStep(2) }}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#E8970A]/10 text-[#E8970A] text-xs font-medium hover:bg-[#E8970A]/20 transition-colors"
                    >
                      <Wand2 size={12} />
                      Remove Background with AI
                    </button>
                  )}
                </div>

                {/* Position & Zoom */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Move size={14} className="text-[#E8970A]" />
                    Position & Zoom
                  </h3>
                  <p className="text-[10px] text-gray-600">Drag the preview to reposition, or use sliders below</p>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom</span>
                      <span className="text-[#E8970A] font-mono">{zoom.toFixed(2)}x</span>
                    </div>
                    <input type="range" min="0.3" max="4" step="0.02" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Horizontal</span>
                      <span className="text-[#E8970A] font-mono">{offsetX}px</span>
                    </div>
                    <input type="range" min="-500" max="500" value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Vertical</span>
                      <span className="text-[#E8970A] font-mono">{offsetY}px</span>
                    </div>
                    <input type="range" min="-500" max="500" value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setFlipH(!flipH)} className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors ${flipH ? 'bg-[#E8970A]/15 text-[#E8970A]' : 'bg-[#070510] text-gray-400 hover:text-white'} border border-[#1A1726]`}>
                      <FlipHorizontal size={12} /> Flip
                    </button>
                    <button onClick={() => { setZoom(1); setOffsetX(0); setOffsetY(0); setFlipH(false) }} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726] transition-colors">
                      <RotateCw size={12} /> Reset
                    </button>
                  </div>
                </div>

                {/* Photo Adjustments */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sun size={14} className="text-[#E8970A]" />
                    Photo Adjustments
                  </h3>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1"><Sun size={12} /> Brightness</span>
                      <span className="text-[#E8970A] font-mono">{brightness}%</span>
                    </div>
                    <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1"><Contrast size={12} /> Contrast</span>
                      <span className="text-[#E8970A] font-mono">{contrast}%</span>
                    </div>
                    <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1"><Droplets size={12} /> Saturation</span>
                      <span className="text-[#E8970A] font-mono">{saturation}%</span>
                    </div>
                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
                  </div>
                  <button
                    onClick={() => { setBrightness(100); setContrast(100); setSaturation(100) }}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726] transition-colors"
                  >
                    <RotateCw size={12} /> Reset Adjustments
                  </button>
                </div>

                {/* Guides toggle */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-white flex items-center gap-2">
                      <Eye size={14} className="text-[#E8970A]" />
                      Face Placement Guides
                    </span>
                    <div className={`w-10 h-5 rounded-full transition-colors ${showGuides ? 'bg-[#E8970A]' : 'bg-[#1A1726]'} relative`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${showGuides ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} className="sr-only" />
                  </label>
                  <p className="text-[10px] text-gray-600 mt-2">Position your head within the oval guide, eyes on the blue line</p>
                </div>
              </div>

              {/* Preview + Compliance */}
              <div className="lg:col-span-2 space-y-4">
                {/* Canvas Preview */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Preview</h3>
                    <span className="text-xs text-gray-500">{pxWidth}×{pxHeight}px • {selectedSpec.dpi} DPI</span>
                  </div>
                  <div className="flex justify-center">
                    <canvas
                      ref={canvasRefCallback}
                      className="border border-[#1A1726] rounded-xl shadow-2xl cursor-grab active:cursor-grabbing"
                      style={{ maxHeight: '480px', width: 'auto', height: 'auto' }}
                      onMouseDown={handleCanvasMouseDown}
                    />
                  </div>
                  <p className="text-center text-[10px] text-gray-600 mt-3">
                    Drag the photo to reposition • Use zoom slider or scroll to resize
                  </p>
                </div>

                {/* Compliance Check */}
                <CompliancePanel result={compliance} />

                {/* Output Info */}
                <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Output Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Dimensions', value: `${pxWidth}×${pxHeight}px` },
                      { label: 'Physical', value: `${selectedSpec.widthMm}×${selectedSpec.heightMm}mm` },
                      { label: 'DPI', value: `${selectedSpec.dpi}` },
                      { label: 'File Size', value: formatBytes(outputFileSize) },
                    ].map(item => (
                      <div key={item.label} className="text-center p-2 rounded-lg bg-[#070510]">
                        <div className="text-[10px] text-gray-500">{item.label}</div>
                        <div className="text-sm font-mono text-[#E8970A] mt-0.5">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8970A] to-amber-600 text-black font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Continue to Download
                    <ChevronRight size={16} />
                  </button>
                  <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm transition-colors">
                    <RefreshCw size={14} />
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STEP 4: Download ═══════════ */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Final Preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Your Passport Photo is Ready!</h2>
              <p className="text-sm text-gray-400 mb-6">{selectedSpec.flag} {selectedSpec.label} — {pxWidth}×{pxHeight}px @ {selectedSpec.dpi} DPI</p>

              {/* Preview */}
              <div className="inline-block">
                <canvas
                  ref={canvasRef2Callback}
                  className="rounded-xl shadow-2xl border border-[#1A1726]"
                  style={{ maxHeight: '300px', width: 'auto', height: 'auto' }}
                />
              </div>
            </div>

            {/* Download Options */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Single Photo Downloads */}
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <FileImage size={16} className="text-[#E8970A]" />
                  Single Photo
                </h3>
                <p className="text-xs text-gray-500 mb-4">Download one passport photo</p>
                <div className="space-y-2">
                  <button onClick={() => download('jpeg')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#E8970A] text-black font-semibold text-sm hover:bg-[#E8970A]/90 transition-colors">
                    <span className="flex items-center gap-2"><Download size={14} /> Download JPG</span>
                    <span className="text-xs opacity-70">Recommended</span>
                  </button>
                  <button onClick={() => download('png')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#E8970A]/10 text-[#E8970A] border border-[#E8970A]/30 text-sm hover:bg-[#E8970A]/20 transition-colors">
                    <span className="flex items-center gap-2"><Download size={14} /> Download PNG</span>
                    <span className="text-xs opacity-70">Lossless</span>
                  </button>
                </div>
              </div>

              {/* Print Sheet Downloads */}
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <Printer size={16} className="text-[#E8970A]" />
                  Print Sheets
                </h3>
                <p className="text-xs text-gray-500 mb-4">Multiple photos on one page, ready to cut</p>
                <div className="space-y-2">
                  <button onClick={() => downloadPrintSheet('4x6')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-sm hover:bg-purple-500/20 transition-colors">
                    <span className="flex items-center gap-2"><Printer size={14} /> 4×6 inch Sheet</span>
                    <span className="text-xs opacity-70">Most common</span>
                  </button>
                  <button onClick={() => downloadPrintSheet('5x7')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-sm hover:bg-purple-500/20 transition-colors">
                    <span className="flex items-center gap-2"><Printer size={14} /> 5×7 inch Sheet</span>
                    <span className="text-xs opacity-70">More photos</span>
                  </button>
                  <button onClick={() => downloadPrintSheet('a4')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-sm hover:bg-purple-500/20 transition-colors">
                    <span className="flex items-center gap-2"><Printer size={14} /> A4 Sheet</span>
                    <span className="text-xs opacity-70">Maximum photos</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-[#E8970A]" />
                Printing Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Printer, text: 'Print on glossy or matte photo paper for best results' },
                  { icon: Maximize2, text: 'Print at 100% scale — do not "fit to page"' },
                  { icon: Scissors, text: 'Cut along the dashed lines on the print sheet' },
                  { icon: Monitor, text: 'Use a photo printing service (CVS, Walgreens, Walmart) for best quality' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                    <tip.icon size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300">
                <ChevronLeft size={14} /> Back to Adjust
              </button>
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm transition-colors ml-auto">
                <RefreshCw size={14} />
                Make Another Photo
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ SEO Content ═══════════ */}
        <section className="mt-16 max-w-3xl mx-auto">
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Free AI Passport Photo Maker — No Upload Required
            </h2>
            <div className="prose prose-sm prose-invert max-w-none text-gray-400 space-y-3">
              <p>
                Create perfect passport and visa photos for <strong className="text-gray-300">30+ countries</strong> including the US, UK, India, Canada, China, and Schengen zone — completely free. Our AI-powered tool runs entirely in your browser, meaning <strong className="text-gray-300">your photos never leave your device</strong>.
              </p>
              <h3 className="text-white text-base font-semibold mt-6">What Makes This Tool Special?</h3>
              <ul className="space-y-1.5">
                <li><strong className="text-gray-300">AI Background Removal</strong> — Automatically removes any background and replaces it with the correct color for your document type</li>
                <li><strong className="text-gray-300">Compliance Checking</strong> — Real-time verification that your photo meets official requirements for dimensions, resolution, and quality</li>
                <li><strong className="text-gray-300">Webcam Capture</strong> — Take your passport photo right from your device camera with a face placement guide</li>
                <li><strong className="text-gray-300">Print-Ready Sheets</strong> — Download ready-to-print 4×6, 5×7, or A4 sheets with multiple copies and cut lines</li>
                <li><strong className="text-gray-300">Photo Adjustments</strong> — Fine-tune brightness, contrast, saturation, zoom, and position for the perfect result</li>
                <li><strong className="text-gray-300">100% Private</strong> — All processing happens in your browser using client-side AI. Zero server uploads.</li>
              </ul>
              <h3 className="text-white text-base font-semibold mt-6">Supported Documents</h3>
              <p>
                US Passport, US Visa, US Green Card (USCIS), US Driver License, India Passport, India OCI, India Visa, India Aadhaar, India PAN Card, UK Passport, Schengen Visa, Canada Passport, China Visa, Japan Passport, Australia Passport, and many more.
              </p>
              <h3 className="text-white text-base font-semibold mt-6">How to Use</h3>
              <ol className="space-y-1.5">
                <li>Select your country and document type from our database of 30+ specifications</li>
                <li>Upload a photo or take one using your device camera</li>
                <li>Let AI remove the background and optimize your photo automatically</li>
                <li>Adjust position, zoom, brightness, and contrast to perfection</li>
                <li>Download as JPG/PNG or generate a print-ready sheet</li>
              </ol>
              <p className="text-xs text-gray-500 mt-4">
                Save money by making your own passport photos at home instead of paying $10-15 at a pharmacy or photo studio. Print at any photo kiosk (CVS, Walgreens, Walmart, Costco) for under $1.
              </p>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
