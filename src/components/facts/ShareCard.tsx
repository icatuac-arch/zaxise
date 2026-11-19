'use client'

import { useState } from 'react'
import { Copy, Share2, Check, ExternalLink } from 'lucide-react'

interface Fact {
  id: string
  category: string
  text: string
  source: { name: string; url: string }
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  publishedAt: string
}

const CATEGORY_ICONS: Record<string, string> = {
  'Space': '🚀', 'Animals': '🐾', 'Human Body': '🧬', 'History': '📜',
  'Geography': '🌍', 'Science': '🔬', 'Technology': '💻', 'Food': '🍳',
  'Language': '🗣️', 'Ocean': '🌊', 'Music': '🎵', 'Sports': '🏆',
  'Art': '🎨', 'Nature': '🌿', 'Math': '🔢', 'Psychology': '🧠',
  'Culture': '🎭', 'Medicine': '⚕️', 'Economics': '📊', 'Architecture': '🏛️',
  'Astronomy': '🔭', 'Chemistry': '⚗️', 'Climate & Weather': '🌦️',
  'Engineering': '⚙️', 'Environment': '♻️', 'Geology': '🪨',
  'Inventions': '💡', 'Law & Government': '⚖️', 'Literature': '📚',
  'Mythology': '🐉', 'Philosophy': '🤔', 'Photography & Film': '📷',
  'Religion': '🕊️', 'Transportation': '🚂', 'World Records': '🏅',
  'Archaeology': '🏺', 'Biology': '🧫', 'Energy': '⚡',
  'Communication': '📡', 'Agriculture': '🌾',
}

interface ShareCardProps {
  fact: Fact
  /** If true, renders as a large standalone share page card */
  fullPage?: boolean
}

export function ShareCard({ fact, fullPage = false }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Did You Know?\n\n"${fact.text}"\n\n— Source: ${fact.source.name}\n\n🔗 didyouknow.vercel.app/share/${fact.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Did You Know?',
      text: `"${fact.text}" — Source: ${fact.source.name}`,
      url: `https://didyouknow.vercel.app/share/${fact.id}`,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed — fall back to copy
        await handleCopy()
      }
    } else {
      await handleCopy()
    }
  }

  const icon = CATEGORY_ICONS[fact.category] || '📌'

  return (
    <div className={fullPage ? 'w-full' : ''}>
      {/* The shareable card visual */}
      <div
        className={`relative overflow-hidden ${fullPage ? 'p-8 sm:p-12' : 'p-6'}`}
        style={{
          background: 'var(--bg)',
          border: '2px solid var(--text)',
          fontFamily: 'var(--font-display)',
        }}
      >
        {/* Top bar: branding + category */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span
              className="font-mono font-bold tracking-[0.12em] uppercase"
              style={{
                fontSize: fullPage ? '0.85rem' : '0.7rem',
                color: 'var(--accent)',
                borderBottom: '2px solid var(--accent)',
                paddingBottom: '1px',
              }}
            >
              Did You Know?
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 font-mono uppercase tracking-[0.08em]"
            style={{
              fontSize: fullPage ? '0.75rem' : '0.62rem',
              color: 'var(--muted)',
              border: '1.5px solid var(--muted)',
              padding: '3px 10px',
            }}
          >
            <span>{icon}</span>
            <span>{fact.category}</span>
          </div>
        </div>

        {/* Decorative quote mark */}
        <div
          className="font-display italic leading-none select-none"
          style={{
            fontSize: fullPage ? '7rem' : '5rem',
            color: 'var(--accent)',
            opacity: 0.12,
            lineHeight: 1,
            marginBottom: '-2rem',
            marginLeft: '-4px',
          }}
        >
          &ldquo;
        </div>

        {/* Fact text */}
        <p
          className="font-display leading-snug tracking-tight relative"
          style={{
            fontSize: fullPage ? 'clamp(22px, 3vw, 38px)' : 'clamp(16px, 2.5vw, 22px)',
            color: 'var(--text)',
            zIndex: 1,
          }}
        >
          {fact.text}
        </p>

        {/* Bottom: source + url */}
        <div
          className="mt-5 pt-4 flex items-center justify-between flex-wrap gap-2"
          style={{ borderTop: '1px dashed var(--muted)', opacity: 0.6 }}
        >
          <a
            href={fact.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase tracking-[0.1em] hover:underline flex items-center gap-1"
            style={{
              fontSize: fullPage ? '0.72rem' : '0.6rem',
              color: 'var(--muted)',
            }}
          >
            {fact.source.name}
            <ExternalLink size={fullPage ? 11 : 9} />
          </a>
          <span
            className="font-mono tracking-[0.08em]"
            style={{
              fontSize: fullPage ? '0.7rem' : '0.58rem',
              color: 'var(--muted)',
            }}
          >
            didyouknow.vercel.app
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className={`flex gap-2 mt-3 ${fullPage ? 'justify-center' : ''}`}>
        <button
          onClick={handleCopy}
          className="btn flex items-center gap-2"
          style={{
            fontSize: fullPage ? '0.85rem' : '0.75rem',
            padding: fullPage ? '0.625rem 1.5rem' : '0.5rem 1rem',
          }}
        >
          {copied
            ? <><Check size={14} /> Copied!</>
            : <><Copy size={14} /> Copy Text</>
          }
        </button>
        <button
          onClick={handleShare}
          className="btn btn-primary flex items-center gap-2"
          style={{
            fontSize: fullPage ? '0.85rem' : '0.75rem',
            padding: fullPage ? '0.625rem 1.5rem' : '0.5rem 1rem',
          }}
        >
          <Share2 size={14} /> Share
        </button>
        <a
          href={`/share/${fact.id}`}
          className="btn flex items-center gap-2"
          style={{
            fontSize: fullPage ? '0.85rem' : '0.75rem',
            padding: fullPage ? '0.625rem 1.5rem' : '0.5rem 1rem',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={14} /> Share Link
        </a>
      </div>
    </div>
  )
}
