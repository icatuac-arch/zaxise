"use client";

import { useTheme } from "./ThemeProvider";

/**
 * Decorative floating leaf elements for the Nature theme.
 * Pure CSS positioned — lightweight, no JS animations.
 * Only renders when nature theme is active.
 */
export function NatureDecor() {
  const { theme } = useTheme();
  if (theme !== "nature") return null;

  const leaves = [
    { emoji: "\u{1F343}", top: "8%", left: "3%", dur: "22s", delay: "0s" },
    { emoji: "\u{1F33F}", top: "15%", right: "5%", dur: "18s", delay: "2s" },
    { emoji: "\u{1F341}", top: "35%", left: "2%", dur: "25s", delay: "4s" },
    { emoji: "\u{1F33F}", top: "55%", right: "3%", dur: "20s", delay: "1s" },
    { emoji: "\u{1F343}", top: "72%", left: "4%", dur: "23s", delay: "3s" },
    { emoji: "\u{1F341}", top: "88%", right: "4%", dur: "19s", delay: "5s" },
    { emoji: "\u{1F33F}", top: "45%", left: "1%", dur: "26s", delay: "6s" },
    { emoji: "\u{1F343}", top: "25%", right: "2%", dur: "21s", delay: "7s" },
  ];

  return (
    <div className="nature-decor-container" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="nature-leaf"
          style={{
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            ["--dur" as string]: leaf.dur,
            ["--delay" as string]: leaf.delay,
          }}
        >
          {leaf.emoji}
        </span>
      ))}
    </div>
  );
}

/**
 * A vine/leaf separator for between sections.
 * Only visible in nature theme.
 */
export function NatureVineSeparator() {
  const { theme } = useTheme();
  if (theme !== "nature") return null;

  return (
    <div className="nature-vine-separator" aria-hidden="true">
      &#x1F343; &#x2500; &#x1F33F; &#x2500; &#x1F343;
    </div>
  );
}
