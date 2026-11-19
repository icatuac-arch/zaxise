'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Kilogram', abbr: 'kg', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Gram', abbr: 'g', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
  { name: 'Milligram', abbr: 'mg', toBase: (v: number) => v / 1000000, fromBase: (v: number) => v * 1000000 },
  { name: 'Pound', abbr: 'lb', toBase: (v: number) => v * 0.453592, fromBase: (v: number) => v / 0.453592 },
  { name: 'Ounce', abbr: 'oz', toBase: (v: number) => v * 0.0283495, fromBase: (v: number) => v / 0.0283495 },
  { name: 'Stone', abbr: 'st', toBase: (v: number) => v * 6.35029, fromBase: (v: number) => v / 6.35029 },
  { name: 'Metric Ton', abbr: 't', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'US Ton', abbr: 'ton', toBase: (v: number) => v * 907.185, fromBase: (v: number) => v / 907.185 },
];

const examples = [
  { from: '1 kg', to: '2.20462 lbs' },
  { from: '1 lb', to: '0.453592 kg' },
  { from: '1 oz', to: '28.3495 g' },
  { from: '1 stone', to: '6.35029 kg' },
  { from: '1 metric ton', to: '1000 kg' },
  { from: '1 US ton', to: '907.185 kg' },
  { from: '100 g', to: '3.5274 oz' },
  { from: '10 kg', to: '1.5747 stone' },
];

export default function WeightPage() {
  return (
    <ConverterLayout
      title="Weight & Mass Converter"
      description="Convert between kilograms, pounds, ounces, grams, stones, and tons."
      units={units}
      formula="Base unit: Kilogram (kg). Convert to kg first, then to target unit. Example: lb to kg = value × 0.453592"
      examples={examples}
    />
  );
}
