"use client";

import Link from "next/link";
import {
  Zap,
  Heart,
  Tag,
  Wrench,
  Calculator,
  Rocket,
  Brain,
  Globe,
  Music,
  Ticket,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Portal",
    links: [
      { href: "/deals", label: "Tech Deals", icon: Tag },
      { href: "/tools", label: "Free Tools", icon: Wrench },
      { href: "/calc", label: "Calculators", icon: Calculator },
      { href: "/time", label: "Time & Space", icon: Rocket },
      { href: "/facts", label: "Did You Know", icon: Brain },
      { href: "/travel", label: "Travel", icon: Globe },
    ],
  },
  {
    title: "Partner Sites",
    links: [
      { href: "https://indianprograms.com", label: "IndianPrograms", icon: Music, external: true },
      { href: "https://tikvite.com", label: "Tikvite", icon: Ticket, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold">
                Zax<span className="text-accent-light">ise</span>
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Your daily information portal. Events, deals, space news, tools,
              and more — all in one place.
            </p>
          </div>

          {/* Link sections */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) =>
                  "external" in link && link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-400 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; 2026 Zaxise. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted">
            Made with{" "}
            <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for
            everyone
          </p>
        </div>
      </div>
    </footer>
  );
}
