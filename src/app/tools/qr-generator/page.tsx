'use client'

import { useState, useEffect, useRef, useCallback } from 'react'


import {
  QrCode, Link, Type, Wifi, Mail, Phone, MessageSquare, UserCircle, CalendarDays,
  Download, Copy, Check, Printer, Palette, Maximize2, Shield, Square, Circle,
  Image as ImageIcon, Tag, Info, ChevronDown, X, Upload
} from 'lucide-react'
import QRCodeLib from 'qrcode'

// ─── Types ──────────────────────────────────────────────────────────────────
type ContentTab = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'event'
type DotStyle = 'square' | 'rounded' | 'dots'
type ECLevel = 'L' | 'M' | 'Q' | 'H'

interface WiFiData { ssid: string; password: string; encryption: 'WPA' | 'WEP' | 'nopass'; hidden: boolean }
interface EmailData { to: string; subject: string; body: string }
interface SMSData { phone: string; message: string }
interface VCardData { firstName: string; lastName: string; phone: string; email: string; company: string; title: string; website: string; address: string }
interface EventData { title: string; location: string; startDate: string; startTime: string; endDate: string; endTime: string }

const TABS: { id: ContentTab; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', icon: <Link size={16} /> },
  { id: 'text', label: 'Text', icon: <Type size={16} /> },
  { id: 'wifi', label: 'WiFi', icon: <Wifi size={16} /> },
  { id: 'email', label: 'Email', icon: <Mail size={16} /> },
  { id: 'phone', label: 'Phone', icon: <Phone size={16} /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare size={16} /> },
  { id: 'vcard', label: 'vCard', icon: <UserCircle size={16} /> },
  { id: 'event', label: 'Event', icon: <CalendarDays size={16} /> },
]

const EC_LABELS: Record<ECLevel, { label: string; desc: string }> = {
  L: { label: 'Low (7%)', desc: 'Smallest QR code, least error recovery' },
  M: { label: 'Medium (15%)', desc: 'Good balance of size and recoverability' },
  Q: { label: 'Quartile (25%)', desc: 'Higher recovery, good for logos' },
  H: { label: 'High (30%)', desc: 'Maximum recovery, best for logos' },
}

// ─── Helper: Build content string ───────────────────────────────────────────
function buildContent(
  tab: ContentTab,
  url: string,
  text: string,
  wifi: WiFiData,
  email: EmailData,
  phone: string,
  sms: SMSData,
  vcard: VCardData,
  event: EventData,
): string {
  switch (tab) {
    case 'url': return url || 'https://example.com'
    case 'text': return text || 'Hello World'
    case 'wifi': {
      const hidden = wifi.hidden ? 'H:true' : ''
      return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};${hidden};`
    }
    case 'email': {
      const parts = [`mailto:${email.to}`]
      const params: string[] = []
      if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`)
      if (email.body) params.push(`body=${encodeURIComponent(email.body)}`)
      if (params.length) parts.push('?' + params.join('&'))
      return parts.join('')
    }
    case 'phone': return `tel:${phone}`
    case 'sms': {
      let s = `sms:${sms.phone}`
      if (sms.message) s += `?body=${encodeURIComponent(sms.message)}`
      return s
    }
    case 'vcard': {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${vcard.lastName};${vcard.firstName};;;`,
        `FN:${vcard.firstName} ${vcard.lastName}`,
      ]
      if (vcard.company) lines.push(`ORG:${vcard.company}`)
      if (vcard.title) lines.push(`TITLE:${vcard.title}`)
      if (vcard.phone) lines.push(`TEL:${vcard.phone}`)
      if (vcard.email) lines.push(`EMAIL:${vcard.email}`)
      if (vcard.website) lines.push(`URL:${vcard.website}`)
      if (vcard.address) lines.push(`ADR:;;${vcard.address};;;;`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
    case 'event': {
      const fmt = (d: string, t: string) => {
        const date = d.replace(/-/g, '')
        const time = t.replace(/:/g, '') + '00'
        return date + 'T' + time
      }
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location}`,
        `DTSTART:${fmt(event.startDate, event.startTime)}`,
        `DTEND:${fmt(event.endDate, event.endTime)}`,
        'END:VEVENT',
      ].join('\n')
    }
  }
}

// ─── Draw QR on canvas ──────────────────────────────────────────────────────
function drawQR(
  canvas: HTMLCanvasElement,
  modules: boolean[][],
  opts: {
    size: number
    fgColor: string
    bgColor: string
    margin: number
    dotStyle: DotStyle
    logoImg: HTMLImageElement | null
    logoPct: number
    frameText: string
    frameColor: string
    frameFontSize: number
  }
) {
  const { size, fgColor, bgColor, margin, dotStyle, logoImg, logoPct, frameText, frameColor, frameFontSize } = opts
  const count = modules.length
  const frameHeight = frameText ? frameFontSize + 24 : 0
  const totalSize = size + frameHeight
  const cellSize = (size - margin * 2) / count

  canvas.width = size
  canvas.height = totalSize
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, totalSize)

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, totalSize)

  // Draw modules
  const offset = margin
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!modules[r][c]) continue
      const x = offset + c * cellSize
      const y = offset + r * cellSize
      ctx.fillStyle = fgColor

      if (dotStyle === 'square') {
        ctx.fillRect(x, y, cellSize, cellSize)
      } else if (dotStyle === 'rounded') {
        const radius = cellSize * 0.3
        ctx.beginPath()
        ctx.roundRect(x, y, cellSize, cellSize, radius)
        ctx.fill()
      } else {
        // dots (circle)
        const cx = x + cellSize / 2
        const cy = y + cellSize / 2
        ctx.beginPath()
        ctx.arc(cx, cy, cellSize * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Logo overlay
  if (logoImg) {
    const logoSize = size * logoPct / 100
    const pad = logoSize * 0.12
    const lx = (size - logoSize) / 2
    const ly = (size - logoSize) / 2
    // White background behind logo
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.roundRect(lx - pad, ly - pad, logoSize + pad * 2, logoSize + pad * 2, 8)
    ctx.fill()
    ctx.drawImage(logoImg, lx, ly, logoSize, logoSize)
  }

  // Frame / label
  if (frameText) {
    const fy = size + frameHeight / 2
    ctx.fillStyle = frameColor
    ctx.font = `600 ${frameFontSize}px "DM Sans", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(frameText, size / 2, fy)
  }
}

// ─── Generate SVG from modules ──────────────────────────────────────────────
function generateSVG(
  modules: boolean[][],
  opts: { size: number; fgColor: string; bgColor: string; margin: number; dotStyle: DotStyle }
): string {
  const { size, fgColor, bgColor, margin, dotStyle } = opts
  const count = modules.length
  const cellSize = (size - margin * 2) / count
  const offset = margin

  let paths = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!modules[r][c]) continue
      const x = (offset + c * cellSize).toFixed(2)
      const y = (offset + r * cellSize).toFixed(2)
      const s = cellSize.toFixed(2)

      if (dotStyle === 'square') {
        paths += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fgColor}"/>`
      } else if (dotStyle === 'rounded') {
        const rx = (cellSize * 0.3).toFixed(2)
        paths += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${rx}" fill="${fgColor}"/>`
      } else {
        const cx = (offset + c * cellSize + cellSize / 2).toFixed(2)
        const cy = (offset + r * cellSize + cellSize / 2).toFixed(2)
        const rad = (cellSize * 0.45).toFixed(2)
        paths += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fgColor}"/>`
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="${bgColor}"/>
${paths}
</svg>`
}

// ─── Color Picker Component ─────────────────────────────────────────────────
function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-400 w-28">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-[#1A1726] cursor-pointer bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-24 px-2 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono"
      />
    </div>
  )
}

// ─── Tooltip Component ──────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(s => !s)}
        className="text-gray-500 hover:text-gray-300 transition-colors"
        type="button"
      >
        <Info size={14} />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[#1A1726] text-gray-300 rounded-lg whitespace-nowrap shadow-xl z-50 border border-[#2A2736]">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1726]" />
        </span>
      )}
    </span>
  )
}

// ─── Section Component ──────────────────────────────────────────────────────
function Section({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#141020] transition-colors"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <span className="text-[#E8970A]">{icon}</span>
          {title}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function QRGeneratorPage() {
  // Content state
  const [activeTab, setActiveTab] = useState<ContentTab>('url')
  const [url, setUrl] = useState('https://')
  const [text, setText] = useState('')
  const [wifi, setWifi] = useState<WiFiData>({ ssid: '', password: '', encryption: 'WPA', hidden: false })
  const [email, setEmail] = useState<EmailData>({ to: '', subject: '', body: '' })
  const [phone, setPhone] = useState('')
  const [sms, setSms] = useState<SMSData>({ phone: '', message: '' })
  const [vcard, setVcard] = useState<VCardData>({ firstName: '', lastName: '', phone: '', email: '', company: '', title: '', website: '', address: '' })
  const [event, setEvent] = useState<EventData>({ title: '', location: '', startDate: '', startTime: '09:00', endDate: '', endTime: '10:00' })

  // Customization state
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [qrSize, setQrSize] = useState(400)
  const [ecLevel, setEcLevel] = useState<ECLevel>('M')
  const [marginSize, setMarginSize] = useState(4)
  const [dotStyle, setDotStyle] = useState<DotStyle>('square')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null)
  const [logoPct, setLogoPct] = useState(20)
  const [frameText, setFrameText] = useState('')
  const [frameColor, setFrameColor] = useState('#000000')
  const [frameFontSize, setFrameFontSize] = useState(16)

  // QR data
  const [modules, setModules] = useState<boolean[][] | null>(null)
  const [copied, setCopied] = useState(false)

  // Batch generation
  const [batchInput, setBatchInput] = useState('')
  const [showBatch, setShowBatch] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Build content string
  const content = buildContent(activeTab, url, text, wifi, email, phone, sms, vcard, event)

  // Generate QR modules when content or EC level changes
  useEffect(() => {
    if (!content) return
    const generate = async () => {
      try {
        // Use qrcode library to create segments then get the modules
        const qr = QRCodeLib.create(content, { errorCorrectionLevel: ecLevel })
        const size = qr.modules.size
        const data = qr.modules.data
        const mods: boolean[][] = []
        for (let r = 0; r < size; r++) {
          const row: boolean[] = []
          for (let c = 0; c < size; c++) {
            row.push(data[r * size + c] !== 0)
          }
          mods.push(row)
        }
        setModules(mods)
      } catch {
        // Fallback: empty
        setModules(null)
      }
    }
    generate()
  }, [content, ecLevel])

  // Load logo image
  useEffect(() => {
    if (!logoFile) { setLogoImg(null); return }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.onload = () => setLogoImg(img)
      img.src = reader.result as string
    }
    reader.readAsDataURL(logoFile)
  }, [logoFile])

  // Draw canvas whenever relevant state changes
  useEffect(() => {
    if (!modules || !canvasRef.current) return
    drawQR(canvasRef.current, modules, {
      size: qrSize,
      fgColor,
      bgColor,
      margin: marginSize * (qrSize / modules.length) * 0.5,
      dotStyle,
      logoImg,
      logoPct,
      frameText,
      frameColor,
      frameFontSize,
    })
  }, [modules, qrSize, fgColor, bgColor, marginSize, dotStyle, logoImg, logoPct, frameText, frameColor, frameFontSize])

  // ─── Download handlers ──────────────────────────────────────────────────
  const downloadPNG = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }, [])

  const downloadJPG = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.jpg'
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95)
    link.click()
  }, [])

  const downloadSVG = useCallback(() => {
    if (!modules) return
    const svg = generateSVG(modules, {
      size: qrSize,
      fgColor,
      bgColor,
      margin: marginSize * (qrSize / modules.length) * 0.5,
      dotStyle,
    })
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }, [modules, qrSize, fgColor, bgColor, marginSize, dotStyle])

  const copyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>(res => canvasRef.current!.toBlob(res, 'image/png'))
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Fallback: copy data URL as text
      await navigator.clipboard.writeText(canvasRef.current.toDataURL('image/png'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const printQR = useCallback(() => {
    if (!canvasRef.current) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>QR Code</title><style>body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fff;}img{max-width:90vw;max-height:90vh;}</style></head>
      <body><img src="${canvasRef.current.toDataURL('image/png')}" /><script>setTimeout(()=>{window.print();window.close();},300)<\/script></body></html>
    `)
    win.document.close()
  }, [])

  // ─── Input field helper ─────────────────────────────────────────────────
  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm placeholder-gray-600 focus:border-[#E8970A]/50 focus:outline-none focus:ring-1 focus:ring-[#E8970A]/20 transition-colors"
  const labelClass = "text-xs font-medium text-gray-400 mb-1 block"

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            <QrCode size={30} /> QR Code Generator
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Generate fully customizable QR codes for URLs, text, WiFi, contacts, and more. Personalize colors, styles, add your logo, and download in multiple formats.
          </p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="px-3 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] font-mono text-[10px] text-blue-400">
                https://example.com
              </div>
            </div>
            <span className="text-[#E8970A] text-2xl">→</span>
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-lg bg-white p-1.5 flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1px]">
                  {[1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,0,1].map((v, i) => (
                    <div key={i} className={`rounded-[1px] ${v ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Enter URL, text, or WiFi info</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Customize colors & style</span>
            <span className="text-gray-600">→</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download QR code</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Add your logo, choose dot styles, export as PNG, SVG, or JPG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ── Left Column: Settings ─────────────────────────────────── */}
          <div className="space-y-4">
            {/* Content Type Tabs */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Content Type</p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                      activeTab === tab.id
                        ? 'bg-[#E8970A] text-black font-semibold shadow-lg shadow-[#E8970A]/20'
                        : 'bg-[#070510] text-gray-400 hover:text-white hover:bg-[#141020] border border-[#1A1726]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Content</p>

              {activeTab === 'url' && (
                <div>
                  <label className={labelClass}>URL</label>
                  <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className={inputClass} />
                </div>
              )}

              {activeTab === 'text' && (
                <div>
                  <label className={labelClass}>Text</label>
                  <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter any text..." rows={4} className={inputClass + ' resize-none'} />
                </div>
              )}

              {activeTab === 'wifi' && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Network Name (SSID)</label>
                    <input type="text" value={wifi.ssid} onChange={e => setWifi(w => ({ ...w, ssid: e.target.value }))} placeholder="MyNetwork" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input type="text" value={wifi.password} onChange={e => setWifi(w => ({ ...w, password: e.target.value }))} placeholder="Password" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Encryption</label>
                    <div className="flex gap-2">
                      {(['WPA', 'WEP', 'nopass'] as const).map(enc => (
                        <button
                          key={enc}
                          onClick={() => setWifi(w => ({ ...w, encryption: enc }))}
                          className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${
                            wifi.encryption === enc
                              ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/40 font-medium'
                              : 'bg-[#070510] text-gray-400 border-[#1A1726] hover:text-white'
                          }`}
                        >
                          {enc === 'nopass' ? 'None' : enc}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={wifi.hidden}
                      onChange={e => setWifi(w => ({ ...w, hidden: e.target.checked }))}
                      className="w-4 h-4 rounded border-[#1A1726] accent-[#E8970A]"
                    />
                    Hidden network
                  </label>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" value={email.to} onChange={e => setEmail(d => ({ ...d, to: e.target.value }))} placeholder="hello@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <input type="text" value={email.subject} onChange={e => setEmail(d => ({ ...d, subject: e.target.value }))} placeholder="Subject line" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Body</label>
                    <textarea value={email.body} onChange={e => setEmail(d => ({ ...d, body: e.target.value }))} placeholder="Message body..." rows={3} className={inputClass + ' resize-none'} />
                  </div>
                </div>
              )}

              {activeTab === 'phone' && (
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" className={inputClass} />
                </div>
              )}

              {activeTab === 'sms' && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" value={sms.phone} onChange={e => setSms(d => ({ ...d, phone: e.target.value }))} placeholder="+1 234 567 8900" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea value={sms.message} onChange={e => setSms(d => ({ ...d, message: e.target.value }))} placeholder="Your message..." rows={3} className={inputClass + ' resize-none'} />
                  </div>
                </div>
              )}

              {activeTab === 'vcard' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input type="text" value={vcard.firstName} onChange={e => setVcard(d => ({ ...d, firstName: e.target.value }))} placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input type="text" value={vcard.lastName} onChange={e => setVcard(d => ({ ...d, lastName: e.target.value }))} placeholder="Doe" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="tel" value={vcard.phone} onChange={e => setVcard(d => ({ ...d, phone: e.target.value }))} placeholder="+1 234 567 8900" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={vcard.email} onChange={e => setVcard(d => ({ ...d, email: e.target.value }))} placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input type="text" value={vcard.company} onChange={e => setVcard(d => ({ ...d, company: e.target.value }))} placeholder="Acme Inc." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input type="text" value={vcard.title} onChange={e => setVcard(d => ({ ...d, title: e.target.value }))} placeholder="Developer" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Website</label>
                    <input type="url" value={vcard.website} onChange={e => setVcard(d => ({ ...d, website: e.target.value }))} placeholder="https://example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" value={vcard.address} onChange={e => setVcard(d => ({ ...d, address: e.target.value }))} placeholder="123 Main St, City, State" className={inputClass} />
                  </div>
                </div>
              )}

              {activeTab === 'event' && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Event Title</label>
                    <input type="text" value={event.title} onChange={e => setEvent(d => ({ ...d, title: e.target.value }))} placeholder="Team Meeting" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input type="text" value={event.location} onChange={e => setEvent(d => ({ ...d, location: e.target.value }))} placeholder="Conference Room A" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="date" value={event.startDate} onChange={e => setEvent(d => ({ ...d, startDate: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Start Time</label>
                      <input type="time" value={event.startTime} onChange={e => setEvent(d => ({ ...d, startTime: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="date" value={event.endDate} onChange={e => setEvent(d => ({ ...d, endDate: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>End Time</label>
                      <input type="time" value={event.endTime} onChange={e => setEvent(d => ({ ...d, endTime: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Sections */}
            <Section title="Colors" icon={<Palette size={16} />}>
              <ColorInput label="Foreground" value={fgColor} onChange={setFgColor} />
              <ColorInput label="Background" value={bgColor} onChange={setBgColor} />
            </Section>

            <Section title="Size & Layout" icon={<Maximize2 size={16} />} defaultOpen={false}>
              {/* Size presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: 'Small', size: 200 },
                  { label: 'Medium', size: 400 },
                  { label: 'Large', size: 600 },
                  { label: 'XL', size: 800 },
                  { label: 'Print', size: 1000 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setQrSize(preset.size)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${qrSize === preset.size ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/40' : 'bg-[#070510] text-gray-400 border-[#1A1726] hover:text-white'}`}
                  >
                    {preset.label} ({preset.size}px)
                  </button>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-gray-400">Size</label>
                  <span className="text-xs text-gray-500 font-mono">{qrSize}px</span>
                </div>
                <input
                  type="range" min={200} max={1000} step={50} value={qrSize}
                  onChange={e => setQrSize(Number(e.target.value))}
                  className="w-full accent-[#E8970A]"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                  <span>200px</span><span>1000px</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-gray-400">Margin</label>
                  <span className="text-xs text-gray-500 font-mono">{marginSize} modules</span>
                </div>
                <input
                  type="range" min={0} max={10} value={marginSize}
                  onChange={e => setMarginSize(Number(e.target.value))}
                  className="w-full accent-[#E8970A]"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                  <span>0</span><span>10</span>
                </div>
              </div>
            </Section>

            <Section title="Error Correction" icon={<Shield size={16} />} defaultOpen={false}>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as ECLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setEcLevel(level)}
                    className={`relative py-3 rounded-lg text-sm font-medium transition-all border ${
                      ecLevel === level
                        ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/40'
                        : 'bg-[#070510] text-gray-400 border-[#1A1726] hover:text-white hover:border-[#2A2736]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#070510] border border-[#1A1726]">
                <Info size={14} className="text-[#E8970A] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400">{EC_LABELS[ecLevel].desc}</p>
              </div>
            </Section>

            <Section title="Dot Style" icon={<Square size={16} />} defaultOpen={false}>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'square' as DotStyle, label: 'Square', icon: <Square size={20} /> },
                  { id: 'rounded' as DotStyle, label: 'Rounded', icon: <Square size={20} className="[&_rect]{rx:4}" /> },
                  { id: 'dots' as DotStyle, label: 'Dots', icon: <Circle size={20} /> },
                ]).map(style => (
                  <button
                    key={style.id}
                    onClick={() => setDotStyle(style.id)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-lg text-sm transition-all border ${
                      dotStyle === style.id
                        ? 'bg-[#E8970A]/15 text-[#E8970A] border-[#E8970A]/40 font-medium'
                        : 'bg-[#070510] text-gray-400 border-[#1A1726] hover:text-white hover:border-[#2A2736]'
                    }`}
                  >
                    {style.icon}
                    {style.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Logo Overlay" icon={<ImageIcon size={16} />} defaultOpen={false}>
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => setLogoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {!logoFile ? (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-6 rounded-lg border-2 border-dashed border-[#1A1726] text-gray-500 hover:text-gray-300 hover:border-[#2A2736] transition-colors flex flex-col items-center gap-2"
                  >
                    <Upload size={24} />
                    <span className="text-sm">Click to upload a logo</span>
                    <span className="text-xs text-gray-600">PNG, JPG, SVG recommended</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#070510] border border-[#1A1726]">
                    <ImageIcon size={18} className="text-[#E8970A]" />
                    <span className="text-sm text-gray-300 flex-1 truncate">{logoFile.name}</span>
                    <button
                      onClick={() => { setLogoFile(null); if (logoInputRef.current) logoInputRef.current.value = '' }}
                      className="p-1 rounded hover:bg-[#1A1726] text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              {logoFile && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm text-gray-400">Logo Size</label>
                    <span className="text-xs text-gray-500 font-mono">{logoPct}%</span>
                  </div>
                  <input
                    type="range" min={10} max={30} value={logoPct}
                    onChange={e => setLogoPct(Number(e.target.value))}
                    className="w-full accent-[#E8970A]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                    <span>10%</span><span>30%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 flex items-start gap-1.5">
                    <Info size={12} className="text-[#E8970A] mt-0.5 shrink-0" />
                    Tip: Use error correction level Q or H when adding a logo for best scan reliability.
                  </p>
                </div>
              )}
            </Section>

            <Section title="Frame & Label" icon={<Tag size={16} />} defaultOpen={false}>
              <div>
                <label className={labelClass}>Label Text</label>
                <input
                  type="text"
                  value={frameText}
                  onChange={e => setFrameText(e.target.value)}
                  placeholder="Scan Me"
                  className={inputClass}
                />
              </div>
              {frameText && (
                <>
                  <ColorInput label="Text Color" value={frameColor} onChange={setFrameColor} />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm text-gray-400">Font Size</label>
                      <span className="text-xs text-gray-500 font-mono">{frameFontSize}px</span>
                    </div>
                    <input
                      type="range" min={10} max={36} value={frameFontSize}
                      onChange={e => setFrameFontSize(Number(e.target.value))}
                      className="w-full accent-[#E8970A]"
                    />
                  </div>
                </>
              )}
            </Section>
          </div>

          {/* ── Right Column: Preview & Actions ─────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Preview */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Preview</p>
              <div className="flex items-center justify-center p-4 rounded-lg bg-[#070510] border border-[#1A1726] overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: 400, imageRendering: dotStyle === 'square' ? 'pixelated' : 'auto' }}
                />
              </div>
            </div>

            {/* Download Actions */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5">
              <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Export</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={downloadPNG}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-[#E8970A] text-black font-semibold text-sm hover:bg-[#d4890a] transition-colors"
                >
                  <Download size={16} />
                  PNG
                </button>
                <button
                  onClick={downloadSVG}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-[#070510] border border-[#1A1726] text-gray-300 text-sm hover:text-white hover:border-[#2A2736] transition-colors"
                >
                  <Download size={16} />
                  SVG
                </button>
                <button
                  onClick={downloadJPG}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-[#070510] border border-[#1A1726] text-gray-300 text-sm hover:text-white hover:border-[#2A2736] transition-colors"
                >
                  <Download size={16} />
                  JPG
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#070510] border border-[#1A1726] text-gray-300 text-sm hover:text-white hover:border-[#2A2736] transition-colors"
                >
                  {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={printQR}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#070510] border border-[#1A1726] text-gray-300 text-sm hover:text-white hover:border-[#2A2736] transition-colors"
                >
                  <Printer size={15} />
                  Print
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <Shield size={16} className="text-[#E8970A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-1">100% Private</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Everything runs in your browser. No data is sent to any server. Your QR codes are generated locally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
