'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Volume2, VolumeX, ExternalLink, Radio, Waves, Satellite,
  Star, Atom, CircleDot, Wind, Zap, Orbit, CloudLightning, Globe2, Play, Pause, Info
} from 'lucide-react'
import AdBanner from '@/components/time/AdBanner';

// ─── Types ─────────────────────────────────────────────────
interface SpaceSound {
  id: string
  title: string
  description: string
  howCaptured: string
  icon: React.ElementType
  color: string
  waveformType: 'sine' | 'square' | 'sawtooth' | 'pulse' | 'noise' | 'triangle'
  frequency: number
  nasaUrl: string
}

// ─── Sound Data ────────────────────────────────────────────
const SPACE_SOUNDS: SpaceSound[] = [
  {
    id: 'jupiter-radio',
    title: "Jupiter's Radio Emissions",
    description: 'Eerie whistling sounds from Jupiter\'s magnetosphere, created by charged particles interacting with its immense magnetic field.',
    howCaptured: 'Recorded by the Juno spacecraft\'s Waves instrument as it flew through Jupiter\'s magnetosphere.',
    icon: Radio,
    color: '#F59E0B',
    waveformType: 'sine',
    frequency: 2.5,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'saturn-radio',
    title: "Saturn's Radio Waves",
    description: 'Cassini recordings of Saturn\'s kilometric radiation — radio waves that pulse with the planet\'s rotation, creating an alien heartbeat.',
    howCaptured: 'The Cassini spacecraft\'s Radio and Plasma Wave Science instrument detected these signals during its 13-year Saturn mission.',
    icon: Waves,
    color: '#A78BFA',
    waveformType: 'pulse',
    frequency: 1.8,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'earth-chorus',
    title: "Earth's Chorus",
    description: 'The dawn chorus of plasma waves in Earth\'s magnetosphere — rising tones that sound eerily like birds singing at sunrise.',
    howCaptured: 'Captured by NASA\'s EMFISIS instrument aboard the Van Allen Probes, which study Earth\'s radiation belts.',
    icon: Globe2,
    color: '#34D399',
    waveformType: 'sawtooth',
    frequency: 3.2,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'solar-wind',
    title: 'Solar Wind',
    description: 'The constant stream of charged particles flowing from the Sun at 1 million mph, sonified into an ethereal whoosh.',
    howCaptured: 'Data from NASA\'s ACE (Advanced Composition Explorer) satellite, converted from particle measurements to sound waves.',
    icon: Wind,
    color: '#FBBF24',
    waveformType: 'noise',
    frequency: 0.5,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'voyager-golden',
    title: 'Voyager Golden Record',
    description: 'Greetings in 55 languages, music from Bach to Chuck Berry, and sounds of Earth — humanity\'s message to the cosmos.',
    howCaptured: 'Curated by a committee chaired by Carl Sagan and launched aboard Voyager 1 and 2 in 1977. Now in interstellar space.',
    icon: Satellite,
    color: '#F472B6',
    waveformType: 'triangle',
    frequency: 2.0,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'pulsar-signals',
    title: 'Pulsar Signals',
    description: 'Rhythmic radio pulses from spinning neutron stars — cosmic lighthouses rotating up to 716 times per second.',
    howCaptured: 'Detected by radio telescopes worldwide. First discovered in 1967 by Jocelyn Bell Burnell, initially nicknamed "LGM-1" (Little Green Men).',
    icon: Zap,
    color: '#60A5FA',
    waveformType: 'square',
    frequency: 4.0,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'black-hole',
    title: 'Black Hole Sound',
    description: 'Pressure waves from the Perseus galaxy cluster — the deepest note in the universe, 57 octaves below middle C.',
    howCaptured: 'NASA\'s Chandra X-ray Observatory detected ripples in the hot gas of the Perseus cluster, then raised 57-58 octaves to be audible.',
    icon: CircleDot,
    color: '#818CF8',
    waveformType: 'sine',
    frequency: 0.8,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'mars-wind',
    title: 'Mars Wind',
    description: 'The first sounds ever recorded on Mars — a low rumble of Martian wind across the InSight lander\'s solar panels.',
    howCaptured: 'NASA\'s InSight lander captured wind vibrations through its seismometer (SEIS) and air pressure sensor in December 2018.',
    icon: Wind,
    color: '#F87171',
    waveformType: 'noise',
    frequency: 1.2,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'comet-song',
    title: 'Comet Song',
    description: 'Rosetta spacecraft detected a mysterious "singing" from Comet 67P — oscillations in its magnetic field at 40-50 millihertz.',
    howCaptured: 'ESA\'s Rosetta probe\'s magnetometer detected magnetic field oscillations around Comet 67P/Churyumov-Gerasimenko, raised 10,000x to be audible.',
    icon: Star,
    color: '#2DD4BF',
    waveformType: 'sawtooth',
    frequency: 1.5,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'plasma-waves',
    title: 'Plasma Waves',
    description: 'Voyager 2\'s plasma wave recordings as it crossed into interstellar space — the sound of our heliosphere\'s boundary.',
    howCaptured: 'Voyager 2\'s Plasma Wave System (PWS) recorded electron plasma oscillations as it crossed the heliopause in November 2018.',
    icon: Atom,
    color: '#C084FC',
    waveformType: 'sine',
    frequency: 3.5,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'jupiter-lightning',
    title: 'Lightning on Jupiter',
    description: 'Juno spacecraft detected Jovian lightning — powerful electrical discharges in Jupiter\'s ammonia-water clouds.',
    howCaptured: 'Juno\'s Microwave Radiometer (MWR) and Waves instrument detected lightning discharges during close Jupiter flybys starting in 2016.',
    icon: CloudLightning,
    color: '#FCD34D',
    waveformType: 'square',
    frequency: 5.0,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
  {
    id: 'titan-atmosphere',
    title: "Titan's Atmosphere",
    description: 'Huygens probe\'s descent through Titan\'s thick nitrogen atmosphere — the only landing on a moon in the outer solar system.',
    howCaptured: 'ESA\'s Huygens probe recorded acoustic data during its 2.5-hour descent through Titan\'s atmosphere on January 14, 2005.',
    icon: Orbit,
    color: '#FB923C',
    waveformType: 'triangle',
    frequency: 1.0,
    nasaUrl: 'https://www.nasa.gov/audio-and-ringtones/',
  },
]

// ─── Waveform SVG Component ───────────────────────────────
function WaveformVisual({
  type,
  color,
  isPlaying,
  frequency,
}: {
  type: string
  color: string
  isPlaying: boolean
  frequency: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      if (isPlaying) {
        phaseRef.current += 0.03 * frequency
      }

      const bars = 48
      const barW = W / bars - 1
      const phase = phaseRef.current

      for (let i = 0; i < bars; i++) {
        const x = i * (barW + 1)
        let h: number

        switch (type) {
          case 'sine':
            h = Math.abs(Math.sin((i / bars) * Math.PI * 2 * frequency + phase)) * (H * 0.8)
            break
          case 'square':
            h = Math.sin((i / bars) * Math.PI * 2 * frequency + phase) > 0 ? H * 0.7 : H * 0.2
            break
          case 'sawtooth':
            h = (((i / bars * frequency + phase / Math.PI) % 1) * H * 0.8) + H * 0.1
            break
          case 'pulse':
            h = Math.abs(Math.sin((i / bars) * Math.PI * 4 * frequency + phase)) > 0.7 ? H * 0.8 : H * 0.15
            break
          case 'noise':
            h = isPlaying
              ? (Math.random() * 0.6 + 0.2) * H
              : (Math.sin(i * 0.5) * 0.2 + 0.3) * H
            break
          case 'triangle':
            h = Math.abs(((i / bars * frequency + phase / Math.PI) % 1) * 2 - 1) * H * 0.8
            break
          default:
            h = Math.abs(Math.sin((i / bars) * Math.PI * 2 + phase)) * H * 0.8
        }

        const alpha = isPlaying ? 0.9 : 0.4
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        const y = (H - h) / 2
        ctx.fillRect(x, y, barW, h)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [type, color, isPlaying, frequency])

  return (
    <canvas
      ref={canvasRef}
      width={384}
      height={80}
      className="w-full h-20 rounded-lg"
    />
  )
}

// ─── Sound Card ────────────────────────────────────────────
function SoundCard({
  sound,
  isActive,
  onToggle,
}: {
  sound: SpaceSound
  isActive: boolean
  onToggle: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = sound.icon

  return (
    <div
      className={`rounded-2xl border transition-all duration-500 ${
        isActive
          ? 'bg-card-bg border-primary/40 shadow-lg shadow-primary/10'
          : 'bg-card-bg border-card-border hover:border-card-border/80'
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={onToggle}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-primary shadow-lg shadow-primary/30 scale-105'
                : 'bg-card-border hover:bg-primary/20'
            }`}
            style={isActive ? {} : { backgroundColor: sound.color + '20' }}
          >
            {isActive ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" style={{ color: sound.color }} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: sound.color }} />
              <h3 className="font-heading font-semibold text-lg truncate">{sound.title}</h3>
            </div>
            <p className="text-muted text-sm line-clamp-2">{sound.description}</p>
          </div>
        </div>

        {/* Waveform */}
        <div className="mb-3">
          <WaveformVisual
            type={sound.waveformType}
            color={sound.color}
            isPlaying={isActive}
            frequency={sound.frequency}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted hover:text-[#E2E8F0] text-sm flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            {expanded ? 'Less info' : 'How was this captured?'}
          </button>

          <a
            href={sound.nasaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-secondary-hover text-sm flex items-center gap-1 transition-colors"
          >
            Listen on NASA.gov
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Expanded Info */}
        {expanded && (
          <div className="mt-3 p-3 rounded-lg bg-dark-bg border border-card-border text-sm text-muted animate-fadeIn">
            {sound.howCaptured}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}

// ─── Audio Engine ─────────────────────────────────────────
function useSpaceAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const noiseRef = useRef<AudioBufferSourceNode | null>(null)

  const play = useCallback((sound: SpaceSound) => {
    stop()
    const ctx = new AudioContext()
    ctxRef.current = ctx
    const gain = ctx.createGain()
    gainRef.current = gain
    gain.gain.value = 0.3
    gain.connect(ctx.destination)

    if (sound.waveformType === 'noise') {
      // White noise with filter for space static
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 800 + sound.frequency * 200
      filter.Q.value = 2
      noise.connect(filter)
      filter.connect(gain)
      noise.start()
      noiseRef.current = noise
    } else {
      // Oscillator-based sounds
      const osc = ctx.createOscillator()
      oscRef.current = osc

      // Map waveform types
      if (sound.waveformType === 'pulse') {
        osc.type = 'square'
      } else if (sound.waveformType === 'sine' || sound.waveformType === 'square' || sound.waveformType === 'sawtooth' || sound.waveformType === 'triangle') {
        osc.type = sound.waveformType
      } else {
        osc.type = 'sine'
      }

      // Base frequency — low eerie tones
      const baseFreq = 60 + sound.frequency * 40
      osc.frequency.value = baseFreq

      // LFO for wobble effect (makes it sound spacey)
      const lfo = ctx.createOscillator()
      lfoRef.current = lfo
      lfo.type = 'sine'
      lfo.frequency.value = sound.frequency * 0.5
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = baseFreq * 0.3
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      osc.connect(gain)
      osc.start()
    }
  }, [])

  const stop = useCallback(() => {
    try { oscRef.current?.stop() } catch {}
    try { lfoRef.current?.stop() } catch {}
    try { noiseRef.current?.stop() } catch {}
    try { ctxRef.current?.close() } catch {}
    oscRef.current = null
    lfoRef.current = null
    noiseRef.current = null
    ctxRef.current = null
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => { stop() }
  }, [stop])

  return { play, stop }
}

// ─── Main Page ─────────────────────────────────────────────
export default function SpaceSoundsPage() {
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const audio = useSpaceAudio()

  const toggleSound = useCallback((id: string) => {
    setActiveSound(prev => {
      if (prev === id) {
        audio.stop()
        return null
      } else {
        const sound = SPACE_SOUNDS.find(s => s.id === id)
        if (sound) audio.play(sound)
        return id
      }
    })
  }, [audio])

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-10 sm:pt-12 pb-8 text-center">
          {/* Animated Waveform Hero */}
          <div className="flex items-center justify-center gap-1 mb-8 h-16">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-primary to-secondary"
                style={{
                  height: `${20 + Math.sin(i * 0.4) * 30}%`,
                  animation: `waveBar 1.5s ease-in-out ${i * 0.05}s infinite alternate`,
                }}
              />
            ))}
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Sounds of Space
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Space is silent, but not soundless. Explore radio waves, plasma oscillations, and magnetic vibrations captured by NASA spacecraft — converted into sounds we can hear.
          </p>
        </div>

        <style jsx>{`
          @keyframes waveBar {
            from { height: 20%; }
            to { height: 80%; }
          }
        `}</style>
      </section>

      <AdBanner />

      {/* Sound Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPACE_SOUNDS.map(sound => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={activeSound === sound.id}
              onToggle={() => toggleSound(sound.id)}
            />
          ))}
        </div>
      </section>

      {/* Why Space is Silent */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="p-8 rounded-2xl bg-card-bg border border-card-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <VolumeX className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Why Space is Silent</h2>
          </div>

          <div className="space-y-6 text-muted">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">Sound Needs a Medium</h3>
                <p className="text-sm leading-relaxed">
                  Sound waves require molecules to travel through — air, water, or solid material. In the vacuum of space, there are virtually no molecules, so traditional sound cannot propagate. If you screamed in space (without a helmet, which we do not recommend), no one would hear you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Radio className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">How We &ldquo;Hear&rdquo; Space</h3>
                <p className="text-sm leading-relaxed">
                  Spacecraft carry instruments that detect electromagnetic radiation (radio waves, X-rays) and plasma waves. Scientists then shift these signals into the audible range (20 Hz to 20 kHz) through a process called sonification. The frequencies and patterns are preserved — only the pitch is changed so human ears can perceive them.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Waves className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">The One Exception</h3>
                <p className="text-sm leading-relaxed">
                  Inside galaxy clusters, hot gas fills the space between galaxies. Pressure waves can travel through this gas — like the famous &ldquo;sound&rdquo; from the Perseus cluster black hole, vibrating at a frequency 57 octaves below middle C. It is real sound, just impossibly deep for human ears without amplification.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-dark-bg border border-card-border">
            <p className="text-sm text-muted text-center">
              All sounds featured here are based on real data from NASA and ESA missions.
              Visit{' '}
              <a
                href="https://www.nasa.gov/audio-and-ringtones/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                NASA Audio & Ringtones
              </a>
              {' '}to explore the original recordings.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
