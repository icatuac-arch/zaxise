'use client';

import ConverterLayout from '@/components/calc/ConverterLayout';

const units = [
  { name: 'Bit', abbr: 'b', toBase: (v: number) => v, fromBase: (v: number) => v },
  { name: 'Byte', abbr: 'B', toBase: (v: number) => v * 8, fromBase: (v: number) => v / 8 },
  { name: 'Kilobyte', abbr: 'KB', toBase: (v: number) => v * 8 * 1024, fromBase: (v: number) => v / (8 * 1024) },
  { name: 'Megabyte', abbr: 'MB', toBase: (v: number) => v * 8 * 1024 ** 2, fromBase: (v: number) => v / (8 * 1024 ** 2) },
  { name: 'Gigabyte', abbr: 'GB', toBase: (v: number) => v * 8 * 1024 ** 3, fromBase: (v: number) => v / (8 * 1024 ** 3) },
  { name: 'Terabyte', abbr: 'TB', toBase: (v: number) => v * 8 * 1024 ** 4, fromBase: (v: number) => v / (8 * 1024 ** 4) },
  { name: 'Petabyte', abbr: 'PB', toBase: (v: number) => v * 8 * 1024 ** 5, fromBase: (v: number) => v / (8 * 1024 ** 5) },
  { name: 'Kibibit', abbr: 'Kib', toBase: (v: number) => v * 1024, fromBase: (v: number) => v / 1024 },
  { name: 'Mebibit', abbr: 'Mib', toBase: (v: number) => v * 1024 ** 2, fromBase: (v: number) => v / (1024 ** 2) },
];

const examples = [
  { from: '1 KB', to: '1,024 Bytes' },
  { from: '1 MB', to: '1,024 KB' },
  { from: '1 GB', to: '1,024 MB' },
  { from: '1 TB', to: '1,024 GB' },
  { from: '1 PB', to: '1,024 TB' },
  { from: '1 Byte', to: '8 Bits' },
  { from: '1 GB', to: '1,073,741,824 Bytes' },
  { from: '1 TB', to: '1,099,511,627,776 Bytes' },
];

export default function DataStoragePage() {
  return (
    <ConverterLayout
      title="Data Storage Converter"
      description="Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, and more."
      units={units}
      formula="Base unit: Bit. 1 Byte = 8 Bits. 1 KB = 1,024 Bytes. Each step up multiplies by 1,024 (binary)."
      examples={examples}
    />
  );
}
