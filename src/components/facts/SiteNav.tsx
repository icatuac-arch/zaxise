"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StreakTracker } from "@/components/StreakTracker";

/* ------------------------------------------------------------------ */
/*  Navigation structure                                               */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Discover",
    icon: "✦",
    items: [
      { label: "Home", href: "/", icon: "⌂" },
      { label: "Explore", href: "/explore", icon: "◎" },
      { label: "Daily Digest", href: "/daily", icon: "📰" },
      { label: "Today's Fact", href: "/today", icon: "◈" },
      { label: "Browse All", href: "/browse", icon: "▤" },
      { label: "Learning Paths", href: "/learn", icon: "🗺" },
      { label: "Map", href: "/map", icon: "🌍" },
    ],
  },
  {
    label: "Play",
    icon: "▷",
    items: [
      { label: "Quiz", href: "/quiz", icon: "?" },
      { label: "Jeopardy", href: "/jeopardy", icon: "J" },
      { label: "Challenge", href: "/challenge", icon: "⏱" },
      { label: "Compare", href: "/compare", icon: "⇄" },
    ],
  },
  {
    label: "More",
    icon: "⋯",
    items: [
      { label: "Collections", href: "/collections", icon: "□" },
      { label: "Fact Chains", href: "/chains", icon: "⛓" },
      { label: "Blog", href: "/blog", icon: "✦" },
      { label: "Stats", href: "/stats", icon: "◉" },
      { label: "Submit a Fact", href: "/submit", icon: "+" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Search bar                                                         */
/* ------------------------------------------------------------------ */

function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/facts?q=${encodeURIComponent(q)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.facts ?? data ?? []);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center gap-2 border border-[var(--muted)]/40 rounded-full px-3 py-1.5 transition-all duration-200 bg-[var(--surface)]/60 ${
          open ? "w-56 border-[var(--accent)]/50" : "w-8 md:w-40"
        }`}
      >
        <button
          aria-label="Search facts"
          onClick={() => { setOpen(true); inputRef.current?.focus(); }}
          className="flex-shrink-0 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
            <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search facts…"
          aria-label="Search facts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
          }}
          className={`bg-transparent font-mono text-xs text-[var(--text)] placeholder:text-[var(--muted)]/60 outline-none transition-all duration-200 ${
            open ? "w-full" : "w-0 md:w-full"
          }`}
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="flex-shrink-0 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-xs leading-none"
          >
            ×
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--bg)] border border-[var(--muted)]/25 rounded-xl shadow-xl z-50 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 font-mono text-xs text-[var(--muted)]">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 font-mono text-xs text-[var(--muted)]">No results found.</div>
          )}
          {!loading && results.length > 0 && (
            <ul role="listbox" aria-label="Search results">
              {results.map((fact) => (
                <li key={fact.id}>
                  <Link
                    href={`/share/${fact.id}`}
                    onClick={() => { setOpen(false); setQuery(""); onClose?.(); }}
                    className="block px-4 py-3 text-xs text-[var(--text)] hover:bg-[var(--surface)] transition-colors border-b border-[var(--muted)]/10 last:border-0 line-clamp-2"
                  >
                    {fact.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="px-4 py-2 bg-[var(--surface)]/60 border-t border-[var(--muted)]/10">
            <Link
              href={`/browse?q=${encodeURIComponent(query)}`}
              onClick={() => { setOpen(false); setQuery(""); onClose?.(); }}
              className="font-mono text-xs text-[var(--accent)] hover:underline"
            >
              See all results →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop dropdown group                                             */
/* ------------------------------------------------------------------ */

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = group.items.some((i) => {
    if (i.href === "/") return pathname === "/";
    return pathname.startsWith(i.href);
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-2 py-1.5 rounded transition-colors select-none ${
          isActive
            ? "text-[var(--accent)]"
            : "text-[var(--text)] hover:text-[var(--accent)]"
        }`}
      >
        <span aria-hidden="true" className="text-[10px]">{group.icon}</span>
        {group.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="2,3.5 5,6.5 8,3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          role="menu"
          className="absolute top-full left-0 mt-1 w-48 bg-[var(--bg)] border border-[var(--muted)]/25 rounded-xl shadow-xl z-50 overflow-hidden py-1"
        >
          {group.items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 font-mono text-xs transition-colors ${
                  active
                    ? "text-[var(--accent)] bg-[var(--surface)]"
                    : "text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                }`}
              >
                <span aria-hidden="true" className="w-4 text-center opacity-60">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile menu                                                        */
/* ------------------------------------------------------------------ */

function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(NAV_GROUPS[0].label);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[var(--text)]/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-[var(--bg)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--muted)]/20">
          <span className="font-display font-bold text-lg text-[var(--text)]">Navigation</span>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--muted)]/30 text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-[var(--muted)]/20">
          <SearchBar onClose={onClose} />
        </div>

        {/* Accordion groups */}
        <nav className="flex-1 overflow-y-auto py-3" aria-label="Mobile navigation">
          {NAV_GROUPS.map((group) => {
            const isGroupActive = group.items.some((i) => {
              if (i.href === "/") return pathname === "/";
              return pathname.startsWith(i.href);
            });
            const isExpanded = expanded === group.label;

            return (
              <div key={group.label} className="border-b border-[var(--muted)]/10 last:border-0">
                <button
                  onClick={() => setExpanded(isExpanded ? null : group.label)}
                  aria-expanded={isExpanded}
                  className={`w-full flex items-center justify-between px-5 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    isGroupActive ? "text-[var(--accent)]" : "text-[var(--text)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{group.icon}</span>
                    {group.label}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="2,4 6,8 10,4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="pb-2">
                    {group.items.map((item) => {
                      const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 pl-8 pr-5 py-2.5 font-mono text-xs transition-colors ${
                              active
                                ? "text-[var(--accent)] bg-[var(--surface)]"
                                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50"
                            }`}
                          >
                            <span aria-hidden="true" className="w-4 text-center">{item.icon}</span>
                            {item.label}
                            {active && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer strip */}
        <div className="px-5 py-4 border-t border-[var(--muted)]/20 flex flex-col gap-3">
          <StreakTracker />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--muted)]">ZAXIS Ventures LLC</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumb / active page indicator                                 */
/* ------------------------------------------------------------------ */

function ActiveIndicator({ pathname }: { pathname: string }) {
  // Find current group + item
  let groupLabel: string | null = null;
  let itemLabel: string | null = null;

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const match = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
      if (match) {
        groupLabel = group.label;
        itemLabel = item.label;
        break;
      }
    }
    if (groupLabel) break;
  }

  if (!groupLabel || !itemLabel) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-1.5 flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider border-b border-[var(--muted)]/10">
      <span>{groupLabel}</span>
      <span aria-hidden="true">›</span>
      <span className="text-[var(--accent)]">{itemLabel}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main SiteNav component                                             */
/* ------------------------------------------------------------------ */

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--muted)]/20 bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-[var(--text)] hover:text-[var(--accent)] transition-colors flex-shrink-0"
            aria-label="Did You Know? — Home"
          >
            Did You Know?
          </Link>

          {/* Desktop nav groups */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_GROUPS.map((group) => (
              <DesktopDropdown key={group.label} group={group} pathname={pathname} />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak tracker — desktop only */}
            <div className="hidden lg:block">
              <StreakTracker />
            </div>

            {/* Search — hidden on mobile (available in mobile drawer) */}
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            {/* Theme toggle — desktop only (also in mobile drawer) */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--muted)]/30 hover:border-[var(--accent)]/50 transition-colors"
            >
              <span className="w-5 h-px bg-[var(--text)] block" aria-hidden="true" />
              <span className="w-5 h-px bg-[var(--text)] block" aria-hidden="true" />
              <span className="w-3.5 h-px bg-[var(--text)] block self-start ml-[5px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Breadcrumb strip — hide on home */}
        {pathname !== "/" && <ActiveIndicator pathname={pathname} />}
      </header>

      {/* Mobile fullscreen drawer */}
      <MobileMenu
        open={mobileOpen}
        pathname={pathname}
        onClose={closeMobile}
      />
    </>
  );
}
