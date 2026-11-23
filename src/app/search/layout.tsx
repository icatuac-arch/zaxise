import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Search — ZAXISE',
  description: 'Search across all tools, calculators, travel guides, facts, and more on ZAXISE.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-paper" />}>{children}</Suspense>;
}
