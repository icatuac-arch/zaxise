'use client';

import { useState } from 'react';

export default function SalaryPage() {
  const [amount, setAmount] = useState('75000');
  const [period, setPeriod] = useState<'annual' | 'monthly' | 'biweekly' | 'weekly' | 'daily' | 'hourly'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');

  const val = parseFloat(amount) || 0;
  const hpw = parseFloat(hoursPerWeek) || 40;
  const weeksPerYear = 52;
  const daysPerYear = 260; // working days

  // Convert everything to annual first
  let annual = 0;
  switch (period) {
    case 'annual': annual = val; break;
    case 'monthly': annual = val * 12; break;
    case 'biweekly': annual = val * 26; break;
    case 'weekly': annual = val * weeksPerYear; break;
    case 'daily': annual = val * daysPerYear; break;
    case 'hourly': annual = val * hpw * weeksPerYear; break;
  }

  const monthly = annual / 12;
  const biweekly = annual / 26;
  const weekly = annual / weeksPerYear;
  const daily = annual / daysPerYear;
  const hourly = annual / (hpw * weeksPerYear);

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const periods = [
    { key: 'annual' as const, label: 'Annual' },
    { key: 'monthly' as const, label: 'Monthly' },
    { key: 'biweekly' as const, label: 'Bi-weekly' },
    { key: 'weekly' as const, label: 'Weekly' },
    { key: 'daily' as const, label: 'Daily' },
    { key: 'hourly' as const, label: 'Hourly' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Salary Converter</h1>
        <p className="text-muted">Convert your salary between annual, monthly, bi-weekly, weekly, daily, and hourly rates.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Pay Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as typeof period)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {periods.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Hours per Week</label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {val > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Annual', value: annual },
              { label: 'Monthly', value: monthly },
              { label: 'Bi-weekly', value: biweekly },
              { label: 'Weekly', value: weekly },
              { label: 'Daily', value: daily },
              { label: 'Hourly', value: hourly },
            ].map((item) => (
              <div key={item.label} className="bg-background rounded-xl p-4 text-center">
                <div className="text-xs text-muted mb-1">{item.label}</div>
                <div className="text-lg font-bold font-mono text-dark">${fmt(item.value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">How It Works</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Assumes 52 weeks/year, 260 working days/year (5 days/week). Hourly rate = Annual / (Hours/week x 52).
        </div>
        <p className="text-xs text-muted mt-3">
          This is a gross salary conversion. Actual take-home pay will vary based on taxes, deductions, and benefits.
        </p>
      </div>
    </div>
  );
}
