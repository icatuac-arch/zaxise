'use client';

import { useState } from 'react';

export default function TipPage() {
  const [bill, setBill] = useState('85');
  const [tipPercent, setTipPercent] = useState('18');
  const [people, setPeople] = useState('1');

  const billAmt = parseFloat(bill) || 0;
  const tipPct = parseFloat(tipPercent) || 0;
  const numPeople = Math.max(1, parseInt(people) || 1);

  const tipAmount = billAmt * (tipPct / 100);
  const total = billAmt + tipAmount;
  const perPerson = total / numPeople;
  const tipPerPerson = tipAmount / numPeople;

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const quickTips = [10, 15, 18, 20, 25];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Tip Calculator</h1>
        <p className="text-muted">Calculate the tip amount and split the bill evenly between people.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Bill Amount ($)</label>
            <input
              type="number"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Tip Percentage (%)</label>
            <input
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="18"
            />
            <div className="flex gap-2 mt-2">
              {quickTips.map((t) => (
                <button
                  key={t}
                  onClick={() => setTipPercent(t.toString())}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                    tipPercent === t.toString() ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Split Between</label>
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="1"
            />
          </div>
        </div>

        {billAmt > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Tip Amount</div>
              <div className="text-2xl font-bold font-mono text-primary">${fmt(tipAmount)}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Total</div>
              <div className="text-2xl font-bold font-mono text-green-700">${fmt(total)}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Per Person</div>
              <div className="text-2xl font-bold font-mono text-blue-700">${fmt(perPerson)}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Tip Per Person</div>
              <div className="text-2xl font-bold font-mono text-yellow-700">${fmt(tipPerPerson)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Tip Guide</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light mb-3">
          Tip = Bill x (Tip% / 100). Per Person = (Bill + Tip) / Number of People.
        </div>
        <p className="text-xs text-muted">
          Common tipping: 15% for adequate service, 18% for good service, 20%+ for excellent service. Some countries have different customs.
        </p>
      </div>
    </div>
  );
}
