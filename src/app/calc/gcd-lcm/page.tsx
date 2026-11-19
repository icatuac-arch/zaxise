'use client';

import { useState } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function gcdMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => gcd(acc, n));
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n));
}

export default function GcdLcmPage() {
  const [numbers, setNumbers] = useState('12, 18, 24');

  const parsed = numbers
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n) && n > 0);

  const resultGcd = parsed.length >= 2 ? gcdMultiple(parsed) : null;
  const resultLcm = parsed.length >= 2 ? lcmMultiple(parsed) : null;

  // Show steps for GCD (Euclidean algorithm) - only for 2 numbers
  const getEuclideanSteps = (a: number, b: number): string[] => {
    const steps: string[] = [];
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      steps.push(`${a} = ${Math.floor(a / b)} x ${b} + ${a % b}`);
      [a, b] = [b, a % b];
    }
    steps.push(`GCD = ${a}`);
    return steps;
  };

  const steps = parsed.length === 2 ? getEuclideanSteps(parsed[0], parsed[1]) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">GCD & LCM Calculator</h1>
        <p className="text-muted">Find the Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of two or more numbers.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted mb-2">Enter numbers (separated by commas or spaces)</label>
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="12, 18, 24"
          />
          <div className="text-xs text-muted mt-1">Parsed: {parsed.join(', ') || 'Enter at least 2 numbers'}</div>
        </div>

        {parsed.length >= 2 && resultGcd !== null && resultLcm !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">GCD (Greatest Common Divisor)</div>
              <div className="text-4xl font-bold font-mono text-primary">{resultGcd}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">LCM (Least Common Multiple)</div>
              <div className="text-4xl font-bold font-mono text-green-700">{resultLcm}</div>
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-dark mb-2">Euclidean Algorithm Steps:</h3>
            <div className="space-y-1">
              {steps.map((step, i) => (
                <div key={i} className="bg-background rounded px-3 py-1 font-mono text-sm">{step}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formulas</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            GCD via Euclidean Algorithm: gcd(a, b) = gcd(b, a mod b), until b = 0
          </div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">
            LCM(a, b) = |a x b| / GCD(a, b)
          </div>
        </div>
        <p className="text-xs text-muted mt-3">
          GCD is the largest number that divides all given numbers. LCM is the smallest number that is a multiple of all given numbers.
        </p>
      </div>
    </div>
  );
}
