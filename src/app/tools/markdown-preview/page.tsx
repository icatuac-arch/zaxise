'use client'

import { useState, useMemo, useCallback, useRef } from 'react'


import { Copy, Check, FileText, Bold, Italic, Heading, Link, Image, List, Code, Download, Maximize2, Minimize2 } from 'lucide-react'

const DEFAULT_MARKDOWN = `# Markdown Preview

## Features

This is a **bold** and *italic* text example.

### Links and Images
[Visit GitHub](https://github.com)

![Placeholder](https://via.placeholder.com/150)

### Lists

- Item one
- Item two
  - Nested item
- Item three

1. First
2. Second
3. Third

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Code

Inline \`code\` example.

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table

| Name | Age | Role |
|------|-----|------|
| Alice | 30 | Dev |
| Bob | 25 | Design |

---

That's it!
`

function parseMarkdown(md: string): string {
  let html = md

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trimEnd()
    return `<pre class="md-code-block"><code class="language-${lang || 'text'}">${escaped}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, _sep, body) => {
    const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th class="md-th">${c.trim()}</th>`).join('')
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="md-td">${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    return `<table class="md-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
  })

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="md-h6">$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="md-h5">$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="md-h4">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="md-hr"/>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img"/>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link" target="_blank" rel="noopener">$1</a>')

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Blockquotes
  html = html.replace(/^(?:>\s?(.*)$\n?)+/gm, (block) => {
    const lines = block.split('\n').map(l => l.replace(/^>\s?/, '')).join('<br/>')
    return `<blockquote class="md-blockquote">${lines}</blockquote>`
  })

  // Unordered lists
  html = html.replace(/^([ ]*[-*+]\s+.+(\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(line => {
      const indent = line.match(/^(\s*)/)?.[1].length || 0
      const text = line.replace(/^\s*[-*+]\s+/, '')
      return `<li style="margin-left:${indent * 8}px">${text}</li>`
    }).join('')
    return `<ul class="md-ul">${items}</ul>`
  })

  // Ordered lists
  html = html.replace(/^(\d+\.\s+.+(\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(line => {
      const text = line.replace(/^\d+\.\s+/, '')
      return `<li>${text}</li>`
    }).join('')
    return `<ol class="md-ol">${items}</ol>`
  })

  // Paragraphs
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="md-p">$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p class="md-p">\s*<\/p>/g, '')

  return html
}

const MD_STYLES = `
.md-preview { color: #e2e8f0; line-height: 1.7; }
.md-preview .md-h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0 0.33em; color: #fff; font-family: 'Playfair Display', serif; border-bottom: 1px solid #1A1726; padding-bottom: 0.3em; }
.md-preview .md-h2 { font-size: 1.5em; font-weight: 700; margin: 0.83em 0 0.33em; color: #fff; font-family: 'Playfair Display', serif; border-bottom: 1px solid #1A1726; padding-bottom: 0.2em; }
.md-preview .md-h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.33em; color: #fff; font-family: 'Playfair Display', serif; }
.md-preview .md-h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0 0.33em; color: #fff; }
.md-preview .md-h5 { font-size: 1em; font-weight: 600; margin: 1em 0 0.33em; color: #fff; }
.md-preview .md-h6 { font-size: 0.9em; font-weight: 600; margin: 1em 0 0.33em; color: #aaa; }
.md-preview .md-p { margin: 0.5em 0; }
.md-preview .md-link { color: #E8970A; text-decoration: underline; }
.md-preview .md-img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
.md-preview .md-blockquote { border-left: 4px solid #E8970A; padding-left: 1em; color: #a0aec0; margin: 0.5em 0; }
.md-preview .md-ul, .md-preview .md-ol { padding-left: 1.5em; margin: 0.5em 0; }
.md-preview .md-ul li { list-style-type: disc; }
.md-preview .md-ol li { list-style-type: decimal; }
.md-preview .md-inline-code { background: #1A1726; padding: 0.15em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #E8970A; }
.md-preview .md-code-block { background: #0a0818; border: 1px solid #1A1726; border-radius: 8px; padding: 1em; overflow-x: auto; margin: 0.5em 0; }
.md-preview .md-code-block code { font-family: monospace; font-size: 0.9em; color: #a0f0a0; }
.md-preview .md-hr { border: none; border-top: 1px solid #1A1726; margin: 1.5em 0; }
.md-preview .md-table { width: 100%; border-collapse: collapse; margin: 0.5em 0; }
.md-preview .md-th { border: 1px solid #1A1726; padding: 0.5em 1em; background: #0a0818; font-weight: 600; text-align: left; }
.md-preview .md-td { border: 1px solid #1A1726; padding: 0.5em 1em; }
`

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [editorFullscreen, setEditorFullscreen] = useState(false)
  const [previewFullscreen, setPreviewFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const htmlOutput = useMemo(() => parseMarkdown(markdown), [markdown])

  const wordCount = useMemo(() => {
    const text = markdown.replace(/[#*`\[\]()>_~|=-]/g, '').trim()
    return text ? text.split(/\s+/).length : 0
  }, [markdown])

  const charCount = markdown.length

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = markdown.slice(start, end)
    const replacement = before + (selected || 'text') + after
    const newValue = markdown.slice(0, start) + replacement + markdown.slice(end)
    setMarkdown(newValue)
    setTimeout(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + (selected || 'text').length
    }, 0)
  }, [markdown])

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlOutput)
    setCopiedHtml(true)
    setTimeout(() => setCopiedHtml(false), 1500)
  }

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>${MD_STYLES.replace('.md-preview', 'body')}</style></head><body class="md-preview">${htmlOutput}</body></html>`
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertAtCursor('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertAtCursor('*', '*'), title: 'Italic' },
    { icon: Heading, action: () => insertAtCursor('## '), title: 'Heading' },
    { icon: Link, action: () => insertAtCursor('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertAtCursor('![alt](', ')'), title: 'Image' },
    { icon: List, action: () => insertAtCursor('- '), title: 'List' },
    { icon: Code, action: () => insertAtCursor('`', '`'), title: 'Code' },
    { icon: FileText, action: () => insertAtCursor('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n'), title: 'Table' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: MD_STYLES }} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Markdown Preview
            </h1>
          </div>
          <p className="text-gray-400">Write markdown and see the rendered output in real time</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold"># Hello</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-lg font-bold">Hello</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Write Markdown</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>See live preview</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy HTML</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Supports tables, code blocks, and images.</p>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={copyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
          >
            {copiedHtml ? <Check size={14} /> : <Copy size={14} />}
            {copiedHtml ? 'Copied!' : 'Copy HTML'}
          </button>
          <button
            onClick={downloadMd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white transition-colors"
          >
            <Download size={14} />
            Download .md
          </button>
          <button
            onClick={downloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white transition-colors"
          >
            <Download size={14} />
            Export HTML
          </button>
        </div>

        <div className={`grid gap-4 ${editorFullscreen || previewFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Editor */}
          {!previewFullscreen && (
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1726]">
                <div className="flex items-center gap-1">
                  {toolbarButtons.map(({ icon: Icon, action, title }) => (
                    <button
                      key={title}
                      onClick={action}
                      title={title}
                      className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-[#1A1726] transition-colors"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setEditorFullscreen(!editorFullscreen)}
                  className="p-1.5 rounded text-gray-500 hover:text-white transition-colors"
                >
                  {editorFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 min-h-[500px] bg-transparent px-4 py-3 text-white font-mono text-sm resize-none focus:outline-none"
                placeholder="Type your markdown here..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview */}
          {!editorFullscreen && (
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1726]">
                <span className="text-sm text-gray-400">Preview</span>
                <button
                  onClick={() => setPreviewFullscreen(!previewFullscreen)}
                  className="p-1.5 rounded text-gray-500 hover:text-white transition-colors"
                >
                  {previewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
              <div
                className="md-preview flex-1 min-h-[500px] px-4 py-3 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          )}
        </div>
      </main>
      
    </div>
  )
}
