'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'classic' | 'modern' | 'luxury';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'classic',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rob-theme') as Theme | null;
    if (stored && ['classic', 'modern', 'luxury'].includes(stored)) {
      setThemeState(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('rob-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  // Prevent flash of wrong theme
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
