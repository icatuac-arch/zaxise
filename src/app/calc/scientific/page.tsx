'use client';

import { useState } from 'react';

export default function ScientificNotationPage() {
  const [decimal, setDecimal] = useState('123456789');
  const [coefficient, setCoefficient] = useState('1.23');
  const [exponent, setExponent] = useState('8');

  // Decimal to scientific
  const decNum = parseFloat(decimal);
  let sciCoeff = '';
  let sciExp = '';
  if (!isNaN(decNum) && decNum !== 0) {
    const exp = Math.floor(Math.log10(Math.abs(decNum)));
    const coeff = decNum / Math.pow(10, exp);
    sciCoeff = coeff.toPrecision(10).replace(/\.?0+$/, '');
    sciExp = exp.toString();
  } else if (decNum === 0) {
    sciCoeff = '0';
    sciExp = '0';
  }

  // Scientific to decimal
  const c = parseFloat(coefficient);
  const e = parseInt(exponent);
  let decResult = '';
  if (!isNaN(c) && !isNaN(e)) {
    const val = c * Math.pow(10, e);
    decResult = val.toLocaleString('en-US', { maximumFractionDigits: 20, useGrouping: false });
  }

  // Engineering notation (exponent is multiple of 3)
  let engCoeff = '';
  let engExp = '';
  if (!isNaN(decNum) && decNum !== 0) {
    const exp = Math.floor(Math.log10(Math.abs(decNum)));
    const engE = Math.floor(exp / 3) * 3;
    const engC = decNum / Math.pow(10, engE);
    engCoeff = engC.toPrecision(6).replace(/\.?0+$/, '');
    engExp = engE.toString();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Scientific Notation Converter</h1>
        <p className="text-muted">Convert between standard decimal numbers and scientific notation (a x 10^n).</p>
      </div>

      {/* Decimal to Scientific */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Decimal to Scientific Notation</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted mb-2">Enter a number</label>
            <input type="text" value={decimal} onChange={(e) => setDecimal(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="123456789" />
          </div>
          <span className="text-2xl font-bold text-muted pt-6">=</span>
          <div className="bg-primary/10 rounded-xl p-4 min-w-[200px]">
            <div className="text-2xl font-bold font-mono text-primary text-center">
              {sciCoeff && sciExp ? (
                <>{sciCoeff} x 10<sup>{sciExp}</sup></>
              ) : '—'}
            </div>
          </div>
        </div>
        {engCoeff && engExp && (
          <div className="mt-3 text-sm text-muted">
            Engineering notation: <span className="font-mono font-semibold">{engCoeff} x 10<sup>{engExp}</sup></span>
          </div>
        )}
      </div>

      {/* Scientific to Decimal */}
      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-dark mb-4">Scientific Notation to Decimal</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Coefficient</label>
            <input type="number" step="any" value={coefficient} onChange={(e) => setCoefficient(e.target.value)} className="w-28 px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
          </div>
          <span className="text-xl font-mono text-muted pt-6">x 10^</span>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Exponent</label>
            <input type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} className="w-20 px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
          </div>
          <span className="text-2xl font-bold text-muted pt-6">=</span>
          <div className="bg-green-50 rounded-xl p-4 min-w-[200px] mt-6">
            <div className="text-xl font-bold font-mono text-green-700 text-center break-all">
              {decResult || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">How It Works</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Scientific notation: a x 10^n where 1 &le; |a| &lt; 10. Move the decimal point until one non-zero digit remains before it; the exponent equals the number of places moved.
        </div>
      </div>
    </div>
  );
}
