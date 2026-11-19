import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFactById } from '../../../../lib/facts'
import { ShareCard } from '@/components/facts/ShareCard'
import { ChevronLeft, Shuffle } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const fact = getFactById(id)

  if (!fact) {
    return {
      title: 'Fact Not Found — Did You Know?',
    }
  }

  const truncated = fact.text.length > 160
    ? fact.text.slice(0, 157) + '...'
    : fact.text

  return {
    title: `Did You Know? ${fact.category} Fact`,
    description: truncated,
    openGraph: {
      title: 'Did You Know?',
      description: truncated,
      url: `https://didyouknow.vercel.app/share/${id}`,
      siteName: 'Did You Know?',
      type: 'article',
      images: [
        {
          url: `https://didyouknow.vercel.app/api/og?id=${id}`,
          width: 1200,
          height: 630,
          alt: `Did You Know? — ${fact.category}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Did You Know?',
      description: truncated,
      images: [`https://didyouknow.vercel.app/api/og?id=${id}`],
    },
  }
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

export default async function SharePage({ params }: Props) {
  const { id } = await params
  const fact = getFactById(id)

  if (!fact) {
    notFound()
  }

  const icon = CATEGORY_ICONS[fact.category] || '📌'

  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16"
      style={{ color: 'var(--text)' }}
    >
      <div className="w-full max-w-2xl">
        {/* Back nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <span
            className="font-mono text-xs uppercase tracking-[0.12em]"
            style={{ color: 'var(--muted)' }}
          >
            {icon} {fact.category}
          </span>
        </div>

        {/* Share card */}
        <ShareCard fact={fact} fullPage />

        {/* Fact metadata */}
        <div
          className="mt-6 flex flex-wrap gap-4 items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]"
          style={{ color: 'var(--muted)' }}
        >
          <span>Fact ID: {fact.id}</span>
          <div className="flex gap-2">
            {fact.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5"
                style={{ border: '1px solid var(--muted)', borderRadius: '999px' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Discover more */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1.5px solid var(--text)' }}
        >
          <p className="font-display italic text-lg" style={{ color: 'var(--muted)' }}>
            Want more fascinating facts?
          </p>
          <div className="flex gap-3">
            <Link href="/" className="btn flex items-center gap-2">
              <Shuffle size={14} /> Random Fact
            </Link>
            <Link href="/collections" className="btn btn-primary flex items-center gap-2">
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
