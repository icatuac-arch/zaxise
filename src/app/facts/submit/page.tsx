'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Send, CheckCircle, Clock, AlertCircle,
  Lightbulb, ExternalLink,
} from 'lucide-react'

const CATEGORIES = [
  "Space", "Animals", "Human Body", "History", "Geography", "Science",
  "Technology", "Food", "Language", "Ocean", "Music", "Sports",
  "Art", "Nature", "Math", "Psychology", "Culture", "Medicine", "Economics",
]

interface Submission {
  id: string
  category: string
  text: string
  sourceName: string
  sourceUrl: string
  submittedAt: string
  status: 'under_review'
}

export default function SubmitPage() {
  const [category, setCategory] = useState('')
  const [text, setText] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const s = localStorage.getItem('dyk-submissions')
      if (s) setSubmissions(JSON.parse(s))
    } catch {}
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!category) { setError('Please select a category.'); return }
    if (text.trim().length < 20) { setError('Your fact should be at least 20 characters long.'); return }
    if (!sourceName.trim()) { setError('Please provide a source name.'); return }

    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      category,
      text: text.trim(),
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      submittedAt: new Date().toISOString(),
      status: 'under_review',
    }

    const updated = [newSubmission, ...submissions]
    setSubmissions(updated)
    localStorage.setItem('dyk-submissions', JSON.stringify(updated))

    // Reset form
    setCategory('')
    setText('')
    setSourceName('')
    setSourceUrl('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-wide hover:text-tomato transition-colors mb-8 inline-flex items-center gap-1">
        <ChevronLeft size={14} /> Back
      </Link>

      <div className="text-center mb-12">
        <Send size={32} strokeWidth={1.5} className="mx-auto mb-4" />
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Submit a <span className="italic" style={{ color: 'var(--tomato)' }}>Fact</span>
        </h1>
        <p className="font-display italic text-lg" style={{ color: 'var(--ink-soft)' }}>
          Know something fascinating? Share it with the world.
        </p>
      </div>

      {/* Guidelines */}
      <div className="mb-10 p-6" style={{ border: '1.5px solid var(--ink)', background: 'var(--cream-2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} />
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] font-semibold">Submission Guidelines</h3>
        </div>
        <ul className="space-y-2 font-display text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          <li>- Facts should be surprising, verifiable, and globally interesting</li>
          <li>- Include a credible source (academic paper, museum, government agency, reputable media)</li>
          <li>- Avoid common knowledge --- aim for "I had no idea!" reactions</li>
          <li>- Keep facts concise: 1--3 sentences maximum</li>
          <li>- Diverse, non-US-centric facts are especially welcome</li>
          <li>- No opinions, urban legends, or unverified claims</li>
        </ul>
      </div>

      {/* Success message */}
      {submitted && (
        <div className="mb-8 p-4 flex items-center gap-3" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          <CheckCircle size={20} />
          <span className="font-mono text-sm">Fact submitted successfully! It will appear below as "Under Review."</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-16">
        {/* Category */}
        <div>
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>
            Category *
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                className={`pill ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Fact text */}
        <div>
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>
            Your Fact *
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Did you know that..."
            rows={4}
            className="w-full px-4 py-3 bg-transparent font-display text-base leading-relaxed placeholder:italic resize-none focus:outline-none"
            style={{ border: '1.5px solid var(--ink)', color: 'var(--ink)' }}
          />
          <p className="font-mono text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>
            {text.length} characters
          </p>
        </div>

        {/* Source name */}
        <div>
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>
            Source Name *
          </label>
          <input
            type="text"
            value={sourceName}
            onChange={e => setSourceName(e.target.value)}
            placeholder="e.g., NASA, Smithsonian, Nature journal"
            className="w-full px-4 py-3 bg-transparent font-display text-base placeholder:italic focus:outline-none"
            style={{ border: '1.5px solid var(--ink)', color: 'var(--ink)' }}
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="font-mono text-xs uppercase tracking-[0.14em] block mb-3" style={{ color: 'var(--ink-soft)' }}>
            Source URL (optional)
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-transparent font-display text-base placeholder:italic focus:outline-none"
            style={{ border: '1.5px solid var(--ink)', color: 'var(--ink)' }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3" style={{ color: 'var(--tomato)' }}>
            <AlertCircle size={16} />
            <span className="font-mono text-xs">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button type="submit" className="btn btn-primary text-base px-6 py-3">
          <Send size={16} /> Submit Fact
        </button>
      </form>

      {/* Previous submissions */}
      {submissions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6" style={{ borderTop: '1.5px solid var(--ink)', paddingTop: '2rem' }}>
            <Clock size={18} />
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] font-semibold">Your Submissions</h2>
            <span className="font-mono text-xs" style={{ color: 'var(--ink-soft)' }}>({submissions.length})</span>
          </div>

          <div className="space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="p-5" style={{ border: '1.5px solid var(--ink)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="stamp" style={{ borderRadius: '999px' }}>{sub.category}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] px-2 py-1" style={{ background: 'var(--ochre)', color: 'var(--cream)', borderRadius: '999px' }}>
                    <Clock size={11} /> Under Review
                  </span>
                </div>
                <p className="font-display text-base leading-relaxed mb-3">{sub.text}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: 'var(--ink-soft)' }}>
                    {sub.sourceName}
                    {sub.sourceUrl && (
                      <a href={sub.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center hover:text-tomato">
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--ink-soft)' }}>
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
