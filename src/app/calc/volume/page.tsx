'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Liter', abbr: 'L', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Milliliter', abbr: 'mL', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
  { name: 'US Gallon', abbr: 'gal', toBase: (v: number) => v * 3.78541, fromBase: (v: number) => v / 3.78541 },
  { name: 'US Quart', abbr: 'qt', toBase: (v: number) => v * 0.946353, fromBase: (v: number) => v / 0.946353 },
  { name: 'US Pint', abbr: 'pt', toBase: (v: number) => v * 0.473176, fromBase: (v: number) => v / 0.473176 },
  { name: 'US Cup', abbr: 'cup', toBase: (v: number) => v * 0.236588, fromBase: (v: number) => v / 0.236588 },
  { name: 'US Fluid Ounce', abbr: 'fl oz', toBase: (v: number) => v * 0.0295735, fromBase: (v: number) => v / 0.0295735 },
  { name: 'Cubic Meter', abbr: 'm³', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
];

const examples = [
  { from: '1 liter', to: '0.264172 gallons' },
  { from: '1 gallon', to: '3.78541 liters' },
  { from: '1 cup', to: '236.588 mL' },
  { from: '1 pint', to: '0.473176 liters' },
  { from: '1 fl oz', to: '29.5735 mL' },
  { from: '1 quart', to: '0.946353 liters' },
  { from: '1000 mL', to: '1 liter' },
  { from: '1 m³', to: '1000 liters' },
];

export default function VolumePage() {
  return (
    <ConverterLayout
      title="Volume & Capacity Converter"
      description="Convert between liters, gallons, milliliters, cups, pints, fluid ounces, and more."
      units={units}
      formula="Base unit: Liter (L). Convert to liters first, then to target unit. Example: gallon to liters = value × 3.78541"
      examples={examples}
    />
  );
}
