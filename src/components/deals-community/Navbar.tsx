'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Flame, Tag, Store, Send, Bell, Lightbulb } from 'lucide-react';
import { FEATURES } from '@/lib/deals-community/features';

const navLinks = [
  { href: '/', label: "Today's Deals", icon: Flame, always: true },
  { href: '/deals/electronics', label: 'Categories', icon: Tag, always: true },
  { href: '/store/amazon', label: 'Stores', icon: Store, always: true },
  { href: '/how-it-works', label: 'How It Works', icon: Lightbulb, always: true },
  { href: '/submit', label: 'Submit Deal', icon: Send, always: false, feature: 'SUBMIT_DEAL' as const },
  { href: '/alerts', label: 'Alerts', icon: Bell, always: false, feature: 'ALERTS' as const },
].filter(link => link.always || (link.feature && FEATURES[link.feature]));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-card-border shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">👑</span>
            <span className="text-xl font-extrabold">
              <span className="text-primary">Deals</span>
              <span className="text-text-heading">King</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search deals, stores, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 !rounded-full !bg-alt-bg !border-card-border text-sm text-text-heading"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-body hover:text-primary transition-colors rounded-lg hover:bg-alt-bg"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-text-body hover:text-text-heading transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-card-border bg-white">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 !rounded-full !bg-alt-bg !border-card-border text-sm text-text-heading"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-text-body hover:text-primary transition-colors rounded-lg hover:bg-alt-bg"
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
