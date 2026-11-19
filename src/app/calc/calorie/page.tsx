'use client';

import { useState } from 'react';

export default function CaloriePage() {
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [activity, setActivity] = useState('1.55');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightLbs, setWeightLbs] = useState('165');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');

  let w: number, h: number;
  if (unit === 'metric') {
    w = parseFloat(weight) || 0;
    h = parseFloat(height) || 0;
  } else {
    w = (parseFloat(weightLbs) || 0) * 0.453592;
    h = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54;
  }

  const a = parseFloat(age) || 0;
  const activityMultiplier = parseFloat(activity) || 1.55;
  let bmr = 0;
  if (w > 0 && h > 0 && a > 0) {
    bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  }
  const tdee = bmr * activityMultiplier;

  const activityLevels = [
    { label: 'Sedentary (little/no exercise)', value: '1.2' },
    { label: 'Lightly active (1-3 days/week)', value: '1.375' },
    { label: 'Moderately active (3-5 days/week)', value: '1.55' },
    { label: 'Very active (6-7 days/week)', value: '1.725' },
    { label: 'Extra active (athlete/physical job)', value: '1.9' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Daily Calorie Calculator</h1>
        <p className="text-muted">Estimate your Total Daily Energy Expenditure (TDEE) based on your stats and activity level.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Metric</button>
            <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Imperial</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setGender('male')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'male' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Male</button>
            <button onClick={() => setGender('female')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === 'female' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Female</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          {unit === 'metric' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Weight (lbs)</label>
                <input type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Height</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">in</span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Activity Level</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {activityLevels.map((lvl) => <option key={lvl.value} value={lvl.value}>{lvl.label}</option>)}
            </select>
          </div>
        </div>

        {tdee > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">BMR</div>
              <div className="text-2xl font-bold font-mono text-blue-700">{Math.round(bmr)} cal</div>
              <div className="text-xs text-muted mt-1">at rest</div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Maintenance (TDEE)</div>
              <div className="text-3xl font-bold font-mono text-primary">{Math.round(tdee)} cal</div>
              <div className="text-xs text-muted mt-1">per day</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Weight Loss Target</div>
              <div className="text-2xl font-bold font-mono text-green-700">{Math.round(tdee - 500)} cal</div>
              <div className="text-xs text-muted mt-1">-500 cal/day = ~0.5 kg/week</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula (Mifflin-St Jeor)</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Male BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 5</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Female BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">TDEE = BMR x Activity Multiplier</div>
        </div>
        <p className="text-xs text-muted mt-3">The Mifflin-St Jeor equation is considered the most accurate for estimating BMR. Actual needs may vary.</p>
      </div>
    </div>
  );
}
