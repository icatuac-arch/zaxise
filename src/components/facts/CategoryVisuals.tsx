"use client";

import { useMemo } from "react";
import { getCategoryMeta } from "@/data/facts/categories";
import type { ImmersiveConfig } from "@/data/facts/categories";

/* ------------------------------------------------------------------ */
/*  Deterministic position generator                                    */
/* ------------------------------------------------------------------ */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface FloatPos {
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
  drift: number;
  rotate: number;
}

function getFloatPositions(category: string, count: number): FloatPos[] {
  const seed = hashString(category);
  return Array.from({ length: count }, (_, i) => {
    const n = hashString(category + i);
    return {
      top: `${8 + ((n * 17 + seed * i) % 75)}%`,
      left: `${3 + ((n * 23 + seed * (i + 1)) % 88)}%`,
      delay: `${((n * 7) % 5000)}ms`,
      duration: `${12000 + ((n * 13) % 10000)}ms`,
      size: `${1.8 + (i % 3) * 0.8}rem`,
      drift: 10 + ((n * 11) % 20),
      rotate: ((n * 3) % 30) - 15,
    };
  });
}

function getSilhouettePositions(category: string, silhouettes: string[]): FloatPos[] {
  const seed = hashString(category + "sil");
  return silhouettes.map((_, i) => {
    const n = hashString(category + "sil" + i);
    return {
      top: `${15 + ((n * 19) % 50)}%`,
      left: `${5 + ((n * 29 + seed) % 70)}%`,
      delay: `${((n * 11) % 6000)}ms`,
      duration: `${20000 + ((n * 7) % 15000)}ms`,
      size: `${6 + (i % 2) * 3}rem`,
      drift: 15 + ((n * 5) % 20),
      rotate: ((n * 7) % 20) - 10,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Star field generator for space-like categories                      */
/* ------------------------------------------------------------------ */

function getStarField(seed: number, count: number): { x: string; y: string; size: number; delay: number; opacity: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const n = hashString(`star${seed}${i}`);
    return {
      x: `${(n * 37) % 100}%`,
      y: `${(n * 53) % 100}%`,
      size: 0.5 + ((n * 7) % 3) * 0.5,
      delay: (n * 11) % 5,
      opacity: 0.15 + ((n * 13) % 60) / 100,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CategoryVisualsProps {
  category: string;
  variant?: "page" | "banner";
}

export function CategoryVisuals({ category, variant = "page" }: CategoryVisualsProps) {
  const meta = getCategoryMeta(category);
  const imm = meta.immersive;
  const floatCount = imm.floatCount ?? 5;
  const floatPositions = useMemo(() => getFloatPositions(category, floatCount), [category, floatCount]);
  const silhouettePositions = useMemo(
    () => imm.silhouettes ? getSilhouettePositions(category, imm.silhouettes) : [],
    [category, imm.silhouettes]
  );
  const extras = imm.floatingExtras ?? [];

  // Star field for space-like categories
  const starField = useMemo(() => {
    if (imm.patternClass === "immersive-stars") {
      return getStarField(hashString(category), 120);
    }
    return [];
  }, [category, imm.patternClass]);

  if (variant === "banner") {
    return (
      <div
        className="w-full h-1.5 relative overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${imm.accent}00, ${imm.accent}, ${imm.accent}00)`,
        }}
      />
    );
  }

  return (
    <>
      {/* Full-bleed gradient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{ background: imm.gradientBg }}
      />

      {/* Nebula patches for space-like themes */}
      {imm.patternClass === "immersive-stars" && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute rounded-full"
            style={{
              width: "40%",
              height: "40%",
              top: "10%",
              left: "5%",
              background: `radial-gradient(ellipse, ${imm.accent}08, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "35%",
              height: "35%",
              top: "50%",
              right: "5%",
              background: `radial-gradient(ellipse, #B24BF308, transparent 70%)`,
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "30%",
              height: "30%",
              bottom: "10%",
              left: "30%",
              background: `radial-gradient(ellipse, #FF3CAC06, transparent 70%)`,
              filter: "blur(45px)",
            }}
          />
        </div>
      )}

      {/* Star field dots */}
      {starField.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {starField.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: star.x,
                top: star.y,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: i % 5 === 0 ? imm.accent : "#ffffff",
                opacity: star.opacity,
                animation: `immersive-twinkle ${3 + star.delay}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Pattern overlay */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 select-none ${imm.patternClass}`}
        style={{ color: imm.accent }}
      />

      {/* Accent gradient stripe at top */}
      <div
        className="absolute inset-x-0 top-0 h-[4px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${imm.accent}80 20%, ${imm.accent} 50%, ${imm.accent}80 80%, transparent 100%)`,
        }}
      />

      {/* Top banner decoration — savanna for Animals, waves for Ocean, etc. */}
      <CategoryBannerDecoration category={category} immersive={imm} />

      {/* Large background silhouettes */}
      {imm.silhouettes && silhouettePositions.map((pos, i) => (
        <span
          key={`sil-${i}`}
          className="absolute pointer-events-none select-none z-0"
          style={{
            top: pos.top,
            left: pos.left,
            fontSize: pos.size,
            opacity: 0.035,
            animation: `immersive-drift ${pos.duration} ${pos.delay} ease-in-out infinite`,
            filter: "blur(2px)",
            transform: `rotate(${pos.rotate}deg)`,
          }}
          aria-hidden="true"
        >
          {imm.silhouettes![i]}
        </span>
      ))}

      {/* Floating emojis */}
      {floatPositions.map((pos, i) => {
        const emoji = extras[i % extras.length] || meta.emoji;
        return (
          <span
            key={`float-${i}`}
            className="absolute pointer-events-none select-none z-0"
            style={{
              top: pos.top,
              left: pos.left,
              fontSize: pos.size,
              opacity: 0.06,
              animation: `immersive-float ${pos.duration} ${pos.delay} ease-in-out infinite alternate`,
              willChange: "transform",
              filter: "blur(0.3px)",
            }}
            aria-hidden="true"
          >
            {emoji}
          </span>
        );
      })}

      {/* Bubbles for Ocean */}
      {imm.patternClass === "immersive-waves" && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 15 }, (_, i) => {
            const n = hashString(`bubble${category}${i}`);
            const size = 4 + (n % 12);
            return (
              <div
                key={`bubble-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${(n * 37) % 95}%`,
                  bottom: `-${size}px`,
                  border: `1px solid ${imm.accent}25`,
                  background: `${imm.accent}08`,
                  animation: `immersive-bubble ${8 + (n % 10)}s ${(n % 5)}s ease-in infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Matrix rain for Technology */}
      {imm.patternClass === "immersive-circuit" && imm.cardStyle === "terminal" && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.04]">
          {Array.from({ length: 12 }, (_, i) => {
            const n = hashString(`matrix${category}${i}`);
            const chars = "01アイウエオカキクケコ{}[]<>/\\";
            return (
              <div
                key={`matrix-${i}`}
                className="absolute font-mono text-xs"
                style={{
                  left: `${(n * 31) % 95}%`,
                  top: `-20px`,
                  color: imm.accent,
                  animation: `immersive-matrix-fall ${6 + (n % 8)}s ${(n % 4)}s linear infinite`,
                  whiteSpace: "pre",
                  lineHeight: "1.4",
                }}
              >
                {Array.from({ length: 12 }, (_, j) => chars[(n + j * 7) % chars.length]).join("\n")}
              </div>
            );
          })}
        </div>
      )}

      {/* Musical equalizer bars for Music */}
      {imm.patternClass === "immersive-music" && (
        <div className="absolute bottom-0 inset-x-0 pointer-events-none z-0 flex items-end justify-center gap-1 h-32 opacity-[0.06] overflow-hidden">
          {Array.from({ length: 40 }, (_, i) => {
            const n = hashString(`eq${category}${i}`);
            return (
              <div
                key={`eq-${i}`}
                className="rounded-t-sm"
                style={{
                  width: "3px",
                  background: `linear-gradient(to top, ${imm.accent}, ${imm.accent}40)`,
                  animation: `immersive-equalizer ${0.5 + (n % 10) * 0.1}s ${(n % 5) * 0.1}s ease-in-out infinite alternate`,
                  height: `${10 + (n % 60)}%`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Wave clip-path divider for Ocean */}
      {imm.patternClass === "immersive-waves" && (
        <div
          className="absolute top-0 inset-x-0 h-20 pointer-events-none z-[1]"
          style={{
            background: `linear-gradient(180deg, ${imm.bg}, transparent)`,
            clipPath: "polygon(0 0, 100% 0, 100% 60%, 80% 80%, 60% 65%, 40% 85%, 20% 70%, 0 80%)",
          }}
        />
      )}

      {/* Wax seal decorations for History */}
      {category === "History" && (
        <>
          <div
            className="absolute pointer-events-none z-0"
            style={{
              top: "5%",
              right: "5%",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${imm.accent}30, ${imm.accent}15 60%, transparent 70%)`,
              boxShadow: `inset 0 2px 8px ${imm.accent}20`,
              opacity: 0.5,
            }}
          />
          <div
            className="absolute pointer-events-none z-0"
            style={{
              bottom: "10%",
              left: "3%",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${imm.accent}25, ${imm.accent}10 60%, transparent 70%)`,
              boxShadow: `inset 0 2px 6px ${imm.accent}18`,
              opacity: 0.4,
            }}
          />
        </>
      )}

      {/* Recipe stripe decoration for Food */}
      {category === "Food" && (
        <div
          className="absolute top-0 inset-x-0 h-3 pointer-events-none z-[1]"
          style={{
            background: `repeating-linear-gradient(90deg, ${imm.accent} 0px, ${imm.accent} 20px, transparent 20px, transparent 30px)`,
            opacity: 0.15,
          }}
        />
      )}

      {/* Vine decorations for Nature */}
      {(imm.patternClass === "immersive-leaves" || imm.cardStyle === "leaf") && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-40 h-40"
            style={{
              background: `radial-gradient(ellipse at 0% 0%, ${imm.accent}12, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40"
            style={{
              background: `radial-gradient(ellipse at 100% 100%, ${imm.accent}10, transparent 70%)`,
            }}
          />
        </div>
      )}

      {/* Keyframe injection */}
      <style>{`
        @keyframes immersive-float {
          0%   { transform: translateY(0px) rotate(-3deg) scale(1); }
          25%  { transform: translateY(-16px) rotate(2deg) scale(1.05); }
          50%  { transform: translateY(-8px) rotate(-2deg) scale(0.97); }
          75%  { transform: translateY(-22px) rotate(3deg) scale(1.03); }
          100% { transform: translateY(-28px) rotate(5deg) scale(1.07); }
        }
        @keyframes immersive-drift {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(var(--rot, 0deg)); }
          25% { transform: translateY(-10px) translateX(8px) rotate(calc(var(--rot, 0deg) + 3deg)); }
          50% { transform: translateY(-5px) translateX(-5px) rotate(calc(var(--rot, 0deg) - 2deg)); }
          75% { transform: translateY(-15px) translateX(5px) rotate(calc(var(--rot, 0deg) + 2deg)); }
        }
        @keyframes immersive-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.5); }
        }
        @keyframes immersive-bubble {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100vh) translateX(20px) scale(0.5); opacity: 0; }
        }
        @keyframes immersive-matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes immersive-equalizer {
          0% { height: 10%; }
          100% { height: var(--eq-h, 60%); }
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Category-specific top banner decorations                           */
/* ------------------------------------------------------------------ */

function CategoryBannerDecoration({ category, immersive }: { category: string; immersive: ImmersiveConfig }) {
  // Savanna/grass silhouette for Animals
  if (category === "Animals") {
    return (
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute bottom-0 inset-x-0 h-16"
          style={{
            background: `linear-gradient(to top, ${immersive.accent}15, transparent)`,
            clipPath: "polygon(0 100%, 0 60%, 5% 45%, 10% 55%, 15% 40%, 20% 50%, 25% 35%, 30% 48%, 35% 38%, 40% 52%, 45% 42%, 50% 55%, 55% 40%, 60% 50%, 65% 35%, 70% 48%, 75% 42%, 80% 55%, 85% 38%, 90% 50%, 95% 45%, 100% 55%, 100% 100%)",
          }}
        />
      </div>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Card style helper — returns inline style for a card based on       */
/*  the immersive card style variant                                   */
/* ------------------------------------------------------------------ */

export function getImmersiveCardStyle(immersive: ImmersiveConfig): React.CSSProperties {
  const base: React.CSSProperties = {
    background: immersive.surface,
    color: immersive.text,
    borderColor: `${immersive.accent}30`,
    transition: "all 0.3s ease",
  };

  switch (immersive.cardStyle) {
    case "journal":
      return {
        ...base,
        background: `linear-gradient(135deg, ${immersive.surface}, rgba(180, 160, 120, 0.3))`,
        borderColor: `${immersive.accent}40`,
        borderWidth: "1.5px",
        borderStyle: "solid",
        boxShadow: `2px 3px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        borderRadius: "4px",
        position: "relative",
      };

    case "glass":
      return {
        ...base,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${immersive.accent}25`,
        boxShadow: `0 0 20px ${immersive.accent}08, inset 0 1px 0 ${immersive.accent}10`,
        borderRadius: "16px",
      };

    case "bubble":
      return {
        ...base,
        borderRadius: "24px",
        border: `1.5px solid ${immersive.accent}20`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: `0 4px 24px ${immersive.accent}10, 0 0 0 1px ${immersive.accent}08`,
      };

    case "manuscript":
      return {
        ...base,
        borderRadius: "2px",
        border: `1px solid ${immersive.accent}25`,
        boxShadow: `3px 3px 0 ${immersive.accent}10, -1px -1px 0 ${immersive.accent}05`,
        transform: `rotate(${(Math.random() - 0.5) * 0.4}deg)`,
      };

    case "recipe":
      return {
        ...base,
        borderRadius: "8px",
        borderTop: `4px solid ${immersive.accent}`,
        borderLeft: `1px solid ${immersive.accent}20`,
        borderRight: `1px solid ${immersive.accent}20`,
        borderBottom: `1px solid ${immersive.accent}20`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      };

    case "leaf":
      return {
        ...base,
        borderRadius: "20px 4px 20px 4px",
        border: `1.5px solid ${immersive.accent}30`,
        boxShadow: `0 4px 16px ${immersive.accent}10`,
      };

    case "terminal":
      return {
        ...base,
        borderRadius: "8px",
        border: `1px solid ${immersive.accent}30`,
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: `0 0 12px ${immersive.accent}08, inset 0 0 20px ${immersive.accent}04`,
        position: "relative",
      };

    case "vinyl":
      return {
        ...base,
        borderRadius: "16px",
        border: `2px solid ${immersive.accent}30`,
        boxShadow: `0 0 0 3px ${immersive.accent}08, 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${immersive.accent}10`,
        background: `radial-gradient(circle at 95% 5%, ${immersive.accent}10, transparent 30%), ${immersive.surface}`,
      };

    default:
      return {
        ...base,
        borderRadius: "12px",
        border: `1px solid ${immersive.accent}25`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.1)`,
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Badge style helper                                                  */
/* ------------------------------------------------------------------ */

export function getImmersiveBadgeStyle(immersive: ImmersiveConfig): React.CSSProperties {
  return {
    background: `${immersive.accent}20`,
    color: immersive.accent,
    borderColor: `${immersive.accent}40`,
  };
}
