'use client';

import { useState } from 'react';

export default function LoanPage() {
  const [principal, setPrincipal] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  let monthly = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p > 0 && r > 0 && n > 0) {
    monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = monthly * n;
    totalInterest = totalPayment - p;
  } else if (p > 0 && r === 0 && n > 0) {
    monthly = p / n;
    totalPayment = p;
    totalInterest = 0;
  }

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Loan / Mortgage Calculator</h1>
        <p className="text-muted">Calculate your monthly payment, total interest, and total cost for any loan or mortgage.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Loan Amount ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="250000"
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
              placeholder="6.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Loan Term (Years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="30"
            />
          </div>
        </div>

        {monthly > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Monthly Payment</div>
              <div className="text-3xl font-bold font-mono text-primary">${fmt(monthly)}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Total Payment</div>
              <div className="text-2xl font-bold font-mono text-green-700">${fmt(totalPayment)}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Total Interest</div>
              <div className="text-2xl font-bold font-mono text-red-600">${fmt(totalInterest)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          M = P * [r(1+r)^n] / [(1+r)^n - 1] where M = monthly payment, P = principal, r = monthly rate, n = total payments
        </div>
        <p className="text-xs text-muted mt-3">
          This formula calculates the fixed monthly payment for a fully amortizing loan. The total interest paid equals (M x n) - P.
        </p>
      </div>
    </div>
  );
}
