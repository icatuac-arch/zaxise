'use client';

import { useState } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(num, den);
  const sign = den < 0 ? -1 : 1;
  return [sign * num / g, sign * den / g];
}

export default function FractionPage() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('3');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('4');
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('/');

  // Simplify section
  const [simpNum, setSimpNum] = useState('12');
  const [simpDen, setSimpDen] = useState('18');

  const n1 = parseInt(num1) || 0;
  const d1 = parseInt(den1) || 1;
  const n2 = parseInt(num2) || 0;
  const d2 = parseInt(den2) || 1;

  let resultNum = 0;
  let resultDen = 1;

  switch (op) {
    case '+': resultNum = n1 * d2 + n2 * d1; resultDen = d1 * d2; break;
    case '-': resultNum = n1 * d2 - n2 * d1; resultDen = d1 * d2; break;
    case '*': resultNum = n1 * n2; resultDen = d1 * d2; break;
    case '/': resultNum = n1 * d2; resultDen = d1 * n2; break;
  }

  const [simpResultNum, simpResultDen] = resultDen !== 0 ? simplify(resultNum, resultDen) : [0, 0];
  const decimal = resultDen !== 0 ? (resultNum / resultDen) : 0;

  // Simplify standalone
  const sn = parseInt(simpNum) || 0;
  const sd = parseInt(simpDen) || 1;
  const [simplifiedNum, simplifiedDen] = simplify(sn, sd);

  const ops = [
    { label: '+', value: '+' as const },
    { label: '-', value: '-' as const },
    { label: 'x', value: '*' as const },
    { label: '/', value: '/' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Fraction Calculator</h1>
        <p className="text-muted">Add, subtract, multiply, and divide fractions. Results are automatically simplified.</p>
      </div>

      {/* Calculator */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Fraction Arithmetic</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center gap-1">
            <input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="w-16 h-px bg-dark"></div>
            <input type="number" value={den1} onChange={(e) => setDen1(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {/* Operation */}
          <div className="flex gap-1">
            {ops.map((o) => (
              <button key={o.value} onClick={() => setOp(o.value)} className={`w-10 h-10 rounded-lg text-lg font-bold transition-colors ${op === o.value ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'}`}>
                {o.label}
              </button>
            ))}
          </div>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center gap-1">
            <input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="w-16 h-px bg-dark"></div>
            <input type="number" value={den2} onChange={(e) => setDen2(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <span className="text-2xl font-bold text-muted">=</span>

          {/* Result */}
          <div className="flex flex-col items-center gap-1 bg-primary/10 rounded-xl p-3 min-w-[100px]">
            <div className="text-2xl font-bold font-mono text-primary">{simpResultNum}</div>
            {simpResultDen !== 1 && simpResultDen !== 0 && (
              <>
                <div className="w-12 h-px bg-primary"></div>
                <div className="text-2xl font-bold font-mono text-primary">{simpResultDen}</div>
              </>
            )}
            <div className="text-xs text-muted mt-1">= {decimal.toFixed(6).replace(/\.?0+$/, '')}</div>
          </div>
        </div>
      </div>

      {/* Simplify */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-dark mb-4">Simplify a Fraction</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <input type="number" value={simpNum} onChange={(e) => setSimpNum(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="w-16 h-px bg-dark"></div>
            <input type="number" value={simpDen} onChange={(e) => setSimpDen(e.target.value)} className="w-20 px-3 py-2 border border-card-border rounded-lg text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <span className="text-2xl font-bold text-muted">=</span>
          <div className="flex flex-col items-center gap-1 bg-green-50 rounded-xl p-3 min-w-[80px]">
            <div className="text-2xl font-bold font-mono text-green-700">{simplifiedNum}</div>
            {simplifiedDen !== 1 && (
              <>
                <div className="w-12 h-px bg-green-700"></div>
                <div className="text-2xl font-bold font-mono text-green-700">{simplifiedDen}</div>
              </>
            )}
          </div>
          <div className="text-sm text-muted">GCD = {gcd(sn, sd)}</div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formulas</h2>
        <div className="space-y-2">
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Add: a/b + c/d = (ad + bc) / bd</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Subtract: a/b - c/d = (ad - bc) / bd</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Multiply: a/b x c/d = ac / bd</div>
          <div className="bg-background rounded-lg p-3 font-mono text-sm text-dark-light">Divide: a/b / c/d = ad / bc</div>
        </div>
      </div>
    </div>
  );
}
