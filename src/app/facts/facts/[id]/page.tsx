import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllFacts, getFactById, getFactsByCategory } from "../../../../lib/facts";
import { FactViewTracker } from "@/components/facts/FactViewTracker";
import { CategoryVisuals } from "@/components/facts/CategoryVisuals";
import { CategoryHeader } from "@/components/facts/CategoryHeader";

// Skip static generation — 40K+ pages causes Vercel stack overflow
// Pages render on-demand and are cached via ISR

export default async function FactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fact = getFactById(id);

  if (!fact) {
    notFound();
  }

  const relatedFacts = getFactsByCategory(fact.category, 1, 50).facts.filter(
    (f: { id: string }) => f.id !== fact.id
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative">
      {/* Category-specific decorative visuals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryVisuals category={fact.category} />
      </div>

      <FactViewTracker category={fact.category} />
      <Link
        href="/browse"
        className="relative z-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-tomato transition-colors mb-8"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Browse
      </Link>

      {/* Compact category header */}
      <div className="relative z-10 mb-8">
        <CategoryHeader category={fact.category} compact />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <span className="stamp">{fact.category}</span>
        </div>

        <blockquote className="mb-8 max-w-2xl">
          <span className="text-tomato font-display text-5xl leading-none select-none">
            &ldquo;
          </span>
          <p className="font-display text-2xl md:text-3xl italic leading-relaxed -mt-8 px-4">
            {fact.text}
          </p>
          <span className="text-tomato font-display text-5xl leading-none select-none">
            &rdquo;
          </span>
        </blockquote>

        <p className="font-mono text-xs text-ink-soft mb-4">
          Source:{" "}
          <a
            href={fact.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-tomato"
          >
            {fact.source.name}
          </a>
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {fact.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs text-ink-soft border border-ink/10 px-2 py-1"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-ink-soft uppercase">
            Difficulty:
          </span>
          <span className="stamp">
            {fact.difficulty}
          </span>
        </div>
      </div>

      {relatedFacts.length > 0 && (
        <div className="relative z-10">
          <div className="divider my-12" />
          <h2 className="font-display text-xl font-bold mb-6">
            More {fact.category} Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedFacts.slice(0, 4).map((related) => (
              <Link
                key={related.id}
                href={`/facts/${related.id}`}
                className="border border-ink/15 p-4 hover:border-ink/40 transition-colors"
              >
                <p className="font-display text-sm leading-relaxed line-clamp-3">
                  {related.text}
                </p>
                <p className="font-mono text-xs text-ink-soft mt-2">
                  {related.source.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
