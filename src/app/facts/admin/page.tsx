"use client";

import { useState, useEffect } from "react";
import { useTheme, themes as allThemes } from "@/components/facts/ThemeProvider";

const ADMIN_STORAGE_KEY = "dyk-admin-theme";

export default function AdminPage() {
  const { theme, setTheme } = useTheme();
  const [adminDefault, setAdminDefault] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY) ?? "almanac";
    setAdminDefault(stored);
  }, []);

  function handleSaveDefault(id: string) {
    setAdminDefault(id);
    localStorage.setItem(ADMIN_STORAGE_KEY, id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Theme Admin</h1>
      <p className="text-ink-soft font-mono text-sm mb-8">
        Configure the default theme for all visitors and preview themes.
      </p>

      {/* Live preview / personal theme */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold mb-4">
          Preview Theme
        </h2>
        <p className="text-ink-soft font-mono text-xs mb-3">
          Switch the active theme to preview it live.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-lg border-2 transition-all font-mono text-sm ${
                theme === t.id
                  ? "border-[var(--accent)] bg-[var(--surface)]"
                  : "border-[var(--text)]/15 hover:border-[var(--text)]/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-[var(--text)]/20"
                  style={{ backgroundColor: t.colors["--bg"] }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-[var(--text)]/20"
                  style={{ backgroundColor: t.colors["--accent"] }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-[var(--text)]/20"
                  style={{ backgroundColor: t.colors["--text"] }}
                />
              </div>
              <span className="font-semibold uppercase tracking-wide text-xs">
                {t.label}
              </span>
              {theme === t.id && (
                <span className="ml-2 text-[var(--accent)] text-xs">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Default theme for all visitors */}
      <section>
        <h2 className="font-display text-xl font-semibold mb-4">
          Site Default Theme
        </h2>
        <p className="text-ink-soft font-mono text-xs mb-3">
          Set the default theme for new visitors who have not chosen their own.
          Stored in localStorage under <code>dyk-admin-theme</code>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSaveDefault(t.id)}
              className={`p-4 rounded-lg border-2 transition-all font-mono text-sm ${
                adminDefault === t.id
                  ? "border-[var(--accent)] bg-[var(--surface)]"
                  : "border-[var(--text)]/15 hover:border-[var(--text)]/40"
              }`}
            >
              <span className="font-semibold uppercase tracking-wide text-xs">
                {t.label}
              </span>
              {adminDefault === t.id && (
                <span className="ml-2 text-[var(--accent)] text-xs">
                  Default
                </span>
              )}
            </button>
          ))}
        </div>
        {saved && (
          <p className="mt-3 text-sm font-mono text-[var(--accent)]">
            Default theme saved.
          </p>
        )}
      </section>
    </div>
  );
}
