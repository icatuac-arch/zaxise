import { BookOpen, TrendingUp, Home, GraduationCap } from 'lucide-react';
import AdBanner from '@/components/rent-or-buy/AdBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resources for Home Buyers — RentOrBuy',
  description: 'Curated collection of free resources: current mortgage rates, market data, educational guides, and down payment assistance programs.',
};

export default function ResourcesPage() {
  return (
    <div>
      <div className="hero-section mb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 font-medium mb-2">
            <BookOpen className="w-4 h-4" />
            Free Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Free Resources for Home Buyers &amp; Renters</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            A curated collection of trusted, free resources to help you navigate the home buying process and make informed financial decisions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-dark">Current Rates &amp; Market Data</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Freddie Mac — Weekly Mortgage Rates</a>
              <span className="text-xs text-muted block">Official 30yr/15yr average rates, updated weekly</span>
            </li>
            <li>
              <a href="https://www.bankrate.com/mortgages/mortgage-rates/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Bankrate — Today&apos;s Rates</a>
              <span className="text-xs text-muted block">Live rates from multiple lenders</span>
            </li>
            <li>
              <a href="https://fred.stlouisfed.org/series/MORTGAGE30US" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">FRED — Historical Rate Chart</a>
              <span className="text-xs text-muted block">30-year rate history since 1971</span>
            </li>
            <li>
              <a href="https://www.zillow.com/home-values/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Zillow Home Value Index</a>
              <span className="text-xs text-muted block">Median home values by city/zip</span>
            </li>
            <li>
              <a href="https://www.redfin.com/news/data-center/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Redfin Data Center</a>
              <span className="text-xs text-muted block">Market trends, median prices, days on market</span>
            </li>
            <li>
              <a href="https://www.realtor.com/research/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Realtor.com Research</a>
              <span className="text-xs text-muted block">Housing market reports and forecasts</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-dark">Education &amp; Guides</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://www.consumerfinance.gov/owning-a-home/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">CFPB — Owning a Home</a>
              <span className="text-xs text-muted block">Government guide to the entire home buying process</span>
            </li>
            <li>
              <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">HUD — Buying a Home</a>
              <span className="text-xs text-muted block">Federal housing resources &amp; counseling</span>
            </li>
            <li>
              <a href="https://www.nerdwallet.com/article/mortgages/home-buying-checklist" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">NerdWallet — Home Buying Checklist</a>
              <span className="text-xs text-muted block">Step-by-step first-time buyer guide</span>
            </li>
            <li>
              <a href="https://www.investopedia.com/mortgage-guide-4689715" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Investopedia — Mortgage Guide</a>
              <span className="text-xs text-muted block">Comprehensive mortgage education</span>
            </li>
            <li>
              <a href="https://www.fanniemae.com/education" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Fannie Mae — Homebuyer Education</a>
              <span className="text-xs text-muted block">Free courses on home ownership</span>
            </li>
            <li>
              <a href="https://www.consumerfinance.gov/consumer-tools/mortgages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">CFPB — Mortgage Tools</a>
              <span className="text-xs text-muted block">Rate checker, loan comparison, closing checklist</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-dark">Down Payment &amp; Assistance</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://downpaymentresource.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Down Payment Resource</a>
              <span className="text-xs text-muted block">Find assistance programs in your area</span>
            </li>
            <li>
              <a href="https://www.hud.gov/buying/localbuying" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">HUD — Local Programs</a>
              <span className="text-xs text-muted block">State &amp; city first-time buyer programs</span>
            </li>
            <li>
              <a href="https://themortgagereports.com/fha-loan" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">FHA Loans (3.5% down)</a>
              <span className="text-xs text-muted block">Low down payment government-backed loans</span>
            </li>
            <li>
              <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">VA Loans (0% down)</a>
              <span className="text-xs text-muted block">For veterans &amp; active military — no down payment</span>
            </li>
            <li>
              <a href="https://www.rd.usda.gov/programs-services/single-family-housing-programs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">USDA Rural Loans (0% down)</a>
              <span className="text-xs text-muted block">No down payment for eligible rural areas</span>
            </li>
            <li>
              <a href="https://www.fdic.gov/consumers/community/AEP/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">FDIC — Affordable Mortgage Programs</a>
              <span className="text-xs text-muted block">Bank programs for low-to-moderate income buyers</span>
            </li>
          </ul>
        </div>
      </div>

      <AdBanner />

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-dark">Pro tip:</strong> Get pre-approved before house hunting. It shows sellers you are a serious, qualified buyer and helps you know your exact budget. Most pre-approvals are free and take 15-30 minutes online. Shop at least 3 lenders — rate differences of even 0.25% can save you thousands over the life of the loan.
        </p>
      </div>
      </div>
    </div>
  );
}
