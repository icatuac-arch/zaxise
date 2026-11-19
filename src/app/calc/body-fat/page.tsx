'use client';

import { useState } from 'react';

export default function BodyFatPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [waist, setWaist] = useState('85');
  const [neck, setNeck] = useState('38');
  const [hip, setHip] = useState('95');
  const [height, setHeight] = useState('175');
  const [waistIn, setWaistIn] = useState('33.5');
  const [neckIn, setNeckIn] = useState('15');
  const [hipIn, setHipIn] = useState('37.5');
  const [heightIn, setHeightIn] = useState('69');

  let bodyFat: number | null = null;

  if (unit === 'metric') {
    const w = parseFloat(waist) || 0;
    const n = parseFloat(neck) || 0;
    const h = parseFloat(height) || 0;
    const hp = parseFloat(hip) || 0;
    if (w > 0 && n > 0 && h > 0) {
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else if (hp > 0) {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
      }
    }
  } else {
    const w = parseFloat(waistIn) || 0;
    const n = parseFloat(neckIn) || 0;
    const h = parseFloat(heightIn) || 0;
    const hp = parseFloat(hipIn) || 0;
    const wCm = w * 2.54, nCm = n * 2.54, hCm = h * 2.54, hpCm = hp * 2.54;
    if (wCm > 0 && nCm > 0 && hCm > 0) {
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wCm - nCm) + 0.15456 * Math.log10(hCm)) - 450;
      } else if (hpCm > 0) {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wCm + hpCm - nCm) + 0.22100 * Math.log10(hCm)) - 450;
      }
    }
  }

  const getCategory = (bf: number, g: string) => {
    if (g === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50' };
      if (bf < 14) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50' };
      if (bf < 18) return { label: 'Fitness', color: 'text-green-600', bg: 'bg-green-50' };
      if (bf < 25) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50' };
      if (bf < 21) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50' };
      if (bf < 25) return { label: 'Fitness', color: 'text-green-600', bg: 'bg-green-50' };
      if (bf < 32) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
    }
  };

  const category = bodyFat !== null && bodyFat > 0 ? getCategory(bodyFat, gender) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Body Fat % Calculator</h1>
        <p className="text-muted">Estimate your body fat percentage using the U.S. Navy method based on body measurements.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Metric (cm)</button>
            <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Imperial (in)</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setGender('male')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'male' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Male</button>
            <button onClick={() => setGender('female')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'female' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Female</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Waist ({unit === 'metric' ? 'cm' : 'in'}) — at navel</label>
            <input type="number" step="0.1" value={unit === 'metric' ? waist : waistIn} onChange={(e) => unit === 'metric' ? setWaist(e.target.value) : setWaistIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Neck ({unit === 'metric' ? 'cm' : 'in'}) — below larynx</label>
            <input type="number" step="0.1" value={unit === 'metric' ? neck : neckIn} onChange={(e) => unit === 'metric' ? setNeck(e.target.value) : setNeckIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          {gender === 'female' && (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Hip ({unit === 'metric' ? 'cm' : 'in'}) — widest point</label>
              <input type="number" step="0.1" value={unit === 'metric' ? hip : hipIn} onChange={(e) => unit === 'metric' ? setHip(e.target.value) : setHipIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
            <input type="number" step="0.1" value={unit === 'metric' ? height : heightIn} onChange={(e) => unit === 'metric' ? setHeight(e.target.value) : setHeightIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>

        {bodyFat !== null && bodyFat > 0 && category && (
          <div className={`p-4 rounded-xl ${category.bg} text-center`}>
            <div className="text-sm text-muted mb-1">Estimated Body Fat</div>
            <div className={`text-4xl font-bold font-mono ${category.color}`}>{bodyFat.toFixed(1)}%</div>
            <div className={`text-lg font-semibold ${category.color} mt-1`}>{category.label}</div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">U.S. Navy Method Formula</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Male: BF% = 495 / (1.0324 - 0.19077 x log10(waist - neck) + 0.15456 x log10(height)) - 450</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Female: BF% = 495 / (1.29579 - 0.35004 x log10(waist + hip - neck) + 0.22100 x log10(height)) - 450</div>
        </div>
        <p className="text-xs text-muted mt-3">All measurements in centimeters. This is an estimation — DEXA scans or hydrostatic weighing provide more accurate results.</p>
      </div>
    </div>
  );
}
