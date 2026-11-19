'use client'

import { useState, useEffect, useRef } from 'react'


import { ListChecks, Plus, Trash2, Download, GripVertical, Printer, X } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high'

interface CheckItem {
  id: string
  text: string
  done: boolean
  priority: Priority
  dueDate: string
  category: string
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30',
}

const STORAGE_KEY = 'freetools-checklist'

function loadItems(): CheckItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveItems(items: CheckItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export default function ChecklistPage() {
  const [items, setItems] = useState<CheckItem[]>([])
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [newDueDate, setNewDueDate] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    setItems(loadItems())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveItems(items)
  }, [items, loaded])

  const addItem = () => {
    const text = newText.trim()
    if (!text) return
    setItems(prev => [...prev, { id: Date.now().toString(), text, done: false, priority: newPriority, dueDate: newDueDate, category: newCategory }])
    setNewText('')
    setNewDueDate('')
  }

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const startEdit = (item: CheckItem) => {
    setEditingId(item.id)
    setEditText(item.text)
  }

  const finishEdit = () => {
    if (editingId && editText.trim()) {
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, text: editText.trim() } : i))
    }
    setEditingId(null)
  }

  const clearCompleted = () => {
    setItems(prev => prev.filter(i => !i.done))
  }

  const clearAll = () => {
    if (!confirm('Clear all items?')) return
    setItems([])
  }

  const handleDragStart = (idx: number) => {
    setDragIdx(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setDragOverIdx(idx)
  }

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null)
      setDragOverIdx(null)
      return
    }
    const newItems = [...items]
    const [moved] = newItems.splice(dragIdx, 1)
    newItems.splice(idx, 0, moved)
    setItems(newItems)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const downloadList = () => {
    const text = items.map(i => `[${i.done ? 'x' : ' '}] ${i.text}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'checklist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printContent = items.map(i => `${i.done ? '\u2611' : '\u2610'} ${i.text}`).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<html><head><title>Checklist</title><style>body{font-family:sans-serif;padding:40px;font-size:16px;line-height:2}</style></head><body><h2>Checklist</h2><pre>${printContent}</pre></body></html>`)
    w.document.close()
    w.print()
  }

  const allCategories = Array.from(new Set(items.map(i => i.category).filter(Boolean)))
  const displayItems = filterCategory ? items.filter(i => i.category === filterCategory) : items
  const completedCount = displayItems.filter(i => i.done).length
  const totalCount = displayItems.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <ListChecks size={28} /> Checklist Maker
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Create and manage checklists saved to your browser.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-16 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex flex-col items-start justify-center gap-1.5 p-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm border border-green-400/60 bg-green-500/20 flex items-center justify-center text-green-400 text-[6px]">&#10003;</div>
                  <div className="w-10 h-[2px] bg-[#E8970A]/30 rounded"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm border border-[#E8970A]/40"></div>
                  <div className="w-8 h-[2px] bg-[#E8970A]/30 rounded"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm border border-[#E8970A]/40"></div>
                  <div className="w-12 h-[2px] bg-[#E8970A]/30 rounded"></div>
                </div>
              </div>
              <span className="text-[10px] text-gray-500">Checklist</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Add items</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Check off tasks</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Track progress</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Saves to browser, drag to reorder.
          </p>
        </div>

        {/* Add item */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <input
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addItem() }}
              placeholder="Add a new item..."
              className="flex-1 bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8970A]/50"
            />
            <button onClick={addItem} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8970A] text-black font-medium hover:bg-[#E8970A]/90">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <select value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)} className="bg-[#070510] border border-[#1A1726] rounded-lg px-2 py-1 text-white text-xs">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-[#070510] border border-[#1A1726] rounded-lg px-2 py-1 text-white text-xs" />
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category (optional)" className="bg-[#070510] border border-[#1A1726] rounded-lg px-2 py-1 text-white text-xs w-36" />
          </div>
        </div>

        {/* Category filter */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setFilterCategory('')} className={`px-2.5 py-1 rounded-lg text-xs ${!filterCategory ? 'bg-[#E8970A] text-black' : 'border border-[#1A1726] text-gray-400'}`}>All</button>
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-2.5 py-1 rounded-lg text-xs ${filterCategory === cat ? 'bg-[#E8970A] text-black' : 'border border-[#1A1726] text-gray-400'}`}>{cat}</button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{completedCount}/{totalCount} completed</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-[#1A1726] rounded-full overflow-hidden">
              <div className="h-full bg-[#E8970A] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="space-y-1 mb-6">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F0D1A] border transition-colors group ${
                dragOverIdx === idx ? 'border-[#E8970A]' : 'border-[#1A1726]'
              }`}
            >
              <GripVertical size={14} className="text-gray-600 cursor-grab shrink-0" />
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
                className="accent-[#E8970A] shrink-0"
              />
              {editingId === item.id ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onBlur={finishEdit}
                  onKeyDown={e => { if (e.key === 'Enter') finishEdit(); if (e.key === 'Escape') setEditingId(null) }}
                  className="flex-1 bg-transparent border-b border-[#E8970A] text-white focus:outline-none py-0.5"
                />
              ) : (
                <span
                  onClick={() => startEdit(item)}
                  className={`flex-1 cursor-pointer text-sm ${item.done ? 'line-through text-gray-500' : 'text-gray-200'}`}
                >
                  {item.text}
                </span>
              )}
              {/* Priority badge */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] border ${PRIORITY_COLORS[item.priority || 'medium']} shrink-0`}>
                {(item.priority || 'medium').charAt(0).toUpperCase()}
              </span>
              {/* Due date */}
              {item.dueDate && (
                <span className={`text-[10px] shrink-0 ${new Date(item.dueDate) < new Date() && !item.done ? 'text-red-400' : 'text-gray-500'}`}>
                  {new Date(item.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              )}
              {/* Category */}
              {item.category && (
                <span className="text-[10px] text-[#E8970A] bg-[#E8970A]/10 px-1.5 py-0.5 rounded shrink-0">{item.category}</span>
              )}
              <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 shrink-0">
                <X size={14} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No items yet. Add one above.</p>
          )}
        </div>

        {/* Actions */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] text-gray-400 hover:bg-white/5">
                <Trash2 size={14} /> Clear Completed
              </button>
            )}
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] text-gray-400 hover:bg-white/5">
              <Trash2 size={14} /> Clear All
            </button>
            <button onClick={downloadList} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] text-gray-400 hover:bg-white/5">
              <Download size={14} /> Download
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] text-gray-400 hover:bg-white/5">
              <Printer size={14} /> Print
            </button>
          </div>
        )}
      </main>
      
    </div>
  )
}
