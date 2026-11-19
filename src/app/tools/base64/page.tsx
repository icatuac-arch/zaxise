'use client'

import { useState, useRef } from 'react'


import { Code2, Copy, Check, ArrowDown, ArrowUp, Upload, Image as ImageIcon } from 'lucide-react'

export default function Base64Page() {
  const [text, setText] = useState('')
  const [encoded, setEncoded] = useState('')
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toUrlSafe = (s: string) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const fromUrlSafe = (s: string) => {
    let r = s.replace(/-/g, '+').replace(/_/g, '/')
    while (r.length % 4) r += '='
    return r
  }

  const encode = () => {
    try {
      let result = btoa(unescape(encodeURIComponent(text)))
      if (urlSafe) result = toUrlSafe(result)
      setEncoded(result)
      setError('')
      setImagePreview(null)
    } catch (err: any) { setError(err.message) }
  }

  const decode = () => {
    try {
      const input = urlSafe ? fromUrlSafe(encoded) : encoded
      const decoded = decodeURIComponent(escape(atob(input)))
      setText(decoded)
      setError('')
      // Check if it's an image
      if (encoded.startsWith('data:image/') || /^iVBOR|^\/9j\/|^R0lGOD|^UklGR/.test(encoded)) {
        const src = encoded.startsWith('data:') ? encoded : `data:image/png;base64,${encoded}`
        setImagePreview(src)
      } else {
        setImagePreview(null)
      }
    } catch {
      setError('Invalid Base64 string')
      setImagePreview(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result is data:...;base64,XXXX
      const b64 = result.split(',')[1] || result
      setEncoded(urlSafe ? toUrlSafe(b64) : b64)
      setText(`[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`)
      setError('')
      if (file.type.startsWith('image/')) {
        setImagePreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Code2 size={28} /> Base64 Encoder / Decoder
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Encode plain text to Base64 or decode Base64 back to plain text.</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">SGVsbG8=</div>
            <span className="text-[#E8970A] text-2xl">&#8596;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-sm font-mono font-bold">Hello</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Encode or Decode</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy result</span>
          </div>
          <p className="text-center text-xs text-gray-500">Supports UTF-8 text, file upload, and image preview.</p>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="accent-[#E8970A]" />
            URL-safe Base64
          </label>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-[#1A1726] hover:bg-white/5">
            <Upload size={14} /> Upload File
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Plain Text</label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{text.length} chars</span>
                {text && <button onClick={() => copy('text', text)} className="text-gray-400 hover:text-white">{copied === 'text' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to encode..." rows={5} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
          </div>

          <div className="flex justify-center gap-2">
            <button onClick={encode} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium text-sm">
              <ArrowDown size={14} /> Encode
            </button>
            <button onClick={decode} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-sm">
              <ArrowUp size={14} /> Decode
            </button>
          </div>

          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Base64</label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{encoded.length} chars</span>
                {encoded && <button onClick={() => copy('enc', encoded)} className="text-gray-400 hover:text-white">{copied === 'enc' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
            </div>
            <textarea value={encoded} onChange={(e) => setEncoded(e.target.value)} placeholder="Base64 encoded string..." rows={5} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={14} className="text-[#E8970A]" />
                <label className="text-xs text-gray-400">Decoded Image Preview</label>
              </div>
              <div className="flex justify-center">
                <img src={imagePreview} alt="Decoded" className="max-w-full max-h-64 rounded-lg border border-[#1A1726]" />
              </div>
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">{error}</div>}
        </div>
      </main>
      
    </div>
  )
}
