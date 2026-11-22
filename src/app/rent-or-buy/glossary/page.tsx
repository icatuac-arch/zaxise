import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/rent-or-buy/AdBanner';

export const metadata: Metadata = {
  title: 'Home Buying Glossary A-Z — RentOrBuy',
  description: 'Plain-English definitions of 40+ mortgage and real estate terms every home buyer should know. From amortization to VA loans, understand the language of home buying.',
};

interface Term {
  term: string;
  definition: string;
}

const TERMS: Term[] = [
  { term: 'Amortization', definition: 'The process of paying off a loan over time through regular payments. Each payment covers some interest and some principal. In the early years, most of your payment goes to interest; over time, more goes toward principal. An amortization schedule shows exactly how this shifts month by month.' },
  { term: 'Appraisal', definition: 'A professional estimate of a home\'s market value, conducted by a licensed appraiser. Your lender requires an appraisal to make sure the home is worth what you\'re paying. If the appraisal comes in low, you may need to renegotiate the price or bring extra cash to closing.' },
  { term: 'ARM (Adjustable Rate Mortgage)', definition: 'A mortgage where the interest rate changes periodically after an initial fixed period. For example, a 5/1 ARM has a fixed rate for 5 years, then adjusts annually. ARMs often start with lower rates than fixed mortgages but carry the risk of rate increases later.' },
  { term: 'Closing', definition: 'The final step in buying a home where ownership officially transfers from seller to buyer. You\'ll sign a stack of legal documents, pay your closing costs and down payment, and receive the keys. Closings typically take 1-2 hours and happen at a title company or attorney\'s office.' },
  { term: 'Closing Costs', definition: 'Fees and expenses you pay on top of the home price when finalizing your purchase. These typically run 2-5% of the loan amount and include lender fees, title insurance, appraisal fees, attorney fees, and prepaid items like property taxes and insurance. You\'ll see a detailed breakdown on your Closing Disclosure.' },
  { term: 'Closing Disclosure', definition: 'A five-page document your lender must provide at least 3 business days before closing. It lists your final loan terms, monthly payment, and all closing costs dollar-for-dollar. Compare it carefully to your earlier Loan Estimate to catch any surprises.' },
  { term: 'Comparable Sales (Comps)', definition: 'Recent sale prices of similar homes in the same area, used to determine a fair market value. Appraisers and real estate agents both use comps. The most useful comps are homes of similar size, condition, and location that sold within the last 3-6 months.' },
  { term: 'Contingency', definition: 'A condition written into your offer that must be met for the sale to go through. Common contingencies include home inspection, appraisal, and financing contingencies. If a contingency isn\'t met, you can typically back out of the deal and get your earnest money back.' },
  { term: 'Conventional Loan', definition: 'A mortgage that is not backed by a government agency (unlike FHA, VA, or USDA loans). Conventional loans typically require a higher credit score (usually 620+) and may require a larger down payment. With 20% down, you avoid paying private mortgage insurance.' },
  { term: 'Credit Score', definition: 'A three-digit number (300-850) that represents your creditworthiness based on your borrowing history. Lenders use it to decide whether to approve your loan and what interest rate to offer. Higher scores get better rates. Most mortgage lenders look for at least 620, though FHA loans may accept 580+.' },
  { term: 'Debt-to-Income Ratio (DTI)', definition: 'The percentage of your gross monthly income that goes toward debt payments. Lenders use two DTI ratios: front-end (housing costs only, ideally under 28%) and back-end (all debts including housing, ideally under 36%). A lower DTI means you\'re a less risky borrower.' },
  { term: 'Down Payment', definition: 'The upfront cash you pay toward the home price, with the rest covered by your mortgage. Conventional loans often require 5-20%, FHA loans require 3.5%, and VA/USDA loans may require 0%. Putting down 20% or more eliminates the need for private mortgage insurance (PMI).' },
  { term: 'Earnest Money', definition: 'A good-faith deposit you submit with your offer to show the seller you\'re serious. Typically 1-3% of the purchase price. It\'s held in escrow and applied toward your down payment or closing costs at closing. If you back out without a valid contingency, you may lose it.' },
  { term: 'Equity', definition: 'The portion of your home that you actually own, calculated as the home\'s current value minus what you owe on the mortgage. Equity builds as you make payments and as the home appreciates in value. You can borrow against equity through a home equity loan or line of credit.' },
  { term: 'Escrow', definition: 'A neutral third party that holds money and documents during the home buying process. After closing, your lender may maintain an escrow account to collect a portion of your property taxes and insurance with each mortgage payment, then pay those bills on your behalf when they\'re due.' },
  { term: 'FHA Loan', definition: 'A mortgage insured by the Federal Housing Administration, designed for borrowers with lower credit scores or smaller down payments. FHA loans require just 3.5% down with a 580+ credit score. The trade-off is that you\'ll pay mortgage insurance premiums (MIP) for the life of the loan in most cases.' },
  { term: 'Fixed-Rate Mortgage', definition: 'A mortgage where the interest rate stays the same for the entire loan term. Your monthly principal and interest payment never changes, making budgeting predictable. The most common terms are 15 and 30 years. Fixed rates are typically slightly higher than initial ARM rates.' },
  { term: 'Foreclosure', definition: 'The legal process where a lender takes possession of a home after the borrower fails to make mortgage payments. Foreclosure severely damages your credit score and stays on your credit report for 7 years. If you\'re struggling with payments, contact your lender immediately — they often prefer to work out alternatives.' },
  { term: 'Front-End Ratio', definition: 'The percentage of your gross monthly income spent on housing costs (mortgage payment, property taxes, insurance, and HOA fees). Most lenders want this to be 28% or less. For example, if you earn $6,000/month, your total housing costs should ideally stay under $1,680.' },
  { term: 'Good Faith Estimate', definition: 'A document that was previously used to outline estimated closing costs. It has been largely replaced by the Loan Estimate form since 2015. If someone mentions a Good Faith Estimate, they\'re referring to the same concept: an early breakdown of what you\'ll pay at closing.' },
  { term: 'Home Inspection', definition: 'A thorough examination of a home\'s condition by a licensed inspector before you finalize the purchase. The inspector checks the roof, foundation, plumbing, electrical, HVAC, and more. Costs $300-500 and typically takes 2-4 hours. The report helps you negotiate repairs or decide whether to walk away.' },
  { term: 'Homeowner\'s Insurance', definition: 'Insurance that protects your home and belongings against damage from fire, storms, theft, and other covered events. Your lender requires it as a condition of the mortgage. Costs vary widely by location and coverage level, but expect $1,000-3,000+ per year. Shop around for the best rates.' },
  { term: 'HOA (Homeowners Association)', definition: 'An organization that manages a community (condos, townhouses, or planned developments) and enforces rules. Members pay monthly or annual dues that cover shared expenses like landscaping, amenities, and exterior maintenance. HOA fees range from $100 to $500+ per month and are on top of your mortgage payment.' },
  { term: 'Interest Rate', definition: 'The cost of borrowing money, expressed as a percentage of the loan amount per year. Your interest rate determines how much you\'ll pay in addition to repaying the principal. Even a small rate difference matters: on a $300,000 loan, the difference between 6% and 7% is over $70,000 in total interest over 30 years.' },
  { term: 'Jumbo Loan', definition: 'A mortgage that exceeds the conforming loan limits set by the Federal Housing Finance Agency (currently $766,550 in most areas for 2024). Jumbo loans typically require stronger credit, larger down payments, and may have slightly higher interest rates. They\'re common in expensive housing markets.' },
  { term: 'Lien', definition: 'A legal claim against a property, typically for unpaid debts. A mortgage is a type of lien. Other liens can include unpaid taxes, contractor bills, or court judgments. Liens must be resolved before a home can be sold with a clear title. A title search uncovers any existing liens.' },
  { term: 'Loan Estimate', definition: 'A standardized three-page document your lender must provide within 3 business days of receiving your mortgage application. It outlines your estimated interest rate, monthly payment, closing costs, and other loan details. Use it to compare offers from different lenders side by side.' },
  { term: 'Loan-to-Value Ratio (LTV)', definition: 'The ratio of your mortgage amount to the home\'s appraised value, expressed as a percentage. If you buy a $400,000 home with $80,000 down, your LTV is 80%. An LTV above 80% typically requires private mortgage insurance. Lower LTV means less risk for the lender and often a better rate for you.' },
  { term: 'Mortgage', definition: 'A loan used to buy real estate, where the property itself serves as collateral. If you stop making payments, the lender can foreclose on the home. Mortgages typically have terms of 15 or 30 years. Your monthly payment includes principal (paying down the loan) and interest (the cost of borrowing).' },
  { term: 'Mortgage Insurance (PMI/MIP)', definition: 'Insurance that protects the lender (not you) if you default on the loan. Required when your down payment is less than 20% on conventional loans (called PMI) or on FHA loans (called MIP). PMI typically costs 0.5-1% of the loan amount annually and can be removed once you reach 20% equity.' },
  { term: 'Mortgage Points', definition: 'Upfront fees you can pay to lower your interest rate, also called "discount points." One point costs 1% of the loan amount and typically reduces your rate by about 0.25%. Points make sense if you plan to stay in the home long enough for the monthly savings to exceed the upfront cost.' },
  { term: 'Pre-Approval', definition: 'A lender\'s conditional commitment to lend you a specific amount, based on verification of your income, assets, and credit. Stronger than pre-qualification because the lender has actually reviewed your financial documents. A pre-approval letter makes your offer more competitive to sellers.' },
  { term: 'Pre-Qualification', definition: 'An initial estimate of how much you might be able to borrow, based on self-reported financial information. It\'s a quick, informal process that gives you a ballpark. It does not carry the same weight as pre-approval since the lender hasn\'t verified your information yet.' },
  { term: 'Principal', definition: 'The amount of money you actually borrowed, not including interest. When you make a mortgage payment, part goes to principal (reducing what you owe) and part goes to interest. Over time, more of each payment goes toward principal. Paying extra toward principal is one of the best ways to save on interest and build equity faster.' },
  { term: 'Private Mortgage Insurance (PMI)', definition: 'Insurance required by conventional lenders when your down payment is less than 20%. It protects the lender, not you. PMI typically costs 0.5-1% of your loan amount per year, added to your monthly payment. You can request to remove it once your equity reaches 20%, and it\'s automatically removed at 22%.' },
  { term: 'Property Tax', definition: 'An annual tax charged by your local government based on your home\'s assessed value. Rates vary dramatically by location, from under 0.3% in some states to over 2% in others. Property taxes fund schools, roads, emergency services, and other public services. They\'re typically paid through your escrow account.' },
  { term: 'Refinancing', definition: 'Replacing your existing mortgage with a new one, usually to get a lower interest rate, change the loan term, or tap into equity. Refinancing has closing costs (typically 2-5% of the loan), so make sure the savings justify the expense. A common rule of thumb: refinance if you can lower your rate by at least 0.75-1%.' },
  { term: 'Title', definition: 'The legal right to own, use, and dispose of a property. When you buy a home, the title transfers from the seller to you. A "clear title" means there are no liens, disputes, or legal issues that could affect your ownership. Title issues are resolved before closing.' },
  { term: 'Title Insurance', definition: 'Insurance that protects against financial loss if someone challenges your ownership of the property due to title defects, liens, or other issues that weren\'t discovered during the title search. You\'ll pay for it once at closing. Lender\'s title insurance is required; owner\'s title insurance is optional but recommended.' },
  { term: 'Title Search', definition: 'A review of public records to verify the seller legally owns the property and identify any liens, easements, or other claims against it. Conducted by a title company or attorney before closing. If issues are found, they must be resolved before the sale can proceed.' },
  { term: 'Underwriting', definition: 'The process where a lender evaluates your mortgage application to decide whether to approve the loan. The underwriter reviews your credit, income, assets, debts, and the property itself. This is the most nerve-wracking part of the process for many buyers, but just respond quickly to any requests and you\'ll be fine.' },
  { term: 'USDA Loan', definition: 'A mortgage backed by the U.S. Department of Agriculture for homes in eligible rural and suburban areas. USDA loans offer zero down payment and competitive interest rates. Income limits apply — generally, your household income must be at or below 115% of the area median income.' },
  { term: 'VA Loan', definition: 'A mortgage benefit available to military service members, veterans, and eligible surviving spouses. VA loans offer zero down payment, no PMI, and competitive rates. They\'re backed by the Department of Veterans Affairs. A VA funding fee applies but can be rolled into the loan.' },
];

function getLetters(): string[] {
  const letters = new Set(TERMS.map(t => t.term[0].toUpperCase()));
  return Array.from(letters).sort();
}

function getTermsByLetter(): Record<string, Term[]> {
  const grouped: Record<string, Term[]> = {};
  for (const t of TERMS) {
    const letter = t.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(t);
  }
  return grouped;
}

export default function GlossaryPage() {
  const letters = getLetters();
  const byLetter = getTermsByLetter();

  return (
    <div>
      {/* Header */}
      <div className="hero-section mb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
            A-Z Glossary
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Home Buying Glossary
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Real estate and mortgage terms explained in plain English. No jargon, no fluff — just clear definitions that help you understand the home buying process.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

      {/* Letter Navigation */}
      <div className="bg-card border border-card-border rounded-2xl p-4 mb-8 shadow-md">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {letters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors border border-card-border"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-10">
        {letters.map(letter => (
          <section key={letter} id={`letter-${letter}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {letter}
              </div>
              <div className="flex-1 h-px bg-card-border" />
            </div>
            <div className="space-y-4">
              {byLetter[letter].map(t => (
                <div key={t.term} className="bg-card border border-card-border rounded-xl p-5 shadow-md">
                  <h3 className="text-base font-bold text-dark mb-2">{t.term}</h3>
                  <p className="text-sm text-muted leading-relaxed">{t.definition}</p>
                </div>
              ))}
            </div>
            {letter === 'M' && <AdBanner size="leaderboard" />}
          </section>
        ))}
      </div>

      {/* Back to top */}
      <div className="mt-10 text-center">
        <a href="#" className="text-sm text-primary font-semibold hover:underline">
          Back to top
        </a>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/rent-or-buy/faq" className="btn-primary inline-flex items-center gap-2 text-sm">
            Read the FAQ
          </Link>
          <Link href="/rent-or-buy/checklist" className="btn-secondary inline-flex items-center gap-2 text-sm">
            Home Buying Checklist
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
