'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import { CheckCircle, Circle, ChevronDown, ChevronUp, RotateCcw, ArrowRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  explain?: string;
}

interface Phase {
  title: string;
  timing: string;
  items: ChecklistItem[];
}

const PHASES: Phase[] = [
  {
    title: 'Get Your Finances Ready',
    timing: '6-12 months before',
    items: [
      { id: 'p1-credit', label: 'Check your credit score', explain: 'You can check for free at annualcreditreport.com. You get one free report from each bureau (Equifax, Experian, TransUnion) per year.' },
      { id: 'p1-debt', label: 'Pay down high-interest debt', explain: 'Focus on credit card debt first. Lower debt means a better debt-to-income ratio, which helps you qualify for more.' },
      { id: 'p1-save', label: 'Save for down payment', explain: 'Typically 3.5-20% of the home price. FHA loans require as little as 3.5%, but 20% avoids PMI.' },
      { id: 'p1-emergency', label: 'Build emergency fund (3-6 months of expenses)', explain: 'Lenders want to see reserves. Plus, homeownership comes with unexpected costs.' },
      { id: 'p1-nocredit', label: 'Avoid opening new credit accounts', explain: 'New credit inquiries can temporarily lower your score. Wait until after closing.' },
      { id: 'p1-docs', label: 'Gather financial documents', explain: 'You will need 2 years of tax returns, recent pay stubs, 2-3 months of bank statements, and W-2s.' },
    ],
  },
  {
    title: 'Get Pre-Approved',
    timing: '2-3 months before',
    items: [
      { id: 'p2-research', label: 'Research mortgage lenders (get at least 3 quotes)', explain: 'Rates and fees vary significantly between lenders. Even a 0.25% rate difference saves thousands over the life of the loan.' },
      { id: 'p2-apply', label: 'Submit pre-approval application' },
      { id: 'p2-letter', label: 'Receive pre-approval letter', explain: 'This letter tells sellers you are a serious, qualified buyer.' },
      { id: 'p2-understand', label: 'Understand your budget and loan terms', explain: 'Just because you qualify for a certain amount does not mean you should spend it all. Leave room for comfort.' },
    ],
  },
  {
    title: 'Find Your Home',
    timing: 'Active search',
    items: [
      { id: 'p3-agent', label: 'Hire a buyer\'s real estate agent', explain: 'Typically free for buyers - the seller usually pays the agent commissions. Your agent advocates for your interests.' },
      { id: 'p3-musthaves', label: 'Define your must-haves vs nice-to-haves', explain: 'Be realistic about needs (bedrooms, location, budget) vs wants (pool, finished basement). This prevents buyer fatigue.' },
      { id: 'p3-tour', label: 'Start touring homes' },
      { id: 'p3-neighborhood', label: 'Research neighborhoods', explain: 'Check school ratings, commute times, crime stats, nearby amenities, and future development plans.' },
    ],
  },
  {
    title: 'Make an Offer',
    timing: 'When you find the one',
    items: [
      { id: 'p4-found', label: 'Found a home you love' },
      { id: 'p4-price', label: 'Work with agent to determine offer price', explain: 'Your agent will pull comparable sales (comps) to help you make a competitive but fair offer.' },
      { id: 'p4-submit', label: 'Submit offer with earnest money', explain: 'Earnest money is a good faith deposit, typically 1-3% of the purchase price. It shows the seller you are serious.' },
      { id: 'p4-negotiate', label: 'Negotiate if needed' },
      { id: 'p4-accepted', label: 'Offer accepted!' },
    ],
  },
  {
    title: 'Due Diligence',
    timing: '2-4 weeks',
    items: [
      { id: 'p5-inspection', label: 'Schedule home inspection', explain: 'A professional examines the home for structural, electrical, plumbing, and other issues. Costs $300-500 and is worth every penny.' },
      { id: 'p5-review', label: 'Review inspection report and negotiate repairs', explain: 'You can ask the seller to fix issues, give you a credit, or lower the price. Your agent will help negotiate.' },
      { id: 'p5-insurance', label: 'Get homeowner\'s insurance quotes', explain: 'Required by your lender. Shop around for the best rates and coverage.' },
      { id: 'p5-appraisal', label: 'Schedule appraisal', explain: 'The bank sends an appraiser to verify the home is worth what you are paying. This protects both you and the lender.' },
    ],
  },
  {
    title: 'Loan Processing',
    timing: '2-4 weeks',
    items: [
      { id: 'p6-docs', label: 'Submit all documents to lender', explain: 'Be prepared to provide updated bank statements, employment verification, and any additional documentation requested.' },
      { id: 'p6-lock', label: 'Lock in your interest rate', explain: 'Rate lock guarantees your rate will not change before closing, typically for 30-60 days. Rates can move daily.' },
      { id: 'p6-respond', label: 'Respond quickly to lender requests', explain: 'Delays in providing documents can push back your closing date. Check email daily.' },
      { id: 'p6-disclosure', label: 'Receive Closing Disclosure', explain: 'This final document shows all loan terms, monthly payment, and closing costs. You must receive it at least 3 business days before closing. Review it carefully.' },
    ],
  },
  {
    title: 'Closing Day',
    timing: 'The big day',
    items: [
      { id: 'p7-walkthrough', label: 'Do final walk-through of the home', explain: 'Verify that agreed-upon repairs were made and the home is in the expected condition.' },
      { id: 'p7-funds', label: 'Bring certified check or wire closing funds', explain: 'Your lender will tell you the exact amount. Never wire money based on email instructions alone - always verify by phone.' },
      { id: 'p7-sign', label: 'Sign all documents (takes 1-2 hours)', explain: 'You will sign a LOT of papers. Take your time and ask questions about anything you do not understand.' },
      { id: 'p7-keys', label: 'Receive your keys!' },
    ],
  },
  {
    title: 'After You Move In',
    timing: 'First few weeks',
    items: [
      { id: 'p8-locks', label: 'Change locks', explain: 'You do not know who has copies of the old keys. This is an easy and inexpensive safety measure.' },
      { id: 'p8-utilities', label: 'Set up utilities (water, electric, gas, internet)' },
      { id: 'p8-address', label: 'Update your address everywhere', explain: 'USPS mail forwarding, DMV, bank, employer, subscriptions, voter registration, insurance.' },
      { id: 'p8-homestead', label: 'File homestead exemption', explain: 'Available in most states, this can significantly reduce your property taxes. Check your county assessor\'s website for deadlines.' },
    ],
  },
];

const STORAGE_KEY = 'rent-or-buy-checklist';

function getAllItemIds(): string[] {
  return PHASES.flatMap(p => p.items.map(i => i.id));
}

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 0: true });
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setChecked(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
      } catch {
        // ignore
      }
    }
  }, [checked, mounted]);

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const togglePhase = useCallback((index: number) => {
    setExpandedPhases(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setChecked({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const allIds = getAllItemIds();
  const totalItems = allIds.length;
  const completedItems = allIds.filter(id => checked[id]).length;
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="hero-section mb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
            <CheckCircle className="w-4 h-4" />
            Interactive Checklist
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Home Buying Checklist
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Your complete step-by-step guide from saving to moving in. Check items off as you go — your progress is saved automatically.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

      {/* Progress Bar */}
      <div className="bg-card border border-card-border rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-dark">
            {completedItems} of {totalItems} completed ({progressPct}%)
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
        <div className="w-full h-3 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {progressPct === 100 && (
          <p className="text-sm text-secondary font-semibold mt-2 text-center">
            Congratulations! You have completed every step!
          </p>
        )}
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {PHASES.map((phase, pi) => {
          const phaseCompleted = phase.items.filter(i => checked[i.id]).length;
          const phaseTotal = phase.items.length;
          const isExpanded = expandedPhases[pi] ?? false;
          const allDone = phaseCompleted === phaseTotal;

          return (
            <div key={pi} className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => togglePhase(pi)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    allDone ? 'bg-secondary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {allDone ? <CheckCircle className="w-4 h-4" /> : pi + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-dark">
                      Phase {pi + 1}: {phase.title}
                    </h3>
                    <p className="text-xs text-muted">{phase.timing} &middot; {phaseCompleted}/{phaseTotal} done</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-2 border-t border-card-border pt-4">
                  {phase.items.map(item => (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors text-left"
                      >
                        {checked[item.id] ? (
                          <CheckCircle className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-card-border mt-0.5 shrink-0" />
                        )}
                        <span className={`text-sm ${checked[item.id] ? 'line-through text-muted/50' : 'text-dark'}`}>
                          {item.label}
                        </span>
                      </button>
                      {item.explain && (
                        <p className="ml-10 text-xs text-muted/70 leading-relaxed -mt-1 mb-1">{item.explain}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AdBanner />

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-muted mb-3">Not sure how much you can borrow?</p>
        <Link href="/rent-or-buy/prequalify" className="btn-primary inline-flex items-center gap-2">
          Pre-Qualification Estimator <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      </div>
    </div>
  );
}
