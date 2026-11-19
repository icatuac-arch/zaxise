"use client";

import { getCategoryMeta } from "@/data/facts/categories";

interface CategoryHeaderProps {
  category: string;
  factCount?: number;
  /** If true, renders a compact inline-style header instead of full banner */
  compact?: boolean;
}

export function CategoryHeader({ category, factCount, compact = false }: CategoryHeaderProps) {
  const meta = getCategoryMeta(category);

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 border"
        style={{
          background: `${meta.accent}10`,
          borderColor: `${meta.accent}30`,
        }}
      >
        <span className="text-3xl" aria-hidden="true">{meta.emoji}</span>
        <div className="min-w-0">
          <h2
            className="font-display font-bold text-lg leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            {category}
          </h2>
          <p className="font-mono text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {meta.tagline}
            {factCount !== undefined && (
              <span className="ml-2 opacity-60">— {factCount.toLocaleString()} facts</span>
            )}
          </p>
        </div>
        {/* Accent line */}
        <div
          className="ml-auto w-1 self-stretch rounded-full flex-shrink-0"
          style={{ background: meta.accent }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden mb-8"
      style={{
        background: `linear-gradient(135deg, ${meta.accent}18 0%, ${meta.accent}08 50%, ${meta.accent}14 100%)`,
        border: `1.5px solid ${meta.accent}30`,
      }}
    >
      {/* Decorative large emoji watermark */}
      <span
        className="absolute -right-4 -top-4 text-[7rem] pointer-events-none select-none"
        style={{ opacity: 0.07, filter: "blur(1px)" }}
        aria-hidden="true"
      >
        {meta.emoji}
      </span>

      {/* Gradient accent stripe at top */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${meta.accent}00, ${meta.accent}, ${meta.accent}00)`,
        }}
      />

      <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-7">
        {/* Icon + category name row */}
        <div className="flex items-start gap-4">
          {/* Icon badge */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm"
            style={{
              background: `${meta.accent}20`,
              border: `1.5px solid ${meta.accent}40`,
            }}
          >
            {meta.emoji}
          </div>

          <div className="min-w-0 flex-1">
            {/* Breadcrumb hint */}
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1"
              style={{ color: meta.accent }}
            >
              Category
            </p>

            {/* Category name */}
            <h1
              className="font-display font-bold text-2xl sm:text-3xl leading-tight tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {category}
            </h1>

            {/* Tagline */}
            <p
              className="font-display italic text-base mt-1 leading-snug"
              style={{ color: "var(--muted)" }}
            >
              {meta.tagline}
            </p>
          </div>
        </div>

        {/* Stats row */}
        {factCount !== undefined && (
          <div className="mt-5 pt-4 flex items-center gap-4 flex-wrap" style={{ borderTop: `1px dashed ${meta.accent}30` }}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: meta.accent }}
              />
              <span
                className="font-mono text-xs tracking-[0.12em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                {factCount.toLocaleString()} facts
              </span>
            </div>
            {/* Related emojis */}
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: `${meta.accent}80` }}
            >
              {meta.icons}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
