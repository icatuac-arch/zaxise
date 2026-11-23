"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  { href: "/travel", label: "Travel" },
];

export default function SiteHeader({ searchQuery, onSearch }: Props) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleChange = (value: string) => {
    setLocalQuery(value);
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-10 border-b border-[#E9DFE4] bg-white/95 backdrop-blur-[18px]"
      style={{ boxShadow: "0 2px 22px #50243808" }}
    >
      <div className="mx-auto flex max-w-[1260px] items-center gap-7 px-6 py-[19px]">
        <Link
          href="/"
          className="text-[30px] font-[850] tracking-[-1.8px] text-[#29232B] whitespace-nowrap"
        >
          ZA<b style={{ color: "#801C45" }}>X</b>ISE
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-[14px] font-[650] md:flex">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#801C45]"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#801C45]"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <input
          type="text"
          placeholder="⌕  Find a tool or service"
          value={localQuery}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 w-[220px] rounded-[12px] border border-transparent bg-[#F3E6ED] px-3 py-[9px] text-sm outline-none focus:outline-[2px] focus:outline-[#BA7396]"
          aria-label="Search services — press Enter to search"
        />
      </div>
    </header>
  );
}
