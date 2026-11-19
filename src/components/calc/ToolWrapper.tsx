'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Home, ChevronRight } from 'lucide-react'

// ---------------------------------------------------------------------------
// Tool registry: every tool grouped by category
// ---------------------------------------------------------------------------

interface ToolEntry {
  slug: string
  name: string
  label: string
}

const toolCategories: Record<string, ToolEntry[]> = {
  'Unit Converters': [
    { slug: 'length', name: 'Length Converter', label: 'Convert between units of length' },
    { slug: 'weight', name: 'Weight Converter', label: 'Convert between units of weight' },
    { slug: 'volume', name: 'Volume Converter', label: 'Convert between units of volume' },
    { slug: 'temperature', name: 'Temperature Converter', label: 'Convert between temperature scales' },
    { slug: 'speed', name: 'Speed Converter', label: 'Convert between units of speed' },
    { slug: 'area', name: 'Area Converter', label: 'Convert between units of area' },
  ],
  Finance: [
    { slug: 'loan', name: 'Loan Calculator', label: 'Calculate monthly loan payments' },
    { slug: 'home-loan', name: 'Home Loan Calculator', label: 'Calculate mortgage payments' },
    { slug: 'compound-interest', name: 'Compound Interest', label: 'Calculate compound interest growth' },
    { slug: 'tip', name: 'Tip Calculator', label: 'Calculate tip amounts easily' },
    { slug: 'salary', name: 'Salary Calculator', label: 'Convert between pay periods' },
    { slug: 'discount', name: 'Discount Calculator', label: 'Calculate sale prices & savings' },
    { slug: 'roi', name: 'ROI Calculator', label: 'Calculate return on investment' },
  ],
  Health: [
    { slug: 'bmi', name: 'BMI Calculator', label: 'Calculate body mass index' },
    { slug: 'calorie', name: 'Calorie Calculator', label: 'Estimate daily calorie needs' },
    { slug: 'body-fat', name: 'Body Fat Calculator', label: 'Estimate body fat percentage' },
    { slug: 'heart-rate', name: 'Heart Rate Zones', label: 'Find target heart rate zones' },
    { slug: 'water-intake', name: 'Water Intake', label: 'Calculate daily water needs' },
  ],
  Math: [
    { slug: 'percentage', name: 'Percentage Calculator', label: 'Calculate percentages quickly' },
    { slug: 'fraction', name: 'Fraction Calculator', label: 'Add, subtract & convert fractions' },
    { slug: 'scientific', name: 'Scientific Calculator', label: 'Advanced math operations' },
    { slug: 'prime', name: 'Prime Checker', label: 'Check if a number is prime' },
    { slug: 'gcd-lcm', name: 'GCD & LCM', label: 'Find greatest common divisor & LCM' },
  ],
  Science: [
    { slug: 'pressure', name: 'Pressure Converter', label: 'Convert between pressure units' },
    { slug: 'energy', name: 'Energy Converter', label: 'Convert between energy units' },
    { slug: 'force', name: 'Force Converter', label: 'Convert between force units' },
    { slug: 'data-storage', name: 'Data Storage', label: 'Convert bytes, KB, MB, GB & more' },
    { slug: 'number-base', name: 'Number Base', label: 'Convert between number bases' },
    { slug: 'color', name: 'Color Converter', label: 'Convert HEX, RGB, HSL colors' },
  ],
  Everyday: [
    { slug: 'cooking', name: 'Cooking Converter', label: 'Convert cooking measurements' },
    { slug: 'recipe-scaler', name: 'Recipe Scaler', label: 'Scale recipe ingredient amounts' },
    { slug: 'fuel', name: 'Fuel Calculator', label: 'Calculate fuel cost & efficiency' },
    { slug: 'age', name: 'Age Calculator', label: 'Calculate exact age from birthdate' },
    { slug: 'shoe-size', name: 'Shoe Size Converter', label: 'Convert between shoe size systems' },
    { slug: 'paper-size', name: 'Paper Size Guide', label: 'Compare paper size standards' },
    { slug: 'time-converter', name: 'Time Converter', label: 'Convert between time units' },
  ],
}

// Flat lookup: slug -> ToolEntry
const allTools: ToolEntry[] = Object.values(toolCategories).flat()
const toolBySlug = new Map(allTools.map((t) => [t.slug, t]))

// slug -> category name
const categoryBySlug = new Map<string, string>()
for (const [cat, tools] of Object.entries(toolCategories)) {
  for (const t of tools) {
    categoryBySlug.set(t.slug, cat)
  }
}

/** Return the last segment of a pathname, e.g. "/calc/bmi" -> "bmi" */
function slugFromPath(pathname: string): string {
  const segments = pathname.replace(/\/+$/, '').split('/')
  return segments[segments.length - 1] || ''
}

/** Readable page name from slug */
function readableName(slug: string): string {
  const entry = toolBySlug.get(slug)
  if (entry) return entry.name
  // Fallback: capitalise each word
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ---------------------------------------------------------------------------
// Breadcrumb (client)
// ---------------------------------------------------------------------------

function Breadcrumb() {
  const pathname = usePathname()
  const slug = slugFromPath(pathname)
  const pageName = readableName(slug)

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted">
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-ink transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-line" />
      <Link href="/calc" className="hover:text-ink transition-colors">Calculators</Link>
      <ChevronRight className="h-3.5 w-3.5 text-line" />
      <span className="font-medium text-ink">{pageName}</span>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Related Tools (client)
// ---------------------------------------------------------------------------

function RelatedTools() {
  const pathname = usePathname()
  const currentSlug = slugFromPath(pathname)
  const currentCategory = categoryBySlug.get(currentSlug)

  // Collect related: same category first (excluding self), then others
  const sameCat =
    currentCategory
      ? (toolCategories[currentCategory] ?? []).filter((t) => t.slug !== currentSlug)
      : []

  const otherCat = allTools.filter(
    (t) => t.slug !== currentSlug && categoryBySlug.get(t.slug) !== currentCategory
  )

  const related = [...sameCat, ...otherCat].slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-ink mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/calc/${tool.slug}`}
            className="group flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 transition-all hover:border-navy hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink truncate group-hover:text-navy transition-colors">
                {tool.name}
              </p>
              <p className="text-sm text-muted truncate">{tool.label}</p>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted group-hover:text-navy transition-colors ml-3" />
          </Link>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Disclaimer
// ---------------------------------------------------------------------------

function Disclaimer() {
  return (
    <p className="mt-8 text-xs text-muted text-center">
      Results are for informational purposes only. Verify important calculations independently.
    </p>
  )
}

// ---------------------------------------------------------------------------
// ToolWrapper
// ---------------------------------------------------------------------------

interface ToolWrapperProps {
  children: React.ReactNode
}

export default function ToolWrapper({ children }: ToolWrapperProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Breadcrumb />
      {children}
      <RelatedTools />
      <Disclaimer />
    </div>
  )
}
