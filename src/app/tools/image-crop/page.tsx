'use client'

import { useState, useCallback } from 'react'


import Cropper from 'react-easy-crop'
import { Upload, Download, Crop, RefreshCw, FlipHorizontal, FlipVertical, RotateCw } from 'lucide-react'

const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '1:1 Square', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
  { label: 'A4', value: 210 / 297 },
  { label: 'FB Cover (820x312)', value: 820 / 312 },
  { label: 'IG Post (1080x1080)', value: 1 },
  { label: 'Twitter Header (1500x500)', value: 1500 / 500 },
  { label: 'YT Thumbnail (1280x720)', value: 1280 / 720 },
  { label: 'LinkedIn Banner (1584x396)', value: 1584 / 396 },
  { label: 'Pinterest Pin (1000x1500)', value: 1000 / 1500 },
  { label: 'TikTok (1080x1920)', value: 1080 / 1920 },
  { label: 'IG Story (1080x1920)', value: 1080 / 1920 },
]

async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  rotation: number,
  flipH: boolean,
  flipV: boolean,
  customWidth?: number,
  customHeight?: number
): Promise<Blob> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise<void>(resolve => { image.onload = () => resolve(); image.src = imageSrc })

  const outW = customWidth || crop.width
  const outH = customHeight || crop.height
  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')!

  ctx.save()
  ctx.translate(outW / 2, outH / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
  ctx.translate(-outW / 2, -outH / 2)
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, outW, outH)
  ctx.restore()

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

export default function ImageCropPage() {
  const [imageSrc, setImageSrc] = useState('')
  const [aspect, setAspect] = useState<number | undefined>(1)
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [useCustomDimensions, setUseCustomDimensions] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const onCropComplete = useCallback((_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea)
  }, [])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const outputWidth = useCustomDimensions && customWidth ? parseInt(customWidth) : croppedAreaPixels?.width || 0
  const outputHeight = useCustomDimensions && customHeight ? parseInt(customHeight) : croppedAreaPixels?.height || 0

  const download = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const cw = useCustomDimensions && customWidth ? parseInt(customWidth) : undefined
    const ch = useCustomDimensions && customHeight ? parseInt(customHeight) : undefined
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flipH, flipV, cw, ch)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cropped-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Crop size={28} /> Image Cropper
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Crop images to any aspect ratio with pixel-perfect control.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative w-28 h-20 rounded-lg border border-[#1A1726] bg-gradient-to-br from-blue-400/20 to-purple-400/20 overflow-hidden">
              <div className="absolute inset-2 border-2 border-dashed border-[#E8970A] rounded">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#E8970A] rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#E8970A] rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#E8970A] rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#E8970A] rounded-full" />
              </div>
              <div className="absolute top-0 left-0 w-full h-2 bg-black/40" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40" />
              <div className="absolute top-0 left-0 w-2 h-full bg-black/40" />
              <div className="absolute top-0 right-0 w-2 h-full bg-black/40" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Upload</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Select crop area</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download cropped</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Includes presets for social media sizes: Instagram, Facebook, Twitter, YouTube.
          </p>
        </div>

        {!imageSrc ? (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-8">
            <label className="block">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#E8970A] bg-[#E8970A]/5' : 'border-[#1A1726] hover:border-[#E8970A]/50'}`}
              >
                <Upload size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-white font-medium mb-1">Upload an image to crop</p>
                <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Aspect Ratio Presets */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(a => (
                  <button key={a.label} onClick={() => { setAspect(a.value); setUseCustomDimensions(false) }} className={`px-3 py-1.5 rounded-lg text-xs ${aspect === a.value && !useCustomDimensions ? 'bg-[#E8970A] text-black' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dimensions */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <label className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <input type="checkbox" checked={useCustomDimensions} onChange={(e) => {
                  setUseCustomDimensions(e.target.checked)
                  if (e.target.checked && customWidth && customHeight) {
                    setAspect(parseInt(customWidth) / parseInt(customHeight))
                  }
                }} className="accent-[#E8970A]" />
                Custom output dimensions
              </label>
              {useCustomDimensions && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Width"
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(e.target.value)
                      if (e.target.value && customHeight) setAspect(parseInt(e.target.value) / parseInt(customHeight))
                    }}
                    className="w-24 px-3 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm"
                  />
                  <span className="text-gray-500 text-sm">x</span>
                  <input
                    type="number"
                    placeholder="Height"
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(e.target.value)
                      if (customWidth && e.target.value) setAspect(parseInt(customWidth) / parseInt(e.target.value))
                    }}
                    className="w-24 px-3 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              )}
            </div>

            {/* Cropper */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl overflow-hidden" style={{ height: '500px', position: 'relative' }}>
              <Cropper
                image={imageSrc}
                crop={cropPos}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCropPos}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                transform={[
                  `translate(${cropPos.x}px, ${cropPos.y}px)`,
                  `rotateY(${flipH ? 180 : 0}deg)`,
                  `rotateX(${flipV ? 180 : 0}deg)`,
                  `scale(${zoom})`,
                  `rotate(${rotation}deg)`,
                ].join(' ')}
              />
            </div>

            {/* Output Dimensions */}
            {croppedAreaPixels && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-3 flex items-center gap-4">
                <span className="text-xs text-gray-400">Output dimensions:</span>
                <span className="text-sm font-mono text-[#E8970A]">{outputWidth} x {outputHeight} px</span>
              </div>
            )}

            {/* Zoom Slider */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <label className="block text-xs text-gray-400 mb-2">Zoom: {zoom.toFixed(2)}x</label>
              <input type="range" min="1" max="5" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-[#E8970A]" />
            </div>

            {/* Rotation Slider */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400 flex items-center gap-1"><RotateCw size={12} /> Rotation: {rotation}deg</label>
                <button onClick={() => setRotation(0)} className="text-xs text-gray-500 hover:text-white">Reset</button>
              </div>
              <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full accent-[#E8970A]" />
            </div>

            {/* Flip Buttons + Actions */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFlipH(!flipH)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${flipH ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                <FlipHorizontal size={16} /> Flip H
              </button>
              <button onClick={() => setFlipV(!flipV)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${flipV ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40' : 'bg-[#070510] border border-[#1A1726] text-gray-300'}`}>
                <FlipVertical size={16} /> Flip V
              </button>
              <div className="flex-1" />
              <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8970A] text-black font-medium hover:opacity-90">
                <Download size={16} /> Download Cropped
              </button>
              <button onClick={() => { setImageSrc(''); setRotation(0); setFlipH(false); setFlipV(false); setUseCustomDimensions(false); setCustomWidth(''); setCustomHeight('') }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5">
                <RefreshCw size={16} /> New Image
              </button>
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
