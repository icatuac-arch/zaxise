'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, type Theme } from './ThemeProvider';

const themes: { id: Theme; name: string; description: string; dotColor: string }[] = [
  { id: 'classic', name: 'Classic', description: 'Clean & Professional', dotColor: 'bg-blue-500' },
  { id: 'modern', name: 'Sunshine', description: 'Warm & Joyful', dotColor: 'bg-orange-400' },
  { id: 'luxury', name: 'Garden', description: 'Fresh & Natural', dotColor: 'bg-emerald-500' },
];

export default function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = themes.find((t) => t.id === theme) || themes[0];

  if (mobile) {
    return (
      <div className="px-3 py-2">
        <div className="text-xs font-medium text-muted mb-2 uppercase tracking-wide">Theme</div>
        <div className="space-y-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                theme === t.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:text-foreground hover:bg-card'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${t.dotColor} shrink-0`} />
              <span>{t.name}</span>
              <span className="text-xs text-muted ml-auto">{t.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
        aria-label="Switch theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden lg:inline">{current.name}</span>
      </button>

      <div
        className={`absolute right-0 top-full mt-1 w-56 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="p-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                theme === t.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-background'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${t.dotColor} shrink-0`} />
              <div className="text-left">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted">{t.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
