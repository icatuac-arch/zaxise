'use client';

import { useState } from 'react';

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [time, setTime] = useState('10');
  const [compounds, setCompounds] = useState('12');

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(time) || 0;
  const n = parseFloat(compounds) || 1;

  const amount = P * Math.pow(1 + r / n, n * t);
  const interest = amount - P;

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const compoundOptions = [
    { label: 'Annually', value: '1' },
    { label: 'Semi-annually', value: '2' },
    { label: 'Quarterly', value: '4' },
    { label: 'Monthly', value: '12' },
    { label: 'Daily', value: '365' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Compound Interest Calculator</h1>
        <p className="text-muted">See how your investment grows over time with the power of compound interest.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Initial Investment ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Time Period (Years)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Compound Frequency</label>
            <select
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {compoundOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label} ({opt.value}x/year)</option>
              ))}
            </select>
          </div>
        </div>

        {P > 0 && t > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Final Amount</div>
              <div className="text-3xl font-bold font-mono text-primary">${fmt(amount)}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Total Interest Earned</div>
              <div className="text-2xl font-bold font-mono text-green-700">${fmt(interest)}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Growth Multiple</div>
              <div className="text-2xl font-bold font-mono text-blue-700">{(amount / P).toFixed(2)}x</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          A = P(1 + r/n)^(nt) where A = final amount, P = principal, r = annual rate, n = compounds/year, t = years
        </div>
        <p className="text-xs text-muted mt-3">
          Compound interest means you earn interest on your interest. More frequent compounding results in slightly higher returns.
        </p>
      </div>
    </div>
  );
}
