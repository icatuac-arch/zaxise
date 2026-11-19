'use client';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryChartProps {
  priceHistory: PricePoint[];
  currentPrice: number;
  lowestEver: boolean;
}

export default function PriceHistoryChart({ priceHistory, currentPrice, lowestEver }: PriceHistoryChartProps) {
  if (!priceHistory || priceHistory.length === 0) return null;

  const prices = priceHistory.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const padding = { top: 40, right: 20, bottom: 50, left: 60 };
  const width = 600;
  const height = 260;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = priceHistory.map((p, i) => {
    const x = padding.left + (i / (priceHistory.length - 1)) * chartW;
    const y = padding.top + chartH - ((p.price - minPrice) / priceRange) * chartH;
    return { x, y, ...p };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Gradient area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // All-time low line Y position
  const allTimeLowY = padding.top + chartH - ((minPrice - minPrice) / priceRange) * chartH;

  // Current price point (last point)
  const currentPoint = points[points.length - 1];

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = minPrice + (priceRange * i) / 4;
    const y = padding.top + chartH - (i / 4) * chartH;
    return { value: Math.round(value), y };
  });

  return (
    <div className="bg-white border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-heading text-lg font-bold">Price History (6 Months)</h3>
        {lowestEver && (
          <span className="bg-deal-green text-white text-xs font-extrabold px-3 py-1 rounded-full animate-pulse">
            LOWEST PRICE EVER
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={i === 0 ? '' : '4 4'}
              />
              <text x={padding.left - 10} y={tick.y + 4} textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                ${tick.value}
              </text>
            </g>
          ))}

          {/* All-time low line */}
          <line
            x1={padding.left}
            y1={allTimeLowY}
            x2={width - padding.right}
            y2={allTimeLowY}
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x={width - padding.right + 5} y={allTimeLowY - 6} fill="#16A34A" fontSize="10" fontWeight="700">
            LOW
          </text>

          {/* Area fill */}
          <path d={areaD} fill="url(#priceGradient)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 6 : 3} fill={i === points.length - 1 ? '#DC2626' : '#1E40AF'} />
              {i === points.length - 1 && (
                <>
                  <circle cx={p.x} cy={p.y} r={10} fill="#DC2626" opacity="0.2" />
                  <text x={p.x} y={p.y - 14} textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="800">
                    ${currentPrice}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text key={i} x={p.x} y={height - 10} textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="500">
              {p.date}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-6 mt-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-primary inline-block rounded" /> Price trend
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-deal-green inline-block rounded" style={{ borderTop: '1.5px dashed #16A34A' }} /> All-time low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-deal-red rounded-full inline-block" /> Current price
        </span>
      </div>
    </div>
  );
}
