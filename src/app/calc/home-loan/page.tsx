'use client';

import { useState, useMemo } from 'react';

function InputField({ label, value, onChange, step = '1', prefix = '', suffix = '', hint = '', readOnly = false }: {
  label: string; value: string; onChange?: (v: string) => void; step?: string; prefix?: string; suffix?: string; hint?: string; readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${readOnly ? 'bg-background cursor-not-allowed' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">{suffix}</span>}
      </div>
      {hint && <p className="text-[10px] text-muted/70 mt-0.5">{hint}</p>}
    </div>
  );
}

export default function HomeLoanPage() {
  // Section 1: Income
  const [borrowerIncome, setBorrowerIncome] = useState('120000');
  const [coBorrowerIncome, setCoBorrowerIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [currentRent, setCurrentRent] = useState('2500');
  const [incomeTaxBracket, setIncomeTaxBracket] = useState('30');

  // Section 2: Home Price & Down Payment
  const [purchasePrice, setPurchasePrice] = useState('750000');
  const [downPayment, setDownPayment] = useState('150000');
  const [downMode, setDownMode] = useState<'$' | '%'>('$');

  // Section 3: Loan Details
  const [hasSecondLoan, setHasSecondLoan] = useState(false);
  const [loan1Amount, setLoan1Amount] = useState('');
  const [loan2Amount, setLoan2Amount] = useState('');
  const [rate1, setRate1] = useState('6.5');
  const [rate2, setRate2] = useState('7.25');
  const [term, setTerm] = useState('30');
  const [term2, setTerm2] = useState('15');
  const [pmiRate, setPmiRate] = useState('0.5');

  // Section 4: Monthly Costs
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.0');
  const [homeInsurance, setHomeInsurance] = useState('200');
  const [hoa, setHoa] = useState('0');
  const [maintenanceCost, setMaintenanceCost] = useState('200');

  // Section 7: Break-Even
  const [yearsToStay, setYearsToStay] = useState('5');
  const [closingCostsPct, setClosingCostsPct] = useState('6');

  // Amortization display
  const [showAllAmort, setShowAllAmort] = useState(false);

  // Derived values (not state)
  const price = parseFloat(purchasePrice) || 0;
  const downRaw = parseFloat(downPayment) || 0;
  const down = downMode === '%' ? (price * downRaw / 100) : downRaw;
  const downPct = price > 0 ? (down / price * 100) : 0;
  const amountToFinance = Math.max(0, price - down);

  const firstMortgage = hasSecondLoan ? (parseFloat(loan1Amount) || 0) : amountToFinance;
  const secondMortgage = hasSecondLoan ? (parseFloat(loan2Amount) || 0) : 0;
  const loanSumDiff = hasSecondLoan ? (firstMortgage + secondMortgage - amountToFinance) : 0;
  const loansMatch = Math.abs(loanSumDiff) < 1;

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const calcs = useMemo(() => {
    const r1 = (parseFloat(rate1) || 0) / 100 / 12;
    const r2 = (parseFloat(rate2) || 0) / 100 / 12;
    const n1 = (parseFloat(term) || 30) * 12;
    const n2 = (parseFloat(term2) || 15) * 12;
    const taxRate = (parseFloat(propertyTaxRate) || 0) / 100;
    const insurance = parseFloat(homeInsurance) || 0;
    const pmi = (parseFloat(pmiRate) || 0) / 100;
    const taxBracket = (parseFloat(incomeTaxBracket) || 0) / 100;
    const income1 = parseFloat(borrowerIncome) || 0;
    const income2 = parseFloat(coBorrowerIncome) || 0;
    const otherInc = parseFloat(otherIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const rent = parseFloat(currentRent) || 0;
    const hoaFee = parseFloat(hoa) || 0;
    const maintenance = parseFloat(maintenanceCost) || 0;
    const stayYears = parseFloat(yearsToStay) || 5;
    const closingPct = (parseFloat(closingCostsPct) || 6) / 100;

    const calcPayment = (principal: number, monthlyRate: number, months: number) => {
      if (principal <= 0 || months <= 0) return 0;
      if (monthlyRate === 0) return principal / months;
      return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    };

    const payment1 = calcPayment(firstMortgage, r1, n1);
    const payment2 = calcPayment(secondMortgage, r2, n2);
    const monthlyTax = price * taxRate / 12;
    const monthlyPMI = downPct < 20 ? (firstMortgage * pmi / 12) : 0;
    const totalMonthly = payment1 + payment2 + monthlyTax + insurance + monthlyPMI + hoaFee + maintenance;

    // Ratios
    const totalMonthlyIncome = (income1 + income2 + otherInc) / 12;
    const frontEnd = totalMonthlyIncome > 0 ? (totalMonthly / totalMonthlyIncome) * 100 : 0;
    const backEnd = totalMonthlyIncome > 0 ? ((totalMonthly + debts) / totalMonthlyIncome) * 100 : 0;

    // After-tax analysis (first month approximation)
    const interest1 = firstMortgage * r1;
    const principal1Pay = payment1 - interest1;
    const interest2 = secondMortgage * r2;
    const principal2Pay = payment2 - interest2;

    const deductible = interest1 + interest2 + monthlyTax;
    const taxSavings = deductible * taxBracket;
    const afterTaxInterest1 = interest1 * (1 - taxBracket);
    const afterTaxInterest2 = interest2 * (1 - taxBracket);
    const afterTaxPropertyTax = monthlyTax * (1 - taxBracket);
    const totalPreTax = totalMonthly;
    const totalAfterTax = totalPreTax - taxSavings;

    // Amortization schedule
    const schedule: Array<{
      month: number;
      payment1: number; principal1: number; interest1: number; balance1: number;
      payment2: number; principal2: number; interest2: number; balance2: number;
      cumulativeInterest: number;
      rentComparison: number;
    }> = [];

    let bal1 = firstMortgage;
    let bal2 = secondMortgage;
    let cumInterest = 0;
    const maxMonths = Math.max(n1, n2);

    for (let m = 1; m <= maxMonths; m++) {
      const int1 = m <= n1 && bal1 > 0 ? bal1 * r1 : 0;
      const prin1 = m <= n1 && bal1 > 0 ? payment1 - int1 : 0;
      bal1 = Math.max(0, bal1 - prin1);

      const int2 = m <= n2 && bal2 > 0 ? bal2 * r2 : 0;
      const prin2 = m <= n2 && bal2 > 0 ? payment2 - int2 : 0;
      bal2 = Math.max(0, bal2 - prin2);

      cumInterest += int1 + int2;
      const rentMonth = rent * Math.pow(1.02, Math.floor((m - 1) / 12));

      schedule.push({
        month: m,
        payment1: m <= n1 ? payment1 : 0,
        principal1: prin1, interest1: int1, balance1: bal1,
        payment2: m <= n2 ? payment2 : 0,
        principal2: prin2, interest2: int2, balance2: bal2,
        cumulativeInterest: cumInterest,
        rentComparison: rentMonth,
      });
    }

    // Break-even
    const stayMonths = Math.min(stayYears * 12, schedule.length);
    let principalPaid = 0;
    for (let i = 0; i < stayMonths; i++) {
      principalPaid += schedule[i].principal1 + schedule[i].principal2;
    }
    const remainingBalance1 = stayMonths > 0 && stayMonths <= schedule.length ? schedule[stayMonths - 1].balance1 : 0;
    const remainingBalance2 = stayMonths > 0 && stayMonths <= schedule.length ? schedule[stayMonths - 1].balance2 : 0;
    const breakEvenSalePrice = (remainingBalance1 + remainingBalance2 + down) / (1 - closingPct);
    const requiredAppreciation = stayYears > 0 ? (Math.pow(breakEvenSalePrice / price, 1 / stayYears) - 1) * 100 : 0;

    return {
      payment1, payment2, totalMonthly, monthlyTax, insurance, monthlyPMI,
      frontEnd, backEnd, totalMonthlyIncome,
      interest1, principal1Pay, interest2, principal2Pay,
      afterTaxInterest1, afterTaxInterest2, afterTaxPropertyTax,
      taxSavings, totalPreTax, totalAfterTax, deductible,
      schedule, principalPaid, breakEvenSalePrice, requiredAppreciation,
      rent, taxBracket, hoaFee, maintenance, n1,
    };
  }, [firstMortgage, secondMortgage, down, downPct, price, rate1, term, rate2, term2, propertyTaxRate, homeInsurance, pmiRate, incomeTaxBracket, borrowerIncome, coBorrowerIncome, otherIncome, monthlyDebts, currentRent, yearsToStay, closingCostsPct, hoa, maintenanceCost]);

  const ratioColor = (val: number, threshold: number) => {
    if (val <= threshold) return 'text-green-700 bg-green-50';
    if (val <= threshold + 5) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Home Loan Calculator</h1>
        <p className="text-muted">Complete mortgage analysis: monthly payments, affordability ratios, after-tax savings, break-even analysis, and amortization schedule.</p>
      </div>

      <div className="space-y-6">

        {/* SECTION 1: Your Income */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
            Your Income
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <InputField label="Borrower Annual Income" value={borrowerIncome} onChange={setBorrowerIncome} prefix="$" />
            <InputField label="Co-Borrower Income" value={coBorrowerIncome} onChange={setCoBorrowerIncome} prefix="$" hint="Leave blank if none" />
            <InputField label="Other Annual Income" value={otherIncome} onChange={setOtherIncome} prefix="$" hint="Rental, freelance, dividends" />
            <InputField label="Monthly Debts" value={monthlyDebts} onChange={setMonthlyDebts} prefix="$" hint="Auto + student + credit cards" />
            <InputField label="Current Rent" value={currentRent} onChange={setCurrentRent} prefix="$" hint="For comparison later" />
            <InputField label="Income Tax Bracket" value={incomeTaxBracket} onChange={setIncomeTaxBracket} step="1" suffix="%" hint="Federal + state combined" />
          </div>
        </div>

        {/* SECTION 2: Home Price & Down Payment */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
            Home Price &amp; Down Payment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  className="flex-1 min-w-0 px-3 py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-[10px] text-muted/70 mt-0.5">
                {downMode === '$' ? `= ${downPct.toFixed(1)}% of home price` : `= $${fmtInt(down)}`}
              </p>
            </div>
            <div className="flex items-end">
              <div className="bg-background rounded-lg p-3 w-full text-center">
                <div className="text-xs text-muted">Total Down</div>
                <div className="text-lg font-bold font-mono text-dark">${fmtInt(down)}</div>
                <div className="text-[10px] text-muted">{downPct.toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-end">
              <div className="bg-primary/10 rounded-lg p-3 w-full text-center">
                <div className="text-xs text-muted">Amount to Finance</div>
                <div className="text-lg font-bold font-mono text-primary">${fmtInt(amountToFinance)}</div>
              </div>
            </div>
          </div>
          {downPct < 20 && downPct > 0 && (
            <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Down payment is less than 20% &mdash; you will likely need to pay Private Mortgage Insurance (PMI).
            </div>
          )}
        </div>

        {/* SECTION 3: Loan Details */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
            Loan Details
          </h2>

          {!hasSecondLoan && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Loan Amount</label>
                <div className="px-3 py-2 border border-card-border rounded-lg text-sm font-mono bg-background">
                  ${fmtInt(amountToFinance)}
                </div>
                <p className="text-[10px] text-muted/70 mt-0.5">Auto-calculated from price - down</p>
              </div>
              <InputField label="Interest Rate" value={rate1} onChange={setRate1} step="0.125" suffix="%" />
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Term</label>
                <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="5">5 yr (5/1 ARM)</option>
                  <option value="7">7 yr (7/1 ARM)</option>
                  <option value="10">10 yr (10/1 ARM)</option>
                  <option value="15">15 yr fixed</option>
                  <option value="20">20 yr fixed</option>
                  <option value="25">25 yr fixed</option>
                  <option value="30">30 yr fixed</option>
                  <option value="40">40 yr fixed</option>
                </select>
              </div>
              {downPct < 20 && (
                <InputField label="PMI Rate (annual)" value={pmiRate} onChange={setPmiRate} step="0.1" suffix="%" hint="Typically 0.3% - 1.5%" />
              )}
            </div>
          )}

          {hasSecondLoan && (
            <>
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-dark uppercase tracking-wide mb-3">1st Loan (Primary Mortgage)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InputField label="1st Loan Amount" value={loan1Amount} onChange={setLoan1Amount} prefix="$" step="10000" />
                  <InputField label="Interest Rate" value={rate1} onChange={setRate1} step="0.125" suffix="%" />
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Term</label>
                    <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="5">5 yr (5/1 ARM)</option>
                      <option value="7">7 yr (7/1 ARM)</option>
                      <option value="10">10 yr (10/1 ARM)</option>
                      <option value="15">15 yr fixed</option>
                      <option value="20">20 yr fixed</option>
                      <option value="25">25 yr fixed</option>
                      <option value="30">30 yr fixed</option>
                      <option value="40">40 yr fixed</option>
                    </select>
                  </div>
                  {downPct < 20 && (
                    <InputField label="PMI Rate (annual)" value={pmiRate} onChange={setPmiRate} step="0.1" suffix="%" hint="Typically 0.3% - 1.5%" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-dark uppercase tracking-wide mb-3">2nd Loan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InputField label="2nd Loan Amount" value={loan2Amount} onChange={setLoan2Amount} prefix="$" step="5000" />
                  <InputField label="Interest Rate" value={rate2} onChange={setRate2} step="0.125" suffix="%" />
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Term</label>
                    <select value={term2} onChange={(e) => setTerm2(e.target.value)} className="w-full px-3 py-2 border border-card-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="5">5 years</option>
                      <option value="10">10 years</option>
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Validation bar */}
              <div className={`rounded-xl p-3 border-2 ${loansMatch ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="font-mono">
                    <span className="text-muted">1st</span> <strong>${fmtInt(firstMortgage)}</strong>
                    {' + '}
                    <span className="text-muted">2nd</span> <strong>${fmtInt(secondMortgage)}</strong>
                    {' = '}
                    <strong>${fmtInt(firstMortgage + secondMortgage)}</strong>
                  </div>
                  <div>
                    {loansMatch
                      ? <span className="text-green-700 font-medium">Matches amount to finance (${fmtInt(amountToFinance)})</span>
                      : <span className="text-amber-700 font-medium">Should equal ${fmtInt(amountToFinance)} (off by ${fmtInt(Math.abs(loanSumDiff))})</span>
                    }
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-card-border/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasSecondLoan} onChange={(e) => setHasSecondLoan(e.target.checked)} className="w-4 h-4 rounded border-card-border text-primary focus:ring-primary" />
              <span className="text-sm text-dark">Split into two loans</span>
              <span className="text-xs text-muted">(common for jumbo loans or to avoid PMI)</span>
            </label>
          </div>
        </div>

        {/* SECTION 4: Monthly Home Costs */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
            Monthly Home Costs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField label="Property Tax Rate (annual)" value={propertyTaxRate} onChange={setPropertyTaxRate} step="0.1" suffix="%" hint={`= $${fmtInt(price * (parseFloat(propertyTaxRate) || 0) / 100 / 12)}/mo`} />
            <InputField label="Home Insurance /mo" value={homeInsurance} onChange={setHomeInsurance} prefix="$" />
            <InputField label="HOA Fees /mo" value={hoa} onChange={setHoa} prefix="$" hint="$0 if no HOA" />
            <InputField label="Maintenance /mo" value={maintenanceCost} onChange={setMaintenanceCost} prefix="$" hint="Budget 1-2% of home value/year" />
          </div>
        </div>

        {/* Hide results if loan split doesn't add up */}
        {hasSecondLoan && !loansMatch && (
          <div className="rounded-xl p-6 border-2 border-amber-300 bg-amber-50 text-center">
            <p className="text-amber-800 font-medium">Fix loan amounts above before viewing results</p>
            <p className="text-sm text-amber-600 mt-1">1st Loan + 2nd Loan must equal the amount to finance (${fmtInt(amountToFinance)})</p>
          </div>
        )}

        {(!hasSecondLoan || loansMatch) && <>
        {/* SECTION 5: Loan Summary Results */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">5</span>
            Results &mdash; Loan Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-background rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Down Payment</div>
              <div className="text-lg font-bold font-mono text-dark">${fmtInt(down)}</div>
              <div className="text-xs text-muted">{downPct.toFixed(1)}%</div>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">1st Mortgage</div>
              <div className="text-lg font-bold font-mono text-dark">${fmtInt(firstMortgage)}</div>
              <div className="text-xs text-muted">${fmt(calcs.payment1)}/mo</div>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">2nd Mortgage</div>
              <div className="text-lg font-bold font-mono text-dark">${fmtInt(secondMortgage)}</div>
              <div className="text-xs text-muted">{secondMortgage > 0 ? `$${fmt(calcs.payment2)}/mo` : 'None'}</div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Total Monthly Payment</div>
              <div className="text-2xl font-bold font-mono text-primary">${fmt(calcs.totalMonthly)}</div>
              <div className="text-xs text-muted">P&I + Tax + Ins + PMI + HOA</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 text-center ${ratioColor(calcs.frontEnd, 28)}`}>
              <div className="text-xs opacity-75 mb-1">Front-End Ratio (Housing / Income)</div>
              <div className="text-2xl font-bold font-mono">{calcs.frontEnd.toFixed(1)}%</div>
              <div className="text-xs opacity-75 mt-1">Target: under 28% for most lenders</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${ratioColor(calcs.backEnd, 36)}`}>
              <div className="text-xs opacity-75 mb-1">Back-End Ratio (Housing + Debts / Income)</div>
              <div className="text-2xl font-bold font-mono">{calcs.backEnd.toFixed(1)}%</div>
              <div className="text-xs opacity-75 mt-1">Target: under 36% for most lenders</div>
            </div>
          </div>
        </div>

        {/* SECTION 6: After-Tax Analysis */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">6</span>
            After-Tax Monthly Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 text-muted font-medium">Component</th>
                  <th className="text-right py-2 text-muted font-medium">Pre-Tax</th>
                  <th className="text-right py-2 text-muted font-medium">After-Tax</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b border-card-border/50">
                  <td className="py-2">Interest (1st Mortgage)</td>
                  <td className="text-right">${fmt(calcs.interest1)}</td>
                  <td className="text-right text-green-700">${fmt(calcs.afterTaxInterest1)}</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2">Principal (1st Mortgage)</td>
                  <td className="text-right">${fmt(calcs.principal1Pay)}</td>
                  <td className="text-right">${fmt(calcs.principal1Pay)}</td>
                </tr>
                {secondMortgage > 0 && (
                  <>
                    <tr className="border-b border-card-border/50">
                      <td className="py-2">Interest (2nd Mortgage)</td>
                      <td className="text-right">${fmt(calcs.interest2)}</td>
                      <td className="text-right text-green-700">${fmt(calcs.afterTaxInterest2)}</td>
                    </tr>
                    <tr className="border-b border-card-border/50">
                      <td className="py-2">Principal (2nd Mortgage)</td>
                      <td className="text-right">${fmt(calcs.principal2Pay)}</td>
                      <td className="text-right">${fmt(calcs.principal2Pay)}</td>
                    </tr>
                  </>
                )}
                <tr className="border-b border-card-border/50">
                  <td className="py-2">Property Taxes</td>
                  <td className="text-right">${fmt(calcs.monthlyTax)}</td>
                  <td className="text-right text-green-700">${fmt(calcs.afterTaxPropertyTax)}</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-2">Home Insurance</td>
                  <td className="text-right">${fmt(calcs.insurance)}</td>
                  <td className="text-right">${fmt(calcs.insurance)}</td>
                </tr>
                {calcs.monthlyPMI > 0 && (
                  <tr className="border-b border-card-border/50">
                    <td className="py-2">PMI</td>
                    <td className="text-right">${fmt(calcs.monthlyPMI)}</td>
                    <td className="text-right">${fmt(calcs.monthlyPMI)}</td>
                  </tr>
                )}
                {calcs.hoaFee > 0 && (
                  <tr className="border-b border-card-border/50">
                    <td className="py-2">HOA Fees</td>
                    <td className="text-right">${fmt(calcs.hoaFee)}</td>
                    <td className="text-right">${fmt(calcs.hoaFee)}</td>
                  </tr>
                )}
                {calcs.maintenance > 0 && (
                  <tr className="border-b border-card-border/50">
                    <td className="py-2">Maintenance / Repairs</td>
                    <td className="text-right">${fmt(calcs.maintenance)}</td>
                    <td className="text-right">${fmt(calcs.maintenance)}</td>
                  </tr>
                )}
                <tr className="border-t-2 border-dark/20 font-bold">
                  <td className="py-3">Total Payment</td>
                  <td className="text-right">${fmt(calcs.totalPreTax)}</td>
                  <td className="text-right text-primary">${fmt(calcs.totalAfterTax)}</td>
                </tr>
                <tr className="bg-green-100 border-2 border-green-400">
                  <td className="py-3 pl-3 font-bold text-green-900 text-base">Monthly Tax Savings</td>
                  <td className="text-right"></td>
                  <td className="text-right pr-3 font-bold text-green-800 text-xl">-${fmt(calcs.taxSavings)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rent comparison */}
          <div className={`mt-6 p-6 rounded-2xl border-4 ${calcs.totalAfterTax <= calcs.rent ? 'bg-green-50 border-green-500 shadow-lg shadow-green-200/50' : 'bg-red-50 border-red-500 shadow-lg shadow-red-200/50'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className={`text-xl font-bold ${calcs.totalAfterTax <= calcs.rent ? 'text-green-800' : 'text-red-800'}`}>
                  {calcs.totalAfterTax <= calcs.rent ? 'CHEAPER than renting!' : 'MORE expensive than renting'}
                </span>
                <div className="text-sm text-muted mt-0.5">After-tax mortgage vs your current rent</div>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-bold font-mono ${calcs.totalAfterTax <= calcs.rent ? 'text-green-700' : 'text-red-700'}`}>
                  ${fmt(Math.abs(calcs.totalAfterTax - calcs.rent))}
                </span>
                <div className={`text-sm font-medium ${calcs.totalAfterTax <= calcs.rent ? 'text-green-600' : 'text-red-600'}`}>
                  per month {calcs.totalAfterTax <= calcs.rent ? 'savings' : 'extra'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-current/10">
              <div>
                <div className="text-xs text-muted">Your mortgage (after tax)</div>
                <div className="text-lg font-bold font-mono text-dark">${fmt(calcs.totalAfterTax)}/mo</div>
              </div>
              <div>
                <div className="text-xs text-muted">Your current rent</div>
                <div className="text-lg font-bold font-mono text-dark">${fmt(calcs.rent)}/mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: Break-Even Analysis */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">7</span>
            Break-Even Analysis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <InputField label="Years You Plan to Stay" value={yearsToStay} onChange={setYearsToStay} step="1" />
            <InputField label="Closing Costs on Sale" value={closingCostsPct} onChange={setClosingCostsPct} suffix="%" step="0.5" hint="Agent fees, title, etc." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Principal Paid in {yearsToStay} yrs</div>
              <div className="text-lg font-bold font-mono text-dark">${fmtInt(calcs.principalPaid)}</div>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <div className="text-xs text-muted mb-1">Break-Even Sale Price</div>
              <div className="text-lg font-bold font-mono text-dark">${fmtInt(calcs.breakEvenSalePrice)}</div>
              <div className="text-xs text-muted">to recover down payment after closing costs</div>
            </div>
            <div className={`rounded-xl p-4 text-center ${calcs.requiredAppreciation <= 3 ? 'bg-green-50' : calcs.requiredAppreciation <= 5 ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <div className="text-xs text-muted mb-1">Required Appreciation</div>
              <div className={`text-lg font-bold font-mono ${calcs.requiredAppreciation <= 3 ? 'text-green-700' : calcs.requiredAppreciation <= 5 ? 'text-yellow-700' : 'text-red-700'}`}>
                {calcs.requiredAppreciation.toFixed(2)}%/yr
              </div>
              <div className="text-xs text-muted">US avg is ~3-4%/yr</div>
            </div>
          </div>
        </div>

        {/* SECTION 8: Amortization Schedule */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">8</span>
            Amortization Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-card-border bg-background">
                  <th className="py-2 px-2 text-left text-muted font-medium">Month</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Payment</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Principal</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Interest</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Balance</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Cum. Interest</th>
                  <th className="py-2 px-2 text-right text-muted font-medium">Rent (2% inc/yr)</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {calcs.schedule.slice(0, showAllAmort ? undefined : 12).map((row) => (
                  <tr
                    key={row.month}
                    className={`border-b border-card-border/50 ${row.month % 12 === 0 ? 'bg-primary/5 font-semibold' : ''}`}
                  >
                    <td className="py-1.5 px-2">{row.month}</td>
                    <td className="py-1.5 px-2 text-right">${fmt(row.payment1 + row.payment2)}</td>
                    <td className="py-1.5 px-2 text-right text-green-700">${fmt(row.principal1 + row.principal2)}</td>
                    <td className="py-1.5 px-2 text-right text-red-600">${fmt(row.interest1 + row.interest2)}</td>
                    <td className="py-1.5 px-2 text-right">${fmtInt(row.balance1 + row.balance2)}</td>
                    <td className="py-1.5 px-2 text-right text-muted">${fmtInt(row.cumulativeInterest)}</td>
                    <td className="py-1.5 px-2 text-right text-blue-600">${fmt(row.rentComparison)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllAmort && calcs.schedule.length > 12 && (
            <button
              onClick={() => setShowAllAmort(true)}
              className="mt-4 w-full py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
            >
              Show All {calcs.schedule.length} Months
            </button>
          )}
          {showAllAmort && (
            <button
              onClick={() => setShowAllAmort(false)}
              className="mt-4 w-full py-2 text-sm font-medium text-muted bg-background hover:bg-card-border/30 rounded-lg transition-colors"
            >
              Collapse to 12 Months
            </button>
          )}
        </div>

        </>}

        {/* SECTION 9: Glossary */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">9</span>
            Glossary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="font-semibold text-dark">Principal &amp; Interest (P&amp;I)</dt>
              <dd className="text-muted">The portion of your monthly payment that goes toward paying down the loan balance (principal) and the cost of borrowing (interest).</dd>
            </div>
            <div>
              <dt className="font-semibold text-dark">PMI (Private Mortgage Insurance)</dt>
              <dd className="text-muted">Required when your down payment is less than 20%. Protects the lender if you default. Typically 0.3%-1.5% of the loan amount per year.</dd>
            </div>
            <div>
              <dt className="font-semibold text-dark">Front-End Ratio (Housing Ratio)</dt>
              <dd className="text-muted">Your total monthly housing cost divided by gross monthly income. Most lenders want this below 28%.</dd>
            </div>
            <div>
              <dt className="font-semibold text-dark">Back-End Ratio (DTI)</dt>
              <dd className="text-muted">Total monthly housing cost plus all other debts, divided by gross monthly income. Most lenders want this below 36% (some allow up to 43%).</dd>
            </div>
            <div>
              <dt className="font-semibold text-dark">ARM (Adjustable Rate Mortgage)</dt>
              <dd className="text-muted">A mortgage where the interest rate is fixed for an initial period (e.g., 5 years) then adjusts annually based on market rates.</dd>
            </div>
            <div>
              <dt className="font-semibold text-dark">Amortization</dt>
              <dd className="text-muted">The process of paying off a loan over time. Early payments are mostly interest; later payments are mostly principal.</dd>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
