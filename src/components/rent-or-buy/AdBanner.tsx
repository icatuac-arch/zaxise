'use client';

import { ADS_ENABLED } from '@/lib/ads-config';

/**
 * Ad banner sizes and their recommended use:
 * - 'leaderboard'  (728x90)  — between sections, wide pages
 * - 'banner'       (468x60)  — compact, less intrusive
 * - 'responsive'   (auto)    — adapts to container width (recommended)
 */
type AdSize = 'leaderboard' | 'banner' | 'responsive';

const SIZE_MAP: Record<AdSize, { width: string; height: string; label: string }> = {
  leaderboard: { width: '728px', height: '90px', label: 'Leaderboard (728×90)' },
  banner: { width: '468px', height: '60px', label: 'Banner (468×60)' },
  responsive: { width: '100%', height: '90px', label: 'Responsive Ad' },
};

export default function AdBanner({ size = 'responsive' }: { size?: AdSize }) {
  if (!ADS_ENABLED) return null;

  const config = SIZE_MAP[size];

  return (
    <div className="flex justify-center my-6">
      <div
        className="bg-background border border-dashed border-card-border rounded-lg flex items-center justify-center text-xs text-muted/50 overflow-hidden"
        style={{
          width: config.width,
          maxWidth: '100%',
          height: config.height,
        }}
      >
        {/*
          Replace this placeholder with actual Google AdSense code:

          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />

          And add the AdSense script to layout.tsx:
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
        */}
        Advertisement — {config.label}
      </div>
    </div>
  );
}
