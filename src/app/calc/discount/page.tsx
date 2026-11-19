'use client';

import { useState } from 'react';

export default function DiscountPage() {
  const [originalPrice, setOriginalPrice] = useState('100');
  const [discountPercent, setDiscountPercent] = useState('25');

  const price = parseFloat(originalPrice) || 0;
  const discount = parseFloat(discountPercent) || 0;
  const savings = price * (discount / 100);
  const salePrice = price - savings;

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const quickDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Discount Calculator</h1>
        <p className="text-muted">Calculate the sale price and savings for any discount percentage.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Original Price ($)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Discount (%)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="25"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickDiscounts.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscountPercent(d.toString())}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    discountPercent === d.toString() ? 'bg-primary text-white' : 'bg-background text-dark hover:bg-gray-100'
                  }`}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {price > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Sale Price</div>
              <div className="text-3xl font-bold font-mono text-green-700">${fmt(salePrice)}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">You Save</div>
              <div className="text-2xl font-bold font-mono text-red-600">${fmt(savings)}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">You Pay</div>
              <div className="text-2xl font-bold font-mono text-blue-700">{(100 - discount).toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Formula</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Sale Price = Original Price x (1 - Discount% / 100). Savings = Original Price x (Discount% / 100).
        </div>
      </div>
    </div>
  );
}
