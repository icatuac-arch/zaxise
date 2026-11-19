'use client';

import { useState } from 'react';

export default function BMIPage() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const calculateBMI = (): number | null => {
    if (unit === 'metric') {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (!h || !w || h <= 0) return null;
      return w / (h * h);
    } else {
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      const w = parseFloat(weightLbs);
      if (!totalInches || !w || totalInches <= 0) return null;
      return (w / (totalInches * totalInches)) * 703;
    }
  };

  const bmi = calculateBMI();

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const category = bmi ? getCategory(bmi) : null;

  const categories = [
    { range: 'Below 18.5', label: 'Underweight', color: 'bg-blue-100' },
    { range: '18.5 – 24.9', label: 'Normal weight', color: 'bg-green-100' },
    { range: '25.0 – 29.9', label: 'Overweight', color: 'bg-yellow-100' },
    { range: '30.0 and above', label: 'Obese', color: 'bg-red-100' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">BMI Calculator</h1>
        <p className="text-muted">Calculate your Body Mass Index (BMI) to assess if your weight is healthy for your height.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Metric (cm/kg)</button>
          <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Imperial (ft/lbs)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Height</label>
            {unit === 'metric' ? (
              <div className="relative">
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Height" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">cm</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Feet" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">ft</span>
                </div>
                <div className="relative flex-1">
                  <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Inches" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">in</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Weight</label>
            <div className="relative">
              <input type="number" value={unit === 'metric' ? weightKg : weightLbs} onChange={(e) => unit === 'metric' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Weight" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">{unit === 'metric' ? 'kg' : 'lbs'}</span>
            </div>
          </div>
        </div>

        {bmi && category && (
          <div className={`mt-6 p-4 rounded-xl ${category.bg} text-center`}>
            <div className="text-sm text-muted mb-1">Your BMI</div>
            <div className={`text-4xl font-bold font-mono ${category.color}`}>{bmi.toFixed(1)}</div>
            <div className={`text-lg font-semibold ${category.color} mt-1`}>{category.label}</div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-3 font-mono text-sm">Metric: BMI = weight (kg) / height (m)²</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm">Imperial: BMI = (weight (lbs) / height (in)²) × 703</div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">BMI Categories</h2>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${cat.color}`}>
              <span className="font-medium text-sm">{cat.label}</span>
              <span className="font-mono text-sm">{cat.range}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">Note: BMI is a screening tool and does not directly assess body fat or health. Consult a healthcare provider for a comprehensive health assessment.</p>
      </div>
    </div>
  );
}
