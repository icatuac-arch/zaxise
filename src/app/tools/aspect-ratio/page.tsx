'use client'

import { useState, useMemo, useRef } from 'react'


import { Ratio, Upload, Lock, Unlock, Copy, Check } from 'lucide-react'

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) { [a, b] = [b, a % b] }
  return a
}

function calcRatio(w: number, h: number): string {
  if (!w || !h) return '-'
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

const PRESETS = [
  { label: '16:9', w: 1920, h: 1080, desc: 'Widescreen (HD Video, YouTube)' },
  { label: '4:3', w: 1024, h: 768, desc: 'Classic (TV, Presentations)' },
  { label: '1:1', w: 1080, h: 1080, desc: 'Square (Instagram, Profile pics)' },
  { label: '21:9', w: 2560, h: 1080, desc: 'Ultrawide (Cinematic)' },
  { label: '9:16', w: 1080, h: 1920, desc: 'Vertical (Stories, Reels, TikTok)' },
  { label: '3:2', w: 1500, h: 1000, desc: 'Photo (DSLR standard)' },
  { label: '2:3', w: 1000, h: 1500, desc: 'Portrait (Pinterest, Posters)' },
  { label: '5:4', w: 1280, h: 1024, desc: 'Classic photo print (8x10)' },
  { label: '32:9', w: 3840, h: 1080, desc: 'Super ultrawide (Dual monitor)' },
]

const SOCIAL_SIZES = [
  { name: 'Instagram Post', w: 1080, h: 1080, ratio: '1:1' },
  { name: 'Instagram Story', w: 1080, h: 1920, ratio: '9:16' },
  { name: 'Facebook Post', w: 1200, h: 630, ratio: '40:21' },
  { name: 'Facebook Cover', w: 820, h: 312, ratio: '205:78' },
  { name: 'Twitter Post', w: 1200, h: 675, ratio: '16:9' },
  { name: 'Twitter Header', w: 1500, h: 500, ratio: '3:1' },
  { name: 'YouTube Thumbnail', w: 1280, h: 720, ratio: '16:9' },
  { name: 'LinkedIn Post', w: 1200, h: 627, ratio: '~16:9' },
  { name: 'Pinterest Pin', w: 1000, h: 1500, ratio: '2:3' },
  { name: 'TikTok Video', w: 1080, h: 1920, ratio: '9:16' },
]

export default function AspectRatioPage() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [locked, setLocked] = useState(false)
  const [targetW, setTargetW] = useState<number | ''>('')
  const [targetH, setTargetH] = useState<number | ''>('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const ratio = useMemo(() => calcRatio(width, height), [width, height])
  const ratioDecimal = useMemo(() => (height > 0 ? (width / height).toFixed(4) : '-'), [width, height])

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (locked && height > 0 && width > 0) {
      setHeight(Math.round(val * (height / width)))
    }
  }

  const handleHeightChange = (val: number) => {
    if (locked && width > 0 && height > 0) {
      setWidth(Math.round(val * (width / height)))
    }
    setHeight(val)
  }

  const handlePreset = (w: number, h: number) => {
    setWidth(w)
    setHeight(h)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => {
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  }

  const resizedW = useMemo(() => {
    if (!targetW || !width || !height) return ''
    return Math.round((Number(targetW) * height) / width)
  }, [targetW, width, height])

  const resizedH = useMemo(() => {
    if (!targetH || !width || !height) return ''
    return Math.round((Number(targetH) * width) / height)
  }, [targetH, width, height])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${width} x ${height} (${ratio})`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Preview box dimensions (max 200px)
  const previewMax = 200
  const previewScale = Math.min(previewMax / Math.max(width, 1), previewMax / Math.max(height, 1))
  const previewW = Math.max(20, Math.round(width * previewScale))
  const previewH = Math.max(20, Math.round(height * previewScale))

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Ratio size={28} /> Aspect Ratio Calculator
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Calculate, lock, and convert aspect ratios for images and video.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-9 rounded border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px] font-bold">16:9</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-9 rounded border-2 border-purple-500/60 bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-bold">4:3</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">1:1</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Enter dimensions</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>See ratio</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Calculate new sizes</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Includes presets for social media and video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {/* Dimensions input */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Dimensions</h2>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Width</label>
                  <input
                    type="number"
                    min={1}
                    value={width}
                    onChange={e => handleWidthChange(Math.max(1, +e.target.value || 1))}
                    className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
                  />
                </div>
                <button
                  onClick={() => setLocked(!locked)}
                  className={`mt-5 p-2 rounded-lg border transition-colors ${locked ? 'border-[#E8970A] text-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] text-gray-500 hover:bg-white/5'}`}
                  title={locked ? 'Unlock ratio' : 'Lock ratio'}
                >
                  {locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Height</label>
                  <input
                    type="number"
                    min={1}
                    value={height}
                    onChange={e => handleHeightChange(Math.max(1, +e.target.value || 1))}
                    className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
                  />
                </div>
              </div>

              {/* Result */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-sm">Aspect Ratio: </span>
                  <span className="text-[#E8970A] text-lg font-bold">{ratio}</span>
                  <span className="text-gray-500 text-xs ml-2">({ratioDecimal})</span>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-[#1A1726] hover:bg-white/10 text-gray-400">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Upload image */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Detect from Image</h2>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[#1A1726] text-gray-400 hover:border-[#E8970A]/50 hover:text-[#E8970A] transition-colors"
              >
                <Upload size={16} /> Upload an image to detect dimensions
              </button>
            </div>

            {/* Resize calculator */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Resize Calculator</h2>
              <p className="text-xs text-gray-500 mb-2">Maintain ratio ({ratio}). Enter target width or height:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Target Width</label>
                  <input
                    type="number"
                    min={1}
                    value={targetW}
                    onChange={e => { setTargetW(+e.target.value || ''); setTargetH('') }}
                    placeholder="e.g. 800"
                    className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
                  />
                  {targetW && <p className="text-xs text-gray-400 mt-1">Height: <span className="text-white font-medium">{resizedW}px</span></p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Target Height</label>
                  <input
                    type="number"
                    min={1}
                    value={targetH}
                    onChange={e => { setTargetH(+e.target.value || ''); setTargetW('') }}
                    placeholder="e.g. 600"
                    className="w-full bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
                  />
                  {targetH && <p className="text-xs text-gray-400 mt-1">Width: <span className="text-white font-medium">{resizedH}px</span></p>}
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Common Presets</h2>
              <div className="space-y-1">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.w, p.h)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors ${
                      ratio === p.label
                        ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/30'
                        : 'border-[#1A1726] text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-12 text-left">{p.label}</span>
                      <span className="text-xs text-gray-500">{p.desc}</span>
                    </div>
                    <span className="text-xs text-gray-600">{p.w}x{p.h}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Visual preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Preview</h2>
              <div className="flex items-center justify-center" style={{ minHeight: previewMax + 20 }}>
                <div
                  className="border-2 border-[#E8970A] rounded-lg flex items-center justify-center text-[#E8970A] text-sm font-medium"
                  style={{ width: previewW, height: previewH }}
                >
                  {ratio}
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">{width} x {height}px</p>
            </div>

            {/* Social media sizes */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <h2 className="text-sm text-gray-400 mb-3 font-medium">Social Media Size Reference</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1726]">
                      <th className="text-left text-xs text-gray-500 py-2 px-2">Platform</th>
                      <th className="text-right text-xs text-gray-500 py-2 px-2">Size</th>
                      <th className="text-right text-xs text-gray-500 py-2 px-2">Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SOCIAL_SIZES.map(s => (
                      <tr
                        key={s.name}
                        onClick={() => handlePreset(s.w, s.h)}
                        className="border-b border-[#1A1726]/50 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="py-2 px-2 text-gray-300">{s.name}</td>
                        <td className="py-2 px-2 text-right font-mono text-xs text-[#E8970A]">{s.w}x{s.h}</td>
                        <td className="py-2 px-2 text-right text-xs text-gray-500">{s.ratio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
