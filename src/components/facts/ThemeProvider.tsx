"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Theme definitions                                                  */
/* ------------------------------------------------------------------ */

export interface ThemeColors {
  "--bg": string;
  "--text": string;
  "--accent": string;
  "--secondary": string;
  "--surface": string;
  "--muted": string;
  "--glow"?: string;
  "--gradient-start"?: string;
  "--gradient-end"?: string;
  "--shadow"?: string;
}

export interface ThemeMeta {
  id: string;
  label: string;
  colors: ThemeColors;
  fontBody: string;
  /** Extra class applied to <html> for theme-specific CSS */
  className: string;
}

export const themes: ThemeMeta[] = [
  {
    id: "almanac",
    label: "Almanac",
    className: "theme-almanac",
    fontBody: '"Fraunces", serif',
    colors: {
      "--bg": "#F2EBDC",
      "--text": "#181715",
      "--accent": "#C8412C",
      "--secondary": "#C99232",
      "--surface": "#E8DFC9",
      "--muted": "#4A463F",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    className: "theme-midnight",
    fontBody: 'Inter, ui-sans-serif, system-ui, sans-serif',
    colors: {
      "--bg": "#0B1426",
      "--text": "#E0E4EC",
      "--accent": "#D4A843",
      "--secondary": "#1A2744",
      "--surface": "#2A3A5C",
      "--muted": "#8892A4",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    className: "theme-ocean",
    fontBody: 'Inter, ui-sans-serif, system-ui, sans-serif',
    colors: {
      "--bg": "#FAFCFD",
      "--text": "#1E293B",
      "--accent": "#F97066",
      "--secondary": "#14B8A6",
      "--surface": "#E0F2FE",
      "--muted": "#64748B",
    },
  },
  {
    id: "cosmic",
    label: "Cosmic",
    className: "theme-cosmic",
    fontBody: 'Inter, ui-sans-serif, system-ui, sans-serif',
    colors: {
      "--bg": "#050A18",
      "--text": "#E0E8F8",
      "--accent": "#00F0FF",
      "--secondary": "#B24BF3",
      "--surface": "rgba(15, 25, 50, 0.7)",
      "--muted": "#4A5580",
      "--glow": "#00F0FF",
      "--gradient-start": "#FF3CAC",
      "--gradient-end": "#00F0FF",
    },
  },
  {
    id: "nature",
    label: "Nature",
    className: "theme-nature",
    fontBody: "-apple-system, 'Segoe UI', system-ui, sans-serif",
    colors: {
      "--bg": "#FAF6F0",
      "--text": "#2D5016",
      "--accent": "#C65D3E",
      "--secondary": "#7BA05B",
      "--surface": "#F0E8D8",
      "--muted": "#8B7355",
      "--shadow": "rgba(93, 64, 55, 0.08)",
    },
  },
];

const STORAGE_KEY = "dyk-theme";
const MANUAL_KEY = "dyk-theme-manual";
const ADMIN_STORAGE_KEY = "dyk-admin-theme";

/** Resolve which theme the OS prefers (dark → midnight, light → almanac). */
function getOsTheme(): string {
  if (typeof window === "undefined") return "almanac";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "midnight"
    : "almanac";
}

function getAdminDefault(): string | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(ADMIN_STORAGE_KEY);
  return v && themes.some((t) => t.id === v) ? v : null;
}

/**
 * Returns the theme to display on mount.
 * Priority: admin override > manual user pick > OS preference.
 */
function resolveInitialTheme(): string {
  if (typeof window === "undefined") return "almanac";
  const admin = getAdminDefault();
  if (admin) return admin;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && themes.some((t) => t.id === saved)) return saved;
  // First visit — use OS preference
  return getOsTheme();
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface ThemeContextValue {
  theme: string;
  /** true when following OS preference (no manual override) */
  isAuto: boolean;
  setTheme: (id: string) => void;
  /** Clear manual override and return to OS auto-detection */
  setAuto: () => void;
  themes: ThemeMeta[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "almanac",
  isAuto: false,
  setTheme: () => {},
  setAuto: () => {},
  themes,
});

export function useTheme() {
  return useContext(ThemeContext);
}

/* ------------------------------------------------------------------ */
/*  Apply theme to <html>                                              */
/* ------------------------------------------------------------------ */

function applyTheme(id: string) {
  const meta = themes.find((t) => t.id === id) ?? themes[0];
  const root = document.documentElement;

  // Set CSS custom properties
  for (const [prop, value] of Object.entries(meta.colors)) {
    root.style.setProperty(prop, value);
  }

  // Theme class (used for conditional CSS like grain, starfield)
  for (const t of themes) {
    root.classList.remove(t.className);
  }
  root.classList.add(meta.className);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState("almanac");
  const [isAuto, setIsAuto] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from storage on mount
  useEffect(() => {
    const isManual = localStorage.getItem(MANUAL_KEY) === "true";
    const initial = resolveInitialTheme();
    setThemeState(initial);
    setIsAuto(!isManual && !getAdminDefault());
    applyTheme(initial);
    setMounted(true);
  }, []);

  // Listen for OS dark-mode changes; only auto-switch when not manually overridden
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const isManual = localStorage.getItem(MANUAL_KEY) === "true";
      if (isManual || getAdminDefault()) return;
      const next = e.matches ? "midnight" : "almanac";
      setThemeState(next);
      applyTheme(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  const setTheme = useCallback((id: string) => {
    if (!themes.some((t) => t.id === id)) return;
    setThemeState(id);
    setIsAuto(false);
    localStorage.setItem(STORAGE_KEY, id);
    localStorage.setItem(MANUAL_KEY, "true");
    applyTheme(id);
  }, []);

  const setAuto = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MANUAL_KEY);
    const next = getOsTheme();
    setThemeState(next);
    setIsAuto(true);
    applyTheme(next);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, isAuto, setTheme, setAuto, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}
