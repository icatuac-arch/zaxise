'use client';

import { useState } from 'react';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function factorize(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let num = Math.abs(Math.floor(n));
  for (let i = 2; i * i <= num; i++) {
    while (num % i === 0) {
      factors.push(i);
      num = num / i;
    }
  }
  if (num > 1) factors.push(num);
  return factors;
}

export default function PrimePage() {
  const [number, setNumber] = useState('97');
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('100');

  const num = parseInt(number) || 0;
  const prime = num >= 2 ? isPrime(num) : false;
  const factors = num >= 2 ? factorize(num) : [];

  // Group factors
  const factorCounts: Record<number, number> = {};
  factors.forEach((f) => { factorCounts[f] = (factorCounts[f] || 0) + 1; });
  const factorDisplay = Object.entries(factorCounts)
    .map(([f, c]) => c > 1 ? `${f}^${c}` : f)
    .join(' x ');

  // Primes in range
  const rs = Math.max(2, parseInt(rangeStart) || 2);
  const re = Math.min(parseInt(rangeEnd) || 100, 10000);
  const primesInRange: number[] = [];
  if (re >= rs && re - rs <= 10000) {
    for (let i = rs; i <= re; i++) {
      if (isPrime(i)) primesInRange.push(i);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Prime Number Checker & Factorization</h1>
        <p className="text-muted">Check if a number is prime and find its prime factorization.</p>
      </div>

      {/* Checker */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Check a Number</h2>
        <div>
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full max-w-xs px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter a number" />
        </div>

        {num >= 2 && (
          <div className="mt-4 space-y-3">
            <div className={`p-4 rounded-xl text-center ${prime ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className={`text-2xl font-bold font-mono ${prime ? 'text-green-700' : 'text-yellow-700'}`}>
                {num} is {prime ? 'PRIME' : 'NOT prime'}
              </div>
            </div>

            {!prime && factors.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-sm text-muted mb-1">Prime Factorization</div>
                <div className="text-xl font-bold font-mono text-blue-700">{num} = {factorDisplay}</div>
                <div className="text-sm text-muted mt-1">Factors: {factors.join(' x ')}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Range */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-dark mb-4">Primes in Range</h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-muted">From</span>
          <input type="number" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className="w-24 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          <span className="text-muted">to</span>
          <input type="number" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className="w-24 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          <span className="text-sm text-muted">(max 10,000)</span>
        </div>
        <div className="text-sm text-muted mb-2">Found {primesInRange.length} primes:</div>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {primesInRange.slice(0, 500).map((p) => (
            <span key={p} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm font-mono">{p}</span>
          ))}
          {primesInRange.length > 500 && <span className="text-muted text-sm">...and {primesInRange.length - 500} more</span>}
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">About Prime Numbers</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
        </div>
        <p className="text-xs text-muted mt-3">
          The Fundamental Theorem of Arithmetic states that every integer greater than 1 can be uniquely represented as a product of prime numbers.
        </p>
      </div>
    </div>
  );
}
