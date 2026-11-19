'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Milliliter', abbr: 'ml', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Liter', abbr: 'L', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
  { name: 'Teaspoon (US)', abbr: 'tsp', toBase: (v: number) => v * 4.92892, fromBase: (v: number) => v / 4.92892 },
  { name: 'Tablespoon (US)', abbr: 'tbsp', toBase: (v: number) => v * 14.7868, fromBase: (v: number) => v / 14.7868 },
  { name: 'Fluid Ounce (US)', abbr: 'fl oz', toBase: (v: number) => v * 29.5735, fromBase: (v: number) => v / 29.5735 },
  { name: 'Cup (US)', abbr: 'cup', toBase: (v: number) => v * 236.588, fromBase: (v: number) => v / 236.588 },
  { name: 'Pint (US)', abbr: 'pt', toBase: (v: number) => v * 473.176, fromBase: (v: number) => v / 473.176 },
  { name: 'Quart (US)', abbr: 'qt', toBase: (v: number) => v * 946.353, fromBase: (v: number) => v / 946.353 },
  { name: 'Gallon (US)', abbr: 'gal', toBase: (v: number) => v * 3785.41, fromBase: (v: number) => v / 3785.41 },
  { name: 'Teaspoon (Metric)', abbr: 'tsp (m)', toBase: (v: number) => v * 5, fromBase: (v: number) => v / 5 },
  { name: 'Tablespoon (Metric)', abbr: 'tbsp (m)', toBase: (v: number) => v * 15, fromBase: (v: number) => v / 15 },
];

const examples = [
  { from: '1 cup', to: '236.588 ml' },
  { from: '1 tbsp', to: '3 tsp' },
  { from: '1 cup', to: '16 tbsp' },
  { from: '1 fl oz', to: '29.574 ml' },
  { from: '1 pint', to: '2 cups' },
  { from: '1 quart', to: '4 cups' },
  { from: '1 gallon', to: '16 cups' },
  { from: '1 liter', to: '4.227 cups' },
];

export default function CookingPage() {
  return (
    <ConverterLayout
      title="Cooking Measurement Converter"
      description="Convert between cups, tablespoons, teaspoons, milliliters, fluid ounces, pints, quarts, and gallons."
      units={units}
      formula="Base unit: Milliliter (ml). 1 cup = 236.588 ml. 1 tbsp = 14.787 ml. 1 tsp = 4.929 ml. 1 fl oz = 29.574 ml."
      examples={examples}
    />
  );
}
