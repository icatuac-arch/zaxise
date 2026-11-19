'use client';

import { useState } from 'react';

export default function NumberBasePage() {
  const [inputValue, setInputValue] = useState('255');
  const [inputBase, setInputBase] = useState<'10' | '2' | '16' | '8'>('10');

  let decimalValue = 0;
  let parseError = false;

  try {
    const val = inputValue.trim();
    if (!val) {
      decimalValue = 0;
    } else {
      decimalValue = parseInt(val, parseInt(inputBase));
      if (isNaN(decimalValue)) {
        parseError = true;
        decimalValue = 0;
      }
    }
  } catch {
    parseError = true;
  }

  const bases = [
    { label: 'Decimal (Base 10)', value: '10' as const, prefix: '' },
    { label: 'Binary (Base 2)', value: '2' as const, prefix: '0b' },
    { label: 'Hexadecimal (Base 16)', value: '16' as const, prefix: '0x' },
    { label: 'Octal (Base 8)', value: '8' as const, prefix: '0o' },
  ];

  const results = [
    { label: 'Decimal (Base 10)', value: decimalValue.toString(10), bg: 'bg-blue-50', color: 'text-blue-700' },
    { label: 'Binary (Base 2)', value: decimalValue.toString(2), bg: 'bg-green-50', color: 'text-green-700' },
    { label: 'Hexadecimal (Base 16)', value: decimalValue.toString(16).toUpperCase(), bg: 'bg-purple-50', color: 'text-purple-700' },
    { label: 'Octal (Base 8)', value: decimalValue.toString(8), bg: 'bg-yellow-50', color: 'text-yellow-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Number Base Converter</h1>
        <p className="text-muted">Convert between decimal, binary, hexadecimal, and octal number systems.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Input Base</label>
            <select
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value as typeof inputBase)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {bases.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Enter Value</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={inputBase === '2' ? '11111111' : inputBase === '16' ? 'FF' : inputBase === '8' ? '377' : '255'}
            />
            {parseError && <div className="text-red-500 text-xs mt-1">Invalid input for selected base</div>}
          </div>
        </div>

        {!parseError && inputValue.trim() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r) => (
              <div key={r.label} className={`${r.bg} rounded-xl p-4`}>
                <div className="text-xs text-muted mb-1">{r.label}</div>
                <div className={`text-xl font-bold font-mono ${r.color} break-all`}>{r.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Number Systems</h2>
        <div className="bg-background rounded-lg p-4 text-sm text-dark-light space-y-1">
          <p><span className="font-mono font-semibold">Binary (Base 2):</span> Uses digits 0-1. Used in computing at the hardware level.</p>
          <p><span className="font-mono font-semibold">Octal (Base 8):</span> Uses digits 0-7. Compact representation of binary (3 bits per digit).</p>
          <p><span className="font-mono font-semibold">Decimal (Base 10):</span> Uses digits 0-9. Standard human number system.</p>
          <p><span className="font-mono font-semibold">Hexadecimal (Base 16):</span> Uses 0-9 and A-F. Common in programming for colors and memory addresses.</p>
        </div>
      </div>
    </div>
  );
}
