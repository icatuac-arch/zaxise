'use client';

import { useState, useCallback } from 'react';

export interface ConversionUnit {
  name: string;
  abbr: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface ConversionExample {
  from: string;
  to: string;
}

interface ConverterLayoutProps {
  title: string;
  description: string;
  units: ConversionUnit[];
  formula: string;
  examples: ConversionExample[];
}

export default function ConverterLayout({ title, description, units, formula, examples }: ConverterLayoutProps) {
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');

  const convert = useCallback((value: string, direction: 'from' | 'to') => {
    const num = parseFloat(value);
    if (isNaN(num) || value === '') {
      if (direction === 'from') setToValue('');
      else setFromValue('');
      return;
    }

    if (direction === 'from') {
      const baseValue = units[fromUnit].toBase(num);
      const result = units[toUnit].fromBase(baseValue);
      setToValue(formatNumber(result));
    } else {
      const baseValue = units[toUnit].toBase(num);
      const result = units[fromUnit].fromBase(baseValue);
      setFromValue(formatNumber(result));
    }
  }, [fromUnit, toUnit, units]);

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) return num.toString();
    const str = num.toPrecision(10);
    return parseFloat(str).toString();
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    setActiveField('from');
    convert(value, 'from');
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    setActiveField('to');
    convert(value, 'to');
  };

  const handleFromUnitChange = (index: number) => {
    setFromUnit(index);
    setTimeout(() => {
      if (activeField === 'from') {
        const num = parseFloat(fromValue);
        if (!isNaN(num)) {
          const baseValue = units[index].toBase(num);
          const result = units[toUnit].fromBase(baseValue);
          setToValue(formatNumber(result));
        }
      } else {
        const num = parseFloat(toValue);
        if (!isNaN(num)) {
          const baseValue = units[toUnit].toBase(num);
          const result = units[index].fromBase(baseValue);
          setFromValue(formatNumber(result));
        }
      }
    }, 0);
  };

  const handleToUnitChange = (index: number) => {
    setToUnit(index);
    setTimeout(() => {
      if (activeField === 'from') {
        const num = parseFloat(fromValue);
        if (!isNaN(num)) {
          const baseValue = units[fromUnit].toBase(num);
          const result = units[index].fromBase(baseValue);
          setToValue(formatNumber(result));
        }
      } else {
        const num = parseFloat(toValue);
        if (!isNaN(num)) {
          const baseValue = units[index].toBase(num);
          const result = units[fromUnit].fromBase(baseValue);
          setFromValue(formatNumber(result));
        }
      }
    }, 0);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  // Initialize conversion on mount
  useState(() => {
    convert('1', 'from');
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-dark mb-2">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>

      {/* Converter Card */}
      <div className="bg-white border border-card-border rounded-2xl p-6 sm:p-8 shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div>
            <label className="block text-sm font-semibold text-muted mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => handleFromUnitChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-card-border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>{unit.name} ({unit.abbr})</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              onFocus={() => setActiveField('from')}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-dark"
              placeholder="Enter value"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pb-3">
            <button
              onClick={swapUnits}
              className="w-10 h-10 bg-primary text-white hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shadow-md"
              title="Swap units"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-semibold text-muted mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => handleToUnitChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-card-border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>{unit.name} ({unit.abbr})</option>
              ))}
            </select>
            <input
              type="number"
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              onFocus={() => setActiveField('to')}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-dark"
              placeholder="Result"
            />
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-dark mb-3">Formula</h2>
        <div className="bg-paper rounded-lg p-4 font-mono text-sm text-dark-light">
          {formula}
        </div>
      </div>

      {/* Common Conversions Table */}
      <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-dark mb-4">Common Conversions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-4 font-semibold text-muted">From</th>
                <th className="text-left py-3 px-4 font-semibold text-muted">To</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex, i) => (
                <tr key={i} className="border-b border-card-border last:border-0 hover:bg-paper">
                  <td className="py-3 px-4 font-mono text-dark">{ex.from}</td>
                  <td className="py-3 px-4 font-mono text-dark">{ex.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
