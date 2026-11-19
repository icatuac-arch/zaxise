'use client';

import { SHOW_ADS } from '@/lib/time/ads-config';

type AdSize = 'leaderboard' | 'banner' | 'responsive';

const SIZE_MAP: Record<AdSize, { width: string; height: string; label: string }> = {
  leaderboard: { width: '728px', height: '90px', label: 'Leaderboard (728×90)' },
  banner: { width: '468px', height: '60px', label: 'Banner (468×60)' },
  responsive: { width: '100%', height: '90px', label: 'Responsive Ad' },
};

export default function AdBanner({ size = 'responsive' }: { size?: AdSize }) {
  if (!SHOW_ADS) return null;

  const config = SIZE_MAP[size];

  return (
    <div className="flex justify-center my-6">
      <div
        className="rounded-lg flex items-center justify-center text-xs overflow-hidden border border-dashed border-card-border text-muted/30"
        style={{
          width: config.width,
          maxWidth: '100%',
          height: config.height,
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}
      >
        Advertisement — {config.label}
      </div>
    </div>
  );
}
