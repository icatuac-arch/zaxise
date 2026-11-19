'use client';

import React from 'react';

export default function AmericasGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFBFC', color: '#0F172A' }}>
      {children}
    </div>
  );
}
