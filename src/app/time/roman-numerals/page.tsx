'use client';

import { useState, useMemo } from 'react';
import {
  Hash,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ───────────────── conversion logic ───────────────── */

const ROMAN_VALUES: [string, number][] = [
  ['M\u0305', 1_000_000],
  ['D\u0305', 500_000],
  ['C\u0305', 100_000],
  ['L\u0305', 50_000],
  ['X\u0305', 10_000],
  ['V\u0305', 5_000],
  ['M', 1000],
  ['CM', 900],
  ['D', 500],
  ['CD', 400],
  ['C', 100],
  ['XC', 90],
  ['L', 50],
  ['XL', 40],
  ['X', 10],
  ['IX', 9],
  ['V', 5],
  ['IV', 4],
  ['I', 1],
];

function toRoman(num: number): string {
  if (num < 1 || num > 3_999_999) return '';
  let result = '';
  let remaining = num;
  for (const [symbol, value] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

// Parse map including overline chars
const PARSE_MAP: [string, number][] = [
  ['M\u0305', 1_000_000],
  ['D\u0305', 500_000],
  ['C\u0305M\u0305', 900_000],
  ['C\u0305', 100_000],
  ['L\u0305', 50_000],
  ['X\u0305L\u0305', 40_000],
  ['X\u0305', 10_000],
  ['V\u0305', 5_000],
  ['I\u0305V\u0305', 4_000],
  ['CM', 900],
  ['M', 1000],
  ['CD', 400],
  ['D', 500],
  ['XC', 90],
  ['C', 100],
  ['XL', 40],
  ['L', 50],
  ['IX', 9],
  ['X', 10],
  ['IV', 4],
  ['V', 5],
  ['I', 1],
];

function fromRoman(str: string): number | null {
  if (!str.trim()) return null;
  let s = str.toUpperCase().trim();
  let result = 0;
  for (const [symbol, value] of PARSE_MAP) {
    while (s.startsWith(symbol)) {
      result += value;
      s = s.slice(symbol.length);
    }
  }
  if (s.length > 0) return null; // invalid chars remain
  if (result < 1 || result > 3_999_999) return null;
  return result;
}

function dateToRoman(d: Date): string {
  const day = toRoman(d.getDate());
  const month = toRoman(d.getMonth() + 1);
  const year = toRoman(d.getFullYear());
  return `${day}.${month}.${year}`;
}

/* ───────────────── common values table ───────────────── */

const COMMON_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 40, 50, 60,
  70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000,
];

const RULES = [
  { symbol: 'I', value: 1 },
  { symbol: 'V', value: 5 },
  { symbol: 'X', value: 10 },
  { symbol: 'L', value: 50 },
  { symbol: 'C', value: 100 },
  { symbol: 'D', value: 500 },
  { symbol: 'M', value: 1000 },
];

/* ───────────────── component ───────────────── */

export default function RomanNumeralsPage() {
  const [numberInput, setNumberInput] = useState('');
  const [romanInput, setRomanInput] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showTable, setShowTable] = useState(false);

  const today = new Date();
  const currentYearRoman = toRoman(today.getFullYear());
  const todayRoman = dateToRoman(today);

  const numberToRomanResult = useMemo(() => {
    const n = parseInt(numberInput, 10);
    if (isNaN(n) || n < 1 || n > 3_999_999) return null;
    return toRoman(n);
  }, [numberInput]);

  const romanToNumberResult = useMemo(() => {
    return fromRoman(romanInput);
  }, [romanInput]);

  const birthYearRoman = useMemo(() => {
    if (!birthDate) return null;
    const year = new Date(birthDate).getFullYear();
    if (isNaN(year) || year < 1) return null;
    return { year, roman: toRoman(year) };
  }, [birthDate]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Hash className="w-4 h-4" />
            Number Systems
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-3">
            Roman Numeral Converter
          </h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-base sm:text-lg">
            Convert numbers to Roman numerals and back. Supports values from 1 to 3,999,999.
          </p>
        </div>

        {/* Current year prominent */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center mb-8">
          <p className="text-sm text-[#94A3B8] mb-2">Current Year</p>
          <p className="font-heading text-4xl sm:text-5xl font-bold text-[#E2E8F0] tracking-wider">
            {currentYearRoman}
          </p>
          <p className="text-[#94A3B8] mt-2 text-lg">{today.getFullYear()}</p>
          <div className="mt-4 pt-4 border-t border-[#1E293B]">
            <p className="text-sm text-[#94A3B8] mb-1">Today&apos;s Date in Roman Numerals</p>
            <p className="font-heading text-xl sm:text-2xl font-semibold text-secondary tracking-wider">
              {todayRoman}
            </p>
          </div>
        </div>

        {/* Converters side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Number → Roman */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
            <h2 className="font-heading font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              Number to Roman
            </h2>
            <input
              type="number"
              min={1}
              max={3999999}
              placeholder="Enter a number (1 - 3,999,999)"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              className="w-full bg-dark-bg border border-[#1E293B] rounded-lg px-4 py-3 text-[#E2E8F0] outline-none focus:border-primary/50 text-lg mb-3"
            />
            {numberToRomanResult ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary tracking-wider">
                  {numberToRomanResult}
                </p>
              </div>
            ) : numberInput ? (
              <p className="text-sm text-red-400">Enter a valid number between 1 and 3,999,999</p>
            ) : null}
          </div>

          {/* Roman → Number */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
            <h2 className="font-heading font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-secondary" />
              Roman to Number
            </h2>
            <input
              type="text"
              placeholder="Enter Roman numerals (e.g., MMXXVI)"
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
              className="w-full bg-dark-bg border border-[#1E293B] rounded-lg px-4 py-3 text-[#E2E8F0] outline-none focus:border-secondary/50 text-lg mb-3 font-mono tracking-wider"
            />
            {romanToNumberResult !== null ? (
              <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 text-center">
                <p className="font-heading text-2xl sm:text-3xl font-bold text-secondary">
                  {romanToNumberResult.toLocaleString()}
                </p>
              </div>
            ) : romanInput ? (
              <p className="text-sm text-red-400">Invalid Roman numeral</p>
            ) : null}
          </div>
        </div>

        <AdBanner />

        {/* Birth year */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 mb-8">
          <h2 className="font-heading font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Your Birth Year in Roman Numerals
          </h2>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-dark-bg border border-[#1E293B] rounded-lg px-4 py-3 text-[#E2E8F0] outline-none focus:border-primary/50 mb-3"
          />
          {birthYearRoman && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 text-center mt-2">
              <p className="text-sm text-[#94A3B8] mb-1">Born in {birthYearRoman.year}</p>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-yellow-400 tracking-wider">
                {birthYearRoman.roman}
              </p>
            </div>
          )}
        </div>

        {/* Rules */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 mb-8">
          <h2 className="font-heading font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-secondary" />
            Roman Numeral Rules
          </h2>

          {/* Basic symbols */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-5">
            {RULES.map((r) => (
              <div key={r.symbol} className="bg-dark-bg rounded-lg p-3 text-center border border-[#1E293B]">
                <p className="font-heading text-xl font-bold text-primary">{r.symbol}</p>
                <p className="text-xs text-[#94A3B8] mt-1">{r.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="text-sm text-[#94A3B8] space-y-2 leading-relaxed">
            <p>
              <span className="text-[#E2E8F0] font-medium">Additive principle:</span> Symbols are
              added together from left to right. <span className="text-primary font-mono">VII</span> = 5 + 1 + 1 = 7.
            </p>
            <p>
              <span className="text-[#E2E8F0] font-medium">Subtractive notation:</span> A smaller
              symbol before a larger one means subtraction.{' '}
              <span className="text-primary font-mono">IV</span> = 5 - 1 = 4,{' '}
              <span className="text-primary font-mono">IX</span> = 10 - 1 = 9,{' '}
              <span className="text-primary font-mono">XL</span> = 50 - 10 = 40,{' '}
              <span className="text-primary font-mono">XC</span> = 100 - 10 = 90,{' '}
              <span className="text-primary font-mono">CD</span> = 500 - 100 = 400,{' '}
              <span className="text-primary font-mono">CM</span> = 1000 - 100 = 900.
            </p>
            <p>
              <span className="text-[#E2E8F0] font-medium">Repetition:</span> A symbol can be
              repeated up to 3 times. <span className="text-primary font-mono">III</span> = 3 but 4
              is written as <span className="text-primary font-mono">IV</span>, not IIII.
            </p>
            <p>
              <span className="text-[#E2E8F0] font-medium">Extended notation:</span> For numbers
              above 3,999, an overline (vinculum) multiplies by 1,000. <span className="text-primary font-mono">V&#x0305;</span> = 5,000.
            </p>
          </div>
        </div>

        {/* Common values table */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden mb-8">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <h2 className="font-heading font-semibold text-[#E2E8F0] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Common Values Reference Table
            </h2>
            {showTable ? (
              <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            )}
          </button>
          {showTable && (
            <div className="border-t border-[#1E293B] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                    <th className="px-4 py-2 text-left">Number</th>
                    <th className="px-4 py-2 text-left">Roman Numeral</th>
                    <th className="px-4 py-2 text-left">Number</th>
                    <th className="px-4 py-2 text-left">Roman Numeral</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(COMMON_VALUES.length / 2) }, (_, i) => {
                    const left = COMMON_VALUES[i * 2];
                    const right = COMMON_VALUES[i * 2 + 1];
                    return (
                      <tr key={i} className="border-b border-[#1E293B]/50 hover:bg-white/[0.02]">
                        <td className="px-4 py-2 text-[#E2E8F0]">{left?.toLocaleString()}</td>
                        <td className="px-4 py-2 text-primary font-mono tracking-wider">
                          {left ? toRoman(left) : ''}
                        </td>
                        <td className="px-4 py-2 text-[#E2E8F0]">
                          {right ? right.toLocaleString() : ''}
                        </td>
                        <td className="px-4 py-2 text-primary font-mono tracking-wider">
                          {right ? toRoman(right) : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
