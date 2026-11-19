'use client'

import { useState, useMemo, useCallback } from 'react'


import { Copy, Check, Palette, Plus, Trash2, Shuffle, Sparkles } from 'lucide-react'

interface ColorStop {
  color: string
  position: number
  id: number
}

const PRESETS = [
  { name: 'Sunset', type: 'linear' as const, angle: 135, stops: [{ color: '#FF512F', position: 0 }, { color: '#F09819', position: 100 }] },
  { name: 'Ocean', type: 'linear' as const, angle: 135, stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
  { name: 'Purple Haze', type: 'linear' as const, angle: 135, stops: [{ color: '#7B4397', position: 0 }, { color: '#DC2430', position: 100 }] },
  { name: 'Emerald', type: 'linear' as const, angle: 135, stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
  { name: 'Midnight', type: 'linear' as const, angle: 135, stops: [{ color: '#232526', position: 0 }, { color: '#414345', position: 100 }] },
  { name: 'Peach', type: 'linear' as const, angle: 135, stops: [{ color: '#ED4264', position: 0 }, { color: '#FFEDBC', position: 100 }] },
  { name: 'Aurora', type: 'linear' as const, angle: 135, stops: [{ color: '#00c6ff', position: 0 }, { color: '#0072ff', position: 50 }, { color: '#7c3aed', position: 100 }] },
  { name: 'Fire', type: 'linear' as const, angle: 0, stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
  { name: 'Cotton Candy', type: 'radial' as const, angle: 0, stops: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }] },
  { name: 'Northern Lights', type: 'linear' as const, angle: 45, stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 50 }, { color: '#667eea', position: 100 }] },
  { name: 'Mango', type: 'linear' as const, angle: 120, stops: [{ color: '#ffe259', position: 0 }, { color: '#ffa751', position: 100 }] },
  { name: 'Royal', type: 'linear' as const, angle: 135, stops: [{ color: '#141E30', position: 0 }, { color: '#243B55', position: 100 }] },
  { name: 'Cherry', type: 'linear' as const, angle: 90, stops: [{ color: '#EB3349', position: 0 }, { color: '#F45C43', position: 100 }] },
  { name: 'Aqua', type: 'linear' as const, angle: 180, stops: [{ color: '#13547a', position: 0 }, { color: '#80d0c7', position: 100 }] },
  { name: 'Lavender', type: 'linear' as const, angle: 135, stops: [{ color: '#ee9ca7', position: 0 }, { color: '#ffdde1', position: 100 }] },
]

let nextId = 3

// Tailwind gradient class approximation
function getTailwindGradient(angle: number, stops: ColorStop[]): string {
  const directions: Record<number, string> = {
    0: 'bg-gradient-to-t', 45: 'bg-gradient-to-tr', 90: 'bg-gradient-to-r',
    135: 'bg-gradient-to-br', 180: 'bg-gradient-to-b', 225: 'bg-gradient-to-bl',
    270: 'bg-gradient-to-l', 315: 'bg-gradient-to-tl',
  }
  const closest = Object.keys(directions).map(Number).reduce((a, b) => Math.abs(b - angle) < Math.abs(a - angle) ? b : a)
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  const from = sorted[0]?.color || '#000'
  const to = sorted[sorted.length - 1]?.color || '#fff'
  const via = sorted.length > 2 ? ` via-[${sorted[1].color}]` : ''
  return `${directions[closest]} from-[${from}]${via} to-[${to}]`
}

export default function CssGradientPage() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear')
  const [angle, setAngle] = useState(135)
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle')
  const [radialPosition, setRadialPosition] = useState('center')
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#E8970A', position: 0, id: 1 },
    { color: '#7c3aed', position: 100, id: 2 },
  ])
  const [copied, setCopied] = useState(false)
  const [copiedTw, setCopiedTw] = useState(false)

  const cssValue = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsStr})`
    } else if (gradientType === 'radial') {
      return `radial-gradient(${radialShape} at ${radialPosition}, ${stopsStr})`
    } else {
      return `conic-gradient(from ${angle}deg at ${radialPosition}, ${stopsStr})`
    }
  }, [gradientType, angle, radialShape, radialPosition, stops])

  const cssOutput = `background: ${cssValue};`
  const tailwindOutput = gradientType === 'linear' ? getTailwindGradient(angle, stops) : ''

  const addStop = () => {
    const newPos = Math.round(Math.random() * 100)
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setStops([...stops, { color: randomColor, position: newPos, id: nextId++ }])
  }

  const removeStop = (id: number) => {
    if (stops.length <= 2) return
    setStops(stops.filter(s => s.id !== id))
  }

  const updateStop = (id: number, field: 'color' | 'position', value: string | number) => {
    setStops(stops.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const randomGradient = () => {
    const types: ('linear' | 'radial' | 'conic')[] = ['linear', 'radial', 'conic']
    setGradientType(types[Math.floor(Math.random() * types.length)])
    setAngle(Math.floor(Math.random() * 360))
    const numStops = 2 + Math.floor(Math.random() * 2)
    const newStops: ColorStop[] = []
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        position: Math.round((i / (numStops - 1)) * 100),
        id: nextId++,
      })
    }
    setStops(newStops)
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setGradientType(preset.type)
    setAngle(preset.angle)
    setStops(preset.stops.map(s => ({ ...s, id: nextId++ })))
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyTailwind = async () => {
    await navigator.clipboard.writeText(tailwindOutput)
    setCopiedTw(true)
    setTimeout(() => setCopiedTw(false), 1500)
  }

  // Angle wheel position
  const wheelRadius = 40
  const angleRad = (angle - 90) * Math.PI / 180
  const dotX = 50 + wheelRadius * Math.cos(angleRad)
  const dotY = 50 + wheelRadius * Math.sin(angleRad)

  const handleWheelClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const x = e.clientX - rect.left - cx
    const y = e.clientY - rect.top - cy
    let a = Math.atan2(y, x) * 180 / Math.PI + 90
    if (a < 0) a += 360
    setAngle(Math.round(a))
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <Palette className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              CSS Gradient Generator
            </h1>
          </div>
          <p className="text-gray-400">Create beautiful CSS gradients visually</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-64 h-10 rounded-lg" style={{ background: 'linear-gradient(90deg, #E8970A, #7c3aed, #2193b0, #38ef7d)' }} />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Pick colors</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Adjust direction</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy CSS code</span>
          </div>
          <p className="text-center text-xs text-gray-500">Now with visual angle wheel, Tailwind output, and 15 presets.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">Preview</label>
              <div
                className="w-full h-64 rounded-xl border border-[#1A1726]"
                style={{ background: cssValue }}
              />
            </div>

            {/* CSS Output */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">CSS Output</label>
                <button
                  onClick={copyCSS}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <pre className="bg-[#070510] border border-[#1A1726] rounded-lg p-3 text-sm font-mono text-green-400 whitespace-pre-wrap break-all">
                {cssOutput}
              </pre>
            </div>

            {/* Tailwind Output */}
            {tailwindOutput && (
              <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Tailwind Classes</label>
                  <button
                    onClick={copyTailwind}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
                  >
                    {copiedTw ? <Check size={14} /> : <Copy size={14} />}
                    {copiedTw ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-[#070510] border border-[#1A1726] rounded-lg p-3 text-sm font-mono text-blue-400 whitespace-pre-wrap break-all">
                  {tailwindOutput}
                </pre>
              </div>
            )}

            {/* Presets Gallery */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">Gradient Gallery ({PRESETS.length} presets)</label>
              <div className="grid grid-cols-5 gap-2">
                {PRESETS.map((preset, i) => {
                  const s = [...preset.stops].sort((a, b) => a.position - b.position)
                  const stopsStr = s.map(st => `${st.color} ${st.position}%`).join(', ')
                  const bg = preset.type === 'linear'
                    ? `linear-gradient(${preset.angle}deg, ${stopsStr})`
                    : `radial-gradient(circle at center, ${stopsStr})`
                  return (
                    <button
                      key={i}
                      onClick={() => applyPreset(preset)}
                      className="aspect-square rounded-lg border border-[#1A1726] hover:border-[#E8970A] transition-colors relative group"
                      style={{ background: bg }}
                      title={preset.name}
                    >
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                        <span className="text-[10px] text-white font-medium">{preset.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Type & angle */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Gradient Type</label>
                <div className="flex gap-2">
                  {(['linear', 'radial', 'conic'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setGradientType(t)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                        gradientType === t
                          ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40'
                          : 'bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {(gradientType === 'linear' || gradientType === 'conic') && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                    <span>Angle</span>
                    <span className="text-[#E8970A]">{angle}deg</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Visual angle wheel */}
                    <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0 cursor-pointer" onClick={handleWheelClick}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1726" strokeWidth="2" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E8970A" strokeWidth="1" opacity="0.3" />
                      <line x1="50" y1="50" x2={dotX} y2={dotY} stroke="#E8970A" strokeWidth="2" />
                      <circle cx={dotX} cy={dotY} r="6" fill="#E8970A" />
                      <circle cx="50" cy="50" r="3" fill="#E8970A" opacity="0.5" />
                    </svg>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="flex-1 accent-[#E8970A]"
                    />
                  </div>
                </div>
              )}

              {gradientType === 'radial' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Shape</label>
                    <div className="flex gap-2">
                      {(['circle', 'ellipse'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setRadialShape(s)}
                          className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                            radialShape === s
                              ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40'
                              : 'bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Position</label>
                    <select
                      value={radialPosition}
                      onChange={(e) => setRadialPosition(e.target.value)}
                      className="bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#E8970A]"
                    >
                      {['center', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left', 'top left'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {(gradientType === 'conic') && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Position</label>
                  <select
                    value={radialPosition}
                    onChange={(e) => setRadialPosition(e.target.value)}
                    className="bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#E8970A]"
                  >
                    {['center', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left', 'top left'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Color stops */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Color Stops</label>
                <div className="flex gap-2">
                  <button
                    onClick={randomGradient}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white transition-colors"
                  >
                    <Shuffle size={14} />
                    Random
                  </button>
                  <button
                    onClick={addStop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
                  >
                    <Plus size={14} />
                    Add Stop
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {stops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-3 bg-[#070510] border border-[#1A1726] rounded-lg p-3">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                      className="w-24 bg-[#0F0D1A] border border-[#1A1726] rounded px-2 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-[#E8970A]"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={stop.position}
                        onChange={(e) => updateStop(stop.id, 'position', parseInt(e.target.value))}
                        className="flex-1 accent-[#E8970A]"
                      />
                      <span className="text-sm text-gray-400 w-10 text-right">{stop.position}%</span>
                    </div>
                    <button
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length <= 2}
                      className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
