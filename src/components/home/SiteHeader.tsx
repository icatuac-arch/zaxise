"use client";

import Link from "next/link";

interface Props {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const NAV_LINKS = [
  { href: "#community", label: "Events" },
  { href: "#deals", label: "Deals" },
  { href: "#tools", label: "Tools" },
  { href: "#clocks", label: "Time & Space" },
  { href: "#discover", label: "Discover" },
  { href: "https://tikvite.com/", label: "Ticketing ↗", external: true },
];

export default function SiteHeader({ searchQuery, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1260px] items-center gap-7 px-6 py-4">
        <Link
          href="/"
          className="text-[29px] font-[850] tracking-[3px] text-navy whitespace-nowrap"
        >
          ZA<b className="text-[#bd8530]">X</b>ISE
        </Link>

        <nav className="hidden flex-1 items-center gap-[22px] text-[13px] font-[650] md:flex">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-hover"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-gold-hover"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <input
          type="text"
          placeholder="⌕  Find a tool or service"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="min-w-0 w-[190px] rounded-[9px] border border-line bg-[#f7f7f4] px-3 py-[9px] text-sm outline-none focus:border-gold"
          aria-label="Search services"
        />
      </div>
    </header>
  );
}
