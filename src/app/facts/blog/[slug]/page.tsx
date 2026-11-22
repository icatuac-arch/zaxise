import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/facts/blog";
import type { Fact } from "../../../../lib/schema";

/* ------------------------------------------------------------------ */
/*  Static generation                                                   */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                            */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found — Did You Know?",
    };
  }

  const url = `https://didyouknow.app/blog/${slug}`;
  const title = `${article.title} — Did You Know?`;

  return {
    title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      tags: [article.category, "facts", "did you know"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-[var(--accent)] bg-[var(--accent)]/10",
  medium: "text-[var(--secondary)] bg-[var(--secondary)]/10",
  hard: "text-[var(--muted)] bg-[var(--muted)]/10",
};

/* ------------------------------------------------------------------ */
/*  Fact list item                                                      */
/* ------------------------------------------------------------------ */

function FactItem({ fact, index }: { fact: Fact; index: number }) {
  return (
    <li className="flex gap-5 py-6 border-b border-[var(--muted)]/10 last:border-0">
      {/* Number */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full border border-[var(--muted)]/20 bg-[var(--surface)]/60 flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)] mt-0.5">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text)] text-base leading-relaxed mb-3">
          {fact.text}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] uppercase tracking-wider">
            {fact.category}
          </span>

          {/* Difficulty */}
          <span
            className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider ${DIFFICULTY_COLOR[fact.difficulty] ?? "text-[var(--muted)] bg-[var(--muted)]/10"}`}
          >
            {DIFFICULTY_LABEL[fact.difficulty] ?? fact.difficulty}
          </span>

          {/* Source */}
          {fact.source?.url && (
            <a
              href={fact.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label={`Source: ${fact.source.name}`}
            >
              <svg
                viewBox="0 0 12 12"
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 1H11v3.5M11 1 6 6"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {fact.source.name}
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Share button (client island)                                        */
/* ------------------------------------------------------------------ */

function ShareSection({ title, slug }: { title: string; slug: string }) {
  const url = `https://didyouknow.app/blog/${slug}`;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">
        Share:
      </span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter / X"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--muted)]/30 font-mono text-xs text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
      >
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M16.99 0H20L13 8.63 21.41 20h-5.96l-5-6.59L4.38 20H1.37l7.47-9.26L.57 0h6.12l4.48 5.89L16.99 0zm-1.05 17.92h1.66L5.11 1.73H3.33l12.61 16.19z" />
        </svg>
        Twitter
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--muted)]/30 font-mono text-xs text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
      >
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M4.477 3.019C4.477 4.13 3.585 5.04 2.489 5.04 1.394 5.04.5 4.131.5 3.019.5 1.908 1.394 1 2.489 1c1.096 0 1.988.908 1.988 2.019zM.5 6.5h4V20h-4V6.5zM7.5 6.5h3.836v1.87h.055C11.892 7.06 13.2 6.16 15 6.16 19.2 6.16 20 8.94 20 12.66V20h-3.994v-6.57c0-1.57-.028-3.58-2.184-3.58-2.188 0-2.522 1.71-2.522 3.47V20H7.5V6.5z" />
        </svg>
        LinkedIn
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--muted)]/30 font-mono text-xs text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
      >
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M18 1H2C1.447 1 1 1.448 1 2v16c0 .552.447 1 1 1h8.615v-6.96h-2.338v-2.725h2.338V7.769c0-2.321 1.417-3.585 3.487-3.585.994 0 1.847.072 2.096.106v2.427h-1.438c-1.128 0-1.348.537-1.348 1.322v1.735h2.695l-.35 2.725h-2.345V19H18c.553 0 1-.448 1-1V2c0-.552-.447-1-1-1z" />
        </svg>
        Facebook
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(slug, 3);

  /* Schema.org structured data */
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Did You Know?",
      url: "https://didyouknow.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Did You Know?",
      url: "https://didyouknow.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://didyouknow.app/blog/${slug}`,
    },
    keywords: [article.category, "facts", "did you know", "trivia"],
    articleSection: article.category,
    wordCount: article.facts.reduce((acc, f) => acc + f.text.split(" ").length, 0),
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider mb-8"
        >
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href="/facts/blog" className="hover:text-[var(--accent)] transition-colors">
            Blog
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--accent)]">{article.category}</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] uppercase tracking-wider font-semibold">
              {article.category}
            </span>
            <time
              dateTime={article.publishedAt}
              className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider"
            >
              {formatDate(article.publishedAt)}
            </time>
            <span className="font-mono text-[10px] text-[var(--muted)]">
              · {article.facts.length} facts
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)] leading-tight mb-5">
            {article.title}
          </h1>

          <p className="text-[var(--muted)] text-base leading-relaxed">
            {article.description}
          </p>

          {/* Divider */}
          <div className="mt-6 h-px bg-gradient-to-r from-[var(--accent)]/40 via-[var(--muted)]/20 to-transparent" />
        </header>

        {/* Facts list */}
        <section aria-label="Facts">
          <ul className="divide-y divide-transparent">
            {article.facts.map((fact, i) => (
              <FactItem key={fact.id} fact={fact} index={i} />
            ))}
          </ul>
        </section>

        {/* Share section */}
        <section
          aria-label="Share this article"
          className="mt-10 p-5 rounded-2xl border border-[var(--muted)]/20 bg-[var(--surface)]/40"
        >
          <h2 className="font-display text-base font-bold text-[var(--text)] mb-4">
            Share this article
          </h2>
          <ShareSection title={article.title} slug={slug} />
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section aria-label="Related articles" className="mt-12">
            <h2 className="font-display text-xl font-bold text-[var(--text)] mb-5">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col gap-2 p-4 rounded-xl border border-[var(--muted)]/20 bg-[var(--surface)]/40 hover:bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-all duration-200"
                >
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] uppercase tracking-wider w-fit">
                    {rel.category}
                  </span>
                  <h3 className="font-display text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                    {rel.title}
                  </h3>
                  <span className="font-mono text-[10px] text-[var(--muted)] mt-auto">
                    {rel.factIds.length} facts
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-8 border-t border-[var(--muted)]/10">
          <Link
            href="/facts/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
              <polyline
                points="7.5,2 3.5,6 7.5,10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}
