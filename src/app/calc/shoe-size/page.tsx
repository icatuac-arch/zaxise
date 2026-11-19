'use client';

import { useState } from 'react';

// Shoe size conversion data based on foot length in cm
const sizeChart = [
  { cm: 22.0, usMen: 4, usWomen: 5.5, uk: 3.5, eu: 35 },
  { cm: 22.5, usMen: 4.5, usWomen: 6, uk: 4, eu: 36 },
  { cm: 23.0, usMen: 5, usWomen: 6.5, uk: 4.5, eu: 36.5 },
  { cm: 23.5, usMen: 5.5, usWomen: 7, uk: 5, eu: 37 },
  { cm: 24.0, usMen: 6, usWomen: 7.5, uk: 5.5, eu: 38 },
  { cm: 24.5, usMen: 6.5, usWomen: 8, uk: 6, eu: 38.5 },
  { cm: 25.0, usMen: 7, usWomen: 8.5, uk: 6.5, eu: 39 },
  { cm: 25.5, usMen: 7.5, usWomen: 9, uk: 7, eu: 40 },
  { cm: 26.0, usMen: 8, usWomen: 9.5, uk: 7.5, eu: 41 },
  { cm: 26.5, usMen: 8.5, usWomen: 10, uk: 8, eu: 41.5 },
  { cm: 27.0, usMen: 9, usWomen: 10.5, uk: 8.5, eu: 42 },
  { cm: 27.5, usMen: 9.5, usWomen: 11, uk: 9, eu: 43 },
  { cm: 28.0, usMen: 10, usWomen: 11.5, uk: 9.5, eu: 43.5 },
  { cm: 28.5, usMen: 10.5, usWomen: 12, uk: 10, eu: 44 },
  { cm: 29.0, usMen: 11, usWomen: 12.5, uk: 10.5, eu: 45 },
  { cm: 29.5, usMen: 11.5, usWomen: 13, uk: 11, eu: 45.5 },
  { cm: 30.0, usMen: 12, usWomen: 13.5, uk: 11.5, eu: 46 },
  { cm: 30.5, usMen: 12.5, usWomen: 14, uk: 12, eu: 47 },
  { cm: 31.0, usMen: 13, usWomen: 14.5, uk: 12.5, eu: 47.5 },
  { cm: 31.5, usMen: 14, usWomen: 15.5, uk: 13.5, eu: 48.5 },
];

type SizeSystem = 'usMen' | 'usWomen' | 'uk' | 'eu' | 'cm';

export default function ShoeSizePage() {
  const [system, setSystem] = useState<SizeSystem>('usMen');
  const [sizeValue, setSizeValue] = useState('10');

  const inputSize = parseFloat(sizeValue) || 0;

  // Find closest match
  const match = sizeChart.reduce((closest, row) => {
    const diff = Math.abs((row[system] as number) - inputSize);
    const closestDiff = Math.abs((closest[system] as number) - inputSize);
    return diff < closestDiff ? row : closest;
  }, sizeChart[0]);

  const systems = [
    { label: 'US Men', value: 'usMen' as const },
    { label: 'US Women', value: 'usWomen' as const },
    { label: 'UK', value: 'uk' as const },
    { label: 'EU', value: 'eu' as const },
    { label: 'CM', value: 'cm' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Shoe Size Converter</h1>
        <p className="text-muted">Convert shoe sizes between US, UK, EU, and centimeters.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Size System</label>
            <select value={system} onChange={(e) => setSystem(e.target.value as SizeSystem)} className="w-full px-4 py-3 border border-card-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {systems.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Your Size</label>
            <input type="number" step="0.5" value={sizeValue} onChange={(e) => setSizeValue(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>

        {inputSize > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className={`rounded-xl p-4 text-center ${system === 'usMen' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'}`}>
              <div className="text-xs text-muted mb-1">US Men</div>
              <div className="text-xl font-bold font-mono text-dark">{match.usMen}</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${system === 'usWomen' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'}`}>
              <div className="text-xs text-muted mb-1">US Women</div>
              <div className="text-xl font-bold font-mono text-dark">{match.usWomen}</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${system === 'uk' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'}`}>
              <div className="text-xs text-muted mb-1">UK</div>
              <div className="text-xl font-bold font-mono text-dark">{match.uk}</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${system === 'eu' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'}`}>
              <div className="text-xs text-muted mb-1">EU</div>
              <div className="text-xl font-bold font-mono text-dark">{match.eu}</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${system === 'cm' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-background'}`}>
              <div className="text-xs text-muted mb-1">CM</div>
              <div className="text-xl font-bold font-mono text-dark">{match.cm}</div>
            </div>
          </div>
        )}
      </div>

      {/* Full Size Chart */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Full Size Chart</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-3 font-medium text-muted">US Men</th>
                <th className="text-left py-3 px-3 font-medium text-muted">US Women</th>
                <th className="text-left py-3 px-3 font-medium text-muted">UK</th>
                <th className="text-left py-3 px-3 font-medium text-muted">EU</th>
                <th className="text-left py-3 px-3 font-medium text-muted">CM</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => (
                <tr key={i} className={`border-b border-card-border last:border-0 ${row === match ? 'bg-primary/5 font-semibold' : ''}`}>
                  <td className="py-2 px-3 font-mono">{row.usMen}</td>
                  <td className="py-2 px-3 font-mono">{row.usWomen}</td>
                  <td className="py-2 px-3 font-mono">{row.uk}</td>
                  <td className="py-2 px-3 font-mono">{row.eu}</td>
                  <td className="py-2 px-3 font-mono">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-3">
          Sizes may vary between manufacturers. This chart provides general conversions based on foot length.
        </p>
      </div>
    </div>
  );
}
