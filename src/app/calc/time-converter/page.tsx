'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Second', abbr: 's', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Minute', abbr: 'min', toBase: (v: number) => v * 60, fromBase: (v: number) => v / 60 },
  { name: 'Hour', abbr: 'hr', toBase: (v: number) => v * 3600, fromBase: (v: number) => v / 3600 },
  { name: 'Day', abbr: 'day', toBase: (v: number) => v * 86400, fromBase: (v: number) => v / 86400 },
  { name: 'Week', abbr: 'wk', toBase: (v: number) => v * 604800, fromBase: (v: number) => v / 604800 },
  { name: 'Month (30 days)', abbr: 'mo', toBase: (v: number) => v * 2592000, fromBase: (v: number) => v / 2592000 },
  { name: 'Year (365 days)', abbr: 'yr', toBase: (v: number) => v * 31536000, fromBase: (v: number) => v / 31536000 },
  { name: 'Millisecond', abbr: 'ms', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
];

const examples = [
  { from: '1 hour', to: '60 minutes' },
  { from: '1 day', to: '24 hours' },
  { from: '1 week', to: '168 hours' },
  { from: '1 year', to: '365 days' },
  { from: '3600 seconds', to: '1 hour' },
  { from: '1 day', to: '86,400 seconds' },
  { from: '1 month', to: '30 days' },
  { from: '1000 ms', to: '1 second' },
];

export default function TimeConverterPage() {
  return (
    <ConverterLayout
      title="Time Converter"
      description="Convert between seconds, minutes, hours, days, weeks, months, and years."
      units={units}
      formula="Base unit: Second (s). Convert to seconds first, then to target unit. Example: hours to minutes = value × 3600 ÷ 60"
      examples={examples}
    />
  );
}
