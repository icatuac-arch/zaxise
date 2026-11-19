import Link from "next/link";
import { getAllFacts } from "../../lib/facts";

export function SiteFooter() {
  let factCount: number | null = null;
  try {
    factCount = getAllFacts().length;
  } catch {
    factCount = null;
  }

  return (
    <footer className="w-full border-t border-[var(--muted)]/20 bg-[var(--surface)]/30 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-5">
        {/* Top row: brand + links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-display font-bold text-base text-[var(--text)]">Did You Know?</span>
            <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">A Modern Almanac of Fascinating Facts</span>
          </div>

          {factCount !== null && (
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] border border-[var(--muted)]/25 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" aria-hidden="true" />
              <span><strong className="text-[var(--text)]">{factCount.toLocaleString()}</strong> facts in the almanac</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--muted)]/15" />

        {/* Navigation links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs">
          <Link href="/browse" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Browse</Link>
          <Link href="/quiz" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Quiz</Link>
          <Link href="/daily" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Daily Digest</Link>
          <Link href="/collections" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Collections</Link>
          <Link href="/submit" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Submit a Fact</Link>
        </div>

        {/* Legal links + copyright */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[10px] text-[var(--muted)]/70">
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <Link href="/disclaimer" className="hover:text-[var(--accent)] transition-colors">Disclaimer</Link>
          </div>
          <div className="font-mono text-[10px] text-[var(--muted)]/50 text-center">
            &copy; {new Date().getFullYear()} ZAXIS Ventures LLC. All rights reserved. &nbsp;·&nbsp; For informational purposes only.
          </div>
        </div>
      </div>
    </footer>
  );
}
