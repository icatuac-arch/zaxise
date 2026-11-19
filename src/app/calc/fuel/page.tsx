'use client';

import { useState } from 'react';

export default function FuelPage() {
  const [distance, setDistance] = useState('500');
  const [efficiency, setEfficiency] = useState('8');
  const [pricePerLiter, setPricePerLiter] = useState('1.65');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Imperial values
  const [distanceMi, setDistanceMi] = useState('310');
  const [mpg, setMpg] = useState('30');
  const [pricePerGal, setPricePerGal] = useState('3.50');

  let fuelNeeded = 0;
  let totalCost = 0;

  if (unit === 'metric') {
    const d = parseFloat(distance) || 0;
    const e = parseFloat(efficiency) || 1; // L/100km
    const p = parseFloat(pricePerLiter) || 0;
    fuelNeeded = (d / 100) * e;
    totalCost = fuelNeeded * p;
  } else {
    const d = parseFloat(distanceMi) || 0;
    const m = parseFloat(mpg) || 1;
    const p = parseFloat(pricePerGal) || 0;
    fuelNeeded = d / m;
    totalCost = fuelNeeded * p;
  }

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Fuel Cost Calculator</h1>
        <p className="text-muted">Calculate the fuel cost for a trip based on distance, fuel efficiency, and fuel price.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Metric (km, L)</button>
          <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>Imperial (mi, gal)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {unit === 'metric' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Distance (km)</label>
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Fuel Consumption (L/100km)</label>
                <input type="number" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Price per Liter ($)</label>
                <input type="number" step="0.01" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Distance (miles)</label>
                <input type="number" value={distanceMi} onChange={(e) => setDistanceMi(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Fuel Efficiency (MPG)</label>
                <input type="number" step="0.1" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Price per Gallon ($)</label>
                <input type="number" step="0.01" value={pricePerGal} onChange={(e) => setPricePerGal(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-sm text-muted mb-1">Fuel Needed</div>
            <div className="text-2xl font-bold font-mono text-blue-700">
              {fmt(fuelNeeded)} {unit === 'metric' ? 'liters' : 'gallons'}
            </div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <div className="text-sm text-muted mb-1">Total Cost</div>
            <div className="text-3xl font-bold font-mono text-primary">${fmt(totalCost)}</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formulas</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            Metric: Fuel = (Distance / 100) x L/100km. Cost = Fuel x Price/Liter.
          </div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            Imperial: Fuel = Distance / MPG. Cost = Fuel x Price/Gallon.
          </div>
        </div>
      </div>
    </div>
  );
}
