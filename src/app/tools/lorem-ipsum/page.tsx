'use client'

import { useState } from 'react'


import { Type, Copy, Check, RefreshCw } from 'lucide-react'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function generateWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function generateSentence(): string {
  const len = 5 + Math.floor(Math.random() * 15)
  const words = []
  for (let i = 0; i < len; i++) words.push(generateWord())
  return words.join(' ').replace(/^./, c => c.toUpperCase()) + '.'
}

function generateParagraph(): string {
  const len = 4 + Math.floor(Math.random() * 6)
  const sentences = []
  for (let i = 0; i < len; i++) sentences.push(generateSentence())
  return sentences.join(' ')
}

export default function LoremIpsumPage() {
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [htmlWrap, setHtmlWrap] = useState(false)
  const [style, setStyle] = useState<'latin' | 'english' | 'hipster'>('latin')

  const ENGLISH_WORDS = 'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us'.split(' ')
  const HIPSTER_WORDS = 'artisan craft organic sustainable vegan kombucha aesthetic vinyl typewriter avocado toast quinoa kale matcha sourdough minimalist curated bespoke ethically foraged locally sourced farm table cold pressed small batch handcrafted plant based gluten free mindful conscious eco friendly fair trade zero waste upcycled vintage retro bohemian nomadic wanderlust hygge cozy chill vibes wellness holistic zen meditation yoga namaste'.split(' ')

  const getWordList = () => {
    if (style === 'english') return ENGLISH_WORDS
    if (style === 'hipster') return HIPSTER_WORDS
    return WORDS
  }

  const generate = () => {
    // Override word source based on style
    const wordList = getWordList()
    const genWord = () => wordList[Math.floor(Math.random() * wordList.length)]
    const genSentence = () => {
      const len = 5 + Math.floor(Math.random() * 15)
      const words = []
      for (let i = 0; i < len; i++) words.push(genWord())
      return words.join(' ').replace(/^./, c => c.toUpperCase()) + '.'
    }
    const genParagraph = () => {
      const len = 4 + Math.floor(Math.random() * 6)
      const sents = []
      for (let i = 0; i < len; i++) sents.push(genSentence())
      return sents.join(' ')
    }

    let result: string[] = []
    if (unit === 'words') {
      const words = []
      for (let i = 0; i < count; i++) words.push(genWord())
      result = [words.join(' ')]
    } else if (unit === 'sentences') {
      for (let i = 0; i < count; i++) result.push(genSentence())
      result = [result.join(' ')]
    } else {
      for (let i = 0; i < count; i++) result.push(genParagraph())
    }
    let text = result.join('\n\n')
    if (startWithLorem && style === 'latin') {
      text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + text
    }
    if (htmlWrap && unit === 'paragraphs') {
      text = result.map(p => `<p>${startWithLorem && style === 'latin' && result.indexOf(p) === 0 ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + p : p}</p>`).join('\n\n')
    }
    setOutput(text)
  }

  const outputWordCount = output.trim() ? output.trim().split(/\s+/).length : 0

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Type size={28} /> Lorem Ipsum Generator
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Generate placeholder text for your designs.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-14 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex flex-col items-center justify-center gap-0.5 p-2">
                <div className="w-14 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-12 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-14 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-10 h-[2px] bg-[#E8970A]/40 rounded"></div>
              </div>
              <span className="text-[10px] text-gray-500">Lorem ipsum...</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Set amount</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Generate</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy text</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Generate paragraphs, sentences, or words.
          </p>
        </div>

        <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as any)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Count</label>
            <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="w-full px-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm">
              <option value="latin">Latin (Classic)</option>
              <option value="english">English Placeholder</option>
              <option value="hipster">Hipster Ipsum</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="accent-[#E8970A]" />
              Start with "Lorem ipsum..."
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={htmlWrap} onChange={(e) => setHtmlWrap(e.target.checked)} className="accent-[#E8970A]" />
              Wrap in &lt;p&gt; tags
            </label>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={generate} className="px-5 py-2 rounded-lg bg-[#E8970A] text-black font-medium text-sm">
            <RefreshCw size={14} className="inline mr-1" />Generate
          </button>
          {output && (
            <button onClick={copy} className="px-5 py-2 rounded-lg bg-[#E8970A]/15 text-[#E8970A] border border-[#E8970A]/30 text-sm">
              {copied ? <><Check size={14} className="inline mr-1" />Copied</> : <><Copy size={14} className="inline mr-1" />Copy</>}
            </button>
          )}
        </div>

        {output && (
          <>
            <div className="text-xs text-gray-500 mb-2">{outputWordCount} words | {output.length} characters</div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-5 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{output}</div>
          </>
        )}
      </main>
      
    </div>
  )
}
