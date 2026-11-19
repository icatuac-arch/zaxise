'use client';

import { useState } from 'react';

export default function WaterIntakePage() {
  const [weight, setWeight] = useState('75');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('temperate');

  const w = parseFloat(weight) || 0;
  const weightKg = unit === 'metric' ? w : w * 0.453592;

  // Base: ~33ml per kg of body weight
  let baseWater = weightKg * 33; // ml

  const activityMultipliers: Record<string, number> = {
    sedentary: 0.9,
    light: 1.0,
    moderate: 1.15,
    active: 1.3,
    intense: 1.5,
  };

  const climateMultipliers: Record<string, number> = {
    cold: 0.9,
    temperate: 1.0,
    hot: 1.2,
    'hot-humid': 1.35,
  };

  const totalWaterMl = baseWater * (activityMultipliers[activity] || 1) * (climateMultipliers[climate] || 1);
  const totalLiters = totalWaterMl / 1000;
  const totalOz = totalWaterMl * 0.033814;
  const glasses = Math.round(totalWaterMl / 250); // 250ml glasses

  const activityOptions = [
    { label: 'Sedentary (desk job)', value: 'sedentary' },
    { label: 'Light (walk 1-2x/week)', value: 'light' },
    { label: 'Moderate (exercise 3-5x/week)', value: 'moderate' },
    { label: 'Active (exercise 6-7x/week)', value: 'active' },
    { label: 'Intense (athlete/labor)', value: 'intense' },
  ];

  const climateOptions = [
    { label: 'Cold', value: 'cold' },
    { label: 'Temperate', value: 'temperate' },
    { label: 'Hot & Dry', value: 'hot' },
    { label: 'Hot & Humid', value: 'hot-humid' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Daily Water Intake Calculator</h1>
        <p className="text-muted">Estimate how much water you should drink daily based on your weight, activity, and climate.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Metric (kg)</button>
          <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Imperial (lbs)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Activity Level</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {activityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Climate</label>
            <select value={climate} onChange={(e) => setClimate(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {climateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {weightKg > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Daily Water</div>
              <div className="text-3xl font-bold font-mono text-blue-700">{totalLiters.toFixed(1)} L</div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">In Fluid Ounces</div>
              <div className="text-2xl font-bold font-mono text-primary">{totalOz.toFixed(0)} fl oz</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Glasses (250ml)</div>
              <div className="text-3xl font-bold font-mono text-green-700">{glasses}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">How It Works</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Base = 33ml per kg body weight, adjusted for activity level and climate.
        </div>
        <p className="text-xs text-muted mt-3">
          This is a general estimate. Actual needs vary by individual. Signs of proper hydration include light-colored urine. About 20% of daily water intake typically comes from food.
        </p>
      </div>
    </div>
  );
}
