'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Kilometer', abbr: 'km', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'Meter', abbr: 'm', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Centimeter', abbr: 'cm', toBase: (v: number) => v / 100, fromBase: (v: number) => v * 100 },
  { name: 'Millimeter', abbr: 'mm', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
  { name: 'Mile', abbr: 'mi', toBase: (v: number) => v * 1609.344, fromBase: (v: number) => v / 1609.344 },
  { name: 'Yard', abbr: 'yd', toBase: (v: number) => v * 0.9144, fromBase: (v: number) => v / 0.9144 },
  { name: 'Foot', abbr: 'ft', toBase: (v: number) => v * 0.3048, fromBase: (v: number) => v / 0.3048 },
  { name: 'Inch', abbr: 'in', toBase: (v: number) => v * 0.0254, fromBase: (v: number) => v / 0.0254 },
];

const examples = [
  { from: '1 km', to: '0.621371 miles' },
  { from: '1 mile', to: '1.60934 km' },
  { from: '1 meter', to: '3.28084 feet' },
  { from: '1 foot', to: '30.48 cm' },
  { from: '1 inch', to: '2.54 cm' },
  { from: '1 yard', to: '0.9144 meters' },
  { from: '100 cm', to: '1 meter' },
  { from: '1 km', to: '1000 meters' },
];

export default function LengthPage() {
  return (
    <ConverterLayout
      title="Length & Distance Converter"
      description="Convert between kilometers, miles, meters, feet, inches, yards, centimeters, and millimeters."
      units={units}
      formula="Base unit: Meter (m). Convert to meters first, then to target unit. Example: km to miles = value × 1000 ÷ 1609.344"
      examples={examples}
    />
  );
}
