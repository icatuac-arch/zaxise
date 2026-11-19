'use client';

import { useState } from 'react';

const paperSizes = [
  { name: 'A0', mm: { w: 841, h: 1189 }, category: 'ISO A Series' },
  { name: 'A1', mm: { w: 594, h: 841 }, category: 'ISO A Series' },
  { name: 'A2', mm: { w: 420, h: 594 }, category: 'ISO A Series' },
  { name: 'A3', mm: { w: 297, h: 420 }, category: 'ISO A Series' },
  { name: 'A4', mm: { w: 210, h: 297 }, category: 'ISO A Series' },
  { name: 'A5', mm: { w: 148, h: 210 }, category: 'ISO A Series' },
  { name: 'A6', mm: { w: 105, h: 148 }, category: 'ISO A Series' },
  { name: 'Letter', mm: { w: 216, h: 279 }, category: 'North American' },
  { name: 'Legal', mm: { w: 216, h: 356 }, category: 'North American' },
  { name: 'Tabloid (11x17)', mm: { w: 279, h: 432 }, category: 'North American' },
  { name: 'Executive', mm: { w: 184, h: 267 }, category: 'North American' },
  { name: 'B4 (ISO)', mm: { w: 250, h: 353 }, category: 'ISO B Series' },
  { name: 'B5 (ISO)', mm: { w: 176, h: 250 }, category: 'ISO B Series' },
  { name: 'C4 (Envelope)', mm: { w: 229, h: 324 }, category: 'Envelopes' },
  { name: 'C5 (Envelope)', mm: { w: 162, h: 229 }, category: 'Envelopes' },
  { name: 'DL (Envelope)', mm: { w: 110, h: 220 }, category: 'Envelopes' },
  { name: '#10 (Envelope)', mm: { w: 105, h: 241 }, category: 'Envelopes' },
];

export default function PaperSizePage() {
  const [displayUnit, setDisplayUnit] = useState<'mm' | 'in' | 'cm'>('mm');
  const [filterCategory, setFilterCategory] = useState('all');

  const mmToIn = (mm: number) => mm / 25.4;
  const mmToCm = (mm: number) => mm / 10;

  const formatDim = (mm: number) => {
    switch (displayUnit) {
      case 'mm': return `${mm} mm`;
      case 'cm': return `${mmToCm(mm).toFixed(1)} cm`;
      case 'in': return `${mmToIn(mm).toFixed(2)}"`;
    }
  };

  const categories = ['all', ...Array.from(new Set(paperSizes.map(p => p.category)))];
  const filtered = filterCategory === 'all' ? paperSizes : paperSizes.filter(p => p.category === filterCategory);

  // Visual scale for comparison
  const maxArea = 841 * 1189; // A0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Paper Size Reference</h1>
        <p className="text-muted">Quick reference for standard paper sizes including ISO A-series, North American, and envelope sizes.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            {(['mm', 'cm', 'in'] as const).map((u) => (
              <button key={u} onClick={() => setDisplayUnit(u)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${displayUnit === u ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>
                {u.toUpperCase()}
              </button>
            ))}
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-4 font-medium text-muted">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Width</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Height</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Category</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Scale</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((paper) => {
                const area = paper.mm.w * paper.mm.h;
                const scale = Math.sqrt(area / maxArea) * 100;
                return (
                  <tr key={paper.name} className="border-b border-card-border last:border-0">
                    <td className="py-3 px-4 font-semibold text-dark">{paper.name}</td>
                    <td className="py-3 px-4 font-mono">{formatDim(paper.mm.w)}</td>
                    <td className="py-3 px-4 font-mono">{formatDim(paper.mm.h)}</td>
                    <td className="py-3 px-4 text-muted">{paper.category}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-background rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: `${scale}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">About Paper Sizes</h2>
        <div className="bg-background rounded-lg p-4 text-sm text-dark-light space-y-1">
          <p><span className="font-semibold">ISO A-Series:</span> Each size is half the area of the previous. A0 = 1 m². Aspect ratio: 1:sqrt(2).</p>
          <p><span className="font-semibold">A4:</span> The most widely used paper size globally (210 x 297 mm).</p>
          <p><span className="font-semibold">Letter:</span> Standard in the US and Canada (8.5 x 11 inches / 216 x 279 mm).</p>
          <p><span className="font-semibold">Legal:</span> Used for legal documents in North America (8.5 x 14 inches / 216 x 356 mm).</p>
        </div>
      </div>
    </div>
  );
}
