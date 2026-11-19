'use client'

import { useState, useRef, useCallback, useEffect } from 'react'


import { Upload, Download, Code, Image as ImageIcon } from 'lucide-react'

const SCALES = [1, 2, 3, 4]

export default function SvgToPngPage() {
  const [svgSource, setSvgSource] = useState<'file' | 'code'>('file')
  const [svgCode, setSvgCode] = useState('')
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [scale, setScale] = useState(2)
  const [customW, setCustomW] = useState<number | ''>('')
  const [customH, setCustomH] = useState<number | ''>('')
  const [useCustomSize, setUseCustomSize] = useState(false)
  const [bgTransparent, setBgTransparent] = useState(true)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [estimatedSize, setEstimatedSize] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getSvgText = useCallback((): Promise<string> => {
    if (svgSource === 'code') return Promise.resolve(svgCode)
    if (svgFile) return svgFile.text()
    return Promise.resolve('')
  }, [svgSource, svgCode, svgFile])

  const renderPng = useCallback(async () => {
    setError('')
    const text = await getSvgText()
    if (!text.trim()) {
      setPreviewUrl('')
      return
    }

    // Validate SVG
    if (!text.includes('<svg')) {
      setError('Invalid SVG: no <svg> element found.')
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (!svgEl) {
        setError('Could not parse SVG.')
        return
      }

      // Get intrinsic dimensions
      let natW = parseFloat(svgEl.getAttribute('width') || '300')
      let natH = parseFloat(svgEl.getAttribute('height') || '150')
      const viewBox = svgEl.getAttribute('viewBox')
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number)
        if (parts.length === 4) {
          natW = parts[2]
          natH = parts[3]
        }
      }

      let outW: number, outH: number
      if (useCustomSize && customW && customH) {
        outW = Number(customW)
        outH = Number(customH)
      } else {
        outW = natW * scale
        outH = natH * scale
      }

      // Ensure SVG has explicit width/height for rendering
      svgEl.setAttribute('width', String(outW))
      svgEl.setAttribute('height', String(outH))

      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgEl)
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = outW
        canvas.height = outH

        if (!bgTransparent) {
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, outW, outH)
        } else {
          ctx.clearRect(0, 0, outW, outH)
        }

        ctx.drawImage(img, 0, 0, outW, outH)
        URL.revokeObjectURL(url)

        const pngUrl = canvas.toDataURL('image/png')
        setPreviewUrl(pngUrl)
        // Estimate file size from data URL
        const base64Length = pngUrl.length - 'data:image/png;base64,'.length
        setEstimatedSize(Math.round((base64Length * 3) / 4))
      }
      img.onerror = () => {
        setError('Failed to render SVG.')
        URL.revokeObjectURL(url)
      }
      img.src = url
    } catch {
      setError('Error processing SVG.')
    }
  }, [getSvgText, scale, customW, customH, useCustomSize, bgTransparent, bgColor])

  useEffect(() => {
    const timeout = setTimeout(() => { renderPng() }, 300)
    return () => clearTimeout(timeout)
  }, [renderPng])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      setSvgFile(file)
      setSvgSource('file')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSvgFile(file)
      setSvgSource('file')
    }
  }

  const handleDownload = () => {
    if (!previewUrl) return
    const link = document.createElement('a')
    link.download = 'converted.png'
    link.href = previewUrl
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          SVG to PNG Converter
        </h1>
        <p className="text-gray-400 mb-4">Convert SVG files to PNG with custom scale and background. All processing in your browser.</p>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-14 rounded-lg border-2 border-purple-500/60 bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-mono">&lt;svg&gt;</div>
              <span className="text-[10px] text-gray-500">SVG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#E8970A] text-2xl">&rarr;</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-16 rounded-lg border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">PNG</div>
              <span className="text-[10px] text-green-400">Raster</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload SVG</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Set scale</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download PNG</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Export at 1x, 2x, 3x, or 4x resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-5 rounded-2xl p-6 border border-[#1A1726]" style={{ background: '#0F0D1A' }}>
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <Code size={18} className="text-[#E8970A]" /> SVG Input
            </h2>

            {/* Source toggle */}
            <div className="flex gap-2">
              {(['file', 'code'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSvgSource(s)}
                  className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${svgSource === s ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                >
                  {s === 'file' ? 'Upload File' : 'Paste Code'}
                </button>
              ))}
            </div>

            {svgSource === 'file' ? (
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/10' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto mb-2 text-[#E8970A]" size={28} />
                <p className="text-gray-400 text-sm">{svgFile ? svgFile.name : 'Drop SVG file or click'}</p>
                <input ref={fileInputRef} type="file" accept=".svg,image/svg+xml" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                placeholder="Paste SVG code here..."
                className="w-full h-40 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#E8970A] resize-none"
              />
            )}

            <div>
              <label className="text-gray-400 text-sm block mb-2">Scale</label>
              <div className="flex gap-2">
                {SCALES.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setScale(s); setUseCustomSize(false) }}
                    className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${!useCustomSize && scale === s ? 'bg-[#E8970A] text-black' : 'bg-[#070510] text-gray-400 hover:text-white border border-[#1A1726]'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useCustomSize}
                  onChange={(e) => setUseCustomSize(e.target.checked)}
                  className="accent-[#E8970A] w-4 h-4"
                />
                <span className="text-gray-300 text-sm">Custom size</span>
              </label>
              {useCustomSize && (
                <div className="flex gap-2">
                  <input
                    type="number" min={1} placeholder="Width"
                    value={customW}
                    onChange={(e) => setCustomW(e.target.value ? Number(e.target.value) : '')}
                    className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]"
                  />
                  <input
                    type="number" min={1} placeholder="Height"
                    value={customH}
                    onChange={(e) => setCustomH(e.target.value ? Number(e.target.value) : '')}
                    className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8970A]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Background</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="bg" checked={bgTransparent}
                    onChange={() => setBgTransparent(true)}
                    className="accent-[#E8970A]"
                  />
                  <span className="text-gray-300 text-sm">Transparent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="bg" checked={!bgTransparent}
                    onChange={() => setBgTransparent(false)}
                    className="accent-[#E8970A]"
                  />
                  <span className="text-gray-300 text-sm">Color</span>
                </label>
                {!bgTransparent && (
                  <input
                    type="color" value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-[#1A1726] bg-transparent"
                  />
                )}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleDownload}
              disabled={!previewUrl}
              className="w-full flex items-center justify-center gap-2 bg-[#E8970A] hover:bg-[#d68a09] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Download size={16} /> Download PNG
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 rounded-2xl p-4 border border-[#1A1726] flex items-center justify-center min-h-[400px]" style={{ background: '#0F0D1A' }}>
            <canvas ref={canvasRef} className="hidden" />
            {previewUrl ? (
              <div className="text-center">
                <div className="inline-block rounded-lg p-2" style={{ background: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 16px 16px' }}>
                  <img src={previewUrl} alt="Converted PNG" className="max-w-full max-h-[500px]" />
                </div>
                {canvasRef.current && (
                  <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                    <span className="text-gray-500">
                      <span className="text-[#E8970A] font-mono font-bold">{canvasRef.current.width} x {canvasRef.current.height}</span> px
                    </span>
                    {estimatedSize > 0 && (
                      <span className="text-gray-500">
                        Est. size: <span className="text-[#E8970A] font-mono">
                          {estimatedSize < 1024 ? `${estimatedSize} B` : estimatedSize < 1024 * 1024 ? `${(estimatedSize / 1024).toFixed(1)} KB` : `${(estimatedSize / 1024 / 1024).toFixed(2)} MB`}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-40" />
                <p>Upload or paste SVG to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
