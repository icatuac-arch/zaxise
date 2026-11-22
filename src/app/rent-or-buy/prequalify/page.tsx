'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import { DollarSign, AlertTriangle, CheckCircle, TrendingUp, Shield, ArrowRight } from 'lucide-react';

/* ─── Number to full English words ─── */
function numberToWords(n: number): string {
  if (isNaN(n) || n === 0) return '';
  const abs = Math.abs(n);

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
    if (num < 1_000_000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 1_000_000_000) return convert(Math.floor(num / 1_000_000)) + ' Million' + (num % 1_000_000 ? ' ' + convert(num % 1_000_000) : '');
    return convert(Math.floor(num / 1_000_000_000)) + ' Billion' + (num % 1_000_000_000 ? ' ' + convert(num % 1_000_000_000) : '');
  }

  return convert(Math.floor(abs));
}

function formatWithCommas(val: string): string {
  const raw = val.replace(/[^0-9.\-]/g, '');
  const parts = raw.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function stripCommas(val: string): string {
  return val.replace(/,/g, '');
}

const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ─── Reusable Input ─── */
function InputField({ label, value, onChange, prefix = '', suffix = '', hint = '' }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; hint?: string;
}) {
  const showWords = prefix === '$';
  const numVal = parseFloat(value) || 0;
  const wordsText = showWords && numVal > 0 ? `$${numberToWords(numVal)}` : '';

  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={formatWithCommas(value)}
          onChange={(e) => onChange(stripCommas(e.target.value))}
          className={`w-full ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} py-2.5 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">{suffix}</span>}
      </div>
      {wordsText && <p className="text-[10px] text-primary font-medium mt-0.5">{wordsText}</p>}
      {hint && <p className="text-[10px] text-muted/70 mt-0.5">{hint}</p>}
    </div>
  );
}

const CREDIT_SCORE_OPTIONS = [
  { label: 'Excellent (740+)', value: 'excellent', rate: 6.0 },
  { label: 'Good (700-739)', value: 'good', rate: 6.5 },
  { label: 'Fair (660-699)', value: 'fair', rate: 7.0 },
  { label: 'Below 660', value: 'below', rate: 7.5 },
];

const LOAN_TERMS = [15, 20, 25, 30];

export default function PrequalifyPage() {
  const [annualIncome, setAnnualIncome] = useState('85000');
  const [monthlyDebts, setMonthlyDebts] = useState('400');
  const [creditScore, setCreditScore] = useState('good');
  const [downPayment, setDownPayment] = useState('50000');
  const [loanTerm, setLoanTerm] = useState(30);

  const results = useMemo(() => {
    const income = parseFloat(annualIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const dp = parseFloat(downPayment) || 0;
    const scoreOption = CREDIT_SCORE_OPTIONS.find(o => o.value === creditScore) || CREDIT_SCORE_OPTIONS[1];
    const rate = scoreOption.rate / 100 / 12; // monthly rate
    const n = loanTerm * 12; // total payments

    // Front-end ratio: 28% of gross monthly income
    const monthlyIncome = income / 12;
    const frontEnd = monthlyIncome * 0.28;

    // Back-end ratio: 36% of gross monthly income minus existing debts
    const backEnd = monthlyIncome * 0.36 - debts;

    // Use the lower of the two
    const maxMonthlyPayment = Math.max(0, Math.min(frontEnd, backEnd));

    // Calculate max loan from max monthly payment using mortgage formula
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    // Solving for P: P = M * [(1+r)^n - 1] / [r(1+r)^n]
    let maxLoan = 0;
    if (rate > 0 && maxMonthlyPayment > 0) {
      const factor = Math.pow(1 + rate, n);
      maxLoan = maxMonthlyPayment * (factor - 1) / (rate * factor);
    } else if (rate === 0 && maxMonthlyPayment > 0) {
      maxLoan = maxMonthlyPayment * n;
    }

    const maxHomePrice = maxLoan + dp;

    // Actual monthly payment at max loan
    let estimatedPayment = 0;
    if (rate > 0 && maxLoan > 0) {
      const factor = Math.pow(1 + rate, n);
      estimatedPayment = maxLoan * (rate * factor) / (factor - 1);
    }

    // DTI ratios
    const totalMonthlyObligations = estimatedPayment + debts;
    const dtiRatio = monthlyIncome > 0 ? (totalMonthlyObligations / monthlyIncome) * 100 : 0;

    return {
      maxHomePrice: Math.round(maxHomePrice),
      maxLoan: Math.round(maxLoan),
      estimatedPayment: Math.round(estimatedPayment),
      estimatedRate: scoreOption.rate,
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      frontEnd: Math.round(frontEnd),
      backEnd: Math.round(backEnd),
      limitedBy: frontEnd <= backEnd ? 'front-end' : 'back-end',
      dtiRatio: Math.round(dtiRatio),
      monthlyIncome: Math.round(monthlyIncome),
      creditLabel: scoreOption.label,
      downPaymentAmount: dp,
    };
  }, [annualIncome, monthlyDebts, creditScore, downPayment, loanTerm]);

  const tips = useMemo(() => {
    const t: string[] = [];
    if (results.limitedBy === 'back-end') {
      t.push('Paying down existing debts would increase your qualification amount. Even reducing monthly debts by $200 could add $30,000+ to your max home price.');
    }
    if (creditScore === 'fair' || creditScore === 'below') {
      t.push('Improving your credit score could lower your interest rate significantly. A 1% rate decrease on a $300,000 loan saves over $60,000 in interest over 30 years.');
    }
    if ((parseFloat(downPayment) || 0) < results.maxHomePrice * 0.2) {
      t.push('Saving for a 20% down payment eliminates the need for private mortgage insurance (PMI), which typically costs 0.5-1% of your loan annually.');
    }
    t.push('Getting pre-approved by a lender gives you an exact number and makes your offers stronger to sellers.');
    return t;
  }, [results, creditScore, downPayment]);

  return (
    <div>
      {/* Header */}
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
            <DollarSign className="w-4 h-4" />
            Mortgage Pre-Qualification Estimator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            How Much Home Can You Afford?
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Get an instant estimate of how much mortgage you could qualify for based on your income, debts, and credit profile. This is the #1 question every first-time buyer has.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-bold text-dark mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Your Financial Profile
          </h2>

          <div className="space-y-4">
            <InputField
              label="Annual Household Income (before taxes)"
              value={annualIncome}
              onChange={setAnnualIncome}
              prefix="$"
              hint="Combined income if buying with a partner"
            />

            <InputField
              label="Monthly Debt Payments"
              value={monthlyDebts}
              onChange={setMonthlyDebts}
              prefix="$"
              hint="Car loans, student loans, credit card minimums, etc."
            />

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Credit Score Range</label>
              <select
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                className="w-full px-3 py-2.5 border border-card-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CREDIT_SCORE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label} - Est. {opt.rate}% rate</option>
                ))}
              </select>
              {(creditScore === 'fair' || creditScore === 'below') && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-warning/10 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-muted">A lower credit score means a higher interest rate, which significantly increases your total cost. Consider improving your score before buying.</p>
                </div>
              )}
            </div>

            <InputField
              label="Down Payment Available"
              value={downPayment}
              onChange={setDownPayment}
              prefix="$"
              hint="How much you have saved for a down payment"
            />

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Desired Loan Term</label>
              <div className="flex gap-2">
                {LOAN_TERMS.map(term => (
                  <button
                    key={term}
                    onClick={() => setLoanTerm(term)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                      loanTerm === term
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card text-muted border-card-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {term}yr
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Hero Result */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-white/80 mb-1">You could qualify for up to</p>
            <p className="text-4xl sm:text-5xl font-bold mb-1">
              ${fmtInt(results.maxHomePrice)}
            </p>
            {results.maxHomePrice > 0 && (
              <p className="text-sm text-white/70">{numberToWords(results.maxHomePrice)} dollars</p>
            )}
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/60">Max Loan Amount</p>
                <p className="text-lg font-bold">${fmtInt(results.maxLoan)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Down Payment</p>
                <p className="text-lg font-bold">${fmtInt(results.downPaymentAmount)}</p>
              </div>
            </div>
          </div>

          {/* Monthly Payment Breakdown */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Monthly Payment Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Estimated Monthly Payment</span>
                <span className="text-xl font-bold text-dark">${fmtInt(results.estimatedPayment)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Estimated Interest Rate</span>
                <span className="font-semibold text-dark">{results.estimatedRate}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Loan Term</span>
                <span className="font-semibold text-dark">{loanTerm} years</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Credit Score</span>
                <span className="font-semibold text-dark">{results.creditLabel}</span>
              </div>
              <hr className="border-card-border" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Gross Monthly Income</span>
                <span className="font-semibold text-dark">${fmtInt(results.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Front-End Limit (28% of income)</span>
                <span className="font-semibold text-dark">${fmtInt(results.frontEnd)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Back-End Limit (36% minus debts)</span>
                <span className="font-semibold text-dark">${fmtInt(results.backEnd)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Limiting Factor</span>
                <span className="font-semibold text-primary">
                  {results.limitedBy === 'front-end' ? 'Housing ratio (28%)' : 'Debt-to-income ratio (36%)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Estimated DTI Ratio</span>
                <span className={`font-semibold ${results.dtiRatio > 36 ? 'text-danger' : results.dtiRatio > 28 ? 'text-warning' : 'text-secondary'}`}>
                  {results.dtiRatio}%
                </span>
              </div>
            </div>
          </div>

          {/* Tips to Increase Qualification */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              Tips to Increase Your Qualification
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-card border border-card-border rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-dark mb-1">Important Disclaimer</h4>
            <p className="text-xs text-muted leading-relaxed">
              This is a rough estimate for educational purposes only. It does not include property taxes, homeowner&apos;s insurance, HOA fees, or PMI, which will reduce your actual buying power. Actual pre-approval requires a lender to review your full financial picture including credit history, employment verification, assets, and more. Interest rates shown are approximate and change daily. Always get pre-approved by a licensed mortgage lender before making offers on homes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted mb-3">Ready to see the full picture?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Rent vs Buy Calculator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/rent-or-buy/checklist" className="btn-secondary inline-flex items-center gap-2">
            Home Buying Checklist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
