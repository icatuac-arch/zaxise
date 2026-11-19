'use client'

import { useState, useRef } from 'react'


import { Palette, Copy, Check, Plus, Image as ImageIcon, Sparkles, Eye, Download } from 'lucide-react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break
      case g: h = ((b - r) / d + 2); break
      case b: h = ((r - g) / d + 4); break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

function rgbToCmyk(r: number, g: number, b: number) {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const k = 1 - Math.max(r1, g1, b1)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return {
    c: Math.round(((1 - r1 - k) / (1 - k)) * 100),
    m: Math.round(((1 - g1 - k) / (1 - k)) * 100),
    y: Math.round(((1 - b1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(hex1: string, hex2: string): number {
  const a = hexToRgb(hex1)!
  const b = hexToRgb(hex2)!
  const l1 = relativeLuminance(a.r, a.g, a.b)
  const l2 = relativeLuminance(b.r, b.g, b.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getContrastText(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const lum = relativeLuminance(rgb.r, rgb.g, rgb.b)
  return lum > 0.5 ? '#000000' : '#FFFFFF'
}

// Color harmony rules
function generateHarmony(color: string, rule: string): string[] {
  const rgb = hexToRgb(color)
  if (!rgb) return [color]
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const colors: string[] = [color]
  const wrap = (h: number) => ((h % 360) + 360) % 360

  switch (rule) {
    case 'complementary': {
      const c = hslToRgb(wrap(hsl.h + 180), hsl.s, hsl.l)
      colors.push(rgbToHex(c.r, c.g, c.b))
      break
    }
    case 'triadic': {
      const a = hslToRgb(wrap(hsl.h + 120), hsl.s, hsl.l)
      const b = hslToRgb(wrap(hsl.h + 240), hsl.s, hsl.l)
      colors.push(rgbToHex(a.r, a.g, a.b), rgbToHex(b.r, b.g, b.b))
      break
    }
    case 'analogous': {
      const a = hslToRgb(wrap(hsl.h + 30), hsl.s, hsl.l)
      const b = hslToRgb(wrap(hsl.h - 30), hsl.s, hsl.l)
      colors.push(rgbToHex(a.r, a.g, a.b), rgbToHex(b.r, b.g, b.b))
      break
    }
    case 'split-complementary': {
      const a = hslToRgb(wrap(hsl.h + 150), hsl.s, hsl.l)
      const b = hslToRgb(wrap(hsl.h + 210), hsl.s, hsl.l)
      colors.push(rgbToHex(a.r, a.g, a.b), rgbToHex(b.r, b.g, b.b))
      break
    }
    case 'tetradic': {
      const a = hslToRgb(wrap(hsl.h + 90), hsl.s, hsl.l)
      const b = hslToRgb(wrap(hsl.h + 180), hsl.s, hsl.l)
      const c = hslToRgb(wrap(hsl.h + 270), hsl.s, hsl.l)
      colors.push(rgbToHex(a.r, a.g, a.b), rgbToHex(b.r, b.g, b.b), rgbToHex(c.r, c.g, c.b))
      break
    }
    case 'monochromatic': {
      for (const lDelta of [-30, -15, 15, 30]) {
        const newL = Math.max(0, Math.min(100, hsl.l + lDelta))
        const c = hslToRgb(hsl.h, hsl.s, newL)
        colors.push(rgbToHex(c.r, c.g, c.b))
      }
      break
    }
  }
  return colors
}

// Extract dominant colors from an image using color quantization
function extractColors(imageEl: HTMLImageElement, count = 8): string[] {
  const canvas = document.createElement('canvas')
  const maxSize = 200
  const ratio = Math.min(maxSize / imageEl.width, maxSize / imageEl.height)
  canvas.width = Math.floor(imageEl.width * ratio)
  canvas.height = Math.floor(imageEl.height * ratio)
  const ctx = canvas.getContext('2d')
  if (!ctx) return []
  ctx.drawImage(imageEl, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

  // Sample pixels and bucket into 32-step bins
  const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {}
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] >> 5 << 5
    const g = data[i + 1] >> 5 << 5
    const b = data[i + 2] >> 5 << 5
    const a = data[i + 3]
    if (a < 128) continue
    const key = `${r},${g},${b}`
    if (!buckets[key]) buckets[key] = { r: data[i], g: data[i + 1], b: data[i + 2], count: 0 }
    buckets[key].count++
  }

  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count)
  return sorted.slice(0, count).map(b => rgbToHex(b.r, b.g, b.b))
}

const PRESETS = [
  '#FF9933', '#FFFFFF', '#138808', '#000080',
  '#E8970A', '#F4C430', '#D4A017', '#FFD700',
  '#E85D75', '#9B59B6', '#1ABC9C', '#2ECC71',
  '#3498DB', '#E74C3C', '#34495E', '#1A1726',
]

const HARMONY_RULES = [
  { key: 'complementary', label: 'Complementary' },
  { key: 'triadic', label: 'Triadic' },
  { key: 'analogous', label: 'Analogous' },
  { key: 'split-complementary', label: 'Split Complementary' },
  { key: 'tetradic', label: 'Tetradic' },
  { key: 'monochromatic', label: 'Monochromatic' },
]

export default function ColorPickerPage() {
  const [color, setColor] = useState('#E8970A')
  const [palette, setPalette] = useState<string[]>([])
  const [copied, setCopied] = useState('')
  const [tab, setTab] = useState<'picker' | 'extract' | 'palette' | 'contrast'>('picker')
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [extractedImage, setExtractedImage] = useState('')
  const [harmonyRule, setHarmonyRule] = useState('complementary')
  const [contrastBg, setContrastBg] = useState('#FFFFFF')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rgb = hexToRgb(color)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  const formats: Array<{ label: string; value: string }> = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { label: 'RGBA', value: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : '' },
    { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    { label: 'HSLA', value: hsl ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` : '' },
    { label: 'CMYK', value: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : '' },
    { label: 'CSS Var', value: `--brand: ${color.toUpperCase()};` },
    { label: 'Tailwind', value: `bg-[${color.toUpperCase()}]` },
  ]

  const copyValue = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  const addToPalette = (c: string = color) => {
    if (!palette.includes(c)) setPalette([...palette, c])
  }

  const removeFromPalette = (c: string) => setPalette(palette.filter(p => p !== c))

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setExtractedImage(url)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const colors = extractColors(img, 10)
      setExtractedColors(colors)
    }
    img.src = url
  }

  const exportPalette = () => {
    const text = palette.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'palette.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPaletteCSS = () => {
    const css = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')
    const text = `:root {\n${css}\n}`
    const blob = new Blob([text], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'palette.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Contrast info
  const contrast = contrastRatio(color, contrastBg)
  const wcagAA = contrast >= 4.5
  const wcagAALarge = contrast >= 3
  const wcagAAA = contrast >= 7
  const wcagAAALarge = contrast >= 4.5

  // Harmony colors
  const harmonyColors = generateHarmony(color, harmonyRule)

  const contrastText = getContrastText(color)

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Palette size={28} />
            Color Studio
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Pick colors, extract from images, generate palettes, check contrast — all in one place.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-end gap-0.5">
              {['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'].map((c, i) => (
                <div key={c} className="rounded-t" style={{ backgroundColor: c, width: '20px', height: `${24 + i * 6}px` }} />
              ))}
            </div>
            <div className="ml-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E8970A]" />
                <code className="text-[10px] font-mono text-gray-400">#E8970A</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">RGB</span>
                <code className="text-[10px] font-mono text-gray-400">232, 151, 10</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">HSL</span>
                <code className="text-[10px] font-mono text-gray-400">38, 92%, 47%</code>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Pick any color</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Get HEX, RGB, HSL values</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy to clipboard</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Also extracts colors from uploaded images.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'picker', label: 'Picker', icon: Palette },
            { key: 'extract', label: 'Extract from Image', icon: ImageIcon },
            { key: 'palette', label: 'Generate Palette', icon: Sparkles },
            { key: 'contrast', label: 'Contrast Checker', icon: Eye },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${tab === t.key ? 'bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30' : 'text-gray-400 border border-[#1A1726] hover:bg-white/5'}`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* PICKER */}
        {tab === 'picker' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <HexColorPicker color={color} onChange={setColor} style={{ width: '100%' }} />
              </div>
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Quick Presets</h3>
                <div className="grid grid-cols-8 gap-2">
                  {PRESETS.map(c => (
                    <button key={c} onClick={() => setColor(c)} className={`h-10 rounded-lg border-2 ${color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[#1A1726] overflow-hidden">
                <div className="h-40 flex items-center justify-center text-3xl font-bold transition-colors" style={{ backgroundColor: color, color: contrastText, fontFamily: 'Playfair Display, serif' }}>
                  {color.toUpperCase()}
                </div>
                <div className="p-3 bg-[#0F0D1A] flex items-center gap-2">
                  <span className="text-xs text-gray-500">HEX:</span>
                  <HexColorInput color={color} onChange={setColor} prefixed className="flex-1 px-3 py-1.5 rounded bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
                  <button onClick={() => addToPalette()} className="px-3 py-1.5 rounded bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-xs hover:bg-[#E8970A]/25">
                    <Plus size={12} className="inline mr-1" />Save
                  </button>
                </div>
              </div>

              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Color Values</h3>
                <div className="space-y-2">
                  {formats.map(f => (
                    <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726]">
                      <div className="text-xs text-gray-500 w-16">{f.label}</div>
                      <code className="flex-1 text-sm text-gray-200 font-mono truncate">{f.value}</code>
                      <button onClick={() => copyValue(f.label, f.value)} className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white">
                        {copied === f.label ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXTRACT FROM IMAGE */}
        {tab === 'extract' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
              {!extractedImage ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-[#1A1726] hover:border-[#E8970A]/50 rounded-xl p-12 text-center transition-colors">
                  <ImageIcon size={40} className="mx-auto text-gray-500 mb-3" />
                  <p className="text-white font-medium">Upload an image to extract colors</p>
                  <p className="text-xs text-gray-500 mt-1">We'll find the 10 most prominent colors</p>
                </button>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img src={extractedImage} alt="" className="w-full h-auto rounded-lg max-h-[400px] object-contain" />
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Extracted Colors</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {extractedColors.map(c => (
                        <button key={c} onClick={() => { setColor(c); setTab('picker') }} className="flex items-center gap-2 p-2 rounded-lg border border-[#1A1726] hover:border-[#E8970A]/40">
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: c }} />
                          <code className="text-xs text-gray-300 font-mono">{c}</code>
                          <button onClick={(e) => { e.stopPropagation(); addToPalette(c) }} className="ml-auto text-gray-500 hover:text-[#E8970A]">
                            <Plus size={12} />
                          </button>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => { setExtractedImage(''); setExtractedColors([]) }} className="mt-3 text-xs text-gray-500 hover:text-white">Choose different image</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PALETTE GENERATOR */}
        {tab === 'palette' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Color Harmony Rules</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {HARMONY_RULES.map(r => (
                  <button key={r.key} onClick={() => setHarmonyRule(r.key)} className={`px-3 py-1.5 rounded-lg text-xs ${harmonyRule === r.key ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mb-3">Based on: <code className="text-[#E8970A]">{color.toUpperCase()}</code></div>
              <div className="flex gap-2 h-32">
                {harmonyColors.map((c, i) => (
                  <button key={i} onClick={() => addToPalette(c)} className="flex-1 rounded-lg relative group" style={{ backgroundColor: c }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-lg transition-opacity">
                      <code className="text-xs font-mono px-2 py-1 rounded bg-black/50">{c}</code>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => harmonyColors.forEach(c => addToPalette(c))} className="mt-3 px-4 py-2 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-xs">
                <Plus size={12} className="inline mr-1" />
                Save All to Palette
              </button>
            </div>
          </div>
        )}

        {/* CONTRAST CHECKER */}
        {tab === 'contrast' && (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">WCAG Contrast Checker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Foreground</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                  <code className="text-sm text-gray-300 font-mono">{color.toUpperCase()}</code>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={contrastBg} onChange={(e) => setContrastBg(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                  <code className="text-sm text-gray-300 font-mono">{contrastBg.toUpperCase()}</code>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-8 mb-4 text-center" style={{ backgroundColor: contrastBg, color: color }}>
              <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>The quick brown fox</div>
              <div className="text-sm">jumps over the lazy dog</div>
            </div>

            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white">{contrast.toFixed(2)}:1</div>
              <div className="text-sm text-gray-400">Contrast Ratio</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'AA Normal', pass: wcagAA, threshold: '4.5:1' },
                { label: 'AA Large', pass: wcagAALarge, threshold: '3:1' },
                { label: 'AAA Normal', pass: wcagAAA, threshold: '7:1' },
                { label: 'AAA Large', pass: wcagAAALarge, threshold: '4.5:1' },
              ].map(t => (
                <div key={t.label} className={`rounded-lg p-3 text-center ${t.pass ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <div className={`text-2xl ${t.pass ? 'text-green-400' : 'text-red-400'}`}>{t.pass ? '✓' : '✗'}</div>
                  <div className="text-xs text-white mt-1">{t.label}</div>
                  <div className="text-xs text-gray-500">{t.threshold}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Palette (always visible at bottom) */}
        {palette.length > 0 && (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">My Palette ({palette.length})</h3>
              <div className="flex gap-2">
                <button onClick={exportPalette} className="text-xs text-[#E8970A] hover:underline flex items-center gap-1">
                  <Download size={11} />.txt
                </button>
                <button onClick={exportPaletteCSS} className="text-xs text-[#E8970A] hover:underline flex items-center gap-1">
                  <Download size={11} />.css
                </button>
                <button onClick={() => setPalette([])} className="text-xs text-red-400 hover:underline">Clear</button>
              </div>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
              {palette.map(c => (
                <button key={c} onClick={() => removeFromPalette(c)} className="h-12 rounded-lg relative group border border-[#1A1726]" style={{ backgroundColor: c }} title={`${c} — click to remove`}>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-xs text-white">×</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      
    </div>
  )
}
