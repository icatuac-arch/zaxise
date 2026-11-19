'use client'

import { useState, useMemo } from 'react'


import { Copy, Check, FileCode, Download, ClipboardPaste } from 'lucide-react'

function htmlToMarkdown(html: string): string {
  let md = html

  // Remove script and style tags
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '')
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '')

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n')
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n')

  // Bold and italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
  md = md.replace(/<(del|s|strike)[^>]*>([\s\S]*?)<\/\1>/gi, '~~$2~~')

  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n')
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const lines = content.trim().replace(/<\/?p[^>]*>/gi, '').split('\n')
    return '\n' + lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l.trim() !== '>').join('\n') + '\n'
  })

  // Images
  md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)')
  md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)')

  // Links
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')

  // Tables
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent) => {
    const rows: string[][] = []
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    let rowMatch
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const cells: string[] = []
      const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].replace(/<[^>]*>/g, '').trim())
      }
      if (cells.length > 0) rows.push(cells)
    }
    if (rows.length === 0) return ''
    const maxCols = Math.max(...rows.map(r => r.length))
    const normalizedRows = rows.map(r => {
      while (r.length < maxCols) r.push('')
      return r
    })
    let result = '\n'
    result += '| ' + normalizedRows[0].join(' | ') + ' |\n'
    result += '| ' + normalizedRows[0].map(() => '---').join(' | ') + ' |\n'
    for (let i = 1; i < normalizedRows.length; i++) {
      result += '| ' + normalizedRows[i].join(' | ') + ' |\n'
    }
    return result
  })

  // Lists - unordered
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n').replace(/<[^>]*>/g, '') + '\n'
  })

  // Lists - ordered
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let idx = 0
    const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []
    const result = items.map((item: string) => {
      idx++
      const text = item.replace(/<\/?li[^>]*>/gi, '').replace(/<[^>]*>/g, '').trim()
      return `${idx}. ${text}`
    }).join('\n')
    return '\n' + result + '\n'
  })



  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')

  // Horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n')

  // Remove remaining HTML tags
  md = md.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&quot;/g, '"')
  md = md.replace(/&#39;/g, "'")
  md = md.replace(/&nbsp;/g, ' ')

  // Clean up excess whitespace
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.trim()

  return md
}

export default function HtmlToMarkdownPage() {
  const [htmlInput, setHtmlInput] = useState('')
  const [copiedMd, setCopiedMd] = useState(false)

  const markdownOutput = useMemo(() => {
    if (!htmlInput.trim()) return ''
    return htmlToMarkdown(htmlInput)
  }, [htmlInput])

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdownOutput)
    setCopiedMd(true)
    setTimeout(() => setCopiedMd(false), 1500)
  }

  const downloadMd = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const pasteHtml = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setHtmlInput(text)
    } catch {
      // fallback - do nothing
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              HTML to Markdown
            </h1>
          </div>
          <p className="text-gray-400">Convert HTML to clean Markdown instantly</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">&lt;h1&gt;Hello&lt;/h1&gt;</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-sm font-mono font-bold"># Hello</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Paste HTML</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Get Markdown</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy or download</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Handles tables, lists, and nested elements.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HTML Input */}
          <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1726]">
              <span className="text-sm font-medium text-gray-300">HTML Input</span>
              <button
                onClick={pasteHtml}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white transition-colors"
              >
                <ClipboardPaste size={12} />
                Paste
              </button>
            </div>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste your HTML here..."
              className="flex-1 min-h-[400px] bg-transparent px-4 py-3 text-white font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Markdown Output */}
          <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1726]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Markdown Output</span>
                {markdownOutput && <span className="text-xs text-gray-500">{markdownOutput.length} chars</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyMarkdown}
                  disabled={!markdownOutput}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors disabled:opacity-40"
                >
                  {copiedMd ? <Check size={12} /> : <Copy size={12} />}
                  {copiedMd ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadMd}
                  disabled={!markdownOutput}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white transition-colors disabled:opacity-40"
                >
                  <Download size={12} />
                  .md
                </button>
              </div>
            </div>
            <textarea
              value={markdownOutput}
              readOnly
              placeholder="Markdown will appear here..."
              className="flex-1 min-h-[400px] bg-transparent px-4 py-3 text-green-400 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
        </div>
      </main>
      
    </div>
  )
}
