'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import {
  Home, DollarSign, TrendingUp, Shield, Calculator,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, XCircle, AlertTriangle,
  PiggyBank, BarChart3, Clock, Scale
} from 'lucide-react';

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

/* ─── Reusable Input ─── */
function InputField({ label, value, onChange, step = '1', prefix = '', suffix = '', hint = '', readOnly = false }: {
  label: string; value: string; onChange?: (v: string) => void; step?: string; prefix?: string; suffix?: string; hint?: string; readOnly?: boolean;
}) {
  const showWords = prefix === '$' && !readOnly;
  const numVal = parseFloat(value) || 0;
  const wordsText = showWords && numVal > 0 ? `${prefix === '$' ? '$' : ''}${numberToWords(numVal)}` : '';

  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          step={step}
          value={formatWithCommas(value)}
          readOnly={readOnly}
          onChange={(e) => onChange?.(stripCommas(e.target.value))}
          className={`w-full ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} py-2.5 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card ${readOnly ? 'bg-background cursor-not-allowed' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">{suffix}</span>}
      </div>
      {wordsText && <p className="text-[10px] text-primary font-medium mt-0.5">{wordsText}</p>}
      {hint && <p className="text-[10px] text-muted/70 mt-0.5">{hint}</p>}
    </div>
  );
}

function StepHeader({ step, total, icon: Icon, title, subtitle, type = 'input' }: { step: number; total: number; icon: any; title: string; subtitle?: string; type?: 'input' | 'result' }) {
  const isResult = type === 'result';
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${isResult ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-4 h-4" />
          {isResult ? `📊 Result ${step} of ${total}` : `📝 Step ${step} of ${total}`}
        </div>
        {!isResult && (
          <div className="flex-1 flex items-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-card-border'}`} />
            ))}
          </div>
        )}
      </div>
      <h2 className={`font-bold text-dark flex items-center gap-2 ${isResult ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
        {title}
      </h2>
      {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

/* ─── Format helpers ─── */
const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function RentOrBuyPage() {
  /* ═══════ SECTION 1: Your Situation ═══════ */
  const [annualIncome, setAnnualIncome] = useState('120000');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [currentRent, setCurrentRent] = useState('2500');
  const [filingStatus, setFilingStatus] = useState('single');
  const [taxBracket, setTaxBracket] = useState('30');
  const [yearsToStay, setYearsToStay] = useState(7);

  /* ═══════ SECTION 2: Home Details ═══════ */
  const [purchasePrice, setPurchasePrice] = useState('500000');
  const [downPayment, setDownPayment] = useState('100000');
  const [downMode, setDownMode] = useState<'$' | '%'>('$');
  const [loanRate, setLoanRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.1');
  const [homeInsurance, setHomeInsurance] = useState('175');
  const [hoaFee, setHoaFee] = useState('0');
  const [maintenanceCost, setMaintenanceCost] = useState('200');
  const [pmiRate, setPmiRate] = useState('0.5');

  /* ═══════ SECTION 3: Renting Scenario ═══════ */
  const [rentIncrease, setRentIncrease] = useState('3');
  const [renterInsurance, setRenterInsurance] = useState('25');

  /* ═══════ SECTION 4: Investment Assumptions ═══════ */
  const [homeAppreciation, setHomeAppreciation] = useState('3');
  const [investmentReturn, setInvestmentReturn] = useState('7');
  const [buyClosingCostPct, setBuyClosingCostPct] = useState('3');
  const [sellClosingCostPct, setSellClosingCostPct] = useState('6');

  /* ═══════ UI State ═══════ */
  const [showAmort, setShowAmort] = useState(false);
  const [showFirstTimerNote, setShowFirstTimerNote] = useState(false);
  const [showSPCalc, setShowSPCalc] = useState(false);
  const [showAllAmort, setShowAllAmort] = useState(false);

  // Advanced inputs
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEmergencyCheck, setShowEmergencyCheck] = useState(false);
  const [useItemizedDeductions, setUseItemizedDeductions] = useState('auto'); // 'auto' | 'yes' | 'no'
  const [propertyTaxIncreaseRate, setPropertyTaxIncreaseRate] = useState('2');
  const [insuranceIncreaseRate, setInsuranceIncreaseRate] = useState('3');
  const [movingCosts, setMovingCosts] = useState('5000');
  const [initialRepairs, setInitialRepairs] = useState('5000');
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState('0');
  const [mortgagePoints, setMortgagePoints] = useState('0');
  const [roomRentalIncome, setRoomRentalIncome] = useState('0');
  const [totalSavings, setTotalSavings] = useState('');

  // Saved scenarios for comparison
  const [savedScenarios, setSavedScenarios] = useState<Array<{
    name: string; verdict: string; wealthDiff: number; monthlyBuy: number; monthlyRent: number;
    inputs: { purchasePrice: string; downPayment: string; downMode: '$' | '%'; loanRate: string; loanTerm: string; annualIncome: string; monthlyDebts: string; currentRent: string; taxBracket: string; yearsToStay: number; propertyTaxRate: string; homeInsurance: string; hoaFee: string; maintenanceCost: string; pmiRate: string; rentIncrease: string; renterInsurance: string; homeAppreciation: string; investmentReturn: string; buyClosingCostPct: string; sellClosingCostPct: string; extraMonthlyPayment: string; mortgagePoints: string; roomRentalIncome: string; movingCosts: string; initialRepairs: string; filingStatus: string; useItemizedDeductions: string; propertyTaxIncreaseRate: string; insuranceIncreaseRate: string; };
  }>>([]);

  /* ═══════ Derived Values ═══════ */
  const price = parseFloat(purchasePrice) || 0;
  const downRaw = parseFloat(downPayment) || 0;
  const down = downMode === '%' ? (price * downRaw / 100) : downRaw;
  const downPct = price > 0 ? (down / price * 100) : 0;
  const loanAmount = Math.max(0, price - down);
  const standardDeduction = filingStatus === 'married' ? 29200 : 14600;

  /* ═══════ MAIN CALCULATIONS ═══════ */
  const calcs = useMemo(() => {
    const points = parseFloat(mortgagePoints) || 0;
    const baseRate = (parseFloat(loanRate) || 0) / 100;
    const adjustedRate = Math.max(0, baseRate - (points * 0.25 / 100));
    const r = adjustedRate / 12;
    const n = (parseFloat(loanTerm) || 30) * 12;
    const taxRatePct = (parseFloat(propertyTaxRate) || 0) / 100;
    const insurance = parseFloat(homeInsurance) || 0;
    const pmi = (parseFloat(pmiRate) || 0) / 100;
    const bracket = (parseFloat(taxBracket) || 0) / 100;
    const income = parseFloat(annualIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const rent = parseFloat(currentRent) || 0;
    const hoa = parseFloat(hoaFee) || 0;
    const maintenance = parseFloat(maintenanceCost) || 0;
    const rentIncPct = (parseFloat(rentIncrease) || 0) / 100;
    const renterIns = parseFloat(renterInsurance) || 0;
    const homeApprPct = (parseFloat(homeAppreciation) || 0) / 100;
    const investReturnPct = (parseFloat(investmentReturn) || 0) / 100;
    const buyClosing = (parseFloat(buyClosingCostPct) || 0) / 100;
    const sellClosing = (parseFloat(sellClosingCostPct) || 0) / 100;
    const stayYears = yearsToStay;
    const extraPayment = parseFloat(extraMonthlyPayment) || 0;
    const roomRental = parseFloat(roomRentalIncome) || 0;
    const propTaxIncRate = (parseFloat(propertyTaxIncreaseRate) || 0) / 100;
    const insIncRate = (parseFloat(insuranceIncreaseRate) || 0) / 100;
    const movingCost = parseFloat(movingCosts) || 0;
    const repairCost = parseFloat(initialRepairs) || 0;
    const pointsCost = points * loanAmount * 0.01;

    /* Monthly mortgage payment */
    const calcPayment = (principal: number, monthlyRate: number, months: number) => {
      if (principal <= 0 || months <= 0) return 0;
      if (monthlyRate === 0) return principal / months;
      return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    };

    const monthlyPayment = calcPayment(loanAmount, r, n);
    const monthlyTax = price * taxRatePct / 12;
    const monthlyPMI = downPct < 20 ? (loanAmount * pmi / 12) : 0;

    /* Monthly cost breakdown (first month) */
    const firstInterest = loanAmount * r;
    const firstPrincipal = monthlyPayment - firstInterest;
    const totalMonthlyBuyPreTax = monthlyPayment + monthlyTax + insurance + monthlyPMI + hoa + maintenance - roomRental;

    /* Standard deduction / itemization logic */
    const annualMortgageInterest = firstInterest * 12; // approximate first-year interest
    const annualPropertyTax = monthlyTax * 12;
    const annualDeductible = annualMortgageInterest + annualPropertyTax;
    const wouldItemize = annualDeductible > standardDeduction;

    let deductible: number;
    let taxSavings: number;
    if (useItemizedDeductions === 'no') {
      deductible = 0;
      taxSavings = 0;
    } else if (useItemizedDeductions === 'yes') {
      deductible = firstInterest + monthlyTax;
      taxSavings = deductible * bracket;
    } else {
      // auto: only benefit from excess above standard deduction
      if (wouldItemize) {
        deductible = firstInterest + monthlyTax;
        taxSavings = deductible * bracket;
      } else {
        // The benefit is only the excess above standard deduction (monthly)
        const excessAnnual = Math.max(0, annualDeductible - standardDeduction);
        taxSavings = (excessAnnual / 12) * bracket;
        deductible = excessAnnual / 12;
      }
    }

    const totalMonthlyBuyAfterTax = totalMonthlyBuyPreTax - taxSavings;
    const totalMonthlyRent = rent + renterIns;

    /* Affordability ratios */
    const monthlyIncome = income / 12;
    const frontEnd = monthlyIncome > 0 ? ((totalMonthlyBuyPreTax + roomRental) / monthlyIncome) * 100 : 0; // use pre-rental for affordability
    const backEnd = monthlyIncome > 0 ? (((totalMonthlyBuyPreTax + roomRental) + debts) / monthlyIncome) * 100 : 0;

    /* Buying closing costs */
    const buyClosingCost = price * buyClosing + pointsCost;
    const movingAndRepairs = movingCost + repairCost;

    /* ─── Amortization schedule (without extra payments) ─── */
    const scheduleNoExtra: Array<{
      month: number;
      payment: number; principal: number; interest: number; balance: number;
      cumulativeInterest: number; cumulativePrincipal: number;
    }> = [];

    let balNoExtra = loanAmount;
    let cumInterestNoExtra = 0;

    for (let m = 1; m <= n; m++) {
      const int = balNoExtra > 0 ? balNoExtra * r : 0;
      const prin = balNoExtra > 0 ? monthlyPayment - int : 0;
      balNoExtra = Math.max(0, balNoExtra - prin);
      cumInterestNoExtra += int;
      scheduleNoExtra.push({ month: m, payment: monthlyPayment, principal: prin, interest: int, balance: balNoExtra, cumulativeInterest: cumInterestNoExtra, cumulativePrincipal: 0 });
    }
    const totalInterestNoExtra = cumInterestNoExtra;

    /* ─── Amortization schedule (with extra payments) ─── */
    const schedule: Array<{
      month: number;
      payment: number; principal: number; interest: number; balance: number;
      cumulativeInterest: number; cumulativePrincipal: number;
    }> = [];

    let bal = loanAmount;
    let cumInterest = 0;
    let cumPrincipal = 0;
    let payoffMonth = n;

    for (let m = 1; m <= n; m++) {
      if (bal <= 0) break;
      const int = bal * r;
      let prin = monthlyPayment - int + extraPayment;
      if (prin > bal) prin = bal;
      bal = Math.max(0, bal - prin);
      cumInterest += int;
      cumPrincipal += prin;

      schedule.push({
        month: m,
        payment: monthlyPayment + Math.min(extraPayment, prin),
        principal: prin, interest: int, balance: bal,
        cumulativeInterest: cumInterest, cumulativePrincipal: cumPrincipal,
      });

      if (bal <= 0 && payoffMonth === n) {
        payoffMonth = m;
      }
    }

    const extraPaymentInterestSaved = extraPayment > 0 ? Math.max(0, totalInterestNoExtra - cumInterest) : 0;
    const extraPaymentMonthsSaved = extraPayment > 0 ? Math.max(0, n - payoffMonth) : 0;

    /* ─── Year-by-year wealth comparison ─── */
    const yearlyComparison: Array<{
      year: number;
      rentThisYear: number;
      mortgageThisYear: number;
      totalSpentRenting: number;
      totalSpentBuying: number;
      homeValue: number;
      homeEquity: number;
      investmentPortfolio: number;
      investmentPortfolioNoInvest: number;
      netWorthBuy: number;
      netWorthBuyAfterTax: number;
      netWorthRent: number;
      netWorthRentAfterTax: number;
      netWorthRentNoInvest: number;
      capGainsTaxBuy: number;
      capGainsTaxRent: number;
      buyWins: boolean;
      buyWinsNoInvest: boolean;
    }> = [];

    let cumRent = 0;
    let cumBuy = buyClosingCost + movingAndRepairs;
    let investPortfolio = 0;
    let investContributions = 0; // track cost basis for cap gains
    let savingsNoInvest = 0; // just cash savings, no market returns
    let crossoverYear = 0;
    const monthlyReturnRate = investReturnPct / 12;
    const longTermCapGainsRate = bracket >= 0.32 ? 0.20 : bracket >= 0.22 ? 0.15 : 0;
    const homeExclusionAmount = 250000; // $250k single / $500k married exclusion on home sale

    for (let yr = 1; yr <= Math.min(stayYears, 30); yr++) {
      /* Renting costs for this year */
      const thisYearRent = rent * Math.pow(1 + rentIncPct, yr - 1);
      const yearRentCost = (thisYearRent + renterIns) * 12;
      cumRent += yearRentCost;

      /* Buying costs for this year (mortgage is FIXED, but tax & insurance increase) */
      let yearBuyCost = 0;
      const startMonth = (yr - 1) * 12;
      const endMonth = Math.min(yr * 12, schedule.length);
      const yearlyMonthlyTax = monthlyTax * Math.pow(1 + propTaxIncRate, yr - 1);
      const yearlyInsurance = insurance * Math.pow(1 + insIncRate, yr - 1);
      for (let m = startMonth; m < endMonth; m++) {
        const mPMI = downPct < 20 && schedule[m] && (schedule[m].balance / price > 0.80) ? (loanAmount * pmi / 12) : 0;
        yearBuyCost += (schedule[m] ? schedule[m].payment : 0) + yearlyMonthlyTax + yearlyInsurance + mPMI + hoa + maintenance - roomRental;
      }
      let yearInterest = 0;
      for (let m = startMonth; m < endMonth; m++) {
        if (schedule[m]) yearInterest += schedule[m].interest;
      }

      /* Apply itemization logic for yearly tax savings */
      let yearTaxSavings: number;
      const yearAnnualDeductible = yearInterest + yearlyMonthlyTax * 12;
      if (useItemizedDeductions === 'no') {
        yearTaxSavings = 0;
      } else if (useItemizedDeductions === 'yes') {
        yearTaxSavings = yearAnnualDeductible * bracket;
      } else {
        // auto
        if (yearAnnualDeductible > standardDeduction) {
          yearTaxSavings = yearAnnualDeductible * bracket;
        } else {
          yearTaxSavings = Math.max(0, yearAnnualDeductible - standardDeduction) * bracket;
        }
      }

      yearBuyCost -= yearTaxSavings;
      cumBuy += yearBuyCost;

      /* Home equity & value */
      const homeValue = price * Math.pow(1 + homeApprPct, yr);
      const remainingBalance = endMonth <= schedule.length && endMonth > 0 ? schedule[endMonth - 1].balance : 0;
      const equity = homeValue - remainingBalance;

      /* Renter investment portfolio (invest the difference) */
      const monthlyBuyCostThisYear = yearBuyCost / 12;
      const monthlyRentCostThisYear = yearRentCost / 12;
      const monthlySurplus = monthlyBuyCostThisYear > monthlyRentCostThisYear ? (monthlyBuyCostThisYear - monthlyRentCostThisYear) : 0;

      if (yr === 1) {
        investPortfolio = (down + buyClosingCost + movingAndRepairs);
        investContributions = (down + buyClosingCost + movingAndRepairs);
        savingsNoInvest = (down + buyClosingCost + movingAndRepairs);
        for (let m = 0; m < 12; m++) {
          investPortfolio = investPortfolio * (1 + monthlyReturnRate) + monthlySurplus;
          investContributions += monthlySurplus;
          savingsNoInvest += monthlySurplus;
        }
      } else {
        for (let m = 0; m < 12; m++) {
          investPortfolio = investPortfolio * (1 + monthlyReturnRate) + monthlySurplus;
          investContributions += monthlySurplus;
          savingsNoInvest += monthlySurplus;
        }
      }

      /* Capital gains tax on home sale */
      const homeGain = homeValue - price;
      const taxableHomeGain = Math.max(0, homeGain - homeExclusionAmount);
      const capGainsTaxBuy = taxableHomeGain * longTermCapGainsRate;

      /* Capital gains tax on selling investments */
      const investGain = Math.max(0, investPortfolio - investContributions);
      const capGainsTaxRent = investGain * longTermCapGainsRate;

      /* Net worth comparison — AFTER all taxes */
      const sellCosts = homeValue * sellClosing;
      const netWorthBuy = equity - sellCosts;
      const netWorthBuyAfterTax = netWorthBuy - capGainsTaxBuy;
      const netWorthRent = investPortfolio;
      const netWorthRentAfterTax = investPortfolio - capGainsTaxRent;
      const netWorthRentNoInvest = savingsNoInvest;
      const buyWins = netWorthBuyAfterTax > netWorthRentAfterTax;
      const buyWinsNoInvest = netWorthBuyAfterTax > netWorthRentNoInvest;

      if (buyWins && crossoverYear === 0) {
        crossoverYear = yr;
      }

      yearlyComparison.push({
        year: yr,
        rentThisYear: thisYearRent,
        mortgageThisYear: monthlyPayment,
        totalSpentRenting: cumRent,
        totalSpentBuying: cumBuy,
        homeValue,
        homeEquity: equity,
        investmentPortfolio: investPortfolio,
        investmentPortfolioNoInvest: savingsNoInvest,
        netWorthBuy,
        netWorthBuyAfterTax,
        netWorthRent,
        netWorthRentAfterTax,
        netWorthRentNoInvest,
        capGainsTaxBuy,
        capGainsTaxRent,
        buyWins,
        buyWinsNoInvest,
      });
    }

    /* Break-even analysis */
    const stayEndMonth = Math.min(stayYears * 12, schedule.length);
    const principalPaidAtEnd = stayEndMonth > 0 ? schedule[stayEndMonth - 1]?.cumulativePrincipal || 0 : 0;
    const remainingBalAtEnd = stayEndMonth > 0 ? schedule[stayEndMonth - 1]?.balance || 0 : loanAmount;
    const homeValueAtEnd = price * Math.pow(1 + homeApprPct, stayYears);
    const saleProceeds = homeValueAtEnd * (1 - sellClosing);
    const netProceedsFromSale = saleProceeds - remainingBalAtEnd;

    const breakEvenSalePrice = (remainingBalAtEnd + down) / (1 - sellClosing);
    const requiredAppreciation = stayYears > 0 ? (Math.pow(breakEvenSalePrice / price, 1 / stayYears) - 1) * 100 : 0;

    /* Final verdict — use after-tax numbers */
    const lastYear = yearlyComparison[yearlyComparison.length - 1];
    const buyIsBetter = lastYear ? lastYear.netWorthBuyAfterTax > lastYear.netWorthRentAfterTax : false;
    const wealthDifference = lastYear ? Math.abs(lastYear.netWorthBuyAfterTax - lastYear.netWorthRentAfterTax) : 0;
    const monthlyDiff = totalMonthlyBuyAfterTax - totalMonthlyRent;

    return {
      monthlyPayment, monthlyTax, insurance, monthlyPMI, hoa, maintenance,
      firstInterest, firstPrincipal,
      totalMonthlyBuyPreTax, totalMonthlyBuyAfterTax, totalMonthlyRent,
      deductible, taxSavings, bracket,
      frontEnd, backEnd, monthlyIncome,
      schedule, yearlyComparison,
      crossoverYear, buyIsBetter, wealthDifference, monthlyDiff, longTermCapGainsRate,
      principalPaidAtEnd, breakEvenSalePrice, requiredAppreciation,
      homeValueAtEnd, remainingBalAtEnd, netProceedsFromSale,
      buyClosingCost,
      extraPaymentInterestSaved, extraPaymentMonthsSaved, pointsCost, adjustedRate,
      wouldItemize, roomRental, movingAndRepairs,
    };
  }, [loanAmount, down, downPct, price, loanRate, loanTerm, propertyTaxRate, homeInsurance, pmiRate, taxBracket, annualIncome, monthlyDebts, currentRent, hoaFee, maintenanceCost, rentIncrease, renterInsurance, homeAppreciation, investmentReturn, buyClosingCostPct, sellClosingCostPct, yearsToStay, extraMonthlyPayment, mortgagePoints, roomRentalIncome, propertyTaxIncreaseRate, insuranceIncreaseRate, movingCosts, initialRepairs, useItemizedDeductions, standardDeduction, filingStatus]);

  const ratioColor = (val: number, threshold: number) => {
    if (val <= threshold) return 'text-green-700 bg-green-50 border-green-200';
    if (val <= threshold + 5) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const ratioIcon = (val: number, threshold: number) => {
    if (val <= threshold) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (val <= threshold + 5) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const handlePrint = () => window.print();

  const handleSaveScenario = () => {
    const name = `$${fmtInt(price)} home, ${downPct.toFixed(0)}% down`;
    setSavedScenarios(prev => [...prev.slice(-2), {
      name,
      verdict: calcs.buyIsBetter ? 'BUY' : 'RENT',
      wealthDiff: calcs.wealthDifference,
      monthlyBuy: calcs.totalMonthlyBuyAfterTax,
      monthlyRent: calcs.totalMonthlyRent,
      inputs: { purchasePrice, downPayment, downMode, loanRate, loanTerm, annualIncome, monthlyDebts, currentRent, taxBracket, yearsToStay, propertyTaxRate, homeInsurance, hoaFee, maintenanceCost, pmiRate, rentIncrease, renterInsurance, homeAppreciation, investmentReturn, buyClosingCostPct, sellClosingCostPct, extraMonthlyPayment, mortgagePoints, roomRentalIncome, movingCosts, initialRepairs, filingStatus, useItemizedDeductions, propertyTaxIncreaseRate, insuranceIncreaseRate },
    }]);
  };

  const handleLoadScenario = (index: number) => {
    const s = savedScenarios[index];
    if (!s) return;
    const inp = s.inputs;
    setPurchasePrice(inp.purchasePrice);
    setDownPayment(inp.downPayment);
    setDownMode(inp.downMode);
    setLoanRate(inp.loanRate);
    setLoanTerm(inp.loanTerm);
    setAnnualIncome(inp.annualIncome);
    setMonthlyDebts(inp.monthlyDebts);
    setCurrentRent(inp.currentRent);
    setTaxBracket(inp.taxBracket);
    setYearsToStay(inp.yearsToStay);
    setPropertyTaxRate(inp.propertyTaxRate);
    setHomeInsurance(inp.homeInsurance);
    setHoaFee(inp.hoaFee);
    setMaintenanceCost(inp.maintenanceCost);
    setPmiRate(inp.pmiRate);
    setRentIncrease(inp.rentIncrease);
    setRenterInsurance(inp.renterInsurance);
    setHomeAppreciation(inp.homeAppreciation);
    setInvestmentReturn(inp.investmentReturn);
    setBuyClosingCostPct(inp.buyClosingCostPct);
    setSellClosingCostPct(inp.sellClosingCostPct);
    setExtraMonthlyPayment(inp.extraMonthlyPayment);
    setMortgagePoints(inp.mortgagePoints);
    setRoomRentalIncome(inp.roomRentalIncome);
    setMovingCosts(inp.movingCosts);
    setInitialRepairs(inp.initialRepairs);
    setFilingStatus(inp.filingStatus);
    setUseItemizedDeductions(inp.useItemizedDeductions);
    setPropertyTaxIncreaseRate(inp.propertyTaxIncreaseRate);
    setInsuranceIncreaseRate(inp.insuranceIncreaseRate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Rent or Buy Calculator Results', url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div>
      {/* Hero - Chase-style blue banner */}
      <div className="hero-section mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 font-medium mb-2">
            <Calculator className="w-4 h-4" />
            Free Financial Calculator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            <span className="mr-2">🏠</span>Should You Rent or Buy a Home?
          </h1>
          <p className="text-white/90 text-lg mb-4 leading-relaxed">
            Make your biggest financial decision with confidence. This calculator compares the true cost of renting vs. buying, including tax benefits, wealth building, opportunity cost, and break-even analysis.
          </p>
          <div className="bg-white rounded-xl mb-4 border-l-4 border-amber-400">
            <div className="flex items-start gap-3 p-4">
              <p className={`text-sm text-amber-900 leading-relaxed flex-1 ${showFirstTimerNote ? '' : 'line-clamp-2'}`}>
                We know buying a home involves a LOT of numbers — and it can feel overwhelming at first. That&apos;s completely normal. We&apos;ve explained everything in plain, simple language, but we also acknowledge it&apos;s still a lot to take in. <strong>Our advice:</strong> try to fill in numbers as close to your real situation as possible. If it feels like too much, sit down with a friend or family member who has purchased a home and go through the results together — it will make a huge difference. At the end of the day, these are the real numbers behind one of the biggest financial decisions of your life, and understanding them puts you ahead of most buyers.
              </p>
              <button onClick={() => setShowFirstTimerNote(!showFirstTimerNote)} className="flex-shrink-0 text-amber-700 hover:text-amber-900 p-1" title={showFirstTimerNote ? 'Show less' : 'Read more'}>
                {showFirstTimerNote ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-6 sm:gap-10 mb-2">
            <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-green-300">✓ 100% Free</span>
            <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-200">✓ No Sign-up Required</span>
            <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-purple-200">✓ Instant Results</span>
          </div>
          <p className="text-xs text-white/60 text-center">
            For informational purposes only — <a href="/rent-or-buy/disclaimer" className="underline text-white/80">full disclaimer</a>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ═══════ SECTION 1: Your Situation ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={1} total={4} icon={DollarSign} title="About You — Your Income and Finances" subtitle="We need to know how much you earn and owe so we can figure out what you can afford." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <InputField label="Annual Household Income" value={annualIncome} onChange={setAnnualIncome} prefix="$" step="5000" hint="Your total salary before taxes. Include spouse/partner if filing jointly." />
            <InputField label="Monthly Debts (auto, student, cards)" value={monthlyDebts} onChange={setMonthlyDebts} prefix="$" hint="Add up all monthly minimums: car payment, student loans, credit cards, etc." />
            <InputField label="Current Monthly Rent" value={currentRent} onChange={setCurrentRent} prefix="$" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Tax Filing Status</label>
              <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="w-full px-3 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>
            <InputField label="Combined Tax Bracket (Federal + State)" value={taxBracket} onChange={setTaxBracket} suffix="%" step="1" hint="Not sure? Use 25% for most people. It's the % of each extra dollar that goes to taxes." />
            <div>
              <label className="block text-xs font-medium text-muted mb-1">How Long Do You Plan to Stay?</label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min="1" max="30" value={yearsToStay}
                  onChange={(e) => setYearsToStay(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold font-mono text-primary min-w-[3rem] text-center">{yearsToStay} yr{yearsToStay !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-[10px] text-muted/70 mt-0.5">Longer stays generally favor buying</p>
            </div>
          </div>
        </div>

        {/* ═══════ SECTION 2: Home Details ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={2} total={4} icon={Home} title="The Home You Want to Buy" subtitle="Fill in the details of the home you're thinking about purchasing. Don't worry — you can change these numbers anytime." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" step="10000" />
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Down Payment</label>
              <div className="flex gap-1">
                <div className="flex rounded-lg border border-card-border overflow-hidden text-xs">
                  <button onClick={() => { setDownMode('$'); setDownPayment(String(Math.round(down))); }} className={`px-2.5 py-2 font-medium transition-colors ${downMode === '$' ? 'bg-primary text-white' : 'bg-background text-muted hover:text-dark'}`}>$</button>
                  <button onClick={() => { setDownMode('%'); setDownPayment(downPct.toFixed(1)); }} className={`px-2.5 py-2 font-medium transition-colors ${downMode === '%' ? 'bg-primary text-white' : 'bg-background text-muted hover:text-dark'}`}>%</button>
                </div>
                <input
                  type="number"
                  step={downMode === '$' ? '5000' : '0.5'}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                />
              </div>
              <p className="text-[10px] text-muted/70 mt-0.5">
                {downMode === '$' ? `= ${downPct.toFixed(1)}% of home price` : `= $${fmtInt(down)}`}
              </p>
            </div>
            <InputField label="Mortgage Interest Rate (the rate the bank charges you)" value={loanRate} onChange={setLoanRate} step="0.125" suffix="%" />
            <div>
              <label className="block text-xs font-medium text-muted mb-1">How Long Is Your Mortgage? (loan length)</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2.5 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-card">
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Property Tax Rate (annual)" value={propertyTaxRate} onChange={setPropertyTaxRate} step="0.1" suffix="%" hint={`Check your county's website or ask your realtor. US average is about 1.1%. = $${fmtInt(price * (parseFloat(propertyTaxRate) || 0) / 100 / 12)}/mo`} />
            <InputField label="Home Insurance /mo" value={homeInsurance} onChange={setHomeInsurance} prefix="$" hint="Homeowner's insurance protects your house. Typically $100-300/month." />
            <InputField label="Homeowners Association Fees /mo" value={hoaFee} onChange={setHoaFee} prefix="$" hint="Monthly fee for shared amenities like pools, gyms, and landscaping. $0 if none." />
            <InputField label="Maintenance /mo" value={maintenanceCost} onChange={setMaintenanceCost} prefix="$" hint="Things break! Budget about 1% of your home's value per year for repairs." />
          </div>
          {downPct < 20 && downPct > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Private Mortgage Insurance Rate (annual)" value={pmiRate} onChange={setPmiRate} step="0.1" suffix="%" hint="Required when down payment is less than 20%. Protects the lender. Typically 0.3-1.5%" />
              <div className="flex items-end">
                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 w-full">
                  Private Mortgage Insurance adds <strong className="font-mono">${fmt(calcs.monthlyPMI)}/mo</strong> until you reach 20% equity.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════ SECTION 3: Renting Scenario ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={3} total={4} icon={PiggyBank} title="Your Current Renting Costs" subtitle="Enter what you're paying now so we can compare it against what you'd pay if you bought a home." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Current Monthly Rent" value={currentRent} onChange={setCurrentRent} prefix="$" hint="Your baseline rent for comparison" />
            <InputField label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease} suffix="%" step="0.5" hint="Landlords typically raise rent 3-5% each year." />
            <InputField label="Renter&apos;s Insurance /mo" value={renterInsurance} onChange={setRenterInsurance} prefix="$" hint="Typically $15-30/mo" />
          </div>
          <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            In {yearsToStay} years at {rentIncrease}% annual increases, your rent would grow from <strong>${fmtInt(parseFloat(currentRent) || 0)}/mo</strong> to <strong>${fmtInt((parseFloat(currentRent) || 0) * Math.pow(1 + (parseFloat(rentIncrease) || 0) / 100, yearsToStay))}/mo</strong>.
          </div>
        </div>

        {/* ═══════ SECTION 4: Investment Assumptions ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={4} total={4} icon={TrendingUp} title="What We Assume About the Future" subtitle="Nobody can predict the future, but these are reasonable estimates based on historical averages. Feel free to adjust them." />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="How Fast Do You Expect Home Prices to Grow?" value={homeAppreciation} onChange={setHomeAppreciation} suffix="%/yr" step="0.5" hint="How much your home's value grows each year. US historical average is about 3-4%." />
            <InputField label="If You Invest in the Stock Market Instead, What Return Do You Expect?" value={investmentReturn} onChange={setInvestmentReturn} suffix="%/yr" step="0.5" hint="Average stock market (S&P 500) return is about 7% after inflation." />
            <InputField label="One-Time Fees When You Buy (closing costs)" value={buyClosingCostPct} onChange={setBuyClosingCostPct} suffix="%" step="0.5" hint={`One-time fees when buying: appraisal, title search, lender fees. Typically 2-5% of price. = $${fmtInt(price * (parseFloat(buyClosingCostPct) || 0) / 100)}`} />
            <InputField label="Fees When You Sell the Home Later (agent commission + costs)" value={sellClosingCostPct} onChange={setSellClosingCostPct} suffix="%" step="0.5" hint="When you sell: real estate agent commission (5-6%) + title & transfer fees." />
          </div>
        </div>

        {/* ═══════ OPTIONAL: ADVANCED INPUTS ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl shadow-sm">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-background/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">&#9881;&#65039;</span>
              <div>
                <h2 className="text-lg font-bold text-dark">Fine-Tune Your Analysis (Optional)</h2>
                <p className="text-xs text-muted">Advanced options for a more accurate analysis. Skip this if you&apos;re not sure.</p>
              </div>
            </div>
            {showAdvanced ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
          </button>
          {showAdvanced && (
            <div className="px-6 pb-6 space-y-6">
              {/* Tax Deduction Strategy */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Tax Deduction Strategy</h3>
                <p className="text-xs text-muted mb-3">When you own a home, you can deduct mortgage interest and property taxes from your income taxes — but only if those deductions are more than the standard deduction (${fmtInt(standardDeduction)}). Many homeowners actually don&apos;t benefit from this.</p>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-card-border hover:bg-background/50 cursor-pointer">
                    <input type="radio" name="itemize" value="auto" checked={useItemizedDeductions === 'auto'} onChange={() => setUseItemizedDeductions('auto')} className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-dark">Auto-detect (recommended)</div>
                      <div className="text-xs text-muted">We&apos;ll figure out which is better for you based on your numbers.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-card-border hover:bg-background/50 cursor-pointer">
                    <input type="radio" name="itemize" value="yes" checked={useItemizedDeductions === 'yes'} onChange={() => setUseItemizedDeductions('yes')} className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-dark">Yes, I&apos;ll itemize</div>
                      <div className="text-xs text-muted">I have other deductions (like charity, medical, etc.) that make itemizing worthwhile.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-card-border hover:bg-background/50 cursor-pointer">
                    <input type="radio" name="itemize" value="no" checked={useItemizedDeductions === 'no'} onChange={() => setUseItemizedDeductions('no')} className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-dark">No, I&apos;ll take the standard deduction</div>
                      <div className="text-xs text-muted">Don&apos;t count any tax savings from homeownership.</div>
                    </div>
                  </label>
                </div>
                {useItemizedDeductions === 'auto' && (
                  <div className={`mt-3 px-3 py-2 rounded-lg text-xs ${calcs.wouldItemize ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                    {calcs.wouldItemize
                      ? `Based on your numbers, you would benefit from itemizing. Your annual mortgage interest + property taxes ($${fmtInt(calcs.firstInterest * 12 + calcs.monthlyTax * 12)}) exceeds the standard deduction ($${fmtInt(standardDeduction)}).`
                      : `Based on your numbers, you would NOT benefit from itemizing. Your annual mortgage interest + property taxes ($${fmtInt(calcs.firstInterest * 12 + calcs.monthlyTax * 12)}) is less than the standard deduction ($${fmtInt(standardDeduction)}). Tax savings have been adjusted accordingly.`
                    }
                  </div>
                )}
              </div>

              {/* Cost Increases Over Time */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Annual Increases</h3>
                <p className="text-xs text-muted mb-3">Property taxes and insurance go up over time. Enter the expected annual increase.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Property Tax Annual Increase" value={propertyTaxIncreaseRate} onChange={setPropertyTaxIncreaseRate} suffix="%" step="0.5" hint="How much your property tax goes up each year. Typically 1-3%." />
                  <InputField label="Insurance Annual Increase" value={insuranceIncreaseRate} onChange={setInsuranceIncreaseRate} suffix="%" step="0.5" hint="How much your home insurance goes up each year. Typically 2-5%." />
                </div>
              </div>

              {/* One-Time Costs */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">One-Time Costs When You Buy</h3>
                <p className="text-xs text-muted mb-3">Beyond closing costs, buying a home involves moving expenses and often some immediate repairs or updates.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Moving Costs" value={movingCosts} onChange={setMovingCosts} prefix="$" hint="Movers, supplies, deposits, etc. Typically $2,000-$10,000." />
                  <InputField label="Initial Repairs & Updates" value={initialRepairs} onChange={setInitialRepairs} prefix="$" hint="Paint, appliances, fixes, etc. Budget $0-$20,000 depending on condition." />
                </div>
              </div>

              {/* Extra Monthly Payments */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Extra Monthly Payments</h3>
                <p className="text-xs text-muted mb-3">Paying extra each month goes directly toward your loan balance, saving you interest and paying off your mortgage faster.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Extra Monthly Payment Toward Principal" value={extraMonthlyPayment} onChange={setExtraMonthlyPayment} prefix="$" hint="Any extra amount above your required payment." />
                  {(parseFloat(extraMonthlyPayment) || 0) > 0 && (
                    <div className="flex items-end">
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 w-full">
                        You&apos;d save <strong className="font-mono">${fmtInt(calcs.extraPaymentInterestSaved)}</strong> in interest and pay off <strong>{Math.floor(calcs.extraPaymentMonthsSaved / 12)} years {calcs.extraPaymentMonthsSaved % 12} months</strong> early!
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mortgage Points */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Mortgage Points (Buying Down Your Rate)</h3>
                <p className="text-xs text-muted mb-3">You can pay upfront to get a lower interest rate. Each &quot;point&quot; costs 1% of your loan and typically reduces your rate by 0.25%.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Number of Points</label>
                    <select value={mortgagePoints} onChange={(e) => setMortgagePoints(e.target.value)} className="w-full px-3 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
                      <option value="0">0 points</option>
                      <option value="1">1 point</option>
                      <option value="2">2 points</option>
                      <option value="3">3 points</option>
                    </select>
                  </div>
                  {(parseFloat(mortgagePoints) || 0) > 0 && (
                    <div className="flex items-end">
                      <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 w-full">
                        {mortgagePoints} point{parseFloat(mortgagePoints) > 1 ? 's' : ''} cost{parseFloat(mortgagePoints) === 1 ? 's' : ''} <strong className="font-mono">${fmtInt(calcs.pointsCost)}</strong> upfront, reducing your rate from <strong>{loanRate}%</strong> to <strong>{(calcs.adjustedRate * 100).toFixed(2)}%</strong>.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Rental Income */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Rental Income (Rent Out a Room)</h3>
                <p className="text-xs text-muted mb-3">If you plan to rent out a room or part of your home, this income offsets your monthly costs.</p>
                <InputField label="Monthly Rental Income" value={roomRentalIncome} onChange={setRoomRentalIncome} prefix="$" hint="Expected monthly income from renting out a room or space." />
              </div>
            </div>
          )}
        </div>

        {/* ═══════ EMERGENCY FUND CHECK ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl shadow-sm">
          <button
            onClick={() => setShowEmergencyCheck(!showEmergencyCheck)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-background/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128737;&#65039;</span>
              <div>
                <h2 className="text-lg font-bold text-dark">Emergency Fund Check</h2>
                <p className="text-xs text-muted">Make sure you&apos;ll have enough savings left after your down payment.</p>
              </div>
            </div>
            {showEmergencyCheck ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
          </button>
          {showEmergencyCheck && (
            <div className="px-6 pb-6 space-y-4">
              <InputField label="Total Savings You Have Right Now" value={totalSavings} onChange={setTotalSavings} prefix="$" hint="All your savings: checking, savings accounts, investments you can liquidate." />
              {(parseFloat(totalSavings) || 0) > 0 && (() => {
                const savings = parseFloat(totalSavings) || 0;
                const totalUpfront = down + calcs.buyClosingCost + calcs.movingAndRepairs;
                const remaining = savings - totalUpfront;
                const monthlyExpenses = calcs.totalMonthlyBuyPreTax + calcs.roomRental; // add back rental since we need gross expenses
                const monthsCovered = monthlyExpenses > 0 ? remaining / monthlyExpenses : 0;
                const isGood = monthsCovered >= 6;
                const isTight = monthsCovered >= 3 && monthsCovered < 6;
                const isDanger = monthsCovered < 3;
                return (
                  <div className="space-y-3">
                    <div className="bg-background rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted">Total savings:</span><span className="font-mono font-medium">${fmtInt(savings)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted">Down payment:</span><span className="font-mono text-red-600">-${fmtInt(down)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted">Closing costs:</span><span className="font-mono text-red-600">-${fmtInt(calcs.buyClosingCost)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted">Moving + repairs:</span><span className="font-mono text-red-600">-${fmtInt(calcs.movingAndRepairs)}</span></div>
                      <div className="flex justify-between text-sm font-bold border-t border-card-border pt-2"><span>Remaining:</span><span className={`font-mono ${remaining >= 0 ? 'text-dark' : 'text-red-600'}`}>${fmtInt(remaining)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted">Monthly expenses if you buy:</span><span className="font-mono">${fmtInt(monthlyExpenses)}/mo</span></div>
                      <div className="flex justify-between text-sm font-bold"><span>Months of expenses covered:</span><span className="font-mono">{monthsCovered.toFixed(1)} months</span></div>
                    </div>
                    <div className={`rounded-xl p-4 text-center border-2 ${isGood ? 'bg-green-50 border-green-400' : isTight ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'}`}>
                      {isGood && (
                        <div>
                          <div className="text-2xl mb-1">&#9989;</div>
                          <p className="font-bold text-green-800">You&apos;re well prepared!</p>
                          <p className="text-sm text-green-700">You&apos;ll have {monthsCovered.toFixed(1)} months of expenses saved — that&apos;s a solid emergency fund.</p>
                        </div>
                      )}
                      {isTight && (
                        <div>
                          <div className="text-2xl mb-1">&#9888;&#65039;</div>
                          <p className="font-bold text-yellow-800">Tight but manageable</p>
                          <p className="text-sm text-yellow-700">You&apos;ll have {monthsCovered.toFixed(1)} months of expenses saved. Consider building a bigger cushion before buying.</p>
                        </div>
                      )}
                      {isDanger && (
                        <div>
                          <div className="text-2xl mb-1">&#10060;</div>
                          <p className="font-bold text-red-800">Warning: You may not have enough cushion</p>
                          <p className="text-sm text-red-700">{remaining < 0 ? `You'd be $${fmtInt(Math.abs(remaining))} short of covering upfront costs.` : `You'd only have ${monthsCovered.toFixed(1)} months of expenses saved.`} Experts recommend at least 6 months. Consider saving more or reducing your down payment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* ═══════ RESULTS DIVIDER ═══════ */}
        <div className="relative py-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-4 border-primary/30" /></div>
          <div className="relative flex justify-center">
            <span className="bg-primary text-white px-10 py-4 rounded-2xl text-xl sm:text-2xl font-bold shadow-xl flex items-center gap-3">
              📊 Your Results — Based on the Numbers Above
            </span>
          </div>
        </div>

        {/* A) BIG VERDICT CARD */}
        <div className={`rounded-2xl p-6 sm:p-8 border-4 shadow-xl ${calcs.buyIsBetter ? 'bg-green-50 border-green-500 shadow-green-200' : 'bg-blue-50 border-blue-500 shadow-blue-200'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl sm:text-6xl">
                {calcs.buyIsBetter ? '🏠' : '💰'}
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-bold ${calcs.buyIsBetter ? 'text-green-800' : 'text-blue-800'}`}>
                  {calcs.buyIsBetter ? 'BUYING is Better' : 'RENTING is Better'}
                </div>
                <p className={`text-sm ${calcs.buyIsBetter ? 'text-green-700' : 'text-blue-700'}`}>
                  Based on a {yearsToStay}-year time horizon with your inputs
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl sm:text-5xl font-bold font-mono ${calcs.buyIsBetter ? 'text-green-700' : 'text-blue-700'}`}>
                ${fmtInt(calcs.wealthDifference)}
              </div>
              <div className={`text-lg font-bold ${calcs.buyIsBetter ? 'text-green-600' : 'text-blue-600'} flex items-center justify-end gap-1`}>
                <span className="text-2xl">↑</span> {calcs.buyIsBetter ? `Buying puts $${fmtInt(calcs.wealthDifference)} extra in your pocket over ${yearsToStay} years` : `Renting and investing saves you $${fmtInt(calcs.wealthDifference)} over ${yearsToStay} years`}
              </div>
              <div className={`text-sm mt-1 ${calcs.buyIsBetter ? 'text-green-600' : 'text-blue-600'}`}>
                {(parseFloat(currentRent) || 0) > 0
                  ? `That's ${Math.round(calcs.wealthDifference / (parseFloat(currentRent) || 1))} months of rent!`
                  : `Over ${yearsToStay} years`
                }
              </div>
            </div>
          </div>

          {/* Monthly cost comparison */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-card/80 rounded-xl p-4 text-center border border-card-border flex-1 w-full">
              <div className="text-xs text-muted mb-1 uppercase tracking-wide">What You&apos;d Pay Monthly to Own</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmt(calcs.totalMonthlyBuyAfterTax)}</div>
              <div className="text-xs text-muted">your actual cost after tax breaks</div>
            </div>
            <div className="hidden sm:block text-3xl text-muted/40 flex-shrink-0">→</div>
            <div className="bg-card/80 rounded-xl p-4 text-center border border-card-border flex-1 w-full">
              <div className="text-xs text-muted mb-1 uppercase tracking-wide">What You&apos;re Paying Monthly to Rent</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmt(calcs.totalMonthlyRent)}</div>
              <div className="text-xs text-muted">your current rent plus renter&apos;s insurance</div>
            </div>
          </div>
          <div className="mt-4">
            <div className={`rounded-xl p-4 text-center border-2 ${calcs.monthlyDiff <= 0 ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
              <div className="text-xs text-muted mb-1 uppercase tracking-wide">The Monthly Difference Between Owning and Renting</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{calcs.monthlyDiff <= 0 ? '👍' : '👎'}</span>
                <div className={`text-2xl font-bold font-mono ${calcs.monthlyDiff <= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {calcs.monthlyDiff <= 0 ? '-' : '+'}${fmt(Math.abs(calcs.monthlyDiff))}
                </div>
              </div>
              <div className="text-xs text-muted">
                owning a home costs {calcs.monthlyDiff <= 0 ? 'less' : 'more'} each month
              </div>
              <div className={`text-xs font-medium mt-1 ${calcs.monthlyDiff <= 0 ? 'text-green-700' : 'text-red-700'}`}>
                (that&apos;s ${fmtInt(Math.abs(calcs.monthlyDiff) * 12)} per year)
              </div>
            </div>
          </div>

          {calcs.crossoverYear > 0 && !calcs.buyIsBetter && (
            <div className="mt-4 px-4 py-3 bg-card/80 rounded-xl border border-card-border text-sm">
              <Clock className="w-4 h-4 inline text-primary mr-1" />
              <strong>Crossover point:</strong> Buying becomes better than renting after <strong className="text-primary">{calcs.crossoverYear} years</strong>.
              {calcs.crossoverYear <= 30 && ' Consider staying longer to make buying worthwhile.'}
            </div>
          )}
        </div>

        {/* B) Monthly Cost Breakdown */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={1} total={5} icon={BarChart3} title="What You'd Pay Each Month If You Buy This Home" type="result" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-card-border">
                  <th className="text-left py-2 text-muted font-medium">What You&apos;re Paying For</th>
                  <th className="text-right py-2 text-muted font-medium">Before Tax Savings</th>
                  <th className="text-right py-2 text-muted font-medium">Your Actual Cost</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-sans">
                    <div>Mortgage Principal</div>
                    <div className="text-[10px] text-muted font-normal">The part of your payment that pays down your loan — this builds your home equity</div>
                  </td>
                  <td className="text-right">${fmt(calcs.firstPrincipal)}</td>
                  <td className="text-right">${fmt(calcs.firstPrincipal)}</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-sans">
                    <div>Mortgage Interest</div>
                    <div className="text-[10px] text-muted font-normal">The cost the bank charges you for borrowing money — this is the bank&apos;s profit</div>
                  </td>
                  <td className="text-right">${fmt(calcs.firstInterest)}</td>
                  <td className="text-right text-green-700">${fmt(calcs.firstInterest * (1 - calcs.bracket))}</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-sans">
                    <div>Property Taxes</div>
                    <div className="text-[10px] text-muted font-normal">Annual tax your city/county charges on your home, paid monthly through your mortgage</div>
                  </td>
                  <td className="text-right">${fmt(calcs.monthlyTax)}</td>
                  <td className="text-right text-green-700">${fmt(calcs.monthlyTax * (1 - calcs.bracket))}</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-sans">
                    <div>Home Insurance</div>
                    <div className="text-[10px] text-muted font-normal">Protects your home from damage, theft, and liability — required by all lenders</div>
                  </td>
                  <td className="text-right">${fmt(calcs.insurance)}</td>
                  <td className="text-right">${fmt(calcs.insurance)}</td>
                </tr>
                {calcs.monthlyPMI > 0 && (
                  <tr className="border-b border-card-border/50">
                    <td className="py-2 font-sans">
                      <div>Private Mortgage Insurance</div>
                      <div className="text-[10px] text-muted font-normal">Extra insurance you pay when your down payment is less than 20% — protects the lender, not you</div>
                    </td>
                    <td className="text-right">${fmt(calcs.monthlyPMI)}</td>
                    <td className="text-right">${fmt(calcs.monthlyPMI)}</td>
                  </tr>
                )}
                {calcs.hoa > 0 && (
                  <tr className="border-b border-card-border/50">
                    <td className="py-2 font-sans">
                      <div>Homeowners Association Fees</div>
                      <div className="text-[10px] text-muted font-normal">Monthly fee for shared amenities like pools, gyms, and landscaping in your community</div>
                    </td>
                    <td className="text-right">${fmt(calcs.hoa)}</td>
                    <td className="text-right">${fmt(calcs.hoa)}</td>
                  </tr>
                )}
                <tr className="border-b border-card-border/50">
                  <td className="py-2 font-sans">
                    <div>Maintenance</div>
                    <div className="text-[10px] text-muted font-normal">Budget for repairs — things like fixing a water heater, replacing a roof, or painting</div>
                  </td>
                  <td className="text-right">${fmt(calcs.maintenance)}</td>
                  <td className="text-right">${fmt(calcs.maintenance)}</td>
                </tr>
                <tr className="border-t-2 border-dark/20 font-bold bg-primary/5">
                  <td className="py-3 font-sans">Total Monthly Payment If You Buy</td>
                  <td className="text-right">${fmt(calcs.totalMonthlyBuyPreTax)}</td>
                  <td className="text-right text-primary">${fmt(calcs.totalMonthlyBuyAfterTax)}</td>
                </tr>
                <tr className="bg-green-100 border-2 border-green-400">
                  <td className="py-4 pl-4 font-sans">
                    <div className="text-base font-bold text-green-800 flex items-center gap-2">💰 Tax Savings — Money Back in Your Pocket!</div>
                    <div className="text-xs text-green-700 mt-1">The government gives you a tax break on mortgage interest and property taxes. This reduces what you actually pay each month.</div>
                  </td>
                  <td className="text-right"></td>
                  <td className="text-right pr-4 font-bold text-green-800 text-xl">-${fmt(calcs.taxSavings)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="text-xs text-muted uppercase tracking-wide mb-1">Your Real Monthly Cost of Owning (after tax savings)</div>
              <div className="text-2xl font-bold font-mono text-primary">${fmt(calcs.totalMonthlyBuyAfterTax)}/mo</div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="text-xs text-muted uppercase tracking-wide mb-1">Your Monthly Cost of Renting</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmt(calcs.totalMonthlyRent)}/mo</div>
              <div className="text-xs text-muted">Rent ${fmtInt(parseFloat(currentRent) || 0)} + Insurance ${fmtInt(parseFloat(renterInsurance) || 0)}</div>
            </div>
          </div>
        </div>

        {/* C) Year-by-Year Comparison */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={2} total={5} icon={TrendingUp} title="Year-by-Year Comparison — See How Each Option Plays Out" type="result" />
          <p className="text-sm text-muted mb-6 -mt-2">This is the most important section. We compare 3 paths you could take and show exactly what happens to your money each year.</p>

          {/* The 3 Paths Explained */}
          <div className="mb-6 p-4 bg-background border border-card-border rounded-xl">
            <div className="text-sm font-bold text-dark mb-3">The 3 Paths We&apos;re Comparing:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">🏠</span>
                <div>
                  <div className="text-xs font-bold text-dark">Path A: Buy a Home</div>
                  <div className="text-[10px] text-muted">You buy this home, build equity, and sell it in {yearsToStay} years.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📈</span>
                <div>
                  <div className="text-xs font-bold text-dark">Path B: Rent + Invest in Stocks</div>
                  <div className="text-[10px] text-muted">You keep renting and invest your down payment + savings in the S&P 500.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💵</span>
                <div>
                  <div className="text-xs font-bold text-dark">Path C: Rent + Keep Cash</div>
                  <div className="text-[10px] text-muted">You keep renting and save money in a bank account. No investing.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight callout */}
          {calcs.yearlyComparison.length > 0 && (() => {
            const last = calcs.yearlyComparison[calcs.yearlyComparison.length - 1];
            const bestOption = Math.max(last.netWorthBuyAfterTax, last.netWorthRentAfterTax);
            const cashGap = bestOption - last.netWorthRentNoInvest;
            return calcs.buyIsBetter ? (
              <div className="mb-6 px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                <div className="text-lg font-bold text-green-800 mb-1">📈 Key Insight</div>
                <p className="text-sm text-green-700 mb-2">
                  By year {yearsToStay}, buying a home puts <strong className="font-mono">${fmtInt(calcs.wealthDifference)}</strong> more in your pocket than renting and investing in stocks — after paying all selling costs and taxes!
                </p>
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ And if you just rent and keep cash without investing? You&apos;d have <strong className="font-mono">${fmtInt(cashGap)}</strong> LESS than buying. Doing nothing is the most expensive option.
                </p>
              </div>
            ) : (
              <div className="mb-6 px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                <div className="text-lg font-bold text-blue-800 mb-1">📊 Key Insight</div>
                <p className="text-sm text-blue-700 mb-2">
                  By year {yearsToStay}, renting and investing in stocks puts <strong className="font-mono">${fmtInt(calcs.wealthDifference)}</strong> more in your pocket than buying a home — after paying all taxes on your investment profits!
                </p>
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ But if you just rent and keep cash without investing? You&apos;d have <strong className="font-mono">${fmtInt(cashGap)}</strong> LESS than investing in stocks. Not investing costs you big time.
                </p>
              </div>
            );
          })()}

          {/* What we assumed */}
          <div className="mb-6">
            <div className="text-xs font-bold text-dark uppercase tracking-wide mb-3">What We Assumed for These Numbers:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="text-xs font-bold text-blue-800 mb-1">Rent Increases</div>
              <p className="text-xs text-blue-700">Your rent of ${fmtInt(parseFloat(currentRent) || 0)}/mo increases by <strong>{rentIncrease}% every year</strong>. By year {yearsToStay}, rent would be ${fmtInt((parseFloat(currentRent) || 0) * Math.pow(1 + (parseFloat(rentIncrease) || 0) / 100, yearsToStay))}/mo.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="text-xs font-bold text-green-800 mb-1">Fixed Mortgage</div>
              <p className="text-xs text-green-700">Your mortgage payment of <strong>${fmt(calcs.monthlyPayment)}/mo stays the same</strong> for all {loanTerm} years. Only property tax and insurance may change.</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <div className="text-xs font-bold text-purple-800 mb-1">Capital Gains Tax</div>
              <div className="text-xs text-purple-700 space-y-1">
                <p><strong>If you sell your home:</strong> The IRS lets you keep the first $250,000 of profit tax-free ($500,000 if married). Any profit above that is taxed at {(calcs.longTermCapGainsRate * 100).toFixed(0)}% (long-term capital gains rate based on your tax bracket).</p>
                <p><strong>If you sell S&P 500 investments:</strong> All profits (gains above what you originally put in) are taxed at {(calcs.longTermCapGainsRate * 100).toFixed(0)}% long-term capital gains rate. There is no exclusion like there is for a home.</p>
              </div>
            </div>
          </div>

          </div>

          {/* How we calculated the stock market numbers */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl">
            <button onClick={() => setShowSPCalc(!showSPCalc)} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-xs font-bold text-blue-800">🔍 How did we calculate the stock market numbers? (click to expand)</span>
              {showSPCalc ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
            </button>
            {showSPCalc && (
            <div className="px-4 pb-4">
              <div className="text-xs text-blue-700 space-y-2">
              <div>
                <strong>Step 1 — Initial lump sum invested:</strong>
                <div className="ml-4 mt-1 space-y-0.5 font-mono">
                  <div>Down payment: <strong>${fmtInt(down)}</strong> ({downPct.toFixed(1)}% of ${fmtInt(price)})</div>
                  <div>+ Buying closing costs: <strong>${fmtInt(calcs.buyClosingCost)}</strong> ({buyClosingCostPct}% of ${fmtInt(price)} home price)</div>
                  <div className="border-t border-blue-300 pt-0.5"><strong>= ${fmtInt(down + calcs.buyClosingCost)} invested on day one</strong></div>
                </div>
                <div className="ml-4 mt-1 italic">This is money you would have spent on buying. Instead, you invest it in the S&P 500.</div>
              </div>
              <div>
                <strong>Step 2 — Monthly additions (the &quot;difference&quot;):</strong>
                <div className="ml-4 mt-1 space-y-0.5 font-mono">
                  <div>Monthly cost of buying (after tax): <strong>${fmt(calcs.totalMonthlyBuyAfterTax)}</strong></div>
                  <div>- Monthly cost of renting: <strong>${fmt(calcs.totalMonthlyRent)}</strong></div>
                  <div className="border-t border-blue-300 pt-0.5">= <strong>${fmt(Math.max(0, calcs.totalMonthlyBuyAfterTax - calcs.totalMonthlyRent))}/mo extra</strong> you invest each month</div>
                </div>
                <div className="ml-4 mt-1 italic">Since buying costs more per month, you invest that extra savings into the S&P 500 each month.</div>
              </div>
              <div>
                <strong>Step 3 — Year 1 total invested:</strong>
                <div className="ml-4 mt-1 font-mono">
                  ${fmtInt(down + calcs.buyClosingCost)} (lump sum) + ${fmtInt(Math.max(0, calcs.totalMonthlyBuyAfterTax - calcs.totalMonthlyRent) * 12)} (12 months × ${fmt(Math.max(0, calcs.totalMonthlyBuyAfterTax - calcs.totalMonthlyRent))}) = <strong>${fmtInt(down + calcs.buyClosingCost + Math.max(0, calcs.totalMonthlyBuyAfterTax - calcs.totalMonthlyRent) * 12)} total contributed</strong> + market growth at {investmentReturn}%/year
                </div>
              </div>
              </div>
            </div>
            )}
          </div>

          {/* TABLE 1: Monthly Payments — Rent vs Mortgage */}
          <h3 className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Table 1: What Leaves Your Wallet Each Month — Rent vs. Mortgage</h3>
          <p className="text-[11px] text-muted mb-3">Notice how rent keeps going up every year, but your mortgage payment <strong>never changes</strong>.</p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b-2 border-card-border bg-background">
                  <th className="py-2 px-2 text-left text-muted font-medium">End of Year</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">
                    <div>Monthly Rent You&apos;d Pay</div>
                    <div className="text-[9px] font-normal opacity-70">goes up {rentIncrease}% every year</div>
                  </th>
                  <th className="py-2 px-2 text-right text-muted font-medium">
                    <div>Monthly Mortgage You&apos;d Pay</div>
                    <div className="text-[9px] font-normal opacity-70">locked in — never changes</div>
                  </th>
                  <th className="py-2 px-2 text-right text-muted font-medium">
                    <div>Difference</div>
                    <div className="text-[9px] font-normal opacity-70">how much more/less you pay by owning</div>
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {calcs.yearlyComparison.map((row) => {
                  const diff = row.mortgageThisYear - row.rentThisYear;
                  return (
                    <tr key={row.year} className="border-b border-card-border/50">
                      <td className="py-1.5 px-2 font-sans font-medium">{row.year}</td>
                      <td className="py-1.5 px-2 text-right">${fmtInt(row.rentThisYear)}</td>
                      <td className="py-1.5 px-2 text-right">${fmtInt(row.mortgageThisYear)}</td>
                      <td className={`py-1.5 px-2 text-right font-bold ${diff <= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {diff <= 0 ? '-' : '+'}${fmtInt(Math.abs(diff))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-muted mt-1">Mortgage shown is principal + interest only. Your total monthly cost of owning (including taxes, insurance, etc.) is shown in Result 1 above.</p>
          </div>

          {/* TABLE 2: Wealth Comparison — If You Sold/Cashed Out */}
          <h3 className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Table 2: If You Sold Everything Today — What Would You Walk Away With?</h3>
          <p className="text-[11px] text-muted mb-3">Each row imagines you sell the home or cash out your stocks at the <strong>end of that year</strong>, after paying all fees and taxes.</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b-2 border-card-border bg-background">
                  <th className="py-2 px-1.5 text-left text-muted font-medium">End of Year</th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>What Your Home Would Be Worth</div>
                    <div className="text-[9px] font-normal opacity-70">growing at {homeAppreciation}% per year</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>Your Stake in the Home (in dollars)</div>
                    <div className="text-[9px] font-normal opacity-70">home value minus what you still owe the bank</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>What Your Stock Market Account Would Be Worth</div>
                    <div className="text-[9px] font-normal opacity-70">if you invested your down payment + monthly savings instead</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>Tax You&apos;d Owe If You Sell the Home</div>
                    <div className="text-[9px] font-normal opacity-70">first $250K profit is tax-free, then {(calcs.longTermCapGainsRate * 100).toFixed(0)}%</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>Tax You&apos;d Owe If You Sell Your Stocks</div>
                    <div className="text-[9px] font-normal opacity-70">{(calcs.longTermCapGainsRate * 100).toFixed(0)}% on everything you earned</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>You Walk Away With if You Bought</div>
                    <div className="text-[9px] font-normal opacity-70">after selling home, paying off loan, fees &amp; taxes</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>You Walk Away With if You Rented + Invested</div>
                    <div className="text-[9px] font-normal opacity-70">after selling stocks &amp; paying taxes on profits</div>
                  </th>
                  <th className="py-2 px-1.5 text-center text-muted font-medium">
                    <div>Which One Wins?</div>
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {calcs.yearlyComparison.map((row) => (
                  <tr key={row.year} className={`border-b border-card-border/50 ${row.year === calcs.crossoverYear ? 'bg-yellow-50 font-bold' : ''}`}>
                    <td className="py-1.5 px-1.5 font-sans font-medium">{row.year}</td>
                    <td className="py-1.5 px-1.5 text-right">${fmtInt(row.homeValue)}</td>
                    <td className="py-1.5 px-1.5 text-right text-green-700">${fmtInt(row.homeEquity)}</td>
                    <td className="py-1.5 px-1.5 text-right text-blue-700">${fmtInt(row.investmentPortfolio)}</td>
                    <td className="py-1.5 px-1.5 text-right text-red-600">{row.capGainsTaxBuy > 0 ? `$${fmtInt(row.capGainsTaxBuy)}` : '$0'}</td>
                    <td className="py-1.5 px-1.5 text-right text-red-600">${fmtInt(row.capGainsTaxRent)}</td>
                    <td className="py-1.5 px-1.5 text-right font-bold">${fmtInt(row.netWorthBuyAfterTax)}</td>
                    <td className="py-1.5 px-1.5 text-right font-bold">${fmtInt(row.netWorthRentAfterTax)}</td>
                    <td className="py-1.5 px-1.5 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${row.buyWins ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {row.buyWins ? 'BUY' : 'RENT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-muted mt-1">All amounts are <strong>after</strong> selling costs ({sellClosingCostPct}% for home) and capital gains taxes. Home sale uses the $250K tax-free exclusion.</p>
          </div>

          {calcs.crossoverYear > 0 && (
            <div className="mb-6 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>Crossover year {calcs.crossoverYear}:</strong> This is when buying starts to produce more wealth than renting and investing in the S&P 500.
            </div>
          )}

          {/* Scenario B: Rent WITHOUT investing */}
          <h3 className="text-xs font-bold text-dark uppercase tracking-wide mb-2">Table 3: What if you rent and just keep your money as cash? (No stock market investing)</h3>
          <p className="text-[11px] text-muted mb-3">Many people don&apos;t invest in the stock market. This shows what happens if you simply save your money in a bank account instead of buying a home — no investing, just cash.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b-2 border-card-border bg-background">
                  <th className="py-2 px-1.5 text-left text-muted font-medium">
                    <div>End of Year</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>Cash You&apos;d Have Saved</div>
                    <div className="text-[9px] font-normal opacity-70">down payment + monthly savings, sitting in a bank</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>If You Buy a Home and Sell It Now, You Walk Away With</div>
                    <div className="text-[9px] font-normal opacity-70">after selling home, paying off loan, fees &amp; taxes</div>
                  </th>
                  <th className="py-2 px-1.5 text-right text-muted font-medium">
                    <div>Buying Puts You Ahead By</div>
                    <div className="text-[9px] font-normal opacity-70">positive = buying wins, negative = renting wins</div>
                  </th>
                  <th className="py-2 px-1.5 text-center text-muted font-medium">
                    <div>Which One Wins?</div>
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {calcs.yearlyComparison.map((row) => {
                  const diff = row.netWorthBuyAfterTax - row.netWorthRentNoInvest;
                  return (
                    <tr key={row.year} className="border-b border-card-border/50">
                      <td className="py-1.5 px-1.5 font-sans font-medium">{row.year}</td>
                      <td className="py-1.5 px-1.5 text-right">${fmtInt(row.investmentPortfolioNoInvest)}</td>
                      <td className="py-1.5 px-1.5 text-right">${fmtInt(row.netWorthBuyAfterTax)}</td>
                      <td className={`py-1.5 px-1.5 text-right font-bold ${diff > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {diff > 0 ? '+' : ''}{fmtInt(diff)}
                      </td>
                      <td className="py-1.5 px-1.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${row.buyWinsNoInvest ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {row.buyWinsNoInvest ? 'BUY' : 'RENT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-muted mt-1">Without investing, most renters fall behind buyers significantly because cash loses value to inflation while home equity grows.</p>
          </div>

          {/* Final summary */}
          {calcs.yearlyComparison.length > 0 && (() => {
            const last = calcs.yearlyComparison[calcs.yearlyComparison.length - 1];
            const longTermCapGainsRatePct = (calcs.longTermCapGainsRate * 100).toFixed(0);
            const rent = parseFloat(currentRent) || 1;
            const diffMonths = Math.round(calcs.wealthDifference / rent);
            const nextDownPct = price > 0 ? Math.round((calcs.wealthDifference / price) * 100) : 0;
            return (
              <div className="bg-background border-2 border-card-border rounded-xl p-6">
                <h4 className="text-xl font-bold text-dark mb-5 flex items-center gap-2">
                  🎯 The Bottom Line — After {yearsToStay} Years
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm items-stretch">
                  {/* Path A: Buy */}
                  <div className={`rounded-xl p-5 border-2 flex flex-col ${calcs.buyIsBetter ? 'bg-green-50/80 border-green-300' : 'bg-card border-card-border'}`}>
                    <div className="font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="text-xl">🏠</span>
                      Path A: Buy a Home
                    </div>
                    <div className="text-xs text-muted mb-3">You buy this home, live in it for {yearsToStay} years, then sell it.</div>
                    <div className="space-y-1 text-muted font-mono text-xs flex-1">
                      <div className="flex justify-between"><span>Home sells for:</span><span>${fmtInt(last.homeValue)}</span></div>
                      <div className="flex justify-between"><span>You still owe the bank:</span><span className="text-red-600">-${fmtInt(last.homeValue - last.homeEquity)}</span></div>
                      <div className="flex justify-between"><span>Agent fees &amp; closing costs:</span><span className="text-red-600">-${fmtInt(last.homeValue * (parseFloat(sellClosingCostPct) || 0) / 100)}</span></div>
                      <div className="flex justify-between"><span>Capital gains tax:</span><span className="text-red-600">-${fmtInt(last.capGainsTaxBuy)}</span></div>
                    </div>
                    <div className="border-t-2 border-green-300 pt-3 mt-3 text-center">
                      <div className="text-xs text-muted mb-1">You walk away with:</div>
                      <div className="text-3xl font-bold text-green-700">${fmtInt(last.netWorthBuyAfterTax)}</div>
                    </div>
                  </div>

                  {/* Path B: Rent + Invest */}
                  <div className={`rounded-xl p-5 border-2 flex flex-col ${!calcs.buyIsBetter ? 'bg-blue-50/80 border-blue-300' : 'bg-card border-card-border'}`}>
                    <div className="font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="text-xl">📈</span>
                      Path B: Rent + Invest in Stocks
                    </div>
                    <div className="text-xs text-muted mb-3">You keep renting and invest your down payment + monthly savings in the S&amp;P 500.</div>
                    <div className="space-y-1 text-muted font-mono text-xs flex-1">
                      <div className="flex justify-between"><span>Stock portfolio grows to:</span><span>${fmtInt(last.investmentPortfolio)}</span></div>
                      <div className="flex justify-between"><span>Capital gains tax on profits:</span><span className="text-red-600">-${fmtInt(last.capGainsTaxRent)}</span></div>
                    </div>
                    <div className="border-t-2 border-blue-300 pt-3 mt-3 text-center">
                      <div className="text-xs text-muted mb-1">You walk away with:</div>
                      <div className="text-3xl font-bold text-blue-700">${fmtInt(last.netWorthRentAfterTax)}</div>
                    </div>
                  </div>

                  {/* Path C: Rent + Do Nothing */}
                  <div className="rounded-xl p-5 border-2 bg-amber-50/80 border-amber-300 flex flex-col">
                    <div className="font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="text-xl">💵</span>
                      Path C: Rent + Keep Cash
                    </div>
                    <div className="text-xs text-muted mb-3">You keep renting and just save money in a bank account. No home, no stocks.</div>
                    <div className="space-y-1 text-muted font-mono text-xs flex-1">
                      <div className="flex justify-between"><span>Cash saved up:</span><span>${fmtInt(last.netWorthRentNoInvest)}</span></div>
                      <div className="flex justify-between"><span>No taxes owed:</span><span className="text-green-600">$0</span></div>
                    </div>
                    <div className="border-t-2 border-amber-300 pt-3 mt-3 text-center">
                      <div className="text-xs text-muted mb-1">You walk away with:</div>
                      <div className="text-3xl font-bold text-amber-700">${fmtInt(last.netWorthRentNoInvest)}</div>
                    </div>
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-center">
                      <div className="text-xs font-bold text-red-800">⚠️ You miss out on ${fmtInt(Math.max(last.netWorthBuyAfterTax, last.netWorthRentAfterTax) - last.netWorthRentNoInvest)}</div>
                      <div className="text-[10px] text-red-700">compared to the best option above</div>
                    </div>
                  </div>
                </div>
                <div className={`mt-5 p-4 rounded-xl text-center font-bold ${calcs.buyIsBetter ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-blue-100 text-blue-800 border-2 border-blue-300'}`}>
                  <div className="text-lg">
                    {calcs.buyIsBetter
                      ? `🏆 Buying wins by $${fmtInt(calcs.wealthDifference)} after ${yearsToStay} years`
                      : `🏆 Renting + investing wins by $${fmtInt(calcs.wealthDifference)} after ${yearsToStay} years`
                    }
                  </div>
                  <div className="text-sm font-normal mt-1 opacity-80">
                    (after all taxes and selling costs)
                  </div>
                  <div className={`text-sm font-medium mt-2 ${calcs.buyIsBetter ? 'text-green-700' : 'text-blue-700'}`}>
                    That ${fmtInt(calcs.wealthDifference)} difference is equivalent to {diffMonths} months of rent
                    {nextDownPct > 0 && ` or enough to put ${nextDownPct}% down on your next home`}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* D) Affordability Check */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={3} total={5} icon={Shield} title="Can You Comfortably Afford This Home?" type="result" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className={`rounded-xl p-5 text-center border ${ratioColor(calcs.frontEnd, 28)}`}>
              <div className="flex justify-center mb-2">{ratioIcon(calcs.frontEnd, 28)}</div>
              <div className="text-xs opacity-75 mb-1">How Much of Your Paycheck Goes to Housing</div>
              <div className="text-3xl font-bold font-mono">{calcs.frontEnd.toFixed(1)}%</div>
              <div className="text-xs opacity-75 mt-1">You earn ${fmtInt(calcs.monthlyIncome)}/mo — housing would cost ${fmtInt(calcs.totalMonthlyBuyPreTax)}/mo</div>
              <div className="text-xs opacity-75 mt-0.5">Most banks want this under 28% to approve your loan</div>
              <div className="text-[10px] opacity-60 mt-2">This means {calcs.frontEnd.toFixed(1)}% of your monthly income goes to housing. Lenders prefer this under 28%.</div>
            </div>
            <div className={`rounded-xl p-5 text-center border ${ratioColor(calcs.backEnd, 36)}`}>
              <div className="flex justify-center mb-2">{ratioIcon(calcs.backEnd, 36)}</div>
              <div className="text-xs opacity-75 mb-1">How Much of Your Paycheck Goes to Housing + All Debts</div>
              <div className="text-3xl font-bold font-mono">{calcs.backEnd.toFixed(1)}%</div>
              <div className="text-xs opacity-75 mt-1">Housing ${fmtInt(calcs.totalMonthlyBuyPreTax)} + debts ${fmtInt(parseFloat(monthlyDebts) || 0)} = ${fmtInt(calcs.totalMonthlyBuyPreTax + (parseFloat(monthlyDebts) || 0))}/mo out of ${fmtInt(calcs.monthlyIncome)}/mo income</div>
              <div className="text-xs opacity-75 mt-0.5">Most banks want this under 36% to approve your loan</div>
            </div>
          </div>
          <div className={`rounded-xl p-5 text-center border-2 ${calcs.frontEnd <= 28 && calcs.backEnd <= 36 ? 'bg-green-50 border-green-400' : calcs.frontEnd <= 33 && calcs.backEnd <= 43 ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'}`}>
            {calcs.frontEnd <= 28 && calcs.backEnd <= 36 ? (
              <div>
                <div className="text-3xl mb-2">✅</div>
                <p className="text-green-800 font-bold text-lg mb-1">You&apos;re in great shape!</p>
                <p className="text-green-700 text-sm">You can comfortably afford this home. Your ratios are within standard lending guidelines.</p>
              </div>
            ) : calcs.frontEnd <= 33 && calcs.backEnd <= 43 ? (
              <div>
                <div className="text-3xl mb-2">⚠️</div>
                <p className="text-yellow-800 font-bold text-lg mb-1">It&apos;s tight — you might want to look at a lower price</p>
                <p className="text-yellow-700 text-sm">Some lenders may approve you, but consider a lower price or larger down payment to stay comfortable.</p>
              </div>
            ) : (
              <div>
                <div className="text-3xl mb-2">❌</div>
                <p className="text-red-800 font-bold text-lg mb-1">This might be too much — consider reducing the price</p>
                <p className="text-red-700 text-sm">This home may be out of your comfortable range. Consider a lower purchase price, larger down payment, or paying off debts first.</p>
              </div>
            )}
          </div>
        </div>

        {/* E) Break-Even Analysis */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <StepHeader step={4} total={5} icon={Scale} title="How Long Do You Need to Stay to Make Buying Worth It?" type="result" />
          <p className="text-sm text-muted mb-4 -mt-2">When you buy a home, you pay closing costs and agent fees. If you sell too soon, those fees can wipe out any profit. This section shows how long you need to stay for buying to make financial sense.</p>

          {/* Main verdict callout */}
          <div className={`mb-5 px-5 py-4 rounded-xl border-2 ${calcs.requiredAppreciation <= 3 ? 'bg-green-50 border-green-300' : calcs.requiredAppreciation <= 5 ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}`}>
            {calcs.requiredAppreciation <= 3 ? (
              <p className="text-sm font-medium text-green-800">
                ✅ <strong>Great news!</strong> Your home only needs to grow <strong>{calcs.requiredAppreciation.toFixed(1)}% per year</strong> in value for you to break even. That&apos;s below the US average of 3-4%, so the odds are in your favor.
              </p>
            ) : calcs.requiredAppreciation <= 5 ? (
              <p className="text-sm font-medium text-yellow-800">
                ⚡ Your home needs to grow <strong>{calcs.requiredAppreciation.toFixed(1)}% per year</strong> in value for you to break even — that&apos;s around the US average. Staying a bit longer would give you a bigger safety margin.
              </p>
            ) : (
              <p className="text-sm font-medium text-red-800">
                ⚠️ <strong>Heads up:</strong> Your home needs to grow <strong>{calcs.requiredAppreciation.toFixed(1)}% per year</strong> in value for you to break even — that&apos;s above the US average of 3-4%. You may want to stay longer or look at a lower price to reduce your risk.
              </p>
            )}
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-background rounded-xl p-4">
              <div className="text-xs font-semibold text-dark mb-2">After {yearsToStay} years, you&apos;ll have paid off:</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmtInt(calcs.principalPaidAtEnd)}</div>
              <div className="text-xs text-muted mt-1">of your ${fmtInt(loanAmount)} loan. This is money you keep as equity when you sell.</div>
            </div>
            <div className="bg-background rounded-xl p-4">
              <div className="text-xs font-semibold text-dark mb-2">To not lose money, your home needs to sell for at least:</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmtInt(calcs.breakEvenSalePrice)}</div>
              <div className="text-xs text-muted mt-1">This covers paying off your remaining loan (${fmtInt(calcs.remainingBalAtEnd)}) plus {sellClosingCostPct}% in selling fees.</div>
            </div>
            <div className="bg-background rounded-xl p-4">
              <div className="text-xs font-semibold text-dark mb-2">If your home grows at {homeAppreciation}% per year, it would be worth:</div>
              <div className="text-2xl font-bold font-mono text-dark">${fmtInt(calcs.homeValueAtEnd)}</div>
              <div className="text-xs text-muted mt-1">After paying everything off, you&apos;d walk away with about <strong>${fmtInt(calcs.netProceedsFromSale)}</strong>.</div>
            </div>
          </div>

          {/* What if you stay longer or shorter */}
          <div className="pt-4 border-t border-card-border/50">
            <h3 className="text-sm font-semibold text-dark mb-2">What if you stay longer or shorter?</h3>
            <p className="text-xs text-muted mb-3">The longer you stay, the easier it is to break even. The percentage below shows how fast your home&apos;s value needs to grow each year — lower is better. Green means you&apos;re likely fine, yellow means it&apos;s close, red means it&apos;s risky.</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[3, 5, 7, 10, 15].map((yr) => {
                const endMo = Math.min(yr * 12, calcs.schedule.length);
                const remBal = endMo > 0 && calcs.schedule[endMo - 1] ? calcs.schedule[endMo - 1].balance : loanAmount;
                const bep = (remBal + down) / (1 - (parseFloat(sellClosingCostPct) || 6) / 100);
                const reqApp = yr > 0 ? (Math.pow(bep / price, 1 / yr) - 1) * 100 : 0;
                return (
                  <div key={yr} className={`rounded-lg p-3 text-center ${yr === yearsToStay ? 'ring-2 ring-primary bg-primary/5' : 'bg-background'}`}>
                    <div className="text-sm font-bold text-dark">Stay {yr} years</div>
                    <div className={`text-lg font-mono font-bold ${reqApp <= 3 ? 'text-green-700' : reqApp <= 5 ? 'text-yellow-700' : 'text-red-700'}`}>
                      {reqApp.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-muted">growth needed per year</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* F) Amortization Schedule (Collapsible) */}
        <div className="bg-card border border-card-border rounded-2xl shadow-sm">
          <button
            onClick={() => setShowAmort(!showAmort)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-background/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 flex items-center gap-1.5"><Calculator className="w-4 h-4" />📊 Result 5 of 5</span>
              <span className="text-2xl sm:text-3xl font-bold text-dark">Your Monthly Mortgage Payment Schedule ({calcs.schedule.length} months)</span>
            </div>
            {showAmort ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
          </button>
          {showAmort && (
            <div className="px-6 pb-6">
              {/* Wow stat */}
              {calcs.schedule.length > 0 && (() => {
                const totalInterest = calcs.schedule[calcs.schedule.length - 1].cumulativeInterest;
                const interestToLoanRatio = loanAmount > 0 ? ((totalInterest / loanAmount) * 100).toFixed(0) : '0';
                return (
                  <div className="mb-4 px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
                    <p className="text-sm font-medium text-amber-900">
                      💡 <strong>Did you know?</strong> Over {loanTerm} years, you&apos;ll pay <strong className="font-mono">${fmtInt(totalInterest)}</strong> in interest — that&apos;s <strong>{interestToLoanRatio}%</strong> on top of the <strong className="font-mono">${fmtInt(loanAmount)}</strong> you borrowed!
                    </p>
                  </div>
                );
              })()}
              <p className="text-xs text-muted mb-4">This shows how your monthly mortgage payment is split between paying off your loan (principal) and paying the bank&apos;s fee (interest). In the early years, most of your payment goes to interest. Over time, more goes to principal.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-card-border bg-background">
                      <th className="py-2 px-2 text-left text-muted font-medium">Month</th>
                      <th className="py-2 px-2 text-right text-muted font-medium">
                        <div>Payment</div>
                        <div className="text-[9px] font-normal opacity-70">your fixed monthly payment amount</div>
                      </th>
                      <th className="py-2 px-2 text-right text-muted font-medium">
                        <div>Principal</div>
                        <div className="text-[9px] font-normal opacity-70">goes toward paying off your loan (you keep this as equity!)</div>
                      </th>
                      <th className="py-2 px-2 text-right text-muted font-medium">
                        <div>Interest</div>
                        <div className="text-[9px] font-normal opacity-70">goes to the bank as their fee for lending you money</div>
                      </th>
                      <th className="py-2 px-2 text-right text-muted font-medium">
                        <div>Balance</div>
                        <div className="text-[9px] font-normal opacity-70">how much you still owe on your loan</div>
                      </th>
                      <th className="py-2 px-2 text-right text-muted font-medium">
                        <div>Total Interest Paid So Far</div>
                        <div className="text-[9px] font-normal opacity-70">running total of all interest paid to date</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {calcs.schedule.slice(0, showAllAmort ? undefined : 24).map((row) => (
                      <tr key={row.month} className={`border-b border-card-border/50 ${row.month % 12 === 0 ? 'bg-primary/5 font-semibold' : ''}`}>
                        <td className="py-1.5 px-2">{row.month}</td>
                        <td className="py-1.5 px-2 text-right">${fmt(row.payment)}</td>
                        <td className="py-1.5 px-2 text-right text-green-700">${fmt(row.principal)}</td>
                        <td className="py-1.5 px-2 text-right text-red-600">${fmt(row.interest)}</td>
                        <td className="py-1.5 px-2 text-right">${fmtInt(row.balance)}</td>
                        <td className="py-1.5 px-2 text-right text-muted">${fmtInt(row.cumulativeInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showAllAmort && calcs.schedule.length > 24 && (
                <button onClick={() => setShowAllAmort(true)} className="mt-4 w-full py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                  Show All {calcs.schedule.length} Months
                </button>
              )}
              {showAllAmort && (
                <button onClick={() => setShowAllAmort(false)} className="mt-4 w-full py-2 text-sm font-medium text-muted bg-background hover:bg-card-border/30 rounded-lg transition-colors">
                  Collapse to 24 Months
                </button>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">📖 Want to Learn More?</h2>
          <p className="text-muted text-sm mb-2 max-w-2xl mx-auto">
            Explore our comprehensive guides to understand every aspect of the rent vs. buy decision.
          </p>
          <p className="text-sm italic text-muted/80 mb-6 max-w-xl mx-auto">
            &ldquo;The best time to understand your finances is before you make the biggest purchase of your life.&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/rent-or-buy/guides/first-time-buyer" className="btn-primary inline-flex items-center gap-2">
              📚 First-Time Buyer Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/rent-or-buy/guides/rent-vs-buy-factors" className="btn-secondary inline-flex items-center gap-2">
              🔑 Key Rent vs Buy Factors <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/rent-or-buy/resources" className="btn-secondary inline-flex items-center gap-2">
              🔗 Free Resources <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <AdBanner />

        {/* ═══════ TOOLS & RESOURCES ═══════ */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            &#128736;&#65039; Tools &amp; Resources
          </h2>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-card-border text-dark rounded-lg text-sm font-medium hover:bg-background transition-colors">
              &#128424;&#65039; Print Results
            </button>
            <button onClick={handleSaveScenario} className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-card-border text-dark rounded-lg text-sm font-medium hover:bg-background transition-colors">
              &#128190; Save This Scenario
            </button>
            <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-card-border text-dark rounded-lg text-sm font-medium hover:bg-background transition-colors">
              &#128279; Share Link
            </button>
          </div>

          {/* Saved Scenarios Comparison */}
          {savedScenarios.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-dark mb-2">Your Saved Scenarios</h3>
              <p className="text-xs text-muted mb-3">Click any scenario to load it back into the calculator. This lets you switch between different homes or assumptions and compare.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-card-border bg-background">
                      <th className="py-2 px-3 text-left text-muted font-medium">Scenario</th>
                      <th className="py-2 px-3 text-right text-muted font-medium">Monthly Buy</th>
                      <th className="py-2 px-3 text-right text-muted font-medium">Monthly Rent</th>
                      <th className="py-2 px-3 text-center text-muted font-medium">Verdict</th>
                      <th className="py-2 px-3 text-right text-muted font-medium">Wealth Difference</th>
                      <th className="py-2 px-3 text-center text-muted font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {savedScenarios.map((s, i) => (
                      <tr key={i} className="border-b border-card-border/50 hover:bg-primary/5 cursor-pointer transition-colors" onClick={() => handleLoadScenario(i)}>
                        <td className="py-2 px-3 font-sans">
                          <div className="font-medium text-primary underline">{s.name}</div>
                          <div className="text-[10px] text-muted">Click to load</div>
                        </td>
                        <td className="py-2 px-3 text-right">${fmt(s.monthlyBuy)}</td>
                        <td className="py-2 px-3 text-right">${fmt(s.monthlyRent)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${s.verdict === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {s.verdict}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">${fmtInt(s.wealthDiff)}</td>
                        <td className="py-2 px-3 text-center">
                          <button onClick={(e) => { e.stopPropagation(); setSavedScenarios(prev => prev.filter((_, idx) => idx !== i)); }} className="text-red-500 hover:text-red-700 text-xs font-medium">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setSavedScenarios([])} className="mt-3 text-xs text-red-600 hover:text-red-800 font-medium">
                Clear All Scenarios
              </button>
            </div>
          )}

          {/* Programs That Could Help */}
          <div>
            <h3 className="text-sm font-bold text-dark mb-3">Programs That Could Help You</h3>
            <div className="space-y-3">
              {downPct < 20 && (
                <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                  <strong>FHA Loans:</strong> If your down payment is less than 20%, FHA loans allow as little as 3.5% down with more flexible credit requirements. Talk to your lender about FHA options.
                </div>
              )}
              {downPct <= 3.5 && (
                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                  <strong>Did you know?</strong> Some conventional loans allow as little as 3% down payment. Ask your lender about Fannie Mae HomeReady or Freddie Mac Home Possible programs.
                </div>
              )}
              <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-800">
                <strong>State &amp; Local Assistance:</strong> Most states offer down payment assistance programs for first-time buyers. Search &quot;[your state] first-time homebuyer programs&quot; to find grants and low-interest loans.
              </div>
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <strong>First-Time Buyer?</strong> Check if you qualify for the first-time homebuyer tax credit and other federal programs at <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="underline font-medium">HUD.gov</a>.
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted text-center py-4">
          <p><strong>DISCLAIMER:</strong> All calculations, projections, and analysis on this website are estimates for informational and educational purposes only. This is NOT financial, tax, legal, or real estate advice. Results are based on assumptions that may not reflect your actual situation. You use this tool entirely at your own risk. ZAXIS Ventures LLC, its owners, employees, and affiliates accept no responsibility or liability whatsoever for any financial decisions you make based on information from this website. Always consult qualified professionals before making real estate or investment decisions. By using this site, you agree to our <a href="/terms" className="underline">Terms of Use</a> and <a href="/rent-or-buy/disclaimer" className="underline">Disclaimer</a>.</p>
        </div>

      </div>
    </div>
  );
}
