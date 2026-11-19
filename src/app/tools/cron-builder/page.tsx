'use client'

import { useState, useMemo, useCallback } from 'react'


import { Copy, Check, Clock, AlertCircle, Calendar } from 'lucide-react'

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PRESETS = [
  { name: 'Every minute', cron: '* * * * *' },
  { name: 'Every 5 minutes', cron: '*/5 * * * *' },
  { name: 'Every 15 minutes', cron: '*/15 * * * *' },
  { name: 'Every 30 minutes', cron: '*/30 * * * *' },
  { name: 'Every hour', cron: '0 * * * *' },
  { name: 'Every 6 hours', cron: '0 */6 * * *' },
  { name: 'Daily at midnight', cron: '0 0 * * *' },
  { name: 'Daily at noon', cron: '0 12 * * *' },
  { name: 'Weekly (Sunday)', cron: '0 0 * * 0' },
  { name: 'Weekly (Monday)', cron: '0 0 * * 1' },
  { name: 'Monthly (1st)', cron: '0 0 1 * *' },
  { name: 'Yearly (Jan 1)', cron: '0 0 1 1 *' },
]

interface FieldConfig {
  label: string
  min: number
  max: number
  options: { value: string; label: string }[]
}

const FIELDS: FieldConfig[] = [
  {
    label: 'Minute',
    min: 0,
    max: 59,
    options: [
      { value: '*', label: 'Every minute' },
      { value: '*/5', label: 'Every 5 minutes' },
      { value: '*/10', label: 'Every 10 minutes' },
      { value: '*/15', label: 'Every 15 minutes' },
      { value: '*/30', label: 'Every 30 minutes' },
      { value: '0', label: 'At minute 0' },
    ],
  },
  {
    label: 'Hour',
    min: 0,
    max: 23,
    options: [
      { value: '*', label: 'Every hour' },
      { value: '*/2', label: 'Every 2 hours' },
      { value: '*/6', label: 'Every 6 hours' },
      { value: '*/12', label: 'Every 12 hours' },
      { value: '0', label: 'At midnight (0)' },
      { value: '12', label: 'At noon (12)' },
    ],
  },
  {
    label: 'Day of Month',
    min: 1,
    max: 31,
    options: [
      { value: '*', label: 'Every day' },
      { value: '1', label: '1st' },
      { value: '15', label: '15th' },
      { value: '1,15', label: '1st and 15th' },
    ],
  },
  {
    label: 'Month',
    min: 1,
    max: 12,
    options: [
      { value: '*', label: 'Every month' },
      ...Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: MONTHS[i + 1],
      })),
    ],
  },
  {
    label: 'Day of Week',
    min: 0,
    max: 6,
    options: [
      { value: '*', label: 'Every day' },
      { value: '1-5', label: 'Weekdays (Mon-Fri)' },
      { value: '0,6', label: 'Weekends (Sat-Sun)' },
      ...DAYS_OF_WEEK.map((d, i) => ({ value: String(i), label: d })),
    ],
  },
]

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid cron expression (requires 5 fields)'

  const [minute, hour, dom, month, dow] = parts
  const segments: string[] = []

  // Minute
  if (minute === '*') {
    segments.push('every minute')
  } else if (minute.startsWith('*/')) {
    segments.push(`every ${minute.slice(2)} minutes`)
  } else {
    segments.push(`at minute ${minute}`)
  }

  // Hour
  if (hour === '*') {
    segments.push('of every hour')
  } else if (hour.startsWith('*/')) {
    segments.push(`every ${hour.slice(2)} hours`)
  } else {
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    segments.push(`at ${h12}:${minute === '*' ? '00' : minute.padStart(2, '0')} ${ampm}`)
  }

  // Day of month
  if (dom !== '*') {
    if (dom.includes(',')) {
      segments.push(`on days ${dom} of the month`)
    } else if (dom.includes('-')) {
      segments.push(`on days ${dom} of the month`)
    } else {
      segments.push(`on day ${dom} of the month`)
    }
  }

  // Month
  if (month !== '*') {
    if (month.includes(',')) {
      const names = month.split(',').map(m => MONTHS[parseInt(m)] || m).join(', ')
      segments.push(`in ${names}`)
    } else {
      segments.push(`in ${MONTHS[parseInt(month)] || month}`)
    }
  }

  // Day of week
  if (dow !== '*') {
    if (dow === '1-5') {
      segments.push('on weekdays')
    } else if (dow === '0,6') {
      segments.push('on weekends')
    } else if (dow.includes(',')) {
      const names = dow.split(',').map(d => DAYS_OF_WEEK[parseInt(d)] || d).join(', ')
      segments.push(`on ${names}`)
    } else {
      segments.push(`on ${DAYS_OF_WEEK[parseInt(dow)] || dow}`)
    }
  }

  return segments.join(' ').replace(/^every minute of every hour/, 'every minute').replace(/^at minute 0 of every hour/, 'at the start of every hour')
}

function getNextExecutions(cron: string, count: number = 5): Date[] {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const results: Date[] = []
  const now = new Date()
  const check = new Date(now.getTime() + 60000) // start from next minute
  check.setSeconds(0, 0)

  const matchesField = (value: number, field: string): boolean => {
    if (field === '*') return true
    if (field.startsWith('*/')) {
      const step = parseInt(field.slice(2))
      return value % step === 0
    }
    if (field.includes(',')) {
      return field.split(',').map(Number).includes(value)
    }
    if (field.includes('-')) {
      const [min, max] = field.split('-').map(Number)
      return value >= min && value <= max
    }
    return value === parseInt(field)
  }

  let iterations = 0
  while (results.length < count && iterations < 525600) {
    iterations++
    const min = check.getMinutes()
    const hr = check.getHours()
    const d = check.getDate()
    const mo = check.getMonth() + 1
    const dw = check.getDay()

    if (
      matchesField(min, parts[0]) &&
      matchesField(hr, parts[1]) &&
      matchesField(d, parts[2]) &&
      matchesField(mo, parts[3]) &&
      matchesField(dw, parts[4])
    ) {
      results.push(new Date(check))
    }
    check.setMinutes(check.getMinutes() + 1)
  }

  return results
}

function validateCron(cron: string): string | null {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return `Expected 5 fields, got ${parts.length}`
  const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]]
  const names = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week']
  for (let i = 0; i < 5; i++) {
    const p = parts[i]
    if (p === '*') continue
    if (/^\*\/\d+$/.test(p)) {
      const step = parseInt(p.slice(2))
      if (step < 1) return `${names[i]}: step must be >= 1`
      continue
    }
    const tokens = p.split(',')
    for (const t of tokens) {
      if (t.includes('-')) {
        const [a, b] = t.split('-').map(Number)
        if (isNaN(a) || isNaN(b)) return `${names[i]}: invalid range "${t}"`
        if (a < ranges[i][0] || b > ranges[i][1]) return `${names[i]}: values must be ${ranges[i][0]}-${ranges[i][1]}`
      } else {
        const v = parseInt(t)
        if (isNaN(v)) return `${names[i]}: invalid value "${t}"`
        if (v < ranges[i][0] || v > ranges[i][1]) return `${names[i]}: ${v} not in range ${ranges[i][0]}-${ranges[i][1]}`
      }
    }
  }
  return null
}

export default function CronBuilderPage() {
  const [fields, setFields] = useState(['*', '*', '*', '*', '*'])
  const [manualInput, setManualInput] = useState('')
  const [useManual, setUseManual] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const cronExpression = useManual ? manualInput : fields.join(' ')

  const error = useMemo(() => {
    if (!cronExpression.trim()) return null
    return validateCron(cronExpression)
  }, [cronExpression])

  const description = useMemo(() => {
    if (error || !cronExpression.trim()) return ''
    return describeCron(cronExpression)
  }, [cronExpression, error])

  const nextExecutions = useMemo(() => {
    if (error || !cronExpression.trim()) return []
    return getNextExecutions(cronExpression, 5)
  }, [cronExpression, error])

  const updateField = (idx: number, value: string) => {
    const newFields = [...fields]
    newFields[idx] = value
    setFields(newFields)
  }

  const applyPreset = (cron: string) => {
    const parts = cron.split(' ')
    setFields(parts)
    setManualInput(cron)
  }

  const copyCron = async () => {
    await navigator.clipboard.writeText(cronExpression)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const syncManualToBuilder = () => {
    const parts = manualInput.trim().split(/\s+/)
    if (parts.length === 5) {
      setFields(parts)
      setUseManual(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8970A]/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#E8970A]" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cron Expression Builder
            </h1>
          </div>
          <p className="text-gray-400">Build and understand cron expressions visually</p>
        </div>

        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="px-4 py-2 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 text-[#E8970A] text-sm font-mono font-bold">0 9 * * MON</div>
            <span className="text-[#E8970A] text-2xl">&rarr;</span>
            <div className="px-4 py-2 rounded-lg border-2 border-green-500/60 bg-green-500/10 text-green-400 text-sm font-bold">Every Monday at 9 AM</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Select schedule</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>See cron expression</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Copy</span>
          </div>
          <p className="text-center text-xs text-gray-500">&#128161; <strong>Tip:</strong> Shows next 5 execution times.</p>
        </div>

        {/* Generated expression */}
        <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">Cron Expression</label>
            <div className="flex gap-2">
              <button
                onClick={() => setUseManual(!useManual)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  useManual
                    ? 'bg-[#E8970A]/20 text-[#E8970A]'
                    : 'bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white'
                }`}
              >
                {useManual ? 'Manual Mode' : 'Switch to Manual'}
              </button>
              <button
                onClick={copyCron}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#E8970A]/10 text-[#E8970A] hover:bg-[#E8970A]/20 transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {useManual ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="* * * * *"
                className="flex-1 bg-[#070510] border border-[#1A1726] rounded-lg px-4 py-3 text-white font-mono text-xl text-center focus:outline-none focus:border-[#E8970A]"
              />
              <button
                onClick={syncManualToBuilder}
                className="px-4 py-2 rounded-lg text-sm bg-[#0F0D1A] text-gray-300 border border-[#1A1726] hover:border-[#E8970A] transition-colors"
              >
                Use in Builder
              </button>
            </div>
          ) : (
            <div className="bg-[#070510] border border-[#1A1726] rounded-lg px-4 py-3 text-center">
              <span className="text-white font-mono text-2xl tracking-widest">{cronExpression}</span>
            </div>
          )}

          {/* Labels */}
          {!useManual && (
            <div className="grid grid-cols-5 gap-2 mt-2">
              {['Minute', 'Hour', 'Day (Month)', 'Month', 'Day (Week)'].map((label) => (
                <span key={label} className="text-[10px] text-gray-500 text-center">{label}</span>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {!error && description && (
            <div className="mt-3 text-center">
              <span className="text-sm text-[#E8970A]">Runs: </span>
              <span className="text-sm text-gray-300 capitalize">{description}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder fields */}
          <div className="lg:col-span-2 space-y-3">
            {FIELDS.map((field, idx) => (
              <div key={field.label} className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">{field.label}</label>
                  <span className="text-xs text-gray-500 font-mono">{fields[idx]}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateField(idx, opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        fields[idx] === opt.value
                          ? 'bg-[#E8970A]/20 text-[#E8970A] border border-[#E8970A]/40'
                          : 'bg-[#070510] text-gray-400 border border-[#1A1726] hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={fields[idx]}
                    onChange={(e) => updateField(idx, e.target.value)}
                    className="w-20 bg-[#070510] border border-[#1A1726] rounded-lg px-2 py-1.5 text-white font-mono text-xs text-center focus:outline-none focus:border-[#E8970A]"
                    placeholder="custom"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: presets + next executions */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Common Presets</h3>
              <div className="space-y-1">
                {PRESETS.map(preset => (
                  <button
                    key={preset.cron}
                    onClick={() => applyPreset(preset.cron)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      cronExpression === preset.cron
                        ? 'bg-[#E8970A]/20 text-[#E8970A]'
                        : 'text-gray-400 hover:bg-[#070510] hover:text-white'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="font-mono text-gray-500">{preset.cron}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Timezone</h3>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-[#070510] border border-[#1A1726] text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8970A]"
              >
                {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Phoenix',
                  'America/Toronto', 'America/Vancouver', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
                  'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Dubai',
                  'Australia/Sydney', 'Pacific/Auckland', 'UTC',
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
                ].filter((v, i, a) => a.indexOf(v) === i).sort().map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            {!error && nextExecutions.length > 0 && (
              <div className="rounded-xl border border-[#1A1726] bg-[#0F0D1A] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-[#E8970A]" />
                  <h3 className="text-sm font-medium text-gray-300">Next 5 Executions</h3>
                </div>
                <div className="space-y-2">
                  {nextExecutions.map((date, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-4">{i + 1}.</span>
                      <span className="text-white font-mono">
                        {date.toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  )
}
