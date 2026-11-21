'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import { MapPin, TrendingUp, DollarSign, Home, ArrowRight, AlertTriangle } from 'lucide-react';

interface StateData {
  name: string;
  avgHomePrice: number;
  propertyTaxRate: number;
  appreciationRate: number;
  medianIncome: number;
  costOfLivingIndex: number;
}

const STATE_DATA: Record<string, StateData> = {
  AL: { name: 'Alabama', avgHomePrice: 230000, propertyTaxRate: 0.41, appreciationRate: 4.2, medianIncome: 59000, costOfLivingIndex: 87 },
  AK: { name: 'Alaska', avgHomePrice: 370000, propertyTaxRate: 1.07, appreciationRate: 2.8, medianIncome: 77000, costOfLivingIndex: 127 },
  AZ: { name: 'Arizona', avgHomePrice: 415000, propertyTaxRate: 0.62, appreciationRate: 5.1, medianIncome: 72000, costOfLivingIndex: 103 },
  AR: { name: 'Arkansas', avgHomePrice: 205000, propertyTaxRate: 0.62, appreciationRate: 4.0, medianIncome: 54000, costOfLivingIndex: 84 },
  CA: { name: 'California', avgHomePrice: 785000, propertyTaxRate: 0.71, appreciationRate: 4.5, medianIncome: 91000, costOfLivingIndex: 142 },
  CO: { name: 'Colorado', avgHomePrice: 550000, propertyTaxRate: 0.51, appreciationRate: 4.8, medianIncome: 87000, costOfLivingIndex: 105 },
  CT: { name: 'Connecticut', avgHomePrice: 410000, propertyTaxRate: 2.15, appreciationRate: 3.5, medianIncome: 90000, costOfLivingIndex: 111 },
  DE: { name: 'Delaware', avgHomePrice: 370000, propertyTaxRate: 0.57, appreciationRate: 3.8, medianIncome: 75000, costOfLivingIndex: 102 },
  DC: { name: 'District of Columbia', avgHomePrice: 650000, propertyTaxRate: 0.56, appreciationRate: 3.2, medianIncome: 101000, costOfLivingIndex: 148 },
  FL: { name: 'Florida', avgHomePrice: 410000, propertyTaxRate: 0.86, appreciationRate: 5.5, medianIncome: 67000, costOfLivingIndex: 103 },
  GA: { name: 'Georgia', avgHomePrice: 350000, propertyTaxRate: 0.92, appreciationRate: 4.8, medianIncome: 71000, costOfLivingIndex: 93 },
  HI: { name: 'Hawaii', avgHomePrice: 835000, propertyTaxRate: 0.27, appreciationRate: 3.8, medianIncome: 88000, costOfLivingIndex: 193 },
  ID: { name: 'Idaho', avgHomePrice: 440000, propertyTaxRate: 0.63, appreciationRate: 5.8, medianIncome: 67000, costOfLivingIndex: 97 },
  IL: { name: 'Illinois', avgHomePrice: 275000, propertyTaxRate: 2.23, appreciationRate: 3.2, medianIncome: 78000, costOfLivingIndex: 93 },
  IN: { name: 'Indiana', avgHomePrice: 245000, propertyTaxRate: 0.85, appreciationRate: 4.5, medianIncome: 65000, costOfLivingIndex: 90 },
  IA: { name: 'Iowa', avgHomePrice: 220000, propertyTaxRate: 1.57, appreciationRate: 3.5, medianIncome: 68000, costOfLivingIndex: 89 },
  KS: { name: 'Kansas', avgHomePrice: 235000, propertyTaxRate: 1.43, appreciationRate: 3.8, medianIncome: 68000, costOfLivingIndex: 87 },
  KY: { name: 'Kentucky', avgHomePrice: 215000, propertyTaxRate: 0.86, appreciationRate: 4.2, medianIncome: 58000, costOfLivingIndex: 86 },
  LA: { name: 'Louisiana', avgHomePrice: 215000, propertyTaxRate: 0.55, appreciationRate: 3.0, medianIncome: 55000, costOfLivingIndex: 91 },
  ME: { name: 'Maine', avgHomePrice: 380000, propertyTaxRate: 1.36, appreciationRate: 5.2, medianIncome: 68000, costOfLivingIndex: 107 },
  MD: { name: 'Maryland', avgHomePrice: 420000, propertyTaxRate: 1.05, appreciationRate: 3.8, medianIncome: 94000, costOfLivingIndex: 112 },
  MA: { name: 'Massachusetts', avgHomePrice: 620000, propertyTaxRate: 1.20, appreciationRate: 4.2, medianIncome: 96000, costOfLivingIndex: 135 },
  MI: { name: 'Michigan', avgHomePrice: 250000, propertyTaxRate: 1.54, appreciationRate: 4.5, medianIncome: 66000, costOfLivingIndex: 89 },
  MN: { name: 'Minnesota', avgHomePrice: 350000, propertyTaxRate: 1.12, appreciationRate: 3.8, medianIncome: 84000, costOfLivingIndex: 98 },
  MS: { name: 'Mississippi', avgHomePrice: 185000, propertyTaxRate: 0.81, appreciationRate: 3.8, medianIncome: 49000, costOfLivingIndex: 84 },
  MO: { name: 'Missouri', avgHomePrice: 245000, propertyTaxRate: 0.97, appreciationRate: 4.0, medianIncome: 63000, costOfLivingIndex: 87 },
  MT: { name: 'Montana', avgHomePrice: 460000, propertyTaxRate: 0.74, appreciationRate: 5.5, medianIncome: 66000, costOfLivingIndex: 100 },
  NE: { name: 'Nebraska', avgHomePrice: 260000, propertyTaxRate: 1.73, appreciationRate: 3.5, medianIncome: 71000, costOfLivingIndex: 90 },
  NV: { name: 'Nevada', avgHomePrice: 430000, propertyTaxRate: 0.53, appreciationRate: 5.2, medianIncome: 69000, costOfLivingIndex: 104 },
  NH: { name: 'New Hampshire', avgHomePrice: 460000, propertyTaxRate: 2.09, appreciationRate: 4.8, medianIncome: 90000, costOfLivingIndex: 112 },
  NJ: { name: 'New Jersey', avgHomePrice: 510000, propertyTaxRate: 2.49, appreciationRate: 3.8, medianIncome: 97000, costOfLivingIndex: 120 },
  NM: { name: 'New Mexico', avgHomePrice: 305000, propertyTaxRate: 0.80, appreciationRate: 4.5, medianIncome: 58000, costOfLivingIndex: 92 },
  NY: { name: 'New York', avgHomePrice: 430000, propertyTaxRate: 1.72, appreciationRate: 3.5, medianIncome: 81000, costOfLivingIndex: 126 },
  NC: { name: 'North Carolina', avgHomePrice: 350000, propertyTaxRate: 0.84, appreciationRate: 5.0, medianIncome: 68000, costOfLivingIndex: 95 },
  ND: { name: 'North Dakota', avgHomePrice: 260000, propertyTaxRate: 0.98, appreciationRate: 2.5, medianIncome: 72000, costOfLivingIndex: 93 },
  OH: { name: 'Ohio', avgHomePrice: 230000, propertyTaxRate: 1.56, appreciationRate: 4.0, medianIncome: 64000, costOfLivingIndex: 89 },
  OK: { name: 'Oklahoma', avgHomePrice: 210000, propertyTaxRate: 0.90, appreciationRate: 3.5, medianIncome: 59000, costOfLivingIndex: 85 },
  OR: { name: 'Oregon', avgHomePrice: 510000, propertyTaxRate: 0.93, appreciationRate: 4.5, medianIncome: 76000, costOfLivingIndex: 113 },
  PA: { name: 'Pennsylvania', avgHomePrice: 290000, propertyTaxRate: 1.58, appreciationRate: 3.5, medianIncome: 73000, costOfLivingIndex: 96 },
  RI: { name: 'Rhode Island', avgHomePrice: 440000, propertyTaxRate: 1.53, appreciationRate: 4.5, medianIncome: 78000, costOfLivingIndex: 107 },
  SC: { name: 'South Carolina', avgHomePrice: 320000, propertyTaxRate: 0.57, appreciationRate: 5.2, medianIncome: 62000, costOfLivingIndex: 92 },
  SD: { name: 'South Dakota', avgHomePrice: 290000, propertyTaxRate: 1.22, appreciationRate: 3.5, medianIncome: 68000, costOfLivingIndex: 92 },
  TN: { name: 'Tennessee', avgHomePrice: 340000, propertyTaxRate: 0.71, appreciationRate: 4.8, medianIncome: 63000, costOfLivingIndex: 91 },
  TX: { name: 'Texas', avgHomePrice: 340000, propertyTaxRate: 1.80, appreciationRate: 4.0, medianIncome: 73000, costOfLivingIndex: 93 },
  UT: { name: 'Utah', avgHomePrice: 510000, propertyTaxRate: 0.58, appreciationRate: 5.5, medianIncome: 86000, costOfLivingIndex: 103 },
  VT: { name: 'Vermont', avgHomePrice: 380000, propertyTaxRate: 1.90, appreciationRate: 4.0, medianIncome: 72000, costOfLivingIndex: 110 },
  VA: { name: 'Virginia', avgHomePrice: 405000, propertyTaxRate: 0.82, appreciationRate: 4.0, medianIncome: 87000, costOfLivingIndex: 103 },
  WA: { name: 'Washington', avgHomePrice: 610000, propertyTaxRate: 0.92, appreciationRate: 4.8, medianIncome: 90000, costOfLivingIndex: 115 },
  WV: { name: 'West Virginia', avgHomePrice: 160000, propertyTaxRate: 0.58, appreciationRate: 3.0, medianIncome: 51000, costOfLivingIndex: 83 },
  WI: { name: 'Wisconsin', avgHomePrice: 280000, propertyTaxRate: 1.76, appreciationRate: 3.8, medianIncome: 72000, costOfLivingIndex: 93 },
  WY: { name: 'Wyoming', avgHomePrice: 330000, propertyTaxRate: 0.61, appreciationRate: 3.2, medianIncome: 70000, costOfLivingIndex: 95 },
};

const fmtDollar = (v: number) => '$' + v.toLocaleString('en-US');
const fmtPct = (v: number) => v.toFixed(2) + '%';

const NATIONAL_AVG_INCOME = 75000;
const NATIONAL_AVG_HOME_PRICE = 400000;

export default function LocalDataPage() {
  const [selectedState, setSelectedState] = useState('');

  const stateInfo = selectedState ? STATE_DATA[selectedState] : null;

  const affordability = useMemo(() => {
    if (!stateInfo) return null;
    // Price-to-income ratio
    const priceToIncome = stateInfo.avgHomePrice / stateInfo.medianIncome;
    const nationalPriceToIncome = NATIONAL_AVG_HOME_PRICE / NATIONAL_AVG_INCOME;
    const affordabilityScore = (nationalPriceToIncome / priceToIncome) * 100;

    // Monthly cost estimate (P&I at 6.5% for 30yr on 90% of avg price)
    const loanAmount = stateInfo.avgHomePrice * 0.9;
    const monthlyRate = 0.065 / 12;
    const n = 360;
    const factor = Math.pow(1 + monthlyRate, n);
    const monthlyPI = loanAmount * (monthlyRate * factor) / (factor - 1);
    const monthlyTax = (stateInfo.avgHomePrice * stateInfo.propertyTaxRate / 100) / 12;
    const monthlyInsurance = 175;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;
    const pctOfIncome = (totalMonthly / (stateInfo.medianIncome / 12)) * 100;

    let label: string;
    let color: string;
    if (affordabilityScore >= 110) { label = 'More Affordable'; color = 'text-secondary'; }
    else if (affordabilityScore >= 90) { label = 'Average'; color = 'text-primary'; }
    else { label = 'Less Affordable'; color = 'text-danger'; }

    return { priceToIncome, affordabilityScore, label, color, totalMonthly, pctOfIncome };
  }, [stateInfo]);

  const sortedStates = Object.entries(STATE_DATA).sort((a, b) => a[1].name.localeCompare(b[1].name));

  return (
    <div>
      {/* Header */}
      <div className="hero-section mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
            <MapPin className="w-4 h-4" />
            Local Market Data
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Housing Market by State
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Explore estimated housing market data for all 50 states plus DC. Select a state to see average home prices, tax rates, and affordability metrics.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

      {/* State Selector */}
      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md mb-8">
        <label className="block text-sm font-semibold text-dark mb-2">Select a State</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-4 py-3 border border-card-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Choose a state...</option>
          {sortedStates.map(([code, data]) => (
            <option key={code} value={code}>{data.name}</option>
          ))}
        </select>
      </div>

      {/* State Data Display */}
      {stateInfo && affordability && (
        <div className="space-y-6">
          {/* State Header */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">{stateInfo.name}</h2>
            <p className="text-white/70 text-sm mb-4">Estimated housing market overview</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/60">Avg. Home Price</p>
                <p className="text-xl font-bold">{fmtDollar(stateInfo.avgHomePrice)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Median Household Income</p>
                <p className="text-xl font-bold">{fmtDollar(stateInfo.medianIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Cost of Living Index</p>
                <p className="text-xl font-bold">{stateInfo.costOfLivingIndex}
                  <span className="text-sm font-normal text-white/60"> / 100 natl avg</span>
                </p>
              </div>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-dark">Average Home Price</h3>
              </div>
              <p className="text-2xl font-bold text-dark">{fmtDollar(stateInfo.avgHomePrice)}</p>
              <p className="text-xs text-muted mt-1">
                {stateInfo.avgHomePrice > NATIONAL_AVG_HOME_PRICE
                  ? `${fmtDollar(stateInfo.avgHomePrice - NATIONAL_AVG_HOME_PRICE)} above national avg (${fmtDollar(NATIONAL_AVG_HOME_PRICE)})`
                  : `${fmtDollar(NATIONAL_AVG_HOME_PRICE - stateInfo.avgHomePrice)} below national avg (${fmtDollar(NATIONAL_AVG_HOME_PRICE)})`
                }
              </p>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-dark">Property Tax Rate</h3>
              </div>
              <p className="text-2xl font-bold text-dark">{fmtPct(stateInfo.propertyTaxRate)}</p>
              <p className="text-xs text-muted mt-1">
                Annual tax on avg home: {fmtDollar(Math.round(stateInfo.avgHomePrice * stateInfo.propertyTaxRate / 100))}/yr
                ({fmtDollar(Math.round(stateInfo.avgHomePrice * stateInfo.propertyTaxRate / 100 / 12))}/mo)
              </p>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-dark">Appreciation Rate</h3>
              </div>
              <p className="text-2xl font-bold text-dark">{stateInfo.appreciationRate}%</p>
              <p className="text-xs text-muted mt-1">
                Avg annual home value growth. A {fmtDollar(stateInfo.avgHomePrice)} home could be worth {fmtDollar(Math.round(stateInfo.avgHomePrice * Math.pow(1 + stateInfo.appreciationRate / 100, 5)))} in 5 years.
              </p>
            </div>
          </div>

          {/* Affordability Comparison */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-dark mb-4">Affordability Comparison</h3>
            <p className="text-sm text-muted mb-4">
              Based on the median household income of {fmtDollar(stateInfo.medianIncome)} and an average home price of {fmtDollar(stateInfo.avgHomePrice)}:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">Price-to-Income Ratio</p>
                <p className="text-2xl font-bold text-dark">{affordability.priceToIncome.toFixed(1)}x</p>
                <p className="text-xs text-muted">National avg: {(NATIONAL_AVG_HOME_PRICE / NATIONAL_AVG_INCOME).toFixed(1)}x</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">Est. Monthly Cost</p>
                <p className="text-2xl font-bold text-dark">{fmtDollar(Math.round(affordability.totalMonthly))}</p>
                <p className="text-xs text-muted">P&I + tax + insurance (10% down)</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">% of Monthly Income</p>
                <p className={`text-2xl font-bold ${affordability.pctOfIncome > 36 ? 'text-danger' : affordability.pctOfIncome > 28 ? 'text-warning' : 'text-secondary'}`}>
                  {affordability.pctOfIncome.toFixed(0)}%
                </p>
                <p className="text-xs text-muted">Guideline: under 28% ideal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
              <div className={`text-sm font-bold ${affordability.color}`}>
                {affordability.label}
              </div>
              <p className="text-xs text-muted">
                {affordability.label === 'More Affordable'
                  ? 'Housing costs in this state are below the national average relative to income. This is a relatively affordable place to buy.'
                  : affordability.label === 'Average'
                  ? 'Housing costs in this state are roughly in line with the national average relative to income.'
                  : 'Housing costs in this state are above the national average relative to income. Consider a larger down payment or exploring nearby more affordable areas.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!stateInfo && (
        <div className="bg-card border border-card-border rounded-2xl p-10 shadow-md text-center">
          <MapPin className="w-12 h-12 text-card-border mx-auto mb-4" />
          <h3 className="text-lg font-bold text-dark mb-2">Select a State to Get Started</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Choose any state from the dropdown above to see average home prices, property tax rates, appreciation trends, and affordability metrics.
          </p>
        </div>
      )}

      <AdBanner />

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-card border border-card-border rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-dark mb-1">Data Disclaimer</h4>
            <p className="text-xs text-muted leading-relaxed">
              All figures shown are approximate estimates based on publicly available data and may not reflect current market conditions. Home prices, tax rates, and other metrics vary significantly within each state by city, county, and neighborhood. Always research your specific local market and consult with local real estate professionals for accurate, up-to-date information.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Rent vs Buy Calculator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/prequalify" className="btn-secondary inline-flex items-center gap-2">
            Pre-Qualification Estimator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
