'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Pascal', abbr: 'Pa', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Kilopascal', abbr: 'kPa', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'Bar', abbr: 'bar', toBase: (v: number) => v * 100000, fromBase: (v: number) => v / 100000 },
  { name: 'Atmosphere', abbr: 'atm', toBase: (v: number) => v * 101325, fromBase: (v: number) => v / 101325 },
  { name: 'PSI', abbr: 'psi', toBase: (v: number) => v * 6894.757, fromBase: (v: number) => v / 6894.757 },
  { name: 'mmHg (Torr)', abbr: 'mmHg', toBase: (v: number) => v * 133.322, fromBase: (v: number) => v / 133.322 },
  { name: 'Millibar', abbr: 'mbar', toBase: (v: number) => v * 100, fromBase: (v: number) => v / 100 },
];

const examples = [
  { from: '1 atm', to: '101,325 Pa' },
  { from: '1 atm', to: '14.696 PSI' },
  { from: '1 bar', to: '100,000 Pa' },
  { from: '1 atm', to: '760 mmHg' },
  { from: '1 PSI', to: '6,894.757 Pa' },
  { from: '1 bar', to: '0.9869 atm' },
  { from: '1 kPa', to: '0.145 PSI' },
  { from: '100 kPa', to: '1 bar' },
];

export default function PressurePage() {
  return (
    <ConverterLayout
      title="Pressure Converter"
      description="Convert between atmospheres, bar, PSI, kilopascals, mmHg, millibars, and pascals."
      units={units}
      formula="Base unit: Pascal (Pa). 1 atm = 101,325 Pa = 14.696 PSI = 760 mmHg = 1.01325 bar"
      examples={examples}
    />
  );
}
