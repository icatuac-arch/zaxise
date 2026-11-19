'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Square Meter', abbr: 'm²', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Square Kilometer', abbr: 'km²', toBase: (v: number) => v * 1000000, fromBase: (v: number) => v / 1000000 },
  { name: 'Square Foot', abbr: 'ft²', toBase: (v: number) => v * 0.092903, fromBase: (v: number) => v / 0.092903 },
  { name: 'Square Yard', abbr: 'yd²', toBase: (v: number) => v * 0.836127, fromBase: (v: number) => v / 0.836127 },
  { name: 'Square Mile', abbr: 'mi²', toBase: (v: number) => v * 2589988.11, fromBase: (v: number) => v / 2589988.11 },
  { name: 'Acre', abbr: 'ac', toBase: (v: number) => v * 4046.86, fromBase: (v: number) => v / 4046.86 },
  { name: 'Hectare', abbr: 'ha', toBase: (v: number) => v * 10000, fromBase: (v: number) => v / 10000 },
];

const examples = [
  { from: '1 m²', to: '10.7639 ft²' },
  { from: '1 ft²', to: '0.092903 m²' },
  { from: '1 acre', to: '0.404686 hectares' },
  { from: '1 hectare', to: '2.47105 acres' },
  { from: '1 km²', to: '0.386102 mi²' },
  { from: '1 mi²', to: '2.58999 km²' },
  { from: '1 acre', to: '43,560 ft²' },
  { from: '1 hectare', to: '10,000 m²' },
];

export default function AreaPage() {
  return (
    <ConverterLayout
      title="Area Converter"
      description="Convert between square meters, square feet, acres, hectares, square kilometers, and square miles."
      units={units}
      formula="Base unit: Square Meter (m²). Example: acres to hectares = value × 4046.86 ÷ 10000"
      examples={examples}
    />
  );
}
