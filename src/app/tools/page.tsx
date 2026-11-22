'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/* ─── Tool data ─────────────────────────────────────────────────────────── */

interface Tool {
  slug: string;
  name: string;
  desc: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  accentBg: string;
  accentColor: string;
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  {
    id: 'pdf',
    label: 'PDF Tools',
    icon: '📄',
    accentBg: '#FDE8EF',
    accentColor: '#801C45',
    tools: [
      { slug: 'pdf-merge',    name: 'PDF Merge',      desc: 'Combine multiple PDFs into one' },
      { slug: 'pdf-split',    name: 'PDF Split',       desc: 'Extract or split PDF pages' },
      { slug: 'pdf-compress', name: 'PDF Compress',    desc: 'Reduce PDF file size' },
      { slug: 'pdf-rotate',   name: 'PDF Rotate',      desc: 'Rotate PDF pages' },
      { slug: 'pdf-reorder',  name: 'PDF Reorder',     desc: 'Drag & drop page reordering' },
      { slug: 'pdf-to-image', name: 'PDF to Image',    desc: 'Convert PDF pages to images' },
      { slug: 'pdf-to-text',  name: 'PDF to Text',     desc: 'Extract text from PDFs' },
      { slug: 'pdf-watermark',name: 'PDF Watermark',   desc: 'Add watermark to PDFs' },
      { slug: 'image-to-pdf', name: 'Image to PDF',    desc: 'Convert images to a PDF' },
    ],
  },
  {
    id: 'image',
    label: 'Image Tools',
    icon: '🖼️',
    accentBg: '#E8F4FD',
    accentColor: '#1565A8',
    tools: [
      { slug: 'image-compress',    name: 'Image Compress',     desc: 'Reduce image file size' },
      { slug: 'image-resize',      name: 'Image Resize',       desc: 'Resize images to any dimension' },
      { slug: 'image-crop',        name: 'Image Crop',         desc: 'Crop images precisely' },
      { slug: 'image-convert',     name: 'Image Convert',      desc: 'Convert between image formats' },
      { slug: 'image-watermark',   name: 'Image Watermark',    desc: 'Overlay text or logo on images' },
      { slug: 'image-collage',     name: 'Image Collage',      desc: 'Build collages from photos' },
      { slug: 'remove-bg',         name: 'Remove Background',  desc: 'Cut out image backgrounds' },
      { slug: 'passport-photo',    name: 'Passport Photo',     desc: 'Create passport-size photos' },
      { slug: 'svg-to-png',        name: 'SVG to PNG',         desc: 'Rasterize SVG files' },
      { slug: 'screenshot-mockup', name: 'Screenshot Mockup',  desc: 'Frame screenshots in devices' },
    ],
  },
  {
    id: 'dev',
    label: 'Developer Tools',
    icon: '⌨️',
    accentBg: '#E8FDF5',
    accentColor: '#087d70',
    tools: [
      { slug: 'json-formatter',  name: 'JSON Formatter',   desc: 'Format and validate JSON' },
      { slug: 'base64',          name: 'Base64 Encoder',   desc: 'Encode / decode Base64' },
      { slug: 'csv-json',        name: 'CSV ↔ JSON',       desc: 'Convert CSV and JSON' },
      { slug: 'diff-checker',    name: 'Diff Checker',     desc: 'Compare code or text' },
      { slug: 'regex-tester',    name: 'Regex Tester',     desc: 'Test regular expressions' },
      { slug: 'cron-builder',    name: 'Cron Builder',     desc: 'Build cron expressions visually' },
      { slug: 'url-encode',      name: 'URL Encoder',      desc: 'Encode / decode URLs' },
      { slug: 'uuid-generator',  name: 'UUID Generator',   desc: 'Generate UUIDs instantly' },
      { slug: 'color-picker',    name: 'Color Picker',     desc: 'Pick and convert colors' },
      { slug: 'css-gradient',    name: 'CSS Gradient',     desc: 'Create CSS gradients' },
      { slug: 'box-shadow',      name: 'Box Shadow',       desc: 'Generate box-shadow CSS' },
      { slug: 'favicon',         name: 'Favicon Generator',desc: 'Create favicon files' },
    ],
  },
  {
    id: 'text',
    label: 'Text Tools',
    icon: '✏️',
    accentBg: '#FFF6E8',
    accentColor: '#b45a27',
    tools: [
      { slug: 'case-converter',    name: 'Case Converter',      desc: 'Change text case in one click' },
      { slug: 'text-counter',      name: 'Text Counter',        desc: 'Count words, characters & lines' },
      { slug: 'find-replace',      name: 'Find & Replace',      desc: 'Bulk find and replace text' },
      { slug: 'lorem-ipsum',       name: 'Lorem Ipsum',         desc: 'Generate placeholder text' },
      { slug: 'slug-generator',    name: 'Slug Generator',      desc: 'Create URL-friendly slugs' },
      { slug: 'password-gen',      name: 'Password Generator',  desc: 'Generate secure passwords' },
      { slug: 'markdown-preview',  name: 'Markdown Preview',    desc: 'Live Markdown preview' },
      { slug: 'html-to-markdown',  name: 'HTML to Markdown',    desc: 'Convert HTML to Markdown' },
      { slug: 'text-diff',         name: 'Text Diff',           desc: 'Side-by-side text comparison' },
    ],
  },
  {
    id: 'time',
    label: 'Time Tools',
    icon: '⏱️',
    accentBg: '#F0ECFD',
    accentColor: '#5B3FC8',
    tools: [
      { slug: 'world-clock', name: 'World Clock',    desc: 'View time in any timezone' },
      { slug: 'pomodoro',    name: 'Pomodoro Timer', desc: 'Focus with Pomodoro sessions' },
      { slug: 'stopwatch',   name: 'Stopwatch',      desc: 'Track elapsed time' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    icon: '✦',
    accentBg: '#F3E6ED',
    accentColor: '#801C45',
    tools: [
      { slug: 'qr-generator', name: 'QR Generator', desc: 'Create QR codes from any text' },
      { slug: 'checklist',    name: 'Checklist',    desc: 'Build and check off task lists' },
      { slug: 'notes',        name: 'Notes',        desc: 'Quick scratch pad' },
      { slug: 'aspect-ratio', name: 'Aspect Ratio', desc: 'Calculate aspect ratio values' },
    ],
  },
];

const TOTAL = CATEGORIES.reduce((n, c) => n + c.tools.length, 0);

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ToolsIndexPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const q = query.toLowerCase().trim();

  const filtered = useMemo<Category[]>(() => {
    return CATEGORIES
      .filter((c) => !activeCategory || c.id === activeCategory)
      .map((c) => ({
        ...c,
        tools: q
          ? c.tools.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.desc.toLowerCase().includes(q) ||
                t.slug.includes(q)
            )
          : c.tools,
      }))
      .filter((c) => c.tools.length > 0);
  }, [q, activeCategory]);

  const totalVisible = filtered.reduce((n, c) => n + c.tools.length, 0);

  return (
    <div className="min-h-screen bg-paper text-ink">
      

      <main className="mx-auto max-w-[1260px] px-6 pb-16 pt-8">

        {/* ── Page hero ── */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1
              className="text-[38px] font-[850] leading-[1.1]"
              style={{ letterSpacing: '-1.4px' }}
            >
              Tool<b style={{ color: '#801C45' }}>s</b>
            </h1>
            <span className="text-[14px] font-[650] text-muted">
              {TOTAL} free, browser-based utilities
            </span>
          </div>
          <p className="mt-2 text-[14px] text-muted max-w-xl">
            Everything runs in your browser — no uploads to any server, no accounts required.
          </p>
        </div>

        {/* ── Search + category filters ── */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[16px] pointer-events-none select-none">
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-[14px] border border-[#E9DFE4] bg-white pl-9 pr-4 py-[10px] text-[14px] outline-none transition-all focus:border-[#BA7396] focus:ring-2 focus:ring-[#BA739620]"
              aria-label="Search tools"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-lg leading-none hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-[6px] text-[13px] font-[650] transition-all border ${
                activeCategory === null
                  ? 'bg-[#801C45] text-white border-[#801C45]'
                  : 'bg-white text-ink border-[#E9DFE4] hover:border-[#BA7396]'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={`rounded-full px-4 py-[6px] text-[13px] font-[650] transition-all border ${
                  activeCategory === c.id
                    ? 'bg-[#801C45] text-white border-[#801C45]'
                    : 'bg-white text-ink border-[#E9DFE4] hover:border-[#BA7396]'
                }`}
              >
                {c.icon}&nbsp; {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results summary when searching ── */}
        {q && (
          <p className="mb-5 text-[13px] text-muted">
            {totalVisible === 0
              ? 'No tools matched your search.'
              : `${totalVisible} tool${totalVisible !== 1 ? 's' : ''} matched "${query}"`}
          </p>
        )}

        {/* ── Category sections ── */}
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[20px] border border-[#E9DFE4] bg-white p-10 text-center text-muted">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-[650]">No tools found</p>
            <p className="text-sm mt-1">Try a different search term or clear the filter.</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory(null); }}
              className="mt-4 rounded-[12px] bg-[#801C45] px-5 py-2.5 text-[13px] font-[700] text-white hover:bg-[#631437] transition-colors"
            >
              Show all tools
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((cat) => (
              <section key={cat.id}>
                {/* Section header */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="grid place-items-center w-9 h-9 rounded-[11px] text-[18px]"
                    style={{ background: cat.accentBg }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <h2
                      className="text-[20px] font-[800] leading-tight"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      {cat.label}
                    </h2>
                    <span className="text-[12px] text-muted font-[600]">
                      {cat.tools.length} tool{cat.tools.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-[#E9DFE4] ml-2" />
                </div>

                {/* Tool grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} cat={cat} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── Bottom stats strip ── */}
        {!q && !activeCategory && (
          <div
            className="mt-14 rounded-[22px] border border-[#E9DFE4] bg-white px-7 py-5"
            style={{ boxShadow: '0 6px 24px #801C4508' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[22px] font-[800]" style={{ letterSpacing: '-0.6px' }}>
                  {TOTAL} tools,{' '}
                  <span style={{ color: '#801C45' }}>zero installs.</span>
                </p>
                <p className="text-[13px] text-muted mt-1">
                  Every tool runs entirely in your browser. Nothing is stored or sent.
                </p>
              </div>
              <div className="flex gap-5 text-center">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className="group transition-opacity hover:opacity-70"
                  >
                    <div className="text-[22px] font-[800]" style={{ color: c.accentColor }}>
                      {c.tools.length}
                    </div>
                    <div className="text-[11px] font-[650] text-muted whitespace-nowrap">
                      {c.label.replace(' Tools', '')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      
    </div>
  );
}

/* ─── Tool card sub-component ───────────────────────────────────────────── */

function ToolCard({ tool, cat }: { tool: Tool; cat: Category }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-2 rounded-[16px] border border-[#E9DFE4] bg-white p-4 transition-all duration-200 hover:-translate-y-[3px] hover:border-[#BA7396] hover:shadow-[0_14px_32px_#801C4512]"
    >
      {/* Slug-based icon badge */}
      <span
        className="w-9 h-9 rounded-[10px] grid place-items-center text-[13px] font-[700] shrink-0 select-none"
        style={{ background: cat.accentBg, color: cat.accentColor }}
        aria-hidden
      >
        {getToolGlyph(tool.slug)}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-[700] leading-snug text-ink group-hover:text-[#801C45] transition-colors">
          {tool.name}
        </p>
        <p className="mt-0.5 text-[11px] text-muted leading-snug line-clamp-2">
          {tool.desc}
        </p>
      </div>
    </Link>
  );
}

/* ─── Glyph helper ───────────────────────────────────────────────────────── */

const GLYPHS: Record<string, string> = {
  'pdf-merge':       '⊕',
  'pdf-split':       '⊘',
  'pdf-compress':    '⇩',
  'pdf-rotate':      '↻',
  'pdf-reorder':     '⇅',
  'pdf-to-image':    '⬚',
  'pdf-to-text':     'T',
  'pdf-watermark':   '◈',
  'image-to-pdf':    '⊞',
  'image-compress':  '⇩',
  'image-resize':    '⤡',
  'image-crop':      '⌗',
  'image-convert':   '⇄',
  'image-watermark': '◈',
  'image-collage':   '⊟',
  'remove-bg':       '✂',
  'passport-photo':  '◫',
  'svg-to-png':      'S',
  'screenshot-mockup':'⬜',
  'json-formatter':  '{}',
  'base64':          'B6',
  'csv-json':        '⇌',
  'diff-checker':    '±',
  'regex-tester':    '.*',
  'cron-builder':    '⏲',
  'url-encode':      '%',
  'uuid-generator':  '#',
  'color-picker':    '◉',
  'css-gradient':    '▤',
  'box-shadow':      '□',
  'favicon':         '⚑',
  'case-converter':  'Aa',
  'text-counter':    '123',
  'find-replace':    '⇆',
  'lorem-ipsum':     'Li',
  'slug-generator':  '⌘',
  'password-gen':    '🔑',
  'markdown-preview':'M↓',
  'html-to-markdown':'</>',
  'text-diff':       '≠',
  'world-clock':     '🌐',
  'pomodoro':        '◷',
  'stopwatch':       '⏱',
  'qr-generator':    '▦',
  'checklist':       '✓',
  'notes':           '✎',
  'aspect-ratio':    '⬛',
};

function getToolGlyph(slug: string): string {
  return GLYPHS[slug] ?? slug.slice(0, 2).toUpperCase();
}
