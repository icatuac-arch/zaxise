'use client';

import { useState } from 'react';

export default function TemperaturePage() {
  const [celsius, setCelsius] = useState('0');
  const [fahrenheit, setFahrenheit] = useState('32');
  const [kelvin, setKelvin] = useState('273.15');

  const format = (num: number): string => {
    return parseFloat(num.toFixed(4)).toString();
  };

  const updateFromCelsius = (value: string) => {
    setCelsius(value);
    const c = parseFloat(value);
    if (!isNaN(c)) {
      setFahrenheit(format(c * 9 / 5 + 32));
      setKelvin(format(c + 273.15));
    } else {
      setFahrenheit('');
      setKelvin('');
    }
  };

  const updateFromFahrenheit = (value: string) => {
    setFahrenheit(value);
    const f = parseFloat(value);
    if (!isNaN(f)) {
      const c = (f - 32) * 5 / 9;
      setCelsius(format(c));
      setKelvin(format(c + 273.15));
    } else {
      setCelsius('');
      setKelvin('');
    }
  };

  const updateFromKelvin = (value: string) => {
    setKelvin(value);
    const k = parseFloat(value);
    if (!isNaN(k)) {
      const c = k - 273.15;
      setCelsius(format(c));
      setFahrenheit(format(c * 9 / 5 + 32));
    } else {
      setCelsius('');
      setFahrenheit('');
    }
  };

  const examples = [
    { celsius: '0', fahrenheit: '32', kelvin: '273.15', label: 'Freezing point of water' },
    { celsius: '100', fahrenheit: '212', kelvin: '373.15', label: 'Boiling point of water' },
    { celsius: '37', fahrenheit: '98.6', kelvin: '310.15', label: 'Body temperature' },
    { celsius: '-40', fahrenheit: '-40', kelvin: '233.15', label: 'Equal point (°C = °F)' },
    { celsius: '20', fahrenheit: '68', kelvin: '293.15', label: 'Room temperature' },
    { celsius: '-273.15', fahrenheit: '-459.67', kelvin: '0', label: 'Absolute zero' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Temperature Converter</h1>
        <p className="text-muted">Convert between Celsius, Fahrenheit, and Kelvin instantly.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Celsius (°C)</label>
            <input type="number" value={celsius} onChange={(e) => updateFromCelsius(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="°C" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Fahrenheit (°F)</label>
            <input type="number" value={fahrenheit} onChange={(e) => updateFromFahrenheit(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="°F" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Kelvin (K)</label>
            <input type="number" value={kelvin} onChange={(e) => updateFromKelvin(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="K" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-dark mb-3">Formulas</h2>
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-3 font-mono text-sm">°F = (°C × 9/5) + 32</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm">°C = (°F - 32) × 5/9</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm">K = °C + 273.15</div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Common Temperatures</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-4 font-medium text-muted">Description</th>
                <th className="text-left py-3 px-4 font-medium text-muted">°C</th>
                <th className="text-left py-3 px-4 font-medium text-muted">°F</th>
                <th className="text-left py-3 px-4 font-medium text-muted">K</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex, i) => (
                <tr key={i} className="border-b border-card-border last:border-0">
                  <td className="py-3 px-4">{ex.label}</td>
                  <td className="py-3 px-4 font-mono">{ex.celsius}</td>
                  <td className="py-3 px-4 font-mono">{ex.fahrenheit}</td>
                  <td className="py-3 px-4 font-mono">{ex.kelvin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
