'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Newton', abbr: 'N', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Kilonewton', abbr: 'kN', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'Dyne', abbr: 'dyn', toBase: (v: number) => v * 0.00001, fromBase: (v: number) => v / 0.00001 },
  { name: 'Pound-force', abbr: 'lbf', toBase: (v: number) => v * 4.44822, fromBase: (v: number) => v / 4.44822 },
  { name: 'Kilogram-force', abbr: 'kgf', toBase: (v: number) => v * 9.80665, fromBase: (v: number) => v / 9.80665 },
  { name: 'Gram-force', abbr: 'gf', toBase: (v: number) => v * 0.00980665, fromBase: (v: number) => v / 0.00980665 },
  { name: 'Ounce-force', abbr: 'ozf', toBase: (v: number) => v * 0.278014, fromBase: (v: number) => v / 0.278014 },
];

const examples = [
  { from: '1 N', to: '100,000 dyn' },
  { from: '1 lbf', to: '4.44822 N' },
  { from: '1 kgf', to: '9.80665 N' },
  { from: '1 kN', to: '1,000 N' },
  { from: '1 N', to: '0.2248 lbf' },
  { from: '1 kgf', to: '2.2046 lbf' },
  { from: '1 N', to: '0.10197 kgf' },
  { from: '1 lbf', to: '16 ozf' },
];

export default function ForcePage() {
  return (
    <ConverterLayout
      title="Force Converter"
      description="Convert between newtons, dynes, pound-force, kilogram-force, and more."
      units={units}
      formula="Base unit: Newton (N). 1 N = 1 kg*m/s². 1 lbf = 4.44822 N. 1 kgf = 9.80665 N. 1 dyn = 10^-5 N."
      examples={examples}
    />
  );
}
