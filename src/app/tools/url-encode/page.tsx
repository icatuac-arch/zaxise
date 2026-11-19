'use client'

import { useState, useMemo } from 'react'


import { Link, Copy, Check, ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

interface QueryParam {
  id: number
  key: string
  value: string
}

let nextParamId = 1

export default function UrlEncodePage() {
  const [plain, setPlain] = useState('')
  const [encoded, setEncoded] = useState('')
  const [copied, setCopied] = useState('')
  const [mode, setMode] = useState<'single' | 'bulk' | 'builder' | 'parser'>('single')
  const [bulkInput, setBulkInput] = useState('')
  const [params, setParams] = useState<QueryParam[]>([{ id: nextParamId++, key: '', value: '' }])
  const [parseUrl, setParseUrl] = useState('')

  const encode = () => setEncoded(encodeURIComponent(plain))
  const decode = () => setPlain(decodeURIComponent(encoded))

  const copy = async (k: string, v: string) => {
    await navigator.clipboard.writeText(v)
    setCopied(k)
    setTimeout(() => setCopied(''), 1500)
  }

  // Bulk encode
  const bulkResult = useMemo(() => {
    if (!bulkInput.trim()) return ''
    return bulkInput.split('\n').map(line => encodeURIComponent(line)).join('\n')
  }, [bulkInput])

  // Query string builder
  const builtUrl = useMemo(() => {
    const validParams = params.filter(p => p.key.trim())
    if (validParams.length === 0) return ''
    const qs = validParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
    return `?${qs}`
  }, [params])

  const addParam = () => setParams([...params, { id: nextParamId++, key: '', value: '' }])
  const removeParam = (id: number) => { if (params.length > 1) setParams(params.filter(p => p.id !== id)) }
  const updateParam = (id: number, field: 'key' | 'value', val: string) => {
    setParams(params.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  // URL parser
  const parsedComponents = useMemo(() => {
    if (!parseUrl.trim()) return null
    try {
      const url = new URL(parseUrl.startsWith('http') ? parseUrl : `https://${parseUrl}`)
      const searchParams: [string, string][] = []
      url.searchParams.forEach((v, k) => searchParams.push([k, v]))
      return {
        protocol: url.protocol,
        host: url.hostname,
        port: url.port || '(default)',
        path: url.pathname,
        query: url.search,
        hash: url.hash,
        origin: url.origin,
        params: searchParams,
      }
    } catch {
      return 'invalid'
    }
  }, [parseUrl])

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Link size={28} /> URL Encoder / Decoder
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Encode special characters in URLs or decode percent-encoded URLs.</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">hello world</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-sm font-mono font-bold">hello%20world</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste URL/text</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Encode or Decode</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy</span>
          </div>
          <p className="text-center text-xs text-gray-500">Essential for building URLs with special characters.</p>
        </div>

        {/* Mode tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'single', label: 'Encode/Decode' },
            { key: 'bulk', label: 'Bulk Encode' },
            { key: 'builder', label: 'Query Builder' },
            { key: 'parser', label: 'URL Parser' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setMode(t.key as any)}
              className={`px-4 py-2 rounded-lg text-sm ${mode === t.key ? 'bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30' : 'text-gray-400 border border-[#1A1726] hover:bg-white/5'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Single encode/decode */}
        {mode === 'single' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Plain URL/Text</label>
                {plain && <button onClick={() => copy('p', plain)} className="text-gray-400">{copied === 'p' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
              <textarea value={plain} onChange={(e) => setPlain(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
            </div>
            <div className="flex justify-center gap-2">
              <button onClick={encode} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium text-sm"><ArrowDown size={14} />Encode</button>
              <button onClick={decode} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-sm"><ArrowUp size={14} />Decode</button>
            </div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Encoded</label>
                {encoded && <button onClick={() => copy('e', encoded)} className="text-gray-400">{copied === 'e' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
              <textarea value={encoded} onChange={(e) => setEncoded(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
            </div>
          </div>
        )}

        {/* Bulk encode */}
        {mode === 'bulk' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <label className="text-xs text-gray-400 mb-2 block">Input (one per line)</label>
              <textarea value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} rows={6} placeholder="Enter multiple lines to encode..." className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
            </div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Encoded Results</label>
                {bulkResult && <button onClick={() => copy('bulk', bulkResult)} className="text-gray-400">{copied === 'bulk' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>}
              </div>
              <textarea value={bulkResult} readOnly rows={6} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-green-400 text-sm font-mono" />
            </div>
          </div>
        )}

        {/* Query string builder */}
        {mode === 'builder' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-300 font-medium">Query Parameters</label>
                <button onClick={addParam} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-[#E8970A]/10 text-[#E8970A]"><Plus size={12} /> Add</button>
              </div>
              <div className="space-y-2">
                {params.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input value={p.key} onChange={e => updateParam(p.id, 'key', e.target.value)} placeholder="key" className="flex-1 px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
                    <span className="text-gray-500">=</span>
                    <input value={p.value} onChange={e => updateParam(p.id, 'value', e.target.value)} placeholder="value" className="flex-1 px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
                    <button onClick={() => removeParam(p.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
            {builtUrl && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">Generated Query String</label>
                  <button onClick={() => copy('qs', builtUrl)} className="text-gray-400">{copied === 'qs' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}</button>
                </div>
                <pre className="px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-green-400 text-sm font-mono whitespace-pre-wrap break-all">{builtUrl}</pre>
              </div>
            )}
          </div>
        )}

        {/* URL parser */}
        {mode === 'parser' && (
          <div className="space-y-4">
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
              <label className="text-xs text-gray-400 mb-2 block">Enter URL to parse</label>
              <input value={parseUrl} onChange={e => setParseUrl(e.target.value)} placeholder="https://example.com/path?key=value#section" className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm font-mono" />
            </div>
            {parsedComponents && parsedComponents !== 'invalid' && (
              <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4">
                <label className="text-sm text-gray-300 font-medium mb-3 block">Parsed Components</label>
                <div className="space-y-2">
                  {[
                    { label: 'Protocol', value: parsedComponents.protocol },
                    { label: 'Host', value: parsedComponents.host },
                    { label: 'Port', value: parsedComponents.port },
                    { label: 'Path', value: parsedComponents.path },
                    { label: 'Query', value: parsedComponents.query || '(none)' },
                    { label: 'Hash', value: parsedComponents.hash || '(none)' },
                    { label: 'Origin', value: parsedComponents.origin },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726]">
                      <span className="text-xs text-gray-500 w-20">{item.label}</span>
                      <code className="flex-1 text-sm text-gray-200 font-mono truncate">{item.value}</code>
                      <button onClick={() => copy(item.label, item.value)} className="text-gray-400 hover:text-white shrink-0">
                        {copied === item.label ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                  {parsedComponents.params.length > 0 && (
                    <div className="mt-3">
                      <label className="text-xs text-gray-400 mb-2 block">Query Parameters</label>
                      {parsedComponents.params.map(([k, v], i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070510] border border-[#1A1726] mb-1">
                          <code className="text-xs text-[#E8970A] font-mono">{k}</code>
                          <span className="text-gray-500">=</span>
                          <code className="text-xs text-green-400 font-mono">{v}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {parsedComponents === 'invalid' && parseUrl.trim() && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">Invalid URL format</div>
            )}
          </div>
        )}
      </main>
      
    </div>
  )
}
