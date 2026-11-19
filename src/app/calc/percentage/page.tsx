'use client';

import { useState } from 'react';

export default function PercentagePage() {
  // What is X% of Y?
  const [percentOf_x, setPercentOf_x] = useState('');
  const [percentOf_y, setPercentOf_y] = useState('');
  const percentOf_result = percentOf_x && percentOf_y
    ? (parseFloat(percentOf_x) / 100 * parseFloat(percentOf_y)).toString()
    : '';

  // X is what % of Y?
  const [whatPercent_x, setWhatPercent_x] = useState('');
  const [whatPercent_y, setWhatPercent_y] = useState('');
  const whatPercent_result = whatPercent_x && whatPercent_y && parseFloat(whatPercent_y) !== 0
    ? (parseFloat(whatPercent_x) / parseFloat(whatPercent_y) * 100).toFixed(4).replace(/\.?0+$/, '')
    : '';

  // Percentage change from X to Y
  const [change_from, setChange_from] = useState('');
  const [change_to, setChange_to] = useState('');
  const change_result = change_from && change_to && parseFloat(change_from) !== 0
    ? ((parseFloat(change_to) - parseFloat(change_from)) / parseFloat(change_from) * 100).toFixed(4).replace(/\.?0+$/, '')
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Percentage Calculator</h1>
        <p className="text-muted">Calculate percentages instantly — find percentage of a number, what percent one number is of another, or percentage change.</p>
      </div>

      {/* What is X% of Y? */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-dark mb-4">What is X% of Y?</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted">What is</span>
          <input
            type="number"
            value={percentOf_x}
            onChange={(e) => setPercentOf_x(e.target.value)}
            className="w-24 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="X"
          />
          <span className="text-muted">% of</span>
          <input
            type="number"
            value={percentOf_y}
            onChange={(e) => setPercentOf_y(e.target.value)}
            className="w-28 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="Y"
          />
          <span className="text-muted">=</span>
          <div className="px-4 py-2 bg-primary/10 rounded-lg text-lg font-mono font-semibold text-primary min-w-[80px] text-center">
            {percentOf_result || '—'}
          </div>
        </div>
        <p className="text-xs text-muted mt-3 font-mono">Formula: result = X ÷ 100 × Y</p>
      </div>

      {/* X is what % of Y? */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-dark mb-4">X is what % of Y?</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={whatPercent_x}
            onChange={(e) => setWhatPercent_x(e.target.value)}
            className="w-28 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="X"
          />
          <span className="text-muted">is what % of</span>
          <input
            type="number"
            value={whatPercent_y}
            onChange={(e) => setWhatPercent_y(e.target.value)}
            className="w-28 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="Y"
          />
          <span className="text-muted">=</span>
          <div className="px-4 py-2 bg-primary/10 rounded-lg text-lg font-mono font-semibold text-primary min-w-[80px] text-center">
            {whatPercent_result ? `${whatPercent_result}%` : '—'}
          </div>
        </div>
        <p className="text-xs text-muted mt-3 font-mono">Formula: result = (X ÷ Y) × 100</p>
      </div>

      {/* Percentage Change */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-dark mb-4">Percentage Change</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted">From</span>
          <input
            type="number"
            value={change_from}
            onChange={(e) => setChange_from(e.target.value)}
            className="w-28 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="Old"
          />
          <span className="text-muted">to</span>
          <input
            type="number"
            value={change_to}
            onChange={(e) => setChange_to(e.target.value)}
            className="w-28 px-3 py-2 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center"
            placeholder="New"
          />
          <span className="text-muted">=</span>
          <div className={`px-4 py-2 rounded-lg text-lg font-mono font-semibold min-w-[80px] text-center ${
            change_result && parseFloat(change_result) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {change_result ? `${parseFloat(change_result) >= 0 ? '+' : ''}${change_result}%` : '—'}
          </div>
        </div>
        <p className="text-xs text-muted mt-3 font-mono">Formula: result = ((New - Old) ÷ Old) × 100</p>
      </div>

      {/* Reference */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Quick Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-4 font-medium text-muted">Percentage</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Fraction</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Decimal</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pct: '10%', frac: '1/10', dec: '0.1' },
                { pct: '20%', frac: '1/5', dec: '0.2' },
                { pct: '25%', frac: '1/4', dec: '0.25' },
                { pct: '33.33%', frac: '1/3', dec: '0.333' },
                { pct: '50%', frac: '1/2', dec: '0.5' },
                { pct: '66.67%', frac: '2/3', dec: '0.667' },
                { pct: '75%', frac: '3/4', dec: '0.75' },
                { pct: '100%', frac: '1/1', dec: '1.0' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-card-border last:border-0">
                  <td className="py-3 px-4 font-mono">{row.pct}</td>
                  <td className="py-3 px-4 font-mono">{row.frac}</td>
                  <td className="py-3 px-4 font-mono">{row.dec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
