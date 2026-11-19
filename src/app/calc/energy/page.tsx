'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Joule', abbr: 'J', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Kilojoule', abbr: 'kJ', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'Calorie', abbr: 'cal', toBase: (v: number) => v * 4.184, fromBase: (v: number) => v / 4.184 },
  { name: 'Kilocalorie', abbr: 'kcal', toBase: (v: number) => v * 4184, fromBase: (v: number) => v / 4184 },
  { name: 'Watt-hour', abbr: 'Wh', toBase: (v: number) => v * 3600, fromBase: (v: number) => v / 3600 },
  { name: 'Kilowatt-hour', abbr: 'kWh', toBase: (v: number) => v * 3600000, fromBase: (v: number) => v / 3600000 },
  { name: 'BTU', abbr: 'BTU', toBase: (v: number) => v * 1055.06, fromBase: (v: number) => v / 1055.06 },
  { name: 'Electronvolt', abbr: 'eV', toBase: (v: number) => v * 1.602176634e-19, fromBase: (v: number) => v / 1.602176634e-19 },
];

const examples = [
  { from: '1 kWh', to: '3,600,000 J' },
  { from: '1 kcal', to: '4,184 J' },
  { from: '1 BTU', to: '1,055.06 J' },
  { from: '1 kWh', to: '3,412.14 BTU' },
  { from: '1 cal', to: '4.184 J' },
  { from: '1 kJ', to: '0.2388 kcal' },
  { from: '1 Wh', to: '3,600 J' },
  { from: '1 eV', to: '1.602 x 10^-19 J' },
];

export default function EnergyPage() {
  return (
    <ConverterLayout
      title="Energy Converter"
      description="Convert between joules, calories, kilowatt-hours, BTU, electronvolts, and more."
      units={units}
      formula="Base unit: Joule (J). 1 kWh = 3,600,000 J. 1 kcal = 4,184 J. 1 BTU = 1,055.06 J."
      examples={examples}
    />
  );
}
