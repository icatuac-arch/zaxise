'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'Can I buy a home with no money down?',
        answer: 'Yes, but your options are limited. VA loans (for military service members and veterans) and USDA loans (for eligible rural areas) offer zero down payment. FHA loans require just 3.5% down, and some conventional programs allow as little as 3% down. However, putting less than 20% down means you\'ll pay for mortgage insurance, which adds to your monthly cost. Some state and local programs also offer down payment assistance grants or forgivable loans for first-time buyers.',
      },
      {
        question: 'How much money do I need saved before I start the process?',
        answer: 'Plan for three buckets of savings: down payment (3.5-20% of the home price), closing costs (2-5% of the loan amount), and an emergency fund (3-6 months of living expenses including your new mortgage payment). For a $350,000 home with 10% down, that\'s roughly $35,000 down payment + $10,000 closing costs + $15,000 emergency fund = $60,000 minimum. You may be able to negotiate seller concessions to help cover closing costs.',
      },
      {
        question: 'What credit score do I need to buy a home?',
        answer: 'The minimum depends on the loan type: FHA loans accept scores as low as 580 (or 500 with 10% down), conventional loans typically require 620+, and the best rates go to borrowers with 740+. Your credit score directly affects your interest rate — a higher score saves you tens of thousands of dollars over the life of the loan. If your score needs work, focus on paying down credit card balances, making all payments on time, and avoiding new credit applications for 6-12 months before buying.',
      },
      {
        question: 'How long does the entire home buying process take?',
        answer: 'From start to finish, expect 3-6 months for the full journey. Getting pre-approved takes about a week. House hunting varies widely — some buyers find a home in days, others search for months. Once your offer is accepted, closing typically takes 30-45 days. During that time, you\'ll complete the inspection, appraisal, and final loan processing. Planning ahead and having your documents ready can prevent delays.',
      },
    ],
  },
  {
    title: 'Affording a Home',
    items: [
      {
        question: 'How much house can I afford?',
        answer: 'A common guideline is to keep your total housing costs (mortgage, taxes, insurance, HOA) under 28% of your gross monthly income, and your total debt payments under 36%. So if you earn $7,000/month gross, aim for housing costs under $1,960/month. Use our Pre-Qualification Estimator for a personalized estimate. Remember that what you can qualify for and what you can comfortably afford may be different — leave room in your budget for savings, maintenance, and life.',
      },
      {
        question: 'Should I pay off student loans before buying a home?',
        answer: 'Not necessarily. What matters most is your debt-to-income ratio (DTI). If your student loan payments are manageable and your DTI is under 36%, you can likely do both. However, if student loans push your DTI above 43%, you may need to pay them down first. Consider income-driven repayment plans to lower your monthly payment. Also weigh the interest rates: if your student loans are at 4% and home values in your area are appreciating at 3-5%, it may make more financial sense to buy sooner rather than later.',
      },
      {
        question: 'Is it cheaper to rent or buy?',
        answer: 'It depends on your specific situation, local market, and how long you plan to stay. Generally, buying becomes cheaper than renting after 3-7 years in the same home, since you\'re building equity instead of paying someone else\'s mortgage. However, buying comes with significant upfront costs and ongoing maintenance expenses that renters don\'t face. Our main Rent vs Buy Calculator compares the true total cost based on your specific numbers.',
      },
      {
        question: 'What are closing costs and how much should I expect?',
        answer: 'Closing costs are the fees and expenses you pay when finalizing your home purchase, beyond the down payment. They typically run 2-5% of the loan amount. For a $300,000 loan, expect $6,000-$15,000. These include lender origination fees, appraisal fees, title insurance, attorney fees, prepaid property taxes and insurance, and recording fees. You\'ll see a detailed breakdown in your Loan Estimate and final Closing Disclosure. In some markets, you can negotiate for the seller to cover some closing costs.',
      },
    ],
  },
  {
    title: 'The Mortgage',
    items: [
      {
        question: 'What\'s the difference between pre-qualification and pre-approval?',
        answer: 'Pre-qualification is a quick, informal estimate based on self-reported financial information — think of it as a rough ballpark. Pre-approval is a more rigorous process where the lender actually verifies your income, assets, credit, and employment. Pre-approval carries much more weight with sellers because it shows you\'ve been vetted. In competitive markets, an offer without pre-approval may not even be considered. Always get pre-approved before making offers.',
      },
      {
        question: 'Fixed rate vs. adjustable rate — which is better?',
        answer: 'Fixed-rate mortgages give you certainty: your rate and payment never change. They\'re ideal if you plan to stay long-term and want predictable budgeting. Adjustable-rate mortgages (ARMs) start with a lower rate for 5, 7, or 10 years, then adjust periodically. ARMs can save money if you plan to move or refinance before the adjustment period. In a high-rate environment, an ARM can make sense if you expect rates to drop. In a low-rate environment, lock in a fixed rate.',
      },
      {
        question: 'How many mortgage quotes should I get?',
        answer: 'At least three, ideally five. Studies show that borrowers who get just one quote pay significantly more than those who shop around. Each lender can offer different rates, fees, and terms for the same borrower. Multiple mortgage applications within a 14-45 day window (depending on the scoring model) count as a single inquiry on your credit report, so shopping around won\'t hurt your score. Compare Loan Estimates side by side, paying attention to both the rate and the total closing costs.',
      },
      {
        question: 'What are mortgage points and should I pay them?',
        answer: 'Mortgage points (also called discount points) are upfront fees you pay to buy down your interest rate. One point costs 1% of the loan amount and typically reduces your rate by about 0.25%. For a $300,000 loan, one point costs $3,000 and might save you about $45/month. To break even, divide the point cost by the monthly savings: $3,000 / $45 = 67 months (about 5.5 years). If you plan to stay longer than the break-even period, points can save you money. If not, skip them.',
      },
      {
        question: 'What is an escrow account and do I need one?',
        answer: 'An escrow account is managed by your lender to collect and pay your property taxes and homeowner\'s insurance. A portion of these costs is added to your monthly mortgage payment, and the lender pays the bills when they\'re due. Most lenders require escrow if your down payment is less than 20%. Even if it\'s optional, many borrowers find it convenient since it spreads large annual bills into manageable monthly amounts.',
      },
    ],
  },
  {
    title: 'The Process',
    items: [
      {
        question: 'What does a real estate agent do and do I need one?',
        answer: 'A buyer\'s agent helps you find homes, schedule tours, research neighborhoods, write competitive offers, negotiate on your behalf, and guide you through closing. In most transactions, the seller pays both agents\' commissions, so a buyer\'s agent is effectively free for you. While you can technically buy without one, having an experienced agent is especially valuable for first-time buyers navigating a complex process. Interview 2-3 agents to find someone you trust.',
      },
      {
        question: 'What happens during a home inspection?',
        answer: 'A licensed inspector spends 2-4 hours examining the home\'s structure, roof, foundation, plumbing, electrical, HVAC, appliances, and more. You\'ll receive a detailed report, often with photos, highlighting any issues found. No home is perfect — the key is identifying major problems (foundation cracks, roof leaks, outdated wiring) vs. minor maintenance items. You can negotiate repairs, a price reduction, or a seller credit based on the findings. Never skip the inspection to save money.',
      },
      {
        question: 'Can I back out after making an offer?',
        answer: 'Yes, if you have contingencies in your contract. Common contingencies include inspection (you can back out if the inspection reveals major problems), financing (if your loan falls through), and appraisal (if the home appraises for less than the purchase price). If you back out due to a valid contingency, you get your earnest money back. If you back out without a valid reason, you may forfeit your earnest money deposit. Your real estate agent will help you understand your exit options.',
      },
      {
        question: 'What happens on closing day?',
        answer: 'First, you\'ll do a final walk-through of the home to verify its condition. Then you\'ll go to the title company or attorney\'s office to sign documents — lots of them. You\'ll sign the mortgage note, deed of trust, and other legal paperwork. You\'ll pay your closing costs via certified check or wire transfer. Once everything is signed and funded, you\'ll receive the keys. The whole signing process takes about 1-2 hours. Bring a valid photo ID and don\'t make any large purchases or open new credit accounts between your last bank statement and closing.',
      },
    ],
  },
  {
    title: 'After You Buy',
    items: [
      {
        question: 'What hidden costs should I expect as a homeowner?',
        answer: 'Budget for ongoing costs beyond your mortgage: maintenance and repairs (typically 1-2% of the home\'s value per year), property taxes (which can increase), homeowner\'s insurance, utilities (usually more than renting), HOA fees if applicable, and periodic big-ticket items like a new roof ($8,000-15,000), HVAC replacement ($5,000-10,000), or water heater ($1,000-3,000). Having a healthy emergency fund is essential for homeowners.',
      },
      {
        question: 'How do I build equity faster?',
        answer: 'The most effective strategies are: (1) Make extra principal payments — even $100/month extra on a $300,000 30-year loan can save you over $40,000 in interest and cut 5 years off your loan. (2) Choose a 15-year mortgage instead of 30 years for faster equity building. (3) Make improvements that increase your home\'s value. (4) Avoid cash-out refinancing that resets your equity. (5) Simply time — home values have historically appreciated 3-5% annually, building equity passively.',
      },
      {
        question: 'When should I consider refinancing?',
        answer: 'Consider refinancing when interest rates drop at least 0.75-1% below your current rate, when your credit score has improved significantly, or when you want to switch from an ARM to a fixed rate. Calculate whether the closing costs (typically 2-5% of the loan) are justified by the monthly savings — divide closing costs by monthly savings to find your break-even point. Also consider refinancing to remove PMI if your home value has increased enough to give you 20% equity.',
      },
      {
        question: 'What is homestead exemption and how do I file?',
        answer: 'Homestead exemption is a property tax benefit available in most states that reduces the taxable value of your primary residence. The savings vary by state — some offer a fixed dollar reduction (e.g., $50,000 off the assessed value), while others offer a percentage reduction. You typically file through your county property appraiser or tax assessor\'s office within the first year of purchase. There are often deadlines (commonly January through March), so check your county\'s requirements soon after closing.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-card-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-background/50 transition-colors"
      >
        <span className="text-sm font-semibold text-dark leading-snug">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-muted shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 -mt-1">
          <p className="text-sm text-muted leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      {/* Header */}
      <div className="hero-section mb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            First-Time Home Buyer FAQ
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Honest, practical answers to the questions every first-time home buyer asks. Click any question to see the answer.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

      {/* Quick Jump */}
      <div className="bg-card border border-card-border rounded-2xl p-4 mb-8 shadow-md">
        <p className="text-xs font-semibold text-muted mb-2">Jump to section:</p>
        <div className="flex flex-wrap gap-2">
          {FAQ_DATA.map((cat, i) => (
            <a
              key={i}
              href={`#faq-${i}`}
              className="px-3 py-1.5 text-xs font-medium text-primary border border-card-border rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              {cat.title}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {FAQ_DATA.map((category, ci) => (
          <section key={ci} id={`faq-${ci}`}>
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{ci + 1}</span>
              </div>
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item, ii) => (
                <FAQAccordion key={ii} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <AdBanner />

      {/* CTA */}
      <div className="mt-10 bg-card border border-card-border rounded-2xl p-6 shadow-md text-center">
        <h3 className="text-lg font-bold text-dark mb-2">Still have questions?</h3>
        <p className="text-sm text-muted mb-4">Explore our other resources to learn more about the home buying process.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/glossary" className="btn-primary inline-flex items-center gap-2 text-sm">
            Glossary of Terms <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/prequalify" className="btn-secondary inline-flex items-center gap-2 text-sm">
            Pre-Qualification Estimator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/checklist" className="btn-secondary inline-flex items-center gap-2 text-sm">
            Buying Checklist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
