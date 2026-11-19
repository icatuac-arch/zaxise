'use client'

import { useState } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

const PASSPORT_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  UK: '🇬🇧',
  India: '🇮🇳',
}

const GENERAL_VISA_TIPS = [
  { title: 'Passport Validity', description: 'Most countries require at least 6 months validity remaining on your passport from your date of entry. Check and renew early.' },
  { title: 'Visa-on-Arrival vs E-Visa', description: 'Visa-on-arrival is obtained at the airport upon landing. E-visas are applied for online before travel and approved digitally — faster queues at immigration.' },
  { title: 'Blank Passport Pages', description: 'Many countries require 1-2 blank pages for stamps. Some require them to be consecutive.' },
  { title: 'Proof of Onward Travel', description: 'Immigration may ask for proof that you plan to leave the country — a return ticket or onward booking is often required.' },
  { title: 'Travel Insurance', description: 'Some countries (notably in the Schengen area) require proof of travel insurance with minimum coverage as part of the visa application.' },
  { title: 'Apply Early', description: 'Visa processing can take 2-8 weeks. Apply well in advance, especially during peak travel seasons.' },
  { title: 'Document Copies', description: 'Keep photocopies and digital scans of your passport, visa, and all supporting documents in separate locations.' },
  { title: 'Transit Visas', description: 'Even if your final destination is visa-free, you may need a transit visa for layover countries. Always check.' },
]

const EMBASSY_LINKS: Record<string, { country: string; url: string }[]> = {
  japan: [
    { country: 'US Embassy in Japan', url: 'https://jp.usembassy.gov/' },
    { country: 'UK Embassy in Japan', url: 'https://www.gov.uk/world/organisations/british-embassy-tokyo' },
  ],
  italy: [
    { country: 'US Embassy in Italy', url: 'https://it.usembassy.gov/' },
    { country: 'UK Embassy in Italy', url: 'https://www.gov.uk/world/organisations/british-embassy-rome' },
  ],
  thailand: [
    { country: 'US Embassy in Thailand', url: 'https://th.usembassy.gov/' },
    { country: 'UK Embassy in Thailand', url: 'https://www.gov.uk/world/organisations/british-embassy-bangkok' },
  ],
  france: [
    { country: 'US Embassy in France', url: 'https://fr.usembassy.gov/' },
    { country: 'UK Embassy in France', url: 'https://www.gov.uk/world/organisations/british-embassy-paris' },
  ],
  india: [
    { country: 'US Embassy in India', url: 'https://in.usembassy.gov/' },
    { country: 'UK Embassy in India', url: 'https://www.gov.uk/world/organisations/british-high-commission-new-delhi' },
  ],
}

const REQUIRED_DOCS: Record<string, string[]> = {
  'Visa-free for tourism': [
    'Valid passport (6+ months validity)',
    'Return or onward flight ticket',
    'Proof of accommodation',
    'Sufficient funds for the stay',
  ],
  default: [
    'Valid passport (6+ months validity)',
    'Completed visa application form',
    'Passport-size photographs',
    'Proof of accommodation booking',
    'Return or onward flight ticket',
    'Bank statements (last 3 months)',
    'Travel insurance',
    'Cover letter with travel itinerary',
  ],
}

function getDocsForRequirement(requirement: string): string[] {
  if (requirement.toLowerCase().includes('visa-free')) {
    return REQUIRED_DOCS['Visa-free for tourism']
  }
  return REQUIRED_DOCS['default']
}

function getVisaTypeBadge(requirement: string) {
  const lower = requirement.toLowerCase()
  if (lower.includes('visa-free')) return { label: 'Visa-Free', bg: 'bg-emerald-100', text: 'text-emerald-800' }
  if (lower.includes('on arrival') || lower.includes('on-arrival')) return { label: 'Visa on Arrival', bg: 'bg-blue-100', text: 'text-blue-800' }
  if (lower.includes('e-visa')) return { label: 'E-Visa', bg: 'bg-purple-100', text: 'text-purple-800' }
  return { label: 'Visa Required', bg: 'bg-amber-100', text: 'text-amber-800' }
}

export default function VisaGuidePage() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const selectedCountry = COUNTRIES.find((c) => c.id === selectedCountryId)

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Visa Requirements Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Check visa requirements, costs, and required documents for US, UK, and Indian passport holders.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Country Selector */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Select a Destination</h2>
          <select
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">-- Choose a country --</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </section>

        {/* Visa Details for Selected Country */}
        {selectedCountry && (
          <section className="space-y-6">
            <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
              <span className="mr-2">{selectedCountry.flag}</span>
              {selectedCountry.name} Visa Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedCountry.visaInfo.map((visa) => {
                const badge = getVisaTypeBadge(visa.requirement)
                const docs = getDocsForRequirement(visa.requirement)
                return (
                  <div
                    key={visa.passport}
                    className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{PASSPORT_FLAGS[visa.passport] || '🌍'}</span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-[#0F172A]">
                          {visa.passport} Passport
                        </h3>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-[#0F172A]/60">Requirement</span>
                        <p className="text-[#0F172A]">{visa.requirement}</p>
                      </div>
                      <div>
                        <span className="font-medium text-[#0F172A]/60">Cost</span>
                        <p className="text-[#0F172A] font-semibold">{visa.cost}</p>
                      </div>
                      <div>
                        <span className="font-medium text-[#0F172A]/60">Duration</span>
                        <p className="text-[#0F172A]">{visa.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-[#0F172A]/60">Required Documents</span>
                        <ul className="mt-1 space-y-1">
                          {docs.map((doc, i) => (
                            <li key={i} className="flex gap-2 text-[#0F172A]/80">
                              <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Embassy Links */}
            {EMBASSY_LINKS[selectedCountry.id] && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">Embassy Links</h3>
                <div className="flex flex-wrap gap-3">
                  {EMBASSY_LINKS[selectedCountry.id].map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                      {link.country}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* General Visa Tips */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">General Visa Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GENERAL_VISA_TIPS.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[#0F172A]">{tip.title}</h3>
                    <p className="text-sm text-[#0F172A]/70 mt-1">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Overview Table */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Quick Overview — All Countries</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#0EA5E9]/10">
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Country</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Passport</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Type</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Cost</th>
                    <th className="px-5 py-3 font-heading font-semibold text-[#0F172A]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.flatMap((country) =>
                    country.visaInfo.map((visa, i) => {
                      const badge = getVisaTypeBadge(visa.requirement)
                      return (
                        <tr key={`${country.id}-${visa.passport}`} className="border-t border-[#E2E8F0] hover:bg-[#FAFBFC]">
                          {i === 0 ? (
                            <td className="px-5 py-3 font-medium text-[#0F172A]" rowSpan={country.visaInfo.length}>
                              <span className="mr-2">{country.flag}</span>{country.name}
                            </td>
                          ) : null}
                          <td className="px-5 py-3 text-[#0F172A]/80">
                            <span className="mr-1">{PASSPORT_FLAGS[visa.passport] || '🌍'}</span>{visa.passport}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-[#0F172A]/80">{visa.cost}</td>
                          <td className="px-5 py-3 text-[#0F172A]/80">{visa.duration}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
