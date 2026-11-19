'use client'

import { useState, useMemo } from 'react'


import { Copy, Check, Square, Plus, Trash2, Sparkles } from 'lucide-react'

interface Shadow {
  id: number
  hOffset: number
  vOffset: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

const PRESETS: { name: string; shadows: Omit<Shadow, 'id'>[] }[] = [
  { name: 'Subtle', shadows: [{ hOffset: 0, vOffset: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.12, inset: false }] },
  { name: 'Medium', shadows: [{ hOffset: 0, vOffset: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false }, { hOffset: 0, vOffset: 2, blur: 4, spread: -2, color: '#000000', opacity: 0.1, inset: false }] },
  { name: 'Heavy', shadows: [{ hOffset: 0, vOffset: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false }, { hOffset: 0, vOffset: 4, blur: 6, spread: -4, color: '#000000', opacity: 0.1, inset: false }] },
  { name: 'Glow', shadows: [{ hOffset: 0, vOffset: 0, blur: 20, spread: 2, color: '#E8970A', opacity: 0.5, inset: false }] },
  { name: 'Sharp', shadows: [{ hOffset: 5, vOffset: 5, blur: 0, spread: 0, color: '#000000', opacity: 0.3, inset: false }] },
  { name: 'Inset', shadows: [{ hOffset: 0, vOffset: 2, blur: 6, spread: 0, color: '#000000', opacity: 0.3, inset: true }] },
  { name: 'Layered', shadows: [{ hOffset: 0, vOffset: 1, blur: 1, spread: 0, color: '#000000', opacity: 0.09, inset: false }, { hOffset: 0, vOffset: 2, blur: 2, spread: 0, color: '#000000', opacity: 0.09, inset: false }, { hOffset: 0, vOffset: 4, blur: 4, spread: 0, color: '#000000', opacity: 0.09, inset: false }, { hOffset: 0, vOffset: 8, blur: 8, spread: 0, color: '#000000', opacity: 0.09, inset: false }, { hOffset: 0, vOffset: 16, blur: 16, spread: 0, color: '#000000', opacity: 0.09, inset: false }] },
  { name: 'Neon', shadows: [{ hOffset: 0, vOffset: 0, blur: 10, spread: 0, color: '#E8970A', opacity: 0.8, inset: false }, { hOffset: 0, vOffset: 0, blur: 40, spread: 0, color: '#E8970A', opacity: 0.4, inset: false }] },
  { name: 'Material', shadows: [{ hOffset: 0, vOffset: 2, blur: 1, spread: -1, color: '#000000', opacity: 0.2, inset: false }, { hOffset: 0, vOffset: 1, blur: 1, spread: 0, color: '#000000', opacity: 0.14, inset: false }, { hOffset: 0, vOffset: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.12, inset: false }] },
  { name: 'Float', shadows: [{ hOffset: 0, vOffset: 20, blur: 60, spread: -10, color: '#000000', opacity: 0.3, inset: false }] },
  { name: 'Soft', shadows: [{ hOffset: 5, vOffset: 5, blur: 15, spread: 0, color: '#000000', opacity: 0.1, inset: false }, { hOffset: -5, vOffset: -5, blur: 15, spread: 0, color: '#ffffff', opacity: 0.05, inset: false }] },
  { name: 'Blue Glow', shadows: [{ hOffset: 0, vOffset: 0, blur: 20, spread: 2, color: '#3B82F6', opacity: 0.5, inset: false }] },
]

// Tailwind shadow class suggestion
function suggestTailwindShadow(shadows: Shadow[]): string {
  if (shadows.length === 0) return 'shadow-none'
  const s = shadows[0]
  if (s.inset) return 'shadow-inner'
  const totalBlur = s.blur + Math.abs(s.spread)
  if (totalBlur === 0) return 'shadow-none'
  if (totalBlur <= 3) return 'shadow-sm'
  if (totalBlur <= 6) return 'shadow'
  if (totalBlur <= 10) return 'shadow-md'
  if (totalBlur <= 15) return 'shadow-lg'
  if (totalBlur <= 25) return 'shadow-xl'
  return 'shadow-2xl'
}

let nextId = 2

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default function BoxShadowPage() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: 1, hOffset: 0, vOffset: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.25, inset: false },
  ])
  const [copied, setCopied] = useState(false)

  const cssValue = useMemo(() => {
    return shadows.map(s => {
      const rgba = hexToRgba(s.color, s.opacity)
      return `${s.inset ? 'inset ' : ''}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px ${rgba}`
    }).join(', ')
  }, [shadows])

  const cssOutput = `box-shadow: ${cssValue};`

  const addShadow = () => {
    setShadows([...shadows, { id: nextId++, hOffset: 0, vOffset: 4, blur: 12, spread: 0, color: '#000000', opacity: 0.25, inset: false }])
  }

  const removeShadow = (id: number) => {
    if (shadows.length <= 1) return
    setShadows(shadows.filter(s => s.id !== id))
  }

  const updateShadow = (id: number, field: keyof Omit<Shadow, 'id'>, value: number | string | boolean) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setShadows(preset.shadows.map(s => ({ ...s, id: nextId++ })))
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <Square className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              CSS Box Shadow Generator
            </h1>
          </div>
          <p className="text-gray-400">Design and preview box shadows with full control</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-16 rounded-xl bg-[#1A1726]" style={{ boxShadow: '0 8px 24px rgba(232,151,10,0.3), 0 2px 8px rgba(0,0,0,0.4)' }} />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Adjust sliders</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Preview shadow</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy CSS</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Stack multiple shadows for depth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview + output */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">Preview</label>
              <div className="flex items-center justify-center h-64 bg-[#070510] rounded-xl border border-[#1A1726]">
                <div
                  className="w-40 h-40 rounded-xl bg-[#1A1726]"
                  style={{ boxShadow: cssValue }}
                />
              </div>
            </div>

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
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Tailwind:</span>
                <code className="text-xs text-blue-400 font-mono bg-[#070510] px-2 py-1 rounded border border-[#1A1726]">{suggestTailwindShadow(shadows)}</code>
              </div>
            </div>

            {/* Presets */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">Presets</label>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 rounded-lg text-sm text-gray-400 bg-[#070510] border border-[#1A1726] hover:border-[#E8970A] hover:text-[#E8970A] transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Shadows ({shadows.length})</h3>
              <button
                onClick={addShadow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
              >
                <Plus size={14} />
                Add Shadow
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {shadows.map((shadow, idx) => (
                <div key={shadow.id} className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#E8970A]">Shadow {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                          className="accent-[#E8970A]"
                        />
                        Inset
                      </label>
                      <button
                        onClick={() => removeShadow(shadow.id)}
                        disabled={shadows.length <= 1}
                        className="p-1 rounded text-gray-500 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {[
                    { label: 'Horizontal Offset', field: 'hOffset' as const, min: -100, max: 100 },
                    { label: 'Vertical Offset', field: 'vOffset' as const, min: -100, max: 100 },
                    { label: 'Blur Radius', field: 'blur' as const, min: 0, max: 100 },
                    { label: 'Spread Radius', field: 'spread' as const, min: -50, max: 50 },
                  ].map(({ label, field, min, max }) => (
                    <div key={field}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-400">{label}</label>
                        <span className="text-xs text-gray-500">{shadow[field]}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={shadow[field] as number}
                          onChange={(e) => updateShadow(shadow.id, field, parseInt(e.target.value))}
                          className="flex-1 accent-[#E8970A]"
                        />
                        <input
                          type="number"
                          min={min}
                          max={max}
                          value={shadow[field] as number}
                          onChange={(e) => updateShadow(shadow.id, field, parseInt(e.target.value) || 0)}
                          className="w-16 bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#E8970A]"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          className="w-20 bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white font-mono text-sm focus:outline-none focus:border-[#E8970A]"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-400">Opacity</label>
                        <span className="text-xs text-gray-500">{Math.round(shadow.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={Math.round(shadow.opacity * 100)}
                        onChange={(e) => updateShadow(shadow.id, 'opacity', parseInt(e.target.value) / 100)}
                        className="w-full accent-[#E8970A]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
