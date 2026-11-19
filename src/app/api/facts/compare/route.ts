import { NextRequest, NextResponse } from "next/server";
import { getAllFacts, getRandomFact } from "../../../../lib/facts";
import { type Fact } from "../../../../lib/schema";

/* ─── Mutation helpers ─────────────────────────────────────────────────────── */

/** Extract a numeric token from text and return mutated version with a different number */
function mutateNumber(text: string): string | null {
  const patterns = [
    /\b(\d[\d,]*)\s*(million|billion|trillion|thousand|hundred)?\b/gi,
    /\b(\d+\.?\d*)\s*(%|percent|degrees?|km|miles?|meters?|feet|years?|days?|hours?|seconds?|cm|kg|tons?)\b/gi,
  ];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      const original = parseInt(match[1].replace(/,/g, ""), 10);
      if (isNaN(original) || original === 0) continue;

      // Pick a plausible-sounding alternative that's clearly different
      const multipliers = [2, 3, 5, 0.5, 10, 0.25, 4];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      const altered = Math.round(original * mult);
      if (altered === original) continue;

      const altStr = altered.toLocaleString();
      return text.replace(match[0], match[0].replace(match[1].replace(/,/g, ""), altStr));
    }
  }
  return null;
}

const COUNTRY_SWAPS: Record<string, string> = {
  China: "India",
  India: "China",
  Russia: "Canada",
  Canada: "Russia",
  Brazil: "Argentina",
  Argentina: "Brazil",
  Australia: "New Zealand",
  Japan: "South Korea",
  "South Korea": "Japan",
  Germany: "France",
  France: "Germany",
  USA: "Canada",
  "United States": "Canada",
  Egypt: "Libya",
  Mexico: "Colombia",
  Colombia: "Mexico",
  Kenya: "Tanzania",
  Tanzania: "Kenya",
  Nigeria: "Ghana",
  Peru: "Chile",
  Chile: "Peru",
  Iran: "Iraq",
  Iraq: "Iran",
  Ethiopia: "Somalia",
};

function mutateCountry(text: string): string | null {
  for (const [country, swap] of Object.entries(COUNTRY_SWAPS)) {
    const re = new RegExp(`\\b${country}\\b`, "g");
    if (re.test(text)) {
      return text.replace(new RegExp(`\\b${country}\\b`, "g"), swap);
    }
  }
  return null;
}

const ANIMAL_SWAPS: Record<string, string> = {
  octopus: "squid",
  squid: "octopus",
  elephant: "rhinoceros",
  rhinoceros: "elephant",
  shark: "whale",
  whale: "shark",
  cheetah: "lion",
  lion: "cheetah",
  eagle: "hawk",
  hawk: "eagle",
  dolphin: "porpoise",
  giraffe: "camel",
  gorilla: "chimpanzee",
  penguin: "puffin",
  crocodile: "alligator",
  alligator: "crocodile",
  tiger: "leopard",
  leopard: "tiger",
  wombat: "koala",
  koala: "wombat",
};

function mutateAnimal(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [animal, swap] of Object.entries(ANIMAL_SWAPS)) {
    if (lower.includes(animal)) {
      const re = new RegExp(`\\b${animal}\\b`, "gi");
      return text.replace(re, swap);
    }
  }
  return null;
}

/** Generate a plausible-but-false variant of a fact's text */
function generateFalseVariant(fact: Fact): { falseText: string; changeDescription: string } {
  // Try number mutation first (most common)
  const numMutated = mutateNumber(fact.text);
  if (numMutated) {
    return { falseText: numMutated, changeDescription: "a number was changed" };
  }

  // Try country swap
  const countryMutated = mutateCountry(fact.text);
  if (countryMutated) {
    return { falseText: countryMutated, changeDescription: "a country name was swapped" };
  }

  // Try animal swap
  const animalMutated = mutateAnimal(fact.text);
  if (animalMutated) {
    return { falseText: animalMutated, changeDescription: "an animal name was swapped" };
  }

  // Fallback: flip a direction/superlative word
  const directionSwaps: [RegExp, string][] = [
    [/\blongest\b/gi, "shortest"],
    [/\bshortest\b/gi, "longest"],
    [/\blargest\b/gi, "smallest"],
    [/\bsmallest\b/gi, "largest"],
    [/\bheaviest\b/gi, "lightest"],
    [/\blightest\b/gi, "heaviest"],
    [/\boldest\b/gi, "newest"],
    [/\bnewest\b/gi, "oldest"],
    [/\bhighest\b/gi, "lowest"],
    [/\blowest\b/gi, "highest"],
    [/\bhottest\b/gi, "coldest"],
    [/\bcoldest\b/gi, "hottest"],
    [/\bfastest\b/gi, "slowest"],
    [/\bslowest\b/gi, "fastest"],
    [/\bdeepest\b/gi, "shallowest"],
    [/\bfirst\b/gi, "last"],
    [/\blast\b/gi, "first"],
    [/\bnorth\b/gi, "south"],
    [/\bsouth\b/gi, "north"],
    [/\beast\b/gi, "west"],
    [/\bwest\b/gi, "east"],
  ];
  for (const [re, replacement] of directionSwaps) {
    if (re.test(fact.text)) {
      return {
        falseText: fact.text.replace(re, replacement),
        changeDescription: "a directional or superlative term was reversed",
      };
    }
  }

  // Last resort: prepend "NOT" before the first key claim
  return {
    falseText: fact.text.replace(/\.\s*$/, " — but this is a common misconception."),
    changeDescription: "additional misleading context was added",
  };
}

/* ─── Route ────────────────────────────────────────────────────────────────── */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;

  try {
    let factPool: Fact[];
    if (category) {
      const all = getAllFacts();
      factPool = all.filter((f) => f.category === category);
      if (factPool.length < 2) factPool = all;
    } else {
      factPool = getAllFacts();
    }

    if (factPool.length < 2) {
      return NextResponse.json({ error: "Not enough facts" }, { status: 500 });
    }

    // Pick a random real fact
    const shuffled = [...factPool].sort(() => Math.random() - 0.5);
    const realFact = shuffled[0];

    // Generate the false variant
    const { falseText, changeDescription } = generateFalseVariant(realFact);

    // Randomly decide which position is the real fact (0 = left, 1 = right)
    const realPosition = Math.random() < 0.5 ? 0 : 1;

    const statements = realPosition === 0
      ? [realFact.text, falseText]
      : [falseText, realFact.text];

    return NextResponse.json({
      statements,
      realIndex: realPosition,
      realFact: {
        id: realFact.id,
        category: realFact.category,
        text: realFact.text,
        difficulty: realFact.difficulty,
        source: realFact.source,
      },
      changeDescription,
    });
  } catch (err) {
    console.error("Compare API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
