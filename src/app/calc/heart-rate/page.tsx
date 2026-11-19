'use client';

import { useState } from 'react';

export default function HeartRatePage() {
  const [age, setAge] = useState('30');
  const [restingHR, setRestingHR] = useState('60');

  const a = parseFloat(age) || 0;
  const rhr = parseFloat(restingHR) || 60;
  const maxHR = 220 - a;

  // Karvonen method: Target HR = ((MaxHR - RestingHR) x Intensity%) + RestingHR
  const zones = [
    { name: 'Zone 1 — Warm Up', min: 0.5, max: 0.6, color: 'bg-gray-100', textColor: 'text-gray-700' },
    { name: 'Zone 2 — Fat Burn', min: 0.6, max: 0.7, color: 'bg-blue-100', textColor: 'text-blue-700' },
    { name: 'Zone 3 — Cardio', min: 0.7, max: 0.8, color: 'bg-green-100', textColor: 'text-green-700' },
    { name: 'Zone 4 — Hard', min: 0.8, max: 0.9, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { name: 'Zone 5 — Peak', min: 0.9, max: 1.0, color: 'bg-red-100', textColor: 'text-red-700' },
  ];

  const getTargetHR = (intensity: number) => Math.round((maxHR - rhr) * intensity + rhr);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Heart Rate Zone Calculator</h1>
        <p className="text-muted">Find your training heart rate zones based on your age and resting heart rate (Karvonen method).</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Resting Heart Rate (bpm)</label>
            <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>

        {a > 0 && (
          <>
            <div className="bg-primary/10 rounded-xl p-4 text-center mb-6">
              <div className="text-sm text-muted mb-1">Maximum Heart Rate</div>
              <div className="text-4xl font-bold font-mono text-primary">{maxHR} bpm</div>
            </div>

            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.name} className={`flex items-center justify-between p-4 rounded-lg ${zone.color}`}>
                  <span className={`font-medium text-sm ${zone.textColor}`}>{zone.name}</span>
                  <span className={`font-mono text-sm font-bold ${zone.textColor}`}>
                    {getTargetHR(zone.min)} – {getTargetHR(zone.max)} bpm
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula (Karvonen Method)</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            Max HR = 220 - Age
          </div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            Target HR = ((Max HR - Resting HR) x Intensity%) + Resting HR
          </div>
        </div>
        <p className="text-xs text-muted mt-3">
          Measure resting HR first thing in the morning before getting out of bed. The Karvonen method accounts for fitness level through resting HR.
        </p>
      </div>
    </div>
  );
}
