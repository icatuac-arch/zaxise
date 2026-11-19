'use client'

import { useState, useEffect, useRef, useCallback } from 'react'


import { StickyNote, Plus, Trash2, Download, Pencil, Check, Search, Upload } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

const STORAGE_KEY = 'freetools-notes'

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveNotes(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {}
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const importRef = useRef<HTMLInputElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadNotes()
    if (loaded.length > 0) {
      setNotes(loaded)
      setActiveId(loaded[0].id)
    }
    setLoaded(true)
  }, [])

  // Auto-save every 3 seconds
  useEffect(() => {
    if (!loaded) return
    saveTimerRef.current = setInterval(() => {
      saveNotes(notes)
      setLastSaved(new Date().toLocaleTimeString())
    }, 3000)
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    }
  }, [notes, loaded])

  const activeNote = notes.find(n => n.id === activeId) || null

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now(),
    }
    const updated = [newNote, ...notes]
    setNotes(updated)
    setActiveId(newNote.id)
    saveNotes(updated)
  }

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, ...changes, updatedAt: Date.now() } : n)
      return updated
    })
  }, [])

  const deleteNote = (id: string) => {
    if (!confirm('Delete this note?')) return
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null)
    }
  }

  const downloadNote = () => {
    if (!activeNote) return
    const blob = new Blob([activeNote.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title || 'note'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const charCount = activeNote?.content.length || 0
  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0

  const filteredNotes = searchQuery.trim()
    ? notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : notes

  const exportAllNotes = () => {
    const json = JSON.stringify(notes, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notes-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string)
        if (Array.isArray(imported)) {
          const merged = [...notes, ...imported.filter((n: Note) => !notes.find(e => e.id === n.id))]
          setNotes(merged)
          saveNotes(merged)
        }
      } catch { /* ignore */ }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <StickyNote size={28} /> Scratchpad / Notes
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Quick notes that auto-save to your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-16 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex flex-col items-start justify-center gap-1 p-2">
                <div className="w-14 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-12 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-14 h-[2px] bg-[#E8970A]/40 rounded"></div>
                <div className="w-8 h-[2px] bg-[#E8970A]/40 rounded"></div>
              </div>
              <span className="text-[10px] text-gray-500">Notepad</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Type notes</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Auto-saves locally</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Download anytime</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Multiple notes with titles, saved to your browser.
          </p>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <button onClick={addNote} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8970A] text-black font-medium hover:bg-[#E8970A]/90 mb-3">
              <Plus size={16} /> New Note
            </button>
            {/* Search */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070510] border border-[#1A1726] text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#E8970A]/50"
              />
            </div>
            {/* Export/Import */}
            <div className="flex gap-2 mb-3">
              <button onClick={exportAllNotes} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-400 border border-[#1A1726] hover:bg-white/5">
                <Download size={12} /> Export
              </button>
              <input ref={importRef} type="file" accept=".json" className="hidden" onChange={importNotes} />
              <button onClick={() => importRef.current?.click()} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-400 border border-[#1A1726] hover:bg-white/5">
                <Upload size={12} /> Import
              </button>
            </div>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {filteredNotes.map(n => (
                <div
                  key={n.id}
                  onClick={() => { setActiveId(n.id); setEditingTitle(false) }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm group ${
                    activeId === n.id ? 'bg-[#E8970A]/10 border border-[#E8970A]/30 text-[#E8970A]' : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <span className="truncate flex-1">{n.title || 'Untitled'}</span>
                  <button onClick={e => { e.stopPropagation(); deleteNote(n.id) }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 min-w-0">
            {activeNote ? (
              <>
                {/* Title */}
                <div className="flex items-center gap-2 mb-3">
                  {editingTitle ? (
                    <input
                      autoFocus
                      value={activeNote.title}
                      onChange={e => updateNote(activeNote.id, { title: e.target.value })}
                      onBlur={() => setEditingTitle(false)}
                      onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false) }}
                      className="flex-1 bg-[#0F0D1A] border border-[#1A1726] rounded-lg px-3 py-1.5 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
                    />
                  ) : (
                    <h2
                      onClick={() => setEditingTitle(true)}
                      className="flex-1 text-lg font-semibold text-white cursor-pointer hover:text-[#E8970A] flex items-center gap-2"
                    >
                      {activeNote.title || 'Untitled'}
                      <Pencil size={14} className="text-gray-500" />
                    </h2>
                  )}
                  <button onClick={downloadNote} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
                    <Download size={14} /> .txt
                  </button>
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={e => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Start writing..."
                  className="w-full h-[50vh] bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50 resize-none"
                />

                {/* Footer stats */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex gap-4">
                    <span>{charCount} chars</span>
                    <span>{wordCount} words</span>
                  </div>
                  {lastSaved && <span>Auto-saved at {lastSaved}</span>}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Create a new note to get started
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
