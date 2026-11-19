'use client';

import { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorPage() {
  const [hex, setHex] = useState('#3B82F6');
  const [r, setR] = useState('59');
  const [g, setG] = useState('130');
  const [b, setB] = useState('246');
  const [h, setH] = useState('217');
  const [s, setS] = useState('91');
  const [l, setL] = useState('60');
  const [activeInput, setActiveInput] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const syncFromHex = (hexVal: string) => {
    const rgb = hexToRgb(hexVal);
    if (rgb) {
      setR(rgb.r.toString());
      setG(rgb.g.toString());
      setB(rgb.b.toString());
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h.toString());
      setS(hsl.s.toString());
      setL(hsl.l.toString());
    }
  };

  const syncFromRgb = (rv: string, gv: string, bv: string) => {
    const rn = parseInt(rv) || 0, gn = parseInt(gv) || 0, bn = parseInt(bv) || 0;
    setHex(rgbToHex(rn, gn, bn));
    const hsl = rgbToHsl(rn, gn, bn);
    setH(hsl.h.toString());
    setS(hsl.s.toString());
    setL(hsl.l.toString());
  };

  const syncFromHsl = (hv: string, sv: string, lv: string) => {
    const hn = parseInt(hv) || 0, sn = parseInt(sv) || 0, ln = parseInt(lv) || 0;
    const rgb = hslToRgb(hn, sn, ln);
    setR(rgb.r.toString());
    setG(rgb.g.toString());
    setB(rgb.b.toString());
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  // Determine current display color
  let displayColor = hex;
  if (activeInput === 'rgb') {
    displayColor = rgbToHex(parseInt(r) || 0, parseInt(g) || 0, parseInt(b) || 0);
  } else if (activeInput === 'hsl') {
    const rgb = hslToRgb(parseInt(h) || 0, parseInt(s) || 0, parseInt(l) || 0);
    displayColor = rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Color Converter</h1>
        <p className="text-muted">Convert between HEX, RGB, and HSL color formats with a live preview.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        {/* Color Preview */}
        <div className="flex justify-center mb-6">
          <div
            className="w-full max-w-md h-32 rounded-xl border border-card-border shadow-inner"
            style={{ backgroundColor: displayColor }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HEX */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => { setHex(e.target.value); setActiveInput('hex'); syncFromHex(e.target.value); }}
              onFocus={() => setActiveInput('hex')}
              className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#3B82F6"
            />
          </div>

          {/* RGB */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">RGB</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type="number" min="0" max="255" value={r}
                  onChange={(e) => { setR(e.target.value); setActiveInput('rgb'); syncFromRgb(e.target.value, g, b); }}
                  onFocus={() => setActiveInput('rgb')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-red-500 font-semibold">R</span>
              </div>
              <div className="relative flex-1">
                <input type="number" min="0" max="255" value={g}
                  onChange={(e) => { setG(e.target.value); setActiveInput('rgb'); syncFromRgb(r, e.target.value, b); }}
                  onFocus={() => setActiveInput('rgb')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-green-500 font-semibold">G</span>
              </div>
              <div className="relative flex-1">
                <input type="number" min="0" max="255" value={b}
                  onChange={(e) => { setB(e.target.value); setActiveInput('rgb'); syncFromRgb(r, g, e.target.value); }}
                  onFocus={() => setActiveInput('rgb')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-blue-500 font-semibold">B</span>
              </div>
            </div>
          </div>

          {/* HSL */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">HSL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type="number" min="0" max="360" value={h}
                  onChange={(e) => { setH(e.target.value); setActiveInput('hsl'); syncFromHsl(e.target.value, s, l); }}
                  onFocus={() => setActiveInput('hsl')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-muted font-semibold">H</span>
              </div>
              <div className="relative flex-1">
                <input type="number" min="0" max="100" value={s}
                  onChange={(e) => { setS(e.target.value); setActiveInput('hsl'); syncFromHsl(h, e.target.value, l); }}
                  onFocus={() => setActiveInput('hsl')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-muted font-semibold">S</span>
              </div>
              <div className="relative flex-1">
                <input type="number" min="0" max="100" value={l}
                  onChange={(e) => { setL(e.target.value); setActiveInput('hsl'); syncFromHsl(h, s, e.target.value); }}
                  onFocus={() => setActiveInput('hsl')}
                  className="w-full px-3 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                <span className="absolute -top-2 left-2 text-[10px] bg-card px-1 text-muted font-semibold">L</span>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-xs text-muted mb-1">CSS HEX</div>
            <code className="text-sm font-mono">{displayColor}</code>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-xs text-muted mb-1">CSS RGB</div>
            <code className="text-sm font-mono">rgb({r}, {g}, {b})</code>
          </div>
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-xs text-muted mb-1">CSS HSL</div>
            <code className="text-sm font-mono">hsl({h}, {s}%, {l}%)</code>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">Color Models</h2>
        <div className="bg-background rounded-lg p-4 text-sm text-dark-light space-y-1">
          <p><span className="font-semibold">HEX:</span> 6-digit hexadecimal (e.g., #FF5733). Each pair represents Red, Green, Blue (00-FF).</p>
          <p><span className="font-semibold">RGB:</span> Red, Green, Blue values from 0-255. Additive color model used by screens.</p>
          <p><span className="font-semibold">HSL:</span> Hue (0-360), Saturation (0-100%), Lightness (0-100%). More intuitive for human perception.</p>
        </div>
      </div>
    </div>
  );
}
