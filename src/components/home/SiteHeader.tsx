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
  { href: "#housing", label: "Rent or Buy" },
];

export default function SiteHeader({ searchQuery, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur-[18px]">
      <div className="mx-auto flex max-w-[1260px] items-center gap-7 px-6 py-[19px]">
        <Link
          href="/"
          className="text-[30px] font-[850] tracking-[-1.8px] text-navy whitespace-nowrap"
        >
          ZA<b className="text-[#7254ef]">X</b>ISE
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-[14px] font-[650] md:flex">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#6245d9]"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#6245d9]"
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
          className="min-w-0 w-[220px] rounded-[12px] border border-transparent bg-[#f3f4f9] px-3 py-[9px] text-sm outline-none focus:outline-[2px] focus:outline-[#9b89ff]"
          aria-label="Search services"
        />
      </div>
    </header>
  );
}
