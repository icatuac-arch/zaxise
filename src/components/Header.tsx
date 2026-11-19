"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  Tag,
  Wrench,
  Calculator,
  Clock,
  Rocket,
  Brain,
  Globe,
  Music,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/deals", label: "Deals", icon: Tag, color: "text-yellow-400" },
  { href: "/tools", label: "Tools", icon: Wrench, color: "text-cyan-400" },
  { href: "/calc", label: "Calculators", icon: Calculator, color: "text-emerald-400" },
  { href: "/time", label: "Time & Space", icon: Rocket, color: "text-blue-400" },
  { href: "/facts", label: "Did You Know", icon: Brain, color: "text-pink-400" },
  { href: "/travel", label: "Travel", icon: Globe, color: "text-green-400" },
];

const EXTERNAL_LINKS = [
  { href: "https://indianprograms.com", label: "IndianPrograms", icon: Music, color: "text-orange-400" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 transition-shadow group-hover:shadow-indigo-500/40">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Zax<span className="text-accent-light">ise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-surface-hover"
            >
              <link.icon className={`h-3.5 w-3.5 ${link.color}`} />
              {link.label}
            </Link>
          ))}
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-surface-hover"
            >
              <link.icon className={`h-3.5 w-3.5 ${link.color}`} />
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                >
                  <link.icon className={`h-4 w-4 ${link.color}`} />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {EXTERNAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                >
                  <link.icon className={`h-4 w-4 ${link.color}`} />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
