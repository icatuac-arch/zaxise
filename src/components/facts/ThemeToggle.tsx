"use client";

import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

const themeIcons: Record<string, string> = {
  auto: "\u{1F4BB}",    // laptop / system
  almanac: "\u{1F4D6}", // open book
  midnight: "\u{1F319}", // crescent moon
  ocean: "\u{1F30A}",  // wave
  cosmic: "\u{1F30C}",  // milky way
  nature: "\u{1F33F}",  // herb / leaf
};

const themeLabels: Record<string, string> = {
  auto: "Auto (system)",
  almanac: "Almanac",
  midnight: "Midnight",
  ocean: "Ocean",
  cosmic: "Cosmic",
  nature: "Nature",
};

export function ThemeToggle() {
  const { theme, isAuto, setTheme, setAuto, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const activeKey = isAuto ? "auto" : theme;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--text)]/20 hover:border-[var(--text)]/50 transition-colors text-sm"
        title={`Theme: ${themeLabels[activeKey]}`}
        aria-label="Switch theme"
      >
        {themeIcons[activeKey] ?? "\u{1F3A8}"}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border border-[var(--text)]/15 bg-[var(--bg)] shadow-lg z-50 overflow-hidden">
          {/* Auto option */}
          <button
            onClick={() => {
              setAuto();
              setOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left font-mono text-xs uppercase tracking-wide flex items-center gap-2 transition-colors ${
              isAuto
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "hover:bg-[var(--surface)] text-[var(--text)]"
            }`}
          >
            <span>{themeIcons.auto}</span>
            {themeLabels.auto}
          </button>

          {/* Divider */}
          <div className="h-px bg-[var(--text)]/10" />

          {/* Manual theme options */}
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left font-mono text-xs uppercase tracking-wide flex items-center gap-2 transition-colors ${
                !isAuto && theme === t.id
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : "hover:bg-[var(--surface)] text-[var(--text)]"
              }`}
            >
              <span>{themeIcons[t.id]}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
