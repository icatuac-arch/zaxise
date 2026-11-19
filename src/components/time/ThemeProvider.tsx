"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Theme = "default" | "galaxy" | "aurora" | "mars";

const ThemeContext = createContext<{ theme: Theme; cycleTheme: () => void }>({
  theme: "galaxy",
  cycleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("mars");

  useEffect(() => {
    const saved = localStorage.getItem("dateandtimezone_theme") as Theme | null;
    if (saved === "default" || saved === "galaxy" || saved === "aurora" || saved === "mars") {
      setTheme(saved);
    }
  }, []);

  const cycleTheme = () => {
    const next: Theme = theme === "default" ? "galaxy" : theme === "galaxy" ? "aurora" : theme === "aurora" ? "mars" : "default";
    setTheme(next);
    localStorage.setItem("dateandtimezone_theme", next);
  };

  const themeBg =
    theme === "mars"
      ? "bg-white"
      : theme === "galaxy"
        ? "bg-[radial-gradient(ellipse_at_top,_#0c1445_0%,_#020617_50%,_#000000_100%)]"
        : theme === "aurora"
          ? "bg-[radial-gradient(ellipse_at_top_left,_#042f2e_0%,_#0f172a_40%,_#1e1b4b_100%)]"
          : "bg-dark-bg";

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      <div className={`relative min-h-screen ${themeBg}`} data-theme={theme}>
        {/* Galaxy stars */}
        {theme === "galaxy" && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}
          </div>
        )}
        {/* Aurora glow */}
        {theme === "aurora" && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-emerald-500/10 blur-[150px] animate-pulse" style={{ animationDuration: "6s" }} />
            <div className="absolute top-10 right-1/4 w-[500px] h-[350px] rounded-full bg-violet-500/10 blur-[140px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />
            <div className="absolute top-20 left-1/2 w-[400px] h-[300px] rounded-full bg-cyan-500/8 blur-[120px] animate-pulse" style={{ animationDuration: "7s", animationDelay: "4s" }} />
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}
