"use client";

/**
 * CosmicStars — Animated floating star particles for the Cosmic theme.
 * Pure CSS animations, no canvas. Only renders when theme-cosmic class is on <html>.
 */

import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: "sm" | "md" | "lg";
  dur: number; // twinkle duration in seconds
  drift: number; // drift duration in seconds
  delay: number; // animation delay
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    const size: Star["size"] = rand < 0.6 ? "sm" : rand < 0.88 ? "md" : "lg";
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      dur: 2 + Math.random() * 5,
      drift: 8 + Math.random() * 14,
      delay: Math.random() * 6,
    });
  }
  return stars;
}

export function CosmicStars() {
  const [visible, setVisible] = useState(false);
  const [stars] = useState(() => generateStars(80));

  useEffect(() => {
    function check() {
      setVisible(document.documentElement.classList.contains("theme-cosmic"));
    }
    check();

    // Observe class changes on <html>
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="cosmic-stars-container" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`cosmic-star cosmic-star-${star.size}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            "--dur": `${star.dur}s`,
            "--drift": `${star.drift}s`,
            "--delay": `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
