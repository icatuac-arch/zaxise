'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Calculator, ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Unit Converters',
    icon: '📐',
    tools: [
      { name: 'Length Converter', href: '/calc/length', desc: 'km, miles, meters, feet, inches' },
      { name: 'Weight Converter', href: '/calc/weight', desc: 'kg, lbs, oz, stones, grams' },
      { name: 'Volume Converter', href: '/calc/volume', desc: 'liters, gallons, cups, fl oz' },
      { name: 'Temperature Converter', href: '/calc/temperature', desc: '°C, °F, Kelvin' },
      { name: 'Speed Converter', href: '/calc/speed', desc: 'km/h, mph, m/s, knots' },
      { name: 'Area Converter', href: '/calc/area', desc: 'm², ft², acres, hectares' },
    ],
  },
  {
    name: 'Finance',
    icon: '💰',
    tools: [
      { name: 'Loan Calculator', href: '/calc/loan', desc: 'Monthly payments & total interest' },
      { name: 'Home Loan Calculator', href: '/calc/home-loan', desc: 'Mortgage with full analysis' },
      { name: 'Compound Interest', href: '/calc/compound-interest', desc: 'Investment growth over time' },
      { name: 'Tip Calculator', href: '/calc/tip', desc: 'Tip & bill splitting' },
      { name: 'Salary Converter', href: '/calc/salary', desc: 'Annual, monthly, hourly rates' },
      { name: 'Discount Calculator', href: '/calc/discount', desc: 'Sale prices & savings' },
      { name: 'ROI Calculator', href: '/calc/roi', desc: 'Return on investment' },
    ],
  },
  {
    name: 'Health',
    icon: '❤️',
    tools: [
      { name: 'BMI Calculator', href: '/calc/bmi', desc: 'Body mass index' },
      { name: 'Calorie Calculator', href: '/calc/calorie', desc: 'Daily energy needs (TDEE)' },
      { name: 'Body Fat Calculator', href: '/calc/body-fat', desc: 'Body fat percentage' },
      { name: 'Heart Rate Zones', href: '/calc/heart-rate', desc: 'Training heart rate zones' },
      { name: 'Water Intake', href: '/calc/water-intake', desc: 'Daily hydration needs' },
    ],
  },
  {
    name: 'Math',
    icon: '🧮',
    tools: [
      { name: 'Percentage Calculator', href: '/calc/percentage', desc: 'Percentages & percentage change' },
      { name: 'Fraction Calculator', href: '/calc/fraction', desc: 'Add, subtract, multiply fractions' },
      { name: 'Scientific Notation', href: '/calc/scientific', desc: 'Decimal ↔ scientific notation' },
      { name: 'Prime Checker', href: '/calc/prime', desc: 'Prime numbers & factorization' },
      { name: 'GCD & LCM', href: '/calc/gcd-lcm', desc: 'Greatest common divisor & LCM' },
    ],
  },
  {
    name: 'Science',
    icon: '🔬',
    tools: [
      { name: 'Pressure Converter', href: '/calc/pressure', desc: 'atm, bar, PSI, kPa, mmHg' },
      { name: 'Energy Converter', href: '/calc/energy', desc: 'Joules, kWh, BTU, calories' },
      { name: 'Force Converter', href: '/calc/force', desc: 'Newtons, lbf, kgf, dynes' },
      { name: 'Data Storage', href: '/calc/data-storage', desc: 'Bytes, KB, MB, GB, TB' },
      { name: 'Number Base', href: '/calc/number-base', desc: 'Binary, octal, hex, decimal' },
      { name: 'Color Converter', href: '/calc/color', desc: 'HEX, RGB, HSL color formats' },
    ],
  },
  {
    name: 'Everyday',
    icon: '🌟',
    tools: [
      { name: 'Age Calculator', href: '/calc/age', desc: 'Exact age in years, months, days' },
      { name: 'Cooking Converter', href: '/calc/cooking', desc: 'Cups, tbsp, tsp, ml, oz' },
      { name: 'Recipe Scaler', href: '/calc/recipe-scaler', desc: 'Scale ingredient amounts' },
      { name: 'Fuel Calculator', href: '/calc/fuel', desc: 'Trip fuel cost & efficiency' },
      { name: 'Shoe Size Converter', href: '/calc/shoe-size', desc: 'US, UK, EU, CM sizes' },
      { name: 'Paper Size Guide', href: '/calc/paper-size', desc: 'A4, Letter, Legal & more' },
      { name: 'Time Converter', href: '/calc/time-converter', desc: 'Seconds, minutes, hours, days' },
    ],
  },
]

const allTools = categories.flatMap((c) => c.tools)

export default function CalcIndexPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return allTools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-gold" />
            </div>
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">Free Tools</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Calculators &amp; Converters</h1>
          <p className="text-white/70 text-lg mb-8">
            40+ free tools for unit conversion, finance, health, math, and everyday use.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search: BMI, mortgage, length, tip..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/50 text-sm"
            />
            {filtered.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-line overflow-hidden">
                {filtered.slice(0, 8).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-ink hover:bg-paper transition border-b border-line last:border-b-0"
                  >
                    <Calculator className="w-4 h-4 text-navy shrink-0" />
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted ml-2">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="border-b border-line bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === null ? 'bg-navy text-white' : 'text-muted hover:text-ink hover:bg-paper'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.name ? 'bg-navy text-white' : 'text-muted hover:text-ink hover:bg-paper'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {categories
          .filter((cat) => !activeCategory || cat.name === activeCategory)
          .map((cat) => (
            <section key={cat.name} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold text-ink">{cat.name}</h2>
                <span className="text-xs text-muted bg-line px-2 py-0.5 rounded-full">
                  {cat.tools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-center justify-between bg-white border border-line rounded-xl px-4 py-4 hover:border-navy hover:shadow-md transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-ink group-hover:text-navy transition-colors truncate">
                        {tool.name}
                      </p>
                      <p className="text-xs text-muted truncate mt-0.5">{tool.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-navy transition-colors ml-3" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  )
}
