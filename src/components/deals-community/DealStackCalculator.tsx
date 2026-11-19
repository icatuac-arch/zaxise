'use client';

import { useState } from 'react';
import { Check, Square } from 'lucide-react';

interface StackOption {
  type: string;
  savings: string;
}

interface DealStackCalculatorProps {
  stackable: StackOption[];
  salePrice: number;
}

function parseSavings(savings: string, basePrice: number): number {
  const trimmed = savings.trim();
  if (trimmed.endsWith('%')) {
    const pct = parseFloat(trimmed.replace('%', ''));
    return Math.round(basePrice * (pct / 100) * 100) / 100;
  }
  if (trimmed.startsWith('$')) {
    return parseFloat(trimmed.replace('$', ''));
  }
  return parseFloat(trimmed) || 0;
}

function getStackIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('coupon') || t.includes('code')) return '🏷️';
  if (t.includes('credit') || t.includes('card') || t.includes('cashback')) return '💳';
  if (t.includes('student')) return '🎓';
  if (t.includes('military')) return '🎖️';
  if (t.includes('loyalty') || t.includes('points') || t.includes('rewards')) return '⭐';
  if (t.includes('birthday')) return '🎂';
  if (t.includes('referral')) return '🤝';
  if (t.includes('app') || t.includes('mobile')) return '📱';
  return '💰';
}

export default function DealStackCalculator({ stackable, salePrice }: DealStackCalculatorProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set(stackable.map((_, i) => i)));

  if (!stackable || stackable.length === 0) return null;

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  let runningPrice = salePrice;
  const breakdowns = stackable.map((s, i) => {
    const amount = parseSavings(s.savings, runningPrice);
    const isActive = selected.has(i);
    if (isActive) {
      runningPrice = Math.max(0, runningPrice - amount);
    }
    return { ...s, amount, isActive };
  });

  const totalSaved = salePrice - runningPrice;

  return (
    <div className="bg-white border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-heading text-lg font-bold flex items-center gap-2">
          <span className="text-lg">🧮</span> Deal Stack Calculator
        </h3>
        <span className="text-text-muted text-xs">Check all that apply to you</span>
      </div>

      <div className="space-y-2">
        {breakdowns.map((item, index) => (
          <button
            key={index}
            onClick={() => toggle(index)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
              item.isActive
                ? 'border-deal-green/30 bg-green-50/50'
                : 'border-card-border bg-white hover:bg-alt-bg'
            }`}
          >
            {/* Checkbox */}
            <span className="shrink-0">
              {item.isActive ? (
                <span className="w-5 h-5 bg-deal-green text-white rounded flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              ) : (
                <Square className="w-5 h-5 text-text-muted" />
              )}
            </span>

            {/* Icon */}
            <span className="text-lg shrink-0">{getStackIcon(item.type)}</span>

            {/* Description */}
            <div className="flex-1 min-w-0">
              <p className="text-text-heading text-sm font-semibold">{item.type}</p>
              <p className="text-text-muted text-xs">{item.savings} off</p>
            </div>

            {/* Amount */}
            <span className={`text-sm font-bold shrink-0 ${item.isActive ? 'text-deal-green' : 'text-text-muted'}`}>
              -${item.amount.toFixed(2)}
            </span>
          </button>
        ))}
      </div>

      {/* Final price */}
      <div className="mt-6 pt-4 border-t border-card-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wide">Your Real Price</p>
            <p className="text-text-muted text-xs mt-0.5">
              After stacking {selected.size} saving{selected.size !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-deal-green text-3xl font-extrabold">${runningPrice.toFixed(2)}</p>
            {totalSaved > 0 && (
              <p className="text-deal-green text-xs font-bold mt-0.5">
                You save an extra ${totalSaved.toFixed(2)}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
