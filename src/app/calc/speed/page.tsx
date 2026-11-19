'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Kilometers per hour', abbr: 'km/h', toBase: (v: number) => v / 3.6, fromBase: (v: number) => v * 3.6 },
  { name: 'Miles per hour', abbr: 'mph', toBase: (v: number) => v * 0.44704, fromBase: (v: number) => v / 0.44704 },
  { name: 'Meters per second', abbr: 'm/s', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Knots', abbr: 'kn', toBase: (v: number) => v * 0.514444, fromBase: (v: number) => v / 0.514444 },
  { name: 'Feet per second', abbr: 'ft/s', toBase: (v: number) => v * 0.3048, fromBase: (v: number) => v / 0.3048 },
];

const examples = [
  { from: '100 km/h', to: '62.1371 mph' },
  { from: '60 mph', to: '96.5606 km/h' },
  { from: '1 m/s', to: '3.6 km/h' },
  { from: '1 knot', to: '1.852 km/h' },
  { from: '100 mph', to: '160.934 km/h' },
  { from: '340 m/s', to: '1224 km/h (speed of sound)' },
  { from: '10 knots', to: '18.52 km/h' },
  { from: '30 ft/s', to: '20.4545 mph' },
];

export default function SpeedPage() {
  return (
    <ConverterLayout
      title="Speed Converter"
      description="Convert between km/h, mph, meters per second, knots, and feet per second."
      units={units}
      formula="Base unit: Meters per second (m/s). Example: km/h to mph = value ÷ 3.6 ÷ 0.44704"
      examples={examples}
    />
  );
}
