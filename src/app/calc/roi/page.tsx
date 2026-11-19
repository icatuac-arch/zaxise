'use client';

import { useState } from 'react';

export default function ROIPage() {
  const [investment, setInvestment] = useState('10000');
  const [returnAmount, setReturnAmount] = useState('15000');
  const [years, setYears] = useState('3');

  const inv = parseFloat(investment) || 0;
  const ret = parseFloat(returnAmount) || 0;
  const t = parseFloat(years) || 1;

  const gain = ret - inv;
  const roiPercent = inv > 0 ? (gain / inv) * 100 : 0;
  const annualizedROI = inv > 0 && t > 0 ? (Math.pow(ret / inv, 1 / t) - 1) * 100 : 0;

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">ROI Calculator</h1>
        <p className="text-muted">Calculate your Return on Investment (ROI) and annualized returns.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Amount Invested ($)</label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Amount Returned ($)</label>
            <input
              type="number"
              value={returnAmount}
              onChange={(e) => setReturnAmount(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Time Period (Years)</label>
            <input
              type="number"
              step="0.5"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {inv > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-xl p-4 text-center ${gain >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm text-muted mb-1">Net Gain/Loss</div>
              <div className={`text-2xl font-bold font-mono ${gain >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {gain >= 0 ? '+' : ''}${fmt(gain)}
              </div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Total ROI</div>
              <div className="text-3xl font-bold font-mono text-primary">
                {roiPercent >= 0 ? '+' : ''}{roiPercent.toFixed(2)}%
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Annualized ROI</div>
              <div className="text-2xl font-bold font-mono text-blue-700">
                {annualizedROI >= 0 ? '+' : ''}{annualizedROI.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formulas</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            ROI = (Gain / Investment) x 100 = ((Return - Investment) / Investment) x 100
          </div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            Annualized ROI = ((Return / Investment)^(1/Years) - 1) x 100
          </div>
        </div>
        <p className="text-xs text-muted mt-3">
          Annualized ROI accounts for the time period, making it useful for comparing investments of different durations.
        </p>
      </div>
    </div>
  );
}
